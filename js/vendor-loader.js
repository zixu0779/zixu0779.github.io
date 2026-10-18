(() => {
  const assets = JSON.parse(document.currentScript.dataset.assets);
  const pending = new Map();
  // Fetch verifies SRI before any bytes execute. Abort cancels a slow CDN request,
  // avoiding the double execution possible when a timed-out script tag is removed.
  window.blogLoadVendor = (url) => {
    if (pending.has(url)) return pending.get(url);
    const asset = assets[url];
    if (!asset || asset.kind === 'sandbox') return Promise.reject(new Error('Unregistered vendor: ' + url));
    const fetchVerified = async source => {
      const response = await fetch(source, { integrity: asset.integrity, credentials: 'omit', signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error('Vendor HTTP ' + response.status);
      return response.text();
    };
    const loading = fetchVerified(url).catch(() => fetchVerified(asset.local)).then(code => {
      const element = document.createElement(asset.kind === 'css' ? 'style' : 'script');
      element.dataset.vendor = url;
      element.textContent = code;
      document.head.append(element);
    }).catch(error => { pending.delete(url); throw error; });
    pending.set(url, loading);
    return loading;
  };
  window.blogVendorReady = Promise.resolve();
})();
