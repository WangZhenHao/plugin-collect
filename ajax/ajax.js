/**
 * ajax插件
 * author    wzh
 * cretaed    2018-8-30 18:24
 * 
 * @param  {[type]} pramas [description]
 * @return {[type]}        [description]
 */
function ajax(pramas) {
	let type = pramas.type.toUpperCase() || 'GET',
		url = pramas.url,
		data = pramas.data || {},
		async = pramas.async === false ? false : true,
		callBack = pramas.success,
		error = pramas.error,
		beforeSend = pramas.beforeSend,
		complete = pramas.complete || function() {},
		timeout = pramas.timeout,
		xhr = new XMLHttpRequest();
	if(beforeSend) {
		beforeSend();
	}
	if(timeout) {
		xhr.timeout = timeout;
	}
	if(pramas.type == 'POST') {
		xhr.open(type, url, async);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(getParmas(data));
	} else {
		let strUrl = getParmas(data);
		url = strUrl ? url + '?' + getParmas(data) : url;
		xhr.open(type, url, async);
		xhr.send();
	}
	// xhr.open('get', 'test.php');

	
	// xhr.ontimeout = function(e) {
	// 	complete('timeout');
	// }
	xhr.onreadystatechange = function() {
		console.log(xhr)
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


