# Bluewawa Media 官网

静态 HTML 官网，面向海外品牌的中国社媒本地化服务。首页与服务页使用原生 HTML/CSS/JS；Insights 使用 Markdown 和共享模板在本地生成静态 HTML。
线上地址：**https://www.bluewawa.media**（GitHub Pages 部署，自定义域名见 `CNAME`）。

## 文件说明

| 文件 | 说明 |
| --- | --- |
| `index.html` | 官网首页，主要 HTML/CSS/JS 内联；文章推荐区共用 `insights/assets/teaser.css` |
| `rednote-marketing/index.html` | Rednote Marketing 独立 SEO 落地页 |
| `wechat-marketing/index.html` | WeChat Marketing 独立 SEO 落地页 |
| `insights/index.html` | 生成的英文文章列表页 |
| `insights/*/index.html` | 生成的文章详情页，正文直接包含在 HTML 中 |
| `content/insights/*.md` | 文章源文件：JSON 元数据 + Markdown 正文 |
| `templates/insights.mjs` / `insights/assets/` | 列表与文章模板、共用样式、原创 SVG 图解 |
| `scripts/build-insights.mjs` / `scripts/check-site.mjs` | 生成页面、内链与 sitemap；检查站内链接和 SEO 配置 |
| `.nojekyll` | GitHub Pages 直接发布静态产物，避免将源 Markdown 交给 Jekyll 处理 |
| `CNAME` | GitHub Pages 自定义域名（`www.bluewawa.media`） |
| `favicon.png` | 站点图标（48×48，黄底蓝 B） |
| `og-image.png` | 社交分享图（1200×630），OG/Twitter 标签引用。源文件为 `.claude/og-image.html`，改动后用无头 Chrome 截图重新生成（注意：Edge 无头模式有渲染 bug，需用 Chrome） |
| `robots.txt` / `sitemap.xml` | SEO 配套文件，与页面一起部署在根目录 |

## ⚠️ 关键配置（改版时不要弄丢）

### Umami 统计脚本

位于 `index.html` 的 `</body>` 前，**任何改版都必须保留**：

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="70b4ca0b-05bd-4a04-8910-1d719dd67725"></script>
```

### SEO 配置（均在 `<head>`）

- title / description / canonical（指向 `https://www.bluewawa.media/`）
- Open Graph + Twitter Card（分享图指向 `https://www.bluewawa.media/og-image.png`）
- 三段 JSON-LD 结构化数据：`ProfessionalService`、`WebSite`、`FAQPage`（FAQ 内容改动时需同步更新 FAQPage）

### 联系方式

- 联系表单为 `mailto:` 方案——提交后调起用户本地邮件客户端，收件人写死在页面底部 JS 的 `TO` 常量里（`hello@bluewawa.media`）。后续可升级为 Formspree 等表单服务
- Contact 区块已上线的真实链接：Email（`mailto:hello@bluewawa.media`）、WhatsApp（`wa.me/8618611314374`）、Facebook（`facebook.com/profile.php?id=61590503946333`）、TikTok（`tiktok.com/@bluewawa.media`）。页脚 Social 栏包含 WhatsApp、TikTok 和 Facebook 真实链接
- WeChat / LinkedIn 联系方式暂以 HTML 注释形式保留在 Contact 区块中，待账号就绪后取消注释

## 品牌配色（CSS 变量，`:root`）

| 变量 | 色值 | 用途 |
| --- | --- | --- |
| `--navy` | `#182E66` | 主背景 |
| `--navy-deep` | `#0F1E48` | 深背景区块 |
| `--black` | `#150D13` | 页脚 |
| `--yellow` | `#FFCE06` | 大字高亮 / 按钮 |
| `--terracotta` | `#BD5A3D` | 暖色点缀 / 印章 |
| `--blue` | `#4391D4` | Logo "Blue" / 链接 |
| `--cream` | `#FAF6EE` | 正文文字 |

平台品牌色：小红书 `#FF2442`、微信 `#07C160`。

## 内容定位

- 主推平台：**小红书 Rednote + 微信 WeChat**（抖音等其他平台仅在 Platforms 区块底部的延伸名单中低调展示）
- Slogan：**Turn Blue into Wow.**
- 首屏定位小字：**Rednote & WeChat marketing for global brands**
- 副标题：We help your brand get seen, remembered, and grow in China.
- 网站对外英文名称统一使用 **Rednote**，包括正文、无障碍标签及 SEO 元数据。引用的官方来源域名保持真实地址，旧文章地址仅用作兼容跳转。

## 本次更新（2026-09-09）

- 明确首页 Rednote 与 WeChat 服务定位，新增两组标明 `Concept project` 的内容与交付样例。
- 新增 `/insights/` 文章中心及三篇英文指南，打通首页、服务页与文章之间的推荐链接。
- 新增 Markdown 静态构建、文章目录、结构化数据、canonical、sitemap 和站内链接检查；GitHub Pages 仍直接发布静态文件。
- 内容本地化指南使用 `/insights/rednote-content-localization/`；旧地址通过静态页面跳转到新地址，JavaScript 跳转保留查询参数和锚点，并提供 meta refresh 与手动链接作为后备。该机制不是服务器端 HTTP 301。
- 询盘表单仍使用 `mailto:`，尚未接入数据存储、邮件通知或预约后台。

