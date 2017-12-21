/**
 * Private vars
 */

var $W = $(window),
    $D = $(document),

    // plugin default options
    defaults = {
        draggable: true,
        resizable: true,
        movable: true,
        keyboard: true,
        title: true,
        modalWidth: 320,
        modalHeight: 320,
        fixedModalSize: false,
        initMaximized: false,
        gapThreshold: 0.02,
        ratioThreshold: 0.1,
        minRatio: 0.1,
        maxRatio: 16,
        toolbar: ['zoomIn', 'zoomOut', 'prev', 'fullscreen', 'next', 'actualSize', 'rotateRight'],
        icons: {
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
        lang: 'en',
        i18n: {},
        // beforeOpen:$.noop,
        // afterOpen:$.noop,
        // beforeClose:$.noop,
        // afterClose:$.noop
    },

    // jquery element of calling plugin
    jqEl = null,

    // image rotate angle
    rotateAngle = 0,

    // image moving flag
    isMoving = false,

    // modal resizing flag
    isResizing = false;

/**
 * Magnify Class
 */
var Magnify = function (el, options) {

    var self = this;

    this.options = $.extend(true, {}, defaults, options);

    if ($.isArray(options.toolbar)) {
        this.options.toolbar = options.toolbar;
    }

    this.init(el, self.options);

    this.isOpened = false;
    this.isMaximized = false;
    this.isRotated = false;
    this.rotateAngle = 0;

    // Store image data in every instance
    // this.imageData = {};

}


/**
 * Mangify prototype
 */
Magnify.prototype = {

    init: function (el, options) {

        var self = this;

        // Bind thumbnails click event
        $(el).on('click', function (e) {

            e.preventDefault();
            e.stopPropagation();

            self.open();
            self.resize();

            // Get image src
            var imgSrc = self.getImgSrc(this);

            // Get image group
            self.groupName = null;

            var currentGroupName = $(this).attr('data-group'),
                groupList = $D.find('[data-group="' + currentGroupName + '"]');

            if (currentGroupName !== self.groupName) {
                self.groupName = currentGroupName;
                self.getImgGroup(groupList, imgSrc);
            } else {
                self.getImgGroup(jqEl.not('[data-group]'), imgSrc);
            }

            self.loadImg(imgSrc);

        });

    },
    creatBtns: function (btns) {

        var footerBtnsStr = '';

        $.each(this.options.toolbar, function (index, item) {
            footerBtnsStr += btns[item];
        });

        return footerBtnsStr;

    },
    creatDOM: function () {

        var btnsTpl = {
            maximize: '<button class="magnify-button magnify-button-maximize" title="maximize">\
                            <i class="' + this.options.icons.maximize + '" aria-hidden="true"></i>\
                        </button>',
            close: '<button class="magnify-button magnify-button-close" title="close">\
                            <i class="' + this.options.icons.close + '" aria-hidden="true"></i>\
                        </button>',
            zoomIn: '<button class="magnify-button magnify-button-zoom-in" title="zoom-in">\
                            <i class="' + this.options.icons.zoomIn + '" aria-hidden="true"></i>\
                        </button>',
            zoomOut: '<button class="magnify-button magnify-button-zoom-out" title="zoom-out">\
                            <i class="' + this.options.icons.zoomOut + '" aria-hidden="true"></i>\
                        </button>',
            prev: '<button class="magnify-button magnify-button-prev" title="prev">\
                            <i class="' + this.options.icons.prev + '" aria-hidden="true"></i>\
                        </button>',
            next: '<button class="magnify-button magnify-button-next" title="next">\
                            <i class="' + this.options.icons.next + '" aria-hidden="true"></i>\
                        </button>',
            fullscreen: '<button class="magnify-button magnify-button-fullscreen" title="fullscreen">\
                            <i class="' + this.options.icons.fullscreen + '" aria-hidden="true"></i>\
                        </button>',
            actualSize: '<button class="magnify-button magnify-button-actual-size" title="actual-size">\
                            <i class="' + this.options.icons.actualSize + '" aria-hidden="true"></i>\
                        </button>',
            rotateLeft: '<button class="magnify-button magnify-button-rotate-right" title="rotate-right">\
                            <i class="' + this.options.icons.rotateLeft + '" aria-hidden="true"></i>\
                        </button>',
            rotateRight: '<button class="magnify-button magnify-button-rotate-right" title="rotate-right">\
                            <i class="' + this.options.icons.rotateRight + '" aria-hidden="true"></i>\
                        </button>'
        }

        // magnify base HTML
        var magnifyHTML = '<div class="magnify-modal">\
                                <div class="magnify-header">\
                                    <div class="magnify-title"></div>\
                                    <div class="magnify-toolbar">' + btnsTpl.maximize + btnsTpl.close + '</div>\
                                </div>\
                                <div class="magnify-stage">\
                                    <img src="" alt="" title="">\
                                </div>\
                                <div class="magnify-footer">\
                                    <div class="magnify-toolbar">' + this.creatBtns(btnsTpl) + '</div>\
                                </div>\
                            </div>';

        return magnifyHTML;

    },
    open: function () {

        this.build();

        this.addEvent();

        this.isOpened = true;

    },
    build: function () {

        // Create magnify HTML string
        var magnifyHTML = this.creatDOM();

        // Make magnify HTML string to jQuery element
        var $magnify = $(magnifyHTML);

        // Get all magnify element
        this.$magnify = $magnify;
        this.$stage = $magnify.find('.magnify-stage');
        this.$title = $magnify.find('.magnify-title');
        this.$image = $magnify.find('.magnify-stage img');
        this.$close = $magnify.find('.magnify-button-close');
        this.$maximize = $magnify.find('.magnify-button-maximize');
        this.$zoomIn = $magnify.find('.magnify-button-zoom-in');
        this.$zoomOut = $magnify.find('.magnify-button-zoom-out');
        this.$actualSize = $magnify.find('.magnify-button-actual-size');
        this.$rotate = $magnify.find('.magnify-button-rotate-right');
        this.$fullscreen = $magnify.find('.magnify-button-fullscreen');
        this.$prev = $magnify.find('.magnify-button-prev');
        this.$next = $magnify.find('.magnify-button-next');

        $('body').append($magnify);

        this.setModalPos($magnify);

        // draggable & movable & resizable
        if (this.options.draggable) {
            this.draggable($magnify);
        }
        if (this.options.movable) {
            this.movable(this.$image, this.$stage);
        }
        if (this.options.resizable) {
            this.resizable($magnify, this.$stage, this.$image, this.options.modalWidth, this.options.modalHeight);
        }

    },
    close: function (el) {
        // off events

        // Remove instance
        this.$magnify.remove();

        this.isMaximized = false;
        this.isRotated = false;

        this.rotateAngle = rotateAngle = 0;

        this.isOpened = false;

    },
    setModalPos: function (modal) {

        var winWidth = $W.width(),
            winHeight = $W.height();

        var modalWidth = modal.width(),
            modalHeight = modal.height();

        // Make the modal in windows center
        modal.css({
            left: (winWidth - modalWidth) / 2 + 'px',
            top: (winHeight - modalHeight) / 2 + 'px'
        });

    },
    setModalSize: function (img) {

        var winWidth = $W.width(),
            winHeight = $W.height();

        // stage css value
        var stageCSS = {
            left: this.$stage.css('left'),
            right: this.$stage.css('right'),
            top: this.$stage.css('top'),
            bottom: this.$stage.css('bottom'),
            borderLeft: this.$stage.css('border-left-width'),
            borderRight: this.$stage.css('border-right-width'),
            borderTop: this.$stage.css('border-top-width'),
            borderBottom: this.$stage.css('border-bottom-width'),
        };

        // modal size should calc with stage css value
        var modalWidth = img.width + getNumFromCSSValue(stageCSS.left) + getNumFromCSSValue(stageCSS.right) +
            getNumFromCSSValue(stageCSS.borderLeft) + getNumFromCSSValue(stageCSS.borderRight),
            modalHeight = img.height + getNumFromCSSValue(stageCSS.top) + getNumFromCSSValue(stageCSS.bottom) +
                getNumFromCSSValue(stageCSS.borderTop) + getNumFromCSSValue(stageCSS.borderBottom);

        var gapThreshold = (this.options.gapThreshold > 0 ? this.options.gapThreshold : 0) + 1,
            // modal scale to window
            scale = Math.min(winWidth / (modalWidth * gapThreshold), winHeight / (modalHeight * gapThreshold), 1);

        var minWidth = Math.max(modalWidth * scale, this.options.modalWidth),
            minHeight = Math.max(modalHeight * scale, this.options.modalHeight);

        minWidth = this.options.fixedModalSize ? this.options.modalWidth : Math.ceil(minWidth);
        minHeight = this.options.fixedModalSize ? this.options.modalHeight : Math.ceil(minHeight);

        this.$magnify.css({
            width: minWidth + 'px',
            height: minHeight + 'px',
            left: (winWidth - minWidth) / 2 + 'px',
            top: (winHeight - minHeight) / 2 + 'px'
        });

        this.setImageSize(img);

    },
    setImageSize: function (img) {

        var stageData = {
            w: this.$stage.width(),
            h: this.$stage.height()
        }

        // image scale to stage
        var scale = 1;

        if (!this.isRotated) {
            scale = Math.min(stageData.w / img.width, stageData.h / img.height, 1);
        } else {
            scale = Math.min(stageData.w / img.height, stageData.h / img.width, 1);
        }

        this.$image.css({
            width: Math.ceil(img.width * scale) + 'px',
            height: Math.ceil(img.height * scale) + 'px',
            left: (stageData.w - img.width * scale) / 2 + 'px',
            top: (stageData.h - img.height * scale) / 2 + 'px'
        });

        // Store image initial data
        $.extend(this.imageData, {
            width: img.width * scale,
            height: img.height * scale,
            left: (stageData.w - img.width * scale) / 2,
            top: (stageData.h - img.height * scale) / 2
        });

    },
    loadImg: function (imgSrc) {

        var self = this;

        this.$image.attr('src', imgSrc);

        preloadImg(imgSrc, function (img) {

            // Store original data
            self.imageData = {
                originalWidth: img.width,
                originalHeight: img.height
            }

            if (self.isMaximized) {
                self.setImageSize(img);
            } else {
                self.setModalSize(img);
            }

        });

        if (this.options.title) {
            this.setImgTitle(imgSrc);
        }

    },
    getImgGroup: function (list, imgSrc) {

        var self = this;

        self.groupData = [];

        $(list).each(function (index, item) {

            var src = self.getImgSrc(this);

            self.groupData.push({
                src: src,
                caption: $(this).attr('data-caption')
            });
            // Get image index
            if (imgSrc === src) {
                self.groupIndex = index
            }

        });

    },
    setImgTitle: function (url) {

        var index = this.groupIndex,
            caption = this.groupData[index].caption,
            caption = caption ? caption : getImageNameFromUrl(url);

        this.$title.text(caption);

    },
    getImgSrc: function (el) {

        // Get data-src as image src at first
        var src = $(el).attr('data-src') ? $(el).attr('data-src') : $(el).attr('href');

        return src;

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

        this.loadImg(this.groupData[index].src);

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

        // mouse point position
        var pointer = {
            x: e.originalEvent.clientX - this.$stage.offset().left,
            y: e.originalEvent.clientY - this.$stage.offset().top
        }

        this.zoom(ratio, pointer, e);

    },
    zoom: function (ratio, origin, e) {

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

        var $image = this.$image,
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

        var offsetX = stageData.w - newWidth,
            offsetY = stageData.h - newHeight,
            // Get the offsets when image rotate 90 deg
            offsetX2 = stageData.w - (newWidth + newHeight) / 2,
            offsetY2 = stageData.h - (newWidth + newHeight) / 2;

        // zoom out & zoom in condition
        // It's important and it takes me a lot of time to get it
        if (!this.isRotated) {

            if (newHeight <= stageData.h) {
                newTop = (stageData.h - newHeight) / 2;
            } else {
                newTop = newTop > 0 ? 0 : (newTop > offsetY ? newTop : offsetY);
            }

            if (newWidth <= stageData.w) {
                newLeft = (stageData.w - newWidth) / 2;
            } else {
                newLeft = newLeft > 0 ? 0 : (newLeft > offsetX ? newLeft : offsetX);
            }

        } else {
            // The conditions bellow drive me crazy alomst!
            if (newWidth <= stageData.h) {
                newTop = (stageData.h - newHeight) / 2;
            } else {
                newTop = newTop > (newWidth - newHeight) / 2 ? (newWidth - newHeight) / 2 : (newTop > offsetY2 ? newTop : offsetY2);
            }

            if (newHeight <= stageData.w) {
                newLeft = (stageData.w - newWidth) / 2;
            } else {
                newLeft = newLeft > (newHeight - newWidth) / 2 ? (newHeight - newWidth) / 2 : (newLeft > offsetX2 ? newLeft : offsetX2);
            }

        }

        $image.css({
            width: Math.ceil(newWidth) + 'px',
            height: Math.ceil(newHeight) + 'px',
            left: newLeft + 'px',
            top: newTop + 'px'
        });

        // Update image initial data
        $.extend(this.imageData, {
            width: newWidth,
            height: newHeight,
            left: newLeft,
            top: newTop
        });

    },
    rotate: function (angle) {

        this.rotateAngle = rotateAngle = rotateAngle + 90;

        if ((rotateAngle / 90) % 2 !== 0) {
            this.isRotated = true;
        } else {
            this.isRotated = false;
        }

        this.rotateTo(rotateAngle);

    },
    rotateTo: function (angle) {

        var self = this;

        this.$image.css({
            transform: 'rotate(' + angle + 'deg)'
        });

        this.setImageSize({ width: this.imageData.originalWidth, height: this.imageData.originalHeight });

    },
    resize: function () {

        var self = this;

        window.onresize = throttle(function () {

            if (self.isOpened) {

                if (!self.isMaximized) {
                    self.setModalSize({ width: self.imageData.originalWidth, height: self.imageData.originalHeight });
                }

                self.setImageSize({ width: self.imageData.originalWidth, height: self.imageData.originalHeight });

            }

        }, 500);

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
            }

            this.$magnify.addClass('magnify-maximize');

            this.$magnify.css({
                width: '100%',
                height: '100%',
                left: '0',
                top: '0'
            });

            this.isMaximized = true;

        } else {

            this.$magnify.removeClass('magnify-maximize');

            this.$magnify.css({
                width: this.modalData.width,
                height: this.modalData.height,
                left: this.modalData.left,
                top: this.modalData.top
            });

            this.isMaximized = false;
        }

        this.setImageSize({ width: this.imageData.originalWidth, height: this.imageData.originalHeight });

    },
    fullscreen: function () {

        requestFullscreen(this.$magnify[0]);

    },
    keydown: function (e) {

        e.preventDefault();

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
            // ctrl + alt + 0
            case 48:
                if (ctrlKey && altKey) {
                    self.zoomTo(1, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
                }
                break;
            // ctrl + .
            case 190:
                if (ctrlKey) {
                    self.rotate();
                }
                break;
            // ctrl + ,
            // case 188:
            //     if (ctrlKey) {

            //     }
            //     break;
        }

    },
    addEvent: function () {

        var self = this;

        this.$close.on('click', function (e) {
            self.close();
        });

        this.$stage.on('wheel mousewheel DOMMouseScroll', function (e) {
            self.wheel(e);
        });

        this.$zoomIn.on('click', function (e) {
            self.zoom(self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$zoomOut.on('click', function (e) {
            self.zoom(-self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$actualSize.on('click', function (e) {
            self.zoomTo(1, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$prev.on('click', function () {
            self.jump(-1);
        });

        this.$fullscreen.on('click', function () {
            self.fullscreen();
        });

        this.$next.on('click', function () {
            self.jump(1);
        });

        this.$rotate.on('click', function () {
            self.rotate();
        });

        this.$maximize.on('click', function () {
            self.maximize();
        });

        $D.on('keydown', function (e) {
            self.keydown(e);
        });

    }

}

/**
 * Public static functions
 */
$.magnify = {
    instance: Magnify.prototype,
    isDragging: false,
    isMoving: false,
    isResizing: false,
    isMaximized: false,
    modal: {
        width: 0,
        height: 0
    },
    stage: {
        width: 0,
        height: 0
    },
    image: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
    }
}


$.fn.magnify = function (options) {

    jqEl = $(this);

    if (typeof options === 'string') {

        // $(this).data('magnify')[options]();

    } else {

        jqEl.each(function (index, elem) {

            $(this).data('magnify', new Magnify(this, options));

        });

    }

    return jqEl;

}
