/**
 * author    wzh
 * created   2018-6-15 17:37
 * 
 * 虚拟键盘插件
 * 
 */

function KeyBoard(params) {
	this.targetId = params['targetId'];
	this.callBack = params['callBack'];
	this.init();
}

KeyBoard.prototype = {
	/**
	 * 虚拟键盘初始化
	 * @return {[type]} [description]
	 */
	init: function() {
		this.digit = 5;
		this.decimals = 2;
		this.keyBoardStatus = true;
		this.target = document.querySelector(this.targetId);
		this.keyBoard = document.querySelector('#key-board-wrap');
		this.value = '';
		// this.keyBoard = this.keyBoardWrap.children[0];
		this.touchEvent();
	},
	twoDecimal: function() {
		let arr = this.value.split('.');
		if(!arr[1]) {
			this.value += '.';
			this.addTwoDecimal(this.decimals);
		} else {
			this.addTwoDecimal(this.decimals - arr[1].length)
		}
		this.emitKeyCode()
	},
	addTwoDecimal: function(len) {
		var str = '';
		for(var i = 0; i < len; i++) {
			str += 0;
		}
		this.value += str;
	},
	/**
	 * 失去焦点
	 * @return {[type]} [description]
	 */
	blur() {
		// if(this.keyBoard.className.indexOf('blur') <= -1) {
		// 	this.keyBoard.className += ' blur';
		// }
		var classStr = this.keyBoard.className;
		this.keyBoard.className = classStr.replace('focus', 'blur');
		this.keyBoardStatus = false;
		this.twoDecimal();
		console.log('失去焦点')
	},
	/**
	 * 获取焦点
	 * @return {[type]} [description]
	 */
	focus() {
		var classStr = this.keyBoard.className;
		this.keyBoard.className = classStr.replace('blur', 'focus');
		this.keyBoardStatus = true;
		console.log('获取焦点');

	},
	touchEvent: function() {
		document.addEventListener('touchstart', function(e) {
			var el = e.scrElement || e.target;
			if(el == this.target) {
				this.focus();
			} else {
				this.blur();
			}
			// if()
		}.bind(this));

		this.keyBoard.addEventListener('touchstart', function(e) {
			e.stopPropagation();
			var el = e.scrElement || e.target,
				className = el.className;
			if(className.indexOf('key-code') > -1) {
				var num = el.innerText;
				this.keyCode(num);
			} else if(className.indexOf('delete') > -1) {
				this.del();
			} else if(className.indexOf('icon-dian1') > -1) {
				this.keyCode('.')
			}
		}.bind(this));
	},
	/**
	 * 数字
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	keyCode: function(value) {
		var oldValue = this.value;
		this.value += value;

		if(!this.legal(this.value)) {
			this.value = oldValue;
			return
		} 
		this.emitKeyCode();
	},
	legal: function(value) {
		var arr = [
			this.numIslegal,
			this.inputIsLegal
		],
		    self = this;
		return arr.every(function(fn) {
			return fn.call(self, value);
			// return fn(value);	
		})
		// return true
	}, 
	/**
	 * 检测数字是否合法
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	numIslegal: function(value) {
		var arr = value.split('.');
		if(arr.length > 2) {
			return false;
		}
		if(arr[0].length > this.digit) {
			return false;
		} 
		if(arr[1] && arr[1].length > this.decimals) {
			return false
		}

		return true;
		
	},
	/**
	 * 输入是否合法
	 * @return {[type]} [description]
	 */
	inputIsLegal: function(value) {
		if(value[0] == '0' && (value[1] && value[1] != '.')) {
			return false;
		}
		return true;
	},
	/**
	 * 删除按钮
	 * @return {[type]} [description]
	 */
	del: function() {
		if(this.value.length) {
	        this.value = this.value.slice(0, -1);
	        this.emitKeyCode();
		}
	},
	/**
	 * 取消code
	 * @return {[type]} [description]
	 */
	emitKeyCode() {
		this.callBack(this.value);
	},

	/**
	 * 获取目标
	 * @return {[type]} [description]
	 */
	getTarget: function(el, mark, searchTwice = 5) {
		
		
	}
}
