/**
 * resizable
 */

var resizable = function(el) {

    var resizableHandleE = $('<div class="resizable-handle resizable-handle-e"></div>'),
        resizableHandleW = $('<div class="resizable-handle resizable-handle-w"></div>'),
        resizableHandleS = $('<div class="resizable-handle resizable-handle-s"></div>'),
        resizableHandleN = $('<div class="resizable-handle resizable-handle-n"></div>'),
        resizableHandleSE = $('<div class="resizable-handle resizable-handle-se"></div>'),
        resizableHandleSW = $('<div class="resizable-handle resizable-handle-sw"></div>'),
        resizableHandleNE = $('<div class="resizable-handle resizable-handle-ne"></div>'),
        resizableHandleNW = $('<div class="resizable-handle resizable-handle-nw"></div>');

    var resizableHandle = {
        'e': resizableHandleE,
        's': resizableHandleS,
        'se': resizableHandleSE,
        'n': resizableHandleN,
        'w': resizableHandleW,
        'nw': resizableHandleNW,
        'ne': resizableHandleNE,
        'sw': resizableHandleSW,
    }
    // console.log(resizableHandle)

    $(el).append(resizableHandleE, resizableHandleW, resizableHandleS, resizableHandleN,
        resizableHandleSE, resizableHandleSW, resizableHandleNE, resizableHandleNW);

    var isDragging = false;

    var startX = 0,
        startY = 0,

        width = 0,
        height = 0,
        left = 0,
        top = 0;

    var direction = '';

    var getOpts = function(direction, distanceX, distanceY) {

        var opts = {
            'e': {
                width: distanceX + width + 'px',
            },
            's': {
                height: distanceY + height + 'px'
            },
            'se': {
                width: distanceX + width + 'px',
                height: distanceY + height + 'px'
            },
            'w': {
                width: -distanceX + width + 'px',
                left: distanceX + left + 'px'
            },
            'n': {
                height: -distanceY + height + 'px',
                top: distanceY + top + 'px'
            },
            'nw': {
                width: -distanceX + width + 'px',
                height: -distanceY + height + 'px',
                top: distanceY + top + 'px',
                left: distanceX + left + 'px'
            },
            'ne': {
                width: distanceX + width + 'px',
                height: -distanceY + height + 'px',
                top: distanceY + top + 'px'
            },
            'sw': {
                width: -distanceX + width + 'px',
                height: distanceY + height + 'px',
                left: distanceX + left + 'px'
            }
        };

        return opts[direction]
    }



    var dragStart = function(dir,e) {

        var e = e || window.event;

        e.preventDefault();

        isDragging = true;
        isResizing = true;

        startX = e.clientX;
        startY = e.clientY;

        // reclac the element position when mousedown
        width = $(el).width();
        height = $(el).height();
        left = $(el).offset().left;
        top = $(el).offset().top;

        direction = dir;
    }

    var dragMove = function(e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY;

            var opts = getOpts(direction, relativeX, relativeY);

            $(el).css(opts);

            return false;
        }
    }
    var dragEnd = function() {

        isDragging = false;
        isResizing = false;

    }

    // console.log($(el))
    $.each(resizableHandle, function(dir, el) {
        el.on('mousedown', function(e) {
            dragStart(dir,e);
        });
    });

    $D.on('mousemove', dragMove);
    $D.on('mouseup', dragEnd);
}
