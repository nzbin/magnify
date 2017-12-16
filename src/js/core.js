/**
 * Private vars
 */

var $W = $(window),
    $D = $(document),

    // jquery element of calling plugin
    jqEl = null,

    // plugin default options
    defaults = {
        draggable: true,
        resizable: true,
        keyboard: true,
        title: true,
        toolbar: [],
        modalWidth: '320',
        modalHeight: '320',
        initMaximized: false,
        gapThreshold: 0.02,
        ratioThreshold: 0.1,
        lang: 'en',
        i18n: {}
    },

    // magnify base HTML
    magnifyHTML = '<div class="magnify-modal">\
                        <div class="magnify-header">\
                            <div class="magnify-title"></div>\
                            <div class="magnify-toolbar">\
                                <button class="magnify-button magnify-button-maximize" title="maximize">\
                                    <i class="fa fa-window-maximize" aria-hidden="true"></i>\
                                </button>\
                                <button class="magnify-button magnify-button-close" title="close">\
                                    <i class="fa fa-times" aria-hidden="true"></i>\
                                </button>\
                            </div>\
                        </div>\
                        <div class="magnify-stage">\
                            <img src="" alt="">\
                        </div>\
                        <div class="magnify-footer">\
                            <div class="magnify-toolbar">\
                                <button class="magnify-button magnify-button-zoom-in" title="zoom-in">\
                                    <i class="fa fa-search-plus" aria-hidden="true"></i>\
                                </button>\
                                <button class="magnify-button magnify-button-zoom-out" title="zoom-out">\
                                    <i class="fa fa-search-minus" aria-hidden="true"></i>\
                                </button>\
                                <button class="magnify-button magnify-button-prev" title="prev">\
                                    <i class="fa fa-arrow-left" aria-hidden="true"></i>\
                                </button>\
                                <button class="magnify-button magnify-button-fullscreen" title="fullscreen">\
                                    <i class="fa fa-photo" aria-hidden="true"></i>\
                                </button>\
                                <button class="magnify-button magnify-button-next" title="next">\
                                    <i class="fa fa-arrow-right" aria-hidden="true"></i>\
                                </button>\
                                <button class="magnify-button magnify-button-actual-size" title="actual-size">\
                                    <i class="fa fa-arrows-alt" aria-hidden="true"></i>\
                                </button>\
                                <button class="magnify-button magnify-button-rotate" title="rotate">\
                                    <i class="fa fa-repeat" aria-hidden="true"></i>\
                                </button>\
                            </div>\
                        </div>\
                    </div>';

/**
 * Magnify Class
 */
var Magnify = function(el, options) {

    var self = this;

    this.options = $.extend(true, {}, defaults, options);

    this.init(el, self.options);

    this.isMaximized = false;
    this.isRotated = false;
    this.angle = 0;
    // store image data in every instance
    // this.imageData = {};
}


/**
 * Mangify prototype
 */
