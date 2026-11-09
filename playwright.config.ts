import {defineConfig,devices} from '@playwright/test';
const base=process.env.BASE_PATH||'/';
export default defineConfig({
  testDir:'./tests',fullyParallel:false,workers:1,timeout:30000,
  reporter:[['list'],['json',{outputFile:'test-results/results.json'}]],
  use:{baseURL:`http://127.0.0.1:4178${base}`,headless:true,locale:'zh-CN',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[
    {name:'desktop',use:{viewport:{width:1440,height:1000}}},
    {name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}},
    {name:'tablet',use:{viewport:{width:820,height:1180},isMobile:true,hasTouch:true}}
  ],
  webServer:{command:'node scripts/serve.mjs',url:`http://127.0.0.1:4178${base}`,reuseExistingServer:false,timeout:10000}
});
