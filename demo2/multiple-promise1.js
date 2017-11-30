//多promise使用

//ajax-promise
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

//主函数
function main() {

	var arrPush = (function (arr, val) {
		arr.push(val);
		return arr;
	}).bind(null, []);

	return request.one().then(arrPush).then(request.two).then(arrPush);
}

main().then(function(data) {
	//handle data
}).catch(function(err) {
	console.error(err);
})