/**
 * 使用方法
 	html部分
 	<div class="boy-animate" 
 	boy-animate-duration="2s" 
 	boy-animate-effect="bounce" 
 	boy-animate-delay="0s">
 	</div>
 	boy-animate-duration:表示动画执行的时间(秒);
 	boy-animate-effect:表示动画效果的class类
 	boy-animate-delay:动画延迟执行的时间(秒)

 	js部分
 * animated = new boyAnimate({
 * 		class: 'boy-animate', //需要设置动画的类
 * 		animate: 'animate'	  //执行动画的class
 * })
 */
/**
 * @params  配置
 * 
 */
function boyAnimate(params) {
	this.className = params.class || 'boy-animate';
	this.animateClass = params.animate || 'animate';
	this.arrElment = document.getElementsByClassName(this.className);    
	this.mouseScroll();
	this.scrollEvent();
}

boyAnimate.prototype = {
	/**
	 * 执行滚动条滚动事件
	 * @return {[type]} [description]
	 */
	mouseScroll: function() {
		window.addEventListener('scroll', function() {
			this.scrollEvent();
		}.bind(this));
	},
	/**
	 * 处理滚动条滚动函数
	 * @return {[type]} [description]
	 */
	scrollEvent: function() {
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var clientH = document.documentElement.clientHeight || document.body.clientHeight;
		for(var i = 0, len = this.arrElment.length; i < len; i++) {
			var dist = this.arrElment[i].offsetTop
			if(scrollTop <= dist && dist <= scrollTop + clientH) {
				this.toAnimate(i);
			} else if(scrollTop > (dist + this.arrElment[i].offsetHeight) || dist > scrollTop + clientH){
				this.removeAniamte(i);
			}
		}
	},
	/**
	 * 移除动画函数
	 * @params index 索引值
	 * @return {[type]} [description]
	 */
	removeAniamte: function(index) {
		var el = this.arrElment[index],
			cls = el.className,
			attribute = this.getAttribute(el, 'boy-animate-effect');
		if(cls.indexOf(attribute) > -1) {
			el.className = cls.replace(' animate ' + attribute, '');
			el.style.animationDuration = '';
			el.style.animationDelay = '';
		}
	},
	/**
	 * 添加各种动画的属性
	 * @param  {[type]} index 索引值
	 * @return {[type]}       [description]
	 */
	toAnimate: function(index) {
		var el = this.arrElment[index];
		if(el.style.animationDuration) {
			return;
		}
		el.className += ' animate ' + this.getAttribute(el, 'boy-animate-effect');
		el.style.animationDuration = this.getAttribute(el, 'boy-animate-duration');
		el.style.animationDelay = this.getAttribute(el, 'boy-animate-delay');
	},
	/**
	 * 获取节点的属性
	 * @param  {[type]} element 元素对象
	 * @param  {[type]} attr    属性名称
	 * @return {[type]}         [description]
	 */
	getAttribute: function(element,attr) {
		if(element.getAttribute(attr) && typeof element.getAttribute(attr) == 'string') {
			return element.getAttribute(attr);
		} else {
			return '';
		}
	}
}

