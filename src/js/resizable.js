/**
 * resizable
 */

var resizable = function(modal, stage, image, minWidth, minHeight) {

    var resizableHandleE = $('<div class="resizable-handle resizable-handle-e"></div>'),
        resizableHandleW = $('<div class="resizable-handle resizable-handle-w"></div>'),
        resizableHandleS = $('<div class="resizable-handle resizable-handle-s"></div>'),
        resizableHandleN = $('<div class="resizable-handle resizable-handle-n"></div>'),
        resizableHandleSE = $('<div class="resizable-handle resizable-handle-se"></div>'),
        resizableHandleSW = $('<div class="resizable-handle resizable-handle-sw"></div>'),
        resizableHandleNE = $('<div class="resizable-handle resizable-handle-ne"></div>'),
        resizableHandleNW = $('<div class="resizable-handle resizable-handle-nw"></div>');

    var resizableHandles = {
        'e': resizableHandleE,
        's': resizableHandleS,
        'se': resizableHandleSE,
        'n': resizableHandleN,
        'w': resizableHandleW,
        'nw': resizableHandleNW,
        'ne': resizableHandleNE,
        'sw': resizableHandleSW,
    }

    $(modal).append(resizableHandleE, resizableHandleW, resizableHandleS, resizableHandleN,
        resizableHandleSE, resizableHandleSW, resizableHandleNE, resizableHandleNW);

    var isDragging = false;

    var draggingLimit = false;

    var startX = 0,
        startY = 0,

        modalData = {
            w: 0,
            h: 0,
            l: 0,
            t: 0
        },
        stageData = {
            w: 0,
            h: 0,
            l: 0,
            t: 0
        },
        imageData = {
            w: 0,
            h: 0,
            t: 0,
            l: 0
        };

    var direction = '';

    // modal CSS options
    var getModalOpts = function(dir, offsetX, offsetY) {

        // Modal should not move when its width to the minwidth
        var modalLeft = (-offsetX + modalData.w) > minWidth ? (offsetX + modalData.l) : (modalData.l + modalData.w - minWidth),
            modalTop = (-offsetY + modalData.h) > minHeight ? (offsetY + modalData.t) : (modalData.t + modalData.h - minHeight);

        var opts = {
            'e': {
                width: Math.max((offsetX + modalData.w), minWidth) + 'px',
            },
            's': {
                height: Math.max((offsetY + modalData.h), minHeight) + 'px'
            },
            'se': {
                width: Math.max((offsetX + modalData.w), minWidth) + 'px',
                height: Math.max((offsetY + modalData.h), minHeight) + 'px'
            },
            'w': {
                width: Math.max((-offsetX + modalData.w), minWidth) + 'px',
                left: modalLeft + 'px'
            },
            'n': {
                height: Math.max((-offsetY + modalData.h), minHeight) + 'px',
                top: modalTop + 'px'
            },
            'nw': {
                width: Math.max((-offsetX + modalData.w), minWidth) + 'px',
                height: Math.max((-offsetY + modalData.h), minHeight) + 'px',
                top: modalTop + 'px',
                left: modalLeft + 'px'
            },
            'ne': {
                width: Math.max((offsetX + modalData.w), minWidth) + 'px',
                height: Math.max((-offsetY + modalData.h), minHeight) + 'px',
                top: modalTop + 'px'
            },
            'sw': {
                width: Math.max((-offsetX + modalData.w), minWidth) + 'px',
                height: Math.max((offsetY + modalData.h), minHeight) + 'px',
                left: modalLeft + 'px'
            }
        };

        return opts[dir];
    }

    // image CSS options
    var getImageOpts = function(dir, offsetX, offsetY) {

        // Image should not move when modal width to the min width
        // The minwidth is modal width, so we should clac the stage minwidth
        var widthDiff = (offsetX + modalData.w) > minWidth ? (stageData.w - imageData.w + offsetX) : (minWidth - (modalData.w - stageData.w) - imageData.w),
            heightDiff = (offsetY + modalData.h) > minHeight ? (stageData.h - imageData.h + offsetY) : (minHeight - (modalData.h - stageData.h) - imageData.h),

            widthDiff2 = (-offsetX + modalData.w) > minWidth ? (stageData.w - imageData.w - offsetX) : (minWidth - (modalData.w - stageData.w) - imageData.w),
            heightDiff2 = (-offsetY + modalData.h) > minHeight ? (stageData.h - imageData.h - offsetY) : (minHeight - (modalData.h - stageData.h) - imageData.h);

        // Get image position in dragging
        var imgLeft = $(image).position().left,
            imgTop = $(image).position().top;

        var opts = {
            'e': {
                left: widthDiff >= 0 ? (widthDiff / 2 + 'px') : (imgLeft > widthDiff ? (imgLeft + 'px') : (widthDiff + 'px'))
            },
            's': {
                top: heightDiff >= 0 ? (heightDiff / 2 + 'px') : (imgTop > heightDiff ? (imgTop + 'px') : (heightDiff + 'px'))
            },
            'se': {
                top: heightDiff >= 0 ? (heightDiff / 2 + 'px') : (imgTop > heightDiff ? (imgTop + 'px') : (heightDiff + 'px')),
                left: widthDiff >= 0 ? (widthDiff / 2 + 'px') : (imgLeft > widthDiff ? (imgLeft + 'px') : (widthDiff + 'px'))
            },
            'w': {
                left: widthDiff2 >= 0 ? (widthDiff2 / 2 + 'px') : (imgLeft > widthDiff2 ? (imgLeft + 'px') : (widthDiff2 + 'px'))
            },
            'n': {
                top: heightDiff2 >= 0 ? (heightDiff2 / 2 + 'px') : (imgTop > heightDiff2 ? (imgTop + 'px') : (heightDiff2 + 'px'))
            },
            'nw': {
                top: heightDiff2 >= 0 ? (heightDiff2 / 2 + 'px') : (imgTop > heightDiff2 ? (imgTop + 'px') : (heightDiff2 + 'px')),
                left: widthDiff2 >= 0 ? (widthDiff2 / 2 + 'px') : (imgLeft > widthDiff2 ? (imgLeft + 'px') : (widthDiff2 + 'px'))
            },
            'ne': {
                top: heightDiff2 >= 0 ? (heightDiff2 / 2 + 'px') : (imgTop > heightDiff2 ? (imgTop + 'px') : (heightDiff2 + 'px')),
                left: widthDiff >= 0 ? (widthDiff / 2 + 'px') : (imgLeft > widthDiff ? (imgLeft + 'px') : (widthDiff + 'px'))
            },
            'sw': {
                top: heightDiff >= 0 ? (heightDiff / 2 + 'px') : (imgTop > heightDiff ? (imgTop + 'px') : (heightDiff + 'px')),
                left: widthDiff2 >= 0 ? (widthDiff2 / 2 + 'px') : (imgLeft > widthDiff2 ? (imgLeft + 'px') : (widthDiff2 + 'px'))
            }
        };

        return opts[dir];
    }

    var dragStart = function(dir, e) {

        var e = e || window.event;

        e.preventDefault();

        isDragging = true;
        isResizing = true;

        startX = e.clientX;
        startY = e.clientY;

        // Reclac the modal data when mousedown
        modalData = {
            w: $(modal).width(),
            h: $(modal).height(),
            l: $(modal).offset().left,
            t: $(modal).offset().top
        };

        stageData = {
            w: $(stage).width(),
            h: $(stage).height(),
            l: $(stage).offset().left,
            t: $(stage).offset().top
        };

        imageData = {
            w: $(image).width(),
            h: $(image).height(),
            l: $(image).position().left,
            t: $(image).position().top
        };

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

            var modalOpts = getModalOpts(direction, relativeX, relativeY);

            $(modal).css(modalOpts);

            // Limit dragging speed to prevent drag too fast
            // ?
            // if (draggingLimit) {
            //     return false;
            // }

            // draggingLimit = true;

            // setTimeout(function() {
            //     draggingLimit = false;
            // }, 50);

            var imageOpts = getImageOpts(direction, relativeX, relativeY);
            // console.log($(image).position().left,modalData,imageOpts);

            $(image).css(imageOpts);

        }


    }
    var dragEnd = function() {

        isDragging = false;
        isResizing = false;

    }

    // console.log($(modal))
    $.each(resizableHandles, function(dir, handle) {
        handle.on('mousedown', function(e) {
            dragStart(dir, e);
        });
    });

    $D.on('mousemove', dragMove);
    $D.on('mouseup', dragEnd);
}
