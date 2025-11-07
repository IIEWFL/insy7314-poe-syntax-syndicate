const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>Customer Portal Backend</h1>
    <p>Server is running on port 5000</p>
    <p>Time: ${new Date().toISOString()}</p>
  `);
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Simple HTTP server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
