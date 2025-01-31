const robuxWorth = 0.0035;
let currency = "USD";

// TODO: make this a json file or something. maybe in the currency API
const currencySymbol = {
    'AUD': '\u0024', // Australian Dollar
    'USD': '\u0024', // United States Dollar
    'GBP': '\u00A3', // British Pound
    'EUR': '\u20AC', // Euro
    'YEN': '\u00A5', // Japanese Yen
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

document.addEventListener('DOMContentLoaded', function () {
    const convertButton = document.getElementById('convert-button');
    const convertCurrencyOption = document.getElementById('convert-currency');
    const output = document.getElementById("convert-output");
    const input = document.getElementById("convert-input");
    const currencyOption = document.getElementById('currency');
    const style = document.getElementById('layout');
    const decimalEle = document.getElementById('decimal');
    const replaceBalance = document.getElementById('replace');
    const replaceElse = document.getElementById('replace-everything');

    populateCurrencyOptions("convert-currency");
    populateCurrencyOptions("currency")


    const checkInterval = setInterval(updateCheckboxes, 100);

    // Initialize currency and style from storage
    function updateCheckboxes() {
        if (replaceBalance && replaceElse) {
            // Elements exist, stop checking and update checkboxes
            clearInterval(checkInterval);

            // Initialize currency and style from storage
            browser.storage.local.get(['currency', 'style', 'decimal', 'replaceBalance', 'replaceElse']).then(result => {
                const currencyOption = document.getElementById('convert-currency');
                const convertCurrencyOption = document.getElementById('currency');
                const style = document.getElementById('layout');
                const decimalEle = document.getElementById('decimal');

                if (currencyOption && convertCurrencyOption) {
                    currencyOption.value = result.currency || "USD";
                    convertCurrencyOption.value = result.currency || "USD";
                }

                if (style) {
                    style.value = result.style || "%robux% (%symbol%%worth%)";
                }

                if (decimalEle) {
                    decimalEle.value = result.decimal || "3";
                }

                // Update checkbox states
                replaceBalance.checked = result.replaceBalance !== undefined ? result.replaceBalance : true;
                replaceElse.checked = result.replaceElse !== undefined ? result.replaceElse : true;

                replaceBalance.addEventListener('change', function () {
                    browser.storage.local.set({ 'replaceBalance': this.checked });
                });

                replaceElse.addEventListener('change', function () {
                    browser.storage.local.set({ 'replaceElse': this.checked });
                });
            }).catch(error => {
                console.error("Error retrieving data from storage:", error);
            });
        }
    }

    // Convert button click event
    convertButton.addEventListener('click', function () {
        const inputValue = input.value.replace(/[^0-9]/g, '');
        const convertedValue = inputValue * robuxWorth;
        const formattedValue = currencySymbol[convertCurrencyOption.value] + convertedValue.toFixed(3);
        output.value = `Worth: ${formattedValue}`;
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

function populateCurrencyOptions(element) {
    const selectElement = document.getElementById(element);

    for (const [currencyCode, symbol] of Object.entries(currencySymbol)) {
        const option = document.createElement('option');
        option.value = currencyCode;
        option.textContent = `${currencyCode} (${symbol})`;
        selectElement.appendChild(option);
    }
}