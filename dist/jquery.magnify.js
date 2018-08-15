/*!
 *  ___  ___  _____   ______  __   __ _____ ______ __    __
 * |   \/   |/  _  \ /  __  \|  \ |  |_   _|   ___|  \  /  |
 * |        |  / \  |  |  \__|   \|  | | | |  |__  \  \/  /
 * |  |\/|  |  |_|  |  |  ___        | | | |   __|  \    /
 * |  |  |  |   _   |  \_/   |  |\   |_| |_|  |      |  |
 * |__|  |__|__| |__|\____/|_|__| \__|_____|__|      |__|
 *
 * jquery.magnify - v1.2.0
 * A jQuery plugin to view images just like in windows
 * https://github.com/nzbin/magnify#readme
 *
 * Copyright (c) 2017 nzbin
 * Released under the MIT License
 *
 */
;
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function($) {

  'use strict';

/**
 * Private Functions
 */

/**
 * [getImgSrc]
 * @param {[Object]}  el    [description]
 */
function getImgSrc(el) {
  // Get data-src as image src at first
  var src = $(el).attr('data-src') ? $(el).attr('data-src') : $(el).attr('href');
  return src;
}

/**
 * [throttle]
 * @param  {Function} fn    [description]
 * @param  {[Number]} delay [description]
 * @return {Function}       [description]
 */
function throttle(fn, delay) {

  var timer = null;

  return function () {
    var context = this,
      args = arguments;

    clearTimeout(timer);

    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }

}

/**
 * [preloadImg]
 * @param  {[String]}  src      [image src]
 * @param  {Function}  success  [callbacks]
 * @param  {Function}  error    [callbacks]
 */
function preloadImg(src, success, error) {

  var img = new Image();

  img.onload = function () {
    success(img);
  }

  img.onerror = function () {
    error(img);
  }

  img.src = src;

}

/**
 * [requestFullscreen]
 * @param  {[type]} element [description]
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
 * [exitFullscreen]
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
 * [getImageNameFromUrl]
 * @param  {[String]} url [description]
 * @return {[String]}     [description]
 */
function getImageNameFromUrl(url) {
  var reg = /^.*?\/*([^/?]*)\.[a-z]+(\?.+|$)/ig,
    txt = url.replace(reg, '$1');
  return txt;
}

/**
 * [getNumFromCSSValue]
 * @param  {[String]} value [description]
 * @return {[Number]}       [description]
 */
function getNumFromCSSValue(value) {
  var reg = /\d+/g,
    arr = value.match(reg),
    num = parseFloat(arr[0]);
  return num;
}

/**
 * [hasScrollbar]
 * @return {[Boolean]}       [description]
 */
function hasScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * [getScrollbarWidth]
 * @return {[Number]}       [description]
 */
function getScrollbarWidth() {

  var scrollDiv = document.createElement('div');
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;

}

/**
 * [setGrabCursor]
 * @param {[Object]}  imageData    [description]
 * @param {[Object]}  stageData    [description]
 * @param {[Object]}  stage        [description]
 * @param {[Boolean]} isRotate     [description]
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
 * [supportTouch]
 * @return {[Boolean]}     [description]
 */
function supportTouch() {
  return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
}

/**
 * [isIE8]
 * @return {[Boolean]}      [description]
 */
function isIE8() {
  return (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf('MSIE 8.0') > 0) ||
    (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf('MSIE 7.0') > 0)
}

/**
 * Private Static Constants
 */

var $W = $(window),
  $D = $(document),

  CLICK_EVENT = 'click',
  RESIZE_EVENT = 'resize',
  KEYDOWN_EVENT = 'keydown',
  WHEEL_EVENT = 'wheel mousewheel DOMMouseScroll',
  TOUCH_START_EVENT = supportTouch() ? 'touchstart' : 'mousedown',
  TOUCH_MOVE_EVENT = supportTouch() ? 'touchmove' : 'mousemove',
  TOUCH_END_EVENT = supportTouch() ? 'touchend' : 'mouseup',

  NS = 'magnify',
  EVENT_NS = '.' + NS,

  // plugin default options
  DEFAULTS = {
    // Enable modal to drag
    draggable: true,

    // Enable modal to resize
    resizable: true,

    // Enable image to move
    movable: true,

    // Enable keyboard navigation
    keyboard: true,

    // Shows the title
    title: true,

    // Min width of modal
    modalWidth: 320,

    // Min height of modal
    modalHeight: 320,

    // Enable the page content fixed
    fixedContent: true,

    // Disable the modal size fixed
    fixedModalSize: false,

    // Disable the image viewer maximized on init
    initMaximized: false,

    // Threshold of modal to browser window
    gapThreshold: 0.02,

    // Threshold of image ratio
    ratioThreshold: 0.1,

    // Min ratio of image when zoom out
    minRatio: 0.1,

    // Max ratio of image when zoom in
    maxRatio: 16,

    // Toolbar options in header
    headToolbar: [
      'maximize',
      'close'
    ],

    // Toolbar options in footer
    footToolbar: [
      'zoomIn',
      'zoomOut',
      'prev',
      'fullscreen',
      'next',
      'actualSize',
      'rotateRight'
    ],

    // Customize button icon
    icons: {
      minimize: 'fa fa-window-minimize',
      maximize: 'fa fa-window-maximize',
      close: 'fa fa-close',
      zoomIn: 'fa fa-search-plus',
      zoomOut: 'fa fa-search-minus',
      prev: 'fa fa-arrow-left',
      next: 'fa fa-arrow-right',
      fullscreen: 'fa fa-photo',
      actualSize: 'fa fa-arrows-alt',
      rotateLeft: 'fa fa-rotate-left',
      rotateRight: 'fa fa-rotate-right'
    },

    // Customize language of button title
    i18n: {
      minimize: 'minimize',
      maximize: 'maximize',
      close: 'close',
      zoomIn: 'zoom-in(+)',
      zoomOut: 'zoom-out(-)',
      prev: 'prev(←)',
      next: 'next(→)',
      fullscreen: 'fullscreen',
      actualSize: 'actual-size(Ctrl+Alt+0)',
      rotateLeft: 'rotate-left(Ctrl+,)',
      rotateRight: 'rotate-right(Ctrl+.)'
    },

    // Enable multiple instances
    multiInstances: true,

    // Init trigger event
    initEvent: 'click',

    // Enable animation
    initAnimation: true,

    // Disable modal position fixed when change images
    fixedModalPos: false,

    // Modal z-index
    zIndex: 1090,

    // Selector of drag handler
    dragHandle: false,

    // Callback events
    callbacks: {
      beforeOpen: $.noop,
      opened: $.noop,
      beforeClose: $.noop,
      closed: $.noop,
      beforeChange: $.noop,
      changed: $.noop
    }
  },

  PUBLIC_VARS = {
    // image moving flag
    isMoving: false,
    // modal resizing flag
    isResizing: false,
    // modal z-index setting
    zIndex: DEFAULTS.zIndex
  };

// jquery element of calling plugin
var jqEl = null;


/**
 * Magnify Class
 */
var Magnify = function (el, options) {

  var self = this;

  this.options = $.extend(true, {}, DEFAULTS, options);

  if (options && $.isArray(options.footToolbar)) {
    this.options.footToolbar = options.footToolbar;
  }

  if (options && $.isArray(options.headToolbar)) {
    this.options.headToolbar = options.headToolbar;
  }

  // Store element of clicked
  this.$el = $(el);

  // As we have multiple instances,
  // so every instance has following variables.

  // modal open flag
  this.isOpened = false;
  // modal maximize flag
  this.isMaximized = false;
  // image rotate 90*(2n+1) flag
  this.isRotated = false;
  // image rotate angle
  this.rotateAngle = 0;

  // Store image data in every instance
  this.imageData = {};
  // Store modal data in every instance
  this.modalData = {
    width: null,
    height: null,
    left: null,
    top: null
  };

  this.init(el, self.options);

}

/**
 * Mangify Prototype
 */
Magnify.prototype = {

  init: function (el, opts) {

    // Get image src
    var imgSrc = getImgSrc(el);

    // Get image group
    this.groupName = null;

    var currentGroupName = $(el).attr('data-group'),
      groupList = $D.find('[data-group="' + currentGroupName + '"]');

    if (currentGroupName !== undefined) {

      this.groupName = currentGroupName;
      this.getImgGroup(groupList, imgSrc);

    } else {

      this.getImgGroup(jqEl.not('[data-group]'), imgSrc);

    }

    this.open();

    this.loadImg(imgSrc);

    // draggable & movable & resizable
    if (opts.draggable) {
      this.draggable(this.$magnify, this.dragHandle, '.magnify-button');
    }
    if (opts.movable) {
      this.movable(this.$stage, isIE8() ? '.magnify-image' : this.$image);
    }
    if (opts.resizable) {
      this.resizable(this.$magnify, this.$stage, isIE8() ? '.magnify-image' : this.$image, opts.modalWidth, opts.modalHeight);
    }

  },
  _creatBtns: function (toolbar, btns) {

    var btnsStr = '';

    $.each(toolbar, function (index, item) {
      btnsStr += btns[item];
    });

    return btnsStr;

  },
  _creatTitle: function () {
    return (this.options.title ? '<div class="magnify-title"></div>' : '');
  },
  creatDOM: function () {

    var btnsTpl = {
      minimize: '<button class="magnify-button magnify-button-minimize" title="' + this.options.i18n.minimize + '">\
                      <i class="' + this.options.icons.minimize + '" aria-hidden="true"></i>\
                    </button>',
      maximize: '<button class="magnify-button magnify-button-maximize" title="' + this.options.i18n.maximize + '">\
                      <i class="' + this.options.icons.maximize + '" aria-hidden="true"></i>\
                    </button>',
      close: '<button class="magnify-button magnify-button-close" title="' + this.options.i18n.close + '">\
                      <i class="' + this.options.icons.close + '" aria-hidden="true"></i>\
                    </button>',
      zoomIn: '<button class="magnify-button magnify-button-zoom-in" title="' + this.options.i18n.zoomIn + '">\
                      <i class="' + this.options.icons.zoomIn + '" aria-hidden="true"></i>\
                    </button>',
      zoomOut: '<button class="magnify-button magnify-button-zoom-out" title="' + this.options.i18n.zoomOut + '">\
                      <i class="' + this.options.icons.zoomOut + '" aria-hidden="true"></i>\
                    </button>',
      prev: '<button class="magnify-button magnify-button-prev" title="' + this.options.i18n.prev + '">\
                      <i class="' + this.options.icons.prev + '" aria-hidden="true"></i>\
                    </button>',
      next: '<button class="magnify-button magnify-button-next" title="' + this.options.i18n.next + '">\
                      <i class="' + this.options.icons.next + '" aria-hidden="true"></i>\
                    </button>',
      fullscreen: '<button class="magnify-button magnify-button-fullscreen" title="' + this.options.i18n.fullscreen + '">\
                      <i class="' + this.options.icons.fullscreen + '" aria-hidden="true"></i>\
                    </button>',
      actualSize: '<button class="magnify-button magnify-button-actual-size" title="' + this.options.i18n.actualSize + '">\
                      <i class="' + this.options.icons.actualSize + '" aria-hidden="true"></i>\
                    </button>',
      rotateLeft: '<button class="magnify-button magnify-button-rotate-left" title="' + this.options.i18n.rotateLeft + '">\
                      <i class="' + this.options.icons.rotateLeft + '" aria-hidden="true"></i>\
                    </button>',
      rotateRight: '<button class="magnify-button magnify-button-rotate-right" title="' + this.options.i18n.rotateRight + '">\
                      <i class="' + this.options.icons.rotateRight + '" aria-hidden="true"></i>\
                    </button>'
    };

    // magnify base HTML
    var magnifyHTML = '<div class="magnify-modal">\
                        <div class="magnify-header">\
                          <div class="magnify-toolbar magnify-head-toolbar">' + this._creatBtns(this.options.headToolbar, btnsTpl) + '</div>' + this._creatTitle() + '\
                        </div>\
                        <div class="magnify-stage">\
                          <img class="magnify-image" src="" alt="" />\
                        </div>\
                        <div class="magnify-footer">\
                          <div class="magnify-toolbar magnify-foot-toolbar">' + this._creatBtns(this.options.footToolbar, btnsTpl) + '</div>\
                        </div>\
                      </div>';

    return magnifyHTML;

  },
  build: function () {

    // Create magnify HTML string
    var magnifyHTML = this.creatDOM();

    // Make magnify HTML string to jQuery element
    var $magnify = $(magnifyHTML);

    // Get all magnify element
    this.$magnify = $magnify;
    this.$header = $magnify.find('.magnify-header');
    this.$headToolbar = $magnify.find('.magnify-head-toolbar');
    this.$footer = $magnify.find('.magnify-footer');
    this.$footToolbar = $magnify.find('.magnify-foot-toolbar');
    this.$stage = $magnify.find('.magnify-stage');
    this.$title = $magnify.find('.magnify-title');
    this.$image = $magnify.find('.magnify-image');
    this.$close = $magnify.find('.magnify-button-close');
    this.$maximize = $magnify.find('.magnify-button-maximize');
    this.$minimize = $magnify.find('.magnify-button-minimize');
    this.$zoomIn = $magnify.find('.magnify-button-zoom-in');
    this.$zoomOut = $magnify.find('.magnify-button-zoom-out');
    this.$actualSize = $magnify.find('.magnify-button-actual-size');
    this.$fullscreen = $magnify.find('.magnify-button-fullscreen');
    this.$rotateLeft = $magnify.find('.magnify-button-rotate-left');
    this.$rotateRight = $magnify.find('.magnify-button-rotate-right');
    this.$prev = $magnify.find('.magnify-button-prev');
    this.$next = $magnify.find('.magnify-button-next');

    // Add class before image loaded
    this.$stage.addClass('stage-ready');
    this.$image.addClass('image-ready');

    // Reset modal z-index with multiple instances
    this.$magnify.css('z-index', PUBLIC_VARS['zIndex']);

    // Set handle element of draggable
    if (!this.options.dragHandle || this.options.dragHandle === '.magnify-modal') {
      this.dragHandle = this.$magnify;
    } else {
      this.dragHandle = this.$magnify.find(this.options.dragHandle);
    }

  },
  open: function () {

    if (!this.options.multiInstances) {
      $('.magnify-modal').eq(0).remove();
    }

    // Fixed modal position bug
    if (!$('.magnify-modal').length && this.options.fixedContent) {

      $('html').css({ 'overflow': 'hidden' });

      if (hasScrollbar()) {
        var scrollbarWidth = getScrollbarWidth();
        if (scrollbarWidth) {
          $('html').css({ 'padding-right': scrollbarWidth });
        }
      }

    }

    this.build();

    this._triggerHook('beforeOpen', this.$el);

    // Add Magnify to DOM
    $('body').append(this.$magnify);

    this.addEvents();

    this.setModalPos(this.$magnify);

    this._triggerHook('opened', this.$el);

  },
  close: function (el) {

    this._triggerHook('beforeClose', this.$el);

    // Remove instance
    this.$magnify.remove();

    this.isOpened = false;
    this.isMaximized = false;
    this.isRotated = false;
    this.rotateAngle = 0;

    var zeroModal = !$('.magnify-modal').length;

    // Fixed modal position bug
    if (zeroModal && this.options.fixedContent) {
      $('html').css({ 'overflow': '', 'padding-right': '' });
    }

    // Reset zIndex after close
    if (zeroModal && this.options.multiInstances) {
      PUBLIC_VARS['zIndex'] = this.options.zIndex;
    }

    // off events
    if (!$('.magnify-modal').length) {
      $D.off(KEYDOWN_EVENT + EVENT_NS);
      $W.off(RESIZE_EVENT + EVENT_NS);
    }

    this._triggerHook('closed', this.$el);

  },
  setModalPos: function (modal) {

    var winWidth = $W.width(),
      winHeight = $W.height(),
      scrollLeft = $D.scrollLeft(),
      scrollTop = $D.scrollTop();

    var modalWidth = this.options.modalWidth,
      modalHeight = this.options.modalHeight;

    // Set modal maximized when init
    if (this.options.initMaximized) {

      modal.addClass('magnify-maximize');

      modal.css({
        width: '100%',
        height: '100%',
        left: 0,
        top: 0
      });

      this.isOpened = true;
      this.isMaximized = true;

    } else {

      // Make the modal in windows center
      modal.css({
        width: modalWidth,
        height: modalHeight,
        left: (winWidth - modalWidth) / 2 + scrollLeft + 'px',
        top: (winHeight - modalHeight) / 2 + scrollTop + 'px'
      });

    }

  },
  setModalSize: function (img) {

    var self = this,
      winWidth = $W.width(),
      winHeight = $W.height(),
      scrollLeft = $D.scrollLeft(),
      scrollTop = $D.scrollTop();

    // stage css value
    var stageCSS = {
      left: this.$stage.css('left'),
      right: this.$stage.css('right'),
      top: this.$stage.css('top'),
      bottom: this.$stage.css('bottom'),
      borderLeft: this.$stage.css('border-left-width'),
      borderRight: this.$stage.css('border-right-width'),
      borderTop: this.$stage.css('border-top-width'),
      borderBottom: this.$stage.css('border-bottom-width')
    };

    // Modal size should calc with stage css value
    var modalWidth = img.width + getNumFromCSSValue(stageCSS.left) + getNumFromCSSValue(stageCSS.right) +
      getNumFromCSSValue(stageCSS.borderLeft) + getNumFromCSSValue(stageCSS.borderRight),
      modalHeight = img.height + getNumFromCSSValue(stageCSS.top) + getNumFromCSSValue(stageCSS.bottom) +
        getNumFromCSSValue(stageCSS.borderTop) + getNumFromCSSValue(stageCSS.borderBottom);

    var gapThreshold = (this.options.gapThreshold > 0 ? this.options.gapThreshold : 0) + 1,
      // modal scale to window
      scale = Math.min(winWidth / (modalWidth * gapThreshold), winHeight / (modalHeight * gapThreshold), 1);

    var minWidth = Math.max(modalWidth * scale, this.options.modalWidth),
      minHeight = Math.max(modalHeight * scale, this.options.modalHeight);

    minWidth = this.options.fixedModalSize ? this.options.modalWidth : Math.round(minWidth);
    minHeight = this.options.fixedModalSize ? this.options.modalHeight : Math.round(minHeight);

    var modalCSSObj = {
      width: minWidth + 'px',
      height: minHeight + 'px',
      left: (winWidth - minWidth) / 2 + scrollLeft + 'px',
      top: (winHeight - minHeight) / 2 + scrollTop + 'px'
    };

    // Add modal init animation
    if (this.options.initAnimation) {

      this.$magnify.animate(modalCSSObj, function () {
        self.setImageSize(img);
      });

    } else {

      this.$magnify.css(modalCSSObj);
      this.setImageSize(img);

    }

    this.isOpened = true;

  },
  setImageSize: function (img) {

    var $image = isIE8() ? this.$stage.find('.magnify-image') : this.$image;

    var stageData = {
      w: this.$stage.width(),
      h: this.$stage.height()
    };

    // image scale to stage
    var scale = 1;

    if (!this.isRotated) {
      scale = Math.min(stageData.w / img.width, stageData.h / img.height, 1);
    } else {
      scale = Math.min(stageData.w / img.height, stageData.h / img.width, 1);
    }

    $image.css({
      width: Math.ceil(img.width * scale) + 'px',
      height: Math.ceil(img.height * scale) + 'px',
      left: (stageData.w - Math.ceil(img.width * scale)) / 2 + 'px',
      top: (stageData.h - Math.ceil(img.height * scale)) / 2 + 'px'
    });

    if (isIE8()) {
      $image.find('group').css({
        width: Math.floor(img.width * scale) + 'px',
        height: Math.floor(img.height * scale) + 'px'
      });
    }

    // Store image initial data
    $.extend(this.imageData, {
      width: img.width * scale,
      height: img.height * scale,
      left: (stageData.w - img.width * scale) / 2,
      top: (stageData.h - img.height * scale) / 2
    });

    // Set grab cursor
    setGrabCursor({ w: $image.width(), h: $image.height() }, { w: this.$stage.width(), h: this.$stage.height() },
      this.$stage,
      this.isRotated
    );

    // loader end
    this.$magnify.find('.magnify-loader').remove();

    // Add image init animation
    if (this.options.initAnimation) {
      $image.fadeIn();
    }

  },
  loadImg: function (imgSrc) {

    var self = this;

    var loaderHTML = '<div class="magnify-loader"></div>';

    // loader start
    this.$magnify.append(loaderHTML);

    if (this.options.initAnimation) {
      this.$image.hide();
    }

    if (isIE8()) {
      this.$stage.html('<img class="magnify-image" id="magnify-image" src="' + imgSrc + '" alt="" />')
    } else {
      this.$image.attr('src', imgSrc);
    }

    preloadImg(imgSrc, function (img) {

      // Store original data
      self.imageData = {
        originalWidth: img.width,
        originalHeight: img.height
      }

      if (self.isMaximized || (self.isOpened && self.options.fixedModalPos)) {
        self.setImageSize(img);
      } else {
        self.setModalSize(img);
      }

      self.$stage.removeClass('stage-ready');
      self.$image.removeClass('image-ready');

    }, function () {
      // loader end
      self.$magnify.find('.magnify-loader').remove();
    });

    if (this.options.title) {
      this.setImgTitle(imgSrc);
    }

  },
  getImgGroup: function (list, imgSrc) {

    var self = this;

    self.groupData = [];

    $(list).each(function (index, item) {

      var src = getImgSrc(this);

      self.groupData.push({
        src: src,
        caption: $(this).attr('data-caption')
      });
      // Get image index
      if (imgSrc === src) {
        self.groupIndex = index;
      }

    });

  },
  setImgTitle: function (url) {

    var index = this.groupIndex,
      caption = this.groupData[index].caption,
      caption = caption ? caption : getImageNameFromUrl(url);

    this.$title.html(caption);

  },
  jump: function (index) {

    this.groupIndex = this.groupIndex + index;

    this.jumpTo(this.groupIndex);

  },
  jumpTo: function (index) {

    index = index % this.groupData.length;

    if (index >= 0) {
      index = index % this.groupData.length;
    } else if (index < 0) {
      index = (this.groupData.length + index) % this.groupData.length;
    }

    this.groupIndex = index;

    this._triggerHook('beforeChange', index);

    this.loadImg(this.groupData[index].src);

    this._triggerHook('changed', index);

  },
  wheel: function (e) {

    e.preventDefault();

    var delta = 1;

    if (e.originalEvent.deltaY) {
      delta = e.originalEvent.deltaY > 0 ? 1 : -1;
    } else if (e.originalEvent.wheelDelta) {
      delta = -e.originalEvent.wheelDelta / 120;
    } else if (e.originalEvent.detail) {
      delta = e.originalEvent.detail > 0 ? 1 : -1;
    }

    // ratio threshold
    var ratio = -delta * this.options.ratioThreshold;

    // mouse point position relative to stage
    var pointer = {
      x: e.originalEvent.clientX - this.$stage.offset().left + $D.scrollLeft(),
      y: e.originalEvent.clientY - this.$stage.offset().top + $D.scrollTop()
    };

    this.zoom(ratio, pointer, e);

  },
  zoom: function (ratio, origin, e) {

    this.$image = isIE8() ? this.$stage.find('.magnify-image') : this.$image;

    // zoom out & zoom in
    ratio = ratio < 0 ? (1 / (1 - ratio)) : (1 + ratio);

    if (ratio > 0.95 && ratio < 1.05) {
      ratio = 1;
    }

    ratio = this.$image.width() / this.imageData.originalWidth * ratio;

    // min image size
    ratio = Math.max(ratio, this.options.minRatio);
    // max image size
    ratio = Math.min(ratio, this.options.maxRatio);

    this.zoomTo(ratio, origin, e);

  },
  zoomTo: function (ratio, origin, e) {

    var $image = isIE8() ? this.$stage.find('.magnify-image') : this.$image,
      $stage = this.$stage,
      imgData = {
        w: this.imageData.width,
        h: this.imageData.height,
        x: this.imageData.left,
        y: this.imageData.top
      };

    // image stage position
    // We will use it to calc the relative position of image
    var stageData = {
      w: $stage.width(),
      h: $stage.height(),
      x: $stage.offset().left,
      y: $stage.offset().top
    }

    var newWidth = this.imageData.originalWidth * ratio,
      newHeight = this.imageData.originalHeight * ratio,
      // Think about it for a while ~~~
      newLeft = origin.x - (origin.x - imgData.x) / imgData.w * newWidth,
      newTop = origin.y - (origin.y - imgData.y) / imgData.h * newHeight;

    // δ is the difference between image new width and new height
    var δ = !this.isRotated ? 0 : (newWidth - newHeight) / 2,
      imgNewWidth = !this.isRotated ? newWidth : newHeight,
      imgNewHeight = !this.isRotated ? newHeight : newWidth;

    var offsetX = stageData.w - newWidth,
      offsetY = stageData.h - newHeight;

    // zoom out & zoom in condition
    // It's important and it takes me a lot of time to get it
    // The conditions with image rotate 90 degree drive me crazy alomst!
    if (imgNewHeight <= stageData.h) {
      newTop = (stageData.h - newHeight) / 2;
    } else {
      newTop = newTop > δ ? δ : (newTop > (offsetY - δ) ? newTop : (offsetY - δ));
    }

    if (imgNewWidth <= stageData.w) {
      newLeft = (stageData.w - newWidth) / 2;
    } else {
      newLeft = newLeft > -δ ? -δ : (newLeft > (offsetX + δ) ? newLeft : (offsetX + δ));
    }

    $image.css({
      width: Math.round(newWidth) + 'px',
      height: Math.round(newHeight) + 'px',
      left: Math.round(newLeft) + 'px',
      top: Math.round(newTop) + 'px'
    });

    if (isIE8()) {
      $image.find('group').css({
        width: Math.ceil(newWidth) + 'px',
        height: Math.ceil(newHeight) + 'px'
      });
    }

    // Update image initial data
    $.extend(this.imageData, {
      width: newWidth,
      height: newHeight,
      left: newLeft,
      top: newTop
    });

    // Set grab cursor
    setGrabCursor({ w: Math.round(imgNewWidth), h: Math.round(imgNewHeight) }, { w: stageData.w, h: stageData.h },
      this.$stage
    );

  },
  rotate: function (angle) {

    this.rotateAngle = this.rotateAngle + angle;

    if ((this.rotateAngle / 90) % 2 === 0) {
      this.isRotated = false;
    } else {
      this.isRotated = true;
    }

    this.rotateTo(this.rotateAngle);

  },
  rotateTo: function (angle) {

    var self = this,
      $image = isIE8() ? this.$stage.find('.magnify-image') : this.$image;

    // depend on jQueryRotate.js
    $image.rotate({
      angle: angle
    });

    this.setImageSize({ width: this.imageData.originalWidth, height: this.imageData.originalHeight });

    // Remove grab cursor when rotate
    this.$stage.removeClass('is-grab');

  },
  resize: function () {

    var self = this;

    var resizeHandler = throttle(function () {

      if (self.isOpened) {

        if (self.isMaximized) {
          self.setImageSize({ width: self.imageData.originalWidth, height: self.imageData.originalHeight });
        } else {
          self.setModalSize({ width: self.imageData.originalWidth, height: self.imageData.originalHeight });
        }

      }

    }, 500);

    return resizeHandler;

  },
  maximize: function () {

    var self = this;

    if (!this.isMaximized) {
      // Store modal data before maximize
      this.modalData = {
        width: this.$magnify.width(),
        height: this.$magnify.height(),
        left: this.$magnify.offset().left,
        top: this.$magnify.offset().top
      };

      this.$magnify.addClass('magnify-maximize');

      this.$magnify.css({
        width: '100%',
        height: '100%',
        left: 0,
        top: 0
      });

      this.isMaximized = true;

    } else {

      this.$magnify.removeClass('magnify-maximize');

      this.$magnify.css({
        width: this.modalData.width ? this.modalData.width : this.options.modalWidth,
        height: this.modalData.height ? this.modalData.height : this.options.modalHeight,
        left: this.modalData.left ? this.modalData.left : ($W.width() - this.options.modalWidth) / 2 + $D.scrollLeft(),
        top: this.modalData.top ? this.modalData.top : ($W.height() - this.options.modalHeight) / 2 + $D.scrollTop()
      });

      this.isMaximized = false;
    }

    this.setImageSize({ width: this.imageData.originalWidth, height: this.imageData.originalHeight });

  },
  fullscreen: function () {

    requestFullscreen(this.$magnify[0]);

  },
  keydown: function (e) {

    var self = this;

    if (!this.options.keyboard) {
      return false;
    }

    var keyCode = e.keyCode || e.which || e.charCode,
      ctrlKey = e.ctrlKey || e.metaKey,
      altKey = e.altKey || e.metaKey;

    switch (keyCode) {
      // ←
      case 37:
        self.jump(-1);
        break;
      // →
      case 39:
        self.jump(1);
        break;
      // +
      case 187:
        self.zoom(self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        break;
      // -
      case 189:
        self.zoom(-self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        break;
      // + Firefox
      case 61:
        self.zoom(self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        break;
      // - Firefox
      case 173:
        self.zoom(-self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        break;
      // ctrl + alt + 0
      case 48:
        if (ctrlKey && altKey) {
          self.zoomTo(1, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        }
        break;
      // ctrl + ,
      case 188:
        if (ctrlKey) {
          self.rotate(-90);
        }
        break;
      // ctrl + .
      case 190:
        if (ctrlKey) {
          self.rotate(90);
        }
        break;
      default:
    }

  },
  addEvents: function () {

    var self = this;

    this.$close.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function (e) {
      self.close();
    });

    this.$stage.off(WHEEL_EVENT + EVENT_NS).on(WHEEL_EVENT + EVENT_NS, function (e) {
      self.wheel(e);
    });

    this.$zoomIn.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function (e) {
      self.zoom(self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
    });

    this.$zoomOut.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function (e) {
      self.zoom(-self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
    });

    this.$actualSize.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function (e) {
      self.zoomTo(1, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
    });

    this.$prev.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function () {
      self.jump(-1);
    });

    this.$fullscreen.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function () {
      self.fullscreen();
    });

    this.$next.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function () {
      self.jump(1);
    });

    this.$rotateLeft.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function () {
      self.rotate(-90);
    });

    this.$rotateRight.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function () {
      self.rotate(90);
    });

    this.$maximize.off(CLICK_EVENT + EVENT_NS).on(CLICK_EVENT + EVENT_NS, function () {
      self.maximize();
    });

    $D.off(KEYDOWN_EVENT + EVENT_NS).on(KEYDOWN_EVENT + EVENT_NS, function (e) {
      self.keydown(e);
    });

    $W.on(RESIZE_EVENT + EVENT_NS, self.resize());

  },
  _triggerHook: function (e, data) {
    if (this.options.callbacks[e]) {
      this.options.callbacks[e].apply(this, $.isArray(data) ? data : [data]);
    }
  }
}

/**
 * jQuery plugin
 */

$.fn.magnify = function (options) {

  jqEl = $(this);

  // Convert a numeric string into a number
  for (var key in options) {
    if (typeof (options[key]) === 'string' && !isNaN(options[key])) {
      options[key] = parseFloat(options[key])
    }
  }

  // Get init event, 'click' or 'dblclick'
  var opts = $.extend(true, {}, DEFAULTS, options);

  // We should get zIndex of options before plugin's init.
  PUBLIC_VARS['zIndex'] = opts.zIndex;

  if (typeof options === 'string') {

    // $(this).data('magnify')[options]();

  } else {

    if (opts.initEvent === 'dblclick') {

      jqEl.off('click' + EVENT_NS).on('click' + EVENT_NS, function (e) {

        e.preventDefault();
        // This will stop triggering data-api event
        e.stopPropagation();

      });

    }

    jqEl.off(opts.initEvent + EVENT_NS).on(opts.initEvent + EVENT_NS, function (e) {

      e.preventDefault();
      // This will stop triggering data-api event
      e.stopPropagation();

      $(this).data('magnify', new Magnify(this, options));

    });

  }

  return jqEl;

}

/**
 * MAGNIFY DATA-API
 */
$D.on(CLICK_EVENT + EVENT_NS, '[data-magnify]', function (e) {

  jqEl = $('[data-magnify]');

  e.preventDefault();

  $(this).data('magnify', new Magnify(this, DEFAULTS));

});

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

    // Must be removed
    // e.preventDefault();

    if (self.options.multiInstances) {
      modal.css('z-index', ++PUBLIC_VARS['zIndex']);
    }

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

    $D.on(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .on(TOUCH_END_EVENT + EVENT_NS, dragEnd);

  }

  var dragMove = function (e) {

    var e = e || window.event;

    e.preventDefault();

    if (isDragging && !PUBLIC_VARS['isMoving'] && !PUBLIC_VARS['isResizing'] && !self.isMaximized) {

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

    $D.off(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .off(TOUCH_END_EVENT + EVENT_NS, dragEnd);

    isDragging = false;

  }

  $(dragHandle).on(TOUCH_START_EVENT + EVENT_NS, dragStart);

}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  draggable: draggable
});

