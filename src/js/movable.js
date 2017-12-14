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

        δ = 0;

    var dragStart = function(e) {

        var e = e || window.event;

        var imageWidth = $(image).width(),
            imageHeight = $(image).height(),
            stageWidth = $(stage).width(),
            stageHeight = $(stage).height();

        isDragging = true;
        isMoving = true;

        startX = e.clientX;
        startY = e.clientY;

        // δ is the difference between image width and height
        δ = !self.isRotated ? 0 : (imageWidth - imageHeight) / 2;

        // Width or height difference can be use to limit image right or top position
        widthDiff = !self.isRotated ? (imageWidth - stageWidth) : (imageHeight - stageWidth);
        heightDiff = !self.isRotated ? (imageHeight - stageHeight) : (imageWidth - stageHeight);

        // Reclac the element position when mousedown
        // Fixed the issue of stage with a border
        left = $(image).position().left - δ;
        top = $(image).position().top + δ;

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

            // vertical limit
            if (heightDiff > 0) {

                if ((relativeY + top) > δ) {
                    newTop = δ;
                } else if ((relativeY + top) < -heightDiff + δ) {
                    newTop = -heightDiff + δ;
                }

            } else {
                newTop = top;
            }
            // horizontal limit
            if (widthDiff > 0) {

                if ((relativeX + left) > -δ) {
                    newLeft = -δ;
                } else if ((relativeX + left) < -widthDiff - δ) {
                    newLeft = -widthDiff - δ;
                }

            } else {
                newLeft = left;
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
