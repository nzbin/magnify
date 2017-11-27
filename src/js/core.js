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
    header: [],
    toolbar: [],
    popupWidth: '320',
    popupHeight: '320',
    initMaximize: false,
    gapThreshold: 0.02,
    lang: 'en',
    i18n: {}
}

// magnify base HTML
var magnifyHTML = '<div class="magnify-container">\
                    <div class="magnify-header">\
                        <div class="magnify-title">test</div>\
                        <div class="magnify-toolbar">\
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
                            <button class="magnify-button-actual-size" title="actual-size">\
                                <i class="fa fa-arrows-alt" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-fullscreen" title="fullscreen">\
                                <i class="fa fa-photo" aria-hidden="true"></i>\
                            </button>\
                            <button class="magnify-button-rotate" title="rotate">\
                                <i class="fa fa-repeat" aria-hidden="true"></i>\
                            </button>\
                        </div>\
                    </div>\
                    <div class="magnify-navigation">\
                        <div class="magnify-button-prev"></div>\
                        <div class="magnify-button-next"></div>\
                    </div>\
                </div>';
/**
 * Private functions
 */

/**
 * [checkImgSize description]
 * @param  {[Object]} el     [description]
 * @param  {[Object]} parent [description]
 * @return {[Object]}        [description]
 */
var checkImgSize = function (el, parent) {

    var imgSize = {
        overflowX: false, // no horizontal moving
        overflowY: false // no vertical moving
    }

    var elWidth = $(el).width(),
        elHeight = $(el).height(),
        parentWidth = $(parent).width(),
        parentHeight = $(parent).height();

    imgSize.overflowX = elWidth > parentWidth ? true : false;
    imgSize.overflowY = elHeight > parentHeight ? true : false;

    return imgSize;

}
/**
 * [checkImgPos description]
 * @param  {[Object]} el     [description]
 * @param  {[Object]} parent [description]
 * @return {[Object]}        [description]
 */
var checkImgPos = function (el, parent) {

    var leftDiff = $(el).offset().left - $(parent).offset().left,
        topDiff = $(el).offset().top - $(parent).offset().top,
        widthDiff = $(parent).width() - $(el).width(),
        heightDiff = $(parent).height() - $(el).height();

    var imgPos = {
        top: topDiff,
        bottom: heightDiff -topDiff,
        left: leftDiff,
        right: widthDiff - leftDiff
    }

    return imgPos;

}

/**
 * Magnify Class
 * @param {[Object]} el      [jquery element]
 * @param {[Object]} options [plugin options]
 */
var Magnify = function (el, options) {

    var self = this;

    this.options = $.extend(true, {}, defaults, options);

    this.init(el, self.options);
}


/**
 * Mangify prototype
 */