/**
 * --------------------------------------
 * 1.no movable
 * 2.vertical movable
 * 3.horizontal movable
 * 4.vertical & horizontal movable
 * --------------------------------------
 *
 * [image movable]
 * @param  {[Object]} stage   [the stage element]
 * @param  {[Object]} image   [the image element]
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

    var e = e || window.event;

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
    widthDiff = !self.isRotated ? (imageWidth - stageWidth) : (imageHeight - stageWidth);
    heightDiff = !self.isRotated ? (imageHeight - stageHeight) : (imageWidth - stageHeight);

    // Modal can be dragging if image is smaller to stage
    isDragging = (widthDiff > 0 || heightDiff > 0) ? true : false;
    PUBLIC_VARS['isMoving'] = (widthDiff > 0 || heightDiff > 0) ? true : false;

    // Reclac the element position when mousedown
    // Fixed the issue of stage with a border
    left = $image.position().left - (isIE8() ? 0 : δ);
    top = $image.position().top + (isIE8() ? 0 : δ);

    // Add grabbing cursor
    if (stage.hasClass('is-grab')) {
      $('html,body,.magnify-modal,.magnify-stage,.magnify-button,.magnify-resizable-handle').addClass('is-grabbing');
    }

    $D.on(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .on(TOUCH_END_EVENT + EVENT_NS, dragEnd);

  }

  var dragMove = function (e) {

    var e = e || window.event;

    e.preventDefault();

    var $image = isIE8() ? $(stage).find(image) : $(image);

    if (isDragging) {

      var endX = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageX : e.clientX,
        endY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.clientY,

        relativeX = endX - startX,
        relativeY = endY - startY,

        newLeft = relativeX + left,
        newTop = relativeY + top;

      // vertical limit
      if (heightDiff > 0) {

        if ((relativeY + top) > δ) {
          newTop = δ;
        } else if ((relativeY + top) < -heightDiff + δ) {
          newTop = -heightDiff + δ;
        }

      } else {
        newTop = top;
      }
      // horizontal limit
      if (widthDiff > 0) {

        if ((relativeX + left) > -δ) {
          newLeft = -δ;
        } else if ((relativeX + left) < -widthDiff - δ) {
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

  }

  var dragEnd = function (e) {

    $D.off(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .off(TOUCH_END_EVENT + EVENT_NS, dragEnd);

    isDragging = false;
    PUBLIC_VARS['isMoving'] = false;

    // Remove grabbing cursor
    $('html,body,.magnify-modal,.magnify-stage,.magnify-button,.magnify-resizable-handle').removeClass('is-grabbing');

  }

  $(stage).on(TOUCH_START_EVENT + EVENT_NS, dragStart);

}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  movable: movable
});

/**
 * ------------------------------
 * 1.modal resizable
 * 2.keep image in stage center
 * 3.other image limitations
 * ------------------------------
 *
 * [resizable]
 * @param  {[Object]} modal       [the modal element]
 * @param  {[Object]} stage       [the stage element]
 * @param  {[Object]} image       [the image element]
 * @param  {[Number]} minWidth    [the option of modalWidth]
 * @param  {[Number]} minHeight   [the option of modalHeight]
 */

