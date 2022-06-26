"use strict";

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {writable: false});
    return Constructor;
}

const Util = {
    leftDistance: function leftDistance(el) {
        let left = el.offsetLeft;
        let scrollLeft;

        while (el.offsetParent) {
            el = el.offsetParent;
            left += el.offsetLeft;
        }

        scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
        return left - scrollLeft;
    },
    timeFormat: function timeFormat(time) {
        const tempMin = parseInt(time / 60);
        const tempSec = parseInt(time % 60);
        const curMin = tempMin < 10 ? '0' + tempMin : tempMin;
        const curSec = tempSec < 10 ? '0' + tempSec : tempSec;
        return curMin + ':' + curSec;
    },
    percentFormat: function percentFormat(percent) {
        return (percent * 100).toFixed(2) + '%';
    }
};
let instance = false;

const Player = function () {
    function Player(option) {
        _classCallCheck(this, Player);

        if (instance) {
            console.error('播放器只能存在一个实例！');
            return Object.create(null);
        } else {
            instance = true;
        }

        var defaultOption = {
            element: document.getElementById('Player'),
            autoplay: false, //true/false
            mode: 'listloop', //singleloop/listloop
            listshow: true //true/false

        };
        this.option = Object.assign({}, defaultOption, option);

        // for (var defaultKey in defaultOption) {
        //     if (!option.hasOwnProperty(defaultKey)) {
        //         option[defaultKey] = defaultOption[defaultKey];
        //     }
        // }
        //
        // this.option = option;

        if (!(this.option.music && this.option.music.type && this.option.music.source)) {
            console.error('请正确配置对象！');
            return Object.create(null);
        }

        this.root = this.option.element;
        this.type = this.option.music.type;
        this.music = this.option.music.source;
        this.isMobile = /mobile/i.test(window.navigator.userAgent);
        this.toggle = this.toggle.bind(this);
        //this.toggleList = this.toggleList.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.switchMode = this.switchMode.bind(this);

        if (this.type === 'file') {
            this.root.innerHTML = this.template();
            this.init();
            this.bind();
       }
    }

    _createClass(Player, [{
        key: "template",
        value: function template() {
            let html = `
<audio class="Player-source" src="${this.music[0].src}" preload="none"></audio>
<div class="my-3 flex items-center justify-around text-gray-500 dark:text-zinc-300">
                                <div data-id="music-img" class="overflow-hidden rounded-full mr-2 Player-picture">
                                    <div class="rounded-full w-12 h-12">
                                        <img class="Player-cover" id="music_img" alt="music_img" src="${this.music[0].cover}">
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div onclick="player.prev()"
                                         class="border border-gray-900/10 dark:border-gray-300/10 rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             class="h-5 w-5 stroke-current cursor-pointer" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                                        </svg>
                                    </div>
                                    <div class="border Player-play-btn border-gray-900/10 dark:border-gray-300/10 cursor-pointer rounded-full p-2">
                                        <svg class="pl-0.5 w-6 h-6 stroke-current stroke-2" viewBox="0 0 24 24"
                                             fill="none"
                                             stroke-linecap="round" stroke-linejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </div>
                                    <div class="border Player-pause-btn hidden border-gray-900/10 dark:border-gray-300/10 cursor-pointer rounded-full p-2">
                                        <svg viewBox="0 0 24 24"
                                             class="w-6 h-6 stroke-current stroke-2" fill="none"
                                             stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="6" y="4" width="4" height="16"></rect>
                                            <rect x="14" y="4" width="4" height="16"></rect>
                                        </svg>
                                    </div>
                                    <div onclick="player.next()"
                                         class="border border-gray-900/10 dark:border-gray-300/10 rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             class="h-5 w-5 stroke-current cursor-pointer rotate-180" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                                        </svg>
                                    </div>
                                </div>
                                
                                <div class="Player-control hidden">
                <p class="Player-name">${this.music[0].name}</p>
                <p class="Player-author">${this.music[0].author}</p>
                <div class="Player-percent">
                    <div class="Player-line-loading"></div>
                    <div class="Player-line"></div>
                </div>
                <p class="Player-time">
                    <span class="Player-cur">${'00:00'}</span>/<span class="Player-total">${'00:00'}</span>
                </p>
                <div class="Player-volume" style="${this.isMobile ? 'display:none;' : ''}">
                    <i class="Player-icon"></i>
                    <div class="Player-percent">
                        <div class="Player-line"></div>
                    </div>
                </div>
                <div class="Player-list-switch">
                    <i class="Player-list-icon"></i>
                </div>
                <i class="${this.option.mode === 'singleloop' ? 'Player-mode Player-mode-loop' : 'Player-mode'}"></i>
            </div>
                                
                                
                            </div>
<ul id="music-list" class="text-sm font-bold Player-list">`;
            for(let index in this.music){
                html += `
<li data-index="${index}" class="music-item line-clamp-1 cursor-pointer rounded transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-600/30 dark:hover:text-sky-400 py-1 px-4 block whitespace-no-wrap">
${parseInt(index) + 1}&nbsp;&nbsp;${this.music[index].name} - ${this.music[index].author}</li>
            `;
            }
            html += `</ul>`;
            return html;
        }
    }, {
        key: "init",
        value: function init() {
            this.dom = {
                cover: this.root.querySelector('.Player-cover'),//1
                playbutton: this.root.querySelector('.Player-play-btn'),//1
                pausebutton: this.root.querySelector('.Player-pause-btn'),//1
                name: this.root.querySelector('.Player-name'),
                author: this.root.querySelector('.Player-author'),
                timeline_total: this.root.querySelector('.Player-percent'),
                timeline_loaded: this.root.querySelector('.Player-line-loading'),
                timeline_played: this.root.querySelector('.Player-percent .Player-line'),
                timetext_total: this.root.querySelector('.Player-total'),
                timetext_played: this.root.querySelector('.Player-cur'),
                volumebutton: this.root.querySelector('.Player-icon'),
                volumeline_total: this.root.querySelector('.Player-volume .Player-percent'),
                volumeline_value: this.root.querySelector('.Player-volume .Player-line'),
                modebutton: this.root.querySelector('.Player-mode'),
                musiclist: this.root.querySelector('.Player-list'),
                musicitem: this.root.querySelectorAll('.Player-list li')
            };
            this.audio = this.root.querySelector('.Player-source');//1

            if (this.option.listshow) {
                this.root.className = 'Player-list-on';
            }

            if (this.option.mode === 'singleloop') {
                this.audio.loop = true;
            }

            this.dom.musicitem[0].classList.add('Player-curMusic')
        }
    }, {
        key: "bind",
        value: function bind() {
            var _this3 = this;

            this.updateLine = function () {
                var percent = _this3.audio.buffered.length ? _this3.audio.buffered.end(_this3.audio.buffered.length - 1) / _this3.audio.duration : 0;
                _this3.dom.timeline_loaded.style.width = Util.percentFormat(percent);
            };

            this.audio.addEventListener('durationchange', function (e) {
                _this3.dom.timetext_total.innerHTML = Util.timeFormat(_this3.audio.duration);

                _this3.updateLine();
            });
            this.audio.addEventListener('progress', function (e) {
                _this3.updateLine();
            });
            this.audio.addEventListener('canplay', function (e) {
                if (_this3.option.autoplay && !_this3.isMobile) {
                    _this3.play();
                }
            });
            this.audio.addEventListener('timeupdate', function (e) {
                var percent = _this3.audio.currentTime / _this3.audio.duration;
                _this3.dom.timeline_played.style.width = Util.percentFormat(percent);
                _this3.dom.timetext_played.innerHTML = Util.timeFormat(_this3.audio.currentTime);
            });
            this.audio.addEventListener('seeked', function (e) {
                _this3.play();
            });
            this.audio.addEventListener('ended', function (e) {
                _this3.next();
            });
            this.dom.playbutton.addEventListener('click', this.toggle);
            this.dom.pausebutton.addEventListener('click', this.toggle);
            if (!this.isMobile) {
                this.dom.volumebutton.addEventListener('click', this.toggleMute);
            }

            this.dom.modebutton.addEventListener('click', this.switchMode);
            this.dom.musiclist.addEventListener('click', function (e) {
                var target, index, curIndex;

                if (e.target.tagName.toUpperCase() === 'LI') {
                    target = e.target;
                } else if (e.target.parentElement.tagName.toUpperCase() === 'LI') {
                    target = e.target.parentElement;
                } else {
                    return;
                }

                index = parseInt(target.getAttribute('data-index'));
                curIndex = parseInt(_this3.dom.musiclist.querySelector('.Player-curMusic').getAttribute('data-index'));

                if (index === curIndex) {
                    _this3.play();
                } else {
                    _this3.switchMusic(index + 1);
                }
            });
            this.dom.timeline_total.addEventListener('click', function (event) {
                var e = event || window.event;

                var percent = (e.clientX - Util.leftDistance(_this3.dom.timeline_total)) / _this3.dom.timeline_total.clientWidth;

                if (!isNaN(_this3.audio.duration)) {
                    _this3.dom.timeline_played.style.width = Util.percentFormat(percent);
                    _this3.dom.timetext_played.innerHTML = Util.timeFormat(percent * _this3.audio.duration);
                    _this3.audio.currentTime = percent * _this3.audio.duration;
                }
            });

            if (!this.isMobile) {
                this.dom.volumeline_total.addEventListener('click', function (event) {
                    var e = event || window.event;

                    var percent = (e.clientX - Util.leftDistance(_this3.dom.volumeline_total)) / _this3.dom.volumeline_total.clientWidth;

                    _this3.dom.volumeline_value.style.width = Util.percentFormat(percent);
                    _this3.audio.volume = percent;

                    if (_this3.audio.muted) {
                        _this3.toggleMute();
                    }
                });
            }
        }
    }, {
        key: "prev",
        value: function prev() {
            var index = parseInt(this.dom.musiclist.querySelector('.Player-curMusic').getAttribute('data-index'));

            if (index === 0) {
                if (this.music.length === 1) {
                    this.play();
                } else {
                    this.switchMusic(this.music.length - 1 + 1);
                }
            } else {
                this.switchMusic(index - 1 + 1);
            }
        }
    }, {
        key: "next",
        value: function next() {
            var index = parseInt(this.dom.musiclist.querySelector('.Player-curMusic').getAttribute('data-index'));

            if (index === this.music.length - 1) {
                if (this.music.length === 1) {
                    this.play();
                } else {
                    this.switchMusic(0 + 1);
                }
            } else {
                this.switchMusic(index + 1 + 1);
            }
        }
    }, {
        key: "switchMusic",
        value: function switchMusic(index) {
            var _this4 = this;

            if (typeof index !== 'number') {
                console.error('请输入正确的歌曲序号！');
                return;
            }

            index -= 1;

            if (index < 0 || index >= this.music.length) {
                console.error('请输入正确的歌曲序号！');
                return;
            }

            if (index === this.dom.musiclist.querySelector('.Player-curMusic').getAttribute('data-index')) {
                this.play();
                return;
            } //if(!this.isMobile){
            //    this.audio.pause();
            //    this.audio.currentTime = 0;
            //}


            this.dom.musiclist.querySelector('.Player-curMusic').classList.remove('Player-curMusic');
            this.dom.musicitem[index].classList.add('Player-curMusic');
            this.dom.name.innerHTML = this.music[index].name;
            this.dom.author.innerHTML = this.music[index].author;
            this.dom.cover.src = this.music[index].cover;

            if (this.type === 'file') {
                this.audio.src = this.music[index].src;
                this.play();
            }
        }
    }, {
        key: "play",
        value: function play() {
            if (this.audio.paused) {
                this.audio.play();
                this.dom.playbutton.classList.add('hidden');
                this.dom.pausebutton.classList.remove('hidden')
                this.dom.cover.classList.add('Player-pause');
            }
        }
    }, {
        key: "pause",
        value: function pause() {
            if (!this.audio.paused) {
                this.audio.pause();
                this.dom.pausebutton.classList.add('hidden');
                this.dom.playbutton.classList.remove('hidden')
                this.dom.cover.classList.remove('Player-pause');
            }
        }
    }, {
        key: "toggle",
        value: function toggle() {
            this.audio.paused ? this.play() : this.pause();
        }
    }, /*{
        key: "toggleList",
        value: function toggleList() {
            this.root.classList.contains('Player-list-on') ? this.root.classList.remove('Player-list-on') : this.root.classList.add('Player-list-on');
        }
    },*/ {
        key: "toggleMute",
        value: function toggleMute() {
            //暂存问题，移动端兼容性
            if (this.audio.muted) {
                this.audio.muted = false;
                this.dom.volumebutton.classList.remove('Player-quiet');
                this.dom.volumeline_value.style.width = Util.percentFormat(this.audio.volume);
            } else {
                this.audio.muted = true;
                this.dom.volumebutton.classList.add('Player-quiet');
                this.dom.volumeline_value.style.width = '0%';
            }
        }
    }, {
        key: "switchMode",
        value: function switchMode() {
            if (this.audio.loop) {
                this.audio.loop = false;
                this.dom.modebutton.classList.remove('Player-mode-loop');
            } else {
                this.audio.loop = true;
                this.dom.modebutton.classList.add('Player-mode-loop');
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            instance = false;
            this.audio.pause();
            this.root.innerHTML = '';

            for (var prop in this) {
                delete this[prop];
            }

            console.log('该实例已销毁，可重新配置 ...');
        }
    }]);

    return Player;
}();