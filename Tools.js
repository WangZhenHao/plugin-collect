(function() {
/**
 * js的工具库,方便使用
 * author   a_boy
 * created  2018-4-7 18:06
 * 
 */
	var Tools = {
		/**
		 * 日期时间换成Unix时间戳
		 * @param {[type]} data [description]
		 */
		DateToTimestamp: function(data) {
			return Date.parse(data) / 1000;
		},
		/**
		 * Unix时间戳转成时间
		 * @param {[type]} format    '格式: yy-MM-dd hh:mm:ss'
		 * @param {[type]} timestamp '时间戳: 1525147931'
		 */
		TimestampToDate: function(format, timestamp) {
			var date = timestamp ? new Date(parseInt(timestamp) * 1000) : new Date(+new Date());
			var	year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours(),
				minute = date.getMinutes(),
	            second = date.getSeconds();

			var str = format.replace(/[YyMmDdHhSs]+/g, function(w) {
				if(w == 'yy' || w == 'YY' || w == 'y' || w == 'Y') {
					return year.substring(2);

				} else if(w == 'yyyy' || w == 'YYYY') {
					return year;

				} else if(w == 'MM') {
					return month >= 10 ? month : '0' + month; 

				} else if(w == 'M') {
					return month;

				} else if(w == 'DD' || w == 'dd') {
					return day >= 10 ? day : '0' + day;

				} else if(w == 'D' || w == 'd') {
					return day;

				} else if(w == 'HH' || w == 'hh') {
					return hour >= 10 ? hour : '0' + hour;

				} else if(w == 'H' || w == 'h') {
					return hour;

				} else if(w == 'mm') {
					return minute >= 10 ? minute : '0' + minute;

				} else if(w == 'm') {
					return minute;

				} else if(w == 'ss' || w == 's') {
					return second >= 10 ? second : '0' + second;
				}
			});
			return str;
		},

		/**
		 * 普通数值转成两位小数
		 * @param {[type]} money [description]
		 */
		ToCurrency: function(money, num = 2) {
			return parseFloat(money).toFixed(num);
		},

		/**
		 * 获取url地址参数
		 * @return {[type]} [description]
		 */
		getUrlParmas: function(param) {
			var url = window.location.href;
			if(url.indexOf('?') > 0) {
				var arrParams = url.split('?')[1].split('&'),
					json = {};
				for(var i = 0, len = arrParams.length; i < len; i++) {
					var arr = arrParams[i].split('=');
					json[arr[0]] = json[arr[1]];
				}
				if(param) {
					return json[param];
				} else {
					return json;
				}
			} else {
				return '';
			}
		},
		/**
		 * 设置cookies
		 */
		setCookies: function(name, value, expires) {
			var cookieText = name + '=' + value;
			if(expires) {
				var timestamp = (new Date().getTime()) / 1000 + expires;
				var dateObj = new Date(timestamp * 1000);
				// console.log(timestamp, dateObj)
				cookieText += '; expires=' + dateObj.toGMTString();
			}
			console.log(cookieText)
			document.cookie = cookieText;
		},
		/**
		 * 清除cookies
		 * @return {[type]} [description]
		 */
		clearCookies: function() {

		}

	};
	window.Tools = Tools;
})();