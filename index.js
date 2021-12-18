// https://dev.to/code_jedi/web-scraping-in-nodejs-2lkf
const puppeteer = require('puppeteer');

async function scrape(){
    // Initialize Browser instance
    const browser = await puppeteer.launch({});
    // Initialize Page variable
    const page = await browser.newPage();

    // Navigate to page
    await page.goto('https://www.thesaurus.com/browse/smart');
    // Grab selector of first element
    let element = await page.waitForSelector("#meanings > div.css-ixatld.e15rdun50 > ul > li:nth-child(1) > a")
    // Extract text
    var text = await page.evaluate(element => element.textContent, element)
    // Log Text
    console.log(text)
    // Close Browser instance
    browser.close()
}
scrape();