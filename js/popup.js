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

const convertButton = document.getElementById('convert-button');
convertButton.addEventListener('click', function () {
    const output = document.getElementById("convert-output");
    const input = document.getElementById("convert-input");
    output.innerText = "Worth: " + currencySymbol[currency] + (input.value.replace(/[^0-9]/g, '') * robuxWorth);
});

const currencyOption = document.getElementById('currency');
currencyOption.addEventListener('change', function() {
    chrome.storage.local.set({'currency': document.getElementById('currency').value});
    currency = currencyOption.value;
});

chrome.storage.local.get(['currency'], function(result) {
    document.getElementById('currency').value = result.currency;
});