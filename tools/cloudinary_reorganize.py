#!/usr/bin/env python3
"""One-off fixed-folder migration. Default: read-only plan. Never deletes/overwrites.

Credentials: CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.
Run: python3 tools/cloudinary_reorganize.py --output /tmp/cloudinary-migration
Then: same command --copy; then --rewrite (only after all copies verify).
Reports and original local files are saved under --output, outside the repository.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import ssl
import time
import urllib.error
import urllib.parse as url
import urllib.request as http

ROOT = Path(__file__).resolve().parents[1]
FOLDERS = {'Typera/': 'Typora/', 'typecho/': 'Wallpapers/'}
URL_RE = re.compile(r'https?://res\.cloudinary\.com/[^\s\x22\x27<>\)]+')


def retry_network(operation):
    for attempt in range(5):
        try:
            return operation()
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 500, 502, 503, 504) or attempt == 4:
                raise
        except (urllib.error.URLError, ssl.SSLError, TimeoutError, ConnectionError):
            if attempt == 4:
                raise
        time.sleep(2 ** attempt)


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temp.replace(path)


def destination(public_id):
    for old, new in FOLDERS.items():
        if public_id.startswith(old):
            return new + public_id[len(old):]


def project_files():
    names = subprocess.check_output(['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], cwd=ROOT).decode().split('\0')
    for name in sorted(set(names)):
        p = ROOT / name
        if not name or name.startswith(('tools/', 'tests/')) or not p.is_file() or p.is_symlink():
            continue
        try:
            text = p.read_bytes().decode('utf-8')
        except UnicodeDecodeError:
            continue
        yield p, text


def local_inventory():
    refs = {}
    for p, text in project_files():
        for link in URL_RE.findall(text):
            refs.setdefault(link, []).append(str(p.relative_to(ROOT)))
    return refs


class Cloudinary:
    def __init__(self):
        config = url.urlparse(os.environ.get('CLOUDINARY_URL', ''))
        self.cloud = config.hostname or os.environ.get('CLOUDINARY_CLOUD_NAME', 'sycamore')
        self.key = url.unquote(config.username or os.environ.get('CLOUDINARY_API_KEY', ''))
        self.secret = url.unquote(config.password or os.environ.get('CLOUDINARY_API_SECRET', ''))
        if self.cloud != 'sycamore' or not self.key or not self.secret:
            raise ValueError('Configure Cloudinary credentials for cloud sycamore locally; do not paste secrets into chat.')
        self.base = 'https://api.cloudinary.com/v1_1/sycamore/'

    def request(self, route, query=None, post=None):
        target = self.base + route
        headers = {}
        data = None
        if post is None:
            target += '?' + url.urlencode(query or {})
            headers['Authorization'] = 'Basic ' + base64.b64encode(f'{self.key}:{self.secret}'.encode()).decode()
        else:
            params = {**post, 'timestamp': str(int(time.time()))}
            signed = '&'.join(f'{k}={v}' for k, v in sorted(params.items()) if k != 'file')
            params['signature'] = hashlib.sha1((signed + self.secret).encode()).hexdigest()
            params['api_key'] = self.key
            data = url.urlencode(params).encode()
        try:
            def send():
                with http.urlopen(http.Request(target, data=data, headers=headers), timeout=90) as response:
                    return json.load(response)
            return retry_network(send)
        except urllib.error.HTTPError as exc:
            # Never include request headers or credentials in errors/reports.
            raise RuntimeError(f'Cloudinary HTTP {exc.code} at {route.split("/")[0]}') from None

    def inventory(self):
        assets = []
        for kind in ('image', 'video', 'raw'):
            query = {'max_results': 500, 'tags': 'true', 'context': 'true', 'metadata': 'true'}
            while True:
                page = self.request(f'resources/{kind}/upload', query)
                assets.extend(page['resources'])
                if not page.get('next_cursor'):
                    break
                query['next_cursor'] = page['next_cursor']
        return assets


def digest(link):
    parsed = url.urlparse(link)
    if parsed.scheme != 'https' or parsed.hostname != 'res.cloudinary.com' or not parsed.path.startswith('/sycamore/'):
        raise ValueError('Refusing unexpected delivery URL')
    def download():
        h = hashlib.sha256()
        with http.urlopen(link, timeout=90) as response:
            while chunk := response.read(1024 * 1024):
                h.update(chunk)
        return h.hexdigest()
    return retry_network(download)


def build_plan(assets):
    existing = {(a['resource_type'], a['public_id']): a for a in assets}
    plan = []
    for a in assets:
        target = destination(a['public_id'])
        if not target:
            continue
        if a.get('access_control') or a.get('metadata'):
            raise ValueError('Source has access controls or structured metadata; review before copying: ' + a['public_id'])
        plan.append({'source': a, 'target_id': target,
                     'existing': existing.get((a['resource_type'], target))})
    return plan


def copy_assets(api, plan, output):
    result_path = output / 'verified.json'
    verified = json.loads(result_path.read_text()) if result_path.exists() else {}
    def copy_one(item):
        source, target_id = item['source'], item['target_id']
        identity = source['resource_type'] + ':' + source['public_id']
        previous = verified.get(identity)
        if previous and item['existing'] and previous['source']['version'] == source['version'] and previous['target']['version'] == item['existing']['version']:
            return identity, previous
        target = item['existing'] or verified.get(identity, {}).get('target')
        original_hash = digest(source['secure_url'])
        if target is None:
            params = {'file': source['secure_url'], 'public_id': target_id, 'overwrite': 'false'}
            if source.get('tags'):
                params['tags'] = ','.join(source['tags'])
            custom = source.get('context', {}).get('custom', {})
            if custom:
                escape = lambda s: str(s).replace('\\', '\\\\').replace('=', '\\=').replace('|', '\\|')
                params['context'] = '|'.join(escape(k) + '=' + escape(v) for k, v in custom.items())
            target = api.request(source['resource_type'] + '/upload', post=params)
        if target.get('public_id') != target_id or target.get('resource_type') != source['resource_type']:
            raise ValueError('Unexpected upload destination; stop without rewriting local links')
        if digest(target['secure_url']) != original_hash:
            raise ValueError('Content mismatch or name collision: ' + target_id)
        return identity, {'source': source, 'target': target, 'sha256': original_hash}

    with ThreadPoolExecutor(max_workers=4) as pool:
        for i, (identity, record) in enumerate(pool.map(copy_one, plan), 1):
            verified[identity] = record
            save(result_path, verified)
            print(f'Verified {i}/{len(plan)}: {record["target"]["public_id"]}', flush=True)
    return verified


def link_mapping(refs, verified):
    mapping = {}
    for link in refs:
        parsed = url.urlparse(link)
        match = re.fullmatch(r'/sycamore/(image|video|raw)/upload/(?:v\d+/)?(.+)', parsed.path)
        if not match:
            if '/Typera/' in link or '/typecho/' in link:
                raise ValueError('Nonstandard source link requires review: ' + link)
            continue
        kind, path = match.groups()
        public_id = url.unquote(path) if kind == 'raw' else url.unquote(path).rsplit('.', 1)[0]
        if destination(public_id):
            record = verified.get(kind + ':' + public_id)
            if not record:
                raise ValueError('Referenced source has no verified copy: ' + link)
            mapping[link] = record['target']['secure_url'] + ('?' + parsed.query if parsed.query else '') + ('#' + parsed.fragment if parsed.fragment else '')
    return mapping


def rewrite_files(mapping, output):
    pending = []
    for p, text in project_files():
        changed = URL_RE.sub(lambda m: mapping.get(m[0], m[0]), text)
        if changed != text:
            pending.append((p, text, changed, p.stat()))
    # Save ALL originals before touching any project file. Keep exact bytes/newlines.
    backup = output / ('local-backup-' + str(time.time_ns()))
    times = {}
    for p, before, after, stat in pending:
        relative = p.relative_to(ROOT)
        dest = backup / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(before.encode())
        times[str(relative)] = {'atime_ns': stat.st_atime_ns, 'mtime_ns': stat.st_mtime_ns}
    save(backup / 'timestamps.json', times)
    for p, before, after, stat in pending:
        if p.read_bytes() != before.encode():
            raise ValueError('File changed during migration: ' + str(p))
        try:
            p.write_bytes(after.encode())
        finally:
            os.utime(p, ns=(stat.st_atime_ns, stat.st_mtime_ns))
        assert p.stat().st_mtime_ns == stat.st_mtime_ns
    save(output / 'link-mapping.json', mapping)
    print(f'Rewrote {len(pending)} files, preserving file mtimes. Backup: {backup}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=Path('/tmp/cloudinary-migration'))
    parser.add_argument('--local-only', action='store_true')
    parser.add_argument('--copy', action='store_true')
    parser.add_argument('--rewrite', action='store_true')
    args = parser.parse_args()
    output = args.output.resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError('Keep migration reports/backups outside the repository')
    refs = local_inventory()
    save(output / 'local-references.json', refs)
    print(f'Inventoried {len(refs)} distinct project Cloudinary links.')
    if args.local_only:
        return
    api = Cloudinary()
    assets = api.inventory()
    save(output / 'inventory.json', assets)
    save(output / 'usage.json', api.request('usage'))
    plan = build_plan(assets)
    save(output / 'plan.json', plan)
    print(f'Plan: {len(plan)} assets; at most {sum(x["source"].get("bytes", 0) for x in plan)/1024**2:.2f} MiB extra original storage.')
    if not args.copy and not args.rewrite:
        return
    verified = copy_assets(api, plan, output) if args.copy else json.loads((output / 'verified.json').read_text())
    if args.rewrite:
        for item in plan:
            source = item['source']
            record = verified.get(source['resource_type'] + ':' + source['public_id'])
            if not record or not record.get('sha256') or not item['existing']:
                raise ValueError('Incomplete or stale verification; run --copy first')
            for saved, current in ((record['source'], source), (record['target'], item['existing'])):
                if any(saved.get(key) != current.get(key) for key in ('asset_id', 'version', 'bytes', 'secure_url')):
                    raise ValueError('Asset changed since byte verification; run --copy first')
        rewrite_files(link_mapping(refs, verified), output)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, RuntimeError, OSError) as exc:
        raise SystemExit(str(exc))
