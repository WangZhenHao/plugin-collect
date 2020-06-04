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
function Calender(config) {}

Calender.prototype = {
  getList(config) {
    var { date, range } = config;

    var date = date.split("-");
    var year = date[0],
      month = date[1];

    var currentDayDetail = this.getMonthDetail(year, month);

    if (range && range.length) {
      var mix = Number(range[0].split("-")[2]);
      var max = range[1] ? Number(range[1].split("-")[2]) : null;

      for (let item of currentDayDetail) {
        if (item.day === mix) {
          item.actived = "selected";
        }

        if (max) {
          if (item.day > mix && item.day < max) {
            item.actived = "actived";
          } else if (item.day === max) {
            item.actived = "selected";
          }
        }
      }
    }

    currentDayDetail.unshift(...this.getMonthPreDetail(year, month));
    currentDayDetail.push(...this.getMonthNextDetail(year, month));

    return currentDayDetail;
  },
  preDaysSolt(year, month) {
    var preDaysSolt = getFirsrtweekend(year, month);

    if (preDaysSolt === 7) {
      preDaysSolt = 0;
    }
    return preDaysSolt;
  },
  /**
   * 显示该月的所有数据
   * 包含上一个月的和下一个月的数据
   * @param {*} year
   * @param {*} month
   */
  getMonthDetail(year, month) {
    var monthDetail = [];
    var days = getMonthDays(year, month);

    for (var i = 1; i <= days; i++) {
      monthDetail.push({
        year,
        month,
        day: i,
        tips: "cur",
      });
    }

    return monthDetail;
  },
  getMonthPreDetail(year, month) {
    var monthDetail = [];

    var preDaysSolt = this.preDaysSolt(year, month);
    var preDate = getPreDate(year, month);
    var preMonthDays = getMonthDays(preDate.year, preDate.month);

    for (
      var i = preMonthDays - preDaysSolt + 1, len = preMonthDays;
      i <= len;
      i++
    ) {
      monthDetail.push({
        year: preDate.year,
        month: preDate.month,
        day: i,
        tips: "pre",
        disable: true,
      });
    }

    return monthDetail;
  },
  getMonthNextDetail(year, month) {
    var monthDetail = [];

    var preDaysSolt = this.preDaysSolt(year, month);
    var days = getMonthDays(year, month);
    var nextDate = getNextDate(year, month);

    for (var i = 1, len = 42 - (preDaysSolt + days); i <= len; i++) {
      monthDetail.push({
        year: nextDate.year,
        month: nextDate.month,
        day: i,
        tips: "next",
        disable: true,
      });
    }

    return monthDetail;
  },
};
