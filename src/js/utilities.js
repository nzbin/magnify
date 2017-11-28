/**
 * Private functions
 */

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
