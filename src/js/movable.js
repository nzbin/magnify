/**
 * image movable
 * --------------------------------------
 * 1.no movable
 * 2.vertical movable
 * 3.horizontal movable
 * 4.vertical & horizontal movable
 * --------------------------------------
 */

var movable = function (image, stage) {

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0,

        widthDiff = 0,
        heightDiff = 0;

    var dragStart = function (e) {

        var e = e || window.event;

        e.preventDefault();

        isDragging = true;
        isMoving = true;

        startX = e.clientX;
        startY = e.clientY;

        // Reclac the element position when mousedown
        // Fixed the issue of stage with a border
        left = $(image).position().left;
        top = $(image).position().top;

        // Width or height difference can be use to limit image right or top position
        widthDiff = $(image).width() - $(stage).width();
        heightDiff = $(image).height() - $(stage).height();

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
            if (heightDiff > 0) {

                if ((relativeY + top) > 0) {
                    newTop = 0;
                } else if ((relativeY + top) < -heightDiff) {
                    newTop = -heightDiff;
                }

            } else {
                newTop = top;
            }

            // horizontal limit
            if (widthDiff > 0) {

                if ((relativeX + left) > 0) {
                    newLeft = 0;
                } else if ((relativeX + left) < -widthDiff) {
                    newLeft = -widthDiff;
                }

            } else {
                newLeft = left;
            }

            $(image).css({
                left: newLeft + 'px',
                top: newTop + 'px',
            });

        }
    }

    var dragEnd = function () {

        isDragging = false;
        isMoving = false;

    }

    $(image).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}
