/**
 * 日期选择插件
 * 
 * author    wzh
 * created   2018-7-24
 */


function Calender() {

}

Calender.prototype = {
	/**
	 * 初始化操作
	 * @return {[type]} [description]
	 */
	init: function() {
		this.config();
	},
	config: function() {
		this.week = ['一', '二', '三', '四', '五', '六', '七'];
	}	
}