/**
 * author    wzh
 * created   2018-6-15 17:37
 * 
 * 虚拟键盘插件使用方法:
 * 
	class="key-board-cursor" 获取焦点闪烁的class类
	data-key-board="target"  触发虚拟键盘显示和隐藏的元素
	
   --html--
   <div class="key-board-cursor" data-key-board="target" id="keyBoard">
   </div>
   	
	--javascript--
    var keyBoard = new KeyBoard({
		target: 'target',
		//点击虚拟键盘返回的数字
		callBack: function(res, status) {
			this.target.innerHTML = res.value;
		},
		//点击确认
		comfirm: function(res) {
			console.log(res);
		}
	});

 */
function KeyBoard(params) {

	this.target = params['target'];
	this.callBack = params['callBack'];
	this.comfirm = params['comfirm'];
	this.init();
}

KeyBoard.prototype = {
	/**
	 * 插入css
	 * @return {[type]} [description]
	 */
	// 
	createCss: function() {
		var element = document.createElement('style');
		var str = '.clearfix:after{content:"";display:block;clear:both}.text-center{text-align:center}.line-height{line-height:60px}.key-board{width:100%;height:240px;position:fixed;bottom:0;left:0;display:flex;z-index:1;transition:transform .2s;background:#fff}.key-board.blur{transform:translateY(240px)}.key-board.focus{transform:translateY(0)}.key-board *{box-sizing:border-box}.key-board>.key-code-block{flex:1;color:#333}.key-board>.key-code-block>span{float:left;font-size:38px;height:25%;width:33.33%;border-top:1px solid #eee;border-right:1px solid #eee}.key-board>.options{width:25%;height:100%;}.key-board>.options>.delete{font-size:38px;height:25%;border-top:1px solid #eee}.key-board>.options>.comfirm{height:75%;display:flex;display:-webkit-box;display:-webkit-flex;flex-direction:column;justify-content:center;color:#fff;background:linear-gradient(180deg,#ff6e15,#ffb911);font-size:18px}#keyBoard{display:block;height:100px;width:100%;font-size:30px;text-align:right;border:1px solid #000}.key-board-cursor:after{content:"|";animation:showHideCursor 1s steps(1) infinite}@keyframes showHideCursor{50%{visibility:hidden}}';
		element.innerHTML = str;
		document.head.appendChild(element);
	},
	/**
	 * 插入html
	 * @return {[type]} [description]
	 */
	createKeyBoard: function() {
		var element = document.createElement('div');
		element.id = 'key-board-wrap';
		element.className = 'key-board text-center focus';
		element.innerHTML = 
			'<div class="key-code-block clearfix line-height">' +
				'<span class="key-code">1</span>' +
				'<span class="key-code">2</span>' +
				'<span class="key-code">3</span>' +
				'<span class="key-code">4</span>' +
				'<span class="key-code">5</span>' +
				'<span class="key-code">6</span>' +
				'<span class="key-code">7</span>' +
				'<span class="key-code">8</span>' +
				'<span class="key-code">9</span>' +
				'<span class="iconfont icon-jianpan"></span>' +
				'<span class="key-code">0</span>' +
				'<span class="iconfont icon-dian1"></span>' +
			'</div>' +
			'<div class="options">' +
				'<div class="delete iconfont icon-tuige line-height"></div>' +
				'<div class="comfirm">' +
					'确认<br>' +
					'支付' +
				'</div>' +
			'</div>';
		document.body.appendChild(element);
	},
	/**
	 * 初始化dom操作
	 * @return {[type]} [description]
	 */
	initDom: function() {
		this.createCss();
		this.createKeyBoard();
		this.keyBoard = document.querySelector('#key-board-wrap');
		this.touchEvent();
		this.focus();
	},
	/**
	 * 虚拟键盘初始化
	 * @return {[type]} [description]
	 */
	init: function() {
		this.digit = 5;
		this.decimals = 2;
		this.keyBoardStatus = true;
		this.isIegalNum = false;
		this.value = '';
		this.initDom();
	},
	/**
	 * 判断是否需要填充零
	 * @return {[type]} [description]
	 */
	twoDecimal: function() {
		var arr = this.value.split('.');
		if(typeof arr[1] == 'undefined') {
			this.value += '.';
			this.addTwoDecimal(this.decimals);
		} else {
			this.addTwoDecimal(this.decimals - arr[1].length)
		}
		this.emitKeyCode()
	},
	/**
	 * 添加小时
	 * @param {[type]} len [description]
	 */
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
	blur: function() {
		var classStr = this.keyBoard.className;
		this.keyBoard.className = classStr.replace('focus', 'blur');
		this.keyBoardStatus = false;
		if(	Number(this.value) <= 0 ) {
			this.value = '';
			this.emitKeyCode();
			return;
		} 
		this.twoDecimal();
	},
	/**
	 * 获取焦点
	 * @return {[type]} [description]
	 */
	focus: function() {
		var classStr = this.keyBoard.className;
		this.keyBoard.className = classStr.replace('blur', 'focus');
		this.keyBoardStatus = true;
		this.emitKeyCode();

	},
	/**
	 * 事件函数
	 * @return {[type]} [description]
	 */
	touchEvent: function() {
		document.addEventListener('touchstart', function(e) {
			var el = e.scrElement || e.target,
				targetEl = this.searchElement(el, this.target);
			if(targetEl) {
				this.focus();
			} else {
				this.blur();
			}
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
				this.keyCode('.');
			} else if(className.indexOf('comfirm') > -1) {
				this.touchComfirmButton();
			}
		}.bind(this));
	},
	/**
	 * 点击确定按钮
	 * @return {[type]} [description]
	 */
	touchComfirmButton: function() {
		if(Number(this.value) > 0) {
			this.comfirm(parseFloat(this.value));
		}
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
			return;
		} 
		this.emitKeyCode();
	},
	/**
	 * 验证规则
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	legal: function(value) {
		var arr = [
			this.numIslegal,
			this.inputIsLegal
		],
		self = this;
		return arr.every(function(fn) {
			return fn.call(self, value);
		})
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
			return false;
		}

		return true;
		
	},
	/**
	 * 输入是否合法
	 * @return {[type]} [description]
	 */
	inputIsLegal: function(value) {
		if(value[0] == '.' || (value[0] == '0' && (value[1] && value[1] != '.'))) {
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
	 * 输出数字
	 * @return {[type]} [description]
	 */
	emitKeyCode() {
		var str = this.value;
		if(!str) {
			this.isIegalNum = false;

		} else {
			this.isIegalNum = true;
		}

		this.callBack({
			value: str,
			isIegalNum: this.isIegalNum,
		}, this.keyBoardStatus);
	},
	/**
	 * 搜索元素,解决事件委托颗粒度问题
	 * @param  {[type]} el   [description]
	 * @param  {[type]} attr [description]
	 * @return {[type]}      [description]
	 */
	searchElement: function(el, attr) {
		var target = el,
			count = 0;
		while(target) {
			count++;
			if(count > 5 || target.nodeName.toLowerCase() == 'html') {
				target = null;
				return target;
			} else if(target.getAttribute('data-key-board') != null && target.getAttribute('data-key-board').indexOf(attr) > -1) {
				return target;
			}
			target = target.parentNode;
		}
	}
}