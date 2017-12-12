/**
 * Created by yijinc on 2017/12/11
 */


const $ = {

    startMove : function(obj,json,fn){
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            var bBtn = true;
            for(var attr in json){
                var iSpeed = 0, iCur = 0;
                if(attr == 'opacity'){
                    iCur = Math.round($.getStyle(obj,attr)*100);
                    iSpeed = (json[attr] - iCur)/5;
                }
                else{
                    iCur = parseInt($.getStyle(obj,attr));
                    iSpeed = (json[attr] - iCur)/5;
                }

                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                if(iCur != json[attr]){
                    bBtn = false;
                }

                if(attr == 'opacity'){
                    obj.style.filter = 'alpha(opacity='+(iCur+iSpeed)+')';
                    obj.style.opacity = (iCur + iSpeed)/100;
                }
                else{
                    obj.style[attr] = iCur + iSpeed + 'px';
                }
            }

            if(bBtn){
                clearInterval(obj.timer);
                fn && fn.call(obj);
            }
        }, 30);
    },

    getStyle : function(obj,attr){
        return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,250)[attr];
    },

    drap : function(obj){
        var posX = 0;
        var posY = 0;
        obj.onmousedown = function(ev){
            var ev = ev || window.event;
            posX = ev.clientX - obj.offsetLeft;
            posY = ev.clientY - obj.offsetTop;

            document.onmousemove = function(ev){
                var ev = ev || window.event;
                obj.style.left = getLeft(ev.clientX - posX) + "px";
                obj.style.top =  getTop(ev.clientY - posY) + "px";
            }

            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
            }
            return false;
        }

        // 绑定touchstart事件
        obj.addEventListener("touchstart", function(e) {
            var touches = e.touches[0];
            posX = touches.clientX - obj.offsetLeft;
            posY = touches.clientY - obj.offsetTop;
            //阻止页面的滑动默认事件
            document.addEventListener("touchmove",function (e) {
                e.preventDefault()
            });

            obj.addEventListener("touchmove", function(e) {
                var touches = e.touches[0];
                obj.style.left = getLeft(touches.clientX - posX) + "px";
                obj.style.top = getTop(touches.clientY - posY) + "px";

                obj.addEventListener("touchend",function() {
                    document.removeEventListener("touchmove",function (e) {
                        e.preventDefault()
                    });
                });
            });
        });

        function getTop(iCur){
            if(iCur<0)
                iCur = 0
            if(iCur>document.documentElement.clientHeight - obj.offsetHeight)
                iCur = document.documentElement.clientHeight - obj.offsetHeight;
            return iCur
        }
        function getLeft(iCur){
            if(iCur<0)
                iCur = 0
            if(iCur>document.documentElement.clientWidth - obj.offsetWidth)
                iCur = document.documentElement.clientWidth - obj.offsetWidth;
            return iCur
        }
    },

    parse: (body) => {
        if(body) {
            let bodyStr = '';
            for( let i in body) {
                bodyStr += '&' + i + '=' + body[i]
            }
            return bodyStr.substr(1);
        }
        return null;
    },

    get: (url, data) => {
        const promise = new Promise(function(resolve, reject) {
            const handler = function() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            };
            const client = new XMLHttpRequest();
            url += data? '?'+$.parse(data): '';
            client.open("GET", url, true);
            client.onreadystatechange = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.send();
        });
        return promise;
    },

    post: (url, data) => {
        const promise = new Promise(function(resolve, reject) {
            const handler = function() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            };

            const client = new XMLHttpRequest();
            client.open("POST", url, true);
            client.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
            client.onreadystatechange = handler;
            client.responseType = "json";
            client.send($.parse(data));
        });
        return promise;
    }

};
