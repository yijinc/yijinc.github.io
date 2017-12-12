/**
 * Created by yijinc on 2017/12/11
 */

var Music = function (arr) {
    this.init(arr);
};

Music.prototype = {

    init: function (arr) {

        this.iNow = 0;
        this.list = arr;
        this.createBox();

        //初始化
        this.iNow = Math.floor(Math.random()*this.list.length);
        this.play(this.iNow);

        this.audio.onloadeddata = ()=>this.audio.play();

        for(let i=1; i<this.mMenu.length-1; i++){
            this.mMenu[i].addEventListener("mouseover", () => {
                $.startMove(this.mMenu[i].getElementsByTagName("strong")[0],{"opacity":100});
                $.startMove(this.mInfo,{"opacity":100});
            });
            this.mMenu[i].addEventListener("mouseout", () => {
                $.startMove(this.mMenu[i].getElementsByTagName("strong")[0],{"opacity":0});
                $.startMove(this.mInfo,{"opacity":0});
            });
        }

        this.mMenu[0].onclick = this.toggle.bind(this);
        this.mMenu[1].onclick = this.pre.bind(this);
        this.mMenu[2].onclick = this.pause.bind(this);
        this.mMenu[3].onclick = this.next.bind(this);
        this.mMenu[4].onclick = this.mute.bind(this);
        this.mMenu[5].onclick = this.volumeChange.bind(this);

    },

    createBox: function () {

        this.audio = document.createElement('audio');

        this.mBox = document.createElement('div');
        this.mBox.id = 'music';
        this.mBox.innerHTML = `
            <p style="opacity: 0;">拥抱 - 谭维维</p>
            <div class="wrap" style="width:30px">
                <ul>
                    <li>
                        <span class="music_a1"></span>
                        <strong style="opacity: 1;"></strong>
                    </li>
                    <li>
                        <span class="music_b1"></span>
                        <strong style="opacity: 0;"></strong>
                    </li>
                    <li>
                        <span class="music_c1"></span>
                        <strong style="opacity: 0;"></strong>
                    </li>
                    <li>
                        <span class="music_d1"></span>
                        <strong style="opacity: 0;"></strong>
                    </li>
                    <li>
                        <span class="music_e1"></span>
                        <strong></strong>
                    </li>
                    <li class="sound">
                        <div class="sound1"></div>
                        <div class="sound2"></div>
                    </li>
                </ul>
            </div>`;
        this.mInfo = this.mBox.getElementsByTagName("p")[0];
        this.oWrap = this.mBox.getElementsByTagName("div")[0];
        this.mMenu = this.mBox.getElementsByTagName("li");
        document.body.appendChild(this.mBox);
    },

    toggle: function () {
        $.startMove(this.mBox, { "left" : -210 }, () => {
            this.oWrap.style.width === "30px" ? this.oWrap.style.width = "210px" : this.oWrap.style.width = "30px";
            $.startMove(this.mBox, {"left" : 0 } );
        });
    },

    play: function (index) {
        this.audio.src = this.list[index].url;
        this.mInfo.innerHTML = this.list[index].name;
    },

    pre: function () {
        this.iNow <= 0 ? this.iNow=this.list.length-1 : this.iNow--;
        this.play(this.iNow);
    },

    next: function () {
        this.iNow >= this.list.length-1 ? this.iNow=0 : this.iNow++ ;
        this.play(this.iNow)
    },

    pause: function () {
        const thatSpan = this.mMenu[2].getElementsByTagName("span")[0];
        this.audio.paused ?
            (()=>{
                this.audio.play();
                thatSpan.className = "music_c2";
            })():
            (()=>{
                this.audio.pause();
                thatSpan.className="music_c1";
            })();
    },

    mute: function () {
        this.mMenu[4].getElementsByTagName("span")[0].className = this.audio.muted ? "music_e1" : "music_e2";
        this.audio.muted = !this.audio.muted;
    },

    volumeChange: function (event) {
        let L = this.mMenu[5].offsetLeft;
        const sound = this.mMenu[5].getElementsByTagName("div")[0];
        event = event || window.event;
        let W = event.clientX - L- this.mBox.offsetLeft;
        sound.style.width = W +"px";
        this.audio.volume = W/50;
    }

};
