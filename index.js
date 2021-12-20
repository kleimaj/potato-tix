// https://dev.to/code_jedi/web-scraping-in-nodejs-2lkf
const puppeteer = require('puppeteer');

// https://www.thebakedpotato.com/events-calendar/
// https://www.thesaurus.com/browse/smart

async function getTicketCount(selector, page) {
    console.log(selector)
    var el = await page.evaluate(()=> document.querySelector('.'+selector))
    console.log(el);
}

async function scrape() {
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
        var res = await page.evaluate(()=> {
            // return Array.from(document.querySelectorAll('.tribe-tickets__item'), e => e.id)
            // get ticket group elements
            const isPatio = elements[idx].querySelector('.tribe-tickets__item__content__title').textContent.includes('Patio')
            let ticketCount = 0;
            const elements = Array.from(document.querySelectorAll('.tribe-tickets__item'));
            // check if sold out
            const availablitiy = elements.map((item) => item.getAttribute('data-available'))
            availablitiy.forEach((available, idx) => {
                if (available) { // compute amount of tickets available
                    for (let i = 0; i < 70; i++) {
                        elements[idx].querySelector('.tribe-tickets__item__quantity__add').click();
                    }
                    const tixAvailable = parseInt(element[idx].querySelector('input').value)
                } else { //it's sold out, add to ticketCount
                    if (isPatio) {
                        ticketCount+= 26
                    } else {
                        ticketCount+= 65
                    }
                }
            })

        });

        // console.log(ticketItems)
        console.log(res)
        // await nodeList.forEach((item) => {
        // for (const item of nodeList) {
        //     // await getTicketCount(item, page)
        //     const el = await page.evaluate((item)=> {
        //         return document.getElementById(item);
        //     })
        //     console.log(el);
        // };
        // Close Browser instance
        browser.close()
}
scrape();