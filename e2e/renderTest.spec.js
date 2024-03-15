const { bootstrap } = require('./bootstrap');

describe('verify all possible scenes', () => {
    let browser, popupPage, ISHEADLESS;

    beforeAll(async () => {

        ISHEADLESS = true;
        const context = await bootstrap({ devtools: false, headless: ISHEADLESS });

        browser = context.browser;
        popupPage = context.popupPage;

    });

    describe('verify first scene: set timer', () => {
        test('should show title', async () => {
            const pagetitle = await popupPage.title();
            expect(pagetitle).toBe('Purge Timer');
        });

        test('should show topHeading', async () => {
            const topHeadingInnerText = await popupPage.evaluate(() => {
                return document.querySelector('#topHeading').textContent;
            });
            expect(topHeadingInnerText).toBe('purge timer');
        });

        test('should show bottomText', async () => {
            const bottomText = await popupPage.evaluate(() => {
                return document.querySelector('#bottomText').textContent;
            });
            expect(bottomText).toBe('Purge will close all tabs in all windows.');
        });

        test('should show timerInput placeholder', async () => {
            const timerInput = await popupPage.evaluate(() => {
                return document.querySelector('#timerInput').getAttribute('placeholder');
            });
            expect(timerInput).toBe('00:00');
        });

        test('should show pauseResumeButton with innertext "start"', async () => {
            const pauseResumeButton = await popupPage.evaluate(() => {
                return document.querySelector('#pauseResumeButton').textContent;
            });
            expect(pauseResumeButton).toBe('start');
        });

        test('should hide resetButton', async () => {
            const displayProperty_resetButton = await popupPage.evaluate(() => {
                const resetButton = document.querySelector('#resetButton');
                return window.getComputedStyle(resetButton).getPropertyValue('display');
            });
            expect(displayProperty_resetButton).toBe('none');
        });
    });

    describe('verify second scene: timer ticking', () => {

        test('user sets the timer and presses start button', async () => {
            await popupPage.type('#timerInput', '5959');
            await popupPage.waitForTimeout(500); // to make sure input is processed

            const inputValue = await popupPage.$eval('#timerInput', input => input.value);

            expect(inputValue).toBe('59:59');

            const button = await popupPage.$('#pauseResumeButton');
            await button.click();
            await popupPage.waitForTimeout(500);
        });
        test('should update topHeading', async () => {
            const topHeadingInnerText = await popupPage.evaluate(() => {
                return document.querySelector('#topHeading').textContent;
            });
            expect(topHeadingInnerText).toBe('purging in');
        });

        test('should update pauseResumeButton with innertext "pause"', async () => {
            const pauseResumeButton = await popupPage.evaluate(() => {
                return document.querySelector('#pauseResumeButton').textContent;
            });
            expect(pauseResumeButton).toBe('pause');
        });

        test('should now show resetButton', async () => {
            const displayProperty_resetButton = await popupPage.evaluate(() => {
                const resetButton = document.querySelector('#resetButton');
                return window.getComputedStyle(resetButton).getPropertyValue('display');
            });
            expect(displayProperty_resetButton).toBe('block');
        });
    });


    describe('verify third scene: timer paused', () => {
        test('Press pause and button innertext should change to "resume"', async () => {
            const pauseResumeButton = await popupPage.$('#pauseResumeButton');
            await pauseResumeButton.click();
            await popupPage.waitForTimeout(500);
            const buttonText = await popupPage.evaluate(() => {
                return document.querySelector('#pauseResumeButton').textContent;
            });
            expect(buttonText).toBe('resume');
        });

        test('should show resetButton', async () => {
            const displayProperty_resetButton = await popupPage.evaluate(() => {
                const resetButton = document.querySelector('#resetButton');
                return window.getComputedStyle(resetButton).getPropertyValue('display');
            });
            expect(displayProperty_resetButton).toBe('block');
        });

        test('should update topHeading to "timer paused"', async () => {
            const topHeadingInnerText = await popupPage.evaluate(() => {
                return document.querySelector('#topHeading').textContent;
            });
            expect(topHeadingInnerText).toBe('timer paused');
        });
    });

    describe('verify fourth scene: timer resetted', () => {
        test('Click reset button and should disappear', async () => {
            const resetButton = await popupPage.$('#resetButton');
            await resetButton.click();
            await popupPage.waitForTimeout(500);
            const displayProperty_resetButton = await popupPage.evaluate(() => {
                const resetButton = document.querySelector('#resetButton');
                return window.getComputedStyle(resetButton).getPropertyValue('display');
            });
            expect(displayProperty_resetButton).toBe('none');
        });

        test('should show topHeading', async () => {
            const topHeadingInnerText = await popupPage.evaluate(() => {
                return document.querySelector('#topHeading').textContent;
            });
            expect(topHeadingInnerText).toBe('purge timer');
        });

        test('should show pauseResumeButton with innertext "start"', async () => {
            const pauseResumeButton = await popupPage.evaluate(() => {
                return document.querySelector('#pauseResumeButton').textContent;
            });
            expect(pauseResumeButton).toBe('start');
        });


        test('should show previously inputted timerInput placeholder', async () => {
            const inputElement = await popupPage.$('#timerInput');
            const inputValue = await popupPage.evaluate(input => input.value, inputElement);
            expect(inputValue).toBe('59:59');
        });

    });

    afterAll(async () => {
        await browser.close();
    });
});