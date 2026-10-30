import fs from 'node:fs';
import path from 'node:path';
// Source page identifiers stay stable after removing the old introduction.
export function runtimeAssets(root=process.cwd()) {
 const files=new Set(['assets/book/pages/page-01.jpg','assets/images/ui/appLogoIcon.png']);
 function walk(value) {
  if(typeof value==='string'&&value.startsWith('assets/'))files.add(value);
  else if(Array.isArray(value))value.forEach(walk);
  else if(value&&typeof value==='object')Object.values(value).forEach(walk);
 }
 walk(JSON.parse(fs.readFileSync(path.join(root,'data/pages_metadata.json'),'utf8')).slice(5));
 function source(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())source(file);else if(/\.(jsx?|css)$/.test(file)){for(const match of fs.readFileSync(file,'utf8').matchAll(/assets\/[^'"`\s){}]+\.(?:mp3|mp4|jpg|png|svg)/g))files.add(match[0]);}}}
 source(path.join(root,'src'));
 return [...files].sort().map(local_path=>({local_path,size_bytes:fs.statSync(path.join(root,local_path)).size}));
}
