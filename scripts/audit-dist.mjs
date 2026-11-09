import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const files=[];
async function walk(folder){for(const name of await readdir(folder)){const p=path.join(folder,name);if((await stat(p)).isDirectory())await walk(p);else files.push(p);}}
await walk(root);
const forbiddenFile=/\.(?:java|jar|class|sql|db|pem|key|map|ts|vue|zip|ps1|py)$/i;
const forbiddenText=[/jdbc:(?:mysql|h2|oracle|postgresql)/i,/-----BEGIN .*PRIVATE KEY-----/,/gh[pousr]_[A-Za-z0-9]{20,}/,/AKIA[A-Z0-9]{16}/,/C:[\\/](?:Users|Jsong)[\\/]/i,/report-(?:core|server)[\\/]src/,/REPORT_E2E_ADMIN_PASSWORD/];
for(const file of files){if(forbiddenFile.test(file))throw Error(`禁止发布的文件：${path.relative(root,file)}`);if(/\.(?:html|json|js|css|txt|svg|xml)$/.test(file)){const text=await readFile(file,'utf8');for(const pattern of forbiddenText)if(pattern.test(text))throw Error(`发现私有内容模式：${path.relative(root,file)}`);}}
for(const name of ['index.html','contact.json','.nojekyll','assets/designer.webp','assets/binding.webp','assets/dashboard.webp','assets/fill.webp'])if(!files.includes(path.join(root,name)))throw Error(`缺少产物 ${name}`);
const total=(await Promise.all(files.map(f=>stat(f)))).reduce((sum,s)=>sum+s.size,0);
console.log(`静态产物检查通过：${files.length} 个文件，${(total/1024/1024).toFixed(2)} MiB；未发现源码映射、后端代码、数据库或常见密钥模式。图片另按截图来源与视觉审阅核查。`);
