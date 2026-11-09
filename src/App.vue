<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from 'vue';
import Icon from './Icon.vue';
import {features, scenes, screenshots} from './content';
import {emptyContact, parseContact, type Contact} from './contact';

const base=import.meta.env.BASE_URL;
const asset=(file:string)=>`${base}assets/${file}`;
const menuOpen=ref(false), activeFeature=ref(0), modalIndex=ref(0), lightbox=ref<HTMLDialogElement>();
const feature=computed(()=>features[activeFeature.value]!);
const shot=computed(()=>screenshots[modalIndex.value]!);
const contact=ref<Contact>(emptyContact),contactState=ref('正在加载联系方式…'),copyState=ref(''),qrFailed=ref(false);
let restoreFocus:HTMLElement|null=null;
let previousOverflow='';
let scrollLocked=false;
async function openImage(index:number){
  if(scrollLocked){modalIndex.value=index;return;}
  modalIndex.value=index;restoreFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  scrollLocked=true;
  previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  await nextTick();lightbox.value?.showModal();
}
function closeImage(){lightbox.value?.close();afterClose();}
function afterClose(){if(lightbox.value?.open||!scrollLocked)return;document.body.style.overflow=previousOverflow;scrollLocked=false;restoreFocus?.focus();}
function moveImage(delta:number){modalIndex.value=(modalIndex.value+delta+screenshots.length)%screenshots.length;}
function dialogKey(event:KeyboardEvent){if(event.key==='ArrowRight'){event.preventDefault();moveImage(1);}if(event.key==='ArrowLeft'){event.preventDefault();moveImage(-1);}}
let touchX:number|null=null;
function touchStart(event:TouchEvent){touchX=event.touches[0]?.clientX??null;}
function touchEnd(event:TouchEvent){if(touchX!==null){const delta=event.changedTouches[0]!.clientX-touchX;if(Math.abs(delta)>60)moveImage(delta<0?1:-1);}touchX=null;}
async function copyWechat(){
  if(!contact.value.wechat)return;
  try {await navigator.clipboard.writeText(contact.value.wechat);copyState.value='微信号已复制，可前往微信添加好友。';}
  catch {copyState.value='未能自动复制，请长按或选中上方微信号手动复制。';}
}
function featureKey(event:KeyboardEvent){
  let next=activeFeature.value;
  if(event.key==='ArrowRight')next=(next+1)%features.length;else if(event.key==='ArrowLeft')next=(next+features.length-1)%features.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=features.length-1;else return;
  event.preventDefault();activeFeature.value=next;nextTick(()=>document.getElementById(`feature-tab-${next}`)?.focus());
}
onMounted(async()=>{try{const response=await fetch(`${base}contact.json`);if(!response.ok)throw Error();contact.value=parseContact(await response.json());contactState.value='';}catch{contactState.value='联系方式暂时无法加载，请刷新页面重试。';}});
onBeforeUnmount(()=>{if(lightbox.value?.open)document.body.style.overflow=previousOverflow;});
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#" aria-label="Report Tool 首页"><img :src="`${base}favicon.svg`" alt="" width="35" height="35"><span>Report Tool<span class="brand-dot">.</span></span></a>
      <nav class="desktop-nav" aria-label="主导航"><a href="#features">产品功能</a><a href="#gallery">产品实景</a><a href="#scenarios">应用场景</a><a href="#services">商业服务</a></nav>
      <a class="button small header-contact" href="#contact">联系咨询<Icon name="arrow"/></a>
      <button class="menu-toggle" :aria-expanded="menuOpen" aria-controls="mobile-nav" :aria-label="menuOpen?'收起导航':'展开导航'" @click="menuOpen=!menuOpen"><Icon :name="menuOpen?'close':'menu'"/></button>
    </div>
    <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="移动端导航" @click="menuOpen=false"><a href="#features">产品功能</a><a href="#gallery">产品实景</a><a href="#scenarios">应用场景</a><a href="#services">商业服务</a><a href="#contact">联系咨询</a></nav>
  </header>

  <main id="main">
    <section class="hero">
      <div class="container">
        <div class="hero-copy"><p class="eyebrow"><span class="blue-dot"></span>让报表回到业务本身</p>
          <h1><span class="hero-product">Report Tool <span>—</span></span>企业级网页报表设计<br><span class="accent">与嵌入式报表工具</span></h1>
          <p class="hero-description">通过可视化设计、业务数据连接和报表发布，<br class="desktop-break">帮助企业减少重复报表开发工作。</p>
          <div class="hero-actions"><a class="button" href="#features">查看产品功能<Icon name="arrow"/></a><a class="button secondary" href="#contact">联系咨询<Icon name="chat"/></a></div>
          <p class="hero-meta"><span><Icon name="check"/>浏览器内设计</span><span><Icon name="check"/>私有化部署</span><span><Icon name="check"/>闭源商业授权</span></p>
        </div>
        <div class="hero-window">
          <div class="window-bar"><span class="window-dots"><i></i><i></i><i></i></span><span>Report Tool · 报表设计工作台</span><span class="demo-label">真实界面 · 模拟数据</span></div>
          <button class="screenshot-button hero-image" aria-label="放大报表设计器截图" @click="openImage(0)"><img :src="asset('designer.webp')" :alt="screenshots[0].alt" width="1600" height="1000" fetchpriority="high"><span class="zoom-hint"><Icon name="expand"/>查看大图</span></button>
          <div class="window-footer"><span><span class="blue-dot"></span>从单元格开始，构建业务报表</span><a href="#gallery">探索更多产品界面<Icon name="arrow"/></a></div>
        </div>
      </div>
    </section>

    <div class="workflow-strip container" aria-label="报表工作流程"><div v-for="(item,i) in [['设计模板','把业务结构放进表格'],['连接数据','配置来源与字段绑定'],['预览发布','核对结果，再交付使用'],['导出与填报','衔接后续业务工作']]" :key="item[0]"><span class="step-number">0{{ i+1 }}</span><span><strong>{{ item[0] }}</strong><small>{{ item[1] }}</small></span><Icon v-if="i<3" name="chevron"/></div></div>

    <section id="features" class="section container">
      <div class="section-heading"><div><p class="eyebrow">产品能力</p><h2>从一张报表，到一套工作流程。</h2></div><p>设计、数据、展示与交付相互衔接，<br>为业务系统补上报表这一环。</p></div>
      <div class="feature-tabs" role="tablist" aria-label="产品功能" @keydown="featureKey"><button v-for="(item,i) in features" :id="`feature-tab-${i}`" :key="item.name" role="tab" :aria-selected="activeFeature===i" aria-controls="feature-panel" :tabindex="activeFeature===i?0:-1" @click="activeFeature=i"><Icon :name="item.icon"/>{{ item.name }}</button></div>
      <div id="feature-panel" class="feature-panel" role="tabpanel" :aria-labelledby="`feature-tab-${activeFeature}`" tabindex="0">
        <div class="feature-copy"><p class="feature-kicker">{{ feature.kicker }}</p><h3>{{ feature.title }}</h3><p>{{ feature.description }}</p><ul><li v-for="point in feature.points" :key="point"><Icon name="check"/>{{ point }}</li></ul><p class="feature-scene">{{ feature.scene }}</p><a class="text-link" href="#contact">聊聊你的使用场景<Icon name="arrow"/></a></div>
        <div class="feature-visual"><button class="screenshot-button" :aria-label="`放大${screenshots[feature.shot]!.title}截图`" @click="openImage(feature.shot)"><img :src="asset(screenshots[feature.shot]!.file)" :alt="screenshots[feature.shot]!.alt" width="1600" height="1000" loading="lazy"><span class="zoom-hint"><Icon name="expand"/>查看大图</span></button><p class="image-note">{{ feature.note }}</p></div>
      </div>
    </section>

    <section id="gallery" class="section gallery-section">
      <div class="container"><div class="section-heading"><div><p class="eyebrow">产品实景</p><h2>真实界面，直观了解。</h2></div><p>来自实际运行的产品。<br>所有截图均使用模拟业务数据，点击可放大查看。</p></div>
        <div class="gallery-grid"><button v-for="(item,i) in screenshots" :key="item.id" class="gallery-card" :aria-label="`查看${item.title}大图`" @click="openImage(i)"><span class="gallery-image"><img :src="asset(item.file.replace('.webp','-thumb.webp'))" :alt="item.alt" width="640" height="400" loading="lazy" decoding="async"><span class="gallery-expand"><Icon name="expand"/></span></span><span class="gallery-caption"><span><small>0{{ i+1 }}</small>{{ item.title }}</span><Icon name="arrow"/></span></button></div>
      </div>
    </section>

    <section id="scenarios" class="section container">
      <div class="section-heading"><div><p class="eyebrow">应用场景</p><h2>贴近业务，而不止于表格。</h2></div><p>以通用报表能力承接不同业务需求，<br>具体模板与数据接入按实际项目配置。</p></div>
      <div class="scenario-grid"><article v-for="(item,i) in scenes" :key="item.name"><div class="scenario-top"><Icon :name="item.icon"/><span>0{{ i+1 }}</span></div><h3>{{ item.name }}</h3><p>{{ item.text }}</p></article></div>
      <p class="section-note">以上为可配置的应用方向，不代表已交付的行业方案或客户案例。</p>
    </section>

    <section id="services" class="section services-section"><div class="container">
      <div class="section-heading"><div><p class="eyebrow">商业服务</p><h2>选择适合你的合作方式。</h2></div><p>Report Tool 为闭源收费产品。<br>授权范围、实施内容与费用，结合需求沟通确认。</p></div>
      <div class="service-grid"><article v-for="item in [{icon:'shield',title:'产品授权',text:'根据使用主体、部署范围和业务需求，沟通适合的商业授权。',detail:'明确授权范围'},{icon:'database',title:'私有化部署',text:'结合企业环境评估部署要求，让产品运行在你管理的基础设施中。',detail:'评估环境与实施'},{icon:'code',title:'系统嵌入',text:'将报表展示接入现有业务系统，结合身份、权限与页面需求完成配置。',detail:'对接现有业务系统'},{icon:'edit',title:'报表定制开发',text:'围绕现有数据、统计口径和报表样式，讨论模板与功能定制。',detail:'从具体报表需求开始'}]" :key="item.title"><Icon :name="item.icon"/><h3>{{ item.title }}</h3><p>{{ item.text }}</p><a href="#contact" class="text-link" :aria-label="`${item.title}咨询`">{{ item.detail }}<Icon name="arrow"/></a></article></div>
    </div></section>

    <section class="section container faq-section"><div><p class="eyebrow">常见问题</p><h2>开始之前，<br>你可能想了解。</h2></div><div class="faq-list"><details><summary>可以像 Excel 一样使用吗？</summary><p>设计器采用熟悉的表格与功能区操作方式，支持产品已提供的单元格、格式和公式能力。它是网页报表工具，具体公式、导入导出与精度规则以产品支持范围为准。</p></details><details><summary>官网上的截图是真实产品吗？</summary><p>是。截图来自实际运行的 Report Tool，使用隔离环境中的合成数据。截图中的项目、人员、金额及指标均为演示内容，不是客户案例或经营业绩。</p></details><details><summary>官网和报表产品怎样部署？</summary><p>本官网为静态展示网站，可使用 GitHub Pages 托管，无需 Java 或数据库。Report Tool 产品采用服务端架构，私有化部署需要独立的运行环境；具体配置在咨询时确认。</p></details><details><summary>咨询时需要准备什么？</summary><p>可以先准备一份已脱敏的报表样式，说明数据来源、使用人员和期望的操作流程。如果需要嵌入现有系统，也请说明系统环境与访问方式。</p></details></div></section>

    <section id="contact" class="contact-section"><div class="container contact-layout"><div class="contact-intro"><p class="eyebrow">联系我们</p><h2>下一张业务报表，<br>从一次沟通开始。</h2><p>无论是产品授权、系统集成，还是一张具体报表，<br>欢迎带着你的使用场景来聊聊。</p><span class="contact-note">建议先提供脱敏样例，便于讨论数据与报表需求。</span></div>
      <div class="contact-card"><p v-if="contactState" role="status" class="config-status">{{ contactState }}</p><div class="contact-main"><div class="contact-methods"><div class="contact-method"><span class="contact-label"><Icon name="chat"/>微信咨询</span><strong class="wechat-value">{{ contact.wechat||'微信号待配置' }}</strong><button class="copy-button" :disabled="!contact.wechat" @click="copyWechat"><Icon name="copy"/>{{ contact.wechat?'复制微信号':'待配置' }}</button></div><div class="contact-method email-method"><span class="contact-label"><Icon name="mail"/>邮件咨询</span><a v-if="contact.email" :href="`mailto:${contact.email}?subject=${encodeURIComponent('Report Tool 产品咨询')}`">{{ contact.email }}<Icon name="arrow"/></a><span v-else>邮箱待配置</span></div><div class="other-contact" v-if="contact.other.value"><span>{{ contact.other.label }}</span><a v-if="contact.other.url" :href="contact.other.url" target="_blank" rel="noopener noreferrer">{{ contact.other.value }}</a><span v-else>{{ contact.other.value }}</span></div></div><div class="qr-area"><a v-if="contact.qrImage&&!qrFailed" class="qr-image-link" :href="`${base}${contact.qrImage}`" target="_blank" rel="noopener noreferrer" aria-label="放大微信二维码（新窗口）"><img :src="`${base}${contact.qrImage}`" width="132" height="181" alt="微信联系二维码" loading="lazy" @error="qrFailed=true"></a><div v-else class="qr-placeholder"><Icon name="qr"/><span>{{ qrFailed?'二维码暂不可用':'微信二维码待配置' }}</span></div><small>{{ contact.qrImage&&!qrFailed?'点击放大二维码':'可通过微信号添加' }}</small></div></div><p class="copy-feedback" role="status" aria-live="polite">{{ copyState }}</p><div class="contact-card-footer"><Icon name="shield"/>授权、部署和定制范围以双方确认内容为准。</div></div>
    </div></section>
  </main>

  <footer class="site-footer container"><div class="footer-brand"><a class="brand" href="#"><img :src="`${base}favicon.svg`" alt="" width="28" height="28"><span>Report Tool<span class="brand-dot">.</span></span></a><p>让业务数据成为可使用的报表。</p></div><div class="footer-right"><a href="#features">产品功能</a><a href="#contact">联系咨询</a><p>© {{ new Date().getFullYear() }} Report Tool · 闭源商业产品</p></div></footer>

  <dialog ref="lightbox" class="lightbox" aria-labelledby="lightbox-title" aria-describedby="lightbox-caption" @close="afterClose" @cancel.prevent="closeImage" @keydown="dialogKey" @click="(event)=>{if(event.target===lightbox)closeImage()}">
    <div class="lightbox-shell"><header><div><span class="lightbox-counter">{{ String(modalIndex+1).padStart(2,'0') }} / {{ screenshots.length }}</span><h2 id="lightbox-title">{{ shot.title }}</h2></div><button class="icon-button" autofocus aria-label="关闭大图" @click="closeImage"><Icon name="close"/></button></header><div class="lightbox-image" @touchstart.passive="touchStart" @touchend.passive="touchEnd"><img :src="asset(shot.file)" :alt="shot.alt" width="1600" height="1000"></div><footer><button class="lightbox-prev" aria-label="上一张截图" @click="moveImage(-1)"><Icon name="chevron"/></button><div><p id="lightbox-caption">{{ shot.caption }}</p><small>真实产品 · 模拟数据<span class="desktop-hint"> · 使用 ← → 切换，Esc 关闭</span></small></div><button aria-label="下一张截图" @click="moveImage(1)"><Icon name="chevron"/></button></footer></div>
  </dialog>
</template>
