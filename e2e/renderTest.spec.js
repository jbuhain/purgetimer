const { bootstrap } = require('./bootstrap');

describe('verify first scene', () => {
    let browser, popupPage;

    beforeAll(async () => {
        const context = await bootstrap({ devtools: true });

        browser = context.browser;
        popupPage = context.popupPage;
    });

    test('should show title', async () => {
        const pagetitle = await popupPage.title();
        // console.log("Page Title:", pagetitle);
        expect(pagetitle).toBe('Purge Timer');
    });

    test('should show topHeading', async () => {
        const topHeadingInnerText = await popupPage.evaluate(() => {
            return document.querySelector('#topHeading').textContent;
        });
        // console.log("topHeading:", topHeadingInnerText);
        expect(topHeadingInnerText).toBe('purge timer');
    });

    test('should show bottomText', async () => {
        const bottomText = await popupPage.evaluate(() => {
            return document.querySelector('#bottomText').textContent;
        });
        // console.log("bottomText:", bottomText);
        expect(bottomText).toBe('Purge will close all tabs in all windows.');
    });

    test('should show timerInput placeholder', async () => {
        const timerInput = await popupPage.evaluate(() => {
            return document.querySelector('#timerInput').getAttribute('placeholder');
        });
        // console.log("timerInput:", timerInput);
        expect(timerInput).toBe('00:00');
    });

    test('should show pauseResumeButton with innertext "start"', async () => {
        const pauseResumeButton = await popupPage.evaluate(() => {
            return document.querySelector('#pauseResumeButton').textContent;
        });
        // console.log("pauseResumeButton:", pauseResumeButton);
        expect(pauseResumeButton).toBe('start');
    });

    test('should hide resetButton', async () => {
        const displayProperty_resetButton = await popupPage.evaluate(() => {
            const resetButton = document.querySelector('#resetButton');
            return window.getComputedStyle(resetButton).getPropertyValue('display');
        });
        // console.log("displayProperty_resetButton:", displayProperty_resetButton);
        expect(displayProperty_resetButton).toBe('none');
    });

    afterAll(async () => {
        // await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    });
});