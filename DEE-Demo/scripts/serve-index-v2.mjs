#!/usr/bin/env node

import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const directory = path.resolve(path.join(__dirname, '..', args[0] || 'local-test'));

let portArg = args[1];
let defaultFileArg;

if (portArg && Number.isNaN(Number(portArg))) {
  defaultFileArg = portArg;
  portArg = undefined;
} else {
  defaultFileArg = args[2];
}

const port = Number(portArg || process.env.PORT || 8000);
const defaultFile = defaultFileArg || 'index.html';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function fileExists(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    let relativePath = urlPath === '/' ? defaultFile : urlPath.slice(1);
    const filePath = path.join(directory, relativePath);

    if (!(await fileExists(filePath))) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const data = await fs.readFile(filePath);

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Serving ${path.relative(path.join(__dirname, '..'), directory)} on http://localhost:${port}/${defaultFile}`);
});
