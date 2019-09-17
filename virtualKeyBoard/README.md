### 虚拟键盘2.0.0  特性


##### 实例代码
```

var keyBoardEl = document.querySelector('.class2');

var keyBoard = new KeyBoard({
    decimals: 2,
    value: '23.00',
    keyBoardStatus: false,
    onInput: function(value, res) {
      keyBoardEl.innerHTML = value;
    },
    onComfirm: function(res) {
      console.log(res);
    },
    onFoucs(value, res) {
      console.log(value, res, '获取焦点')
    },
    onBlur(value, res) {
      console.log(value, res, '失去焦点')
    },
    onFinish(res) {
      keyBoardEl.innerHTML = this.value;
    }
  });

```

##### 参数说明
``` 
digit            保留多少位整数          number: 默认保留5位 
decimlas         保留多少位小数          number: 默认保留2位（设置0则不保存小数）
value            初始划的值             string: 默认''(可以通过setValue()方法设置)  
keyBoardStatus   是否唤起虚拟键盘        Boolen: 默认false
targetElement    获取焦点的元素          htmlElement: keyBoardStatus为true时，必须设置
targetAttr       获取焦点目标元素标识     string: 默认'key-board-element'
onFocus          获取焦点函数回调        function: 返回value, res
onBlur           失去焦点函数回调        function: 返回value, res
onInput          输入函数回调           function: 返回value, res
onComfirm        点击确认回调           function: 返回value, res
onFinish         设置value的值回调      function: 返回value, res

```

##### 方法
```
setKeyBoardValue      参数 number|string      设置输入框的值        设置成功之后会调用onFinish回调
keyBoardEventDestroy                         清除事件
keyBoardFocus                                获取焦点
keyBoardBlur                                 失去焦点         

内部方法(不建议调用)
_touchDel                                    点击删除
_touchComfirm                                点击确认
_touchKeyCode         参数 number|string     点击数字

```
