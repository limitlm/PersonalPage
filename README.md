# PersonalPage

Limitlm 的个人引导页。纯静态站点，零构建、零依赖，打开即可部署。

## 简介

一个极简线条风格的个人主页：全屏背景图 + 头像 + 打字机简介 + 站点导航 + 社交入口。适配桌面与移动端，支持无障碍与减少动效偏好。

## 特性

- **零构建**：仅 `index.html` / `styles.css` / `app.js` + 静态资源，无需 Node、打包器或框架
- **无第三方字体**：系统中文字体栈 + 本地 Pacifico，避免 font CDN 拖垮 Lighthouse
- **数据驱动站点列表**：在 `app.js` 的 `SITE_GROUPS` 里加一项即可新增站点，不用改 HTML/CSS
- **打字机效果**：简介文字逐字打出后停住；在 `prefers-reduced-motion` 下自动退化为静态文案
- **入场动画**：头像 → 简介展开 → 打字开始，节奏可控
- **邮箱一键复制**：点击底部邮件图标复制邮箱，Toast 提示反馈
- **头像经反代**：favicon / 头像走 `gh-proxy.com` 包一层 `avatars.githubusercontent.com`，避免 `github.com` 直连超时；失败时仍显示空圈
- **响应式与无障碍**：语义化标签、ARIA 标注、焦点可见、移动端布局适配
- **备案信息预留**：`index.html` 中注释掉的 ICP 链接，有备案号后取消注释填写即可

## Lighthouse

本地静态服务实测，桌面与移动端四项均满分：

| 桌面端 | 移动端 |
|:------:|:------:|
| ![PC Lighthouse 100](https://imgbed.limitlm.top/file/pcscore.png) | ![Mobile Lighthouse 100](https://imgbed.limitlm.top/file/mpscore.png) |

关键优化：去掉第三方渲染阻塞字体、本地 Pacifico、GitHub 资源经 `gh-proxy.com` 反代、背景/头像失败可回退。

## 目录结构

```
PersonalPage/
├── index.html    # 页面结构
├── styles.css    # 样式与动效
├── app.js        # 站点数据、打字机、复制邮箱等逻辑
├── assets/       # 本地背景兜底图 + Pacifico 字体
├── .gitignore
└── README.md
```

## 本地预览

任意静态服务器即可，例如：

```powershell
# PowerShell
python -m http.server 8080
# 或
npx serve .
```

浏览器打开 `http://localhost:8080`。

也可以直接双击 `index.html` 用浏览器打开（部分浏览器对 `file://` 下的剪贴板 API 有限制，复制邮箱功能建议走本地服务器验证）。

## 自定义

### 修改站点导航

编辑 `app.js` 顶部的 `SITE_GROUPS`：

```js
const SITE_GROUPS = [
  {
    id: "personal",
    items: [
      { name: "我的博客", url: "https://blog.example.com" },
      // 继续添加...
    ],
  },
  {
    id: "common",
    items: [
      { name: "GitHub", url: "https://github.com/limitlm" },
    ],
  },
];
```

空数组的分组会自动跳过，不会渲染空行。

### 修改简介文案

在 `app.js` 中改 `TAGLINE` 常量；HTML 里的默认文案同步改一下即可。

### 修改邮箱 / 社交链接

- 邮箱：`app.js` 的 `EMAIL` 常量，以及 `index.html` 中邮箱按钮的 `title` 提示
- QQ / GitHub：直接改 `index.html` 底部 `footer.socials` 里的链接

### 背景图与主题色

- 日常背景：优先加载 `t.alcy.cc` 随机图接口（桌面 `/pc`，移动 `/mp`），在 `app.js` 的 `BG_REMOTE` 修改
- 本地兜底：接口失败时才铺 `assets/bg-pc.webp` / `bg-mp.webp`（`BG_LOCAL`），正常路径不先闪本地图
- 无 JS 时：`<noscript>` 直接使用本地兜底图
- 主题色：`index.html` 的 `meta name="theme-color"`，以及 `body` / `.bg` 的背景色 `#1a1c22`

### 字体

- 名字 `Limitlm`：本地 Pacifico latin 子集（`assets/pacifico-latin.woff2`），`@font-face` + preload，无第三方字体请求
- 正文：系统中文字体栈（PingFang SC / 微软雅黑等），不加载 webfont
- 修改入口：`styles.css` 的 `@font-face` 与 `--font` / `--font-display`

## 部署

任意静态托管均可，常见方式：

| 平台 | 说明 |
|------|------|
| GitHub Pages | 推送仓库后在 Settings → Pages 开启 |
| Cloudflare Pages / Netlify / Vercel | 连接仓库，构建命令留空，输出目录为根目录 |
| 自建 Nginx / 对象存储 | 将三个文件上传即可 |

无环境变量、无构建步骤，不需要在托管侧做任何特殊配置。

## 浏览器支持

现代浏览器（Chrome / Edge / Firefox / Safari 最近几个大版本）。剪贴板 API 在 HTTPS 或 localhost 下可用；非安全上下文会自动回退到 `execCommand` 复制。

## 许可证

社交图标来自 [Tabler Icons](https://tabler.io/icons)（MIT License）。页面本身可按需自行修改使用。
