var yjc = {
	startMove : function(obj,json,fn){
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            var bBtn = true;
            for(var attr in json){
              var iSpeed = 0, iCur = 0;
              if(attr == 'opacity'){
                iCur = Math.round(yjc.getStyle(obj,attr)*100);
                iSpeed = (json[attr] - iCur)/5;
              }
              else{
                iCur = parseInt(yjc.getStyle(obj,attr));
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
    	var posX = 0, posY = 0;
    	obj.onmousedown = function(event){
    		var event = event || window.event;
    		posX = event.clientX - obj.offsetLeft;
    		posY = event.clientY - obj.offsetTop;
    		document.onmousemove = function(event){
    			var event = event || window.event;
    			var L = event.clientX - posX;
    			var T = event.clientY - posY;
    			if(L<=0) 
					L = 0;
				else if(L>document.documentElement.clientWidth-obj.offsetWidth)
					L=document.documentElement.clientWidth-obj.offsetWidth;
				if(T<=0)
					T=0;
				else if(T > document.documentElement.clientHeight-obj.offsetHeight)
					T=document.documentElement.clientHeight-obj.offsetHeight;

    			obj.style.left = event.clientX - L + "px";
    			obj.style.top = event.clientY - T + "px";
    			document.onmouseup = function(){
    				document.onmousemove = null;
    				document.onmouseup = null;
    			}
    		}
    		return false;
    	}
    }
}



window.onload = function(){

  	var musicData = [
  		{
  			name : "马頔-南山南",
  			url : "http://sc.111ttt.com/up/mp3/22483/8332AC17EFAE8084E42CD6AB0D5DB2B9.mp3"
  		},
	  	{
	  		name : "赵雷-南方姑娘",
	  		url : "http://sc.111ttt.com/up/mp3/158242/B0E74A31492A51CC50F57D0C4017552F.mp3"
	  	},
	  	{
  			name : "阿肆-预谋邂逅 ",
  			url : "http://sc.111ttt.com/up/mp3/184769/315D3DC50A9287CE80934485C081C69D.mp3"
  		},
  		{
  			name: "许巍-曾经的你",
  			url : "http://sc.111ttt.com/up/mp3/199730/B2005B6B9EFDDF5F6585A4BE884EACF0.mp3"
  		},
  		{
  			name : "王峥嵘-唱歌的孩子",
  			url : "http://sc.111ttt.com/up/mp3/351806/CB23F9848082C01601DAE3D61317B3AB.mp3"
  		},
  		{
  			name :"卡农-小清新",
  			url : "http://sc.111ttt.com/up/mp3/241238/A55AE96E1343552AAF7AD74422BF5D13.mp3"
  		}
  	],
  	iNow = 0;

    var audio = document.createElement('audio');
    var musicBox = document.getElementById('music');
    var musicName = musicBox.getElementsByTagName("p")[0];
    var musicManu = musicBox.getElementsByTagName("li");

  	//初始化
  	iNow = Math.floor(Math.random()*musicData.length);
  	audio.src = musicData[iNow].url;
  	musicName.innerHTML = musicData[iNow].name;

  	audio.onloadeddata = function(){
    	audio.play();
  	}

  	for(var i=1; i<musicManu.length-1; i++){
      	musicManu[i].addEventListener("mouseover", function(){
        	yjc.startMove(this.getElementsByTagName("strong")[0],{"opacity":100});
        	yjc.startMove(musicBox.getElementsByTagName("p")[0],{"opacity":100});
      	});
      	musicManu[i].addEventListener("mouseout", function(){
        	yjc.startMove(this.getElementsByTagName("strong")[0],{"opacity":0});
        	yjc.startMove(musicBox.getElementsByTagName("p")[0],{"opacity":0});
      	});
  	}

  	musicManu[0].onclick =  function(){
    	var oWrap = musicBox.getElementsByTagName("div")[0];
    	yjc.startMove(musicBox,{"left":-210},function(){
    		oWrap.style.width=="30px"? oWrap.style.width="210px":oWrap.style.width="30px";
    		yjc.startMove(musicBox,{"left":0});
    	});
    }

  	musicManu[1].onclick = function(){
    	iNow <= 0 ? iNow=musicData.length-1 : iNow--;
    	audio.src = musicData[iNow].url;
  		musicName.innerHTML = musicData[iNow].name;
  	}

  	musicManu[2].onclick = function(){
    	var thatSpan = this.getElementsByTagName("span")[0];
    	audio.paused ? 
      		(function() {
        		audio.play();
        		thatSpan.className="music_c2";
      		})() : 
      		(function() {
        		audio.pause();
        		thatSpan.className="music_c1";
      		})();
  	}

  	musicManu[3].onclick = function(){
    	iNow >= musicData.length-1 ? iNow=0 : iNow++ ;
    	audio.src = musicData[iNow].url;
  		musicName.innerHTML = musicData[iNow].name;
  	}

  	musicManu[4].onclick = function(){
    	this.getElementsByTagName("span")[0].className = (function() {
        	return audio.muted ? "music_e1" : "music_e2";
      	})();
    	audio.muted = !audio.muted;
  	}

  	musicManu[5].onclick = function(event){
    	var L = this.offsetLeft;
    	var sound = this.getElementsByTagName("div")[0];
    	var event = event || window.event;
    	var W = event.clientX - L- musicBox.offsetLeft;
    	sound.style.width = W +"px";
    	audio.volume = W/50;
  	}
    
    yjc.drap(document.getElementById("photo_wrap"));

}