Magnify.prototype = {

    init: function(el, options) {

        var self = this;

        // bind thumbnails click event
        $(el).on('click', function(e) {

            e.preventDefault();
            e.stopPropagation();

            self.open();

            self.resize();

            // get image src
            var imgSrc = $(this).attr('href');

            self.loadImg(imgSrc);

            // get image group
            self.groupName = null;

            var currentGroupName = $(this).attr('data-group'),
                groupList = $D.find('[data-group=' + currentGroupName + ']');

            if (currentGroupName != self.groupName) {
                self.groupName = currentGroupName;
                self.getImgGroup(groupList, imgSrc);
            } else {
                self.getImgGroup(jqEl.not('[data-group]'), imgSrc);
            }

        });


    },
    open: function() {

        this.build();

        this.addEvent();

    },
    build: function() {

        var $magnify = $(magnifyHTML);

        this.$magnify = $magnify;
        this.$stage = $magnify.find('.magnify-stage');
        this.$image = $magnify.find('.magnify-stage img');
        this.$close = $magnify.find('.magnify-button-close');
        this.$maximize = $magnify.find('.magnify-button-maximize');
        this.$zoomIn = $magnify.find('.magnify-button-zoom-in');
        this.$zoomOut = $magnify.find('.magnify-button-zoom-out');
        this.$actualSize = $magnify.find('.magnify-button-actual-size');
        this.$rotate = $magnify.find('.magnify-button-rotate');
        this.$fullscreen = $magnify.find('.magnify-button-fullscreen');
        this.$prev = $magnify.find('.magnify-button-prev');
        this.$next = $magnify.find('.magnify-button-next');

        $('body').append($magnify);

        this.fixedModalPos($magnify);

        // draggable & movable & resizable
        this.draggable($magnify);

        this.movable(this.$image, this.$stage);

        this.resizable($magnify, this.$stage, this.$image, this.options.modalWidth, this.options.modalHeight);

    },
    close: function(el) {
        // remove instance
        this.$magnify.remove();

        this.isMaximized = false;
        this.isRotated = false;
        this.angle = 0;

        // off events

    },
    fixedModalPos: function(modal) {

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
    fixedModalSize: function(img) {

        var winWidth = $W.width(),
            winHeight = $W.height();

        var gapThreshold = (this.options.gapThreshold > 0 ? this.options.gapThreshold : 0) + 1;
        // modal scale to window
        var scale = Math.min(winWidth / (img.width * gapThreshold), winHeight / (img.height * gapThreshold), 1);

        var minWidth = Math.max(img.width * scale, this.options.modalWidth),
            minHeight = Math.max(img.height * scale, this.options.modalHeight);

        minWidth = Math.ceil(minWidth);
        minHeight = Math.ceil(minHeight);

        this.$magnify.css({
            width: minWidth + 'px',
            height: minHeight + 'px',
            left: (winWidth - minWidth) / 2 + 'px',
            top: (winHeight - minHeight) / 2 + 'px'
        });

        this.fixedImagePos(img)

    },
    fixedImagePos: function(img) {

        var stageData = {
            w: this.$stage.width(),
            h: this.$stage.height()
        }

        // image scale to stage
        var scale = 1;

        if (!this.isRotated) {
            scale = Math.min(stageData.w / (img.width), stageData.h / (img.height), 1);
        } else {
            scale = Math.min(stageData.w / (img.height), stageData.h / (img.width), 1);
        }

        this.$image.css({
            width: Math.ceil(img.width * scale) + 'px',
            height: Math.ceil(img.height * scale) + 'px',
            left: Math.ceil((stageData.w - img.width * scale) / 2) + 'px',
            top: Math.ceil((stageData.h - img.height * scale) / 2) + 'px'
        });

        // Store image initial data
        $.extend(this.imageData, {
            width: img.width * scale,
            height: img.height * scale,
            left: (stageData.w - img.width * scale) / 2,
            top: (stageData.h - img.height * scale) / 2
        });

    },
    loadImg: function(imgSrc) {

        var self = this;

        self.$image.attr('src', imgSrc);

        preloadImg(imgSrc, function(img) {

            // Store original data
            self.imageData = {
                originalWidth: img.width,
                originalHeight: img.height
            }

            if (self.isMaximized) {
                self.fixedImagePos(img);
            } else {
                self.fixedModalSize(img);
            }

        });

    },
    getImgGroup: function($list, imgSrc) {

        var self = this;

        self.groupData = [];

        $list.each(function(i, k) {

            self.groupData.push({
                src: $(this).attr('href'),
                caption: $(this).attr('data-caption')
            });
            // get image index
            if (imgSrc === $(this).attr('href')) {
                self.groupIndex = i
            }

        });

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

        // ratio threshold
        var ratio = -delta * this.options.ratioThreshold;

        // mouse point position
        var pointer = {
            x: e.originalEvent.clientX - this.$stage.offset().left,
            y: e.originalEvent.clientY - this.$stage.offset().top
        }

        this.zoom(ratio, pointer, e);

    },
    zoom: function(ratio, origin, e) {

        // zoom out & zoom in
        ratio = ratio < 0 ? (1 / (1 - ratio)) : (1 + ratio);

        if (ratio > 0.95 && ratio < 1.05) {
            ratio = 1;
        }

        ratio = this.$image.width() / this.imageData.originalWidth * ratio;

        this.zoomHandler(ratio, origin, e);

    },
    zoomHandler: function(ratio, origin, e) {

        var $image = this.$image,
            $stage = this.$stage,
            imgData = {
                w: this.imageData.width,
                h: this.imageData.height,
                x: this.imageData.left,
                y: this.imageData.top,
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
                newTop = newTop > 0 ? 0 : (newTop < offsetY ? offsetY : newTop);
            }

            if (newWidth <= stageData.w) {
                newLeft = (stageData.w - newWidth) / 2;
            } else {
                newLeft = newLeft > 0 ? 0 : (newLeft < offsetX ? offsetX : newLeft);
            }

        } else {
            // The conditions bellow drive me crazy alomst!
            if (newWidth <= stageData.h) {
                newTop = (stageData.h - newHeight) / 2;
            } else {
                newTop = newTop > (newWidth - newHeight) / 2 ? (newWidth - newHeight) / 2 : (newTop < offsetY2 ? offsetY2 : newTop);
            }

            if (newHeight <= stageData.w) {
                newLeft = (stageData.w - newWidth) / 2;
            } else {
                newLeft = newLeft > (newHeight - newWidth) / 2 ? (newHeight - newWidth) / 2 : (newLeft < offsetX2 ? offsetX2 : newLeft);
            }

        }

        $image.css({
            width: Math.ceil(newWidth) + 'px',
            height: Math.ceil(newHeight) + 'px',
            left: Math.ceil(newLeft) + 'px',
            top: Math.ceil(newTop) + 'px'
        });

        // Update image initial data
        $.extend(this.imageData, {
            width: newWidth,
            height: newHeight,
            left: newLeft,
            top: newTop
        });

    },
    rotate: function(angle) {

        var self = this;

        this.$image.css({
            transform: 'rotate(' + angle + 'deg)'
        });

        if (this.angle === 90 || this.angle === 270) {
            this.isRotated = true;
        } else {
            this.isRotated = false;
        }

        this.fixedImagePos({ width: this.imageData.originalWidth, height: this.imageData.originalHeight });

    },
    resize: function() {

        var self = this;

        window.onresize = throttle(function() {
            self.fixedModalPos(self.$magnify);
            self.fixedImagePos(self.$image[0]);
        }, 500);

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

        this.fixedImagePos(this.$image[0]);

    },
    fullscreen: function() {

        requestFullscreen(this.$magnify[0]);

    },
    addEvent: function() {

        var self = this;

        this.$close.on('click', function(e) {
            self.close();
        });

        this.$stage.on('wheel mousewheel DOMMouseScroll', function(e) {
            self.wheel(e);
        });

        this.$zoomIn.on('click', function(e) {
            self.zoom(self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$zoomOut.on('click', function(e) {
            self.zoom(-self.options.ratioThreshold * 3, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$actualSize.on('click', function(e) {
            self.zoomHandler(1, { x: self.$stage.width() / 2, y: self.$stage.height() / 2 }, e);
        });

        this.$prev.on('click', function() {
            self.groupIndex = (self.groupData.length + self.groupIndex - 1) % self.groupData.length;
            self.loadImg(self.groupData[self.groupIndex].src);
        });

        this.$fullscreen.on('click', function() {
            self.fullscreen();
        });

        this.$next.on('click', function() {
            self.groupIndex = (self.groupIndex + 1) % self.groupData.length;
            self.loadImg(self.groupData[self.groupIndex].src);
        });

        this.$rotate.on('click', function() {
            self.angle = (self.angle + 90) % 360;
            self.rotate(self.angle);
        });

        this.$maximize.on('click', function() {
            self.maximize();
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


$.fn.magnify = function(options) {

    jqEl = $(this);

    if (typeof options === 'string') {

        // $(this).data('magnify')[options]();

    } else {

        jqEl.each(function(index, elem) {

            $(this).data('magnify', new Magnify(this, options));

        });

    }

    return jqEl;

}
