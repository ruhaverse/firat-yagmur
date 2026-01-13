const puppeteer = require('puppeteer');

async function run() {
  const url = process.env.URL || 'http://localhost:3001/newsfeed';
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = `${msg.type().toUpperCase()}: ${msg.text()}`;
    logs.push(text);
    console.log(text);
  });
  page.on('pageerror', err => {
    const text = `PAGEERROR: ${err.toString()}`;
    logs.push(text);
    console.error(text);
  });
  page.on('response', res => {
    const url = res.url();
    const status = res.status();
    if (status >= 400) {
      const text = `HTTP ${status}: ${url}`;
      logs.push(text);
      console.warn(text);
    }
  });

  console.log('navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.error('goto failed', e && e.message));

  // wait a bit for async JS to run
  await new Promise((r) => setTimeout(r, 3000));

  // capture console and take screenshot
  await page.screenshot({ path: 'newsfeed-headless.png', fullPage: true }).catch(()=>{});

  await browser.close();
  console.log('finished');
}

run().catch(err => { console.error(err); process.exit(1); });