## 首页内容与交付样例

- 首屏下方的 `#sample-work` 展示两组自发演示项目，导航和首屏次按钮均可直达。
- 使用同一个虚构海边住宿简报，分别展示小红书英文简报到中文封面／笔记的本地化，以及微信文章到咨询再到人工跟进的路径。
- 样例使用原生 HTML/CSS 和内联 SVG，无新增外部图片或 JavaScript 依赖；通过原生 `details` 展开文案及交付说明。
- 两组均标注 `Concept project`，不代表真实客户项目、已上线功能或经过验证的营销结果。手机示意中的控件仅为静态图示。
- 后续替换真实作品前，核实素材授权和数据口径；不要为演示项目补写客户评价、合作 Logo 或效果数字。

## 首屏入场动画

页面加载后约 2.5 秒的入场编舞（全部 CSS 动画，样式在 `HERO ENTRANCE CHOREOGRAPHY` 注释段）：

1. 背景光斑绽放淡入 → 2. 大标题逐词从遮罩升起（`.hl-word`/`.hl-in`，`--d` 变量控制错峰延迟）→ 3. "Wow" 的句点坠落回弹（`.dot-drop`）→ 4. 赤陶印章"哇!"盖章落下 + 涟漪扩散（`.seal-floating`）→ 5. 副标题 / 按钮 / scroll 指示依次浮入

注意事项：

- 标题词遮罩有内边距补偿，防止 Playfair 斜体悬挑被裁切，改字号/字体后需复查
- 所有入场动画都已加入 `prefers-reduced-motion` 豁免列表，新增动画时记得同步
- 印章在窄屏下隐藏（已有媒体查询规则），并带鼠标反向视差（页面底部 JS）

## 本地预览

### 编辑和发布 Insights

首次安装开发依赖（Node.js 20 或以上）：`npm ci`。之后使用 `npm run build` 生成页面，`npm run check` 检查结果。

1. 在 `content/insights/` 添加或编辑 `.md` 文件。文件开头两个 `---` 之间是 JSON 元数据，可参考已有文章；这不是 YAML。正文从 H2（`##`）开始，模板自动提供 H1。
2. 保持 `slug` 稳定。填写标题、摘要、分类、正文简答、真实作者所属组织和发布／修改日期对应的信息。当前统一以 Bluewawa Media 为机构作者，链接到 About。
3. 分类 ID 使用 `china-market-planning`、`rednote` 或 `wechat`。封面从 `insights/assets/` 的 SVG 中指定或新增，图片和引用须有使用依据。
4. 执行 `npm run build`：生成列表、文章、三张原有页面中 `INSIGHTS:START/END` 内的推荐区块，以及 sitemap。生成区块和文章 HTML 不要手动维护；首页其他内容不会被构建器重写。
5. 执行 `npm run check`，然后在静态服务器上复查手机与桌面效果。将源文件与生成的 HTML、sitemap 一起提交，GitHub Pages 本身无需安装 Node.js 或执行构建。

当前三篇：平台选择、内容本地化、微信启动清单。概念样例不是客户成果，平台规则和开户路径须在实质更新时重新核验。修改日期应反映内容更新，不应每次构建自动刷新。延后首次上线时，核对文章的发布日期后再构建。

文章正文可包含受信任的 HTML，构建器不接收访客内容。作者、来源及服务 CTA 随正文一起静态输出；新页面共用 Umami，并跟踪服务／联系入口点击（不等同于提交成功）。

新增文章按发布日期排序，平台选择指南作为固定首篇推荐。变更 slug 时，将旧 slug 加入文章元数据的 `aliases` 数组，并同步修改站内链接；构建器会生成旧地址到新地址的静态跳转页，旧地址不进入 sitemap。删除文章时仍需手动处理旧生成目录，检查命令会提示未配置跳转且不在 sitemap 中的文章。首页与服务页的 sitemap 日期在构建脚本中维护。

### 预览静态页面

纯静态页面，任意静态服务器均可，例如：

```
npm run preview
```

默认地址为 `http://127.0.0.1:4174/`，Insights 入口为 `/insights/`。站内新链接使用域名根路径，请通过静态服务器预览，不要直接双击 HTML。Google Fonts 与 Umami 需联网加载。

## 部署

推送到 `main` 分支即由 GitHub Pages 自动发布。注意保持 canonical / og:url / sitemap 中的 `https://www.bluewawa.media/` 与实际域名一致。

## 待办

- [ ] Contact 区块中注释掉的 WeChat / LinkedIn 信息待账号就绪后启用
- [ ] 联系表单升级为 Formspree（可选）
