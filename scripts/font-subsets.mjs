// Subset only static display fonts. Latin text keeps the regular Inter/Playfair request.
// Include ASCII and punctuation for labels that mix Chinese and English.
export function chineseFontUrl(html) {
  const source = html.replace(/<!-- CHINESE_FONTS:START -->[\s\S]*?<!-- CHINESE_FONTS:END -->/, '');
  const ascii = Array.from({length: 95}, (_, i) => String.fromCharCode(32 + i)).join('');
  const chinese = source.match(/[\p{Script=Han}\u3000-\u303f\uff00-\uffef]/gu) || [];
  const text = [...new Set(ascii + '‘’“”–—…·' + chinese.join(''))].sort().join('');
  return `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;700;900&display=swap&text=${encodeURIComponent(text)}`;
}

export function updateChineseFonts(html) {
  const marker = /<!-- CHINESE_FONTS:START -->[\s\S]*?<!-- CHINESE_FONTS:END -->/;
  if (!marker.test(html)) throw new Error('Missing Chinese font markers');
  return html.replace(marker, `<!-- CHINESE_FONTS:START -->\n<link rel="stylesheet" href="${chineseFontUrl(html).replace(/&/g, '&amp;')}" />\n<!-- CHINESE_FONTS:END -->`);
}
