/**
 * image movable
 * --------------------------------------
 * 1.no movable
 * 2.vertical movable
 * 3.horizontal movable
 * 4.vertical & horizontal movable
 * --------------------------------------
 */

var movable = function(image, stage) {

    var self = this;

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0,

        widthDiff = 0,
        heightDiff = 0,

        whHalf = 0,
        hwHalf = 0;

    var dragStart = function(e) {

        var e = e || window.event;

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

        whHalf = ($(image).width() - $(image).height()) / 2;
        hwHalf = ($(image).height() - $(image).width()) / 2;

        if (self.isRotated) {
            left = $(image).position().left + hwHalf;
            top = $(image).position().top + whHalf;
            widthDiff = $(image).height() - $(stage).width();
            heightDiff = $(image).width() - $(stage).height();
        }

    }

    var dragMove = function(e) {

        var e = e || window.event;

        if (isDragging) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY,

                newLeft = relativeX + left,
                newTop = relativeY + top;

            if (!self.isRotated) {
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

            } else {
                // vertical limit
                if (heightDiff > 0) {

                    if ((relativeY + top) > whHalf) {
                        newTop = whHalf;
                    } else if ((relativeY + top) < -heightDiff + whHalf) {
                        newTop = -heightDiff + whHalf;
                    }

                } else {
                    newTop = top;
                }
                // horizontal limit
                if (widthDiff > 0) {

                    if ((relativeX + left) > hwHalf) {
                        newLeft = hwHalf;
                    } else if ((relativeX + left) < -widthDiff + hwHalf) {
                        newLeft = -widthDiff + hwHalf;
                    }

                } else {
                    newLeft = left;
                }

            }

            $(image).css({
                left: newLeft + 'px',
                top: newTop + 'px',
            });

            // Update image initial data
            $.extend(self.imageData, {
                x: newLeft,
                y: newTop
            });

        }

        return false;

    }

    var dragEnd = function(e) {

        isDragging = false;
        isMoving = false;

    }

    $(image).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
    movable: movable
});
