import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
function run(command,args,env=process.env){
 const result=spawnSync(command,args,{env,encoding:'utf8',maxBuffer:4*1024*1024});
 if(result.status!==0)throw Error(result.stderr||result.stdout||result.error?.message||`${command} failed`);
 return result.stdout.trim();
}
const root=process.cwd();
if(run('git',['status','--porcelain']))throw Error('Commit source changes before publishing.');
console.log('Checking source and building GitHub Pages package…');
run(process.execPath,['--test',...fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f)]);
run(process.execPath,['scripts/validate-content.mjs']);
run(process.execPath,['node_modules/vite/bin/vite.js','build'],{...process.env,VITE_BASE_PATH:'/elifba/'});
console.log(run(process.execPath,['scripts/verify-dist.mjs']));
const index=path.resolve(run('git',['rev-parse','--git-dir']),'pages-publish-index');
if(fs.existsSync(index))throw Error('A previous Pages publishing index exists. Check that no publish process is running.');
const env={...process.env,GIT_INDEX_FILE:index};
try{
 run('git',['read-tree','--empty'],env);
 run('git',['--work-tree='+path.join(root,'dist'),'add','--all','.'],env);
 const tree=run('git',['write-tree'],env);
 const prior=spawnSync('git',['rev-parse','--verify','refs/heads/gh-pages'],{encoding:'utf8'});
 const parents=prior.status===0?['-p',prior.stdout.trim()]:[];
 const commit=run('git',['commit-tree',tree,...parents,'-m','Publish Elif-Ba site']);
 run('git',['update-ref','refs/heads/gh-pages',commit]);
}finally{if(fs.existsSync(index))fs.unlinkSync(index);}
console.log('Uploading source and complete site media…');
console.log(run('git',['push','--atomic','-u','origin','main','gh-pages']));
console.log('Published branch prepared: https://hakansirints.github.io/elifba/');
