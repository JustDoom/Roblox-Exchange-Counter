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

document.addEventListener('DOMContentLoaded', function () {
    const convertButton = document.getElementById('convert-button');
    const output = document.getElementById("convert-output");
    const input = document.getElementById("convert-input");
    const currencyOption = document.getElementById('currency');
    const style = document.getElementById('layout');
    const decimalEle = document.getElementById('decimal');

    // Initialize currency and style from storage
    browser.storage.local.get(['currency', 'style', 'decimal']).then(result => {
        currency = result.currency || "USD";
        currencyOption.value = currency;
        style.value = result.style || "%robux% (%symbol%%worth%)";
        decimalEle.value = result.decimal || "3";
    });

    // Convert button click event
    convertButton.addEventListener('click', function () {
        const inputValue = input.value.replace(/[^0-9]/g, '');
        const convertedValue = inputValue * robuxWorth;
        const formattedValue = currencySymbol[currency] + convertedValue.toFixed(decimalEle.value);
        output.innerText = `Worth: ${formattedValue}`;
    });

    // Currency type change event
    currencyOption.addEventListener('change', function () {
        const newCurrency = currencyOption.value;
        chrome.storage.local.set({ 'currency': newCurrency });
        currency = newCurrency;
    });

    // Style change event
    style.addEventListener('change', function () {
        const newStyle = style.value;
        browser.storage.local.set({ 'style': newStyle });
    });

    // Decimal change event
    decimalEle.addEventListener('change', function () {
        const newDecimal = decimalEle.value;
        browser.storage.local.set({ 'decimal': newDecimal });
    });
});