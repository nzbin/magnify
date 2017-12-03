/**
 * Private functions
 */

/**
 * [throttle  函数节流 impress.js]
 * @param  {Function} fn    [description]
 * @param  {[Number]} delay [description]
 * @return {Function}       [description]
 */
var throttle = function(fn, delay) {

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
 * @param  {[type]}   src [图片地址]
 * @param  {Function} fn  [回调函数]
 */
var preloadImg = function(src, fn) {

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
 * [checkImgSize description]
 * @param  {[Object]} el     [description]
 * @param  {[Object]} parent [description]
 * @return {[Object]}        [description]
 */
var checkImgSize = function(el, parent) {

    var elWidth = $(el).width(),
        elHeight = $(el).height(),
        parentWidth = $(parent).width(),
        parentHeight = $(parent).height();

    // false = noMoving
    var imgSize = {
        overflowX: elWidth > parentWidth ? true : false,
        overflowY: elHeight > parentHeight ? true : false
    }

    return imgSize;

}
/**
 * [checkImgPos description]
 * @param  {[Object]} el     [description]
 * @param  {[Object]} parent [description]
 * @return {[Object]}        [description]
 */
var checkImgPos = function(el, parent) {

    var leftDiff = $(el).offset().left - $(parent).offset().left,
        topDiff = $(el).offset().top - $(parent).offset().top,
        widthDiff = $(parent).width() - $(el).width(),
        heightDiff = $(parent).height() - $(el).height();

    var imgPos = {
        top: topDiff,
        bottom: heightDiff - topDiff,
        left: leftDiff,
        right: widthDiff - leftDiff
    }

    return imgPos;

}
