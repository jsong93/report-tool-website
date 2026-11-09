# Report Tool 产品官网

独立的中文产品展示网站，使用 Vue 3、TypeScript 和 Vite。生产输出仅为 HTML、CSS、JavaScript、WebP/JPEG 与联系方式 JSON，可部署到 GitHub Pages。官网运行不需要 Java、MySQL 或 Report Tool 后台。

**这个目录只包含官网。Report Tool 产品为闭源收费软件；不要公开父目录、产品源码仓库或其 Git 历史。**

官网地址：[Report Tool 产品官网](https://jsong93.github.io/report-tool-website/)。独立公开仓库：[jsong93/report-tool-website](https://github.com/jsong93/report-tool-website)；每次发布结果见 [GitHub Actions](https://github.com/jsong93/report-tool-website/actions/workflows/pages.yml)。

## 本地查看

需要 Node.js 24.12 或以上的 24.x 版本。以下命令均在本目录执行：

```powershell
npm.cmd ci
npm.cmd run dev
```

打开 [本地官网](http://127.0.0.1:5178/)。停止时在终端按 Ctrl+C。

```powershell
# 生产构建、类型检查和静态产物扫描
npm.cmd run build
# 查看已经构建的产物
npm.cmd run preview
```

生产预览默认端口为 4178。Vite 开发/预览服务仅用于本地；GitHub Pages 直接托管 `dist` 文件，不运行 Node.js 服务。

## 联系方式：只改一个文件

编辑 `public/contact.json`，构建后原样复制到站点根路径。配置内容将公开给访客。

| 字段 | 内容 |
| --- | --- |
| `wechat` | 微信号，当前为已确认的 `J76645426`；空字符串显示待配置并禁用复制 |
| `email` | 邮箱，当前为已确认的 `jsongneu@163.com`；生成邮件链接 |
| `qrImage` | 微信二维码图片路径，当前为用户提供的 `assets/wechat-qr.jpg`；点击图片可在新窗口查看原图 |
| `other.label` | 其他联系方式名称，例如“电话” |
| `other.value` | 公开显示的文字；空字符串时不展示 |
| `other.url` | 可选 HTTPS 链接；空字符串时仅展示文字 |

当前二维码为用户提供的完整JPEG原图，未重绘或压缩；联系区点击图片可在新窗口查看原图。更换时将真实二维码图片放入 `public/assets` 后修改相对路径；支持 PNG、WebP、JPG。不要使用文件系统路径或把“微信号文字二维码”当作添加好友二维码。二维码加载失败会给出提示。若自动复制被浏览器拒绝，页面提示手动选中复制；不会虚报成功。

## 创建独立 GitHub 仓库并发布

### 1. 导出白名单目录

在本目录执行：

```powershell
npm.cmd run package:public
```

脚本只复制明确列出的官网文件，输出到 `release/public-repo-时间/`，并生成逐文件 SHA256 清单 `PUBLIC-FILES.json`。不复制父目录、`.git`、产品源码、原始截图测试日志、数据库、依赖和构建缓存。也可使用已经提供的 `report-tool-website-source.zip`。

先把输出目录复制或解压到**商业源码仓库之外**。在这个新目录中检查 `package.json` 的 `name` 为 `report-tool-website`，且没有 `report-core`、`report-server`、`report-web` 或历史 `.git`。

### 2. 新建官网专用仓库

在 GitHub 创建一个空仓库，例如 `report-tool-website`。公开仓库可以使用 GitHub Free 的 Pages；不要更改原商业源码仓库的可见性。公开仓库只能放上述白名单官网内容。

在刚刚导出的**独立目录**执行下面的命令。先将 `YOUR_ACCOUNT` 替换为实际账号或组织名称，不要原样运行占位符：

```powershell
git init -b main
git add .
git commit -m "发布 Report Tool 产品官网"
git remote add origin https://github.com/YOUR_ACCOUNT/report-tool-website.git
git push -u origin main
```

不要在原 Report Tool 仓库根目录执行这组发布命令。若使用 GitHub 网页上传，请同时包含隐藏的 `.github/workflows/pages.yml`；只有该文件处于新仓库根目录的 `.github/workflows` 才会运行。

### 3. 开启 Pages

进入新仓库 **Settings → Pages → Build and deployment → Source → GitHub Actions**。首次推送可能早于 Pages 设置完成，此时在 Actions 中重新运行“构建并发布产品官网”，或手动触发。

工作流会安装锁定依赖、生成生产产物、运行三种设备的无头浏览器检查，再上传 **`dist`** 并发布。构建或测试失败时不会进入发布任务，失败截图及 Trace 保存为 Actions 附件。无需额外填写个人访问令牌。

项目站地址通常为 `https://YOUR_ACCOUNT.github.io/report-tool-website/`；最终地址以工作流部署输出为准。发布后实际访问首页、联系方式和一张大图，核对浏览器无资源 404。

工作流从 `configure-pages` 的 `base_path` / `base_url` 生成静态资源前缀、canonical、Open Graph 图片绝对地址和 sitemap，因此更换仓库名或使用根站点时无需手工修改源码路径。

依据：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[Vite 静态部署](https://vite.dev/guide/static-deploy.html)。本项目已配置独立仓库和自动发布流程；每次上线以 Actions 中的构建、浏览器测试与部署任务全部成功为准。

## 子路径与 SEO

本地默认 `BASE_PATH=/`。模拟项目站点：

```powershell
$env:BASE_PATH = '/report-tool-website/'
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

此时访问 [子路径预览](http://127.0.0.1:4178/report-tool-website/)。所有图片、配置文件、脚本和图标均遵守同一前缀。

已知正式域名时，可在构建前设置 `SITE_URL` 为完整 HTTPS 地址，含项目子路径且不含文件名。这个值用于 canonical、Open Graph 绝对图片地址和 sitemap。未配置时不虚构域名，不生成 canonical 或 sitemap；正式 Actions 会自动提供真实值。标题、描述、中文语言、Open Graph 信息始终生成。

自定义域名需在 GitHub Pages 设置和域名 DNS 中配置，按域名服务商和 GitHub 文档执行。不要把网站路径或假域名直接写入 `CNAME`。

## 后续更新

1. 在官网独立仓库更新 `public/contact.json`、`src/content.ts` 或页面样式。
2. 更换产品截图时只使用授权的演示数据，更新 `public/assets` 中的大图与缩略图，保留可读文字；更新 `SCREENSHOTS.md`。
3. 执行 `npm run build` 和 `npm test`。首次运行测试需 `npx playwright install chromium`；CI 自动安装浏览器。
4. 查看差异，提交并推送到 `main`，Actions 自动构建与发布。

官网仍位于商业源码仓库中开发时，重新运行 `package:public`，将白名单目录的变更同步到独立官网仓库；不要添加商业仓库远程地址或复制其历史。

## 验证与边界

自动检查包含桌面 1440×1000、手机 390×664（iPhone 13 浏览器仿真）及平板 820×1180，另核对 320、375、768、1024 像素宽度。覆盖页面导航、六项功能、八张大图、图片加载、首尾循环、键盘/触控、焦点和滚动恢复、联系配置、剪贴板成功/拒绝、二维码及未知链接处理。

`scripts/serve.mjs` 提供严格路径的本地静态测试服务，不对错误的资源路径返回首页，便于识别子路径问题。测试不会读取用户浏览器会话，不访问商业产品 API。

生产扫描禁止后端源码、JAR、SQL、数据库、私钥、源映射及常见凭据模式。此扫描是辅助检查；截图本身通过隔离数据来源与人工视觉审阅确认。站点使用系统字体，无统计跟踪、远程字体或表单收集后台。

产品能力受实际版本、授权与配置约束。截图不是客户案例或产品性能数据。网页官网的免费静态托管不表示 Report Tool 产品本身无需服务端。授权、费用、交付和定制范围需沟通确认。
