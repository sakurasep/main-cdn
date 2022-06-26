"use strict";
console.log(' %c Theme Cuteen Version%s%c https://blog.zwying.com/ ', 'color: #fff; background: #2dce89; padding:5px;', CuteenConfig.theme_version, 'background: #1c2b36; padding:5px;');
let Cuteen = {
    PostTOC: () => {
        const el = document.querySelector('#post');
        if (el) {
            tocbot.init({
                tocSelector: '#Toc',
                contentSelector: '#post',
                headingSelector: 'h1,h2,h3,h4,h5,h6',
                scrollSmoothDuration: 800,
                scrollSmooth: !0,
                scrollSmoothOffset: -60,
                headingsOffset: 60
            });
        }
    },
    RandomTagsColor: () => {
        const color = ['green', 'red', 'amber', 'indigo', 'sky']
        const el = document.querySelectorAll('#tag a')
        if (el) {
            el.forEach((element, index) => {
                element.classList.add('bg-' + color[index % 5] + '-50', 'text-' + color[index % 5] + '-500')
            })
        }
    }
}

function PjaxLoad() {
    Cuteen.PostTOC()
    Cuteen.RandomTagsColor()
}

document.addEventListener('DOMContentLoaded', function (event) {
    PjaxLoad();
});