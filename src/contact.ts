export interface Contact {wechat:string;email:string;qrImage:string;other:{label:string;value:string;url:string}}
export const emptyContact:Contact={wechat:'',email:'',qrImage:'',other:{label:'其他联系方式',value:'',url:''}};
export function parseContact(value:unknown):Contact {
  if (!value || typeof value !== 'object') throw Error('联系方式配置无效');
  const v=value as Record<string,unknown>;
  const text=(x:unknown,max=150)=>typeof x==='string'&&x.length<=max?x.trim():'';
  const wechat=text(v.wechat,80), email=text(v.email);
  const rawQr=text(v.qrImage,180);
  const qrImage=/^assets\/[a-zA-Z0-9_-]+\.(?:png|webp|jpe?g)$/.test(rawQr)?rawQr:'';
  const other=v.other && typeof v.other==='object'?v.other as Record<string,unknown>:{};
  const rawUrl=text(other.url,300);
  return {wechat,email:/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)?email:'',qrImage,
    other:{label:text(other.label,40)||'其他联系方式',value:text(other.value),url:/^https:\/\/[^\s<>]+$/.test(rawUrl)?rawUrl:''}};
}
