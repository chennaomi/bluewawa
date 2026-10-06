# Bluewawa Media 官网

静态 HTML 官网，面向海外品牌的中国社媒本地化服务。首页与服务页使用原生 HTML/CSS/JS；Insights 使用 Markdown 和共享模板在本地生成静态 HTML。
线上地址：**https://www.bluewawa.media**（GitHub Pages 部署，自定义域名见 `CNAME`）。

## 文件说明

| 文件 | 说明 |
| --- | --- |
| `index.html` | 官网首页，HTML/CSS 主要内联，交互脚本见 `assets/home.js`；文章推荐区共用 `insights/assets/teaser.css` |
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

- 联系表单为 `mailto:` 方案——提交后调起用户本地邮件客户端，收件人在 `assets/contact.js` 的 `TO` 常量里（`hello@bluewawa.media`）。后续可升级为 Formspree 等表单服务
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

## 第二批文章（2026-09-14）

第二批共补充六篇英文指南，文章中心现有九篇；新增内容沿用 Rednote 命名、机构作者、静态正文和 SEO 元数据。

| 文章路径 | 搜索意图与内容 |
| --- | --- |
| `/insights/rednote-keyword-research/` | Rednote keyword research：中文种子词、研究记录表、选题简报与复盘 |
| `/insights/rednote-creator-brief/` | Rednote creator brief：达人合作简报、交付边界、审核与报告，附虚构住宿样例 |
| `/insights/wechat-content-calendar/` | WeChat content calendar：首月四周编辑计划、双语审核、咨询承接与维护 |
| `/insights/rednote-marketing-costs/` | Rednote marketing costs：服务、制作、达人、广告费用边界，假设预算表与报价比较 |
| `/insights/rednote-90-day-pilot/` | 90-day Rednote pilot：30／60／90 天阶段交付、指标定义与继续／调整／停止决策 |
| `/insights/evaluate-china-social-media-agency/` | China social media agency evaluation：作品证据、团队与交付范围、报告、账号控制与交接核对表 |

每篇配有原创 SVG 流程图、正文内链和对应服务入口。平台背景引用官方来源；工作表、种子词和四周日历是建议方法与演示，不代表实测需求、平台规则或客户成果。后续编辑应继续保留这种区分。

费用篇的 USD 6,000 表格仅为假设数字演算，不是 Bluewawa 报价、可购买套餐或市场均价；未定价的税费、运输等项目在正文单独说明。修改时必须保留假设、排除项及费用口径，不能将演示数字改写为已验证价格。90 天是建议的项目周期，不保证获客或排名；代理商评估篇披露 Bluewawa 自身提供相关服务，不做独立排行榜。

原规划中暂未新增的两个主题：`KOL vs KOC: How to Plan Your First Creator Campaign`（选人及合作组合，与已有简报模板区分）；`WeChat Official Account, Channels or Mini Program?`（产品选型，与已有启动清单区分）。

首页推荐最多三篇，保留平台比较作为首篇，并各选一篇最新的 Rednote 与 WeChat 指南；服务页优先展示本平台文章，最多三篇。文章末尾推荐最多两篇，优先同平台；完整目录保留在 `/insights/`。

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
- 印章在窄屏下隐藏（已有媒体查询规则），并带鼠标反向视差（`assets/home.js`）

## 本地预览

### 编辑和发布 Insights

首次安装开发依赖（Node.js 20 或以上）：`npm ci`。之后使用 `npm run build` 生成页面，`npm run check` 检查结果。

1. 在 `content/insights/` 添加或编辑 `.md` 文件。文件开头两个 `---` 之间是 JSON 元数据，可参考已有文章；这不是 YAML。正文从 H2（`##`）开始，模板自动提供 H1。
2. 保持 `slug` 稳定。填写标题、摘要、分类、正文简答、真实作者所属组织和发布／修改日期对应的信息。当前统一以 Bluewawa Media 为机构作者，链接到 About。
3. 分类 ID 使用 `china-market-planning`、`rednote` 或 `wechat`。封面从 `insights/assets/` 的 SVG 中指定或新增，图片和引用须有使用依据。
4. 执行 `npm run build`：生成列表、文章、三张原有页面中 `INSIGHTS:START/END` 内的推荐区块，以及 sitemap。生成区块和文章 HTML 不要手动维护；首页其他内容不会被构建器重写。
5. 执行 `npm run check`，然后在静态服务器上复查手机与桌面效果。将源文件与生成的 HTML、sitemap 一起提交，GitHub Pages 本身无需安装 Node.js 或执行构建。

当前九篇：平台选择、内容本地化、微信启动清单、Rednote 关键词研究、Rednote 达人合作简报、WeChat 首月内容计划、Rednote 费用构成、90 天 Rednote 试运营、代理商评估。概念样例不是客户成果，平台规则和开户路径须在实质更新时重新核验。修改日期应反映内容更新，不应每次构建自动刷新。延后首次上线时，核对文章的发布日期后再构建。

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

## 页面质量修复（2026-10-06）

