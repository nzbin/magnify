/**
 *  ___  ___  _____   ______  __   __ _____ ______ __    __
 * |   \/   |/  _  \ /  __  \|  \ |  |_   _|   ___|  \  /  |
 * |        |  / \  |  |  \__|   \|  | | | |  |__  \  \/  /
 * |  |\/|  |  |_|  |  |  ___        | | | |   __|  \    /
 * |  |  |  |   _   |  \_/   |  |\   |_| |_|  |      |  |
 * |__|  |__|__| |__|\____/|_|__| \__|_____|__|      |__|
 *
 * jquery.magnify.js v0.1.0
 *
 * A jQuery plugin to view images just like in windows
 *
 * Copyright (c) 2017 nzbin
 *
 * Released under the MIT License
 *
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
        fixedContent: true,
        fixedModalSize: false,
        initMaximized: false,
        gapThreshold: 0.02,
        ratioThreshold: 0.1,
        minRatio: 0.1,
        maxRatio: 16,
        headToolbar: [
            'maximize',
            'close'
        ],
        footToolbar: [
            'zoomIn',
            'zoomOut',
            'prev',
            'fullscreen',
            'next',
            'actualSize',
            'rotateRight'
        ],
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

    // image moving flag
    isMoving = false,

    // modal resizing flag
    isResizing = false,

    // modal open flag
    isOpened = false,

    // modal maximize flag
    isMaximized = false,

    // image rotate 90*(2n+1) flag
    isRotated = false,

    // image rotate angle
    rotateAngle = 0;


/**
 * Magnify Class
 */
var Magnify = function (el, options) {

    var self = this;

    this.options = $.extend(true, {}, defaults, options);

    if (options && $.isArray(options.footToolbar)) {
        this.options.footToolbar = options.footToolbar;
    }

    if (options && $.isArray(options.headToolbar)) {
        this.options.headToolbar = options.headToolbar;
    }

    this.isOpened = false;
    this.isMaximized = false;
    this.isRotated = false;
    this.rotateAngle = 0;

    // Store image data in every instance
    // this.imageData = {};

    this.init(el, self.options);

}


/**
 * Mangify prototype
 */
