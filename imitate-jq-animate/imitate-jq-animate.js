/**
 * 使用规则:传入一个对象或一个ID，不可以传入一个数组对象;
 * $('#div1').animation({'left':'100px'},2000,function() {callback();})
 * 
 */
function $(obj) {
        return new Move(obj);
};

/**
 * 初始化
 * @param {[type]} obj [description]
 */
function Move(obj) {
               if(typeof obj == 'object') {
               	  this.obj = obj;
               } else {
                  var obj = obj.substring(1);
               	  this.obj = document.getElementById(obj);
               }
        };
        /**
         * 获取css样式;
         */
        function getCssStyle(obj,name) {
             if(obj.currentStyle) {
               return obj.currentStyle[name];
             } else {
              return getComputedStyle(obj,false)[name];
             }
        };

        /**
         * 动画函数;
         */
        Move.prototype.animation = function(json, time, callback) {
           var obj = this.obj;
        	 var allStyle = null;
          //关闭计时器;
          clearTimeout(obj.timer);
          //回调函数;
          var fn = callback || arguments[1];

          /**
           * 执行动画函数;
           */
          function run() {

            //time是否有参数;
            time = (typeof time == 'number') ? time : 800;
            console.log(time)
            //循环执行所有的参数：
             for(var arr in json) {
              //判断设置透明度
               if(arr == 'opacity') {
                 //获取透明度小数乘与100
                 var target = parseFloat(json[arr]) * 100;
                 //获取透明度css的值乘与100；
                 var value = parseFloat(getCssStyle(obj,arr) * 100);
               } else{
                //获取除透明度外其他参数的值；
                 var target = parseInt(json[arr]);
                 //获取除透明度外css参数的值
                 var value = parseInt(getCssStyle(obj,arr));

               }
              
                //动画的速度；
                var speed = (target - value) / (time / 100);
                //速度如果为正数向上取整；如果为负数，向下取整；
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                //判断是否有透明度并设置行间样式;
                if(arr == 'opacity') {
                   obj.style[arr] = (value + speed) / 100;
                   //兼容低版本的ie的透明度;
                   obj.style.filter = 'alpha(oapcity=' + (value + speed) + ')';
                } else {
                  //累加其他参数
                  obj.style[arr] = value + speed + 'px';
                }                    
             }
                //检测所有的参数是否都已经达到目标值，所有完成返回true；否则返回false,并跳出循环：
                for(var arr in json) {
                  if(json[arr] == obj.style[arr]) {
                    allStyle = true;
                  } else {
                    allStyle = false;
                    break;
                  }
                }
            //如果完成所有参数的计算关闭计时器和执行回调函数;
             if(allStyle) {
                   clearTimeout(obj.timer);
                   //判断是否为函数;
                   if(typeof fn == 'function') {
                      fn();
                   }
                } else {
                  //执行计时器;
                  obj.timer = setTimeout(run,20);
                }  
            
               
          };
          //调用递归函数：
          run();
             
        };
       