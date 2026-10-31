import fs from 'node:fs';
import { runtimeAssets } from './runtime-assets.mjs';
import assert from 'node:assert/strict';

const inventory={files:runtimeAssets()};
for(const file of inventory.files){assert.ok(fs.existsSync('dist/'+file.local_path),`Not packaged: ${file.local_path}`);assert.equal(fs.statSync('dist/'+file.local_path).size,file.size_bytes);}
assert.equal(JSON.parse(fs.readFileSync('dist/data/pages_metadata.json','utf8')).length,74);
for(const name of ['page-flip.browser.js','LICENSE']){
  const file=`vendor/page-flip/${name}`;
  assert.ok(fs.existsSync('dist/'+file),`Page curl renderer not packaged: ${file}`);
  assert.deepEqual(fs.readFileSync('dist/'+file),fs.readFileSync('public/'+file),`Page curl renderer differs: ${file}`);
}
assert.ok(!fs.existsSync('dist/assets/flash'),'Legacy Flash must not be deployed');
assert.ok(!fs.existsSync('dist/data/original_config'),'Original development files must not be deployed');
console.log(`Standalone package OK: ${inventory.files.length} required media files; 69 reader pages (source IDs 6–74).`);
const origin=process.argv[2];
if(origin){
  for(const route of ['/','/yetiskin/alfabe/tanima','/cocuk','/yetiskin/alfabe/pratik','/e-kitap/sayfa/18']){
    const res=await fetch(origin+route);assert.equal(res.status,200,route);assert.match(res.headers.get('content-type'),/text\/html/);assert.match(await res.text(),/id="root"/);
  }
  const data=await fetch(origin+'/data/pages_metadata.json');assert.match(data.headers.get('content-type'),/json/);assert.equal((await data.json()).length,74);
  for(const [url,mime] of [['/assets/book/pages/page-18.jpg','image/jpeg'],['/assets/audio/arabic/arp02_1.mp3','audio/mpeg']]){
    const res=await fetch(origin+url);assert.equal(res.status,200,url);assert.ok(res.headers.get('content-type').startsWith(mime));assert.equal((await res.arrayBuffer()).byteLength,fs.statSync('dist'+url).size);
  }
  const video=await fetch(origin+'/assets/videos/fatiha2.mp4',{headers:{Range:'bytes=0-1023'}});
  if(video.status!==206){await video.body?.cancel();throw Error(`Video range response: ${video.status}`);}
  assert.match(video.headers.get('content-range'),/^bytes 0-1023\//);assert.equal((await video.arrayBuffer()).byteLength,1024);
  console.log('HTTP OK: deep links, JSON, book image, MP3 and MP4 byte-range streaming.');
}
