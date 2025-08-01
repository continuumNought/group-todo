const { createProxyServer } = require('http-proxy');
const { createServer } = require('http');
const { spawn } = require('child_process');
const path = require('path');

const parcelPort = 1234;
const proxyPort = 3000;

// start Parcel dev server
const parcel = spawn('npx', ['parcel', 'serve', 'index.html', '--port', parcelPort], {
  cwd: __dirname,
  stdio: 'inherit'
});

const proxy = createProxyServer();

const server = createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    proxy.web(req, res, { target: 'http://localhost:8000' });
  } else {
    proxy.web(req, res, { target: `http://localhost:${parcelPort}` });
  }
});

server.listen(proxyPort, () => {
  console.log(`Proxy server running at http://localhost:${proxyPort}`);
});

['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    parcel.kill(signal);
    server.close(() => process.exit());
  });
});
