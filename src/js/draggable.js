/**
 * draggable
 *
 */

var isImgDragging = false;
var isResizing = false;

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

// 图片拖拽
var imgDraggable = function(el, parent) {

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0;

    // console.log($(el))

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

    }

    var dragMove = function(e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging) {

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
        isImgDragging = false;

    }

    $(el).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}
