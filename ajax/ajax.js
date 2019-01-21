/**
 * ajax插件
 * author    wzh
 * cretaed    2018-8-30 18:24
 * 
 * @param  {[type]} pramas [description]
 * @return {[type]}        [description]
 
 1.创建一个XMLHttpRequest的对象. 
 2.通过open与服务器建立连接。 
 3.使用send来发送请求。 
 4.使用onreadystatechange事件来监听。如果表示readystate==4就说明解析成功，且status==200(状态码成功)，就说明与后台搭建成功，最后通过success函数进行渲染。
 */
function ajax(pramas) {
	//方式
	let type = pramas.type.toUpperCase() || 'GET',
		url = pramas.url,
		//传入的数据
		data = pramas.data || {},
		//异步还是同步
		async = pramas.async === false ? false : true,
		//成功回调
		callBack = pramas.success,
		// 错误回调
		error = pramas.error,
		//请求之前
		beforeSend = pramas.beforeSend,
		//请求完成
		complete = pramas.complete || function() {},
		//超时
		timeout = pramas.timeout || 0,
		//ajax对象
		xhr = new XMLHttpRequest();
	
	xhr.timeout = timeout;

	if(pramas.type == 'POST') {
		xhr.open(type, url, async);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	} else {
		let strUrl = getParmas(data);
		url = strUrl ? url + '?' + getParmas(data) : url;
		xhr.open(type, url, async);
	}
	if(beforeSend) {
		beforeSend(xhr);
	}

	if(pramas.type == 'PSOT') {
		xhr.send(getParmas(data));
	} else {
		xhr.send();
	}
	// xhr.open('get', 'test.php');

	
	// xhr.ontimeout = function(e) {
	// 	complete('timeout');
	// }
	xhr.onreadystatechange = function() {
		// console.log(xhr)
		if(xhr.readyState == 4) {
			// complete(xhr.status)
			if(xhr.status == 200) {
				let value = JSON.parse(xhr.responseText);
				if(callBack) {
					callBack(value);
				}
			} else if(xhr.status == 0) {
				complete('timeout');
			} else {
				let value = {
					status: xhr.status,
					statusText: xhr.statusText
				}
				if(error) {
					error(value);
				}
			}
		}
	}
}
function getParmas(data) {
	let arr = []
	for(let i in data) {
		arr.push(`${i}=${data[i]}`);
	}
	return arr.join('&');
}


