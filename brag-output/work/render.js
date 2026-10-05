const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const mode = process.argv[2] || 'stills';
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY }, args: ['--ignore-certificate-errors'] });
  const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/video.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.ready);
  if (errs.length) console.log('errors', errs);
  if (mode === 'stills') {
    fs.mkdirSync(__dirname + '/stills', { recursive: true });
    const ts = (process.argv[3] || '0.3,1.0,1.4,2.6,3.2,4.2,6.5,7.12,7.8,8.75,9.7,10.8,11.35,11.7,12.2,13.7,15.32,15.65,16.3,17.6,18.6,19.3,21.0').split(',').map(Number);
    for (const t of ts) { await p.evaluate(t => window.setT(t), t); await p.screenshot({ path: `${__dirname}/stills/t_${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 80 }); }
  } else {
    fs.mkdirSync(__dirname + '/frames', { recursive: true });
    const N = 22 * 30;
    for (let f = 0; f < N; f++) {
      await p.evaluate(t => window.setT(t), f / 30);
      await p.screenshot({ path: `${__dirname}/frames/f_${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
      if (f % 60 === 0) console.log('frame', f);
    }
  }
  console.log('done', errs.length ? errs : '');
  await b.close();
})();
