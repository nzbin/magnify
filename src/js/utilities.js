/**
 * Private functions
 */

/**
 * [throttle  函数节流 impress.js]
 * @param  {Function} fn    [description]
 * @param  {[Number]} delay [description]
 * @return {Function}       [description]
 */
function throttle(fn, delay) {

    var timer = null;

    return function() {
        var context = this,
            args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
};

/**
 * [preloadImg 预加载图片]
 * @param  {[String]}  src [图片地址]
 * @param  {Function}  fn  [回调函数]
 */
function preloadImg(src, fn) {

    var img = new Image();

    if (!!window.ActiveXObject) {
        img.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                fn(img);
            }
        }
    } else {
        img.onload = function() {
            fn(img);
        }
    }

    img.src = src;
}

/**
 * [requestFullscreen description]
 * @param  {[type]} element [description]
 */
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * [exitFullscreen description]
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * [getImageNameFromUrl 从URL中获取图片名]
 * @param  {[String]} url [description]
 * @return {[String]}     [description]
 */
function getImageNameFromUrl(url) {
    var reg = /^.*?\/*([^/?]*)\.[a-z]+(\?.+|$)/ig;
    return url.replace(reg, '$1');
}
