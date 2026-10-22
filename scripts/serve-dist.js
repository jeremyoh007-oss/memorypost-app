// Static server with SPA fallback for the web export. Usage: node scripts/serve-dist.js <abs dist dir> [port]
const http=require('http'),fs=require('fs'),path=require('path');
const root=process.argv[2],port=+process.argv[3]||8081;
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.json':'application/json','.ico':'image/x-icon'};
http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);let f=path.join(root,p);
 if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(root,'index.html');
 res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)}).listen(port,()=>console.log('listening',port));
