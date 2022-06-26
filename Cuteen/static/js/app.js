//Alpine Plugins x-intersect
(() => {
    function c(e) {
        e.directive("intersect", (s, {value: n, expression: o, modifiers: r}, {evaluateLater: l, cleanup: d}) => {
            let u = l(o), f = {threshold: h(r)}, t = new IntersectionObserver(a => {
                a.forEach(i => {
                    !i.isIntersecting && n === "enter" || i.isIntersecting && n === "leave" || i.intersectionRatio === 0 && !n || (u(), r.includes("once") && t.disconnect())
                })
            }, f);
            t.observe(s), d(() => {
                t.disconnect()
            })
        })
    }

    function h(e) {
        return e.includes("full") ? .99 : e.includes("half") ? .5 : 0
    }

    document.addEventListener("alpine:init", () => {
        window.Alpine.plugin(c)
    });
})();
//Alpine Plugins x-intersect

//Alpine Plugins Collapse
document.addEventListener('alpine:init', () => {
    Alpine.store('accordion', {
        tab: 0
    });

    Alpine.data('accordion', (idx) => ({
        init() {
            this.idx = idx;
        },
        idx: -1,
        handleClick() {
            this.$store.accordion.tab = this.$store.accordion.tab === this.idx ? 0 : this.idx;
        },
        handleRotate() {
            return this.$store.accordion.tab === this.idx ? 'rotate-180' : '';
        },
        handleToggle() {
            return this.$store.accordion.tab === this.idx ? `max-height: ${this.$refs.tab.scrollHeight}px` : '';
        }
    }));
})
//Alpine Plugins Collapse

//兼容性处理
if (typeof window.queueMicrotask !== "function") {
    window.queueMicrotask = function (callback) {
        Promise.resolve()
            .then(callback)
            .catch(e => setTimeout(() => { throw e; }));
    };
}

/* Alpine数据 */
function data() {
    return {
        musicIcon: true,
        darkMode: localStorage.getItem('dark') === 'true',
        AjaxLoadArticle() {
            const link = document.getElementsByClassName('next')[0];
            const href = link.getAttribute('href');
            Alpine.store('ajaxArticleLoading', true)
            const that = this;
            if (CuteenConfig.load_article_mode !== 'fall') {
                link.onclick = function (e) {
                    that.LoadNextArticle(e, link, href)
                    return false;
                }
            } else {
                that.LoadNextArticle(null, link, href)
            }
        },
        LoadNextArticle(e, link, href) {
            if (href !== undefined) {
                fetch(href).then(res => res.text()).then(res => {
                    let parser = new DOMParser(), dom = parser.parseFromString(res, "text/html");//字符串转DOM
                    const error = new RegExp('Typecho_Widget_Exception');
                    if (error.test(res)) {
                        console.log(res)
                        notice(0, '加载失败!请刷新!')
                    } else {
                        let b = '', newHref = '';
                        const list = dom.getElementsByTagName('article');//获取新列表
                        const newHrefPosition = dom.getElementsByClassName('next')[0];
                        if (newHrefPosition !== undefined) newHref = newHrefPosition.getAttribute('href');
                        else Alpine.store('ajaxArticleFinish', true)
                        for (let v of list) b += v.outerHTML;
                        const insertPosition = document.getElementById('article-list');
                        insertPosition.insertAdjacentHTML('beforeend', b);//插入新列表
                        link.setAttribute('href', newHref);//更新href
                        Alpine.store('ajaxArticleLoading', false)
                        return false;
                    }
                }).catch(err => {
                    console.log(err);
                    notice(0, '加载失败！请刷新重试');
                })
                e.stopPropagation(); // 阻止冒泡到父级的点击事件
            }
        },
        commentQQ: '', commentName: '', commentEmail: '', commentText: '', commentUrl: '',
        commentAvatar: CuteenConfig.static_cdn_url + '/img/avatar.svg',
        AjaxGetCommentInfo() {
            fetch(CuteenConfig.index + '/action/cuteen', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: JSON.stringify({type: "getAvatar", qq: this.commentQQ})
            }).then(res => res.json()).then(res => {
                this.commentAvatar = res.data.qq_avatar;
                document.getElementById('author').value = res.data.name;
                document.getElementById('mail').value = this.commentQQ + '@qq.com';
            }).catch(err => console.log(err))
        },
        SubmitComment() {
            const fm = document.getElementById('comment-form');
            const action = fm.getAttribute('data-action');
            let formData = new FormData(fm);
            const submitBtn = document.getElementById('submitBtn');
            fm.onsubmit = function (e) {
                e.preventDefault();
                if (!checkCommentData(formData.get("author"), formData.get("mail"), formData.get("text"))) return;
                submitBtn.classList.add('loading');
                fetch(action, {
                    method: 'POST',
                    body: formData
                }).then(res => res.text()).then(res => {
                    document.getElementById('comment-textarea').value = '';//清空
                    let parser = new DOMParser(), dom = parser.parseFromString(res, "text/html");//字符串转DOM
                    let newIdNumber = res.match(/id=\"?comment-\d+/g).join().match(/\d+/g).sort(
                        (a, b) => {
                            return a - b
                        }).pop();
                    let newId = 'comment-'.concat(newIdNumber),
                        list = document.getElementById('post-comment-list'),
                        newList = dom.getElementById('post-comment-list');
                    list.innerHTML = newList.innerHTML;
                    notice(1, '评论成功');
                    document.getElementById(newId).scrollIntoView({behavior: "smooth"});//滚动到对应锚点
                    submitBtn.classList.remove('loading');
                }).catch(err => {
                    console.log(err);
                    notice(0, '提交失败！请刷新重试');
                    submitBtn.classList.remove('loading');
                })
            }
        },
        PostLikes() {
            let starValue = Cookies.get('upstar'), num = document.getElementById('likeNumber');
            if (starValue === CuteenConfig.post_cid) {
                notice(2, '您已经点过赞啦');
                return false;
            }
            fetch(CuteenConfig.index + '/action/cuteen', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type: "likes", cid: CuteenConfig.post_cid})
            }).then(res => res.json()).then(res => {
                Cookies.set('upstar', CuteenConfig.post_cid, {expires: 7});
                num.innerText++;
                notice(1, '点赞成功~感谢支持');
            }).catch(err => console.log(err))
        },
    }
}

