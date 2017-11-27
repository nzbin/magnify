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

    var imgSize = {
        overflowX: false, // no horizontal moving
        overflowY: false // no vertical moving
    }

    var elWidth = $(el).width(),
        elHeight = $(el).height(),
        parentWidth = $(parent).width(),
        parentHeight = $(parent).height();

    imgSize.overflowX = elWidth > parentWidth ? true : false;
    imgSize.overflowY = elHeight > parentHeight ? true : false;

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

/**
 * [getOrigin description]
 * @param  {[type]} imgSize [description]
 * @param  {[type]} imgPos  [description]
 * @param  {[type]} parent  [description]
 * @param  {[type]} e       [description]
 * @return {[type]}         [description]
 */
var getOrigin = function(imgSize, imgPos, parent, e) {

    var XLength = $(parent).width(),
        YLength = $(parent).height();

    // zoom origin
    var origin = {
        x: 0,
        y: 0
    }

    // set origin value base on imgSize & imgPos
    if (!imgSize.overflowX && !imgSize.overflowY) {

        origin.x = XLength / 2;
        origin.y = YLength / 2;

    } else if (imgSize.overflowX && !imgSize.overflowY) {

        if (imgPos.left === 0) {
            origin.x = 0;
        } else if (imgPos.right === 0) {
            origin.x = XLength;
        } else {
            origin.x = e.clientX;
        }

        origin.y = YLength / 2;

    } else if (!imgSize.overflowX && imgSize.overflowY) {

        if (imgPos.top === 0) {
            origin.y = 0;
        } else if (imgPos.bottom === 0) {
            origin.y = YLength;
        } else {
            origin.y = e.clientY;
        }

        origin.x = XLength / 2;

    } else {

        if (imgPos.left === 0) {
            origin.x = 0;
        } else if (imgPos.right === 0) {
            origin.x = XLength;
        } else {
            origin.x = e.clientX;
        }

        if (imgPos.top === 0) {
            origin.y = 0;
        } else if (imgPos.bottom === 0) {
            origin.y = YLength;
        } else {
            origin.y = e.clientY;
        }

    }

    return origin;
}
