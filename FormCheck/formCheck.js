/**
 * author   wzh
 * creata   2019-3-21
 *
 * 表单校验
 *
 * 
 * 使用方法
 *
 *
 * 
 * 

  function toCheck() {
    1: 新建一个实例
    var validator = new Validator();

	//自定义校验规则
    validator.addRuleType('test', function(val, msg) {
      if(val[2] == '请选择') {
        return msg;
      }
    })

    2: 添加校验规则
    validator.add(phone, [
      { rule: 'isMobile', errorMsg: '请输入正确手机号!' }
    ])

    validator.add(username, [
      { rule: 'isNoEmpty', errorMsg: '不能为空' }
    ])

	validator.add(minLength, [
      { rule: 'minLength:6', errorMsg: '不能少于6位' }
    ])
	
	3:开始校验,如果校验通过返回undefined, 否则返回错误信息
    return validator.start();
  }

  var msg = toCheck();

  if(msg) {
	  Tools.showTips(msg);
	  return;
  }


 */


/**
 * 校验的类
 */
function Validator() {
	this.cache = [];
	this.ruleType = {
		isNoEmpty: function(value, errorMsg) {
			if(!value) {
				return errorMsg;
			}
		},
		minLength: function(value, length, errorMsg) {
			if(value.length < length) {
				return errorMsg
			}
		},
		maxLength: function(value, length, errorMsg) {
			if(value.length > length) {
				return errorMsg
			}
		},
		isMobile: function(value, errorMsg) {
			var re = /^1[34578][0-9]{9}$/;
			if(!re.test(value)) {
				return errorMsg;
			}
		}

	}
}

/**
 * 添加校验规则
 * @param {[type]}   rule [description]
 * @param {Function} fn   [description]
 */
Validator.prototype.addRuleType = function(rule, fn) {
	this.ruleType[rule] = fn;
}
/**
 * 添加校验
 * @param {[type]} value 值
 * @param {[type]} rules 规则
 */
Validator.prototype.add = function(value, rules) {
	var self = this;

	for(var i = 0, item; item = rules[i++];) {
		(function(item) {
			var strategyAry = item['rule'].split(':'),
			    errorMsg = item['errorMsg'];

			self.cache.push(function() {
				var ruleFn = strategyAry.shift();
				strategyAry.unshift(value);
				strategyAry.push(errorMsg);
				return self.ruleType[ruleFn].apply(null, strategyAry)
			})
		})(item)
	}

}

/**
 * 开始校验
 * 如果校验通过返回undefined, 否则返回错误信息
 * @return {[type]} [description]
 */
Validator.prototype.start = function() {
	for(var i = 0, ruleTypeFn; ruleTypeFn = this.cache[i++];) {
		var errorMsg = ruleTypeFn();
		if(errorMsg) {
			this.cache = [];
			return errorMsg;
		}
	}
}

