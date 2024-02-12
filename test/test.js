//  chrome-extension://pjmgmbnjicnimjkeoknegopkcofcpjhn/popup.html

const puppeteer = require("puppeteer");
const path = require("path");



async function runTests() {
    let browser;

    try {
        browser = await launchBrowserWithExtension();

        await testExtensionFunctionality(browser);

        console.log('All tests passed successfully!');
    } catch (error) {
        console.log("An error occured during testing:", error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function launchBrowserWithExtension() {
    // point to the source directory, which is one level above the test directory,
    const extensionPath = path.resolve(__dirname, "..", "src");

    return await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`
        ]
    });
}

async function testExtensionFunctionality(browser) {
    const page = await browser.newPage();

    // verify title
    await page.goto(
        "chrome-extension://pjmgmbnjicnimjkeoknegopkcofcpjhn/popup.html"
    );
    const pagetitle = await page.title();
    console.log("Page Title:", pagetitle);

    // verify if pausebutton is present

    const pauseResumeButton = await page.$("button#pauseResumeButton");
    if (pauseResumeButton) {
        console.log("Pause/Resume button found");
    } else {
        console.error("Pause/Resume Button not Found");
    }
}

runTests();
