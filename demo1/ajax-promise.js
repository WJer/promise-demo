//ajax-promise
//构建ajax的promise对象

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
	});
}

getUrl('http://www.baidu.com').then(function(res) {
	//handle
}).catch(function(err) {
	console.error(err);
});