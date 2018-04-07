(function() {
/**
 * 汇总js常见的工具库,方便使用
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
		 * @param {[type]} format      [description]
		 * @param {[type]} timestamp [description]
		 */
		TimestampToDate: function(format, timestamp) {
			var date = timestamp ? new Date(parseInt(timestamp) * 1000) : new Date(+new Date());
			var	year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours(),
				minute = date.getMinutes(),
	            second = date.getSeconds();
	        // var dateObj = {
	        // 	y: date.getFullYear(),
	        // 	Y: this.y,
	        // 	M: date.getMonth() + 1,
	        // 	d: date.getDate(),
	        // 	h: date.getHours(),
	        // 	m: date.getMinutes(),
	        // 	s: date.getSeconds()
	        // }

			console.log(year, month, day, hour, minute, second);
			var str = format.replace(/[YyMmDdHhSs]+/g, function(w) {
				// var key = w.charAt(0),
				// 	len = w.length;
				// if(len <=2 && key.toUpperCase() == 'Y') {
				// 	return dateObj[key].substring(2);

				// } else if(len >=2 && key.toUpperCase() == 'Y') {
				// 	return dateObj[key];

				// } else if(w == 'MM') {
				// 	return dateObj[key] >= 10 ? dateObj[key] : '0' + dateObj[key];

				// } else if(w = 'M') {
				// 	return dataObj[key];

				// }
				console.log(w);
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
		ToCurrency: function(money) {
			var currency = money;
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
		setCookies: function() {

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