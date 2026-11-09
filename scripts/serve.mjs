// Strict local static server for production-output tests. No SPA fallback.
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const base=process.env.BASE_PATH||'/';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1');
    if(!url.pathname.startsWith(base)){res.writeHead(404).end();return;}
    const relative=decodeURIComponent(url.pathname.slice(base.length))||'index.html';
    const file=path.resolve(root,relative);
    if(!file.startsWith(root+path.sep)||!(await stat(file)).isFile()){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(await readFile(file));
  }catch{res.writeHead(404).end();}
});
server.listen(4178,'127.0.0.1',()=>console.log(`官网生产预览：http://127.0.0.1:4178${base}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
