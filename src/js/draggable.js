/**
 * [draggable]
 * @param  {[Object]} modal       [the modal element]
 * @param  {[Object]} dragHandle  [the handle element when dragging]
 * @param  {[Object]} dragCancel  [the cancel element when dragging]
 */

var draggable = function (modal, dragHandle, dragCancel) {

  var self = this;

  var isDragging = false;

  var startX = 0,
    startY = 0,

    left = 0,
    top = 0;

  var dragStart = function (e) {

    var e = e || window.event;

    // e.preventDefault();

    // Get clicked button
    var elemCancel = $(e.target).closest(dragCancel);
    // Stop modal moving when click buttons
    if (elemCancel.length) {
      return true;
    }

    isDragging = true;

    startX = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageX : e.clientX;
    startY = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageY : e.clientY;

    left = $(modal).offset().left;
    top = $(modal).offset().top;

  }

  var dragMove = function (e) {

    var e = e || window.event;

    e.preventDefault();

    if (isDragging && !isMoving && !isResizing && !self.isMaximized) {

      var endX = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageX : e.clientX,
        endY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.clientY,

        relativeX = endX - startX,
        relativeY = endY - startY;

      $(modal).css({
        left: relativeX + left + 'px',
        top: relativeY + top + 'px'
      });

    }

  }

  var dragEnd = function (e) {

    isDragging = false;

  }

  $(dragHandle).on(TOUCH_START_EVENT, dragStart);

  $D.on(TOUCH_MOVE_EVENT, dragMove);

  $D.on(TOUCH_END_EVENT, dragEnd);
}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  draggable: draggable
});
