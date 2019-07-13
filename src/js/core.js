/**
 * Private static constants
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
  // Plugin default options
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
    minRatio: 0.05,

    // Max ratio of image when zoom in
    maxRatio: 16,

    // Toolbar options in header
    headToolbar: ['maximize', 'close'],

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
      minimize:
        '<svg viewBox="0 0 1024 1024" class="svg-inline-icon">\
                <path fill="currentColor" d="M1024 749.714v109.714c0 50.286\
                -41.143 91.429-91.429 91.429h-841.143c-50.286 0-91.429-41.143\
                -91.429-91.429v-109.714c0-50.286 41.143-91.429 91.429-91.429\
                h841.143c50.286 0 91.429 41.143 91.429 91.429z"></path>\
                </svg>',
      maximize:
        '<svg viewBox="0 0 1024 1024" class="svg-inline-icon">\
                <path fill="currentColor" d="M146.286 804.571h731.429v-438.857\
                h-731.429v438.857zM1024 164.571v694.857c0 50.286-41.143 91.429\
                -91.429 91.429h-841.143c-50.286 0-91.429-41.143-91.429-91.429v\
                -694.857c0-50.286 41.143-91.429 91.429-91.429h841.143c50.286 0 \
                91.429 41.143 91.429 91.429z"></path>\
                </svg>',
      close:
        '<svg viewBox="0 0 804.5714285714286 1024" class="svg-inline-icon">\
              <path fill="currentColor" d="M741.714 755.429c0 14.286-5.714 \
              28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16\
              s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16\
              -38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286\
              -16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286\
              -10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714\
              c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 \
              168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 \
              16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571\
              -16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"></path>\
              </svg>',
      zoomIn:
        '<svg viewBox="0 0 950.8571428571428 1024" class="svg-inline-icon">\
              <path fill="currentColor" d="M585.143 457.143v36.571c0 9.714-8.571 \
              18.286-18.286 18.286h-128v128c0 9.714-8.571 18.286-18.286 18.286\
              h-36.571c-9.714 0-18.286-8.571-18.286-18.286v-128h-128c-9.714 0\
              -18.286-8.571-18.286-18.286v-36.571c0-9.714 8.571-18.286 18.286\
              -18.286h128v-128c0-9.714 8.571-18.286 18.286-18.286h36.571c9.714 0 \
              18.286 8.571 18.286 18.286v128h128c9.714 0 18.286 8.571 18.286 \
              18.286zM658.286 475.429c0-141.143-114.857-256-256-256s-256 114.857\
              -256 256 114.857 256 256 256 256-114.857 256-256zM950.857 950.857\
              c0 40.571-32.571 73.143-73.143 73.143-19.429 0-38.286-8-51.429\
              -21.714l-196-195.429c-66.857 46.286-146.857 70.857-228 70.857\
              -222.286 0-402.286-180-402.286-402.286s180-402.286 402.286-402.286 \
              402.286 180 402.286 402.286c0 81.143-24.571 161.143-70.857 228\
              l196 196c13.143 13.143 21.143 32 21.143 51.429z"></path>\
              </svg>',
      zoomOut:
        '<svg viewBox="0 0 950.8571428571428 1024" class="svg-inline-icon">\
              <path fill="currentColor" d="M585.143 457.143v36.571c0 9.714-8.571 \
              18.286-18.286 18.286h-329.143c-9.714 0-18.286-8.571-18.286-18.286\
              v-36.571c0-9.714 8.571-18.286 18.286-18.286h329.143c9.714 0 18.286 \
              8.571 18.286 18.286zM658.286 475.429c0-141.143-114.857-256-256-256\
              s-256 114.857-256 256 114.857 256 256 256 256-114.857 256-256z\
              M950.857 950.857c0 40.571-32.571 73.143-73.143 73.143-19.429 0\
              -38.286-8-51.429-21.714l-196-195.429c-66.857 46.286-146.857 70.857\
              -228 70.857-222.286 0-402.286-180-402.286-402.286s180-402.286 \
              402.286-402.286 402.286 180 402.286 402.286c0 81.143-24.571 161.143\
              -70.857 228l196 196c13.143 13.143 21.143 32 21.143 51.429z"></path>\
              </svg>',
      prev:
        '<svg viewBox="0 0 914.2857142857142 1024" class="svg-inline-icon">\
            <path fill="currentColor" d="M877.714 512v73.143c0 38.857-25.714 \
            73.143-66.857 73.143h-402.286l167.429 168c13.714 13.143 21.714 32 \
            21.714 51.429s-8 38.286-21.714 51.429l-42.857 43.429c-13.143 13.143\
            -32 21.143-51.429 21.143s-38.286-8-52-21.143l-372-372.571c-13.143\
            -13.143-21.143-32-21.143-51.429s8-38.286 21.143-52l372-371.429c13.714\
            -13.714 32.571-21.714 52-21.714s37.714 8 51.429 21.714l42.857 42.286\
            c13.714 13.714 21.714 32.571 21.714 52s-8 38.286-21.714 52l-167.429 \
            167.429h402.286c41.143 0 66.857 34.286 66.857 73.143z"></path>\
            </svg>',
      next:
        '<svg viewBox="0 0 841.1428571428571 1024" class="svg-inline-icon">\
            <path fill="currentColor" d="M841.143 548.571c0 19.429-7.429 38.286\
            -21.143 52l-372 372c-13.714 13.143-32.571 21.143-52 21.143s-37.714\
            -8-51.429-21.143l-42.857-42.857c-13.714-13.714-21.714-32.571-21.714\
            -52s8-38.286 21.714-52l167.429-167.429h-402.286c-41.143 0-66.857\
            -34.286-66.857-73.143v-73.143c0-38.857 25.714-73.143 66.857-73.143\
            h402.286l-167.429-168c-13.714-13.143-21.714-32-21.714-51.429s8\
            -38.286 21.714-51.429l42.857-42.857c13.714-13.714 32-21.714 51.429\
            -21.714s38.286 8 52 21.714l372 372c13.714 13.143 21.143 32 21.143 \
            51.429z"></path>\
            </svg>',
      fullscreen:
        '<svg viewBox="0 0 1097.142857142857 1024" class="svg-inline-icon">\
                  <path fill="currentColor" d="M365.714 329.143c0 60.571-49.143 \
                  109.714-109.714 109.714s-109.714-49.143-109.714-109.714 49.143\
                  -109.714 109.714-109.714 109.714 49.143 109.714 109.714z\
                  M950.857 548.571v256h-804.571v-109.714l182.857-182.857 91.429 \
                  91.429 292.571-292.571zM1005.714 146.286h-914.286c-9.714 0\
                  -18.286 8.571-18.286 18.286v694.857c0 9.714 8.571 18.286 \
                  18.286 18.286h914.286c9.714 0 18.286-8.571 18.286-18.286\
                  v-694.857c0-9.714-8.571-18.286-18.286-18.286zM1097.143 164.571\
                  v694.857c0 50.286-41.143 91.429-91.429 91.429h-914.286c-50.286 \
                  0-91.429-41.143-91.429-91.429v-694.857c0-50.286 41.143-91.429 \
                  91.429-91.429h914.286c50.286 0 91.429 41.143 91.429 91.429z"></path>\
                  </svg>',
      actualSize:
        '<svg viewBox="0 0 877.7142857142857 1024" class="svg-inline-icon">\
                  <path fill="currentColor" d="M733.143 309.143l-202.857 202.857 \
                  202.857 202.857 82.286-82.286c10.286-10.857 26.286-13.714 40-8 \
                  13.143 5.714 22.286 18.857 22.286 33.714v256c0 20-16.571 36.571\
                  -36.571 36.571h-256c-14.857 0-28-9.143-33.714-22.857-5.714\
                  -13.143-2.857-29.143 8-39.429l82.286-82.286-202.857-202.857\
                  -202.857 202.857 82.286 82.286c10.857 10.286 13.714 26.286 8 \
                  39.429-5.714 13.714-18.857 22.857-33.714 22.857h-256c-20 0\
                  -36.571-16.571-36.571-36.571v-256c0-14.857 9.143-28 22.857\
                  -33.714 13.143-5.714 29.143-2.857 39.429 8l82.286 82.286 \
                  202.857-202.857-202.857-202.857-82.286 82.286c-6.857 6.857\
                  -16 10.857-25.714 10.857-4.571 0-9.714-1.143-13.714-2.857\
                  -13.714-5.714-22.857-18.857-22.857-33.714v-256c0-20 16.571\
                  -36.571 36.571-36.571h256c14.857 0 28 9.143 33.714 22.857 \
                  5.714 13.143 2.857 29.143-8 39.429l-82.286 82.286 202.857 \
                  202.857 202.857-202.857-82.286-82.286c-10.857-10.286-13.714\
                  -26.286-8-39.429 5.714-13.714 18.857-22.857 33.714-22.857h256\
                  c20 0 36.571 16.571 36.571 36.571v256c0 14.857-9.143 28-22.286 \
                  33.714-4.571 1.714-9.714 2.857-14.286 2.857-9.714 0-18.857-4\
                  -25.714-10.857z"></path>\
                  </svg>',
      rotateLeft:
        '<svg viewBox="0 0 877.7142857142857 1024" class="svg-inline-icon">\
                  <path fill="currentColor" d="M877.714 512c0 241.714-197.143 \
                  438.857-438.857 438.857-130.857 0-254.286-57.714-337.714-158.286\
                  -5.714-7.429-5.143-18.286 1.143-24.571l78.286-78.857c4-3.429 \
                  9.143-5.143 14.286-5.143 5.143 0.571 10.286 2.857 13.143 6.857 \
                  56 72.571 140 113.714 230.857 113.714 161.143 0 292.571-131.429 \
                  292.571-292.571s-131.429-292.571-292.571-292.571c-74.857 0\
                  -145.714 28.571-198.857 78.286l78.286 78.857c10.857 10.286 \
                  13.714 26.286 8 39.429-5.714 13.714-18.857 22.857-33.714 22.857\
                  h-256c-20 0-36.571-16.571-36.571-36.571v-256c0-14.857 9.143-28 \
                  22.857-33.714 13.143-5.714 29.143-2.857 39.429 8l74.286 73.714\
                  c80.571-76 189.714-121.143 302.286-121.143 241.714 0 438.857 \
                  197.143 438.857 438.857z"></path>\
                  </svg>',
      rotateRight:
        '<svg viewBox="0 0 877.7142857142857 1024" class="svg-inline-icon">\
                    <path fill="currentColor" d="M877.714 146.286v256c0 20-16.571 \
                    36.571-36.571 36.571h-256c-14.857 0-28-9.143-33.714-22.857\
                    -5.714-13.143-2.857-29.143 8-39.429l78.857-78.857c-53.714\
                    -49.714-124.571-78.286-199.429-78.286-161.143 0-292.571 \
                    131.429-292.571 292.571s131.429 292.571 292.571 292.571\
                    c90.857 0 174.857-41.143 230.857-113.714 2.857-4 8-6.286 \
                    13.143-6.857 5.143 0 10.286 1.714 14.286 5.143l78.286 78.857\
                    c6.857 6.286 6.857 17.143 1.143 24.571-83.429 100.571-206.857 \
                    158.286-337.714 158.286-241.714 0-438.857-197.143-438.857\
                    -438.857s197.143-438.857 438.857-438.857c112.571 0 221.714 \
                    45.143 302.286 121.143l74.286-73.714c10.286-10.857 26.286\
                    -13.714 40-8 13.143 5.714 22.286 18.857 22.286 33.714z"></path>\
                    </svg>'
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
    },

    // Load the image progressively
    progressiveLoading: true
  },
  PUBLIC_VARS = {
    // Image moving flag
    isMoving: false,
    // Modal resizing flag
    isResizing: false,
    // Modal z-index setting
    zIndex: DEFAULTS.zIndex
  };

// jQuery element of calling plugin
var jqEl = null;

/**
 * Magnify Class
 */
