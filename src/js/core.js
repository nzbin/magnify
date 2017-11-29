/**
 * Private vars
 */

var $W = $(window),
    $D = $(document);

// plugin default options
var defaults = {
    draggable: true,
    resizable: true,
    keyboard: true,
    title: true,
    toolbar: [],
    modalWidth: '320',
    modalHeight: '320',
    initMaximize: false,
    gapThreshold: 0.02,
    ratioThreshold: 0.1,
    lang: 'en',
    i18n: {}
}

// magnify base HTML
var magnifyHTML = '<div class="magnify-modal">\
                    <div class="magnify-header">\
                        <div class="magnify-title">test</div>\
                        <div class="magnify-toolbar">\
                            <button class="magnify-button-minimize" title="minimize">\
                                <i class="fa fa-window-minimize" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-maximize" title="maximize">\
                                <i class="fa fa-window-maximize" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-close" title="close">\
                                <i class="fa fa-times" aria-hidden="true"></i>\
                            </button>\
                        </div>\
                    </div>\
                    <div class="magnify-stage">\
                        <img src="" alt="">\
                    </div>\
                    <div class="magnify-footer">\
                        <div class="magnify-toolbar">\
                            <button class="magnify-button-zoom-in" title="zoom-in">\
                                <i class="fa fa-search-plus" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-zoom-out" title="zoom-out">\
                                <i class="fa fa-search-minus" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-prev" title="prev">\
                                <i class="fa fa-arrow-left" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-fullscreen" title="fullscreen">\
                                <i class="fa fa-photo" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-next" title="next">\
                                <i class="fa fa-arrow-right" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-actual-size" title="actual-size">\
                                <i class="fa fa-arrows-alt" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-rotate" title="rotate">\
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

            self.open();

            var imgSrc = $(this).attr('href');
            self.$image.attr('src', imgSrc);

            self.preloadImg(imgSrc, function(img) {
                // console.log(img)
                self.fixedModalSize(img);

                $.magnify.image.width = img.width;
                $.magnify.image.height = img.height;

            });

        });

    },
    open: function() {

        var self = this;

        self.build();

        self.addEvent();

    },
    build: function() {

        var self = this;

        var $magnify = $(magnifyHTML);

        this.$magnify = $magnify;
        this.$stage = $magnify.find('.magnify-stage');
        this.$image = $magnify.find('.magnify-stage img');
        this.$close = $magnify.find('.magnify-button-close');
        this.$minimize = $magnify.find('.magnify-button-minimize');
        this.$maximize = $magnify.find('.magnify-button-maximize');
        this.$zoomIn = $magnify.find('.magnify-button-zoom-in');
        this.$zoomOut = $magnify.find('.magnify-button-zoom-out');
        this.$actualSize = $magnify.find('.magnify-button-actual-size');
        this.$rotate = $magnify.find('.magnify-button-rotate');
        this.$fullscreen = $magnify.find('.magnify-button-fullscreen');
        this.$prev = $magnify.find('.magnify-button-prev');
        this.$next = $magnify.find('.magnify-button-next');

        $('body').append($magnify);

        self.fixedModalPos();

        // draggable & resizable
        draggable($magnify);
        resizable($magnify,self.$image);

        imgDraggable(self.$image, self.$stage);

    },
    close: function(el) {
        // remove instance
        this.$magnify.remove();

        // off events

    },
    loadImg:function(){

    },
    preloadImg: function(src, fn) {

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
    },
    wheel: function(e) {

        var self = this;

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
        var ratio = -delta * self.options.ratioThreshold;

        // mouse point position
        var pointer = {
            x: e.originalEvent.clientX - self.$stage.offset().left,
            y: e.originalEvent.clientY - self.$stage.offset().top
        }

        self.zoom(ratio, pointer, e);

    },
    zoom: function(ratio, origin, e) {

        // zoom out & zoom in
        ratio = ratio < 0 ? (1 / (1 - ratio)) : (1 + ratio);

        if (ratio > 0.95 && ratio < 1.05) {
            ratio = 1;
        }

        var $image = this.$image,
            $stage = this.$stage;

        // original image data
        var imgData = {
            w: $image.width(),
            h: $image.height(),
            x: $image.offset().left,
            y: $image.offset().top
        }

        // image stage position
        // we will use it to calc the relative position of image
        var stageData = {
            w: $stage.width(),
            h: $stage.height(),
            x: $stage.offset().left,
            y: $stage.offset().top
        }

        var newWidth = imgData.w * ratio,
            newHeight = imgData.h * ratio,
            // think about it for a while ~~~
            newLeft = origin.x - (origin.x - (imgData.x - stageData.x)) / imgData.w * newWidth,
            newTop = origin.y - (origin.y - (imgData.y - stageData.y)) / imgData.h * newHeight;

        var offsetX = stageData.w - newWidth,
            offsetY = stageData.h - newHeight;
        // console.log(offsetX, offsetY)

        // zoom out & zoom in condition
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

        $image.css({
            width: newWidth + 'px',
            height: newHeight + 'px',
            left: newLeft + 'px',
            top: newTop + 'px'
        });

    },
    zoomHandler: function() {

    },
    rotate: function() {

    },
    fixedModalPos: function() {
        var self = this;

        var winWidth = $W.width(),
            winHeight = $W.height();

        var modalWidth = this.$magnify.width();
        var modalHeight = this.$magnify.height();

        // make the modal in center
        this.$magnify.css({
            left: (winWidth - modalWidth) / 2 + 'px',
            top: (winHeight - modalHeight) / 2 + 'px'
        });
    },
    fixedModalSize: function(img) {

        var self = this;

        var winWidth = $W.width(),
            winHeight = $W.height();

        var gapThreshold = (self.options.gapThreshold > 0 ? self.options.gapThreshold : 0) + 1;
        // modal scale to window
        var scale = Math.min(winWidth / (img.width * gapThreshold), winHeight / (img.height * gapThreshold), 1);

        var minWidth = Math.max(img.width * scale, self.options.modalWidth),
            minHeight = Math.max(img.height * scale, self.options.modalHeight);

        minWidth = Math.ceil(minWidth);
        minHeight = Math.ceil(minHeight);

        this.$magnify.css({
            width: minWidth + "px",
            height: minHeight + "px",
            left: (winWidth - minWidth) / 2 + 'px',
            top: (winHeight - minHeight) / 2 + 'px'
        });

        // store modal size
        $.magnify.modal.width = minWidth;
        $.magnify.modal.height = minHeight;

        self.fixedImgPos(img)

    },
    fixedImgPos: function(img) {

        var self = this;

        // image scale to modal
        var scale = Math.min($.magnify.modal.width / (img.width), $.magnify.modal.height / (img.height), 1);

        this.$image.css({
            width: img.width * scale + "px",
            height: img.height * scale + "px",
            left: ($.magnify.modal.width - img.width * scale) / 2 + 'px',
            top: ($.magnify.modal.height - img.height * scale) / 2 + 'px'
        });

    },
    resize: function() {

    },
    addEvent: function() {

        var self = this;

        this.$close.on('click', function() {
            self.close();
        });

        this.$stage.on('wheel mousewheel DOMMouseScroll', function(e) {
            self.wheel(e);
        });

        this.$zoomIn.on('click', function(e) {
            self.zoom(0.2, { x: self.$stage.height() / 2, y: self.$stage.width() / 2 }, e);
        });

        this.$zoomOut.on('click', function(e) {
            self.zoom(-0.2, { x: self.$stage.height() / 2, y: self.$stage.width() / 2 }, e);
        });

        this.$actualSize.on('click', function(e) {

        });

        this.$prev.on('click', function() {
            alert(3)
        });

        this.$fullscreen.on('click', function() {
            alert(4)
        });

        this.$next.on('click', function() {
            alert(5)
        });

        this.$rotate.on('click', function() {
            alert(6)
        });

        this.$maximize.on('click',function(){
            self.$magnify.toggleClass('magnify-maximize');
        });

    }

}

/**
 * Public static functions
 */
$.magnify = {
    instance: Magnify.prototype,
    isDragging: false,
    isImgDragging: false,
    isResizing: false,
    modal: {
        width: 0,
        height: 0
    },
    image: {
        width: 0,
        height: 0
    }
}

$.fn.magnify = function(options) {

    return this.each(function() {
        var instance = new Magnify(this, options);
        // console.log(instance)
    });

}
