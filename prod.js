const puppeteer = require('puppeteer');

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({ headless: false }); // headless: false to see the browser window
  const page = await browser.newPage();

  // Go to the page you want to crawl
  await page.goto('https://hiutdenim.co.uk/collections/made-to-order-mens', { waitUntil: 'load' });

  // Wait for the page to load (wait for an element or specific selector that indicates the page is loaded)
  await page.waitForSelector(".footer-copyright");  // Example selector, adjust as needed
  
  // Scroll to the bottom of the page repeatedly until no new content is loaded
  let previousHeight;
  let currentHeight = await page.evaluate('document.body.scrollHeight');
  
  while (true) {
    // Scroll down to the bottom of the page
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    
    // Wait for the content to load
    // await page.waitForTimeout(1000);  // Wait for new content to load (adjust the timeout if needed)

    // Calculate new height and check if the height has changed (indicating new content)
    previousHeight = currentHeight;
    currentHeight = await page.evaluate('document.body.scrollHeight');
    
    // If the height is the same, we've reached the bottom of the page
    if (currentHeight === previousHeight) {
      break;
    }
  }

  console.log('Reached the end of the page.');

  // Optionally, take a screenshot after scrolling to the end
  await page.screenshot({ path: 'end_of_page.png' });

  // Close the browser
  await browser.close();
})();
