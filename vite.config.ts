import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const base = process.env.BASE_PATH || '/';
if (!/^\/(?:[A-Za-z0-9._-]+\/)*$/.test(base)) throw new Error('BASE_PATH 必须是 / 或 /仓库名/ 形式的路径（仓库名使用英文）。');
const rawUrl = process.env.SITE_URL?.replace(/\/$/, '') || '';
if (rawUrl && !/^https:\/\/[A-Za-z0-9.-]+(?:\/[A-Za-z0-9._-]+)*$/.test(rawUrl)) throw new Error('SITE_URL 必须是完整的 HTTPS 官网地址。');
export default defineConfig({
  base,
  plugins: [vue(), {
    name: 'website-metadata',
    transformIndexHtml: html => html.replace('<!-- canonical -->', rawUrl ? `<link rel="canonical" href="${rawUrl}/"><meta property="og:url" content="${rawUrl}/">` : '')
      .replaceAll('__OG_IMAGE__', `${rawUrl || base.replace(/\/$/, '')}/assets/designer.webp`),
    generateBundle() {
      this.emitFile({type:'asset',fileName:'.nojekyll',source:''});
      this.emitFile({type:'asset',fileName:'robots.txt',source:`User-agent: *\nAllow: /\n${rawUrl ? `Sitemap: ${rawUrl}/sitemap.xml\n` : ''}`});
      if(rawUrl) this.emitFile({type:'asset',fileName:'sitemap.xml',source:`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${rawUrl}/</loc></url></urlset>`});
    }
  }],
  build: {sourcemap:false, assetsInlineLimit:0},
  server:{host:'127.0.0.1',port:5178,strictPort:true},
  preview:{host:'127.0.0.1',port:4178,strictPort:true}
});
