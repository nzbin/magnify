/**
 * --------------------------------------------------------------------------
 * 1. Modal resizable
 * 2. Keep image in stage center
 * 3. Other image limitations
 * --------------------------------------------------------------------------
 *
 * Resizable
 * @param {Object} modal - The modal element
 * @param {Object} stage - The stage element
 * @param {Object} image - The image element
 * @param {Number} minWidth - The option of modalWidth
 * @param {Number} minHeight - The option of modalHeight
 */

var resizable = function(modal, stage, image, minWidth, minHeight) {
  var self = this;

  var resizableHandleE = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-e"></div>'
    ),
    resizableHandleW = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-w"></div>'
    ),
    resizableHandleS = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-s"></div>'
    ),
    resizableHandleN = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-n"></div>'
    ),
    resizableHandleSE = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-se"></div>'
    ),
    resizableHandleSW = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-sw"></div>'
    ),
    resizableHandleNE = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-ne"></div>'
    ),
    resizableHandleNW = $(
      '<div class="magnify-resizable-handle magnify-resizable-handle-nw"></div>'
    );

  var resizableHandles = {
    e: resizableHandleE,
    s: resizableHandleS,
    se: resizableHandleSE,
    n: resizableHandleN,
    w: resizableHandleW,
    nw: resizableHandleNW,
    ne: resizableHandleNE,
    sw: resizableHandleSW
  };

  $(modal).append(
    resizableHandleE,
    resizableHandleW,
    resizableHandleS,
    resizableHandleN,
    resizableHandleSE,
    resizableHandleSW,
    resizableHandleNE,
    resizableHandleNW
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

  // Modal CSS options
  var getModalOpts = function(dir, offsetX, offsetY) {
    // Modal should not move when its width to the minwidth
    var modalLeft =
        -offsetX + modalData.w > minWidth
          ? offsetX + modalData.l
          : modalData.l + modalData.w - minWidth,
      modalTop =
        -offsetY + modalData.h > minHeight
          ? offsetY + modalData.t
          : modalData.t + modalData.h - minHeight;

    var opts = {
      e: {
        width: Math.max(offsetX + modalData.w, minWidth) + 'px'
      },
      s: {
        height: Math.max(offsetY + modalData.h, minHeight) + 'px'
      },
      se: {
        width: Math.max(offsetX + modalData.w, minWidth) + 'px',
        height: Math.max(offsetY + modalData.h, minHeight) + 'px'
      },
      w: {
        width: Math.max(-offsetX + modalData.w, minWidth) + 'px',
        left: modalLeft + 'px'
      },
      n: {
        height: Math.max(-offsetY + modalData.h, minHeight) + 'px',
        top: modalTop + 'px'
      },
      nw: {
        width: Math.max(-offsetX + modalData.w, minWidth) + 'px',
        height: Math.max(-offsetY + modalData.h, minHeight) + 'px',
        top: modalTop + 'px',
        left: modalLeft + 'px'
      },
      ne: {
        width: Math.max(offsetX + modalData.w, minWidth) + 'px',
        height: Math.max(-offsetY + modalData.h, minHeight) + 'px',
        top: modalTop + 'px'
      },
      sw: {
        width: Math.max(-offsetX + modalData.w, minWidth) + 'px',
        height: Math.max(offsetY + modalData.h, minHeight) + 'px',
        left: modalLeft + 'px'
      }
    };

    return opts[dir];
  };

  // Image CSS options
  var getImageOpts = function(dir, offsetX, offsetY) {
    var $image = isIE8() ? $(stage).find(image) : $(image);

    // In modern browser, the width and height of image won't change after rotated.
    // But its position top and left will get values from the image rotated.
    // In IE8 browser, due to the type of rotating, all the value will be the same.
    var imgPosLeft = isIE8()
        ? $image.position().left + δ
        : $image.position().left,
      imgPosTop = isIE8() ? $image.position().top - δ : $image.position().top;

    // Image should not move when modal width to the min width
    // The minwidth is modal width, so we should clac the stage minwidth
    var widthDiff =
        offsetX + modalData.w > minWidth
          ? stageData.w - imgWidth + offsetX - δ
          : minWidth - (modalData.w - stageData.w) - imgWidth - δ,
      heightDiff =
        offsetY + modalData.h > minHeight
          ? stageData.h - imgHeight + offsetY + δ
          : minHeight - (modalData.h - stageData.h) - imgHeight + δ,
      widthDiff2 =
        -offsetX + modalData.w > minWidth
          ? stageData.w - imgWidth - offsetX - δ
          : minWidth - (modalData.w - stageData.w) - imgWidth - δ,
      heightDiff2 =
        -offsetY + modalData.h > minHeight
          ? stageData.h - imgHeight - offsetY + δ
          : minHeight - (modalData.h - stageData.h) - imgHeight + δ;

    // Get image position in dragging
    var imgLeft =
        (widthDiff > 0 ? imgPosLeft : imgPosLeft < 0 ? imgPosLeft : 0) - δ,
      imgTop = (heightDiff > 0 ? imgPosTop : imgPosTop < 0 ? imgPosTop : 0) + δ,
      imgLeft2 =
        (widthDiff2 > 0 ? imgPosLeft : imgPosLeft < 0 ? imgPosLeft : 0) - δ,
      imgTop2 =
        (heightDiff2 > 0 ? imgPosTop : imgPosTop < 0 ? imgPosTop : 0) + δ;

    var opts = {
      e: {
        left:
          widthDiff >= -δ
            ? (widthDiff - δ) / 2 + 'px'
            : imgLeft > widthDiff
            ? imgLeft + 'px'
            : widthDiff + 'px'
      },
      s: {
        top:
          heightDiff >= δ
            ? (heightDiff + δ) / 2 + 'px'
            : imgTop > heightDiff
            ? imgTop + 'px'
            : heightDiff + 'px'
      },
      se: {
        top:
          heightDiff >= δ
            ? (heightDiff + δ) / 2 + 'px'
            : imgTop > heightDiff
            ? imgTop + 'px'
            : heightDiff + 'px',
        left:
          widthDiff >= -δ
            ? (widthDiff - δ) / 2 + 'px'
            : imgLeft > widthDiff
            ? imgLeft + 'px'
            : widthDiff + 'px'
      },
      w: {
        left:
          widthDiff2 >= -δ
            ? (widthDiff2 - δ) / 2 + 'px'
            : imgLeft2 > widthDiff2
            ? imgLeft2 + 'px'
            : widthDiff2 + 'px'
      },
      n: {
        top:
          heightDiff2 >= δ
            ? (heightDiff2 + δ) / 2 + 'px'
            : imgTop2 > heightDiff2
            ? imgTop2 + 'px'
            : heightDiff2 + 'px'
      },
      nw: {
        top:
          heightDiff2 >= δ
            ? (heightDiff2 + δ) / 2 + 'px'
            : imgTop2 > heightDiff2
            ? imgTop2 + 'px'
            : heightDiff2 + 'px',
        left:
          widthDiff2 >= -δ
            ? (widthDiff2 - δ) / 2 + 'px'
            : imgLeft2 > widthDiff2
            ? imgLeft2 + 'px'
            : widthDiff2 + 'px'
      },
      ne: {
        top:
          heightDiff2 >= δ
            ? (heightDiff2 + δ) / 2 + 'px'
            : imgTop2 > heightDiff2
            ? imgTop2 + 'px'
            : heightDiff2 + 'px',
        left:
          widthDiff >= -δ
            ? (widthDiff - δ) / 2 + 'px'
            : imgLeft > widthDiff
            ? imgLeft + 'px'
            : widthDiff + 'px'
      },
      sw: {
        top:
          heightDiff >= δ
            ? (heightDiff + δ) / 2 + 'px'
            : imgTop > heightDiff
            ? imgTop + 'px'
            : heightDiff + 'px',
        left:
          widthDiff2 >= -δ
            ? (widthDiff2 - δ) / 2 + 'px'
            : imgLeft2 > widthDiff2
            ? imgLeft2 + 'px'
            : widthDiff2 + 'px'
      }
    };

    return opts[dir];
  };

  var dragStart = function(dir, e) {
    var e = e || window.event;

    e.preventDefault();

    var $image = isIE8() ? $(stage).find(image) : $(image);

    isDragging = true;
    PUBLIC_VARS['isResizing'] = true;

    startX =
      e.type === 'touchstart'
        ? e.originalEvent.targetTouches[0].pageX
        : e.clientX;
    startY =
      e.type === 'touchstart'
        ? e.originalEvent.targetTouches[0].pageY
        : e.clientY;

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
      w: $image.width(),
      h: $image.height(),
      l: $image.position().left,
      t: $image.position().top
    };

    // δ is the difference between image width and height
    δ = !self.isRotated ? 0 : (imageData.w - imageData.h) / 2;
    imgWidth = !self.isRotated ? imageData.w : imageData.h;
    imgHeight = !self.isRotated ? imageData.h : imageData.w;

    direction = dir;

    // Add resizable cursor
    $('html,body,.magnify-modal,.magnify-stage,.magnify-button').css(
      'cursor',
      dir + '-resize'
    );

    $D.on(TOUCH_MOVE_EVENT + EVENT_NS, dragMove).on(
      TOUCH_END_EVENT + EVENT_NS,
      dragEnd
    );
  };

  var dragMove = function(e) {
    var e = e || window.event;

    e.preventDefault();

    var $image = isIE8() ? $(stage).find(image) : $(image);

    if (isDragging && !self.isMaximized) {
      var endX =
          e.type === 'touchmove'
            ? e.originalEvent.targetTouches[0].pageX
            : e.clientX,
        endY =
          e.type === 'touchmove'
            ? e.originalEvent.targetTouches[0].pageY
            : e.clientY,
        relativeX = endX - startX,
        relativeY = endY - startY;

      var modalOpts = getModalOpts(direction, relativeX, relativeY);

      $(modal).css(modalOpts);

      var imageOpts = getImageOpts(direction, relativeX, relativeY);

      $image.css(imageOpts);

      self.isDoResize = true;
    }
  };

  var dragEnd = function(e) {
    $D.off(TOUCH_MOVE_EVENT + EVENT_NS, dragMove).off(
      TOUCH_END_EVENT + EVENT_NS,
      dragEnd
    );

    // Set grab cursor
    if (PUBLIC_VARS['isResizing']) {
      setGrabCursor(
        { w: imgWidth, h: imgHeight },
        { w: $(stage).width(), h: $(stage).height() },
        stage
      );
    }

    isDragging = false;
    PUBLIC_VARS['isResizing'] = false;

    // Remove resizable cursor
    $('html,body,.magnify-modal,.magnify-stage,.magnify-button').css(
      'cursor',
      ''
    );

    // Update image initial data
    var scale = self.getImageScaleToStage($(stage).width(), $(stage).height());

    $.extend(self.imageData, {
      initWidth: self.img.width * scale,
      initHeight: self.img.height * scale,
      initLeft: ($(stage).width() - self.img.width * scale) / 2,
      initTop: ($(stage).height() - self.img.height * scale) / 2
    });
  };

  $.each(resizableHandles, function(dir, handle) {
    handle.on(TOUCH_START_EVENT + EVENT_NS, function(e) {
      dragStart(dir, e);
    });
  });
};

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  resizable: resizable
});