Magnify.prototype = {

    init: function (el, options) {

        this.open();

        // Get image src
        var imgSrc = this.getImgSrc(el);

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

        this.loadImg(imgSrc);

    },
    creatBtns: function (toolbar, btns) {

        var btnsStr = '';

        $.each(toolbar, function (index, item) {
            btnsStr += btns[item];
        });

        return btnsStr;

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
            rotateLeft: '<button class="magnify-button magnify-button-rotate-left" title="rotate-left">\
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
                                    <div class="magnify-toolbar">' + this.creatBtns(this.options.headToolbar, btnsTpl) + '</div>\
                                </div>\
                                <div class="magnify-stage">\
                                    <img src="" alt="" title="">\
                                </div>\
                                <div class="magnify-footer">\
                                    <div class="magnify-toolbar">' + this.creatBtns(this.options.footToolbar, btnsTpl) + '</div>\
                                </div>\
                            </div>';

        return magnifyHTML;

    },
    open: function () {

        // Fixed modal position bug
        if (!$('.magnify-modal').length && this.options.fixedContent) {
            $('html').css('overflow', 'hidden');
        }

        this.isOpened = isOpened = true;

        this.build();

        this.addEvent();

        this.resize();

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
        this.$fullscreen = $magnify.find('.magnify-button-fullscreen');
        this.$rotateLeft = $magnify.find('.magnify-button-rotate-left');
        this.$rotateRight = $magnify.find('.magnify-button-rotate-right');
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

        this.isOpened = isOpened = false;

        // Fixed modal position bug
        if (!$('.magnify-modal').length && this.options.fixedContent) {
            $('html').css('overflow', 'auto');
        }

    },
    setModalPos: function (modal) {

        var winWidth = $W.width(),
            winHeight = $W.height(),
            scrollLeft = $D.scrollLeft(),
            scrollTop = $D.scrollTop();

        var modalWidth = modal.width(),
            modalHeight = modal.height();

        // Make the modal in windows center
        modal.css({
            left: (winWidth - modalWidth) / 2 + scrollLeft + 'px',
            top: (winHeight - modalHeight) / 2 + scrollTop + 'px'
        });

    },
    setModalSize: function (img) {

        var winWidth = $W.width(),
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
            borderBottom: this.$stage.css('border-bottom-width'),
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

        minWidth = this.options.fixedModalSize ? this.options.modalWidth : Math.ceil(minWidth);
        minHeight = this.options.fixedModalSize ? this.options.modalHeight : Math.ceil(minHeight);

        this.$magnify.css({
            width: minWidth + 'px',
            height: minHeight + 'px',
            left: (winWidth - minWidth) / 2 + scrollLeft + 'px',
            top: (winHeight - minHeight) / 2 + scrollTop + 'px'
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

        // Add grab cursor
        if(imgNewHeight > stageData.h || imgNewWidth > stageData.w){
            this.$stage.addClass('is-grab');
        }
        if(imgNewHeight <= stageData.h && imgNewWidth <= stageData.w) {
            this.$stage.removeClass('is-grab');
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

        this.rotateAngle = rotateAngle = rotateAngle + angle;

        if ((rotateAngle / 90) % 2 === 0) {
            this.isRotated = false;
        } else {
            this.isRotated = true;
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

        var resizeHandler = throttle(function () {

            if (isOpened) {

                if (!self.isMaximized) {
                    self.setModalSize({ width: self.imageData.originalWidth, height: self.imageData.originalHeight });
                }

                self.setImageSize({ width: self.imageData.originalWidth, height: self.imageData.originalHeight });
            }

        }, 500);


        $W.off('resize').on('resize', resizeHandler);

    },
    maximize: function () {

        var self = this;

        var scrollLeft = $D.scrollLeft(),
            scrollTop = $D.scrollTop();

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
                left: scrollLeft,
                top: scrollTop
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
    addEvent: function () {

        var self = this;

        this.$close.off('click').on('click', function (e) {
            self.close();
        });

        this.$stage.off('wheel mousewheel DOMMouseScroll').on('wheel mousewheel DOMMouseScroll', function (e) {
            self.wheel(e);
        });

        this.$zoomIn.off('click').on('click', function (e) {
            self.zoom(self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$zoomOut.off('click').on('click', function (e) {
            self.zoom(-self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$actualSize.off('click').on('click', function (e) {
            self.zoomTo(1, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$prev.off('click').on('click', function () {
            self.jump(-1);
        });

        this.$fullscreen.off('click').on('click', function () {
            self.fullscreen();
        });

        this.$next.off('click').on('click', function () {
            self.jump(1);
        });

        this.$rotateLeft.off('click').on('click', function () {
            self.rotate(-90);
        });

        this.$rotateRight.off('click').on('click', function () {
            self.rotate(90);
        });

        this.$maximize.off('click').on('click', function () {
            self.maximize();
        });

        $D.off('keydown').on('keydown', function (e) {
            self.keydown(e);
        });

    }

}

/**
 * Public static functions
 */
$.magnify = {
    instance: Magnify.prototype
}


$.fn.magnify = function (options) {

    jqEl = $(this);

    if (typeof options === 'string') {

        // $(this).data('magnify')[options]();

    } else {

        jqEl.off('click.magnify').on('click.magnify', function (e) {

            if (e.isDefaultPrevented()) {
                return;
            }

            e.preventDefault();

            $(this).data('magnify', new Magnify(this, options));

        });

    }

    return jqEl;

}

/**
 * MAGNIFY DATA-API
 */
$D.on('click.magnify', '[data-magnify]', function (e) {

    jqEl = $('[data-magnify]');

    if (e.isDefaultPrevented()) {
        return;
    }

    e.preventDefault();

    $(this).data('magnify', new Magnify(this, {}));

});

/**
 * draggable
 */

// modal draggable
var draggable = function(modal) {

    var self = this;

    var isDragging = false;

    var startX = 0,
        startY = 0,

        left = 0,
        top = 0;

    var dragStart = function(e) {

        var e = e || window.event;

        e.preventDefault();

        // Get clicked button
        var elemCancel = $(e.target).closest('.magnify-button');
        // Stop modal moving when click buttons
        if(elemCancel.length){
            return true;
        }

        isDragging = true;

        startX = e.clientX;
        startY = e.clientY;

        left = $(modal).offset().left;
        top = $(modal).offset().top;

    }

    var dragMove = function(e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging && !isMoving && !isResizing && !self.isMaximized) {

            var endX = e.clientX,
                endY = e.clientY,

                relativeX = endX - startX,
                relativeY = endY - startY;

            $(modal).css({
                left: relativeX + left + 'px',
                top: relativeY + top + 'px'
            });

        }

        return false;

    }

    var dragEnd = function(e) {

        isDragging = false;

    }

    $(modal).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
    draggable: draggable
});

/**
 * image movable
 * --------------------------------------
 * 1.no movable
 * 2.vertical movable
 * 3.horizontal movable
 * 4.vertical & horizontal movable
 * --------------------------------------
 */

var movable = function (image, stage) {

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

        var imageWidth = $(image).width(),
            imageHeight = $(image).height(),
            stageWidth = $(stage).width(),
            stageHeight = $(stage).height();

        startX = e.clientX;
        startY = e.clientY;

        // δ is the difference between image width and height
        δ = !self.isRotated ? 0 : (imageWidth - imageHeight) / 2;

        // Width or height difference can be use to limit image right or top position
        widthDiff = !self.isRotated ? (imageWidth - stageWidth) : (imageHeight - stageWidth);
        heightDiff = !self.isRotated ? (imageHeight - stageHeight) : (imageWidth - stageHeight);

        // Modal can be dragging if image is smaller to stage
        isDragging = (widthDiff > 0 || heightDiff > 0) ? true : false;
        isMoving = (widthDiff > 0 || heightDiff > 0) ? true : false;

        // Reclac the element position when mousedown
        // Fixed the issue of stage with a border
        left = $(image).position().left - δ;
        top = $(image).position().top + δ;

    }

    var dragMove = function (e) {

        var e = e || window.event;

        e.preventDefault();

        if (isDragging) {

            var endX = e.clientX,
                endY = e.clientY,

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

            $(image).css({
                left: newLeft + 'px',
                top: newTop + 'px',
            });

            // Update image initial data
            $.extend(self.imageData, {
                left: newLeft,
                top: newTop
            });

        }

        return false;

    }

    var dragEnd = function (e) {

        isDragging = false;
        isMoving = false;

    }

    $(stage).on('mousedown', dragStart);

    $D.on('mousemove', dragMove);

    $D.on('mouseup', dragEnd);
}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
    movable: movable
});

/**
 * resizable
 * ------------------------------
 * 1.modal resizable
 * 2.keep image in stage center
 * ------------------------------
 */

var resizable = function(modal, stage, image, minWidth, minHeight) {

    var self = this;

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

    $(modal).append(
        resizableHandleE, resizableHandleW, resizableHandleS, resizableHandleN, resizableHandleSE, resizableHandleSW, resizableHandleNE, resizableHandleNW
    );

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
            l: 0,
            t: 0
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
        // δ is the difference between image width and height
        var δ = !self.isRotated ? 0 : (imageData.w - imageData.h) / 2,
            imgWidth = !self.isRotated ? imageData.w : imageData.h,
            imgHeight = !self.isRotated ? imageData.h : imageData.w;

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

        if (isDragging && !self.isMaximized) {

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

            $(image).css(imageOpts);

        }

        return false;

    }
    var dragEnd = function(e) {

        isDragging = false;
        isResizing = false;

    }

    $.each(resizableHandles, function(dir, handle) {
        handle.on('mousedown', function(e) {
            dragStart(dir, e);
        });
    });

    $D.on('mousemove', dragMove);
    $D.on('mouseup', dragEnd);
}

// Add to Magnify Prototype
$.extend(Magnify.prototype, {
    resizable: resizable
});

/**
 * Private functions
 */

/**
 * [throttle]
 * @param  {Function} fn    [description]
 * @param  {[Number]} delay [description]
 * @return {Function}       [description]
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
};

/**
 * [preloadImg]
 * @param  {[String]}  src [image src]
 * @param  {Function}  fn  [callbacks]
 */
function preloadImg(src, fn) {

    var img = new Image();

    if (!!window.ActiveXObject) {
        img.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                fn(img);
            }
        }
    } else {
        img.onload = function() {
            fn(img);
        }
    }

    img.src = src;
}

/**
 * [requestFullscreen description]
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
 * [exitFullscreen description]
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
 * [getNumFromCSSValue description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function getNumFromCSSValue(value) {
    var reg = /\d+/g,
        arr = value.match(reg),
        num = parseFloat(arr[0]);
    return num;
}

});