var resizable = function(modal, stage, image, minWidth, minHeight) {

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
  }

  $(modal).append(
    resizableHandleE, resizableHandleW, resizableHandleS, resizableHandleN,
    resizableHandleSE, resizableHandleSW, resizableHandleNE, resizableHandleNW
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
  var getModalOpts = function(dir, offsetX, offsetY) {

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
  }

  // image CSS options
  var getImageOpts = function(dir, offsetX, offsetY) {

    var $image = isIE8() ? $(stage).find(image) : $(image);

    // In modern browser, the width and height of image won't change after rotated.
    // But its position top and left will get values from the image rotated.
    // In IE8 browser, due to the type of rotating, all the value will be the same.
    var imgPosLeft = isIE8() ? ($image.position().left + δ) : $image.position().left,
      imgPosTop = isIE8() ? ($image.position().top - δ) : $image.position().top;

    // Image should not move when modal width to the min width
    // The minwidth is modal width, so we should clac the stage minwidth
    var widthDiff = (offsetX + modalData.w) > minWidth ? (stageData.w - imgWidth + offsetX - δ) : (minWidth - (modalData.w - stageData.w) - imgWidth - δ),
      heightDiff = (offsetY + modalData.h) > minHeight ? (stageData.h - imgHeight + offsetY + δ) : (minHeight - (modalData.h - stageData.h) - imgHeight + δ),

      widthDiff2 = (-offsetX + modalData.w) > minWidth ? (stageData.w - imgWidth - offsetX - δ) : (minWidth - (modalData.w - stageData.w) - imgWidth - δ),
      heightDiff2 = (-offsetY + modalData.h) > minHeight ? (stageData.h - imgHeight - offsetY + δ) : (minHeight - (modalData.h - stageData.h) - imgHeight + δ);

    // Get image position in dragging
    var imgLeft = (widthDiff > 0 ? imgPosLeft : (imgPosLeft < 0 ? imgPosLeft : 0)) - δ,
      imgTop = (heightDiff > 0 ? imgPosTop : (imgPosTop < 0 ? imgPosTop : 0)) + δ,

      imgLeft2 = (widthDiff2 > 0 ? imgPosLeft : (imgPosLeft < 0 ? imgPosLeft : 0)) - δ,
      imgTop2 = (heightDiff2 > 0 ? imgPosTop : (imgPosTop < 0 ? imgPosTop : 0)) + δ;

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
        left: widthDiff2 >= -δ ? ((widthDiff2 - δ) / 2 + 'px') : (imgLeft2 > widthDiff2 ? (imgLeft2 + 'px') : (widthDiff2 + 'px'))
      },
      'n': {
        top: heightDiff2 >= δ ? ((heightDiff2 + δ) / 2 + 'px') : (imgTop2 > heightDiff2 ? (imgTop2 + 'px') : (heightDiff2 + 'px'))
      },
      'nw': {
        top: heightDiff2 >= δ ? ((heightDiff2 + δ) / 2 + 'px') : (imgTop2 > heightDiff2 ? (imgTop2 + 'px') : (heightDiff2 + 'px')),
        left: widthDiff2 >= -δ ? ((widthDiff2 - δ) / 2 + 'px') : (imgLeft2 > widthDiff2 ? (imgLeft2 + 'px') : (widthDiff2 + 'px'))
      },
      'ne': {
        top: heightDiff2 >= δ ? ((heightDiff2 + δ) / 2 + 'px') : (imgTop2 > heightDiff2 ? (imgTop2 + 'px') : (heightDiff2 + 'px')),
        left: widthDiff >= -δ ? ((widthDiff - δ) / 2 + 'px') : (imgLeft > widthDiff ? (imgLeft + 'px') : (widthDiff + 'px'))
      },
      'sw': {
        top: heightDiff >= δ ? ((heightDiff + δ) / 2 + 'px') : (imgTop > heightDiff ? (imgTop + 'px') : (heightDiff + 'px')),
        left: widthDiff2 >= -δ ? ((widthDiff2 - δ) / 2 + 'px') : (imgLeft2 > widthDiff2 ? (imgLeft2 + 'px') : (widthDiff2 + 'px'))
      }
    };

    return opts[dir];
  }

  var dragStart = function(dir, e) {

    var e = e || window.event;

    e.preventDefault();

    var $image = isIE8() ? $(stage).find(image) : $(image);

    isDragging = true;
    PUBLIC_VARS['isResizing'] = true;

    startX = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageX : e.clientX;
    startY = e.type === 'touchstart' ? e.originalEvent.targetTouches[0].pageY : e.clientY;

    // Reclac the modal data when mousedown
    modalData = {
      w: $(modal).width(),
      h: $(modal).height(),
      l: $(modal).offset().left,
      t: $(modal).offset().top
    }

    stageData = {
      w: $(stage).width(),
      h: $(stage).height(),
      l: $(stage).offset().left,
      t: $(stage).offset().top
    }

    imageData = {
      w: $image.width(),
      h: $image.height(),
      l: $image.position().left,
      t: $image.position().top
    }

    // δ is the difference between image width and height
    δ = !self.isRotated ? 0 : (imageData.w - imageData.h) / 2;
    imgWidth = !self.isRotated ? imageData.w : imageData.h;
    imgHeight = !self.isRotated ? imageData.h : imageData.w;

    direction = dir;

    // Add resizable cursor
    $('html,body,.magnify-modal,.magnify-stage,.magnify-button').css('cursor', dir + '-resize');

    $D.on(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .on(TOUCH_END_EVENT + EVENT_NS, dragEnd);

  }

  var dragMove = function(e) {

    var e = e || window.event;

    e.preventDefault();

    var $image = isIE8() ? $(stage).find(image) : $(image);

    if (isDragging && !self.isMaximized) {

      var endX = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageX : e.clientX,
        endY = e.type === 'touchmove' ? e.originalEvent.targetTouches[0].pageY : e.clientY,

        relativeX = endX - startX,
        relativeY = endY - startY;

      var modalOpts = getModalOpts(direction, relativeX, relativeY);

      $(modal).css(modalOpts);

      var imageOpts = getImageOpts(direction, relativeX, relativeY);

      $image.css(imageOpts);

    }

  }

  var dragEnd = function(e) {

    $D.off(TOUCH_MOVE_EVENT + EVENT_NS, dragMove)
      .off(TOUCH_END_EVENT + EVENT_NS, dragEnd);

    // Set grab cursor
    if (PUBLIC_VARS['isResizing']) {
      setGrabCursor({ w: imgWidth, h: imgHeight }, { w: $(stage).width(), h: $(stage).height() },
        stage
      );
    }

    isDragging = false;
    PUBLIC_VARS['isResizing'] = false;

    // Remove resizable cursor
    $('html,body,.magnify-modal,.magnify-stage,.magnify-button').css('cursor', '');

  };

  $.each(resizableHandles, function(dir, handle) {
    handle.on(TOUCH_START_EVENT + EVENT_NS, function(e) {
      dragStart(dir, e);
    });
  });

}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
  resizable: resizable
});

});

