/**
 * ------------------------------
 * 1.modal resizable
 * 2.keep image in stage center
 * 3.~
 * ------------------------------
 *
 * [resizable]
 * @param  {[Object]} modal       [the modal element]
 * @param  {[Object]} stage       [the stage element]
 * @param  {[Object]} image       [the image element]
 * @param  {[Number]} minWidth    [the option of modalWidth]
 * @param  {[Number]} minHeight   [the option of modalHeight]
 */

var resizable = function (modal, stage, image, minWidth, minHeight) {

  var self = this;

  var resizableHandleE = $('<div class="magnify-resizable-handle magnify-resizable-handle-e"></div>'),
    resizableHandleW = $('<div class="magnify-resizable-handle magnify-resizable-handle-w"></div>'),
    resizableHandleS = $('<div class="magnify-resizable-handle magnify-resizable-handle-s"></div>'),
    resizableHandleN = $('<div class="magnify-resizable-handle magnify-resizable-handle-n"></div>'),
    resizableHandleSE = $('<div class="magnify-resizable-handle magnify-resizable-handle-se"></div>'),
    resizableHandleSW = $('<div class="magnify-resizable-handle magnify-resizable-handle-sw"></div>'),
    resizableHandleNE = $('<div class="magnify-resizable-handle magnify-resizable-handle-ne"></div>'),
    resizableHandleNW = $('<div class="magnify-resizable-handle magnify-resizable-handle-nw"></div>');

  var resizableHandles = {
    'e': resizableHandleE,
    's': resizableHandleS,
    'se': resizableHandleSE,
    'n': resizableHandleN,
    'w': resizableHandleW,
    'nw': resizableHandleNW,
    'ne': resizableHandleNE,
    'sw': resizableHandleSW
  };

  $(modal).append(
    resizableHandleE, resizableHandleW, resizableHandleS, resizableHandleN, resizableHandleSE, resizableHandleSW, resizableHandleNE, resizableHandleNW
  );

  var isDragging = false;

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
      l: 0,
      t: 0
    },

    // δ is the difference between image width and height
    δ = 0,
    imgWidth = 0,
    imgHeight = 0,

    direction = '';

  // modal CSS options
  var getModalOpts = function (dir, offsetX, offsetY) {

    // Modal should not move when its width to the minwidth
    var modalLeft = (-offsetX + modalData.w) > minWidth ? (offsetX + modalData.l) : (modalData.l + modalData.w - minWidth),
      modalTop = (-offsetY + modalData.h) > minHeight ? (offsetY + modalData.t) : (modalData.t + modalData.h - minHeight);

    var opts = {
      'e': {
        width: Math.max((offsetX + modalData.w), minWidth) + 'px'
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
  };

  // image CSS options
  var getImageOpts = function (dir, offsetX, offsetY) {

    // Image should not move when modal width to the min width
    // The minwidth is modal width, so we should clac the stage minwidth
    var widthDiff = (offsetX + modalData.w) > minWidth ? (stageData.w - imgWidth + offsetX - δ) : (minWidth - (modalData.w - stageData.w) - imgWidth - δ),
      heightDiff = (offsetY + modalData.h) > minHeight ? (stageData.h - imgHeight + offsetY + δ) : (minHeight - (modalData.h - stageData.h) - imgHeight + δ),

      widthDiff2 = (-offsetX + modalData.w) > minWidth ? (stageData.w - imgWidth - offsetX - δ) : (minWidth - (modalData.w - stageData.w) - imgWidth - δ),
      heightDiff2 = (-offsetY + modalData.h) > minHeight ? (stageData.h - imgHeight - offsetY + δ) : (minHeight - (modalData.h - stageData.h) - imgHeight + δ);

    // Get image position in dragging
    var imgLeft = $(image).position().left - δ,
      imgTop = $(image).position().top + δ;

    var opts = {
      'e': {
        left: widthDiff >= -δ ? ((widthDiff - δ) / 2 + 'px') : (imgLeft > widthDiff ? (imgLeft + 'px') : (widthDiff + 'px'))
      },
      's': {
        top: heightDiff >= δ ? ((heightDiff + δ) / 2 + 'px') : (imgTop > heightDiff ? (imgTop + 'px') : (heightDiff + 'px'))
      },
      'se': {
        top: heightDiff >= δ ? ((heightDiff + δ) / 2 + 'px') : (imgTop > heightDiff ? (imgTop + 'px') : (heightDiff + 'px')),
        left: widthDiff >= -δ ? ((widthDiff - δ) / 2 + 'px') : (imgLeft > widthDiff ? (imgLeft + 'px') : (widthDiff + 'px'))
      },
      'w': {
        left: widthDiff2 >= -δ ? ((widthDiff2 - δ) / 2 + 'px') : (imgLeft > widthDiff2 ? (imgLeft + 'px') : (widthDiff2 + 'px'))
      },
      'n': {
        top: heightDiff2 >= δ ? ((heightDiff2 + δ) / 2 + 'px') : (imgTop > heightDiff2 ? (imgTop + 'px') : (heightDiff2 + 'px'))
      },
      'nw': {
        top: heightDiff2 >= δ ? ((heightDiff2 + δ) / 2 + 'px') : (imgTop > heightDiff2 ? (imgTop + 'px') : (heightDiff2 + 'px')),
        left: widthDiff2 >= -δ ? ((widthDiff2 - δ) / 2 + 'px') : (imgLeft > widthDiff2 ? (imgLeft + 'px') : (widthDiff2 + 'px'))
      },
      'ne': {
        top: heightDiff2 >= δ ? ((heightDiff2 + δ) / 2 + 'px') : (imgTop > heightDiff2 ? (imgTop + 'px') : (heightDiff2 + 'px')),
        left: widthDiff >= -δ ? ((widthDiff - δ) / 2 + 'px') : (imgLeft > widthDiff ? (imgLeft + 'px') : (widthDiff + 'px'))
      },
      'sw': {
        top: heightDiff >= δ ? ((heightDiff + δ) / 2 + 'px') : (imgTop > heightDiff ? (imgTop + 'px') : (heightDiff + 'px')),
        left: widthDiff2 >= -δ ? ((widthDiff2 - δ) / 2 + 'px') : (imgLeft > widthDiff2 ? (imgLeft + 'px') : (widthDiff2 + 'px'))
      }
    };

    return opts[dir];
  };

  var dragStart = function (dir, e) {

    var e = e || window.event;

    e.preventDefault();

    isDragging = true;
    isResizing = true;

    startX = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageX : e.clientX;
    startY = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageY : e.clientY;

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

    // δ is the difference between image width and height
    δ = !self.isRotated ? 0 : (imageData.w - imageData.h) / 2;
    imgWidth = !self.isRotated ? imageData.w : imageData.h;
    imgHeight = !self.isRotated ? imageData.h : imageData.w;

    direction = dir;

    // Add resizable cursor
    $('html,body,.magnify-modal,.magnify-stage,.magnify-button').css('cursor', dir + '-resize');

    $D.on(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .on(TOUCH_END_EVENT + EVENT_NS, dragEnd);

  };

  var dragMove = function (e) {

    var e = e || window.event;

    e.preventDefault();

    if (isDragging && !self.isMaximized) {

      var endX = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageX : e.clientX,
        endY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.clientY,

        relativeX = endX - startX,
        relativeY = endY - startY;

      var modalOpts = getModalOpts(direction, relativeX, relativeY);

      $(modal).css(modalOpts);

      var imageOpts = getImageOpts(direction, relativeX, relativeY);

      $(image).css(imageOpts);

    }

  };

  var dragEnd = function (e) {

    $D.off(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .off(TOUCH_END_EVENT + EVENT_NS, dragEnd);

    // Set grab cursor
    if (isResizing) {
      setGrabCursor({ w: imgWidth, h: imgHeight }, { w: $(stage).width(), h: $(stage).height() },
        stage
      );
    }

    isDragging = false;
    isResizing = false;

    // Remove resizable cursor
    $('html,body,.magnify-modal,.magnify-stage,.magnify-button').css('cursor', '');

  };

  $.each(resizableHandles, function (dir, handle) {
    handle.on(TOUCH_START_EVENT + EVENT_NS, function (e) {
      dragStart(dir, e);
    });
  });

};

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  resizable: resizable
});
