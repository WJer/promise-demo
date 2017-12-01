//测试Promise.all()同步执行

function getDelay(delay) {
	return new Promise(function(resolve) {
		setTimeout(function() {
			console.log(delay);
		}, delay)
	})
}

var start = new Date();

Promise.all([getDelay(1),getDelay(10),getDelay(100)]).then(function() {
	var take = new Date() - start;
	console.log(take); 
});

//发现所有promise转成fullfilled状态花费的的时间 = 最长的promise花费的时间