function HeroNavbar() {
        let b = document.documentElement.scrollTop || document.body.scrollTop,
            d = document.getElementById('nav_pc')
        if (b > 200) {
            d.classList.add('dark:text-zinc-300', 'text-gray-600','bg-gray-50/90','dark:bg-black','dark:bg-opacity-80');
            d.classList.remove('text-white');
        } else {
            d.classList.remove('dark:text-zinc-300', 'text-gray-600','bg-gray-50/90','text-white','dark:bg-black','dark:bg-opacity-80')
            d.classList.add('text-white');
        }
}

window.onscroll = () => {
    HeroNavbar()
};



/**
 * 检查评论参数
 * @param name
 * @param email
 * @param text
 * @returns {number|*}
 */
function checkCommentData(name, email, text) {
    let flag = 0;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (name === '') {
        notice(0, '请填写评论昵称');
    } else if (email === '') {
        notice(0, '请填写完整邮箱');
    } else if (text === '') {
        notice(0, '请填写评论内容');
    } else if (!CuteenConfig.is_login) { //未登录才检查邮箱
        if (!re.test(email.trim())) {
            notice(0, '邮箱不合法');
        } else {
            flag = 1;
        }
    } else {
        flag = 1;
    }
    return flag;
}

/**
 * 通知封装
 * @param type
 * @param text
 * @returns {*}
 */
function notice(type, text) {
    switch (type) {
        case 1:
            return Toastify({text: text, style: {background: "linear-gradient(to right,#22c55e,#00b09b)"}}).showToast();
        case 0:
            return Toastify({text: text, style: {background: "linear-gradient(to right,#ff5f6d,#ef4444)"}}).showToast();
        case 2:
            return Toastify({text: text}).showToast();
        default:
            return Toastify({text: text}).showToast();
    }
}


function page_soliloquize_text_style(__) {
    return `
    <li class="border border-gray-900/10 rounded mb-4" id="comment-${__.coid}">
        <div class="p-4">
            <time class="flex items-center mb-3 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>${__.created}</time>
            <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <p>${__.text}</p></div></div></li>`;
}


function emojiHtml(url) {
    fetch(url).then(res => res.json()).then(res => {
        let b = '', j = Object.keys(res), k = document.getElementById('emoji-ctx')
        b = `<div x-data="{ openTab: '${j[0]}'}">`
        b += '<div class="flex justify-center border-b dark:border-gray-700">'
        for (let i = 0; i < j.length; i++) b += emoji_tab_style(j, i)
        b += '</div><div class="w-full pt-4 border-l border-r border-b rounded-b dark:border-gray-700">'
        for (let i = 0; i < j.length; i++) b += emoji_img_style(res, j, i)
        b += '</div></div>'
        k.innerHTML = b;
    })
}

