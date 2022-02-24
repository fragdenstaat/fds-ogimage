interface Options {
    args: string[];
    executablePath: string;
    headless: boolean;
}

const exePath = process.platform === 'win32'
? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
: process.platform === 'linux'
? '/usr/bin/google-chrome'
: '/Applications/Chromium.app/Contents/MacOS/Chromium';


export async function getOptions(isDev: boolean) {
    let options: Options;
    if (isDev) {
        options = {
            args: [],
            executablePath: exePath,
            headless: true
        }
    } else {
        options = {
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            executablePath: '/usr/bin/chromium-browser',
            headless: true
        }
    }
    return options;
}
