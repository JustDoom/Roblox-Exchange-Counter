const robuxWorth = 0.0035;
let currency = "USD";

// TODO: make this a json file or something. maybe in the currency API
const currencySymbol = {
    'AUD': '\u0024',
    'CAD': '\u0024',
    'EUR': '\u20AC',
    'GBP': '\u00A3',
    'HKD': '\u0024',
    'INR': '\u20B9',
    'JPY': '\u00A5',
    'NZD': '\u0024',
    'PHP': '\u20B1',
    'RUB': '\u20BD',
    'THB': '\u0E3F',
    'TRY': '\u20BA',
    'USD': '\u0024',
};

waitForElements([".text-robux", ".text-robux-lg", ".text-robux-tile"], (element) => {
    observeContent(element);
    if (element.innerHTML.trim() !== "") {
        convert(element, element.innerHTML);
    }
});

waitForElements(["#nav-robux-amount"], async (element) => {
    observeContent(element);
    if (element.innerHTML.trim() !== "") {
        const robux = await getCurrentAccountRobux();
        convert(element, robux);
    }
});

async function convert(element, value) {
    if (value.toString().includes("$") || !hasNumber(value)) return;
    element.innerHTML = await styleWorth(value);
}

async function styleWorth(amount) {
    const style = await chrome.storage.local.get(['style']).then((result) => {
        return result.style === undefined ? "%robux% (%symbol%%worth%)" : result.style;
    });

    return style.toString()
        .replaceAll('%robux%', amount)
        .replaceAll('%symbol%', currencySymbol[currency])
        .replaceAll('%worth%', await calculateWorth(amount));
}

async function calculateWorth(robux) {
    let decimal = await chrome.storage.local.get(['decimal']).then((result) => {
        return result.decimal === undefined ? 3 : result.decimal;
    });
    const round = Math.pow(10, decimal);
    return Math.round(robux.toString().replace(/[^0-9]/g, '') * robuxWorth * round) / round;
}

async function getCurrentAccountRobux() {
    try {
        const response = await fetch('https://economy.roblox.com/v1/user/currency');
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