var Magnify = function(el, options) {
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

  // if modal do resize
  this.isDoResize = false;

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
};

/**
 * Mangify Prototype
 */
Magnify.prototype = {
  init: function(el, opts) {
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

    // Draggable & Movable & Resizable
    if (opts.draggable) {
      this.draggable(this.$magnify, this.dragHandle, '.magnify-button');
    }
    if (opts.movable) {
      this.movable(this.$stage, isIE8() ? '.magnify-image' : this.$image);
    }
    if (opts.resizable) {
      this.resizable(
        this.$magnify,
        this.$stage,
        isIE8() ? '.magnify-image' : this.$image,
        opts.modalWidth,
        opts.modalHeight
      );
    }
  },
  _createBtns: function(toolbar, btns) {
    var btnsStr = '';

    $.each(toolbar, function(index, item) {
      btnsStr += btns[item];
    });

    return btnsStr;
  },
  _createTitle: function() {
    return this.options.title ? '<div class="magnify-title"></div>' : '';
  },
  render: function() {
    var btnsTpl = {
      minimize:
        '<button class="magnify-button magnify-button-minimize" title="' +
        this.options.i18n.minimize +
        '">' +
        this.options.icons.minimize +
        '</button>',
      maximize:
        '<button class="magnify-button magnify-button-maximize" title="' +
        this.options.i18n.maximize +
        '">' +
        this.options.icons.maximize +
        '</button>',
      close:
        '<button class="magnify-button magnify-button-close" title="' +
        this.options.i18n.close +
        '">' +
        this.options.icons.close +
        '</button>',
      zoomIn:
        '<button class="magnify-button magnify-button-zoom-in" title="' +
        this.options.i18n.zoomIn +
        '">' +
        this.options.icons.zoomIn +
        '</button>',
      zoomOut:
        '<button class="magnify-button magnify-button-zoom-out" title="' +
        this.options.i18n.zoomOut +
        '">' +
        this.options.icons.zoomOut +
        '</button>',
      prev:
        '<button class="magnify-button magnify-button-prev" title="' +
        this.options.i18n.prev +
        '">' +
        this.options.icons.prev +
        '</button>',
      next:
        '<button class="magnify-button magnify-button-next" title="' +
        this.options.i18n.next +
        '">' +
        this.options.icons.next +
        '</button>',
      fullscreen:
        '<button class="magnify-button magnify-button-fullscreen" title="' +
        this.options.i18n.fullscreen +
        '">' +
        this.options.icons.fullscreen +
        '</button>',
      actualSize:
        '<button class="magnify-button magnify-button-actual-size" title="' +
        this.options.i18n.actualSize +
        '">' +
        this.options.icons.actualSize +
        '</button>',
      rotateLeft:
        '<button class="magnify-button magnify-button-rotate-left" title="' +
        this.options.i18n.rotateLeft +
        '">' +
        this.options.icons.rotateLeft +
        '</button>',
      rotateRight:
        '<button class="magnify-button magnify-button-rotate-right" title="' +
        this.options.i18n.rotateRight +
        '">' +
        this.options.icons.rotateRight +
        '</button>'
    };

    // Magnify base HTML
    var magnifyHTML =
      '<div class="magnify-modal">\
        <div class="magnify-header">\
          <div class="magnify-toolbar magnify-head-toolbar">' +
      this._createBtns(this.options.headToolbar, btnsTpl) +
      '\
          </div>' +
      this._createTitle() +
      '\
        </div>\
        <div class="magnify-stage">\
          <img class="magnify-image" src="" alt="" />\
        </div>\
        <div class="magnify-footer">\
          <div class="magnify-toolbar magnify-foot-toolbar">' +
      this._createBtns(this.options.footToolbar, btnsTpl) +
      '\
          </div>\
        </div>\
      </div>';

    return magnifyHTML;
  },
  build: function() {
    // Create magnify HTML string
    var magnifyHTML = this.render();

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
    if (
      !this.options.dragHandle ||
      this.options.dragHandle === '.magnify-modal'
    ) {
      this.dragHandle = this.$magnify;
    } else {
      this.dragHandle = this.$magnify.find(this.options.dragHandle);
    }
  },
  open: function() {
    if (!this.options.multiInstances) {
      $('.magnify-modal')
        .eq(0)
        .remove();
    }

    // Fixed modal position bug
    if (!$('.magnify-modal').length && this.options.fixedContent) {
      $('html').css({ overflow: 'hidden' });

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
  close: function(el) {
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
      $('html').css({ overflow: '', 'padding-right': '' });
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
  setModalPos: function(modal) {
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
  setModalSize: function(img) {
    var self = this,
      winWidth = $W.width(),
      winHeight = $W.height(),
      scrollLeft = $D.scrollLeft(),
      scrollTop = $D.scrollTop();

    // Stage css value
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
    var modalWidth =
        img.width +
        parseFloat(stageCSS.left) +
        parseFloat(stageCSS.right) +
        parseFloat(stageCSS.borderLeft) +
        parseFloat(stageCSS.borderRight),
      modalHeight =
        img.height +
        parseFloat(stageCSS.top) +
        parseFloat(stageCSS.bottom) +
        parseFloat(stageCSS.borderTop) +
        parseFloat(stageCSS.borderBottom);

    var gapThreshold =
        (this.options.gapThreshold > 0 ? this.options.gapThreshold : 0) + 1,
      // Modal scale to window
      scale = Math.min(
        winWidth / (modalWidth * gapThreshold),
        winHeight / (modalHeight * gapThreshold),
        1
      );

    var minWidth = Math.max(modalWidth * scale, this.options.modalWidth),
      minHeight = Math.max(modalHeight * scale, this.options.modalHeight);

    minWidth = this.options.fixedModalSize
      ? this.options.modalWidth
      : Math.round(minWidth);
    minHeight = this.options.fixedModalSize
      ? this.options.modalHeight
      : Math.round(minHeight);

    var modalCSSObj = {
      width: minWidth + 'px',
      height: minHeight + 'px',
      left: (winWidth - minWidth) / 2 + scrollLeft + 'px',
      top: (winHeight - minHeight) / 2 + scrollTop + 'px'
    };

    // Add modal init animation
    if (this.options.initAnimation) {
      this.$magnify.animate(modalCSSObj, function() {
        self.setImageSize(img);
      });
    } else {
      this.$magnify.css(modalCSSObj);
      this.setImageSize(img);
    }

    this.isOpened = true;
  },
  getImageScaleToStage: function(stageWidth, stageHeight) {
    var scale = 1;

    if (!this.isRotated) {
      scale = Math.min(
        stageWidth / this.img.width,
        stageHeight / this.img.height,
        1
      );
    } else {
      scale = Math.min(
        stageWidth / this.img.height,
        stageHeight / this.img.width,
        1
      );
    }

    return scale;
  },
  setImageSize: function(img) {
    var $image = isIE8() ? this.$stage.find('.magnify-image') : this.$image;

    var stageData = {
      w: this.$stage.width(),
      h: this.$stage.height()
    };

    var scale = this.getImageScaleToStage(stageData.w, stageData.h);

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
      initWidth: img.width * scale,
      initHeight: img.height * scale,
      initLeft: (stageData.w - img.width * scale) / 2,
      initTop: (stageData.h - img.height * scale) / 2,
      width: img.width * scale,
      height: img.height * scale,
      left: (stageData.w - img.width * scale) / 2,
      top: (stageData.h - img.height * scale) / 2
    });

    // Set grab cursor
    setGrabCursor(
      { w: $image.width(), h: $image.height() },
      { w: this.$stage.width(), h: this.$stage.height() },
      this.$stage,
      this.isRotated
    );

    // Just execute before image loaded
    if (!this.imgLoaded) {
      // loader end
      this.$magnify.find('.magnify-loader').remove();

      // Remove class must when image setting end
      this.$stage.removeClass('stage-ready');
      this.$image.removeClass('image-ready');

      // Add image init animation
      if (this.options.initAnimation && !this.options.progressiveLoading) {
        $image.fadeIn();
      }

      this.imgLoaded = true;
    }
  },
  loadImg: function(imgSrc, fn, err) {
    var self = this;

    // Reset image
    this.$image.removeAttr('style').attr('src', '');
    this.isRotated = false;
    this.rotateAngle = 0;

    this.imgLoaded = false;

    // Loader start
    this.$magnify.append('<div class="magnify-loader"></div>');

    // Add class before image loaded
    this.$stage.addClass('stage-ready');
    this.$image.addClass('image-ready');

    if (this.options.initAnimation && !this.options.progressiveLoading) {
      this.$image.hide();
    }

    if (isIE8()) {
      this.$stage.html(
        '<img class="magnify-image" id="magnify-image" src="' +
          imgSrc +
          '" alt="" />'
      );
    } else {
      this.$image.attr('src', imgSrc);
    }

    preloadImg(
      imgSrc,
      function(img) {
        // Store HTMLImageElement
        self.img = img;

        // Store original data
        self.imageData = {
          originalWidth: img.width,
          originalHeight: img.height
        };

        if (self.isMaximized || (self.isOpened && self.options.fixedModalPos)) {
          self.setImageSize(img);
        } else {
          self.setModalSize(img);
        }

        // Callback of image loaded successfully
        if (fn) {
          fn.call();
        }
      },
      function() {
        // Loader end
        self.$magnify.find('.magnify-loader').remove();

        // Callback of image loading failed
        if (err) {
          err.call();
        }
      }
    );

    if (this.options.title) {
      this.setImgTitle(imgSrc);
    }
  },
  getImgGroup: function(list, imgSrc) {
    var self = this;

    self.groupData = [];

    $(list).each(function(index, item) {
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
  setImgTitle: function(url) {
    var index = this.groupIndex,
      caption = this.groupData[index].caption,
      caption = caption ? caption : getImageNameFromUrl(url);

    this.$title.html(caption);
  },
  jump: function(step) {
    this._triggerHook('beforeChange', this.groupIndex);

    this.groupIndex = this.groupIndex + step;

    this.jumpTo(this.groupIndex);
  },
  jumpTo: function(index) {
    var self = this;

    index = index % this.groupData.length;

    if (index >= 0) {
      index = index % this.groupData.length;
    } else if (index < 0) {
      index = (this.groupData.length + index) % this.groupData.length;
    }

    this.groupIndex = index;

    this.loadImg(
      this.groupData[index].src,
      function() {
        self._triggerHook('changed', index);
      },
      function() {
        self._triggerHook('changed', index);
      }
    );
  },
  wheel: function(e) {
    e.preventDefault();

    var delta = 1;

    if (e.originalEvent.deltaY) {
      delta = e.originalEvent.deltaY > 0 ? 1 : -1;
    } else if (e.originalEvent.wheelDelta) {
      delta = -e.originalEvent.wheelDelta / 120;
    } else if (e.originalEvent.detail) {
      delta = e.originalEvent.detail > 0 ? 1 : -1;
    }

    // Ratio threshold
    var ratio = -delta * this.options.ratioThreshold;

    // Mouse point position relative to stage
    var pointer = {
      x: e.originalEvent.clientX - this.$stage.offset().left + $D.scrollLeft(),
      y: e.originalEvent.clientY - this.$stage.offset().top + $D.scrollTop()
    };

    this.zoom(ratio, pointer, e);
  },
  zoom: function(ratio, origin, e) {
    this.$image = isIE8() ? this.$stage.find('.magnify-image') : this.$image;

    // Zoom out ratio & Zoom in ratio
    ratio = ratio < 0 ? 1 / (1 - ratio) : 1 + ratio;

    // Image ratio
    ratio = (this.$image.width() / this.imageData.originalWidth) * ratio;

    // Fixed digital error
    // if (ratio > 0.95 && ratio < 1.05) {
    //   ratio = 1;
    // }

    if (ratio > this.options.maxRatio || ratio < this.options.minRatio) {
      return;
    }

    this.zoomTo(ratio, origin, e);
  },
  zoomTo: function(ratio, origin, e) {
    var $image = isIE8() ? this.$stage.find('.magnify-image') : this.$image,
      $stage = this.$stage,
      imgData = {
        w: this.imageData.width,
        h: this.imageData.height,
        x: this.imageData.left,
        y: this.imageData.top
      };

    // Image stage position
    // We will use it to calc the relative position of image
    var stageData = {
      w: $stage.width(),
      h: $stage.height(),
      x: $stage.offset().left,
      y: $stage.offset().top
    };

    var newWidth = this.imageData.originalWidth * ratio,
      newHeight = this.imageData.originalHeight * ratio,
      // Think about it for a while
      newLeft = origin.x - ((origin.x - imgData.x) / imgData.w) * newWidth,
      newTop = origin.y - ((origin.y - imgData.y) / imgData.h) * newHeight;

    // δ is the difference between image new width and new height
    var δ = !this.isRotated ? 0 : (newWidth - newHeight) / 2,
      imgNewWidth = !this.isRotated ? newWidth : newHeight,
      imgNewHeight = !this.isRotated ? newHeight : newWidth;

    var offsetX = stageData.w - newWidth,
      offsetY = stageData.h - newHeight;

    // Zoom out & Zoom in condition
    // It's important and it takes me a lot of time to get it
    // The conditions with image rotate 90 degree drive me crazy alomst!
    if (imgNewHeight <= stageData.h) {
      newTop = (stageData.h - newHeight) / 2;
    } else {
      newTop = newTop > δ ? δ : newTop > offsetY - δ ? newTop : offsetY - δ;
    }

    if (imgNewWidth <= stageData.w) {
      newLeft = (stageData.w - newWidth) / 2;
    } else {
      newLeft =
        newLeft > -δ ? -δ : newLeft > offsetX + δ ? newLeft : offsetX + δ;
    }

    // If the image scale get to the critical point
    if (
      Math.abs(this.imageData.initWidth - newWidth) <
      this.imageData.initWidth * 0.05
    ) {
      this.setImageSize(this.img);
    } else {
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

      // Set grab cursor
      setGrabCursor(
        { w: Math.round(imgNewWidth), h: Math.round(imgNewHeight) },
        { w: stageData.w, h: stageData.h },
        this.$stage
      );
    }

    // Update image initial data
    $.extend(this.imageData, {
      width: newWidth,
      height: newHeight,
      left: newLeft,
      top: newTop
    });
  },
  rotate: function(angle) {
    this.rotateAngle = this.rotateAngle + angle;

    if ((this.rotateAngle / 90) % 2 === 0) {
      this.isRotated = false;
    } else {
      this.isRotated = true;
    }

    this.rotateTo(this.rotateAngle);
  },
  rotateTo: function(angle) {
    var self = this,
      $image = isIE8() ? this.$stage.find('.magnify-image') : this.$image;

    // Depend on jQueryRotate.js
    $image.rotate({
      angle: angle
    });

    this.setImageSize({
      width: this.imageData.originalWidth,
      height: this.imageData.originalHeight
    });

    // Remove grab cursor when rotate
    this.$stage.removeClass('is-grab');
  },
  resize: function() {
    var self = this;

    var resizeHandler = throttle(function() {
      if (self.isOpened) {
        if (self.isMaximized) {
          self.setImageSize({
            width: self.imageData.originalWidth,
            height: self.imageData.originalHeight
          });
        } else {
          self.setModalSize({
            width: self.imageData.originalWidth,
            height: self.imageData.originalHeight
          });
        }
      }
    }, 500);

    return resizeHandler;
  },
  maximize: function() {
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
        width: this.modalData.width
          ? this.modalData.width
          : this.options.modalWidth,
        height: this.modalData.height
          ? this.modalData.height
          : this.options.modalHeight,
        left: this.modalData.left
          ? this.modalData.left
          : ($W.width() - this.options.modalWidth) / 2 + $D.scrollLeft(),
        top: this.modalData.top
          ? this.modalData.top
          : ($W.height() - this.options.modalHeight) / 2 + $D.scrollTop()
      });

      this.isMaximized = false;
    }

    this.setImageSize({
      width: this.imageData.originalWidth,
      height: this.imageData.originalHeight
    });
  },
  fullscreen: function() {
    requestFullscreen(this.$magnify[0]);
  },
  keydown: function(e) {
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
        self.zoom(
          self.options.ratioThreshold * 3,
          { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
          e
        );
        break;
      // -
      case 189:
        self.zoom(
          -self.options.ratioThreshold * 3,
          { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
          e
        );
        break;
      // + Firefox
      case 61:
        self.zoom(
          self.options.ratioThreshold * 3,
          { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
          e
        );
        break;
      // - Firefox
      case 173:
        self.zoom(
          -self.options.ratioThreshold * 3,
          { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
          e
        );
        break;
      // Ctrl + Alt + 0
      case 48:
        if (ctrlKey && altKey) {
          self.zoomTo(
            1,
            { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
            e
          );
        }
        break;
      // Ctrl + ,
      case 188:
        if (ctrlKey) {
          self.rotate(-90);
        }
        break;
      // Ctrl + .
      case 190:
        if (ctrlKey) {
          self.rotate(90);
        }
        break;
      // Q
      case 81:
        this.close();
        break;
      default:
    }
  },
  addEvents: function() {
    var self = this;

    this.$close
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function(e) {
        self.close();
      });

    this.$stage
      .off(WHEEL_EVENT + EVENT_NS)
      .on(WHEEL_EVENT + EVENT_NS, function(e) {
        self.wheel(e);
      });

    this.$zoomIn
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function(e) {
        self.zoom(
          self.options.ratioThreshold * 3,
          { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
          e
        );
      });

    this.$zoomOut
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function(e) {
        self.zoom(
          -self.options.ratioThreshold * 3,
          { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
          e
        );
      });

    this.$actualSize
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function(e) {
        self.zoomTo(
          1,
          { x: self.$stage.width() / 2, y: self.$stage.height() / 2 },
          e
        );
      });

    this.$prev
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function() {
        self.jump(-1);
      });

    this.$fullscreen
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function() {
        self.fullscreen();
      });

    this.$next
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function() {
        self.jump(1);
      });

    this.$rotateLeft
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function() {
        self.rotate(-90);
      });

    this.$rotateRight
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function() {
        self.rotate(90);
      });

    this.$maximize
      .off(CLICK_EVENT + EVENT_NS)
      .on(CLICK_EVENT + EVENT_NS, function() {
        self.maximize();
      });

    $D.off(KEYDOWN_EVENT + EVENT_NS).on(KEYDOWN_EVENT + EVENT_NS, function(e) {
      self.keydown(e);
    });

    $W.on(RESIZE_EVENT + EVENT_NS, self.resize());
  },
  _triggerHook: function(e, data) {
    if (this.options.callbacks[e]) {
      this.options.callbacks[e].apply(this, $.isArray(data) ? data : [data]);
    }
  }
};

/**
 * jQuery plugin
 */

$.fn.magnify = function(options) {
  jqEl = $(this);

  // Convert a numeric string into a number
  for (var key in options) {
    if (typeof options[key] === 'string' && !isNaN(options[key])) {
      options[key] = parseFloat(options[key]);
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
      jqEl.off('click' + EVENT_NS).on('click' + EVENT_NS, function(e) {
        e.preventDefault();
        // This will stop triggering data-api event
        e.stopPropagation();
      });
    }

    jqEl
      .off(opts.initEvent + EVENT_NS)
      .on(opts.initEvent + EVENT_NS, function(e) {
        e.preventDefault();
        // This will stop triggering data-api event
        e.stopPropagation();

        $(this).data('magnify', new Magnify(this, options));
      });
  }

  return jqEl;
};

/**
 * MAGNIFY DATA-API
 */
$D.on(CLICK_EVENT + EVENT_NS, '[data-magnify]', function(e) {
  jqEl = $('[data-magnify]');

  e.preventDefault();

  $(this).data('magnify', new Magnify(this, DEFAULTS));
});
