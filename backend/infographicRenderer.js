// ============================================================
// INFOGRAPHIC RENDERER
// Renders HTML/CSS infographic templates to PNG via Puppeteer.
// Produces clean, readable text — unlike AI image generators.
// ============================================================

import puppeteer from 'puppeteer';

// ── Per-format visual themes ───────────────────────────────
const THEMES = {
  'FACT': {
    pageBg: '#f0ebfa', rightBg: '#e2d4f5',
    badgeBg: '#7c4dcc', badgeFg: '#ffffff',
    badgeEmoji: '⭐', badgeLabel: 'FACT:',
    headlineColor: '#1a0a3a', accent: '#7c4dcc',
    pointIcons: ['💡', '❤️', '🏠', '👨‍⚕️'],
  },
  'MYTH': {
    pageBg: '#fff8e0', rightBg: '#fff0b0',
    badgeBg: '#c87020', badgeFg: '#ffffff',
    badgeEmoji: '✗', badgeLabel: 'MYTH BUSTER',
    headlineColor: '#2a1000', accent: '#c87020',
    pointIcons: ['❌', '✅', '⚠️', '💡'],
  },
  'THIS vs THAT': {
    pageBg: '#e8f4fc', rightBg: '#f8e8d8',
    badgeBg: '#2a7aaa', badgeFg: '#ffffff',
    badgeEmoji: '⚖️', badgeLabel: 'THIS vs THAT:',
    headlineColor: '#0a1a35', accent: '#2a7aaa',
    pointIcons: ['✅', '❌', '✅', '❌'],
  },
  'IF YOUR BABY': {
    pageBg: '#d8eef8', rightBg: '#b8def5',
    badgeBg: '#1a7a9a', badgeFg: '#ffffff',
    badgeEmoji: '❤️', badgeLabel: 'IF YOUR BABY...',
    headlineColor: '#0a2030', accent: '#1a7a9a',
    pointIcons: ['ℹ️', '🔬', '💚', '🏥'],
  },
  'DO THIS, NOT THAT': {
    pageBg: '#d8f4e4', rightBg: '#b8e8cc',
    badgeBg: '#1a6a3a', badgeFg: '#ffffff',
    badgeEmoji: '✅', badgeLabel: 'ACTION GUIDE',
    headlineColor: '#0a1f10', accent: '#1a6a3a',
    pointIcons: ['✅', '❌', '✅', '❌'],
  },
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(content, format, illustrationDataUrl) {
  const t = THEMES[format] || THEMES['FACT'];
  const points = (content.points || []).slice(0, 4);
  const sources = content.sources || 'AAP (American Academy of Pediatrics)';

  const pointsHtml = points.map((p, i) => `
    <div class="point">
      <div class="picon" style="background:${t.accent}">${t.pointIcons[i] || '•'}</div>
      <div class="pbody">
        <div class="ptitle">${esc(p.title)}</div>
        <div class="pdetail">${esc(p.detail)}</div>
      </div>
    </div>`
  ).join('');

  const rightHtml = illustrationDataUrl
    ? `<img src="${illustrationDataUrl}" style="width:100%;height:100%;object-fit:cover" />`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body {
  width:1080px; height:1080px;
  font-family:'Nunito','Segoe UI',Arial,sans-serif;
  overflow:hidden;
}
.wrap { display:flex; width:1080px; height:1080px; }
.left {
  width:590px; padding:52px 44px 40px 52px;
  background:${t.pageBg};
  display:flex; flex-direction:column;
}
.right {
  flex:1; background:${t.rightBg};
  display:flex; align-items:center; justify-content:center;
  overflow:hidden;
}
.badge {
  display:inline-flex; align-items:center; gap:7px;
  padding:9px 22px; border-radius:28px;
  background:${t.badgeBg}; color:${t.badgeFg};
  font-size:16px; font-weight:800; letter-spacing:0.3px;
  margin-bottom:22px; width:fit-content;
}
.headline {
  font-size:44px; font-weight:900;
  color:${t.headlineColor}; line-height:1.15;
  margin-bottom:10px;
}
.subtext {
  font-size:17px; font-weight:600;
  color:#667; line-height:1.4;
  margin-bottom:26px;
}
.points { display:flex; flex-direction:column; gap:13px; flex:1; }
.point {
  display:flex; align-items:flex-start; gap:13px;
  background:#fff; border-radius:14px;
  padding:14px 16px;
  box-shadow:0 2px 10px rgba(0,0,0,0.06);
}
.picon {
  width:42px; height:42px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:20px; flex-shrink:0;
}
.pbody { flex:1; }
.ptitle { font-size:15px; font-weight:800; color:#1a1a2e; margin-bottom:4px; }
.pdetail { font-size:13px; color:#555; line-height:1.45; font-weight:500; }
.footer {
  margin-top:22px;
  display:flex; align-items:flex-end; justify-content:space-between;
}
.source-label { font-size:11px; color:#aaa; font-weight:600; margin-bottom:2px; }
.source-text { font-size:12.5px; color:#777; font-weight:700; line-height:1.4; max-width:310px; }
.logo { font-size:30px; font-weight:900; color:${t.headlineColor}; flex-shrink:0; }
.logo sup { font-size:15px; vertical-align:super; }
</style>
</head>
<body>
<div class="wrap">
  <div class="left">
    <div class="badge">${t.badgeEmoji} ${t.badgeLabel}</div>
    <div class="headline">${esc(content.headline || '')}</div>
    <div class="subtext">${esc(content.subtext || '')}</div>
    <div class="points">${pointsHtml}</div>
    <div class="footer">
      <div>
        <div class="source-label">Source:</div>
        <div class="source-text">${esc(sources)}</div>
      </div>
      <div class="logo">nübo<sup>™</sup></div>
    </div>
  </div>
  <div class="right">${rightHtml}</div>
</div>
</body>
</html>`;
}

export async function renderInfographic(content, format, illustrationDataUrl = null) {
  const html = buildHtml(content, format, illustrationDataUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
    ],
  });

  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 30000 });
    const b64 = await page.screenshot({
      type: 'png',
      encoding: 'base64',
      clip: { x: 0, y: 0, width: 1080, height: 1080 },
    });
    return b64;
  } finally {
    await page.close();
    await browser.close();
  }
}
