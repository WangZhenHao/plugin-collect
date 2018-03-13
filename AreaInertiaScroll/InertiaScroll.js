/**
 *author   a_boy
 *created  2017-12-24
 *update   2018-3-13 09:53
 *
 * 
 * 地区    滚动容器的偏移量
 * 1       96px
 * 2       48px
 * 3       0px
 * 4       -48px
 * ...     ...
 * 从而得出通项公式: 144 - 48 * i;
 * 
 *
 *
 * 使用方法:
 * var selecter = new InertiaScroll();
   selecter.init({
		target: '.scrollTarget',    //召唤插件的class类
		data: LAreaData,			//传入的数据
		callback: function(res) {   //点击确认按钮后的回调函数
			console.log(this);
			this.target.value = res.join(',');
		}
	})

 */


function InertiaScroll() {
	this.createInertiaWrap();
}

InertiaScroll.prototype = {
	/**
	 * 创建地区联
	 * @return {[type]} [description]
	 */
	createInertiaWrap: function() {
		var div = document.createElement('div');
		div.innerHTML = '<div class="inertiaScroll-wrap">\
							<div class="shadow-box"></div>\
							<div class="inertiaScroll-container">\
								<div class="inertiaScroll-options clear">\
									<span class="options-left">取消</span>\
									<span class="options-right">确定</span>\
								</div>\
								<div class="inertia-scorll">\
									<div class="vertical-wrap"></div>\
									<div class="inertia-scorll-bg"></div>\
								</div>\
							</div>\
						</div>';
		document.body.appendChild(div);
	},
	/**
	 * 初始化操作
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	init: function(params) {
		//点击的目标
		this.targetName = params.target;
		//地区数据来源
		this.data = params.data;
		//获取滚动容器元素
		this.wrap = document.querySelector('.inertiaScroll-wrap');
		//滚动元素的父容器
		this.inertaiScollWrap = this.wrap.getElementsByClassName('inertia-scorll')[0];

		this.targetEvent();

		this.inertiaWrapEvent();
		//惯性滚动函数;
		this.inertiaScorllEvent();
		//回调函数
		this.callback = params.callback;
		//目标数据;
		this.dataTarget = null;
		// 初始化数据
		this.initData();

	},
	/**
	 * 初始化数据
	 */
	initData: function() {
		this.dataWrap = this.wrap.querySelector('.inertia-scorll');
		var div = this.setDateToHtml(this.data, 'name');
		this.setElementAttr(div, 'data-areaTarget', 'province');
		this.dataWrap.appendChild(div);
		this.provinceChange(0);
	},
	/**
	 * 设置元素属性
	 */
	setElementAttr: function(element, attr, value) {
		element.setAttribute(attr, value);
	},
	/**
	 * 获取元素属性
	 * 
	 */
	getElementAttr: function(element, attr) {
		return element.getAttribute(attr);
	},
	/**
	 * 删除元素
	 */
	removeElement: function(parentElement, child) {
		parentElement.removeChild(child);
	},
	/**
	 * 把地区拼装成html
	 */
	setDateToHtml: function(target, name) {
		var strProvince = '';
		if(target) {
			for(var i = 0, len = target.length; i < len; i++) {
				strProvince += '<div>' + target[i][name] + '</div>';
			}
		}
		var div = document.createElement('div');
		div.className = 'inertia-list';
		div.style.transform = 'translate3d(0, 96px, 0)';
		//滚动容器的高度
		div.style.height = len * 48 + 'px';
		div.innerHTML = strProvince;
		return div;
	},
	/**
	 * 重置地区
	 */
	chageAllArae: function() {
		var area = this.getElementAttr(this.scrollTarget, 'data-areaTarget'),
			AraeCurrentIndex = this.correctionIndex - 1;
		switch(area) {
			case 'province':
				this.cityNode = this.scrollTarget.nextSibling;
				this.countryNode = this.cityNode.nextSibling;
				this.provinceChange(AraeCurrentIndex);
			break;
			case 'city':
				this.countryNode = this.scrollTarget.nextSibling;
				this.cityChange(AraeCurrentIndex);
			break;
		}
	},
	/**
	 * 省改变
	 */
	provinceChange: function(index) {
		if(this.cityNode) {
			this.removeElement(this.inertaiScollWrap, this.cityNode);
		}
		this.dataTarget = this.data[index]['child'];
		var cityArea = this.setDateToHtml(this.dataTarget, 'name');
		this.setElementAttr(cityArea, 'data-areaTarget', 'city');
		this.dataWrap.appendChild(cityArea);
		this.cityChange(0);
	},
	/**
	 * 城市改变
	 * @return {[type]} [description]
	 */
	cityChange: function(index) {
		  if(this.countryNode) {
			  this.removeElement(this.inertaiScollWrap, this.countryNode);
		  }
		  var data = this.dataTarget[index]['child'];
		  if(data) {
			  var countryArea = this.setDateToHtml(this.dataTarget[index]['child'], 'name');
			  this.dataWrap.appendChild(countryArea);
		  }
	},
	/**
	 * 处理插件显示隐藏函数
	 * 
	 */
	targetEvent: function() {
		// this.target.addEventListener('click', function(e) {
		// 	this.targetShowHide();
		// }.bind(this));
		document.addEventListener('click', function(e) {
			var event = e ||window.event,
				el = e.srcElement || e.target;
				// cls = el.className;
			// if(cls.indexOf(this.targetName) > -1) {
			if(this.getElementAttr(el, 'data-inertia') == this.targetName) {
				this.target = el;
				this.targetShowHide();
			}

		}.bind(this))
	},
	/**
	 * 开启插件动画效果
	 * 
	 */
	targetShowHide: function() {
		if(this.wrap.className.indexOf('show-animated') > -1) {
			this.wrap.className = this.wrap.className.replace(' show-animated', '');
		} else {
			this.wrap.className += ' show-animated';
		}
	},
	/**
	 * 点击确定或取消按钮
	 * 
	 */
	inertiaWrapEvent: function() {

		function showWrap(e) {
			var el = e.srcElement || e.target;
			var cls = el.className;
			if(cls.indexOf('options-left') > -1 || 
			   cls.indexOf('shadow-box') > -1) {
				this.targetShowHide();
			}
			//点击确定
			if(cls.indexOf('options-right') > -1) {
				this.Confirm();
			} 

		}
		this.wrap.addEventListener('click', function(e) {
			showWrap.call(this, e);
		}.bind(this));
	},
	/**
	 * 点击确定按钮
	 */
	Confirm: function() {
		var target = this.wrap.querySelectorAll('.inertia-list'),
		    arr = [];
		for(var i = 0, len = target.length; i < len; i++) {
			if(target[i].children.length > 0) {
				arr.push(this.getTargetValue(target[i]));
			}
		}
		if(typeof this.callback == 'function') {
			this.callback(arr);
			this.targetShowHide();
		}
	},
	/**
	 * 获取滚动中间元素的index;
	 */
	getTargetIndex: function(position) {
		return Math.round((position - 144) / -48);
	},
	/**
	 * 获取滚动中间元素的值
	 * 
	 */
	getTargetValue: function(target) {
		var posi = this.getTargetCurentyPosition(target),
		    index = this.getTargetIndex(posi),
		    scrollTargetChilid = target.children;
		return scrollTargetChilid[index - 1].innerText;
	},
	/**
	 * 检查是否为pc端
	 * 
	 */
	checkIsPc: function() {
		return false;
    },
    /**
     * 惯性滚动事件初始化
     */
	ScorllEventInit: function() {
		// this.offset = 50;
		this.cur = 0;
		// this.isDown = false;
		this.vy = 0;
		this.isIntransition = false;
		//是否正在修正位置
		this.isCorrectionPoition = false;
		
	},
	/**
	 * 惯性滚动事件
	 * 
	 * 
	 */
	inertiaScorllEvent: function(e) {
		var self = this;
		/**
		 * 事件处理函数
		 * 
		 * 
		 */
		function scrollEvent(e) {
			var el = e.srcElement || e.target;
			//快速点击的时候,还是会显示true;
			// console.log(self.isCorrectionPoition)
			if((el.parentNode.className.indexOf('inertia-list') > -1  && !self.isCorrectionPoition) || (self.scrollTarget == el.parentNode)) {
				//防止点击其他元素的时候,this.target被改变
				self.scrollTarget = el.parentNode;
				self.scrollTargetChilid = self.scrollTarget.children;
			} else {
				return;
			}
			//触摸开始,触摸移动,触摸结束 事件处理函数
			if(self.scrollTarget.className.indexOf('inertia-list') > -1) {
				switch(e.type) {
					case 'touchstart' :
						self.inertiaStart(e);
					break;
					case 'touchmove' :
						self.inertiaMove(e);
					break;
					case 'touchend' :
						self.inertiaEnd(e);
					break;
				}
			}
		}
		//初始化手势
		this.ScorllEventInit();
		//触摸开始
		this.wrap.addEventListener('touchstart', scrollEvent);
		//触摸移动
		this.wrap.addEventListener('touchmove', scrollEvent);
		//触摸结束
		this.wrap.addEventListener('touchend', scrollEvent);
	},
	/**
	 * 修正位置
	 */
	correctionPoition: function(position) {
		// 通过四舍五入来计算应该移动到第几个地区
		this.correctionIndex = this.getTargetIndex(position);//Math.round((position - 144) / -48);
		return 144 - (48 * this.correctionIndex);
		// for(var i = 1, len = this.scrollTargetChilid.length; i <= len; i++) {
		// 	if(position > 144 - 48 * i) {
		// 		this.correctionIndex = i;
		// 		break;
		// 	}
		// }

		// if(position > (168 - 48 * this.correctionIndex)) {
		// 	this.correctionIndex--;
		// }
		// return 144 - (48 * this.correctionIndex);	
	},
	/**
	 * 动画滚回来
	 */
	easeMove: function(target, speed) {
		var speed = speed || 0.2;
		this.isIntransition = true;

		this.timer = setInterval(function() {

			this.cur -=(this.cur - target) * speed;
			if(Math.abs(this.cur - target) < 1) {
				this.cur = target;
				clearInterval(this.timer);
				//重置地区
				this.correctionPoition(target);
				this.chageAllArae();
				this.isIntransition = false;
				this.isCorrectionPoition = false;
			}

			this.setTargetPostion(this.cur);
		}.bind(this), 1000/60)
	},
	/**
	 * 手指离开滚动动画效果
	 */
	inertiaInterval: function() {
		this.isCorrectionPoition = true;
		this.timer = setInterval(function() {
			//摩擦系数
			this.vy *= 0.9;
			this.cur += this.vy;
			this.setTargetPostion(this.cur);
			//到达底部
			if(-this.cur > this.bottomDirection) {
				clearInterval(this.timer);
				this.easeMove(-this.bottomDirection);
				return;
			}

			//到达顶部
			if(this.cur > 96) {
				clearInterval(this.timer)
				this.easeMove(96)
				return;
			}

			// 如果速度小于0.5
			if(Math.abs(this.vy) < 0.5) {
				// this.isCorrectionPoition = true
				clearInterval(this.timer);
				if(this.cur > 96) {
					this.easeMove(96)
					return;
				}
				if(-this.cur > this.bottomDirection) {
					this.easeMove(-this.bottomDirection);
					return;
				}
				// this.easeMove(this.cur);
				this.easeMove(this.correctionPoition(this.cur))

			}
		}.bind(this), 1000/60);
	},
	/**
	 * 触摸结束
	 */
	inertiaEnd: function(e) {
		if(e.timeStamp - this._startTime > 100) {
			this.vy = 0;
		} 
		// this.friction = ((this.vy >> 31) * 2 + 1) * 0.5;
		//滑到底部最长的距离
		// this.oh = this._oh - this._ch;

		this.inertiaInterval();
	},

	/**
	 * 触摸移动
	 * @param  {object} e 事件对象
	 * 
	 */
	inertiaMove: function(e) {
		e.preventDefault();
		clearTimeout(this.timer);
		var clientY = e.touches[0].clientY;
		//如果缓慢滑动
		if(e.timeStamp - this._startTime > 40) {
			this._startTime = e.timeStamp;
			this.cur = clientY - this._oy;
			this.setTargetPostion(this.cur);
		}
		this.vy = clientY - this._cy;
		this._cy = clientY;
		
	},
	/**
	 * 触摸开始
	 */
	inertiaStart: function(e) {
		// 如果还在修正位置
		if(this.isCorrectionPoition) {
			return;
		}
		clearTimeout(this.timer);

		//获取滚动元素当前偏移量
		this.cur = this.getTargetCurentyPosition();
		this.vy = 0;
		//获取触摸的位置
		var clientY = e.touches[0].clientY;
		this._oy = clientY - this.cur;
		this._cy = clientY;
		//取的触摸开始时间
		this._startTime = e.timeStamp;
		// this.isDown = true;
		//取的滚动元素的总高度;
		// this._oh = this.scrollTarget.scrollHeight;
		this._oh = this.scrollTarget.offsetHeight;
		//取的滚动元素父级容器的高度
		this._ch = 240;//this.scrollTarget.parentNode.offsetHeight;
		// this.isDown = true;
		this.bottomDirection = this._oh - (this._ch / 2) - 25;
	},
	/**
	 * 设置容器偏移量
	 */
	setTargetPostion: function(y) {
		// var position = parseInt(y);
		this.scrollTarget.style.transform = "translate3d(0," +  y + "px,0)";
	},
	/**
	 * 获取滚动元素位置
	 */
	getTargetCurentyPosition: function(target) {
		// var re = /(,|\s)(-?\d+)(px)(,|\s)/,
		// 	str = this.target.style.transform,
		// 	value = str.match(re);
		// return RegExp.$2;
		var target = target || this.scrollTarget,
		 	str = target.style.transform,
		 	arr = str.split(', ');
		return parseFloat(arr[1]);

	}
}