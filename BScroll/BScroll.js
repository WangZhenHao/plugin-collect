/**
 * bettor-scroll中transform滚动原理
 *
 * 作者源码地址: https://github.com/ustbhuangyi/better-scroll
 */

function addEvent(el, type, fn, capture) {
   el.addEventListener(type, fn, {passive: false, capture: !!capture})
}

function getNow() {
  return window.performance && window.performance.now ? (window.performance.now() + window.performance.timing.navigationStart) : +new Date()
}

function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}
/**
* current: 触摸结束最后的距离
* start: 触摸开始的距离
* time: 触摸结束和触摸开始的时间差
* lowerMargin: 最大的滚动距离
* upperMargin: 最小的滚动距离
* wrapperSize: 滚动父容器的高度
* options: 配置信息
* scroll: BScroll实例
* @type {[type]}
*/
function momentum(current, start, time, lowerMargin, upperMargin, wrapperSize, options, scroll) {
  let distance = current - start
  let speed = Math.abs(distance) / time

  let {deceleration, itemHeight, swipeBounceTime, wheel, swipeTime} = options
  let duration = swipeTime
  let rate = wheel ? 4 : 15

  let destination = current + speed / deceleration * (distance < 0 ? -1 : 1)
  // if (wheel && itemHeight) {
  //   destination = scroll._findNearestValidWheel(destination).y
  // }

  if (destination < lowerMargin) {
    destination = wrapperSize ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - (wrapperSize / rate * speed)) : lowerMargin
    duration = swipeBounceTime
  } else if (destination > upperMargin) {
    destination = wrapperSize ? Math.min(upperMargin + wrapperSize / 4, upperMargin + wrapperSize / rate * speed) : upperMargin
    duration = swipeBounceTime
  }

  return {
    destination: Math.round(destination),
    duration
  }
}

const ease = {
  // easeOutQuint
  swipe: {
    style: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fn: function (t) {
      return 1 + (--t * t * t * t * t)
    }
  },
  // easeOutQuard
  swipeBounce: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function (t) {
      return t * (2 - t)
    }
  },
  // easeOutQuart
  bounce: {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function (t) {
      return 1 - (--t * t * t * t)
    }
  }
}

function BScroll(el, options) {
	this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0]
	this.scrollerStyle = this.scroller.style

	this._init(options);
}

BScroll.prototype = {
	_init: function(options = {}) {
		this.x = 0;
		this.y = 0;

		this.options = Object.assign(options, {
			momentum: true,
			bounceTime: 800,
			momentumLimitTime: 300,
			swipeTime: 2500,
			swipeBounceTime: 500,
			deceleration: 0.0015,
			useTransform: true,
			momentumLimitDistance: 15,
		});

		this._addDOMEvents();

		this.refresh();
	},
	refresh: function() {
		this.minScrollY = 0;

		let wrapperRect = getRect(this.wrapper)
	    this.wrapperHeight = wrapperRect.height

	    let scrollerRect = getRect(this.scroller)
	    this.scrollerHeight = scrollerRect.height 

	    this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
	},	
	_addDOMEvents: function() {
		addEvent(this.wrapper, 'mousedown', this)
		addEvent(window, 'mousemove', this)
		addEvent(window, 'mouseup', this)

		addEvent(this.scroller, 'transitionend', this)
		
	},
	_start: function(e) {
		this._transitionTime();
		this.stop();
		this.startTime = getNow();
		this.startY = this.y;
		this.initiated = true;
		this.pointY = e.pageY;


	},
	_move: function(e) {
		if(!this.initiated) {
			return;
		}

	    let deltaY = e.pageY - this.pointY

	    this.pointY = e.pageY

	    let timestamp = getNow()
		let newY = this.y + deltaY
		let newX = 0

		this._translate(newX, newY);

		if(timestamp - this.startTime > this.options.momentumLimitTime) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}
	},
	_end: function(e) {
		this.initiated = false;

		if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
	      return
	    }

		this.endTime = getNow();
		let duration = this.endTime - this.startTime;
		let newY = this.y,
			newX = this.x,
			time = 0;
		// console.log(duration)
		let absDistY = Math.abs(newY - this.startY)

		if (this.options.momentum && 
			duration < this.options.momentumLimitTime && 
			(absDistY > this.options.momentumLimitDistance)
		) {
			//快速滑动的时候 求出最终位置,运动的时间
			let momentumY = momentum(this.y, this.startY, duration, this.maxScrollY, this.minScrollY, this.wrapperHeight, this.options, this);
			time = momentumY.duration;
			newY = momentumY.destination;
			this.isInTransition = true
		}
	
		
		let easing = ease.swipe;

		if (newX !== this.x || newY !== this.y) {
			if(newY > this.minScrollY || newY < this.maxScrollY) {
				easing = ease.swipeBounce
			}

			this.scrollTo(newX, newY, time, easing)
		}
	},
	_translate: function(x, y) {
		this.scrollerStyle['transform'] = `translate(${x}px,${y}px) translateZ(0px)`
		this.x = x;
		this.y = y;
	},
	_transitionTime: function(time = 0) {
		this.scrollerStyle['transitionDuration'] = time + 'ms'
	},
	handleEvent: function(e) {
		switch(e.type) {
			case 'mousedown':
				this._start(e);
			break;
			case 'mousemove':
			    this._move(e);
			break;
			case 'mouseup':
			case 'mousecancel':
			    this._end(e);
			break;
			case 'transitionend':
			    this._transitionend(e);
			break;
		}
	},
	scrollTo: function(x, y, time = 0, easing = ease.bounce, isSilent) {
		if(x === this.x && y === this.y) {
			return;
		}
		this.isInTransition = time > 0 && (y !== this.y);
		this._transitionTimingFunction(easing.style)
	    this._transitionTime(time)
	    this._translate(x, y)
	},
	resetPosition: function(time = 0, easeing = ease.bounce) {
		let y = this.y
		let x = this.x
        let roundY = Math.round(y)

        if(roundY > this.minScrollY) {
        	y = this.minScrollY
        } else if(roundY < this.maxScrollY) {
        	y = this.maxScrollY
        }

        if(x === this.x && y === this.y) {
        	return false;
        }

        this.scrollTo(x, y, time, easeing);
        return true;
	},
	_transitionTimingFunction: function(easing) {
		this.scrollerStyle['transitionTimingFunction'] = easing;
	},
	_transitionend: function(e) {
		this._transitionTime()
		if(this.resetPosition(this.options.bounceTime, ease.bounce)) {
			this.isInTransition = false
		}

	},
	stop: function() {
		if(this.isInTransition) {
			this.isInTransition = false
			let pos = this.getComputedPosition()
	        this._translate(pos.x, pos.y)
		}
	},
	getComputedPosition: function() {
		let matrix = window.getComputedStyle(this.scroller, null)
	    let x
	    let y
	    
	    matrix = matrix['transform'].split(')')[0].split(', ')
        x = +(matrix[12] || matrix[4])
        y = +(matrix[13] || matrix[5])
        // debugger
        return {
	      x,
	      y
	    }
	}
}