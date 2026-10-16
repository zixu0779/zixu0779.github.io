import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import os

spec = importlib.util.spec_from_file_location('migration', Path(__file__).parents[1] / 'tools/cloudinary_reorganize.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class MigrationTest(unittest.TestCase):
    def test_scope_and_missing_copy(self):
        self.assertEqual(m.destination('Typera/2023/04/a'), 'Typora/2023/04/a')
        self.assertEqual(m.destination('typecho/webp/a'), 'Wallpapers/webp/a')
        self.assertIsNone(m.destination('Gallery/a'))
        self.assertIsNone(m.destination('Typora/2025/a'))
        with self.assertRaises(ValueError):
            m.link_mapping({'https://res.cloudinary.com/sycamore/image/upload/v1/Typera/2023/a.png': []}, {})

    def test_rewrite_preserves_bytes_dates_and_mtime(self):
        old = 'https://res.cloudinary.com/sycamore/image/upload/v1/Typera/2023/a.png'
        new = 'https://res.cloudinary.com/sycamore/image/upload/v2/Typora/2023/a.png'
        verified = {'image:Typera/2023/a': {'target': {'secure_url': new}}}
        mapping = m.link_mapping({old: []}, verified)
        with tempfile.TemporaryDirectory() as root, tempfile.TemporaryDirectory() as output:
            p = Path(root) / 'post.md'
            original = ('---\r\nupdated: 2023-01-02 03:04:05\r\n---\r\n![图](' + old + ')\r\n').encode()
            p.write_bytes(original)
            stamp = 1672628645123456789
            os.utime(p, ns=(stamp, stamp))
            with patch.object(m, 'ROOT', Path(root)), patch.object(m, 'project_files', return_value=iter([(p, original.decode())])):
                m.rewrite_files(mapping, Path(output))
            self.assertEqual(p.read_bytes(), original.replace(old.encode(), new.encode()))
            self.assertEqual(p.stat().st_mtime_ns, stamp)
            backups = list(Path(output).glob('local-backup-*/post.md'))
            self.assertEqual(backups[0].read_bytes(), original)


if __name__ == '__main__':
    unittest.main()
