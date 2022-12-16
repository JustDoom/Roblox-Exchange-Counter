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

document.addEventListener('DOMContentLoaded',function () {
    const convertButton = document.getElementById('convert-button');
    convertButton.addEventListener('click', function () {
        const output = document.getElementById("convert-output");
        const input = document.getElementById("convert-input");
        output.innerText = "Worth: " + currencySymbol[currency] + (input.value.replace(/[^0-9]/g, '') * robuxWorth);
    });

    // Listen for currency type change
    const currencyOption = document.getElementById('currency');
    currencyOption.addEventListener('change', function () {
        chrome.storage.local.set({'currency': currencyOption.value});
        currency = currencyOption.value;
    });

    // Get currency type from storage
    chrome.storage.local.get(['currency'], function (result) {
        if (result.currency === undefined) {
            chrome.storage.local.set({'currency': "USD"});
            result.currency = "USD";
        }

        currencyOption.value = result.currency;
    });

    // Listen for style change
    const style = document.getElementById('look-style');
    style.addEventListener('change', function () {
        chrome.storage.local.set({'style': style.value});
    });

    // Get the style from storage
    chrome.storage.local.get(['style'], function (result) {
        if (result.style === undefined) {
            chrome.storage.local.set({'style': "%robux% (%symbol%%worth%)"});
            result.style = "%robux% (%symbol%%worth%)";
        }

        style.value = result.style;
    });

    // Listen for decimal change
    const decimalEle = document.getElementById('decimal');
    decimalEle.addEventListener('change', function () {
        chrome.storage.local.set({'decimal': decimalEle.value});
    });

    // Get the decimal from storage
    chrome.storage.local.get(['decimal'], function (result) {
        if (result.decimal === undefined) {
            chrome.storage.local.set({'decimal': "3"});
            result.decimal = "3";
        }

        decimalEle.value = result.decimal;
    });
});