// VERSION: 2.3 LAST UPDATE: 11.07.2013
/*
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://jqueryrotate.com
 */

(function($) {
  var supportedCSS, supportedCSSOrigin, styles = document.getElementsByTagName("head")[0].style,
    toCheck = "transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
  for (var a = 0; a < toCheck.length; a++)
    if (styles[toCheck[a]] !== undefined) { supportedCSS = toCheck[a]; }
  if (supportedCSS) {
    supportedCSSOrigin = supportedCSS.replace(/[tT]ransform/, "TransformOrigin");
    if (supportedCSSOrigin[0] == "T") supportedCSSOrigin[0] = "t";
  }

  // Bad eval to preven google closure to remove it from code o_O
  eval('IE = "v"=="\v"');

  jQuery.fn.extend({
    rotate: function(parameters) {
      if (this.length === 0 || typeof parameters == "undefined") return;
      if (typeof parameters == "number") parameters = { angle: parameters };
      var returned = [];
      for (var i = 0, i0 = this.length; i < i0; i++) {
        var element = this.get(i);
        if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

          var paramClone = $.extend(true, {}, parameters);
          var newRotObject = new Wilq32.PhotoEffect(element, paramClone)._rootObj;

          returned.push($(newRotObject));
        } else {
          element.Wilq32.PhotoEffect._handleRotation(parameters);
        }
      }
      return returned;
    },
    getRotateAngle: function() {
      var ret = [0];
      for (var i = 0, i0 = this.length; i < i0; i++) {
        var element = this.get(i);
        if (element.Wilq32 && element.Wilq32.PhotoEffect) {
          ret[i] = element.Wilq32.PhotoEffect._angle;
        }
      }
      return ret;
    },
    stopRotate: function() {
      for (var i = 0, i0 = this.length; i < i0; i++) {
        var element = this.get(i);
        if (element.Wilq32 && element.Wilq32.PhotoEffect) {
          clearTimeout(element.Wilq32.PhotoEffect._timer);
        }
      }
    }
  });

  // Library agnostic interface

  Wilq32 = window.Wilq32 || {};
  Wilq32.PhotoEffect = (function() {

    if (supportedCSS) {
      return function(img, parameters) {
        img.Wilq32 = {
          PhotoEffect: this
        };

        this._img = this._rootObj = this._eventObj = img;
        this._handleRotation(parameters);
      }
    } else {
      return function(img, parameters) {
        this._img = img;
        this._onLoadDelegate = [parameters];

        this._rootObj = document.createElement('span');
        this._rootObj.style.display = "inline-block";
        this._rootObj.Wilq32 = {
          PhotoEffect: this
        };
        img.parentNode.insertBefore(this._rootObj, img);

        if (img.complete) {
          this._Loader();
        } else {
          var self = this;
          // TODO: Remove jQuery dependency
          jQuery(this._img).bind("load", function() { self._Loader(); });
        }
      }
    }
  })();

  Wilq32.PhotoEffect.prototype = {
    _setupParameters: function(parameters) {
      this._parameters = this._parameters || {};
      if (typeof this._angle !== "number") { this._angle = 0; }
      if (typeof parameters.angle === "number") { this._angle = parameters.angle; }
      this._parameters.animateTo = (typeof parameters.animateTo === "number") ? (parameters.animateTo) : (this._angle);

      this._parameters.step = parameters.step || this._parameters.step || null;
      this._parameters.easing = parameters.easing || this._parameters.easing || this._defaultEasing;
      this._parameters.duration = 'duration' in parameters ? parameters.duration : parameters.duration || this._parameters.duration || 1000;
      this._parameters.callback = parameters.callback || this._parameters.callback || this._emptyFunction;
      this._parameters.center = parameters.center || this._parameters.center || ["50%", "50%"];
      if (typeof this._parameters.center[0] == "string") {
        this._rotationCenterX = (parseInt(this._parameters.center[0], 10) / 100) * this._imgWidth * this._aspectW;
      } else {
        this._rotationCenterX = this._parameters.center[0];
      }
      if (typeof this._parameters.center[1] == "string") {
        this._rotationCenterY = (parseInt(this._parameters.center[1], 10) / 100) * this._imgHeight * this._aspectH;
      } else {
        this._rotationCenterY = this._parameters.center[1];
      }

      if (parameters.bind && parameters.bind != this._parameters.bind) { this._BindEvents(parameters.bind); }
    },
    _emptyFunction: function() {},
    _defaultEasing: function(x, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b },
    _handleRotation: function(parameters, dontcheck) {
      if (!supportedCSS && !this._img.complete && !dontcheck) {
        this._onLoadDelegate.push(parameters);
        return;
      }
      this._setupParameters(parameters);
      if (this._angle == this._parameters.animateTo) {
        this._rotate(this._angle);
      } else {
        this._animateStart();
      }
    },

    _BindEvents: function(events) {
      if (events && this._eventObj) {
        // Unbinding previous Events
        if (this._parameters.bind) {
          var oldEvents = this._parameters.bind;
          for (var a in oldEvents)
            if (oldEvents.hasOwnProperty(a))
              // TODO: Remove jQuery dependency
              jQuery(this._eventObj).unbind(a, oldEvents[a]);
        }

        this._parameters.bind = events;
        for (var a in events)
          if (events.hasOwnProperty(a))
            // TODO: Remove jQuery dependency
            jQuery(this._eventObj).bind(a, events[a]);
      }
    },

    _Loader: (function() {
      if (IE)
        return function() {
          var width = this._img.width;
          var height = this._img.height;
          this._imgWidth = width;
          this._imgHeight = height;
          this._img.parentNode.removeChild(this._img);

          this._vimage = this.createVMLNode('image');
          this._vimage.src = this._img.src;
          this._vimage.style.height = height + "px";
          this._vimage.style.width = width + "px";
          this._vimage.style.position = "absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
          this._vimage.style.top = "0px";
          this._vimage.style.left = "0px";
          this._aspectW = this._aspectH = 1;

          /* Group minifying a small 1px precision problem when rotating object */
          this._container = this.createVMLNode('group');
          this._container.style.width = width;
          this._container.style.height = height;
          this._container.style.position = "absolute";
          this._container.style.top = "0px";
          this._container.style.left = "0px";
          this._container.setAttribute('coordsize', width - 1 + ',' + (height - 1)); // This -1, -1 trying to fix ugly problem with small displacement on IE
          this._container.appendChild(this._vimage);

          this._rootObj.appendChild(this._container);
          this._rootObj.style.position = "relative"; // FIXES IE PROBLEM
          this._rootObj.style.width = width + "px";
          this._rootObj.style.height = height + "px";
          this._rootObj.setAttribute('id', this._img.getAttribute('id'));
          this._rootObj.className = this._img.className;
          this._eventObj = this._rootObj;
          var parameters;
          while (parameters = this._onLoadDelegate.shift()) {
            this._handleRotation(parameters, true);
          }
        }
      else return function() {
        this._rootObj.setAttribute('id', this._img.getAttribute('id'));
        this._rootObj.className = this._img.className;

        this._imgWidth = this._img.naturalWidth;
        this._imgHeight = this._img.naturalHeight;
        var _widthMax = Math.sqrt((this._imgHeight) * (this._imgHeight) + (this._imgWidth) * (this._imgWidth));
        this._width = _widthMax * 3;
        this._height = _widthMax * 3;

        this._aspectW = this._img.offsetWidth / this._img.naturalWidth;
        this._aspectH = this._img.offsetHeight / this._img.naturalHeight;

        this._img.parentNode.removeChild(this._img);


        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute('width', this._width);
        this._canvas.style.position = "relative";
        this._canvas.style.left = -this._img.height * this._aspectW + "px";
        this._canvas.style.top = -this._img.width * this._aspectH + "px";
        this._canvas.Wilq32 = this._rootObj.Wilq32;

        this._rootObj.appendChild(this._canvas);
        this._rootObj.style.width = this._img.width * this._aspectW + "px";
        this._rootObj.style.height = this._img.height * this._aspectH + "px";
        this._eventObj = this._canvas;

        this._cnv = this._canvas.getContext('2d');
        var parameters;
        while (parameters = this._onLoadDelegate.shift()) {
          this._handleRotation(parameters, true);
        }
      }
    })(),

    _animateStart: function() {
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._animateStartTime = +new Date;
      this._animateStartAngle = this._angle;
      this._animate();
    },
    _animate: function() {
      var actualTime = +new Date;
      var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

      // TODO: Bug for animatedGif for static rotation ? (to test)
      if (checkEnd && !this._parameters.animatedGif) {
        clearTimeout(this._timer);
      } else {
        if (this._canvas || this._vimage || this._img) {
          var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
          this._rotate((~~(angle * 10)) / 10);
        }
        if (this._parameters.step) {
          this._parameters.step(this._angle);
        }
        var self = this;
        this._timer = setTimeout(function() {
          self._animate.call(self);
        }, 10);
      }

      // To fix Bug that prevents using recursive function in callback I moved this function to back
      if (this._parameters.callback && checkEnd) {
        this._angle = this._parameters.animateTo;
        this._rotate(this._angle);
        this._parameters.callback.call(this._rootObj);
      }
    },

    _rotate: (function() {
      var rad = Math.PI / 180;
      if (IE)
        return function(angle) {
          this._angle = angle;
          this._container.style.rotation = (angle % 360) + "deg";
          this._vimage.style.top = -(this._rotationCenterY - this._imgHeight / 2) + "px";
          this._vimage.style.left = -(this._rotationCenterX - this._imgWidth / 2) + "px";
          this._container.style.top = this._rotationCenterY - this._imgHeight / 2 + "px";
          this._container.style.left = this._rotationCenterX - this._imgWidth / 2 + "px";

        }
      else if (supportedCSS)
        return function(angle) {
          this._angle = angle;
          this._img.style[supportedCSS] = "rotate(" + (angle % 360) + "deg)";
          this._img.style[supportedCSSOrigin] = this._parameters.center.join(" ");
        }
      else
        return function(angle) {
          this._angle = angle;
          angle = (angle % 360) * rad;
          // clear canvas
          this._canvas.width = this._width; //+this._widthAdd;
          this._canvas.height = this._height; //+this._heightAdd;

          // REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
          this._cnv.translate(this._imgWidth * this._aspectW, this._imgHeight * this._aspectH); // at least center image on screen
          this._cnv.translate(this._rotationCenterX, this._rotationCenterY); // we move image back to its orginal
          this._cnv.rotate(angle); // rotate image
          this._cnv.translate(-this._rotationCenterX, -this._rotationCenterY); // move image to its center, so we can rotate around its center
          this._cnv.scale(this._aspectW, this._aspectH); // SCALE - if needed ;)
          this._cnv.drawImage(this._img, 0, 0); // First - we draw image
        }

    })()
  }

  if (IE) {
    Wilq32.PhotoEffect.prototype.createVMLNode = (function() {
      document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
      try {
        !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
        return function(tagName) {
          return document.createElement('<rvml:' + tagName + ' class="rvml">');
        };
      } catch (e) {
        return function(tagName) {
          return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
        };
      }
    })();
  }

})(jQuery);
