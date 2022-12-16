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

convert();

async function convert() {
    if (document.getElementById("nav-robux-amount").innerHTML === "") {
        setTimeout(convert, 50);
    } else {
        const balance = await fetch('https://economy.roblox.com/v1/user/currency')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const amount = data['robux'];
                chrome.storage.local.get(['style'], async function (result) {
                    let i;
                    const style = result.style === undefined ? "%robux% (%symbol%%worth%)" : result.style;

                    let groupElement = document.querySelectorAll(".text-robux, .text-robux-lg, .text-robux-tile, .ng-binding > .icon-robux-container");
                    if (groupElement.length > 0) {
                        const length = groupElement.length;
                        for (i = 0; i < length; i++) {
                            const element = groupElement[i];
                            element.innerHTML = await convertWorth(style, element.innerHTML);
                        }
                    }

                    document.getElementById("nav-robux-amount").innerHTML = await convertWorth(style, amount);
                });

            }).catch((error) => {
                document.getElementById("nav-robux-amount").innerHTML = error;
            });
    }
}

async function convertWorth(style, amount) {
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
