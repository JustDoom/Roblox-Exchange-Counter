browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetch_currency_data") {
        (async () => {
            try {
                let response = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json");
                let data = await response.json();
                sendResponse({ success: true, data: data });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true;
    }
});
