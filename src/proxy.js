const ProxyList = require('free-proxy');

async function getProxyUrl() {
  const proxyList = new ProxyList();

  try {
    const proxies = await Promise.race([
      new Promise((resolve, reject) => setTimeout(reject, 5000)), // Proxy timeout
      proxyList.get()
    ]);

    if (!proxies.length) {
      return null; // No proxies found
    }

    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    return `http://${randomProxy.ip}:${randomProxy.port}`;
  } catch (error) {
    console.error('Error fetching proxies:', error);
    return null; // Handle errors by returning null
  }
}
exports.getProxyUrl = getProxyUrl;