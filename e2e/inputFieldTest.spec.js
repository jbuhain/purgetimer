const { bootstrap } = require('./bootstrap');

// This should test the user typing in valid/invalid input in the timer

describe('user sets a valid input', () => {
    let browser, popupPage, ISHEADLESS;

    beforeAll(async () => {
        ISHEADLESS = true;
        const context = await bootstrap({ devtools: false, headless: ISHEADLESS });

        browser = context.browser;
        popupPage = context.popupPage;
    });

    test('user sets the timer and presses button', async () => {
        await popupPage.type('#timerInput', '5959');
        // console.log("pauseResumeButton:", pauseResumeButton);

        // Wait for a brief moment to ensure the input is processed
        await popupPage.waitForTimeout(500);

        // Get the value of the input field
        const inputValue = await popupPage.$eval('#timerInput', input => input.value);
        console.log(inputValue);

        // Assert that the input value is '09:99' (program formats it)
        expect(inputValue).toBe('59:59');

        // press start button
        const button = await popupPage.$('#pauseResumeButton');
        // Click on the button
        await button.click();
        // Wait for a brief moment to ensure the button is clicked and scene updated
        await popupPage.waitForTimeout(500);
    });

    test('should update topHeading', async () => {
        const topHeadingInnerText = await popupPage.evaluate(() => {
            return document.querySelector('#topHeading').textContent;
        });
        // console.log("topHeading:", topHeadingInnerText);
        expect(topHeadingInnerText).toBe('purging in');
    });

    test('should update pauseResumeButton with innertext "pause"', async () => {
        const pauseResumeButton = await popupPage.evaluate(() => {
            return document.querySelector('#pauseResumeButton').textContent;
        });
        // console.log("pauseResumeButton:", pauseResumeButton);
        expect(pauseResumeButton).toBe('pause');
    });

    test('should now show resetButton', async () => {
        const displayProperty_resetButton = await popupPage.evaluate(() => {
            const resetButton = document.querySelector('#resetButton');
            return window.getComputedStyle(resetButton).getPropertyValue('display');
        });
        // console.log("displayProperty_resetButton:", displayProperty_resetButton);
        expect(displayProperty_resetButton).toBe('block');
    });

    afterAll(async () => {
        // await new Promise(resolve => setTimeout(resolve, 10000));
            
            await browser.close();

    });
});

// expect(true).toBe(true);