
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
        name : "灿烈 - All of me",
        url : "http://sc1.111ttt.com/2015/1/11/16/104161559595.mp3"
    },
    {
        name :"黄英华 - 只要为你活一天",
        url : "http://sc1.111ttt.com/2015/1/05/02/98022140539.mp3"
    },
	{
		name: "艾伦-Faded",
		url: " http://sc1.111ttt.com/2015/1/12/31/105310629118.mp3"
	},
	{
		name: "We Are Again",
		url: "http://sc1.111ttt.com/2015/1/07/23/100232053131.mp3"
	}
];


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
    $.drap(head);

    new Music(musicData);

}

