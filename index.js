// https://dev.to/code_jedi/web-scraping-in-nodejs-2lkf
const puppeteer = require('puppeteer');

// https://www.thebakedpotato.com/events-calendar/
// https://www.thesaurus.com/browse/smart

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
async function potatoScrape() {
        // Initialize Browser instance
        const browser = await puppeteer.launch({});
        // Initialize Page variable
        const page = await browser.newPage();
    
        // Navigate to page
        await page.goto('https://www.thebakedpotato.com/events-calendar/');
        // Grab selector of first element
        // let element = await page.waitForSelector("#event-1327 > div > h1");
        let element = await page.waitForSelector(".event > div > h1");
        
        let ticketButton = await page.waitForSelector('.event > div > a');
        // Extract text
        var text = await page.evaluate(element => element.textContent, element)
        // Log Text
        console.log(text);
        var href = await page.evaluate(ticketButton => ticketButton.href, ticketButton);
        // console.log(href)
        await page.goto(href); // wait for the page to load

        // var ticketItems = await page.waitForSelector('.tribe-tickets__item');
        // var nodeList = await page.evaluate(ticketItems => ticketItems.id, ticketItems)
        var nodeList = await page.evaluate(()=> Array.from(document.querySelectorAll('.tribe-tickets__item'), e => e.id));

        // console.log(ticketItems)
        console.log(nodeList)
        // Close Browser instance
        browser.close()
}
potatoScrape();