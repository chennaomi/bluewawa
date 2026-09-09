import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const port = Number(process.env.PORT || 4174);
http.createServer(async (request,response)=>{
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const target = path.resolve(root,`.${pathname}`);
    if ((target!==root && !target.startsWith(root+path.sep)) || pathname.split('/').some(part=>part.startsWith('.'))) {
      response.writeHead(403); response.end('Forbidden'); return;
    }
    const file = (await fs.stat(target)).isDirectory() ? path.join(target,'index.html') : target;
    const content = await fs.readFile(file);
    response.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    response.end(content);
  } catch {
    response.writeHead(404,{'Content-Type':'text/plain'}); response.end('Not found');
  }
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}/insights/`));
