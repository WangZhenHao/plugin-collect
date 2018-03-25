# 把自己写的插件汇总在一起
## FileTree 目录结构
```
├── AreaInertailScroll          // 移动端城市联动
├── class-carousel              // class控制的轮播  
├── mobile-touch-slider         // 移动端轮播
├── ScrollClassAnimate          // 下拉,上拉加载动画
├── imitate-jq-animate          // 仿jquery动画函数
├── images					    // 图片

```
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
[演示地址: http://www.wzhshare.top/plugin-collect/AreaInertiaScroll/demo.html](http://www.wzhshare.top/plugin-collect/AreaInertiaScroll/demo.html)  

![AreaInertailScroll](https://github.com/WangZhenHao/plugin-collect/blob/master/images/AreaInertiaScroll/AreaInertiaScroll.gif)

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

### 仿jquery动画函数
>目录: imitate-jq-animate(仿jquery动画)
```
	//使用规则:传入一个对象或一个ID，不可以传入一个数组对象;

	$('#div1').animation({'left': '100px'}, 2000, function() {
		//执行的内容
	})
```
#### 不断的去优化和添加插件 有问题可以反馈: 1471047476@qq.com
