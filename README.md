# Bluewawa Media 官网

单页 HTML 门户网站（无框架、纯 HTML/CSS/JS），面向海外品牌的中国社媒本地化服务。
线上地址：**https://bluewawa.media**（GitHub Pages 部署，自定义域名见 `CNAME`，指向 `www.bluewawa.media`）。

## 文件说明

| 文件 | 说明 |
| --- | --- |
| `index.html` | 网站本体（深蓝编辑风、5 色配色），HTML/CSS/JS 全部内联在这一个文件里 |
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

- title / description / keywords / canonical（指向 `https://bluewawa.media/`）
- Open Graph + Twitter Card（分享图指向 `https://bluewawa.media/og-image.png`）
- 三段 JSON-LD 结构化数据：`ProfessionalService`、`WebSite`、`FAQPage`（FAQ 内容改动时需同步更新 FAQPage）

### 联系方式

- 联系表单为 `mailto:` 方案——提交后调起用户本地邮件客户端，收件人写死在页面底部 JS 的 `TO` 常量里（`hello@bluewawa.media`）。后续可升级为 Formspree 等表单服务
- Contact 区块已上线的真实链接：Email（`mailto:hello@bluewawa.media`）、Facebook（`facebook.com/profile.php?id=61590503946333`）、TikTok（`tiktok.com/@bluewawa.media`）。页脚 Social 栏为 TikTok + Facebook 真实链接
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
- 副标题：We help your brand get seen, remembered, and grow in China.

## 首屏入场动画

页面加载后约 2.5 秒的入场编舞（全部 CSS 动画，样式在 `HERO ENTRANCE CHOREOGRAPHY` 注释段）：

1. 背景光斑绽放淡入 → 2. 大标题逐词从遮罩升起（`.hl-word`/`.hl-in`，`--d` 变量控制错峰延迟）→ 3. "Wow" 的句点坠落回弹（`.dot-drop`）→ 4. 赤陶印章"哇!"盖章落下 + 涟漪扩散（`.seal-floating`）→ 5. 副标题 / 按钮 / scroll 指示依次浮入

注意事项：

- 标题词遮罩有内边距补偿，防止 Playfair 斜体悬挑被裁切，改字号/字体后需复查
- 所有入场动画都已加入 `prefers-reduced-motion` 豁免列表，新增动画时记得同步
- 印章在窄屏下隐藏（已有媒体查询规则），并带鼠标反向视差（页面底部 JS）

## 本地预览

纯静态页面，任意静态服务器均可，例如：

```
npx serve .
```

或直接用浏览器打开 `index.html`（Google Fonts 与 Umami 需联网加载）。

## 部署

推送到 `main` 分支即由 GitHub Pages 自动发布。注意保持 canonical / og:url / sitemap 中的 `https://bluewawa.media/` 与实际域名一致。

## 待办

- [ ] Contact 区块中注释掉的 WeChat / LinkedIn 信息待账号就绪后启用
- [ ] 联系表单升级为 Formspree（可选）
