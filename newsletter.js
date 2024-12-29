// Sign in to newsletter

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.on('response', (response) => {
    const status = response.status(); 
    const url = response.url(); 

    if (status !== 200) {
      console.error(`Non-200 response: ${status} - ${url}`);
    }
  });

  
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    console.log(`Console ${type}: ${text}`);
  });

  page.on('pageerror', (error) => {
    console.error(`Page Error: ${error.message}`);
  });

  await page.goto('https://hiutdenim.co.uk/', { waitUntil: 'load' });

  await page.waitForSelector('input[name="email"]');

  const randomEmail = `user${Math.floor(Math.random() * 100000)}@example.com`;

  await page.type('input[name="email"]', randomEmail);

  await page.waitForSelector('button[type="submit"], input[type="submit"]');
  await page.click('button[type="submit"], input[type="submit"]');

  console.log(`Submitted random email: ${randomEmail}`);

  await browser.close();
})();