function emoji_tab_style(__, i) {
    return `<div @click="openTab = '${__[i]}'" class="-mb-px mr-1">
<div :class="openTab==='${__[i]}'?'border-l border-t border-r rounded-t':''" class="dark:border-gray-700 dark:bg-transparent cursor-pointer bg-white inline-block py-1 px-2 text-blue-700 hover:text-blue-800 text-sm font-semibold">
${__[i]}</div></div>`;
}

function emoji_img_style(_, __, i) {
    let o = '', p = _[__[i]].container;
    o = `<div class="px-3 pb-3 flex flex-wrap" x-show="openTab === '${__[i]}'">`
    for (let j = 0; j < p.length; j++) {
        o += `<div class="p-1 flex-shrink-0 mx-1 mb-2 rounded bg-gray-100 cursor-pointer duration-300 transition-all hover:scale-125 hover:bg-transparent">
<img class="h-8 w-auto" src="${CuteenConfig.static_cdn_url}/img/${p[j].icon}" title="${p[j].text}" onclick="emoji_textarea('${p[j].data}')" alt="${p[j].text}"></div>`
    }
    o += '</div>'
    return o
}

function music_list_style(_, i) {
    return `<li data-music="${i}" class="music-item cursor-pointer rounded transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-600/30 dark:hover:text-sky-400 py-1 px-4 block whitespace-no-wrap">${i + 1}.&nbsp;&nbsp;${_['name']} - ${_['author']}</li>`;
}

function emoji_textarea(_) {
    let h = document.getElementById('comment-textarea')
    h.value += _;
}

/*! js-cookie v3.0.1 | MIT */
;
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, (function () {
                var current = global.Cookies;
                var exports = global.Cookies = factory();
                exports.noConflict = function () {
                    global.Cookies = current;
                    return exports;
                };
            }()));
}(this, (function () {
    'use strict';

    /* eslint-disable no-var */
    function assign(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                target[key] = source[key];
            }
        }
        return target
    }

    /* eslint-enable no-var */
    /* eslint-disable no-var */
    var defaultConverter = {
        read: function (value) {
            if (value[0] === '"') {
                value = value.slice(1, -1);
            }
            return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
        },
        write: function (value) {
            return encodeURIComponent(value).replace(
                /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
                decodeURIComponent
            )
        }
    };
    /* eslint-enable no-var */

    /* eslint-disable no-var */
    function init(converter, defaultAttributes) {
        function set(key, value, attributes) {
            if (typeof document === 'undefined') {
                return
            }

            attributes = assign({}, defaultAttributes, attributes);

            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
            }
            if (attributes.expires) {
                attributes.expires = attributes.expires.toUTCString();
            }

            key = encodeURIComponent(key)
                .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
                .replace(/[()]/g, escape);

            var stringifiedAttributes = '';
            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue
                }

                stringifiedAttributes += '; ' + attributeName;

                if (attributes[attributeName] === true) {
                    continue
                }

                // Considers RFC 6265 section 5.2:
                // ...
                // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                //     character:
                // Consume the characters of the unparsed-attributes up to,
                // not including, the first %x3B (";") character.
                // ...
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }

            return (document.cookie =
                key + '=' + converter.write(value, key) + stringifiedAttributes)
        }

        function get(key) {
            if (typeof document === 'undefined' || (arguments.length && !key)) {
                return
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var jar = {};
            for (var i = 0; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var value = parts.slice(1).join('=');

                try {
                    var foundKey = decodeURIComponent(parts[0]);
                    jar[foundKey] = converter.read(value, foundKey);

                    if (key === foundKey) {
                        break
                    }
                } catch (e) {
                }
            }

            return key ? jar[key] : jar
        }

        return Object.create(
            {
                set: set,
                get: get,
                remove: function (key, attributes) {
                    set(
                        key,
                        '',
                        assign({}, attributes, {
                            expires: -1
                        })
                    );
                },
                withAttributes: function (attributes) {
                    return init(this.converter, assign({}, this.attributes, attributes))
                },
                withConverter: function (converter) {
                    return init(assign({}, this.converter, converter), this.attributes)
                }
            },
            {
                attributes: {value: Object.freeze(defaultAttributes)},
                converter: {value: Object.freeze(converter)}
            }
        )
    }

    var api = init(defaultConverter, {path: '/'});
    /* eslint-enable no-var */
    return api;
})));