Magnify.prototype = {

    init: function (el, options) {

        var self = this;

        // add thumbnails click event
        $(el).on('click', function (e) {

            e.preventDefault();

            self.open();

            var imgSrc = $(this).attr('href');

            self.$image.attr('src', imgSrc);

            self.preloadImg(imgSrc, function (img) {
                // console.log(img)
                self.fixedPopupSize(img);
            });

        });

    },
    open: function () {

        var self = this;

        self.build();

        self.addEvent();

    },
    build: function () {

        var self = this;

        var $magnify = $(magnifyHTML);

        this.$magnify = $magnify;
        this.$stage = $magnify.find('.magnify-stage');
        this.$image = $magnify.find('.magnify-stage img');
        this.$close = $magnify.find('.magnify-button-close');
        this.$zoomIn = $magnify.find('.magnify-button-zoom-in');
        this.$zoomOut = $magnify.find('.magnify-button-zoom-out');
        this.$rotate = $magnify.find('.magnify-button-rotate');
        this.$actualSize = $magnify.find('.magnify-button-actual-size');
        this.$fullscreen = $magnify.find('.magnify-button-fullscreen');

        $('body').append($magnify);

        self.fixedPopupPos();

        // draggable & resizable
        draggable($magnify);
        resizable($magnify);

        imgDraggable(self.$image, self.$stage);

    },
    close: function (el) {
        // remove instance
        $(el).parents('.magnify-container').remove();

        // off events

    },
    preloadImg: function (src, fn) {

        var img = new Image();

        if (!!window.ActiveXObject) {
            img.onreadystatechange = function () {
                if (this.readyState == 'complete') {
                    fn();
                }
            }
        } else {
            img.onload = function () {
                fn(img);
            }
        }

        img.src = src;
    },
    zoom: function (el, e) {

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
        var ratio = -delta * 0.1;

        if (ratio < 0) {
            ratio = 1 / (1 - ratio);
        } else {
            ratio = 1 + ratio;
        }

        if (ratio > 0.95 && ratio < 1.05) {
            ratio = 1;
        }

        var $image = $(el),
            $imageWrap = $image.parents('.magnify-container');

        // mouse point position
        var centerPos = {
            x: e.originalEvent.clientX - $imageWrap.offset().left,
            y: e.originalEvent.clientY - $imageWrap.offset().top
        }

        // original image data
        var imgData = {
            w: $image.width(),
            h: $image.height(),
            x: $image.offset().left,
            y: $image.offset().top
        }

        // image wrap position
        // we will use it to calc the relative position of image
        var imgWrapPos = {
            x: $imageWrap.offset().left,
            y: $imageWrap.offset().top
        }

        var newWidth = imgData.w * ratio,
            newHeight = imgData.h * ratio,
            // think about it for a while ~~~
            newLeft = centerPos.x - (centerPos.x - (imgData.x - imgWrapPos.x)) / imgData.w * newWidth,
            newTop = centerPos.y - (centerPos.y - (imgData.y - imgWrapPos.y)) / imgData.h * newHeight;

        // console.log(w / h)

        $image.css({
            width: newWidth + 'px',
            height: newHeight + 'px',
            left: newLeft + 'px',
            top: newTop + 'px'
        });

    },
    zoomHandler: function (center) {

    },
    fixedPopupPos: function () {
        var self = this;

        var winWidth = $W.width(),
            winHeight = $W.height();

        var popupWidth = this.$magnify.width();
        var popupHeight = this.$magnify.height();

        // make the popup in center
        this.$magnify.css({
            left: (winWidth - popupWidth) / 2 + 'px',
            top: (winHeight - popupHeight) / 2 + 'px'
        });
    },
    /**
     * [fixedPopupSize]
     * @param  {[Object]} img [image object]
     */
    fixedPopupSize: function (img) {

        var self = this;

        var winWidth = $W.width(),
            winHeight = $W.height();

        var gapThreshold = (self.options.gapThreshold > 0 ? self.options.gapThreshold : 0) + 1;
        // popup scale to window
        var scale = Math.min(winWidth / (img.width * gapThreshold), winHeight / (img.height * gapThreshold), 1);

        var minWidth = Math.max(img.width * scale, self.options.popupWidth),
            minHeight = Math.max(img.height * scale, self.options.popupHeight);

        minWidth = Math.ceil(minWidth);
        minHeight = Math.ceil(minHeight);

        this.$magnify.css({
            width: minWidth + "px",
            height: minHeight + "px",
            left: (winWidth - minWidth) / 2 + 'px',
            top: (winHeight - minHeight) / 2 + 'px'
        });

        // add to static
        $.magnify.popup.width = minWidth;
        $.magnify.popup.height = minHeight;

        self.fixedImgPos(img)

    },
    fixedImgPos: function (img) {

        var self = this;

        // image scale to popup
        var scale = Math.min($.magnify.popup.width / (img.width), $.magnify.popup.height / (img.height), 1);

        this.$image.css({
            width: img.width * scale + "px",
            height: img.height * scale + "px",
            left: ($.magnify.popup.width - img.width * scale) / 2 + 'px',
            top: ($.magnify.popup.height - img.height * scale) / 2 + 'px'
        });

    },
    resize: function () {

    },
    addEvent: function () {

        var self = this;

        this.$close.on('click', function () {
            self.close(this);
        });

        this.$image.on('wheel mousewheel DOMMouseScroll', function (e) {
            self.zoom(this, e);
        });

        this.$zoomIn.on('click', function (e) {
            var imgSize = checkImgSize(self.$image, self.$stage);
            var imgPos = checkImgPos(self.$image, self.$stage);
            var origin = getOrigin(imgSize,imgPos,self.$stage,e);
            console.log(imgPos,origin)
        });

        this.$zoomOut.on('click', function () {
            alert(1)
        });

        this.$actualSize.on('click', function () {
            alert(2)
        });

    }

}

/**
 * Public static functions
 *
 */
$.magnify = {
    isDragging: false,
    isImgDragging: false,
    isResizing: false,
    win: {
        width: 0,
        height: 0
    },
    popup: {
        width: 0,
        height: 0
    }
}

$.fn.magnify = function (options) {

    return this.each(function () {
        var instance = new Magnify(this, options);
        // console.log(instance)
    });

}
