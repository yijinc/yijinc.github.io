window.onload = function(){

	$.get('https://yijinc.github.io/home/fakeData/skill.json').then(function (res) {
		let html = '';
		for(let s of res) {
			html += `<h4>${s.name}</h4>
                     <div class="progress">
                         <div style="width: ${s.rate*100+'%'}">
                             <span> ${s.rate*100+'%'} Complete (${s.skilled})</span>
                         </div>
                     </div> `
		}
        document.getElementById('skills').innerHTML = html;
    });

    var head = document.getElementById("photo_wrap");
    head.style.left = (document.documentElement.clientWidth - head.offsetWidth)/2 +"px";
  	var musicData = [
  		{
  			name : "赵雷 - 成都",
  			url : "http://sc1.111ttt.com/2016/1/12/04/205041718593.mp3"
  		},
	  	{
	  		name : "宋冬野 - 安和桥",
	  		url : "http://up.mcyt.net/md5/17/NTAwMjY4Nw_Qq4329912.mp3"
	  	},
	  	{
  			name : "陈鸿宇 - 理想三旬",
  			url : "http://sc1.111ttt.com/2015/5/08/15/101151853006.mp3"
  		},
  		{
  			name: "谢春花 - 借我",
  			url : "http://up.mcyt.net/md5/53/NzA0MDkxMg_Qq4329912.mp3"
  		},
  		{
  			name : "日向大介 - 24／7",
  			url : "http://sc1.111ttt.com/2015/1/09/25/102251005125.mp3"
  		},
  		{
  			name :"黄英华 - 只要为你活一天",
  			url : "http://sc1.111ttt.com/2015/1/05/02/98022140539.mp3"
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
        	$.startMove(this.getElementsByTagName("strong")[0],{"opacity":100});
        	$.startMove(musicBox.getElementsByTagName("p")[0],{"opacity":100});
      	});
      	musicManu[i].addEventListener("mouseout", function(){
        	$.startMove(this.getElementsByTagName("strong")[0],{"opacity":0});
        	$.startMove(musicBox.getElementsByTagName("p")[0],{"opacity":0});
      	});
  	}

  	musicManu[0].onclick =  function(){
    	var oWrap = musicBox.getElementsByTagName("div")[0];
    	$.startMove(musicBox,{"left":-210},function(){
    		oWrap.style.width=="30px"? oWrap.style.width="210px":oWrap.style.width="30px";
    		$.startMove(musicBox,{"left":0});
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
    
    $.drap(document.getElementById("photo_wrap"));

}

