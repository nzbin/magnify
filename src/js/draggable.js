/**
 * Draggable
 * @param {Object} modal - The modal element
 * @param {Object} dragHandle - The handle element when dragging
 * @param {Object} dragCancel - The cancel element when dragging
 */

var draggable = function (modal, dragHandle, dragCancel) {
  var self = this;

  var isDragging = false;

  var startX = 0, startY = 0, left = 0, top = 0;

  var dragStart = function (e) {
    e = e || window.event;

    // Must be removed
    // e.preventDefault();

    modal.focus();

    // Get clicked button
    var elemCancel = $(e.target).closest(dragCancel);
    // Stop modal moving when click buttons
    if (elemCancel.length) {
      return true;
    }

    if (self.options.multiInstances) {
      modal.css('z-index', ++PUBLIC_VARS['zIndex']);
    }

    isDragging = true;

    startX = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageX : e.clientX;
    startY = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageY : e.clientY;

    left = $(modal).offset().left;
    top = $(modal).offset().top;

    $D.on(TOUCH_MOVE_EVENT + EVENT_NS, dragMove).on(
      TOUCH_END_EVENT + EVENT_NS,
      dragEnd
    );
  };

  var dragMove = function (e) {
    e = e || window.event;

    e.preventDefault();

    if (isDragging && !PUBLIC_VARS['isMoving'] && !PUBLIC_VARS['isResizing'] && !self.isMaximized) {
      var endX = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageX : e.clientX;
      var endY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.clientY;
      var relativeX = endX - startX;
      var relativeY = endY - startY;

      $(modal).css({
        left: relativeX + left + 'px',
        top: relativeY + top + 'px'
      });
    }
  };

  var dragEnd = function (e) {
    $D.off(TOUCH_MOVE_EVENT + EVENT_NS, dragMove).off(
      TOUCH_END_EVENT + EVENT_NS,
      dragEnd
    );

    isDragging = false;
  };

  $(dragHandle).on(TOUCH_START_EVENT + EVENT_NS, dragStart);
};

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  draggable: draggable
});
