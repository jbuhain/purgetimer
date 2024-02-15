const puppeteer = require('puppeteer');
const path = require("path");

async function bootstrap(options = {}) {
    const { headless: headlessOption = false, devtools = false } = options;
    let headless = headlessOption;
    const extensionPath = path.resolve(__dirname, "..", "purgetimer-chrome-extension");
    
    // Puppeteer changed their headless implementation
    // OLD: headless: true
    // NEW: headless: "new"
    if (headless === true) {
        headless = "new";
    }

    try {
        const browser = await puppeteer.launch({
            headless : "new",
            devtools,
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`,
            ],
        });

        const popupPage = await browser.newPage();
        await popupPage.goto("chrome-extension://lkinbooaammpplinggfjikljjpdobaic/popup.html", { waitUntil: 'load' });

        return {
            browser,
            popupPage,
        };
    } catch (error) {
        console.error('Error occurred during bootstrap:', error);
        throw error;
    }
}
module.exports = { bootstrap };