/**
 * draggable
 */

var isMoving = false, // image moving
    isResizing = false; // modal resizing

// modal draggable
var draggable = function(modal) {

    var self = this;

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0;

    var dragStart = function(e) {

        var e = e || window.event;
        // Get clicked button
        var elemCancel = $(e.target).closest('.magnify-button');
        // Stop modal moving when click buttons
        if(elemCancel.length){
            return true;
        }

        isDragging = true;

        startX = e.clientX;
        startY = e.clientY;

        left = $(modal).offset().left;
        top = $(modal).offset().top;

    }

    var dragMove = function(e) {

        var e = e || window.event;

        if (isDragging && !isMoving && !isResizing) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY;

            $(modal).css({
                left: relativeX + left + 'px',
                top: relativeY + top + 'px'
            });

        }

        return false;

    }

    var dragEnd = function(e) {

        isDragging = false;

    }

    $(modal).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
    draggable: draggable
});
