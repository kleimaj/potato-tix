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
        let dateSelector = await page.waitForSelector('.date')
        
        let ticketButton = await page.waitForSelector('.event > div > a');
        // Extract text
        var artist = await page.evaluate(element => element.textContent, element);
        let date = await page.evaluate(dateSelector => dateSelector.textContent, dateSelector);
        // Log Text
        var href = await page.evaluate(ticketButton => ticketButton.href, ticketButton);

        await page.goto(href); // wait for the page to load

        var res = await page.evaluate(()=> {
            // get ticket group elements
            const resultMap = {
                artist: '',
                date: '',
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
                    const tixAvailable = parseInt(elements[idx].querySelector('input').value);
                    if (isPatio) {
                        const count = PATIO_COUNT - tixAvailable;
                        ticketCount+= count;
                        resultMap['patio'] = count;
                    }
                    else {
                        const count = (INSIDE_COUNT - tixAvailable);
                        ticketCount+= count;
                        // refactor this
                        if ('set1' in resultMap) {
                            resultMap['set2'] = count;
                        } else {
                            resultMap['set1'] = count;
                        }
                    }
                } else { //it's sold out, add to ticketCount
                    if (isPatio) {
                        ticketCount+= PATIO_COUNT;
                        resultMap['patio'] = PATIO_COUNT;
                    } else {
                        ticketCount+= INSIDE_COUNT;
                        // refactor this
                        if ('set1' in resultMap) {
                            resultMap['set2'] = INSIDE_COUNT;
                        } else if (idx == 1) {
                            resultMap['set1'] = INSIDE_COUNT;
                        }
                    }
                }
            })
            resultMap['ticketCount'] = ticketCount;
            return resultMap;

        });
        res['artist'] = artist;
        res['date'] = date;
        console.log(res);
        // Close Browser instance
        browser.close();
}
scrape();