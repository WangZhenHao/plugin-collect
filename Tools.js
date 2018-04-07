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

			console.log(year, month, day, hour, minute, second);
			format.replace(/\w+[\\\-]/, function() {

			})
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
		getUrlParmas: function() {

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