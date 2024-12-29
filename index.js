// Load the products

const puppeteer = require('puppeteer');
const fs = require('fs');

const logFilePath = 'logs.txt';
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '', 'utf8'); 
}

(async () => {
  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();

  const logToFileAndConsole = (message) => {
    console.log(message); 
    fs.appendFileSync(logFilePath, `${message}\n`, 'utf8'); 
  };

  page.on('console', (msg) => {
    if (msg.type() === 'error') {  
      logToFileAndConsole(`Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', (error) => {
    logToFileAndConsole(`JavaScript Error: ${error.message}`);
  });

  page.on('response', (response) => {
    const status = response.status();
    const url = response.url();

    if (status !== 200) {
      logToFileAndConsole(`API Error: ${status} - ${url}`);
    }
  });

  page.on('requestfailed', (request) => {
    logToFileAndConsole(`Request Failed: ${request.url()} - ${request.failure().errorText}`);
  });

  logToFileAndConsole("Navigating to the home page...");
  await page.goto('https://hiutdenim.co.uk/', { waitUntil: 'networkidle2' });

  logToFileAndConsole("Waiting for the 'Made to Order' link...");
  await page.waitForSelector('a[href="/pages/made-to-order"]');
  logToFileAndConsole("Clicking on the 'Made to Order' category...");
  await page.click('a[href="/pages/made-to-order"]');

  logToFileAndConsole("Navigating to the 'Made to Order Men's' collection...");
  await page.goto('https://hiutdenim.co.uk/collections/made-to-order-mens', { waitUntil: 'networkidle2' });

  logToFileAndConsole("Waiting for the pagination button...");
  await page.waitForSelector(".next"); 
  logToFileAndConsole("Clicking on the 'Next' button...");
  await page.click(".next"); 

  logToFileAndConsole("Waiting for the footer section to ensure the page has fully loaded...");
  await page.waitForSelector(".copyright-text"); 

  logToFileAndConsole("End of Page");

  await browser.close();
})();
