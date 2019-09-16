/**
 * 
 * author     王贞浩
 * created    2019-9-11 09:45
 *
 *
 * var keyBoard = new KeyBoard({
    decimals: 2,
    value: '23',
    keyBoardStatus: true,
    // targetElement: keyBoardEl,
    onInput: function(value, res) {
      keyBoardEl.innerHTML = value;
    },
    onComfirm: function(res) {
      console.log(res);
    },
    onFoucs(value, res) {
      console.log(value, res, '获取焦点')
    },
    onBlur(value, res) {
      console.log(value, res, '失去焦点')
    },
    onFinish(res) {
      keyBoardEl.innerHTML = this.value;
    }
  });
 */


function KeyBoard (params) {
	this._mergeOptions(params)
	this.init();
}

KeyBoard.prototype = {
	/**
	 * 初始化操作
	 * @return {[type]}
	 */
	init () {
		this.createKeyBoardCss();
		this.createKeyBoardElement();
		this.touchEvent();
    this.initOptions();
	},
  initOptions () {
    if(this.keyBoardStatus) {
      this._focus();
    } else {
      this._blur();
    }

    this.onFinish.call(this, this)
  },
	/**
	 * 参数合并
	 * @param  {[type]}
	 * @return {[type]}
	 */
	_mergeOptions(params) {
		var DEFAULT = {
			// 保留多少位整数
			digit: 5,
			// 保留多少位小数
			decimals: 2,
			// 值
			value: '',
			// 是否唤起虚拟键盘
			keyBoardStatus: true,
      targetElement: null,
			// 目标元素属性
			targetAttr: 'key-board-element',
			// 获取焦点
			onFocus: function () {},
			// 失去焦点
			onBlur: function () {},
			// 输入回调
			onInput: function () {},
			// 点击确认
			onComfirm: function () {},
      // 初始化完毕
      onFinish: function() {}
		}

		Object.assign(this, DEFAULT, params)

	},
  setValue: function (value) {
    this.value = value;
    // this._focus();
    this.onFinish.call(this, this);
  },
  /**
   * 清除事件
   * @return {[type]} [description]
   */
  keyBoardDestroy: function () {
    document.removeEventListener('touchstart', this.documentTouchStartHandle)
    this.keyBoard.removeEventListener('touchstart', this.keyBoardTouchStartHandle)
  },
  /**
   * 文档触摸开始事件
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  _documentTouchStart: function (e) {
    var el = e.scrElement || e.target;
      // var targetEl = this.searchElement(el, 'true');
      let targetElement = this.searchElement(el, 'true');
      if(targetElement) {
        this.targetElement = this.searchElement(el, 'true');
        this._focus();
      } else {
        this._blur();
      }
  },
  /**
   * 虚拟键盘触摸开始事件
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  _keyBoardTouchStart: function (e) {
    e.stopPropagation();

    var el = e.scrElement || e.target;
    var className = el.className;

    if (className.indexOf('key-code') > -1) {
      var num = el.innerText;
      this._touchKeyCode(num);
    } else if (className.indexOf('delete') > -1) {
      this._touchDel();
    } else if (className.indexOf('icon-dian1') > -1) {
      this._touchKeyCode('.');
    } else if (className.indexOf('comfirm') > -1) {
      this._touchComfirm();
    } else if (className.indexOf('icon-jianpan') > -1) {
      this._blur();
    }
  },
	/**
	 * 事件函数
	 * @return {[type]} [description]
	 */
  touchEvent: function () {
    var self = this;
  	this.keyBoard = document.querySelector('#key-board-wrap');
    this.targetElement = document.querySelector('div[key-board-element]')

    /**
     * 控制this的传值
     * 详情参考文档： https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
     */
    this.documentTouchStartHandle = function (e) {
      return self._documentTouchStart(e);
    }

    this.keyBoardTouchStartHandle = function (e) {
      return self._keyBoardTouchStart(e);
    }

    document.addEventListener('touchstart', this.documentTouchStartHandle)
    this.keyBoard.addEventListener('touchstart', this.keyBoardTouchStartHandle)

    // document.addEventListener('touchstart', this._documentTouchStart.bind(this))
    // this.keyBoard.addEventListener('touchstart', this._keyBoardTouchStart.bind(this))
    // document.addEventListener('touchstart', function (e) {
    //   var el = e.scrElement || e.target;
    //   // var targetEl = this.searchElement(el, 'true');
    //   let targetElement = this.searchElement(el, 'true');
    //   if(targetElement) {
    //     this.targetElement = this.searchElement(el, 'true');
    //     this._focus();
    //   } else {
    //     this._blur();
    //   }
      
    // }.bind(this));

    // this.keyBoard.addEventListener('touchstart', function (e) {
    //   e.stopPropagation();
    //   var el = e.scrElement || e.target;
    //   var className = el.className;

    //   if (className.indexOf('key-code') > -1) {
    //     var num = el.innerText;
    //     this._touchKeyCode(num);
    //   } else if (className.indexOf('delete') > -1) {
    //     this._touchDel();
    //   } else if (className.indexOf('icon-dian1') > -1) {
    //     this._touchKeyCode('.');
    //   } else if (className.indexOf('comfirm') > -1) {
    //     this._touchComfirm();
    //   } else if (className.indexOf('icon-jianpan') > -1) {
    //     this._blur();
    //   }

    // }.bind(this));
  },
  /**
   * 处理键盘输入
   * @return {[type]}
   */
  _touchKeyCode: function(value) {
  	var oldValue = this.value;
  	this.value += value;

  	if(!this.legal(this.value)) {
  		this.value = oldValue;
  		return
  	}

  	this.onKeyCode()
  },
  /**
   * 点击删除
   * @return {[type]}
   */
  _touchDel: function() {
  	if (this.value.length) {
      this.value = this.value.slice(0, -1);
      this.onKeyCode();
    }
  },
  /**
   * 点击确认
   * @return {[type]}
   */
  _touchComfirm: function() {
  	this.addDecimal();

  	this.onComfirm(this.value, { keyBoardStatus: this.keyBoardStatus});
  },
  /**
   * 发送数字
   * @return {[type]}
   */
  onKeyCode: function() {
  	this.onInput(this.value, { keyBoardStatus: this.keyBoardStatus })
  },
  /**
   * 校验规则
   * @return {[type]}
   */
  legal: function(value) {
  	var arr = [
      this.numIslegal,
      this.inputIsLegal
    ],
      self = this;

    return arr.every(function (fn) {
      return fn.call(self, value);
    })
  },
  /**
	 * 添加小数
	 * @param {[type]} len [description]
	 */
  addDecimal: function() {
  	// var arr = this.value.split('.');
  	// if(this.value == 0 || !this.value) {

  	// }

  	var num = Number(this.value);

  	if(num === 0) {
  		this.value = '';
  	} else {
  		this.value = num.toFixed(this.decimals);
  	}
  	

  	this.onKeyCode();

  },
  /**
	 * 检测数字是否合法
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
  numIslegal: function (value) {
    var arr = value.split('.');

    // 如果有过个小数点
    if (arr.length > 2) {
      return false;
    }

    //如果输入位数大于固定个数
    if (arr[0].length > this.digit) {
      return false;
    }

    //如果不能输入小数
    if(this.decimals === 0 && value.indexOf('.') > -1) {
    	return false;
    }

    if (arr[1] && arr[1].length > this.decimals) {
      return false;
    }

    return true;

  },
	/**
	 * 输入是否合法
	 * @return {[type]} [description]
	 */
  inputIsLegal: function (value) {
    if (value[0] == '.' || (value[0] == '0' && (value[1] && value[1] != '.'))) {
      return false;
    }
    return true;
  },
  /**
   * 获取焦点
   * @return {[type]}
   */
  _focus: function () {
  	this.keyBoard.classList.add('focus');
  	this.keyBoard.classList.remove('blur');
    this.targetElement && this.targetElement.classList.add('key-board-active');

  	this.keyBoardStatus = true;
  	this.onFocus(this.value, { keyBoardStatus: this.keyBoardStatus, el: this.targetElement });
  },
  /**
   * 获取焦点
   * @return {[type]}
   */
  _blur: function () {
  	this.keyBoard.classList.add('blur');
  	this.keyBoard.classList.remove('focus');
    this.targetElement && this.targetElement.classList.remove('key-board-active');
    
  	if(this.keyBoardStatus) {
  		this.keyBoardStatus = false;
  		this.addDecimal();

  		this.onBlur(this.value, { keyBoardStatus: this.keyBoardStatus, el: this.targetElement });
  	}
  	
  },
  /**
	 * 搜索元素,解决事件委托颗粒度问题
	 * @param  {[type]} el   [description]
	 * @param  {[type]} attr [description]
	 * @return {[type]}      [description]
	 */
  searchElement: function (el, attr) {
    var touchTarget = el,
      count = 0,
      endTarget = this.targetAttr;

    while (touchTarget) {
      count++;

      if (count > 5 || touchTarget.nodeName.toLowerCase() == 'html') {
        touchTarget = null;

        return touchTarget;
      } 
      else if (touchTarget.getAttribute(endTarget) != null && touchTarget.getAttribute(endTarget).indexOf(attr) > -1) {
        return touchTarget;
      }

      touchTarget = touchTarget.parentNode;
    }
  },
	/**
	 * 插入css
	 * @return {[type]}
	 */
	createKeyBoardCss: function () {
		var element = document.createElement('style');
		var str = `.clearfix:after {
					content: "";
					display: block;
					clear: both
				}

				.text-center {
					text-align: center
				}

				.line-height {
					line-height: 60px
				}

				.key-board {
					width: 100%;
					height: 240px;
					position: fixed;
					bottom: 0;
					left: 0;
					display: flex;
					z-index: 1;
					transition: transform .2s;
					background: #fff
				}

				.key-board.blur {
					transform: translateY(240px)
				}

				.key-board.focus {
					transform: translateY(0)
				}

				.key-board * {
					box-sizing: border-box
				}

				.key-board>.key-code-block {
					flex: 1;
					color: #333
				}

				.key-board>.key-code-block>span {
					float: left;
					font-size: 38px;
					height: 25%;
					width: 33.33%;
					border-top: 1px solid #eee;
					border-right: 1px solid #eee
				}

				.key-board>.options {
					width: 25%;
					height: 100%
				}

				.key-board > .options > .delete {
					font-size: 38px;
					height: 25%;
					border-top: 1px solid #eee
				}

				.key-board > .options > .comfirm {
					height: 75%;
					display: flex;
					display: -webkit-box;
					display: -webkit-flex;
					flex-direction: column;
					justify-content: center;
					color: #fff;
					background: linear-gradient(180deg,#ff6e15,#ffb911);
					font-size: 18px
				}

				.key-board-active:after {
					content: "|";
					animation: showHideCursor 1s steps(1) infinite
				}

				@keyframes showHideCursor {
					50% {
						visibility: hidden
					}
				}`

				element.innerHTML = str;
				document.head.appendChild(element);
	},
	/**
	 * 插入元素
	 * @return {[type]}
	 */
	createKeyBoardElement: function () {
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
	}
}