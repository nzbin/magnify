/**
 * Private functions
 */

/**
 * [throttle]
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
 * [preloadImg]
 * @param  {[String]}  src [image src]
 * @param  {Function}  fn  [callbacks]
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
 * [getImageNameFromUrl]
 * @param  {[String]} url [description]
 * @return {[String]}     [description]
 */
function getImageNameFromUrl(url) {
    var reg = /^.*?\/*([^/?]*)\.[a-z]+(\?.+|$)/ig,
        txt = url.replace(reg, '$1');
    return txt;
}

/**
 * [getNumFromCSSValue description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function getNumFromCSSValue(value) {
    var reg = /\d+/g,
        arr = value.match(reg),
        num = parseFloat(arr[0]);
    return num;
}