- 首页与服务页使用 `assets/site.css` / `assets/site.js` 补齐窄屏菜单、锚点偏移与键盘操作。菜单使用原生 `details`，无 JavaScript 时也可展开；启用 JavaScript 后支持 Esc 关闭及页内跳转后的焦点转移。
- 首页交互移至 `assets/home.js`。鼠标动画仅在可见首屏内响应，位置收敛后停止刷新；离开、滚动、切换标签页或开启减少动画时取消。首页及服务页的装饰动画在离屏或标签页隐藏时暂停。
- 统一首页 FAQ 与对应 JSON-LD；90 天说明为评估周期。修复微信服务页在 320px 窄屏下标题裁切及首页隐藏返回按钮的键盘焦点问题。
- 联系方式仍为 `mailto:`，页面明确提示需在邮件客户端发送；不表示已完成预约。

首页与两张服务页的关键链接使用 Umami 原生属性事件（[官方文档](https://docs.umami.is/docs/track-events)）：

| 事件 | 含义 |
| --- | --- |
| `contact-click` | 点击指向首页 Contact 区块的入口 |
| `email-click` | 点击直接 Email 链接 |
| `whatsapp-click` | 点击 WhatsApp 链接 |

事件属性 `page` 为 `home` / `rednote` / `wechat`；`placement` 为 `nav` / `mobile-nav` / `hero` / `sample-work` / `getting-started` / `final-cta` / `contact` / `footer` 中适用的位置。这些事件仅代表点击，不代表发送、提交成功或预约完成。表单字段不作为事件属性发送；既有 Insights 事件命名保持不变。无需新增统计账号，部署后在现有 Umami 项目中查看。

`npm run check` 额外检查上述链接的事件标记，以及首页 FAQ 可见答案与结构化数据的一致性。

## 首页与合作说明精简（2026-10-06）

- 首页将 Services 移到概念作品之后，提供 Rednote / WeChat 服务页直达入口。Services 聚焦服务内容，Why us 聚焦范围、审核和复盘，About 聚焦团队所在地与沟通方式；保留原有区块 ID、品牌主视觉和概念样例。
- 两张服务页新增 `#getting-started`（Before we start），分别说明启动资料、需要约定的工作范围，以及需明确列出的费用或另行界定的开发工作。内容依据现有预算、试运营和微信启动指南，不构成固定报价或统一套餐。
- 桌面与手机导航均可直达合作准备说明；区块提供对应指南链接及已有 Contact 入口，新入口沿用点击统计并以 `getting-started` 标明位置。

## 可用模板与文章咨询入口（2026-10-06）

- 达人合作简报、微信首月日历、代理商评估三篇文章提供完整空白工作表，可复制、下载 `.txt` 或单独打印。源文件位于 `content/worksheets/`，通过文章 JSON 元数据的 `worksheet.file` / `worksheet.title` 关联；构建时生成 `insights/assets/downloads/` 文件和页面预览，请勿直接编辑生成文件。
- 下载使用原生链接，不挂接会接管跳转的统计事件；关闭 JavaScript 时仍能查看和下载。复制失败时选中文本供手动复制。打印按钮只输出工作表，普通浏览器打印仍可输出文章。
- 九篇文章的咨询入口携带预设主题。`templates/contact-topics.mjs` 统一维护主题、按钮文案与提示，构建时更新首页 `CONTACT_TOPICS` 区块。`assets/contact.js` 仅接受预设主题，在邮件草稿中加入主题和对应指南链接，切换主题不会覆盖访客填写的内容。仍需用户在邮件客户端发送。
- 检查命令为 `npm run build`、`npm run check`、`npm test`。检查覆盖模板源文件／页面／下载一致性、主题链接，以及邮件草稿、复制失败回退和打印清理逻辑。浏览器另行核对实际布局与交互。

## 搜索主题、阅读路径与加载优化（2026-10-06）

- 两张服务页的 H1 明确说明平台营销服务及 global brands，Rednote 标题与首屏同时说明 Xiaohongshu 名称，保留现有 URL。
- 每篇文章的 JSON 元数据增加 `relatedGuides`：两个 `{ "slug": "目标文章", "reason": "阅读理由" }`。构建器检查目标存在、无重复且不推荐自身。文章底部按指定顺序输出阅读理由、标题和摘要，服务入口仍在正文之后。
- 首页两张下方装饰图使用原生懒加载及 640 / 1280 / 1920 像素响应式资源，保持原有视差效果。图片为装饰用途，使用空 alt；区块高度不依赖图片加载。
- 首页与服务页的中文字体使用 Google Fonts `text` 子集（[官方说明](https://developers.google.com/fonts/docs/getting_started#optimizing_your_font_requests)）。`scripts/font-subsets.mjs` 在构建时从源码提取中文字符，并保留 ASCII 与常用标点；拉丁字体沿用完整请求。修改中文后运行 `npm run build`，`npm run check` 会检测过期子集。动态输入的其他汉字使用系统字体回退。
- 本地性能记录见 `docs/performance-2026-10-06.md`。本地预览数据不能当作线上 Core Web Vitals、真实移动网络表现或排名提升的证据。

## 待办事项

- [ ] Contact 区块中注释掉的 WeChat / LinkedIn 信息待账号就绪后启用
- [ ] 联系表单升级为 Formspree（可选）
