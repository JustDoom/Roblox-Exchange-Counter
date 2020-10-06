var money;
var money2;
var robux;
var robuxItemCost;
var robuxValue = 0.0035;
var currency;
var nf = new Intl.NumberFormat();
 
window.onload = function () {
	calculate();
}
 
function calculate() {
	chrome.storage.local.get(['robuxamountcheckbox'], function(result) {
		if (result.robuxamountcheckbox === true){
			chrome.storage.local.get(['currency'], function(result) {
				currency = result.currency;
			});
			robux = document.getElementById("nav-robux-amount").innerHTML;
			robux = robux.replace(/,/g, '');
			money = robuxValue * robux;
 
			let demo = () => {
				money = parseFloat(money);
				money = money.toFixed(2);
				if(currency === 'USD'){
					money = parseFloat(money);
					money = money.toFixed(2);
				} else {
					let rate = fx(money).from("USD").to(currency);
					money = rate.toFixed(2);
				}
		
				money = nf.format(money);
				chrome.storage.local.get(['currencyworth'], function(result) {
					if (result.currencyworth === true){
						document.getElementById("nav-robux-amount").innerHTML = '$' + money + ' ' + currency;
					} else {
						document.getElementById("nav-robux-amount").innerHTML = '$' + money;
					}
				});
			}
 
			fetch('https://api.exchangeratesapi.io/latest?base=USD')
				.then((resp) => resp.json())
				.then((data) => fx.rates = data.rates)
				.then(demo)
		}
	});

	chrome.storage.local.get(['robuxitemcheckbox'], function(result) {
		if (result.robuxitemcheckbox === true){
			if(document.body.contains(document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0])){
				chrome.storage.local.get(['currency'], function(result) {
					currency = result.currency;
				});
				robuxItemCost = document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0].innerHTML;
				robuxItemCost = robuxItemCost.replace(/,/g, '');
				money2 = robuxValue * robuxItemCost;
 
				let demo1 = () => {
					money2 = parseFloat(money2);
					money2 = money2.toFixed(2);
					let rate = fx(money2).from("USD").to(currency);
					money2 = rate.toFixed(2);
					money2 = nf.format(money2);
					document.getElementsByClassName("text-robux-lg wait-for-i18n-format-render")[0].innerHTML = '$' + money2 + ' ' + currency;
				}
 
				fetch('https://api.exchangeratesapi.io/latest?base=USD')
					.then((resp) => resp.json())
					.then((data) => fx.rates = data.rates)
					.then(demo1);
			}
		}
	});
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