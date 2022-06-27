// 背景图片 Cookies 
function setBgImg(bg_img) {
    if (bg_img) {
        Cookies.set('bg_img', bg_img, {
            expires: 36500
        });
        return true;
    }
    return false;
}

// 获取背景图片 Cookies
function getBgImg() {
    var bg_img_local = Cookies.get('bg_img');
    if (bg_img_local && bg_img_local !== "{}") {
        return JSON.parse(bg_img_local);
    } else {
        setBgImg(bg_img_preinstall);
        return bg_img_preinstall;
    }
}

var bg_img_preinstall = {
    "type": "1", // 1:默认背景 2:每日一图 3:随机风景 4:随机动漫
    "path": "", //自定义图片
};


// 更改背景图片
function setBgImgInit() {
    var bg_img = getBgImg();
    $("input[name='wallpaper-type'][value=" + bg_img["type"] + "]").click();

    switch (bg_img["type"]) {
        case "1":
            var pictures = new Array();
            pictures[0] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/31.jpg';
            pictures[1] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/37.jpg';
            pictures[2] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/39.jpg';
            pictures[3] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/42.jpg';
            pictures[4] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/45.jpg';
            pictures[5] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/21.jpg';
            pictures[6] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/8.jpg';
            pictures[7] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/15.jpg';
            pictures[8] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/18.jpg';
            pictures[9] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/20.jpg';
            var rd = Math.floor(Math.random() * 10);
            $('#bg').attr('src', pictures[rd]) //随机默认壁纸
            break;
        case "2":
            $('#bg').attr('src', 'https://api.dujin.org/bing/1920.php'); //必应每日
            break;
        case "3":
            $('#bg').attr('src', 'https://api.ixiaowai.cn/gqapi/gqapi.php'); //随机风景
            break;
        case "4":
            $('#bg').attr('src', 'https://api.ixiaowai.cn/api/api.php'); //随机动漫
            break;
    }
}

$(document).ready(function () {
    // 壁纸数据加载
    setBgImgInit();
    // 设置背景图片
    $("#wallpaper").on("click", ".set-wallpaper", function () {
        var type = $(this).val();
        var bg_img = getBgImg();
        bg_img["type"] = type;

        if (type === "1") {
            setBgImg(bg_img);
            var pictures = new Array();
            pictures[0] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/31.jpg';
            pictures[1] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/37.jpg';
            pictures[2] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/39.jpg';
            pictures[3] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/42.jpg';
            pictures[4] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/45.jpg';
            pictures[5] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/21.jpg';
            pictures[6] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/8.jpg';
            pictures[7] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/15.jpg';
            pictures[8] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/18.jpg';
            pictures[9] = 'https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/5199/Wallpaper/20.jpg';
            var rd = Math.floor(Math.random() * 10);
            $('#bg').attr('src', pictures[rd]) //随机默认壁纸
            iziToast.show({
                icon: "fa-solid fa-image",
                timeout: 2500,
                message: '壁纸设置成功',
            });
        }

        if (type === "2") {
            setBgImg(bg_img);
            $('#bg').attr('src', 'https://api.dujin.org/bing/1920.php'); //必应每日
            iziToast.show({
                icon: "fa-solid fa-image",
                timeout: 2500,
                message: '壁纸设置成功',
            });
        }

        if (type === "3") {
            setBgImg(bg_img);
            $('#bg').attr('src', 'https://api.ixiaowai.cn/gqapi/gqapi.php'); //随机风景
            iziToast.show({
                icon: "fa-solid fa-image",
                timeout: 2500,
                message: '壁纸设置成功',
            });
        }

        if (type === "4") {
            setBgImg(bg_img);
            $('#bg').attr('src', 'https://api.ixiaowai.cn/api/api.php'); //随机动漫
            iziToast.show({
                icon: "fa-solid fa-image",
                timeout: 2500,
                message: '壁纸设置成功',
            });
        }
    });
});