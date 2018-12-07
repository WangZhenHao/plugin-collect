/**
 * 简单的抽奖插件
 *
 * author   wzh
 * create   2018-12-7
 * 
 */
function Lottery(params) {
	this.params = params || {};
	this.len = this.params['lotteryItem'].length;
	this.init();
}

Lottery.prototype = {

	init: function() {
		this.createCss();
		this.createDom();
	},	
	//创建样式
	createCss: function() {
		var style = document.createElement('style');
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
		    	background: url(./arrow.png);
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
				transform-origin: 50% 200px;
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
		// console.log(this.lotteryWrap)
		// lotteryWrap.addEventListener('click', function() {
		// 	this.toAnimate()
		// }.bind(this))
	},

	toAnimate(index) {
		var cricle = 360 * 4,
			rotate = cricle + index * (360 / this.len)
	}
}