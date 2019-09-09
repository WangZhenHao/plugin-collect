/**
 * author  wzh
 * create  2019-6-24
 *
 * 输入文字框插件
 *
 * 使用方法:
 *
 * var test = new InputNum({
			id: '#input-wrap',   //容器id
			inputNum: 6,         //可以输入多少位
			value: '123',        //初始值
			hiddenNum: false,    //是否隐藏输入
			hideSymbol: '*',     //隐藏符号
			callback: function(res) {
				setTimeout(() => {
					alert(res)
				}, 100)
			}
	})
 */


function InputNum(params) {
	this._proxy(params);
	this.init();
}

InputNum.prototype = {
	init: function() {
		this._createCss();
		this._createHtml();
		this._initDomEvent();
	},
	/**
	* 设置默认值
	*/
	addValue: function(value) {
		this.value = value;
		this._initIuputValue();
	},
	/**
	 * 创建html
	 * @return {[type]} [description]
	 */
	_createHtml: function() {
		this.inputWrap = document.querySelector(this.id);
		var itemDiv = '',
			str = '';

		for(var i = 0; i < this.inputNum; i++) {
			itemDiv += '<div class="i-item flex-1"></div>'
		}

		str = `<div class="input-wrap text-center">
			<div class="flex-box">
				${itemDiv}
			</div>
			<input type="number" id="input-text">
		</div>`;

		this.inputWrap.innerHTML = str;
	},

	/**
	 * 创建css
	 * @return {[type]} [description]
	 */
	_createCss: function() {
		var str = `.input-wrap {
				position: relative;
				height: 60px;
				text-align: center;
			}
			.input-wrap .flex-box {
				display: flex;
			}
			.input-wrap  .i-item {
				flex: 1;
				border-bottom: 1px solid #c7c4c4;
				margin: 0 10px;
				font-size: 30px;
				height: 60px;
				line-height: 60px;
			}
			#input-text {
				position: absolute;
				left: -1000000px;
				top: 0;
				height: 100%;
				width: 100%;
				z-index: -1;
				border: none;
			    -webkit-user-select: auto!important;
			    -khtml-user-select: auto!important;
			    -moz-user-select: auto!important;
			    -ms-user-select: auto!important;
			    -o-user-select: auto!important;
			    user-select: auto!important;
			}
			.i-active:after {
				content: "|";
				color: red;
				animation: showHideCursor 1s steps(1) infinite;
			}

			@keyframes showHideCursor{ 
				50% { visibility: hidden}
			}`;

			var style = document.createElement('style');
			style.innerHTML = str;

			document.head.appendChild(style);
	},
	/**
	 * 初始化dom事件
	 * @return {[type]} [description]
	 */
	_initDomEvent() {
		var self = this;
		this.inputText = document.querySelector('#input-text');
		this.inputList = document.querySelectorAll('.i-item');

		this._initIuputValue();

		this.inputWrap.addEventListener('click', function() {
			self.inputText.focus();
		});

		this.inputText.oninput = function() {
			self._inputChange(this)

		}

		this.inputText.onblur = function() {
			self._optionClass('remove')
		}

		this.inputText.onfocus = function(e) {
			// self._inputChange(this)
			self._optionClass('add');
		}
	},
	/**
	 * 初始化input的值
	 * @return {[type]} [description]
	 */
	_initIuputValue() {
		this.inputText.value = String(this.value);
		this._inputChange(this.inputText);

		this._optionClass('add');
		setTimeout(function() {
			this.inputText.focus();
		}.bind(this), 100)
		
	},
	/**
	 * 输入处理函数
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	_inputChange(el) {
		var value = el.value;
		var len = value.length;


		if(len > this.inputNum) {
			el.value = el.value.slice(0, this.inputNum);
			return;
		}

		for(var i = 0; i < this.inputNum; i++) {
			this.inputList[i].classList.remove('i-active');

			if(value[i]) {
				this.inputList[i].innerHTML = this.hiddenNum ? this.hideSymbol : value[i];
			} else {
				this.inputList[i].innerHTML = '';
			}
		}

		//输入的字数已够
		if(len == this.inputNum) {
			if(typeof this.callback == 'function') {
				this.inputText.blur();
				this.callback(el.value)
			}
		}

		this._optionClass('add');
	},
	/**
	 * 知道获取焦点
	 * @return {[type]} [description]
	 */
	_optionClass(type) {
		var len = this.inputText.value.length;
		if(len < this.inputNum) {
			this.inputList[len].classList[type]('i-active');
		}
	},
	/**
	 * 代理params
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	_proxy: function(params) {
		var self = this;
		var DEFAULT = {
			id: '#input-wrap',
			inputNum: 4,
			value: '',
			hiddenNum: false,
			hideSymbol: '*'
		}

		self._params = Object.assign(DEFAULT, params);

		Object.keys(self._params).forEach(function (key) {
			Object.defineProperty(self, key, {
				get: function() {
					return self._params[key]
				},
				set: function(value) {
					self._params[key] = value;
				}
			})
		})
	}
}