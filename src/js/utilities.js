/**
 * Private Functions
 */

/**
 * Get image src from `data-src`
 * @param {Object} el - image
 */
function getImgSrc(el) {
  // Get data-src as image src at first
  var src = $(el).attr('data-src')
    ? $(el).attr('data-src')
    : $(el).attr('href');
  return src;
}

/**
 * Throttle function
 * @param {Function} fn - The function will be triggered
 * @param {Number} delay - The throttle delay time
 * @return {Function}
 */
function throttle(fn, delay) {
  var timer = null;

  return function() {
    var context = this,
      args = arguments;

    clearTimeout(timer);

    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * Preload a image
 * @param {String} src - The image src
 * @param {Function} success - The callback of success
 * @param {Function} error - The callback of error
 */
function preloadImg(src, success, error) {
  var img = new Image();

  img.onload = function() {
    success(img);
  };

  img.onerror = function() {
    error(img);
  };

  img.src = src;
}

/**
 * Request fullscreen
 * @param {type} element
 */
function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

/**
 * Exit fullscreen
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Get the image name from its url
 * @param {String} url- The image src
 * @return {String}
 */
function getImageNameFromUrl(url) {
  var reg = /^.*?\/*([^/?]*)\.[a-z]+(\?.+|$)/gi,
    txt = url.replace(reg, '$1');
  return txt;
}

/**
 * Check if the document has a scrollbar
 * @return {Boolean}
 */
function hasScrollbar() {
  return (
    document.body.scrollHeight >
    (window.innerHeight || document.documentElement.clientHeight)
  );
}

/**
 * Get the scrollbar width
 * @return {Number}
 */
function getScrollbarWidth() {
  var scrollDiv = document.createElement('div');
  scrollDiv.style.cssText =
    'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

/**
 * Set grab cursor when move image
 * @param {Object} imageData - The image data
 * @param {Object} stageData - The stage data
 * @param {Object} stage - The stage element
 * @param {Boolean} isRotate - The image rotated flag
 */
function setGrabCursor(imageData, stageData, stage, isRotated) {
  var imageWidth = !isRotated ? imageData.w : imageData.h,
    imageHeight = !isRotated ? imageData.h : imageData.w;

  if (imageHeight > stageData.h || imageWidth > stageData.w) {
    stage.addClass('is-grab');
  }
  if (imageHeight <= stageData.h && imageWidth <= stageData.w) {
    stage.removeClass('is-grab');
  }
}

/**
 * Check if browser support touch event
 * @return {Boolean}
 */
function supportTouch() {
  return !!(
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  );
}

/**
 * Check if the browser is IE8
 * @return {Boolean}
 */
function isIE8() {
  return (
    (navigator.appName == 'Microsoft Internet Explorer' &&
      navigator.appVersion.indexOf('MSIE 8.0') > 0) ||
    (navigator.appName == 'Microsoft Internet Explorer' &&
      navigator.appVersion.indexOf('MSIE 7.0') > 0)
  );
}
