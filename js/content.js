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

if (document.getElementById("nav-robux-amount")) {
    convert();
}

function convert() {
    // if (document.getElementById("nav-robux-amount").innerHTML === "") {
    //     setTimeout(convert, 1);
    // } else {
        fetch('https://api.roblox.com/currency/balance')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const amount = data["robux"];

                document.getElementById("nav-robux-amount").innerHTML = amount + " (" + currencySymbol[currency] + (amount * robuxWorth) + ")";
            }).catch((error) => {
                document.getElementById("nav-robux-amount").innerHTML = "error";
            });
    //}
}