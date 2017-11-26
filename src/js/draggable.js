/**
 * draggable
 *
 */

var isImgDragging = false,
    isResizing = false;

// popup draggable
var draggable = function(el) {

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0;


    var dragStart = function(e) {

        var e = e || window.event;

        e.preventDefault();

        isDragging = true;

        startX = e.clientX;
        startY = e.clientY;

        left = $(el).offset().left;
        top = $(el).offset().top;

    }

    var dragMove = function(e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging && !isImgDragging && !isResizing) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY;

            $(el).css({
                left: relativeX + left + 'px',
                top: relativeY + top + 'px'
            });

            return false;
        }
    }

    var dragEnd = function() {

        isDragging = false;

    }

    $(el).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}

// image draggable
// --------------------------------------
// 1.no dragging
// 2.vertical dragging
// 3.horizontal dragging
// 4.vertical & horizontal dragging
// --------------------------------------

var checkImgSize = function(el, parent) {

    var imgLimits = {
        vertical: false, // no vertical moving
        horizontal: false // no horizontal moving
    }

    var elWidth = $(el).width(),
        elHeight = $(el).height(),
        parentWidth = $(parent).width(),
        parentHeight = $(parent).height();

    imgLimits.horizontal = elWidth > parentWidth ? true : false;
    imgLimits.vertical = elHeight > parentHeight ? true : false;

    return imgLimits;

}

var imgDraggable = function(el, parent) {

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0,

        widthDiff = 0,
        heightDiff = 0,

        // image limit vars
        imgLimits = {};

    var dragStart = function(e) {

        var e = e || window.event;

        e.preventDefault();

        isDragging = true;
        isImgDragging = true;

        startX = e.clientX;
        startY = e.clientY;

        // we should reclac the element position when mousedown
        left = $(el).offset().left - $(parent).offset().left;
        top = $(el).offset().top - $(parent).offset().top;

        // width & height difference to limit image right & top position
        widthDiff = $(el).width() - $(parent).width();
        heightDiff = $(el).height() - $(parent).height();

        imgLimits = checkImgSize(el, parent);
        // console.log(imgLimits);
    }

    var dragMove = function(e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY,

                newLeft = relativeX + left,
                newTop = relativeY + top;

            // vertical limit
            if (imgLimits.vertical) {

                if ((relativeY + top) > 0) {
                    newTop = 0;
                } else if ((relativeY + top) < -heightDiff) {
                    newTop = -heightDiff;
                }

            } else {
                newTop = top;
            }

            // horizontal limit
            if (imgLimits.horizontal) {

                if ((relativeX + left) > 0) {
                    newLeft = 0;
                } else if ((relativeX + left) < -widthDiff) {
                    newLeft = -widthDiff;
                }

            } else {
                newLeft = left;
            }

            $(el).css({
                left: newLeft + 'px',
                top: newTop + 'px',
            })
            // console.log(relativeY + top)
        }
    }

    var dragEnd = function() {

        isDragging = false;
        isImgDragging = false;

    }

    $(el).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}
