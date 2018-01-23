/*
     使用方法
     id:轮播容器的id;
     json: 各种配置参数json格式;
     var demo = Touches('swiper',{
     autoPlay:true,
     interval:4000
     });
 */


function Touches(id,config) {
    /**
     * 初始化配置
     * @type {Object}
     */
    this.set         = {
        autoPlay:config.autoPlay || false,     //是否开启轮播;
        speed:config.speed || 200,             //动画执行的时间;
        interval:config.interval   || 3000,    //下一张切换时间(毫秒);
        slider_dis:config.slider_dis || 50,    //滑动灵敏度;
        distance:config.distance || 'level',   //滑动的方向;
        loop:config.loop || false,             //是否开启无限轮播;
        pcSlider:config.pcSlider || false      //是否开启pc端点击切换
    };
    this.ContainerId =id;
    //DOM初始化
    this.Init();
    // 触摸事件
    this.touchEvent();
    //是否开启轮播
    this.autoPlay();
    // 是否开启pc端点击切换
    if(this.set.pcSlider) {
        this.pcSlider();
    };

}
Touches.prototype = {
    /**
     *
     * @constructor
     */
    Init    :function(){
        //总div容器元素
        this.container = document.getElementById(this.ContainerId);
        //图片容器元素
        this.swiperWrap = this.container.children[0];
        //li元素数组;
        this.swiperLi = this.swiperWrap.children;
        //li个数;
        this.count = this.swiperLi.length;
        //指示器容器元素
        this.pointerWrap = this.container.children[1];
        //创建指示器li;
        this.createPointerLi( this.count );
        //指示器元素li对象
        this.pointerLi = this.pointerWrap.children;
        // 索引
        this.index = 0;
        // this.resize()
        this.computeWidth('init');

    },

    /**
     * 计算容器的宽度
     * 
     */
    computeWidth:function (type) {
        //获取容器的宽度
        this.w = this.container.offsetWidth;
        if(type == 'init') {
            if( this.set.loop){
                //是否循环轮播
                this.loopIndex = this.count + 2
                this.createLi();
                this.translated(-this.w * (this.index + 1), this.index);
            } else {
                this.loopIndex=this.count;
                this.translated(-this.w * this.index,this.index);
            }
        } else {
           this.translated(-this.w * this.index,this.index); 
        }

        this.swiperWrap.style.width = this.w * this.loopIndex + 'px';

        // 配置每张图片宽度
        for(var i = 0; i < this.loopIndex; i++) {
            this.swiperLi[i].style.width=this.w+'px';
        };
    
    },

    /**
     * 创建图片li
     * 
     */
    createLi: function(){
        var oLi = document.createElement('li');
        oLi.innerHTML = this.swiperLi[0].innerHTML;
        this.swiperWrap.appendChild(oLi);
        
        var oLi = document.createElement('li');
        oLi.innerHTML = this.swiperLi[this.swiperLi.length-2].innerHTML;
        this.swiperWrap.insertBefore(oLi,this.swiperLi[0]);
    },

    /**
     * 创建指示器li;
     * @param  {number} count 图片的数量
     * 
     */
    createPointerLi: function( count ){
        var str = '';
        for(var i = 0 ;i < count; i++){
            str += '<li data-index="'+i+'"></li>';
        }
        //插入指示器li元素
        try {
            this.pointerWrap.innerHTML = str;
        } catch(e) {
            throw new Error('请加指示器ul元素');
        }
        
    },

    /**
     *容器运动函数
     * @param left
     * @param index
     */
    translated:function(left,index){
        this.swiperWrap.style.transform="translate3d("+left+"px,0,0)";
        this.showPointer(index);
    },
    /**
     *显示指示器
     * @param index
     */
    showPointer:function(index){
        for(var i=0,count=this.pointerLi.length;i<count;i++){
            this.pointerLi[i].className='';
        }
        this.pointerLi[index].className='active';
    },
    /**
     *触摸事件
     */
    touchEvent:function(){
        var _this=this,
            w=0;
        this.end={x:0};

        /**
         * 触摸开始
         * 
         */
        this.Tstart = function(e){
            var e = e || event;
            var touch = e.targetTouches[0];
            _this.start = {x:touch.pageX};
            w=getNum(_this.swiperWrap.style.transform)[1];
        }

        /**
         * 触摸移动
         * 
         */
        this.Tmove = function(e){
            var e = e || event,
                touch = e.targetTouches[0];
            e.preventDefault();
            _this.clearAutoPlay();
            _this.end = {x : (touch.pageX - _this.start.x) * 0.7};
            _this.swiperWrap.style.transitionDuration = 0 + "ms";
            _this.translated(-w + _this.end.x, _this.index);
        }

        /**
         * 触摸结束
         */
        this.Tend = function(){
            if(_this.end.x < -_this.set.slider_dis) {
                _this.index++;
            } else if(_this.end.x > _this.set.slider_dis) {
                _this.index--;
            };
            _this.end.x = 0;
            _this.finished();
            _this.autoPlay();
        }
        /**
         * 获取图片容器的偏移量
         * @param  {string} str 传入字符串
         * @return {number}     返回图片容器的偏移数值
         */
        function getNum(str){
            var re=/\d+/g;
            return str.match(re);
        }
        // 执行事件
        this.swiperWrap.addEventListener('touchstart',this.Tstart);
        this.swiperWrap.addEventListener('touchmove',this.Tmove);
        this.swiperWrap.addEventListener('touchend',this.Tend);
    },

    /**
     * 清除自动轮播计时器
     * 
     */
    clearAutoPlay:function(){
        if(this.timer) {
            clearInterval(this.timer);
        }
    },

    /**
     * 触摸结束执行的函数
     * 
     */
    finished: function() {
        this.swiperWrap.style.transitionDuration = this.set.speed + "ms";
        /**
         * 修改
         * @param  {[type]} this.set.loop [description]
         * @return {[type]}               [description]
         */
        if( this.set.loop ) {
            this.loop();
        } else {
            
            if(this.index < 0) {
                this.index = 0;
            } else if(this.index > this.count-1) {
                this.index = this.count-1;
            }
            this.translated( -this.index * this.w,this.index );
        }
        
    },

    /**
     * 无限循环轮播执行函数
     * @return {[type]} [description]
     */
    loop: function() {
        
        if(this.index >= this.count) {
            this.translated(-(this.index + 1) * this.w,0);
            this.index = 0;
            this.animateFinish();
        } else if(this.index < 0) {
            this.translated(0,this.count - 1);
            this.index = this.count - 1;
            this.animateFinish();
        } else {
            this.translated(-(this.index + 1) * this.w,this.index);
        }
        
    },
    /**
     * 动画执行完毕
     * 
     */
    animateFinish:function(){
        
        setTimeout(function(){
            this.swiperWrap.style.transitionDuration = 0 + "ms";
            this.translated( -this.w * (this.index + 1),this.index );
        }.bind(this),this.set.speed);
        
    },

    /**
     * 检查是否开启自动轮播
     * 
     */
    autoPlay:function(){
        if(this.set.autoPlay) {
            this.clearAutoPlay();
            this.timer = setInterval(function(){
                this.run(1);
            }.bind(this),this.set.interval)
        }
    },

    /**
     * 自动轮播函数
     * @param  {number } type -1或者1
     * 
     */
    run: function( type ){
        this.index = this.index + type;
        
        if(!this.set.loop) {
            this.index = this.index > this.count-1 ? 0 : this.index;
            this.index = this.index < 0 ? this.count-1 : this.index;
        }
        
        this.finished();
    },


    /**
     * 动态更新图片,
     * 动态添加图片的时候传入参数'add',
     * 动态删除的时候传入参数'del'
     * (不需要可以删除)
     */
    update: function ( type ) {
        if(this.set.loop) {
            var wrap = this.swiperWrap;
            var count = type == "add" ? this.count : this.count-1;
            wrap.removeChild(wrap.children[0]);
            wrap.removeChild(wrap.children[count]);        
        }
        this.Init();
    },


    /**
     * 宽度自适应(不需要可以删除):
     * 动态计算图片容器的宽度
     * @return {[type]} [description]
     */
    autoAdaption: function(){
        var _this = this;
        var adaption =function(){
            clearTimeout(_this.adaptionTimer);
            _this.adaptionTimer=setTimeout(function(){
                _this.computeWidth();
            },100)
        }
        window.addEventListener('resize',adaption);
    },
    
    /*-----------------------------------------(不需要可以删除)*/
    /**
     * 初始化幻灯片位置从0开始
     * @param  {number} index 幻灯片位置
     * 
     */
    sliderIndex: function ( index ) {
        var count = this.set.loop == true ? index + 1 : index;
        this.translated(-this.w * count,index);
        this.index = index;
    },
    /*初始化幻灯片位置从0开始-----------------------------------------(不需要可以删除)*/
    
    /*-----------------------------------------------------(不需要可以删除)*/
    /**
     * pc端点击切换,
     * 在容器相应的div添加swiper-next和swiper-prev两个类名，即可
     *
     * 
     */
    pcSlider: function() {
        var _this = this;
        
        function mouseEvent (e) {
            var e = e || window.event,
                el = e.srcElement || e.target,
                rightJudge = el.className.indexOf('swiper-next') > -1,
                leftJudge = el.className.indexOf('swiper-prev') > -1,
                Pointerjudge = el.parentNode.className.indexOf('swiper-circle') > -1;
            switch( e.type ) {
                case 'click': {
                    if(rightJudge) {
                        _this.run(1);
                    } else if(leftJudge) {
                        _this.run(-1);
                    }
                    
                    if(Pointerjudge) {
                        var index = parseInt(el.getAttribute('data-index'));
                        _this.swiperWrap.style.transitionDuration = _this.set.speed + "ms";
                        try {
                            _this.sliderIndex(index)
                        } catch(e) {
                            throw new Error('sliderIndex方法被删除了')
                        }
                    }
                }
                    break;
                
                case 'mouseover': {
                    if(leftJudge || rightJudge || Pointerjudge) {
                        _this.clearAutoPlay();
                    }
                }
                    break;
                
                case 'mouseout': {
                    if(leftJudge || rightJudge || Pointerjudge) {
                        _this.autoPlay();
                    }
                }
                    break;
            }
            
        }
        
        this.container.addEventListener('click',mouseEvent);
        this.container.addEventListener('mouseover',mouseEvent);
        this.container.addEventListener('mouseout',mouseEvent);
    }
    /*pc端点击切换-----------------------------------------------------(不需要可以删除)*/
}