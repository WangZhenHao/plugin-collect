		/**
 * 日期选择插件
 * 
 * author    wzh
 * created   2018-7-24
 */


function Calendar() {
	
}

Calendar.prototype = {
	/**
	 * 初始化操作
	 * @return {[type]} [description]
	 */
	init: function(parmas = {}) {
		this.config(parmas);
		this.createCss();
		this.creteHtml();
		this.initDom();
	},
	/**
	 * 设置配置
	 * @return {[type]} [description]
	 */
	config: function(parmas) {
		var date = new Date();
		this.year = parmas.year || date.getFullYear();
		// this.month = parmas.month || date.getMonth() + 1;
		this.monthList = parmas.monthList;
		this.callBack = parmas.confirm;
		this.wrap = parmas.wrap;
		this.data = parmas.data;
		// this.dataLength = this.data.length;

		this.hashDataList = {}
		for(var item of this.data) {
			this.hashDataList[item.date] = item;
		}
		this.data = null;
	},
	/**
	 * 获取某一个月的天数
	 * @return {[type]} [description]
	 */
	getMonthLength(year, month) {
		return new Date(year, month, 0).getDate();
	},
	/**
	 * 获取某一月的第一天是星期几
	 * @param  {[type]} year  年份
	 * @param  {[type]} month 月份,如果是0 这表示上一年的12月
	 * @return {[type]} 1表示周一, 7表示周日
	 */
	getFirsrtweekend(year, month) {
		return new Date(year, month - 1, 0).getDay() + 1;
	},
	/**
	 * 插入css
	 * @return {[type]} [description]
	 */
	createCss() {
		var style = document.createElement('style');
		var str = `.align-center {
			text-align: center;
		}
		.clearfix {
			zoom: 1;
		}
		.clearfix:after {
			content: "";
			display: block;
			clear: both;
		}
		.calendar-wrap > .calendar-title  {
			height: 42px;
			line-height: 42px;
			color: #fff;
			background: #36CBFF;
			text-align: center;
			padding: 0 20px;
		}
		.calendar-wrap > .calendar-week {
			height: 30px;
			display: flex;
			line-height: 30px;
			background: #FAFAFA;
			font-size: 14px;
		}
		.calendar-wrap {
			margin-bottom: 10px;
		}
		.calendar-wrap > .calendar-week > span {
			flex: 1;
		}
		.calendar-wrap > .calendar-content span {
			float: left;
			width: 14.2%;
			min-height: 58px;
			background: #fff;
			padding: 2px 0;
		}
		.calendar-wrap .calendar-content .selected {
			background: #36CBFF;
			color: #fff;
		}
		.calendar-wrap .font-8 {
			font-size: 8px;
		}
		.calendar-wrap .font-28 {
			font-size: 28px;
		}
		.calendar-wrap .disable {
			color: #999;
		}
		`;
		style.innerHTML = str;
		document.head.appendChild(style);
	},
	/**
	 * 插入html
	 * @return {[type]} [description]
	 */
	creteHtml() {
		var htmlStr = '';
		for(var i = 0; i < this.monthList.length; i++) {

			htmlStr += `<div class="calendar-wrap">
								<p class="calendar-title">
									<span class="c-t-detial">${this.year}年${this.monthList[i]}</span>
								</p>
								<p class="calendar-week align-center">
									<span>一</span>
									<span>二</span>
									<span>三</span>
									<span>四</span>
									<span>五</span>
									<span>六</span>
									<span>日</span>
								</p>
								<div class="calendar-content clearfix align-center">
								</div>
						</div>`;
		}
		var htmlWrap = document.getElementById(this.wrap);
		htmlWrap.innerHTML = htmlStr;
	},
	/**
	 * 初始化dom操作
	 * @return {[type]} [description]
	 */
	initDom() {
		this.calendarWrap = document.querySelectorAll('.calendar-wrap');
		for(var i = 0; i < this.monthList.length; i++) {
			this.calendarWrap[i].querySelector('.calendar-content').innerHTML = this.createDay(this.year, this.monthList[i]);
		}
		// console.log(this.calendarWrap)
		this.bind();
	},
	bind() {
		document.addEventListener('click' , function(e) {
			var el = e.srcElement || e.target;
			if(this.searchElement(el, 'calendar-data')) {
				var target = this.searchElement(el, 'calendar-data');
				target.className += ' selected';
				this.emitDate(target);
			}
		}.bind(this))
	},
	/**
	 * 发出数据
	 * @return {[type]} [description]
	 */
	emitDate(el) {
		var date = el.getAttribute('calendar-date');
		if(this.callBack) {
			this.callBack({
				date: date
			});
		}
	},
	/**
	 * 创建日期列表
	 * @return {[type]} [description]
	 */
	createDay(year, month) {
		this.htmlStr = '';
		this.firsrtweekend = this.getFirsrtweekend(year, month);
		this.currentMonthLength = this.getMonthLength(year, month);
		this.createPreviousMonthDay(year, month, this.firsrtweekend);
		this.createCurrentMonthDay(year, month, this.currentMonthLength);
		this.createNextMonthDay(year, month, this.currentMonthLength, this.firsrtweekend);
		return this.htmlStr;
		// this.content.innerHTML = this.htmlStr;
	},
	/**
	 * 显示上一月的天数
	 * @return {[type]} [description]
	 */
	createPreviousMonthDay(year, month, firsrtweekend) {
		var previousMonthLength = this.getMonthLength(year, month - 1);
		for(var i = previousMonthLength - (firsrtweekend - 2); i <= previousMonthLength; i++) {
			this.htmlStr += '<span class="disable"></span>';
		}
	},
	/**
	 * 显示当前月的天数
	 * @return {[type]} [description]
	 */
	createCurrentMonthDay(year, month, currentMonthLength) {
		for(var i = 1; i <= currentMonthLength; i++) {
			var date = `${year}-${month}-${i}`,
				stamp = this.DateToTimestamp(date) + '000',
				htmlStr = '';
			if(this.hashDataList[stamp]) {
				htmlStr = `
							 <span class="calendar-data" 
							   calendar-date="${year}-${month}-${i}" 
							   >
							   		<p>${i}</p>
							   		<p class="font-8">¥${this.hashDataList[stamp]['freePrice']}</p>
							   		<p class="font-8">余${this.hashDataList[stamp]['freeStock']}</p>
							   </span> 
						  `;
			} else {
				htmlStr = `
							 <span class="disable" 
							   calendar-data="${year}-${month}-${i}" 
							   >${i}</span> 
						  `;
			}
			this.htmlStr += htmlStr;
		}
	},
	/**
	 * 日期时间换成Unix时间戳
	 * data  	时间戳    必填
	 * @param {[type]} data [description]
	 */
	DateToTimestamp: function(data) {
		return Date.parse(data) / 1000;
	},
	/**
	 * 显示下一个月的天数
	 * @return {[type]} [description]
	 */
	createNextMonthDay(year, month, currentMonthLength, firsrtweekend) {
		var nextMonthLength = this.getMonthLength(year, month + 1);
		for(var i = 1, len = 42 - (currentMonthLength + firsrtweekend - 1); i <= len; i++) {
			this.htmlStr += '<span class="disable"></span>'
		}
	},
	/**
	 * 搜索元素,解决事件委托颗粒度问题
	 * @param  {[type]} el     [description]
	 * @param  {[type]} classN [description]
	 * @return {[type]}        [description]
	 */
	searchElement: function(el, classN) {
		var target = el,
			count = 0;
		while(target) {
			count++;
			if(count > 5 || target.nodeName.toLowerCase() == 'html') {
				target = null;
				return target;
			} else if(target.className != null && target.className.indexOf(classN) > -1) {
				return target;
			}
			target = target.parentNode;
		}
	},
	//清除内存
	calendarDestroy() {

	}
}
