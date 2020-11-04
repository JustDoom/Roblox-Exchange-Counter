var currencySymbol = {
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

var robuxValue = 0.0035;
var robux1;
var robuxItemCost;
var groupFunds;

var robuxAmount;
var robuxGamepassAmount;
var groupFundsAmount;

var money;
var money2;
var money3;

var currency;
var currencySymbolVar;

var nf = new Intl.NumberFormat();

fetch('https://api.roblox.com/currency/balance')
		.then(res => res.json())
		.then((json) => {
			prompt(json.robux);
	}).catch(err => console.error(err));

document.addEventListener('DOMContentLoaded', function () {
	/****/

	

	/**const request = async () => {
		const response = await fetch('https://api.roblox.com/currency/balance', {mode: 'cors'});
		const json = await response.json();
		prompt(json);
	}

	request();**/
});

$.getJSON('https://api.roblox.com/currency/balance', function(data) {
        prompt(`${data.robux}`);
    });

chrome.storage.local.get(['grouprobuxcheckbox'], function(result) {
	if(typeof result.grouprobuxcheckbox === "undefined"){
		chrome.storage.local.set({'grouprobuxcheckbox': true});
	}
});

chrome.storage.local.get(['robuxformat'], function(result) {
	if(typeof result.robuxformat === "undefined"){
		chrome.storage.local.set({'robuxformat': 'option1'});
	}
});

//Get and set currency
chrome.storage.local.get(['currency'], function(result) {
	if(typeof result.currency === "undefined"){
		chrome.storage.local.set({'currency': 'USD'});
		chrome.storage.local.set({'currencySymbol': currencySymbol['USD']});
	}
});

//Get and set show robux amount checkbox
chrome.storage.local.get(['robuxamountcheckbox'], function(result) {
	if(typeof result.robuxamountcheckbox === "undefined"){
		chrome.storage.local.set({'robuxamountcheckbox': true});
	}
});

//Get and set show currency checkbox
chrome.storage.local.get(['currencyworth'], function(result) {
	if(typeof result.currencyworth === "undefined"){
		chrome.storage.local.set({'currencyworth': true});
	}
});

//Get and set show robux worth on gamepasses/clothing checkbox
chrome.storage.local.get(['robuxitemcheckbox'], function(result) {
	if(typeof result.robuxitemcheckbox === "undefined"){
		chrome.storage.local.set({'robuxitemcheckbox': true});
	}
});
 
//Roblox page load
//window.onload = function () {

	//Get and set currency
	chrome.storage.local.get(['currency'], function(result) {
		currency = result.currency;
	});	
	
	//Run function to convert to currency if robux display part exists (if person is on roblox.com instead of devforum.roblox.com)
	if(document.getElementById("nav-robux-amount")){
		convert();
	}
//}

//class for buy roblox game is btn-text with spaces around the robux amount

//Convert Function
function convert(){
	if(document.getElementById("nav-robux-amount").innerHTML === ""){
		setTimeout(convert, 1);
	} else {
		chrome.storage.local.get(['currencySymbol'], function(result) {
			currencySymbolVar = result.currencySymbol;
		});
		chrome.storage.local.get(['robuxamountcheckbox'], function(result) {
			//Check if setting is true
			if (result.robuxamountcheckbox === true){
				//Get robux amount
				robux1 = document.getElementById("nav-robux-amount").innerHTML;

				//robux1 = "641M"

				if (robux1.includes("K") || robux1.includes("M")){
					
				}

				robuxAmount = robux1;
				//Replace any commas
				robux1 = robux1.replace(/,/g, '');
				//Calculate how much USD you have in robux
				money = robuxValue * robux1;
	 
				let demo = () => {
					//Check if currency is USD
					if(currency === 'USD'){
						//Parse float
						money = parseFloat(money);
						//Round money to 2 decimal points
						money = money.toFixed(2);
					} else {
						//Exchange currency to chosen currency
						let rate = fx(money).from("USD").to(currency);
						//Round money to 2 decimal points
						money = rate.toFixed(2);
					}
					//Format money with commas
					money = nf.format(money);
					//Get currency worth (Show currency?)
					chrome.storage.local.get(['currencyworth'], function(result) {

						chrome.storage.local.get(['robuxformat'], function(result2) {

							if(result2.robuxformat === 'option1'){
								//If show currency is true
								if (result.currencyworth === true){
									//Change robux value to money worth with currency
									document.getElementById("nav-robux-amount").innerHTML = robuxAmount + ' (' + currencySymbolVar + money + ' ' + currency + ')';
								//else
								} else {
									//Change robux value to money worth
									document.getElementById("nav-robux-amount").innerHTML = robuxAmount + ' (' + currencySymbolVar + money + ')';
								}
							} else {
								//If show currency is true
								if (result.currencyworth === true){
									//Change robux value to money worth with currency
									document.getElementById("nav-robux-amount").innerHTML = currencySymbolVar + money + ' ' + currency;
								//else
								} else {
									//Change robux value to money worth
									document.getElementById("nav-robux-amount").innerHTML = currencySymbolVar + money;
								}
							}
						});
					});
				}
	 
				//Get exchange values
				fetch('https://api.exchangeratesapi.io/latest?base=USD')
					.then((resp) => resp.json())
					.then((data) => fx.rates = data.rates)
					.then(demo)
			}
		});
	
		chrome.storage.local.get(['robuxitemcheckbox'], function(result) {
			//Check if setting is true
			if (result.robuxitemcheckbox === true){
				if(document.body.contains(document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0])){
					//Get item cost
					robuxItemCost = document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0].innerHTML;
					robuxGamepassAmount = robuxItemCost;
					//Replace any commas
					robuxItemCost = robuxItemCost.replace(/,/g, '');
					//Calculate how much USD you have in robux
					money2 = robuxValue * robuxItemCost;
	 
					let demo1 = () => {
						//Check if currency is USD
					if(currency === 'USD'){
						//Parse float
						money2 = parseFloat(money2);
						//Round money to 2 decimal points
						money2 = money2.toFixed(2);
					} else {
						//Exchange currency to chosen currency
						let rate = fx(money2).from("USD").to(currency);
						//Round money to 2 decimal points
						money2 = rate.toFixed(2);
					}
						money2 = nf.format(money2);
						chrome.storage.local.get(['currencyworth'], function(result) {

							chrome.storage.local.get(['robuxformat'], function(result2) {
								if(result2.robuxformat === 'option1'){
									//If show currency is true
	
									if (result.currencyworth === true){
										//Change robux value to money worth with currency
										document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0].innerHTML = robuxGamepassAmount + ' (' + currencySymbolVar + money2 + ' ' + currency + ')';
									//else
									} else {
										//Change robux value to money worth
										document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0].innerHTML = robuxGamepassAmount + ' (' + currencySymbolVar + money2 + ')';
									}
								} else {
									//If show currency is true
									if (result.currencyworth === true){
										//Change robux value to money worth with currency
										document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0].innerHTML = currencySymbolVar + money2 + ' ' + currency;
									//else
									} else {
										//Change robux value to money worth
										document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0].innerHTML = currencySymbolVar + money2;
									}
								}
							});
						});
					}
	 
					//Get exchange values
					fetch('https://api.exchangeratesapi.io/latest?base=USD')
						.then((resp) => resp.json())
						.then((data) => fx.rates = data.rates)
						.then(demo1);
				}
			}
		});

		chrome.storage.local.get(['grouprobuxcheckbox'], function(result) {
			//Check if setting is true
			if (result.grouprobuxcheckbox === true){
				if(document.body.contains(document.getElementsByClassName("text-robux ng-binding")[0])){
					//Get item cost
					groupFunds = document.getElementsByClassName("text-robux ng-binding")[0].innerHTML;
					groupFundsAmount = groupFunds;
					//Replace any commas
					groupFunds = groupFunds.replace(/,/g, '');
					//Calculate how much USD you have in robux
					money3 = robuxValue * groupFunds;
	 
					let demo1 = () => {
						//Check if currency is USD
					if(currency === 'USD'){
						//Parse float
						money3 = parseFloat(money3);
						//Round money to 2 decimal points
						money3 = money3.toFixed(2);
					} else {
						//Exchange currency to chosen currency
						let rate = fx(money3).from("USD").to(currency);
						//Round money to 2 decimal points
						money3 = rate.toFixed(2);
					}
						money3 = nf.format(money3);
						chrome.storage.local.get(['currencyworth'], function(result) {

							chrome.storage.local.get(['robuxformat'], function(result2) {
								if(result2.robuxformat === 'option1'){
									//If show currency is true
	
									if (result.currencyworth === true){
										//Change robux value to money worth with currency
										document.getElementsByClassName("text-robux ng-binding")[0].innerHTML = groupFundsAmount + ' (' + currencySymbolVar + money3 + ' ' + currency + ')';
									//else
									} else {
										//Change robux value to money worth
										document.getElementsByClassName("text-robux ng-binding")[0].innerHTML = groupFundsAmount + ' (' + currencySymbolVar + money3 + ')';
									}
								} else {
									//If show currency is true
									if (result.currencyworth === true){
										//Change robux value to money worth with currency
										document.getElementsByClassName("text-robux ng-binding")[0].innerHTML = currencySymbolVar + money3 + ' ' + currency;
									//else
									} else {
										//Change robux value to money worth
										document.getElementsByClassName("text-robux ng-binding")[0].innerHTML = currencySymbolVar + money3;
									}
								}
							});
						});
					}

					
	 
					//Get exchange values
					fetch('https://api.exchangeratesapi.io/latest?base=USD')
						.then((resp) => resp.json())
						.then((data) => fx.rates = data.rates)
						.then(demo1);
				}

				if(document.body.contains(document.getElementsByClassName("text-robux-lg ng-binding")[0])){
					//Get item cost
					groupFunds = document.getElementsByClassName("text-robux-lg ng-binding")[0].innerHTML;
					groupFundsAmount = groupFunds;
					//Replace any commas
					groupFunds = groupFunds.replace(/,/g, '');
					//Calculate how much USD you have in robux
					money3 = robuxValue * groupFunds;
	 
					let demo1 = () => {
						//Check if currency is USD
					if(currency === 'USD'){
						//Parse float
						money3 = parseFloat(money3);
						//Round money to 2 decimal points
						money3 = money3.toFixed(2);
					} else {
						//Exchange currency to chosen currency
						let rate = fx(money3).from("USD").to(currency);
						//Round money to 2 decimal points
						money3 = rate.toFixed(2);
					}
						money3 = nf.format(money3);
						chrome.storage.local.get(['currencyworth'], function(result) {

							chrome.storage.local.get(['robuxformat'], function(result2) {
								if(result2.robuxformat === 'option1'){
									//If show currency is true
	
									if (result.currencyworth === true){
										//Change robux value to money worth with currency
										document.getElementsByClassName("text-robux-lg ng-binding")[0].innerHTML = groupFundsAmount + ' (' + currencySymbolVar + money3 + ' ' + currency + ')';
									//else
									} else {
										//Change robux value to money worth
										document.getElementsByClassName("text-robux-lg ng-binding")[0].innerHTML = groupFundsAmount + ' (' + currencySymbolVar + money3 + ')';
									}
								} else {
									//If show currency is true
									if (result.currencyworth === true){
										//Change robux value to money worth with currency
										document.getElementsByClassName("text-robux-lg ng-binding")[0].innerHTML = currencySymbolVar + money3 + ' ' + currency;
									//else
									} else {
										//Change robux value to money worth
										document.getElementsByClassName("text-robux-lg ng-binding")[0].innerHTML = currencySymbolVar + money3;
									}
								}
							});
						});
					}

					
	 
					//Get exchange values
					fetch('https://api.exchangeratesapi.io/latest?base=USD')
						.then((resp) => resp.json())
						.then((data) => fx.rates = data.rates)
						.then(demo1);
				}
			}
		});
	}
}

