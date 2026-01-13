const fs = require('fs');
const path = require('path');
const url = process.env.TARGET_URL || 'http://localhost:3001';
(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const logs = [];
    page.on('console', msg => {
      try {
        const args = msg.args();
        Promise.all(args.map(a => a.jsonValue().catch(() => a.toString()))).then(values => {
          logs.push({type: msg.type(), text: values.join(' '), location: msg.location ? msg.location() : null});
        });
      } catch(e){
        logs.push({type: msg.type(), text: msg.text()});
      }
    });
    page.on('pageerror', err => {
      logs.push({type: 'pageerror', text: err.message, stack: err.stack});
    });
    page.on('requestfailed', req => {
      logs.push({type: 'requestfailed', url: req.url(), failure: req.failure()});
    });

    await page.setViewport({width: 1280, height: 900});
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 }).catch(()=>{});
    // try to open newsfeed route if available
    try { await page.goto(url + '/newsfeed', { waitUntil: 'networkidle2', timeout: 20000 }); } catch(e) {}
    // wait a bit to let client-side code run
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    await sleep(6000);

    const screenshotPath = path.resolve(__dirname, 'newsfeed_screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // ensure logs have settled
    await sleep(200);
    await browser.close();

    const out = { ok: true, url, screenshot: screenshotPath, logs };
    const outPath = path.resolve(__dirname, 'headless_newsfeed_result.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.log(JSON.stringify(out));
    process.exit(0);
  } catch (err) {
    console.error('ERROR', err && (err.message || err));
    process.exit(2);
  }
})();