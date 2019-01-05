> ⚠️ Attention! This repository will not be maintained. The plugin is easy to use, but its customization can be troublesome. To improve plugin's flexibility, I made another repository [PhotoViewer](https://github.com/nzbin/photoviewer) which is the enhanced version of Magnify.

# Magnify

[![Travis](https://img.shields.io/travis/nzbin/magnify.svg)](https://travis-ci.org/nzbin/magnify)
[![npm](https://img.shields.io/npm/v/jquery.magnify.svg)](https://www.npmjs.com/package/jquery.magnify)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/nzbin/magnify)

Magnify is a jQuery plugin to view images just like in windows. 

[[ website ]](https://nzbin.github.io/magnify/)


## Main Features

- Modal draggable.
- Modal resizable.
- Modal maximizable.
- Image movable.
- Image zoomable.
- Image rotatable.
- Keyboard control.
- Fullscreen showing.
- Multiple instances.
- Browser support (IE7+).

## Installation

You can install the plugin via npm

```sh
$ npm install jquery.magnify --save
```

or via bower

```sh
$ bower install jquery.magnify --save
```

## Usage

### 1.Include files

The usage of magnify is very simple.

```html
<link href="/path/to/magnify.css" rel="stylesheet">

<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery.magnify.js"></script>
```
The icons in magnify use svg default, you can customize them in options.

### 2.Html structure

The default structure as below:

```html
<a data-magnify="gallery" href="big-1.jpg">
  <img src="small-1.jpg">
</a>
<a data-magnify="gallery" href="big-2.jpg">
  <img src="small-2jpg">
</a>
<a data-magnify="gallery" href="big-3.jpg">
  <img src="small-3.jpg">
</a>
```

or

```html
<img data-magnify="gallery" data-src="big-1.jpg" src="small-1.jpg">
<img data-magnify="gallery" data-src="big-2.jpg" src="small-2.jpg">
<img data-magnify="gallery" data-src="big-3.jpg" src="small-3.jpg">
```

All structures above have optional attributes as below:
- Add a `data-src` attribute to link big image if you do not want to use a `<a> ` tag. If you use it in a `<a>` tag, it will override the image link in `href` attribute.
- Add a `data-caption` attribute if you want to show a caption. If you are not using this attribute, it will show the image name in the url when you set the `title` option `true`.
- Add a `data-group` attribute if you want to set the images in groups.

### 3.Call plugin

If you add a `data-magnify` attribute, you can write none of js.

Of course, you can use selector to call the plugin as following code:

```js
$("[data-magnify=gallery]").magnify();
```

## Options

- **draggable** `true`
  >If ture, it allow modal dragging.
  
- **resizable** `true`
  >If ture, it allow modal resizing.
  
- **movable** `true`
  >If ture, it allow image moving.
  
- **keyboard** `true`
  >	If ture, it allow keyboard control. It is similar to Windows photo viewer.
  
  - <kbd>←</kbd> prev image
  - <kbd>→</kbd> next image
  - <kbd>+</kbd> zoom in image
  - <kbd>-</kbd> zoom out image
  - <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>0</kbd> image autual size
  - <kbd>ctrl</kbd> + <kbd>,</kbd> rotate image left
  - <kbd>ctrl</kbd> + <kbd>.</kbd> rotate image right


- **title** `true`
  > If ture, it will show image title on header.

- **fixedModalSize** `false`
  > If false, the modal init size will fit to image size.
  > 
  > If true, the modal init size will be set with `modalWidth` and `modalHeight`.

- **modalWidth** `320`
  > The modal min width.

- **modalHeight** `320`
  > The modal min height.

- **gapThreshold** `0.02`
  > There will have a gap if modal too big to beyond the browser.

- **ratioThreshold** `0.01`
  > Image zoom ratio threshold.

- **minRatio** `0.05` (5%)
  > The min ratio to show image.

- **maxRatio** `16` (1600%)
  > The max ratio to show image.

- **icons** 
  > You can customize the icons in following key.
  
  - **minimize** `svg`

  - **maximize** `svg`

  - **close** `svg`

  - **zoomIn** `svg`

  - **zoomOut** `svg`

  - **prev** `svg`

  - **next** `svg`

  - **fullscreen** `svg`

  - **actualSize** `svg`
 
  - **rotateLeft** `svg`

  - **rotateRight** `svg`

    
- **headToolbar** `['maximize','close']`
  > The buttons display in header toolbar.

- **footToolbar** `['zoomIn','zoomOut','prev','fullscreen','next','actualSize','rotateRight']`
  >	The buttons display in footer toolbar.

- **fixedContent** `true`
  > If true, the content will be fixed.

- **i18n** 
  > You can customize the buttons title in following key.
  
  - **minimize** `minimize`

  - **maximize** `maximize`

  - **close** `close`

  - **zoomIn** `zoom-in`

  - **zoomOut** `zoom-out`

  - **prev** `prev`

  - **next** `next`

  - **fullscreen** `fullscreen`

  - **actualSize** `actual-size`
 
  - **rotateLeft** `rotate-left`

  - **rotateRight** `rotate-right`

- **initMaximized** `false`
  > If false, the modal size will be set of image size or what you set.
  > 
  > If true, the modal size will be set maximized when init.

- **multiInstances** `true`
  > If true, it allow multiple instances.

- **initEvent** `click`
  > The event to init plugin. Another value is `dblclick`.

- **initAnimation** `true`
  > If false, it will not have animation at plugin's init.

- **fixedModalPos** `false`
  > if true, the modal position will be fixed when change images.

- **zIndex** `1090`
  > The modal style of z-index, it is useful with multiple instances.

- **dragHandle** ` `
  > The handle of draggable.

- **progressiveLoading** `true`
  > If true, the image will be rendered progressively.

## Events

You can define callbacks in `callbacks` option. In each callback `this` is  the `Magnify` instance. You can also get the element clicked of plugin's init from arguments `el` of Function.

```js
$("[data-magnify=gallery]").magnify({
  callbacks: {
    beforeOpen: function(el){
      // Will fire before modal is opened
    },
    opened: function(el){
      // Will fire after modal is opened
    },
    beforeClose: function(el){
      // Will fire before modal is closed
    },
    closed: function(el){
      // Will fire after modal is closed
    },
    beforeChange: function(index){
      // Will fire before image is changed
      // The arguments is the current image index of image group
    },
    changed: function(index){
      // Will fire after image is changed
      // The arguments is the next image index of image group
    }
  }
});
```

## License

MIT License

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
