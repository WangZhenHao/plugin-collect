# 把自己写的插件汇总在一起

##移动端城市联动
>AreaInertailScroll(地区惯性滚动)
```
  使用方法:
   var selecter = new InertiaScroll();
   selecter.init({
		target: '.scrollTarget',    //召唤插件的class类
		data: LAreaData,			//传入的数据
		callback: function(res) {   //点击确认按钮后的回调函数
			console.log(this);
			this.target.value = res.join(',');
		}
	}) 
```

