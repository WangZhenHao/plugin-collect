# 把自己写的插件汇总在一起
#### 不断的去优化和添加插件 有问题可以反馈  qq群: 475870039

## FileTree 目录结构
```
├── Lottery                     //抽奖插件
├── AreaInertailScroll          // 移动端城市联动
├── virtualKeyBoard             //虚拟键盘支付插件
├── class-carousel              // class控制的轮播  
├── mobile-touch-slider         // 移动端轮播
├── ScrollClassAnimate          // 下拉,上拉加载动画
├── imitate-jq-animate          // 仿jquery动画函数
├── images					            // 图片
├── calender                    //日历插件
├── ajax                        //原生ajax封装
├── InputNum                    //数字输入框
├── BScroll                     //better-scroll 滚动核心原理
```



### 抽奖插件
>目录:Lottery
```
  使用方法:
   var lottery = new Lottery({
      //抽奖容器样式
      wrap: {
        height: '360px',
        width: '360px',
        background: '#ffbf08'
      },
      //旋转动画特效
      animate: {
        transitionDuration: '6s',
        transitionTimingFunction: 'ease-in-out'
      },
      //奖项
      lotteryItem: [
        {
          desc: '一等奖',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544096608859&di=f3baca7b9e494912d7a754e8f55fb49c&imgtype=0&src=http%3A%2F%2Fpic28.photophoto.cn%2F20130728%2F0020033020430867_b.jpg'
        },
        {
          desc: '二等奖',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544096608859&di=f3baca7b9e494912d7a754e8f55fb49c&imgtype=0&src=http%3A%2F%2Fpic28.photophoto.cn%2F20130728%2F0020033020430867_b.jpg'
        },
        {
          desc: '三等奖',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544096608859&di=f3baca7b9e494912d7a754e8f55fb49c&imgtype=0&src=http%3A%2F%2Fpic28.photophoto.cn%2F20130728%2F0020033020430867_b.jpg'
        },
        {
          desc: '四等奖',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544096608859&di=f3baca7b9e494912d7a754e8f55fb49c&imgtype=0&src=http%3A%2F%2Fpic28.photophoto.cn%2F20130728%2F0020033020430867_b.jpg'
        },
        {
          desc: '五等奖',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544096608859&di=f3baca7b9e494912d7a754e8f55fb49c&imgtype=0&src=http%3A%2F%2Fpic28.photophoto.cn%2F20130728%2F0020033020430867_b.jpg'
        },
        {
          desc: '六等奖',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544096608859&di=f3baca7b9e494912d7a754e8f55fb49c&imgtype=0&src=http%3A%2F%2Fpic28.photophoto.cn%2F20130728%2F0020033020430867_b.jpg'
        },
      ],
      ///抽奖旋转完成之后的回调
      success: function(res) {
        document.querySelector('#result').innerHTML = `恭喜你,抽中${res.desc}`;
        
      }
    });

    //点击抽奖,可以这一步可以请求后台接口,得出抽奖结果
    lottery.arrow.onclick = function() {
      lottery.destroy();
      //加入抽中了六等奖
      var lotter = '六等奖';

      setTimeout(() => {
        lotteryHanlde(lotter);
      }, 10)
      

    }
```
[演示地址: https://wangzhenhao.github.io/plugin-collect/Lottery/demo.html](https://wangzhenhao.github.io/plugin-collect/Lottery/demo.html)  

![AreaInertailScroll](https://github.com/WangZhenHao/plugin-collect/blob/master/images/Lottery/Lottery.gif)



### 移动端城市联动
>目录:AreaInertailScroll(地区惯性滚动)
```
  使用方法:
   var selecter = new InertiaScroll();
   selecter.init({
		target: 'scrollTarget',     //data-inertia="scrollTarget"召唤插件的属性值
		data: LAreaData,			      //传入的数据
		callback: function(res) {   //点击确认按钮后的回调函数
			console.log(this);
			this.target.value = res.join(',');
		}
	}); 
```
[演示地址: https://wangzhenhao.github.io/plugin-collect/AreaInertiaScroll/demo.html](https://wangzhenhao.github.io/plugin-collect/AreaInertiaScroll/demo.html)  

![AreaInertailScroll](https://github.com/WangZhenHao/plugin-collect/blob/master/images/AreaInertiaScroll/AreaInertiaScroll.gif)



### 虚拟键盘支付插件
>目录:virtualKeyBoard(虚拟键盘支付插件)
>>网上对于虚拟键盘支付的插件好像不是很多,都是基于vue, react, angular,挺少是基于原生js的,
于是乎这个插件就出来了,可以配合其他框架一起使用
```
   //class="key-board-cursor" 获取焦点闪烁的class类
   //data-key-board="target"  触发虚拟键盘显示和隐藏的元素
  
   <div class="key-board-cursor" data-key-board="target" id="keyBoard">
   </div>
    
    //javascript
    var keyBoard = new KeyBoard({
    target: 'target',
    //点击虚拟键盘返回的数字
    callBack: function(res, status) {
      this.target.innerHTML = res.value;
    },
    //点击确认
    comfirm: function(res) {
      console.log(res);
    }
  });

```
[演示地址: https://wangzhenhao.github.io/plugin-collect/AreaInertiaScroll/demo.html](https://wangzhenhao.github.io/plugin-collect/virtualKeyBoard/demo.html) 
![AreaInertailScroll](https://github.com/WangZhenHao/plugin-collect/blob/master/images/virtualKeyBoard/virtualKeyBoard.gif)

### class控制的轮播

>目录:class-carousel(class类轮播)
>>在class类中设置宽度100%,可以很简单的实现响应式的轮播,boostrap就是使用这种方法
```
  调用方式：
    //wrap:轮播容器元素对象;
	//json:配置参数
  var wrap=document.getElementById('wrap')
  var swiper=new Swiper(wrap,{
                autoPlay:'true',
                pcSlider:'true'
                ,interval:5000
   });

```

### 移动端轮播
>目录: mobile-touch-slider(移动端轮播)
```
     使用方法
     id:轮播容器的id;
     json: 各种配置参数json格式;
     var demo = new Touches('swiper',{
       //是否开启轮播;
         autoPlay:true,
         //下一张切换时间(毫秒)
         interval:4000,
         //动画执行的时间;
         speed: 200,
         //滑动灵敏度;
         slider_dis: 50,
         //是否开启无限轮播;
         loop: fasle,
         //是否开启pc端点击切换
         pcSlider: false
     });


```
[演示地址: https://wangzhenhao.github.io/plugin-collect/mobile-touch-slider/demo.html](https://wangzhenhao.github.io/plugin-collect/mobile-touch-slider/demo.html)

### 下拉,上拉加载动画
>目录: ScrollClassAnimate(滚动加载动画)
>>需要结合animate.css库,结合自己写的动画库亦可;
```
使用方法
 	//html部分
 	<div class="boy-animate" boy-animate-duration="2s" boy-animate-effect="bounce" 
 	boy-animate-delay="0s">
 	</div>
 	boy-animate-duration:表示动画执行的时间(秒);
 	boy-animate-effect:表示动画效果的class类
 	boy-animate-delay:动画延迟执行的时间(秒)

 	//js部分
    var animated = new boyAnimate({
  		class: 'boy-animate', //需要设置动画的类
  		animate: 'animate'	  //执行动画的class
	});
```
[演示地址: https://wangzhenhao.github.io/plugin-collect/ScrollClassAnimate/demo.html](https://wangzhenhao.github.io/plugin-collect/ScrollClassAnimate/demo.html)

### 仿jquery动画函数
>目录: imitate-jq-animate(仿jquery动画)
```
	//使用规则:传入一个对象或一个ID，不可以传入一个数组对象;

	$('#div1').animation({'left': '100px'}, 2000, function() {
		//执行的内容
	})
```

[演示地址: https://wangzhenhao.github.io/plugin-collect/imitate-jq-animate/demo.html](https://wangzhenhao.github.io/plugin-collect/imitate-jq-animate/demo.html)

