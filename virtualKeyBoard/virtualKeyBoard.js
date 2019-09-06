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
  // 使用方法
      // html <div class="key-board-cursor input-price-box" data-key-board="target" id="keyBoard">
  /** js
   * 虚拟键盘
   KeyBoard({
    target: 'target',
    isInitFocus: false, // 初始化是否获取焦点显示键盘
    isFillDecimal: false, // 默认 false 输入"."是否补0，不补0将处理掉"."
    inputRegion: '.input-price-box', // 需要作为输入框绑定的类
    callBack: function(res, status) {
      console.log('键盘点击回调',res, status)
    },
    // 确认按钮事件
    comfirm: function(res) {
      console.log(res);
    }
  });
    */

/**
 * @description: 虚拟键盘类
 * @param {Object} 配置参数对象 {
 * @param {Number} digit 允许输入数字位数
 * @param {Number} decimals 小数有效位
 * }
 * @return: {Class}
 */
function KeyBoard(params) {
  if (this instanceof KeyBoard) {
    Object.assign(this, params)
    this.init()
  } else {
    return new KeyBoard(params)
  }
}

KeyBoard.prototype = {
  /**
   * 插入css
   * @return {[type]} [description]
   */
  //
  createCss: function() {
    var element = document.createElement('style')
    var str =
      '.clearfix:after{content:"";display:block;clear:both}.text-center{text-align:center}.line-height{line-height:60px}.key-board{width:100%;height:240px;position:fixed;bottom:0;left:0;display:flex;z-index:9;transition:transform .2s;background:#fff}.key-board.blur{transform:translateY(240px)}.key-board.focus{transform:translateY(0)}.key-board *{box-sizing:border-box}.key-board>.key-code-block{flex:1;color:#333}.key-board>.key-code-block>span{float:left;font-size:38px;height:25%;width:33.33%;border-top:1px solid #eee;border-right:1px solid #eee}.key-board>.options{width:25%;height:100%;}.key-board>.options>.delete{font-size:38px;height:25%;border-top:1px solid #eee}.key-board>.options>.comfirm{height:75%;display:flex;display:-webkit-box;display:-webkit-flex;flex-direction:column;justify-content:center;color:#fff;background:linear-gradient(180deg,#ff6e15,#ffb911);font-size:18px}.key-board-cursor.active:after{content:"|";animation:showHideCursor 1s steps(1) infinite}@keyframes showHideCursor{50%{visibility:hidden}}'
    element.innerHTML = str
    document.head.appendChild(element)
  },
  /**
   * 插入html
   * @return {[type]} [description]
   */
  createKeyBoard: function() {
    var element = document.createElement('div')
    element.id = 'key-board-wrap'
    element.className = 'key-board text-center focus'
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
      '<span class="iconfont icon-jianpan js-slide-down-keyboard"></span>' +
      '<span class="key-code">0</span>' +
      '<span class="iconfont icon-dian1"></span>' +
      '</div>' +
      '<div class="options">' +
      '<div class="delete iconfont icon-tuige line-height"></div>' +
      '<div class="comfirm">' +
      '确认<br>' +
      '支付' +
      '</div>' +
      '</div>'
    document.body.appendChild(element)
  },
  /**
   * 初始化dom操作
   * @return {[type]} [description]
   */
  initDom: function() {
    this.createCss()
    this.createKeyBoard()
    this.keyBoard = document.querySelector('#' + this.wrap)
    this.touchEvent()
    if (this.isInitFocus) {
      this.focus()
    } else {
      this.blur()
    }
    this.forEachInputElement(this.inputRegion)
  },
  /**
   * 虚拟键盘初始化
   * @return {[type]} [description]
   */
  init: function() {
    this.digit = 5
    this.decimals = 2
    this.keyBoardStatus = true
    this.isIegalNum = false
    this.cache = [] // 缓存输入的数据
    this.value = ''
    this.wrap = this.wrap || 'key-board-wrap'
    this.inputRegion = this.inputRegion || '.key-board-cursor'
    this.inputRegionElementArray = [] // 输入框元素数组
    this.initDom()
  },
  /**
   * @description: 遍历输入框元素
   * @param {Element}
   * @return:
   */
  forEachInputElement: function(element) {
    var self = this
    self.inputRegionElementArray = []
    Array.from(document.querySelectorAll(element), function(ele, index) {
      self.inputRegionElementArray.push(ele)
      self.setCache(ele.innerText, index)
    })
  },
  isFalsy: function(data) {
    var result = false
    if (data === undefined || data === null || data === NaN || data === '') {
      result = true
    }
    return result
  },
  setCache: function(value, index) {
    if (this.isFalsy(index)) {
      return
    }
    this.cache.push({
      index: index,
      value: value
    })
  },
  getCache: function() {
    return this.cache
  },
  /**
   * @description: 输入"."而没有输入小数，处理去掉点 //?修改为多个键盘后处理失效
   * @return: void
   */
  removeDotWithDecimal: function(value) {
    if (this.isFalsy(value)) {
      return
    }
    var arr = value.split('.')
    if (!arr[1]) {
      value = arr[0]
    }
    return value
  },
  /**
   * 判断是否需要填充零
   * @return {[type]} [description]
   */
  twoDecimal: function() {
    var arr = this.value.split('.')
    if (typeof arr[1] == 'undefined') {
      this.value += '.'
      this.addTwoDecimal(this.decimals)
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
    var str = ''
    for (var i = 0; i < len; i++) {
      str += 0
    }
    this.value += str
  },
  /**
   * 失去焦点
   * @return {[type]} [description]
   */
  blur: function() {
    var classStr = this.keyBoard.className
    this.keyBoard.className = classStr.replace('focus', 'blur')
    this.keyBoardStatus = false
    if (Number(this.value) <= 0) {
      this.value = ''
      this.emitKeyCode()
      return
    }
    // 输入小数是否需要补0，默认不需要
    if (this.isFillDecimal) {
      this.twoDecimal()
    } else {
      // TODO: 补0功能失效
      this.removeDotWithDecimal()
    }
  },
  /**
   * 获取焦点
   * @return {[type]} [description]
   */
  focus: function() {
    var classStr = this.keyBoard.className
    this.keyBoard.className = classStr.replace('blur', 'focus')
    this.keyBoardStatus = true
    this.emitKeyCode()
  },
  /**
   * @description: 切换输入，光标聚焦
   * @param {Element} 聚焦DOM元素
   */
  changeInput: function(targetEl) {
    var self = this
    var classList = targetEl.classList
    this.removeCursor()
    if (classList.contains('key-board-cursor')) {
      classList.add('active')
    }
    // 缓存上一个输入框的输入内容
    this.inputRegionElementArray.forEach(function(element, index) {
      if (element.classList.contains('active')) {
        element.innerText = ''
        if (self.cache[index]) {
          self.value = self.cache[index].value
        }
      }
    })
  },
  /**
   * @description: 清除光标
   */
  removeCursor: function() {
    this.inputRegionElementArray.forEach(function(element) {
      element.classList.remove('active')
    })
  },
  /**
   * 事件函数
   * @return {[type]} [description]
   */
  touchEvent: function() {
    document.addEventListener(
      'touchstart',
      function(e) {
        var el = e.scrElement || e.target,
          targetEl = this.searchElement(el, this.target)
        if (targetEl) {
          this.changeInput(targetEl)
          this.focus()
        } else {
          this.removeCursor()
          this.blur()
        }
      }.bind(this)
    )
    /**
     * @description: 绑定键盘点击对应数字输入显示数字事件
     * @param {Element} 点击键盘DOM元素
     * @return: void
     */
    this.keyBoard.addEventListener(
      'touchstart',
      function(e) {
        e.stopPropagation()
        var el = e.scrElement || e.target,
          className = el.className
        if (className.indexOf('key-code') > -1) {
          var num = el.innerText
          this.keyCode(num)
        } else if (className.indexOf('delete') > -1) {
          this.del()
        } else if (className.indexOf('icon-dian1') > -1) {
          this.keyCode('.')
        } else if (className.indexOf('comfirm') > -1) {
          this.touchComfirmButton()
        } else if (className.indexOf('js-slide-down-keyboard') > -1) {
          this.blur()
        }
      }.bind(this)
    )
  },
  /**
   * 点击确定按钮
   * @return {[type]} [description]
   */
  touchComfirmButton: function() {
    if (Number(this.value) > 0) {
      // 在外层调用处理
      // this.cache.map(function(item, index) {
      //   item.value = parseFloat(item.value);
      // })
      this.comfirm(this.cache)
    }
  },
  /**
   * 数字
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  keyCode: function(value) {
    var oldValue = this.value
    this.value += value

    if (!this.legal(this.value)) {
      this.value = oldValue
      return
    }
    this.emitKeyCode()
  },
  /**
   * 验证规则
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  legal: function(value) {
    var arr = [this.numIslegal, this.inputIsLegal],
      self = this
    return arr.every(function(fn) {
      return fn.call(self, value)
    })
  },
  /**
   * 检测数字是否合法
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  numIslegal: function(value) {
    var arr = value.split('.')
    if (arr.length > 2) {
      return false
    }
    if (arr[0].length > this.digit) {
      return false
    }
    if (arr[1] && arr[1].length > this.decimals) {
      return false
    }

    return true
  },
  /**
   * 输入是否合法
   * @return {[type]} [description]
   */
  inputIsLegal: function(value) {
    if (value[0] == '.' || (value[0] == '0' && (value[1] && value[1] != '.'))) {
      return false
    }
    return true
  },
  /**
   * 删除按钮
   * @return {[type]} [description]
   */
  del: function() {
    var self = this
    this.inputRegionElementArray.forEach(function(element, index) {
      if (element.classList.contains('active')) {
        if (self.cache[index]) {
          self.value = self.cache[index].value.slice(0, -1)
        }
      }
    })
    this.emitKeyCode()
  },
  /**
   * @description: 对应输入框显示选择的数字
   */
  showInputNumber: function() {
    var self = this
    this.inputRegionElementArray.forEach(function(element, index) {
      if (element.classList.contains('active')) {
        element.innerText = ''
        self.cache[index].value = self.value
        element.innerText = self.cache[index].value
      }
    })
  },
  /**
   * 输出数字
   * @return {[type]} [description]
   */
  emitKeyCode() {
    // TODO: 校验去掉
    var str = this.value
    if (!str) {
      this.isIegalNum = false
    } else {
      this.isIegalNum = true
    }
    this.showInputNumber()
    this.callBack(
      {
        value: this.cache,
        isIegalNum: this.isIegalNum
      },
      this.keyBoardStatus
    )
  },
  /**
   * 搜索元素,解决事件委托颗粒度问题
   * @param  {[type]} el   [description]
   * @param  {[type]} attr [description]
   * @return {[type]}      [description]
   */
  searchElement: function(el, attr) {
    var target = el,
      count = 0
    while (target) {
      count++
      if (count > 5 || target.nodeName.toLowerCase() == 'html') {
        target = null
        return target
      } else if (
        target.getAttribute('data-key-board') != null &&
        target.getAttribute('data-key-board').indexOf(attr) > -1
      ) {
        return target
      }
      target = target.parentNode
    }
  }
}
