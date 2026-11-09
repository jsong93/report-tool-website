import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const configured=JSON.parse(readFileSync(new URL('../public/contact.json',import.meta.url),'utf8'));

test('微信二维码保留原图、可放大且失败时明确提示',async({page,context,baseURL},info)=>{
  await page.goto('./');
  if(!configured.qrImage){await expect(page.getByText('微信二维码待配置',{exact:true})).toBeVisible();return;}
  const image=page.getByAltText('微信联系二维码');await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
  await expect(page.getByText('微信二维码待配置',{exact:true})).toHaveCount(0);
  const imageUrl=new URL(configured.qrImage,baseURL!).href;
  const response=await page.request.get(imageUrl);expect(response.status()).toBe(200);
  expect(await response.body()).toEqual(readFileSync(new URL(`../public/${configured.qrImage}`,import.meta.url)));
  const link=page.getByRole('link',{name:'放大微信二维码（新窗口）',exact:true});
  await expect(link).toHaveAttribute('href',new URL(imageUrl).pathname);
  await expect(link).toHaveAttribute('rel','noopener noreferrer');
  await page.locator('#contact').screenshot({path:info.outputPath('contact-qr.png'),animations:'disabled'});
  const opened=context.waitForEvent('page');await link.click();const original=await opened;
  await expect(original).toHaveURL(imageUrl);await expect.poll(()=>original.locator('img').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);await original.close();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.route(imageUrl,route=>route.fulfill({status:404,body:'missing'}));await page.reload();await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.getByText('二维码暂不可用',{exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'放大微信二维码（新窗口）',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'复制微信号',exact:true})).toBeEnabled();
});

