/**
 * draggable
 */

var isImgDragging = false,
    isResizing = false;

// modal draggable
var draggable = function (el) {

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0;


    var dragStart = function (e) {

        var e = e || window.event;

        e.preventDefault();

        isDragging = true;

        startX = e.clientX;
        startY = e.clientY;

        left = $(el).offset().left;
        top = $(el).offset().top;

    }

    var dragMove = function (e) {

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

    var dragEnd = function () {

        isDragging = false;

    }

    $(el).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}

/**
 * image draggable
 * --------------------------------------
 * 1.no dragging
 * 2.vertical dragging
 * 3.horizontal dragging
 * 4.vertical & horizontal dragging
 * --------------------------------------
 */

var imgDraggable = function (el, parent) {

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0,

        widthDiff = 0,
        heightDiff = 0,

        // image limit vars
        imgSize = {};

    var dragStart = function (e) {

        var e = e || window.event;

        e.preventDefault();

        isDragging = true;
        isImgDragging = true;

        startX = e.clientX;
        startY = e.clientY;

        // Reclac the element position when mousedown
        // Fixed the issue of stage with a border
        left = $(el).position().left;
        top = $(el).position().top;

        // Width or height difference can be use to limit image right or top position
        widthDiff = $(el).width() - $(parent).width();
        heightDiff = $(el).height() - $(parent).height();

        imgSize = checkImgSize(el, parent);

    }

    var dragMove = function (e) {

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
            if (imgSize.overflowY) {

                if ((relativeY + top) > 0) {
                    newTop = 0;
                } else if ((relativeY + top) < -heightDiff) {
                    newTop = -heightDiff;
                }

            } else {
                newTop = top;
            }

            // horizontal limit
            if (imgSize.overflowX) {

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
            });

        }
    }

    var dragEnd = function () {

        isDragging = false;
        isImgDragging = false;

    }

    $(el).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}
