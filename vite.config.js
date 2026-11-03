import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { runtimeAssets } from './scripts/runtime-assets.mjs';

const workspace = process.cwd();
const mime = { '.mp3':'audio/mpeg','.mp4':'video/mp4','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.json':'application/json','.svg':'image/svg+xml' };
export function rangeFor(header, size) {
  const match=/^bytes=(\d*)-(\d*)$/.exec(header || '');
  if(!match || (!match[1]&&!match[2]))return null;
  let start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
  let end=match[1]?(match[2]?Math.min(Number(match[2]),size-1):size-1):size-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||end<start||start>=size)return null;
  return {start,end};
}
function workspaceAssets() {
  let outDir;
  return {
    name:'workspace-learning-assets',
    configResolved(config){outDir=path.resolve(config.root,config.build.outDir);},
    configureServer(server){
      const serve=(req,res,next)=>{
        let url;
        try{url=decodeURIComponent(req.url.split('?')[0]);}catch{return next();}
        const folder=url.startsWith('/assets/')?'assets':url.startsWith('/data/')?'data':null;
        if(!folder)return next();
        const base=path.resolve(workspace,folder);
        const file=path.resolve(workspace,'.'+url);
        if(!file.startsWith(base+path.sep))return next();
        let stat;try{stat=fs.statSync(file);}catch{return next();}
        if(!stat.isFile())return next();
        res.setHeader('Content-Type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');
        res.setHeader('Accept-Ranges','bytes');
        const range=req.headers.range?rangeFor(req.headers.range,stat.size):null;
        if(req.headers.range&&!range){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
        const length=range?range.end-range.start+1:stat.size;
        res.setHeader('Content-Length',length);
        if(range)res.writeHead(206,{'Content-Range':`bytes ${range.start}-${range.end}/${stat.size}`});
        if(req.method==='HEAD')return res.end();
        const stream=fs.createReadStream(file,range||{});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
      };
      server.middlewares.use(serve);
    },
    configurePreviewServer(server){
      server.middlewares.use((req,res,next)=>{
        let url;
        try{url=decodeURIComponent(req.url.split('?')[0]);}catch{return next();}
        const folder=url.startsWith('/assets/')?'assets':url.startsWith('/data/')?'data':null;
        if(!folder)return next();
        const base=path.resolve(workspace,folder);
        const file=path.resolve(workspace,'.'+url);
        if(!file.startsWith(base+path.sep))return next();
        let stat;try{stat=fs.statSync(file);}catch{return next();}
        if(!stat.isFile())return next();
        res.setHeader('Content-Type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');
        res.setHeader('Accept-Ranges','bytes');
        const range=req.headers.range?rangeFor(req.headers.range,stat.size):null;
        if(req.headers.range&&!range){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
        const length=range?range.end-range.start+1:stat.size;
        res.setHeader('Content-Length',length);
        if(range)res.writeHead(206,{'Content-Range':`bytes ${range.start}-${range.end}/${stat.size}`});
        if(req.method==='HEAD')return res.end();
        const stream=fs.createReadStream(file,range||{});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
      });
    },
    closeBundle(){
      for(const {local_path} of runtimeAssets(workspace)){const target=path.join(outDir,local_path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(workspace,local_path),target);}
      fs.mkdirSync(path.join(outDir,'data'),{recursive:true});
      fs.copyFileSync(path.join(workspace,'data/pages_metadata.json'),path.join(outDir,'data/pages_metadata.json'));
      fs.writeFileSync(path.join(outDir,'.nojekyll'),'');
    },
  };
}
export default defineConfig({
  base:process.env.VITE_BASE_PATH || '/',
  plugins:[react(),workspaceAssets()],
  resolve:{alias:{'@':path.resolve(workspace,'src')}},
  server:{port:3000,host:'127.0.0.1',open:false},
  preview:{port:3000,host:'127.0.0.1',open:false},
});
