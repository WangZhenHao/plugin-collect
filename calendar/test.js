/**
 * 日期选择插件
 * 
 * author    wzh
 * created   2018-7-24
 */


function Calender() {
	
}

Calender.prototype = {
	/**
	 * 初始化操作
	 * @return {[type]} [description]
	 */
	init: function(parmas = {}) {
		this.config(parmas);
		this._createCss();
		this._creteHtml();
		this._initDom();
		// this.createDay();
	},
	/**
	 * 设置配置
	 * @return {[type]} [description]
	 */
	config: function(parmas) {
		var date = new Date();
		this._currentYear = date.getFullYear();
		this._currentMonth = date.getMonth() + 1;
		this._currentDay = date.getDate();
		this.parmas = parmas;
		this.year = parmas.year || this._currentYear
		this.month = parmas.month || this._currentMonth
		this.calenderId = parmas.id;
		// this.callBack = parmas.confirm;

		this.weekDesc = ['一', '二', '三', '四', '五', '六', '日'];
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
	_createCss() {
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
		.calendar-wrap * {
			box-sizing: border-box;
		}
		.calendar-wrap > .calendar-title  {
			display: flex;
			height: 42px;
			line-height: 42px;
			align-items: center;
			justify-content: space-between;
			padding: 0 20px;
		}
		.calendar-wrap > .calendar-title .switch-btn {
			font-size: 14px;
			border: 1px solid #d0cfcf;
			padding: 5px 16px;
			cursor: pointer;
		}
		.calendar-wrap > .calendar-week {
			height: 30px;
			display: flex;
			line-height: 30px;
			background: #FAFAFA;
			font-size: 14px;
		}
		.calendar-wrap > .calendar-week > span {
			flex: 1;
		}
		.calendar-wrap > .calendar-content {
			border-left: 1px solid #d0cfcf;
		}
		.calendar-wrap > .calendar-content > span {
			float: left;
			width: 14.2%;
			min-height: 40px;
			line-height: 40px;
			border-right: 1px solid #d0cfcf;
			border-bottom: 1px solid #d0cfcf;
		}
		.calendar-wrap .data-off {
			background: #fff0f0;
			position: relative;
			color: red;
		}
		.calendar-wrap .current-data {
			background: #FF6E15;
			color: #fff;
		}
		.calendar-wrap .data-off:after {
			content: "休";
			position: absolute;
			left: 5px;
			top: 5px;
			font-size: 12px;
			line-height: normal;
		}
		.font-28 {
			font-size: 28px;
		}
		.disable {
			color: #999;
		}`;
		style.innerHTML = str;
		document.head.appendChild(style);
	},
	/**
	 * 插入html
	 * @return {[type]} [description]
	 */
	_creteHtml() {
		
		var	html = `
							<div class="calendar-title">
								<span class="c-t-detial"></span>
								<div>
									<span class="switch-btn switch-previous">上个月</span>
									<span class="switch-btn">今天</span>
									<span class="switch-btn switch-next">下个月</span>
								</div>
							</div>
							<p class="calendar-week align-center">
							</p>
							<div class="calendar-content clearfix align-center">
							</div>
						`;
			// html = `
			// 				<p class="calendar-title">
			// 					<span class="iconfont icon-zuojiantou font-28"></span>
			// 					<span class="c-t-detial"></span>
			// 					<span class="iconfont icon-youjiantou font-28"></span>
			// 				</p>
			// 				<p class="calendar-week align-center">
			// 				</p>
			// 				<div class="calendar-content clearfix align-center">
			// 				</div>
			// 			`;
			this.calendarWrap = document.querySelector('#' + this.calenderId);
		    this.calendarWrap.className = 'calendar-wrap';
		    this.calendarWrap.innerHTML = html;
		// document.body.appendChild(div);
	},
	/**
	 * 初始化dom操作
	 * @return {[type]} [description]
	 */
	_initDom() {
		this.content = document.querySelector('#' + this.calenderId + ' > .calendar-content'); 
		this.title = document.querySelector('#' + this.calenderId + ' > .calendar-title > .c-t-detial');
		this.weekendWrap = document.querySelector('#' + this.calenderId + ' > .calendar-week');
		this.bind();

		var str = '';
		for(var i = 0; i < 7; i++) {
			str += '<span>' + this.weekDesc[i] + '</span>';
		}
		this.weekendWrap.innerHTML = str;
	},
	bind() {
		this.calendarWrap.addEventListener('click' , function(e) {
			var el = e.srcElement || e.target;
			console.log(el);
			if(el.className.indexOf('switch-previous') > -1) {
				this.previousMonth();
			} 
			else if(el.className.indexOf('switch-next') > -1) {
				this.nextMonth();
			} 
			else if(el.className.indexOf('calendar-data') > -1) {
				this.emitDate(el);
			}
		}.bind(this))
	},
	/**
	 * 点击下一个月
	 * @return {[type]} [description]
	 */
	previousMonth() {
		this.month--;
		if(this.month <= 0) {
			this.month = 12;
			this.year--;
		}
		if(typeof this.switchMonth == 'function') {
			this.switchMonth.call(this, this.year, this.month)
		}
	},
	/**
	 * 发出数据
	 * @return {[type]} [description]
	 */
	emitDate(el) {
		var year = this.year,
			month = this.month,
			day = el.getAttribute('calendar-date');
		if(this.callBack && day) {
			this.callBack({
				year: year,
				month: month,
				day: day
			});
		}
	},
	/**
	 * 点击下一个月
	 * @return {[type]} [description]
	 */
	nextMonth() {
		this.month++;
		if(this.month >= 13) {
			this.month = 1;
			this.year++;
		}
		if(typeof this.switchMonth == 'function') {
			this.switchMonth.call(this, this.year, this.month)
		}
		// this.createDay();
	},
	/**
	 * 创建日期列表
	 * @return {[type]} [description]
	 */
	createDay() {
		this.title.innerHTML = this.year + '年' + this.month + '月';
		this.weekend = this.getFirsrtweekend(this.year, this.month);
		this.currentMonthLength = this.getMonthLength(this.year, this.month);
		this.htmlStr = '';
		this.createPreviousMonthDay();
		this.createCurrentMonthDay();
		this.createNextMonthDay();
		
		this.content.innerHTML = this.htmlStr;
	},
	/**
	 * 显示上一月的天数
	 * @return {[type]} [description]
	 */
	createPreviousMonthDay() {
		var previousMonthLength = this.getMonthLength(this.year, this.month - 1);
		for(var i = previousMonthLength - (this.weekend - 2); i <= previousMonthLength; i++) {
			this.htmlStr += '<span class="calendar-data disable">' + i + '</span>';
		}
	},
	/**
	 * 显示当前月的天数
	 * @return {[type]} [description]
	 */
	// createCurrentMonthDay() {
	// 	var dataDetail = this.parmas.rule[this._getCurrentDay(this.year) + this._getCurrentDay(this.month)];
	// 	for(var i = 1; i <= this.currentMonthLength; i++) {
	// 		if(dataDetail[this._getCurrentDay(i)]) {
	// 		  this.htmlStr += '<span class="calendar-data data-off">' + i + '</span>'
	// 		} else {
	// 		   this.htmlStr += '<span class="calendar-data" calendar-date="' + i + '">' + i + '</span>'
	// 		}
	// 	}
	// },
    _getCurrentDay(value) {
		return value > 10 ? value : '0' + value
	},
	/**
	 * 显示下一个月的天数
	 * @return {[type]} [description]
	 */
	createNextMonthDay() {
		var nextMonthLength = this.getMonthLength(this.year, this.month + 1);
		for(var i = 1, len = 42 - (this.currentMonthLength + this.weekend - 1); i <= len; i++) {
			this.htmlStr += '<span class="calendar-data disable">' + i + '</span>'
		}
	},
}

// var calenderObj = new Calender();

// export default calenderObj;