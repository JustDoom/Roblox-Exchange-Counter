var currency;
var robuxValue = 0.0035;
var robux;
var money;
var robux_amount_checkbox = true;
var currency_worth = true;
var nf = new Intl.NumberFormat();

document.addEventListener('DOMContentLoaded', function () {

	chrome.storage.local.get(['currency'], function(result) {
		document.getElementById('currency').value = result.currency;
	});

	chrome.storage.local.get(['robuxamountcheckbox'], function(result) {
		robux_amount_checkbox = result.robuxamountcheckbox;
		document.getElementById('robux-amount-box').checked = robux_amount_checkbox;
	});

	chrome.storage.local.get(['currencyworth'], function(result) {
		currency_worth = result.currencyworth;
		document.getElementById('currency-worth-box').checked = currency_worth;
	});

	chrome.storage.local.get(['robuxitemcheckbox'], function(result) {
		robux_amount_checkbox = result.robuxitemcheckbox;
		document.getElementById('robux-item-box').checked = robux_amount_checkbox;
	});

	document.getElementById('robux-amount-box').onclick = function(){

		if (document.getElementById('robux-amount-box').checked == true){
			chrome.storage.local.set({'robuxamountcheckbox': true});
		} else {
			chrome.storage.local.set({'robuxamountcheckbox': false});
		}
	}

	document.getElementById('currency-worth-box').onclick = function(){

		if (document.getElementById('currency-worth-box').checked == true){
			chrome.storage.local.set({'currencyworth': true});
		} else {
			chrome.storage.local.set({'currencyworth': false});
		}
	}

	document.getElementById('robux-item-box').onclick = function(){

		if (document.getElementById('robux-item-box').checked == true){
			chrome.storage.local.set({'robuxitemcheckbox': true});
		} else {
			chrome.storage.local.set({'robuxitemcheckbox': false});
		}
	}

	document.getElementById('currency').addEventListener('change', function() {
		chrome.storage.local.set({'currency': document.getElementById('currency').value});
	});

	var textBox = document.getElementById('robuxAmount');
	textBox.addEventListener('click', function () {
		if (document.getElementById('robuxAmount').value === 'Amount Here') {
			document.getElementById('robuxAmount').value = '';
		}
	}, false);

	var checkPageButton = document.getElementById('clickIt');
	checkPageButton.addEventListener('click', function () {
		chrome.tabs.getSelected(null, function (tab) {
			chrome.storage.local.get(['currency'], function(result) {
				currency = result.currency;
			  });
			robux = document.getElementById('robuxAmount').value;
			robux = robux.replace(/,/g, '');
			money = robuxValue * robux;

			let demo = () => {
				money = parseFloat(money);
				money = money.toFixed(2);
				let rate = fx(money).from("USD").to(currency);
				money = rate.toFixed(2);
				money = nf.format(money);
				document.getElementById("amount").innerHTML = 'Money: $' + money + ' ' + currency;
			  }
			  
			  fetch('https://api.exchangeratesapi.io/latest')
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