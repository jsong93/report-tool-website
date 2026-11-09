// This allowlist deliberately excludes the parent repository and its Git history.
import {cp,mkdir,readFile,readdir,writeFile,lstat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'release',`public-repo-${new Date().toISOString().replace(/[:.]/g,'-')}`);
const allow=['.github','.gitignore','index.html','package.json','package-lock.json','tsconfig.json','vite.config.ts','playwright.config.ts','src','public','scripts','tests','README.md','SCREENSHOTS.md'];
const manifest=[];
async function check(file,relative){const s=await lstat(file);if(s.isSymbolicLink())throw Error(`不能包含符号链接：${relative}`);if(s.isDirectory()){for(const name of await readdir(file))await check(path.join(file,name),`${relative}/${name}`);}else{if(/\.(?:jar|java|class|db|sql|pem|key|zip|log|map)$/i.test(relative)||/(?:^|\/)\.env/.test(relative))throw Error(`禁止公开：${relative}`);manifest.push({path:relative,bytes:s.size,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});}}
for(const name of allow)await check(path.join(root,name),name);
await mkdir(target,{recursive:true});
for(const name of allow)await cp(path.join(root,name),path.join(target,name),{recursive:true,errorOnExist:true,force:false});
await writeFile(path.join(target,'PUBLIC-FILES.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`独立官网发布目录：${target}\n${manifest.length} 个白名单文件；不含产品源码、Git 历史、原始验收日志、运行数据或依赖目录。`);
