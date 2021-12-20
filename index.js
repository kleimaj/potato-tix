// https://dev.to/code_jedi/web-scraping-in-nodejs-2lkf
const puppeteer = require('puppeteer');


// https://www.thebakedpotato.com/events-calendar/
// https://www.thesaurus.com/browse/smart

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
            let resultMap = {
                ticketCount: 0,
                set1: 0,
                set2: 0,
                patio: 0
            }
            const PATIO_COUNT = 26;
            const INSIDE_COUNT = 65;
            let ticketCount = 0;
            const elements = Array.from(document.querySelectorAll('.tribe-tickets__item'));
            // check if sold out
            const availablitiy = elements.map((item) => item.getAttribute('data-available'));
            availablitiy.forEach((available, idx) => {
                const isPatio = elements[idx].querySelector('.tribe-tickets__item__content__title').textContent.includes('Patio');
                if (available) { // compute amount of tickets available
                    for (let i = 0; i < 70; i++) {
                        elements[idx].querySelector('.tribe-tickets__item__quantity__add').click();
                    }
                    const tixAvailable = parseInt(elements[idx].querySelector('input').value)
                    if (isPatio) {
                        const count = PATIO_COUNT - tixAvailable
                        ticketCount+= count;
                        resultMap['patio'] = count;
                    }
                    else {
                        const count = (INSIDE_COUNT - tixAvailable)
                        ticketCount+= count;
                        if (idx == 0) {
                            resultMap['set1'] = count;
                        } else {
                            resultMap['set2'] = count;
                        }
                    }
                } else { //it's sold out, add to ticketCount
                    if (isPatio) {
                        ticketCount+= PATIO_COUNT
                        resultMap['patio'] = PATIO_COUNT;
                    } else {
                        ticketCount+= INSIDE_COUNT
                        if (idx == 0) {
                            resultMap['set1'] = INSIDE_COUNT;
                        } else if (idx == 1) {
                            resultMap['set2'] = INSIDE_COUNT;
                        }
                    }
                }
            })
            resultMap['ticketCount'] = ticketCount;
            return resultMap

        });

        console.log(res)
        // Close Browser instance
        browser.close()
}
scrape();