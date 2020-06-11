function dateToTimestamp(data) {
  return Date.parse(data);
}
function pad(i) {
  if (i < 10) {
    i = "0" + i;
  }

  return i;
}
function TimestampToDate(format, timestamp) {
  if (!timestamp) {
    return timestamp;
  }

  // var date = timestamp ? new Date(parseInt(timestamp) * 1000) : new Date(+new Date());
  var date = new Date(parseInt(timestamp));
  var year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();

  var str = format.replace(/y+|m+|d+|h+|s+/gi, function (w) {
    if (w == "yy" || w == "YY" || w == "y" || w == "Y") {
      return year.toString().substring(2);
    } else if (w == "yyyy" || w == "YYYY") {
      return year;
    } else if (w == "MM") {
      return month >= 10 ? month : "0" + month;
    } else if (w == "M") {
      return month;
    } else if (w == "DD" || w == "dd") {
      return day >= 10 ? day : "0" + day;
    } else if (w == "D" || w == "d") {
      return day;
    } else if (w == "HH" || w == "hh") {
      return hour >= 10 ? hour : "0" + hour;
    } else if (w == "H" || w == "h") {
      return hour;
    } else if (w == "mm") {
      return minute >= 10 ? minute : "0" + minute;
    } else if (w == "m") {
      return minute;
    } else if (w == "ss" || w == "s") {
      return second >= 10 ? second : "0" + second;
    }
  });
  return str;
}
/**
 * 获取月份的天数
 * @param {*} year
 * @param {*} month
 */
function getMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * 获取某一月的第一天是星期几
 * @param  {[type]} year  年份
 * @param  {[type]} month 月份,如果是0 这表示上一年的12月
 * @return {[type]} 1表示周一, 7表示周日
 */
function getFirsrtweekend(year, month) {
  return new Date(year, month - 1, 0).getDay() + 1;
}

/**
 * 获取下一个月份是多少
 * @param {*} year
 * @param {*} month
 */
function getNextDate(year, month) {
  month++;
  if (month > 12) {
    month = 1;
    year++;
  }

  return {
    year,
    month,
  };
}

/**
 * 获取上一个月份是多少
 * @param {*} year
 * @param {*} month
 */
function getPreDate(year, month) {
  month--;
  if (month <= 0) {
    month = 12;
    year--;
  }

  return {
    year,
    month,
  };
}
function preDaysSolt(year, month) {
  var daysSolt = getFirsrtweekend(year, month);

  if (daysSolt === 7) {
    daysSolt = 0;
  }
  return daysSolt;
}

function getMonthCurDetail(year, month) {
  var monthDetail = [];
  var days = getMonthDays(year, month);

  for (var i = 1; i <= days; i++) {
    monthDetail.push({
      tips: "cur",
      text: i,
      timeStamp: dateToTimestamp(`${year}-${pad(month)}-${pad(i)}`),
    });
  }

  return monthDetail;
}

function getMonthPreDetail(year, month) {
  var monthDetail = [];

  var daysSolt = preDaysSolt(year, month);
  var preDate = getPreDate(year, month);
  var preMonthDays = getMonthDays(preDate.year, preDate.month);

  for (var i = preMonthDays - daysSolt + 1, len = preMonthDays; i <= len; i++) {
    monthDetail.push({
      text: i,
      tips: "pre",
      timeStamp: dateToTimestamp(
        `${preDate.year}-${pad(preDate.month)}-${pad(i)}`
      ),
    });
  }

  return monthDetail;
}
function getMonthNextDetail(year, month) {
  var monthDetail = [];

  var daysSolt = preDaysSolt(year, month);
  var days = getMonthDays(year, month);
  var nextDate = getNextDate(year, month);

  for (var i = 1, len = 42 - (daysSolt + days); i <= len; i++) {
    monthDetail.push({
      text: i,
      tips: "next",
      timeStamp: dateToTimestamp(
        `${nextDate.year}-${pad(nextDate.month)}-${pad(i)}`
      ),
    });
  }

  return monthDetail;
}
function Calender(config) {
  var { date, mixDate, maxDate } = config;

  // date = date.split("-");
  var dateObj = new Date(date);

  this.year = dateObj.getFullYear();
  this.month = dateObj.getMonth() + 1;
  this.mixDate = null;
  this.maxDate = null;
  this.selecting = false;

  if (mixDate) {
    var timeStamp = TimestampToDate("yyyy-MM-DD", dateToTimestamp(mixDate));
    this.mixDate = dateToTimestamp(timeStamp);
  }

  if (maxDate) {
    var timeStamp = TimestampToDate("yyyy-MM-DD", dateToTimestamp(maxDate));
    this.maxDate = dateToTimestamp(timeStamp);
  }

  this.rows = [];
}

Calender.prototype = {
  switchPreMonth() {
    var dateObj = getPreDate(this.year, this.month);
    this.year = dateObj.year;
    this.month = dateObj.month;

    return this.getList();
  },
  switchNextMonth() {
    var dateObj = getNextDate(this.year, this.month);
    this.year = dateObj.year;
    this.month = dateObj.month;
    return this.getList();
  },
  getList() {
    currentDayDetail = getMonthCurDetail(this.year, this.month);

    let mix = Math.min(this.mixDate, this.maxDate);
    let max = Math.max(this.mixDate, this.maxDate);
    this.mixDate = mix;
    this.maxDate = max;

    this.rows = this.markRange(this.mixDate, this.maxDate, currentDayDetail);
    this.rows.unshift(...getMonthPreDetail(this.year, this.month));
    this.rows.push(...getMonthNextDetail(this.year, this.month));

    return this.rows;
  },
  getValue() {
    return [this.mixDate, this.maxDate];
  },
  handlerClick(mixDate) {
    if (this.selecting) {
      this.selecting = false;
      this.maxDate = mixDate;
    } else {
      this.selecting = true;
      this.mixDate = mixDate;
      this.maxDate = null;
    }

    let mix = Math.min(this.mixDate, this.maxDate);
    let max = Math.max(this.mixDate, this.maxDate);

    return this.markRange(mix, max, this.rows);
    // return this.rows;
  },
  handlerMouseMove(maxDate) {
    // var mixDate = this.mixDate;
    this.maxDate = maxDate;
    let mix = Math.min(this.mixDate, this.maxDate);
    let max = Math.max(this.mixDate, this.maxDate);

    return this.markRange(mix, max, this.rows);
    // return this.rows;
  },
  handlerClickRange(mixDate, maxDate) {
    if (this.mixDate === mixDate && this.maxDate === maxDate) {
      return this.rows;
    }

    this.mixDate = mixDate;
    this.maxDate = maxDate;
    return this.markRange(mixDate, maxDate, this.rows);
  },
  markRange(mixDate, maxDate, rows) {
    // [mixDate, maxDate] = [
    //   Math.mix(mixDate, maxDate),
    //   Math.max(mixDate, maxDate),
    // ];

    for (let item of rows) {
      var time = item.timeStamp;
      item.inRange = mixDate && time >= mixDate && time <= maxDate;
      item.start = mixDate && time === mixDate;
      item.end = maxDate && time === maxDate;
    }

    return rows;
  },
};
