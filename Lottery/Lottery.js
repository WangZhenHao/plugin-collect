/**
 * 简单的抽奖插件
 *
 * author   wzh
 * create   2018-12-7
 *
 *
 * 如果有6(n)个奖项
 *
 * 可以得出每一个奖项可以分成   360 / 6(n) = 60(deg)度
 * 
 * 第一个奖项旋转     180度
 * 第二个奖项旋转     120度
 * 第三个奖项旋转     60度
 * 第四个奖项旋转     0度
 * 第五个奖项旋转     -60 = 320度
 * 第六个奖项旋转     -120 = 240度
 *
 * 因而可以得出通项公式  180 + (n - 1) * -deg
 * 
 */
function Lottery(params) {
	this.params = params || {};
	this.len = this.params['lotteryItem'].length;
	this.isAnimated = false;
	this.init();
}

Lottery.prototype = {

	init: function() {
		this.createCss();
		this.createDom();
	},	
	//创建样式
	createCss: function() {
		var style = document.createElement('style'),
			transformOrigin = this.params['wrap']['width'] ? parseInt(this.params['wrap']['width']) / 2 : 200;
			
		var cssStr = `
		    .lottery-el {
				width: 400px;
				height: 400px;
				background: #ffbf08;
				border-radius: 50%;
				position: relative;
		    }
		    #arrow {
		    	position: absolute;
		    	width: 76px;
		    	height: 110px;
		    	background: url(https://operator-advmainimg.zhongxiang51.com/lottery-arrow.png);
		    	background-size: 100% 100%;
		    	left: 50%;
		    	top: 50%;
		    	transform: translate3d(-50%, -40%, 0);
		    	z-index: 2;
		    }
			.lottery-wrap {
				width: 100%;
				height: 100%;
				transition: transform 6s ease-in-out;	
				transform: rotate(0deg);			
			}
			.lottery-wrap .lottery-item {
				width: 100px;
				height: 100px;
				position: absolute;
				left: 50%;
				transform: translate3d(-50%, 0, 0);
				padding-top: 20px;
				text-align: center;
				transform-origin: 50% ${transformOrigin}px;
				color: #fff;
			}
			.lottery-wrap .lottery-line {
				width: 2px;
				height: 200px;
				position: absolute;
				left: 50%;
				transform: translate3d(-50%, 0, 0);
				background: #fff;
				transform-origin: 50% bottom;
			}
			.lottery-wrap li {
				list-style: none;
				box-sizing: border-box;
			}
			.lottery-wrap p {
				padding: 0;
				margin: 0;
			}
			.lottery-wrap img {
				padding-top: 5px;
			}
		`;
		style.innerHTML = cssStr;
		document.head.appendChild(style);
	},
	//创建Dom节点
	createDom: function() {
		var el = document.createElement('div'),
			wrapStyleParams = this.params['wrap'],
			lotteryItem = this.params['lotteryItem'],
			itemElement = '',
			lineElement = '',
			arrowEl = `<div id="arrow"></div>`;

		this.lotteryItemDeg = 360 / this.len;
		this.initLineDeg = this.lotteryItemDeg / 2;

		this.lotteryWrap = document.createElement('div');
		el.className = 'lottery-el';
		this.createAnimate();

		this.lotteryWrap.id = 'lottery-wrap';
		this.lotteryWrap.className = 'lottery-wrap';

		for(var i in wrapStyleParams) {
			el.style[i] = wrapStyleParams[i];
		}


		lotteryItem.forEach((item, index) => {
			var str = `<li class="lottery-item" style="transform: translate3d(-50%, 0, 0) rotate(${index * this.lotteryItemDeg}deg);"><p>${item['desc']}</p>`;
			var lineStr = `<div class="lottery-line" style="transform: translate3d(-50%, 0, 0) rotate(${this.initLineDeg + index * this.lotteryItemDeg}deg);"></div>`;

			if(item['img']) {
				str += `<img width="40px" height="40px" src="${item['img']}"></li>`
			} else {
				str += '</li>'
			}


			lineElement += lineStr;
			itemElement += str;

		});

		this.lotteryWrap.innerHTML += lineElement;
		this.lotteryWrap.innerHTML += itemElement;

		el.innerHTML += arrowEl;

		

		el.appendChild(this.lotteryWrap);
		document.body.appendChild(el);

		this.toLottery();

	},
	//创建动画
	createAnimate: function() {
		var animate = this.params['animate'];
		for(var i in animate) {
			this.lotteryWrap.style[i] = animate[i];
		}
	},

	//点击抽奖
	toLottery: function() {
		this.arrow = document.querySelector('#arrow');
	},

	toAnimate(index) {
		if(this.isAnimated) return;

		var cricle = 360 * 4,
			deg = 180 - (index - 1) * this.lotteryItemDeg,
			rotate = 0,
			self = this;
		this.isAnimated = true;
		this.index = index;

		if(deg < 0) {
			deg = 360 + deg
		}
		//得出需要旋转的角度
		rotate = cricle + deg;

		this.lotteryWrap.style.transitionProperty = 'transform'
		this.lotteryWrap.style.transform = `rotate(${rotate}deg)`;

		this.toAnimateHandle = function() {
			if(typeof self.params.success == 'function') {
				self.isAnimated = false;
				self.params.success(self.params['lotteryItem'][self.index - 1]);
			}
		}

		this.lotteryWrap.addEventListener('transitionend', this.toAnimateHandle);


	},
	//清楚事件
	destroy: function() {
		this.lotteryWrap.removeEventListener('transitionend', this.toAnimateHandle);
		this.lotteryWrap.style.transitionProperty = 'none'
		this.lotteryWrap.style.transform = `rotate(0deg)`;
	}
}