test('页面、真实图片、导航与静态资源完整',async({page,baseURL},info)=>{
  const errors:string[]=[];const requests:string[]=[];const failed:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
  await page.goto('./');await expect(page).toHaveTitle('Report Tool — 企业级网页报表设计与嵌入式报表工具');
  await expect(page.getByRole('heading',{level:1})).toContainText('企业级网页报表设计');
  await expect(page.locator('.wechat-value')).toHaveText(configured.wechat||'微信号待配置');
  if(configured.email)await expect(page.getByRole('link',{name:configured.email})).toHaveAttribute('href',`mailto:${configured.email}?subject=${encodeURIComponent('Report Tool 产品咨询')}`);
  else await expect(page.getByText('邮箱待配置',{exact:true})).toBeVisible();
  if(configured.qrImage){const qr=page.getByAltText('微信联系二维码');await qr.scrollIntoViewIfNeeded();await expect.poll(()=>qr.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);}
  else await expect(page.getByText('微信二维码待配置',{exact:true})).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',/assets\/designer.webp$/);
  await page.getByRole('link',{name:'查看产品功能',exact:true}).click();await expect(page).toHaveURL(/#features$/);
  for(const section of ['features','gallery','scenarios','services','contact']){await page.locator(`#${section}`).scrollIntoViewIfNeeded();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  for(const img of await page.locator('.gallery-card img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);}
  await expect(page.locator('.gallery-card')).toHaveCount(8);
  await page.getByText('官网和报表产品怎样部署？',{exact:true}).click();await expect(page.locator('details[open]')).toContainText('本官网为静态展示网站');
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('homepage.png'),fullPage:true,animations:'disabled'});
  expect(errors).toEqual([]);expect(failed).toEqual([]);
  const prefix=new URL(baseURL!).pathname;
  expect(requests.every(url=>url.startsWith(`http://127.0.0.1:4178${prefix}`))).toBe(true);
  expect(requests.some(url=>/\/api\//.test(url))).toBe(false);
});

test('六项功能可切换并展示对应真实截图',async({page})=>{
  await page.goto('./');
  const labels=['可视化设计','数据连接','查询与发布','图表大屏','数据填报','导出与打印'];
  const filenames=['designer','binding','preview','dashboard','fill','export'];
  for(const [i,label]of labels.entries()){await page.getByRole('tab',{name:label,exact:true}).click();await expect(page.getByRole('tab',{name:label,exact:true})).toHaveAttribute('aria-selected','true');await expect(page.locator('#feature-panel img')).toHaveAttribute('src',new RegExp(`${filenames[i]}\\.webp$`));await expect.poll(()=>page.locator('#feature-panel img').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);}
  await page.getByRole('tab',{name:'导出与打印',exact:true}).focus();await page.keyboard.press('Home');await expect(page.getByRole('tab',{name:'可视化设计',exact:true})).toBeFocused();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'数据连接',exact:true})).toBeFocused();
});

test('大图前后切换、首尾循环、键盘关闭与焦点恢复',async({page})=>{
  await page.goto('./');const trigger=page.getByRole('button',{name:'查看报表设计器大图',exact:true});await trigger.click();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByRole('heading')).toHaveText('报表设计器');
  await dialog.getByRole('button',{name:'上一张截图',exact:true}).click();await expect(dialog.getByRole('heading')).toHaveText('导出与打印入口');
  await dialog.getByRole('button',{name:'下一张截图',exact:true}).click();await page.keyboard.press('ArrowRight');await expect(dialog.getByRole('heading')).toHaveText('单元格与公式');
  for(let i=0;i<8;i++){await dialog.getByRole('button',{name:'下一张截图',exact:true}).click();await expect.poll(()=>dialog.locator('img').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);}
  for(let i=0;i<7;i++)await page.keyboard.press('Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
});

test('微信复制、失败提示与联系方式配置分支',async({page,context})=>{
  await page.route('**/contact.json',route=>route.fulfill({json:{wechat:'website-demo-123',email:'',qrImage:'',other:{}}}));
  await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('./');
  const copy=page.getByRole('button',{name:'复制微信号',exact:true});await copy.click();await expect(page.getByText('微信号已复制，可前往微信添加好友。',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('website-demo-123');
  await page.evaluate(()=>{Object.defineProperty(navigator.clipboard,'writeText',{value:()=>Promise.reject(new Error('denied')),configurable:true});});await copy.click();await expect(page.getByText('未能自动复制，请长按或选中上方微信号手动复制。',{exact:true})).toBeVisible();
  await page.route('**/contact.json',route=>route.fulfill({json:{wechat:'',email:'',qrImage:'',other:{}}}));await page.reload();await expect(page.getByRole('button',{name:'待配置',exact:true})).toBeDisabled();await expect(page.getByText('微信号待配置',{exact:true})).toBeVisible();await expect(page.getByText('邮箱待配置',{exact:true})).toBeVisible();
  await page.unroute('**/contact.json');await page.route('**/contact.json',route=>route.fulfill({json:{wechat:'示例号',email:'sample@example.test',qrImage:'assets/qr-test.png',other:{label:'预约说明',value:'查看说明',url:'https://example.test/info'}}}));
  await page.route('**/assets/qr-test.png',route=>route.fulfill({path:'public/assets/designer-thumb.webp',contentType:'image/webp'}));await page.reload();await expect(page.getByAltText('微信联系二维码')).toBeVisible();await expect(page.getByRole('link',{name:'查看说明',exact:true})).toHaveAttribute('rel','noopener noreferrer');
});

test('联系方式加载失败与不安全链接明确处理',async({page})=>{
  await page.route('**/contact.json',route=>route.fulfill({status:404,body:'missing'}));await page.goto('./');await expect(page.getByText('联系方式暂时无法加载，请刷新页面重试。',{exact:true})).toBeVisible();
  await page.unroute('**/contact.json');await page.route('**/contact.json',route=>route.fulfill({json:{wechat:'',email:'bad\nmail',qrImage:'https://untrusted.test/image.png',other:{label:'其他',value:'测试内容',url:'javascript:alert(1)'}}}));await page.reload();await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);await expect(page.getByAltText('微信联系二维码')).toHaveCount(0);
});

test('窄屏导航、触控浏览与减少动画设置',async({page,context},info)=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
  if(info.project.name==='mobile'){await page.getByRole('button',{name:'展开导航',exact:true}).click();await expect(page.getByRole('button',{name:'收起导航',exact:true})).toHaveAttribute('aria-expanded','true');await page.getByRole('navigation',{name:'移动端导航',exact:true}).getByRole('link',{name:'联系咨询',exact:true}).click();await expect(page.getByRole('navigation',{name:'移动端导航',exact:true})).toHaveCount(0);await expect(page).toHaveURL(/#contact$/);}
  await page.getByRole('button',{name:'放大报表设计器截图',exact:true}).first().click();
  const bounds=(await page.locator('.lightbox-image').boundingBox())!;
  const cdp=await context.newCDPSession(page);const start={x:bounds.x+bounds.width*.75,y:bounds.y+bounds.height/2};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x-110,y:start.y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
  await expect(page.locator('#lightbox-title')).toHaveText('单元格与公式');await page.getByRole('button',{name:'关闭大图',exact:true}).click();
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  for(const width of [320,375,768,1024]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
});
