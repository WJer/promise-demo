function getUrl(url){
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequeset();
		xhr.open('get', url, true)
		xhr.onload = function() {
			if(xhr.status == 200) {
				resolve(xhr.responseText);
			}else{
				reject(new Error('调用失败'));
			}
		}
		xhr.onerror = function() {
			reject(new Error('调用失败'));
		}
		xhr.send();
	})
}

var request = {
	'one': function() {
		return getUrl('http://one').then(JSON.parse);
	},
	'two': function() {
		return getUrl('http://two').then(JSON.parse);
	}
}

Promise.all([request.one(), request.two()]).then(function(val) {
	//handle val
	//val = [one, two]
}).catch(function(err) {
	console.error(err);
});