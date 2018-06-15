/**
 * author    wzh
 * created   2018-6-15 17:37
 * 
 * 虚拟键盘插件
 * 
 */

function KeyBoard(params) {
	this.init();
}

KeyBoard.prototype = {
	/**
	 * 虚拟键盘初始化
	 * @return {[type]} [description]
	 */
	init: function() {
		this.keyBoardWrap = document.querySelector('.key-board-wrap');
		this.keyBoard = this.keyBoardWrap.children[0];
		this.touchEvent();
	},
	/**
	 * 显示虚拟键盘
	 * @return {[type]} [description]
	 */
	keyBoardshow: function() {

	},

	touchEvent: function() {
		this.keyBoard.addEventListener('touchstart', function(e) {
			var el = e.scrElement || e.target;
			console.log(el)
		}.bind(this));
	},


	/**
	 * 获取目标
	 * @return {[type]} [description]
	 */
	getTarget: function(el, mark, searchTwice = 5) {
		
		
	}
}
