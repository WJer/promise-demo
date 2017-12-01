
var aPromise = new aPromise(function(resolve, reject){
	resolve(233)
});

var bPromise = aPromise.then(function(val){
	console.log(val);
});

aPromise == bPromise; //false


new Promise(function(resolve){
	resolve('hello');
}).then(function(val) {
	return val += ' world';
}).then(function(val) {
	console.log(val); // hello world
});