//Calculating currency stuff I copied from a website
(function(root, undefined) {
 
	var fx = function(obj) {
		return new fxWrapper(obj);
	};
 
	fx.version = '0.2';
 
	var fxSetup = root.fxSetup || {
		rates : {},
		base : ""
	};
 
	fx.rates = fxSetup.rates;
 
	fx.base = fxSetup.base;
 
	fx.settings = {
		from : fxSetup.from || fx.base,
		to : fxSetup.to || fx.base
	};
 
	var convert = fx.convert = function(val, opts) {
		if (typeof val === 'object' && val.length) {
			for (var i = 0; i< val.length; i++ ) {
				val[i] = convert(val[i], opts);
			}
			return val;
		}
 
		opts = opts || {};
 
		if( !opts.from ) opts.from = fx.settings.from;
		if( !opts.to ) opts.to = fx.settings.to;
 
		return val * getRate( opts.to, opts.from );
	};
 
	var getRate = function(to, from) {
		var rates = fx.rates;
 
		rates[fx.base] = 1;
 
		if ( !rates[to] || !rates[from] ) throw "fx error";
 
		if ( from === fx.base ) {
			return rates[to];
		}
 
		if ( to === fx.base ) {
			return 1 / rates[from];
		}
 
		return rates[to] * (1 / rates[from]);
	};
 
 
	var fxWrapper = function(val) {
		if ( typeof	val === "string" ) {
			this._v = parseFloat(val.replace(/[^0-9-.]/g, ""));
			this._fx = val.replace(/([^A-Za-z])/g, "");
		} else {
			this._v = val;
		}
	};
 
	var fxProto = fx.prototype = fxWrapper.prototype;
 
	fxProto.convert = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this._v);
		return convert.apply(fx, args);
	};
 
	fxProto.from = function(currency) {
		var wrapped = fx(convert(this._v, {from: currency, to: fx.base}));
		wrapped._fx = fx.base;
		return wrapped;
	};
 
	fxProto.to = function(currency) {
		return convert(this._v, {from: this._fx ? this._fx : fx.settings.from, to: currency});
	};
 
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = fx;
		}
		exports.fx = fx;
	} else if (typeof define === 'function' && define.amd) {
		define([], function() {
			return fx;
		});
	} else {
		fx.noConflict = (function(previousFx) {
			return function() {
				root.fx = previousFx;
				fx.noConflict = undefined;
				return fx;
			};
		})(root.fx);
 
		root['fx'] = fx;
	}
 
}(this));