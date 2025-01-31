const robuxWorth = 0.0035;
let currency = "USD";
let lastFetched;
let value;

// TODO: make this a json file or something. maybe in the currency API
const currencySymbol = {
    'AUD': '\u0024', // Australian Dollar
    'USD': '\u0024', // United States Dollar
    'GBP': '\u00A3', // British Pound
    'EUR': '\u20AC', // Euro
    'JPY': '\u00A5', // Japanese Yen
    'CAD': '\u0024', // Canadian Dollar
    'CHF': '\u20A3', // Swiss Franc
    'CNY': '\u00A5', // Chinese Yuan (Renminbi)
    'INR': '\u20B9', // Indian Rupee
    'KRW': '\u20A9', // South Korean Won
    'BRL': '\u0052\u0024', // Brazilian Real (R$)
    'RUB': '\u20BD', // Russian Ruble
    'ZAR': '\u0052', // South African Rand
    'MXN': '\u0024', // Mexican Peso
    'NZD': '\u0024', // New Zealand Dollar
    'SGD': '\u0024', // Singapore Dollar
    'TRY': '\u20BA', // Turkish Lira
    'SEK': '\u006B\u0072', // Swedish Krona (kr)
    'NOK': '\u006B\u0072', // Norwegian Krone (kr)
    'DKK': '\u006B\u0072', // Danish Krone (kr)
};

browser.storage.local.get(['replaceBalance', 'replaceElse', 'value', `lastFetched`, `currency`]).then(async result => {
    lastFetched = result.lastFetched || 0;
    value = result.value || 1;
    currency = result.currency || "USD";

    if (Date.now() - lastFetched > 21600000 || value === -1) { // Every 6 hours or on currency switch
        fetchNewData().then(data => {
            value = data[currency.toLowerCase()];
            browser.storage.local.set({ 'lastFetched': Date.now(), 'value': value });
        })
    }

    if (result.replaceElse !== undefined ? result.replaceElse : true) {
        waitForElements([".text-robux", ".text-robux-lg", ".text-robux-tile"], (element) => {
            observeContent(element);
            if (element.innerHTML.trim() !== "") {
                convert(element, element.innerHTML);
            }
        });
    }

    if (result.replaceBalance !== undefined ? result.replaceBalance : true) {
        waitForElements(["#nav-robux-amount"], async (element) => {
            observeContent(element);
            if (element.innerHTML.trim() !== "") {
                const robux = await getCurrentAccountRobux();
                convert(element, robux);
            }
        });
    }
});

async function fetchNewData() {
    try {
        let response = await browser.runtime.sendMessage({ action: "fetch_currency_data" });
        if (!response.success) {
            console.error("Error fetching currency data:", response.error);
            return undefined;
        }

        return response.data.usd;
    } catch (error) {
        console.error("Message sending failed:", error);
    }
}

async function convert(element, value) {
    if (value.toString().includes(currencySymbol[currency]) || !hasNumber(value)) return;
    element.innerHTML = await styleWorth(value);
}

async function styleWorth(amount) {
    const style = await browser.storage.local.get(['style']).then((result) => {
        return result.style === undefined ? "%robux% (%symbol%%worth%)" : result.style;
    });

    return style.toString()
        .replaceAll('%robux%', amount)
        .replaceAll('%symbol%', currencySymbol[currency])
        .replaceAll('%worth%', await calculateWorth(amount));
}

async function calculateWorth(robux) {
    let decimal = await browser.storage.local.get(['decimal']).then((result) => {
        return result.decimal === undefined ? 3 : result.decimal;
    });
    const round = Math.pow(10, decimal);
    return Math.round(robux.toString().replace(/[^0-9]/g, '') * robuxWorth * round * value) / round;
}

async function getCurrentAccountRobux() {
    try {
        const response = await fetch('https://economy.roblox.com/v1/user/currency', {
            method: 'GET',
            credentials: 'include' // Ensure cookies are sent automatically
        });
        const data = await response.json();
        return data.robux;
    } catch (error) {
        document.getElementById("nav-robux-amount").innerHTML = error;
    }
}

function hasNumber(value) {
    return /\d/.test(value);
}

function waitForElements(selectors, callback) {
    const foundElements = new Set();

    const observer = new MutationObserver(() => {
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector); // Select all elements
            elements.forEach((element) => {
                if (!foundElements.has(element)) {
                    foundElements.add(element);
                    callback(element, selector);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector); // Select all elements
        elements.forEach((element) => {
            if (!foundElements.has(element)) {
                foundElements.add(element);
                callback(element, selector);
            }
        });
    });

    if (foundElements.size >= selectors.length) {
        observer.disconnect();
    }
}

function observeContent(element) {
    const observer = new MutationObserver(() => {
        if (element.innerHTML.trim() !== "") {
            observer.disconnect();
            console.log("loaded")
            convert(element, element.innerHTML);
        }
    });

    observer.observe(element, { childList: true, subtree: true });
}