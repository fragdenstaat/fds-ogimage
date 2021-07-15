import core from 'puppeteer-core';
import { getOptions } from './options';

let _page: core.Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
    const options = await getOptions(isDev);
    const browser = await core.launch(options);
    _page = await browser.newPage();
    return _page;
}

export async function getScreenshot(html: string, isDev: boolean) {
    const page = await getPage(isDev);
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(html);

    // Use Github's waiting on DOM:
    // https://github.blog/2021-06-22-framework-building-open-graph-images/
    await page.evaluate(async () => {
        const selectors = Array.from(document.querySelectorAll("img"));
        await Promise.all([
            document.fonts.ready,
            ...selectors.map((img) => {
                // Image has already finished loading, let’s see if it worked
                if (img.complete) {
                    // Image loaded and has presence
                    if (img.naturalHeight !== 0) return;
                    // Image failed, so it has no height
                    throw new Error("Image failed to load");
                }
                // Image hasn’t loaded yet, added an event listener to know when it does
                return new Promise((resolve, reject) => {
                    img.addEventListener("load", resolve);
                    img.addEventListener("error", reject);
                });
            }),
        ]);
    });
    const file = await page.screenshot({ type: 'png' });
    return file;
}
