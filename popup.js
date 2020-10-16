var currency;
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
var robux;
var money;

var robux_amount_checkbox = true;
var currency_worth = true;

var nf = new Intl.NumberFormat();

//When everything is loaded
document.addEventListener('DOMContentLoaded', function () {
	
	chrome.storage.local.get(['grouprobuxcheckbox'], function(result) {
		document.getElementById('group-robux-box').checked = result.grouprobuxcheckbox;
	});

	chrome.storage.local.get(['robuxformat'], function(result) {
		document.getElementById('robuxformat').value = result.robuxformat;
	});

	//Get and set currency
	chrome.storage.local.get(['currency'], function(result) {
		document.getElementById('currency').value = result.currency;
	});

	//Get and set show robux amount checkbox
	chrome.storage.local.get(['robuxamountcheckbox'], function(result) {
		robux_amount_checkbox = result.robuxamountcheckbox;
		document.getElementById('robux-amount-box').checked = robux_amount_checkbox;
	});

	//Get and set show currency checkbox
	chrome.storage.local.get(['currencyworth'], function(result) {
		currency_worth = result.currencyworth;
		document.getElementById('currency-worth-box').checked = currency_worth;
	});

	//Get and set show robux worth on gamepasses/clothing checkbox
	chrome.storage.local.get(['robuxitemcheckbox'], function(result) {
		robux_amount_checkbox = result.robuxitemcheckbox;
		document.getElementById('robux-item-box').checked = robux_amount_checkbox;
	});

	//Check/uncheck checkbox and save localstorage for show robux worth
	document.getElementById('robux-amount-box').onclick = function(){
		if (document.getElementById('robux-amount-box').checked === true){
			chrome.storage.local.set({'robuxamountcheckbox': true});
		} else {
			chrome.storage.local.set({'robuxamountcheckbox': false});
		}
	}

	//Check/uncheck checkbox and save localstorage for show worth currency
	document.getElementById('currency-worth-box').onclick = function(){
		if (document.getElementById('currency-worth-box').checked === true){
			chrome.storage.local.set({'currencyworth': true});
		} else {
			chrome.storage.local.set({'currencyworth': false});
		}
	}

	//Check/uncheck checkbox and save localstorage for show worth on group robux
	document.getElementById('group-robux-box').onclick = function(){
		if (document.getElementById('group-robux-box').checked === true){
			chrome.storage.local.set({'grouprobuxcheckbox': true});
		} else {
			chrome.storage.local.set({'grouprobuxcheckbox': false});
		}
	}

	//Check/uncheck checkbox and save localstorage for show worth on gamepasses/clothing
	document.getElementById('robux-item-box').onclick = function(){
		if (document.getElementById('robux-item-box').checked === true){
			chrome.storage.local.set({'robuxitemcheckbox': true});
		} else {
			chrome.storage.local.set({'robuxitemcheckbox': false});
		}
	}

	//Get when currency is changed and save it
	document.getElementById('currency').addEventListener('change', function() {
		chrome.storage.local.set({'currency': document.getElementById('currency').value});
		chrome.storage.local.set({'currencySymbol': currencySymbol[document.getElementById('currency').value]});
	});

	//Get when robux format is changed and save it
	document.getElementById('robuxformat').addEventListener('change', function() {
		chrome.storage.local.set({'robuxformat': document.getElementById('robuxformat').value});
	});

	var checkPageButton = document.getElementById('clickIt');

	//When convert is clicked
	checkPageButton.addEventListener('click', function () {
		//Get selected currency
		chrome.tabs.getSelected(null, function (tab) {
			//Get currency
			chrome.storage.local.get(['currency'], function(result) {
				currency = result.currency;
			});
			
			//Get robux amount
			robux = document.getElementById('robuxAmount').value;

			//Replace commas
			robux = robux.replace(/,/g, '');

			//Calculate robux
			money = robuxValue * robux;

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
					//If show currency is true
					if (result.currencyworth === true){
						//Change robux value to money worth with currency
						document.getElementById("amount").innerHTML = 'Money: ' + currencySymbol[document.getElementById('currency').value] + money + ' ' + currency;
					//else
					} else {
						//Change robux value to money worth
						document.getElementById("amount").innerHTML = 'Money: ' + currencySymbol[document.getElementById('currency').value] + money;
					}
				});
			}
			  
			  fetch('https://api.exchangeratesapi.io/latest?base=USD')
				.then((resp) => resp.json())
				.then((data) => fx.rates = data.rates)
				.then(demo)
		});
	}, false);
}, false);

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