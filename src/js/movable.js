/**
 * --------------------------------------------------------------------------
 * 1. No movable
 * 2. Vertical movable
 * 3. Horizontal movable
 * 4. Vertical & Horizontal movable
 * --------------------------------------------------------------------------
 *
 * Image movable
 * @param {Object} stage - The stage element
 * @param {Object} image - The image element
 */

var movable = function (stage, image) {
  var self = this;

  var isDragging = false;

  var startX = 0,
    startY = 0,
    left = 0,
    top = 0,
    widthDiff = 0,
    heightDiff = 0,
    δ = 0;

  var dragStart = function (e) {
    e = e || window.event;

    e.preventDefault();

    var $image = isIE8() ? $(stage).find(image) : $(image);

    var imageWidth = $image.width(),
      imageHeight = $image.height(),
      stageWidth = $(stage).width(),
      stageHeight = $(stage).height();

    startX = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageX : e.clientX;
    startY = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageY : e.clientY;

    // δ is the difference between image width and height
    δ = !self.isRotated ? 0 : (imageWidth - imageHeight) / 2;

    // Width or height difference can be use to limit image right or top position
    widthDiff = !self.isRotated ? imageWidth - stageWidth : imageHeight - stageWidth;
    heightDiff = !self.isRotated ? imageHeight - stageHeight : imageWidth - stageHeight;

    // Modal can be dragging if image is smaller to stage
    isDragging = widthDiff > 0 || heightDiff > 0 ? true : false;
    PUBLIC_VARS['isMoving'] = widthDiff > 0 || heightDiff > 0 ? true : false;

    // Reclac the element position when mousedown
    // Fixed the issue of stage with a border
    left = $image.position().left - (isIE8() ? 0 : δ);
    top = $image.position().top + (isIE8() ? 0 : δ);

    // Add grabbing cursor
    if (stage.hasClass('is-grab')) {
      $('html, body, .magnify-modal, .magnify-stage, .magnify-button, .magnify-resizable-handle')
        .addClass('is-grabbing');
    }

    $D.on(TOUCH_MOVE_EVENT + EVENT_NS, dragMove).on(
      TOUCH_END_EVENT + EVENT_NS,
      dragEnd
    );
  };

  var dragMove = function (e) {
    e = e || window.event;

    e.preventDefault();

    var $image = isIE8() ? $(stage).find(image) : $(image);

    if (isDragging) {
      var endX = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageX : e.clientX;
      var endY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.clientY;
      var relativeX = endX - startX;
      var relativeY = endY - startY;
      var newLeft = relativeX + left;
      var newTop = relativeY + top;

      // Vertical limit
      if (heightDiff > 0) {
        if (relativeY + top > δ) {
          newTop = δ;
        } else if (relativeY + top < -heightDiff + δ) {
          newTop = -heightDiff + δ;
        }
      } else {
        newTop = top;
      }
      // Horizontal limit
      if (widthDiff > 0) {
        if (relativeX + left > -δ) {
          newLeft = -δ;
        } else if (relativeX + left < -widthDiff - δ) {
          newLeft = -widthDiff - δ;
        }
      } else {
        newLeft = left;
      }

      $image.css({
        left: newLeft + 'px',
        top: newTop + 'px'
      });

      // Update image initial data
      $.extend(self.imageData, {
        left: newLeft,
        top: newTop
      });
    }
  };

  var dragEnd = function (e) {
    $D.off(TOUCH_MOVE_EVENT + EVENT_NS, dragMove).off(
      TOUCH_END_EVENT + EVENT_NS,
      dragEnd
    );

    isDragging = false;
    PUBLIC_VARS['isMoving'] = false;

    // Remove grabbing cursor
    $('html, body, .magnify-modal, .magnify-stage, .magnify-button, .magnify-resizable-handle')
      .removeClass('is-grabbing');
  };

  $(stage).on(TOUCH_START_EVENT + EVENT_NS, dragStart);
};

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  movable: movable
});
