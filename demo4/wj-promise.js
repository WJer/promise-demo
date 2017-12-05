//Promise polyfill
//
(function(global, factory){
	//umd规范：兼容commonjs和amd规范
	var Polyfill = factory();

	if(module && typeof module == 'object') {
		module.exports = Polyfill;
	}

	if(typeof define == 'function' && define.amd) {
		define(factory);
	}

	global.Promise = Polyfill;

})(this, function() {

	function Promise(fn) {

		var core = new Core();
		this._core = core;

		try{
			fn(function(val) {
				core.resolve(val);
			}, function(err) {
				core.reject(err);
			});
		}catch(err){
			core.reject(err);
		}
	}

	Promise.prototype = {

		constructor: Promise,

		then: function(callback, errback) {
			var resolve, reject,
				promise = new Promise(function(res, rej) {
					resolve = res;
					reject = rej;
				});

			this._core._addBackList(
				Promise._makeCallback(promise, resolve, reject, callback),
				Promise._makeCallback(promise, resolve, reject, errback)
			);
			return promise;
		},

		catch: function(errback) {
			return this.then(undefined, errback);
		}
	};

	Promise.resolve = function(val) {
		if(val && val.constructor == this) {
			return val;
		}
		return new Promise(function(resolve) {
			resolve(val);
		});
	},

	Promise.reject = function(val) {
		if(val && val.constructor == this) {
			return val;
		}
		return new Promise(function(resolve, reject) {
			reject(val);
		});
	},

	Promise.all = function(arr) {
		return new Promise(function(resolve, reject) {
			if(Object.prototype.toString.call(arr) !== '[object Array]') {
				reject(new Error('arr不是一个数组！！'));
				return;
			}
			var remain = arr.length,
				i = 0,
				result = [];

			function oneDone(index) {
				return function (val) {
					result[index] = val;
					remain--;
					if(!remain) {
						resolve(result);
					}
				}
			}

			for(; i < arr.length; i++) {
				Promise.resolve(arr[i]).then(oneDone(i), reject);
			}
		});
	},

	Promise.race = function(arr) {
		return new Promise(function(resolve, reject) {
			if(Object.prototype.toString.call(arr) !== '[object Array]') {
				reject(new Error('arr不是一个数组！！'));
				return;
			}
			var i = 0, isFirst = true;
			for(; i < arr.length; i++) {
				Promise.resolve(arr[i]).then(function(val) {
					if(isFirst) {
						resolve(val);
						isFirst = false;
					}
				}, reject);
			}
		});
	}

	Promise._makeCallback = function(promise, resolve, reject, fn) {
		return function(val) {
			var result;
			try{
				result = fn(val);
				resolve(result);
			}catch(e) {
				reject(e);
			}
		}
	}

	Promise._async = function(fn) {
		setTimeout(fn, 0);
	}


	function Core() {

		//pending,resolved,rejected
		this._status = 'pending';

		this._value = null;

		this._callbackList = [];

		this._errbackList = [];
	}

	Core.prototype = {

		constructor: Core,

		resolve: function(val) {
			this._status = 'resolved';
			this._value = val;
			this._notify(this._callbackList, this._value);
			this._errbackList = null;
		},

		reject: function(err) {
			this._status = 'rejected';
			this._value = err;
			this._notify(this._errbackList, this._value);
			this._callbackList = null;
		},

		_notify: function(arr, val) {
			if(arr.length > 0) {
				Promise._async(function() {
					arr.forEach(function(item) {
						item(val);
					});
					arr = null;
				});
			}
		},

		_addBackList: function(resolve, reject) {
			var callbacks = this._callbackList,
				errbacks = this._errbackList;

			if(callbacks) {
				callbacks.push(resolve);
			}
			if(errbacks) {
				errbacks.push(reject);
			}
			switch(this._status) {
				case 'resolved':
					this.resolve(this._value);
					break;
				case 'rejected':
					this.reject(this._value);
					break;
			}
		}
	}

	return Promise;

});

