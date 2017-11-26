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


var checkImgPos = function(el, parent) {

    var imgPinned = {
        top: false, //can vertical moving
        left: false //can horizontal moving
    }

    var elLeft = $(el).offset().left,
        elTop = $(el).offset().top;

    imgPinned.left = elLeft > 0 ? true : false;
    imgPinned.top = elTop > 0 ? true : false;

    return imgPinned;

}

var imgDraggable = function(el, parent) {

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0;

    // image limit vars
    var imgLimits = {};

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

        imgLimits = checkImgSize(el, parent);

    }

    var dragMove = function(e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY;

            // limit image dragging
            if (imgLimits.vertical && imgLimits.horizontal) {
                $(el).css({
                    left: relativeX + left + 'px',
                    top: relativeY + top + 'px'
                });
            } else if (imgLimits.vertical && !imgLimits.horizontal) {
                $(el).css({
                    top: relativeY + top + 'px'
                });
            } else if (!imgLimits.vertical && imgLimits.horizontal) {
                $(el).css({
                    left: relativeX + left + 'px',
                });
            } else {
                // no moving
            }

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
