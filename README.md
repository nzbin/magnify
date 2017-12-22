# Magnify

Magnify is a jQuery plugin to view images just like in windows. 

[[ website ]]()

## Main Features

+ Modal draggable.
+ Modal resizable.
+ Modal maximized.
+ Image movable.
+ Image zoomable.
+ Image rotated.
+ Fullscreen showing.
+ Multiple instances.
+ Browser support.

## Getting started

### 1.Include files

The usage of magnify is very simple.

```html
<link href="/path/to/magnify.css" rel="stylesheet">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery.magnify.js"></script>
```
The icons in magnify use font-awesome default, you can customize them in options. If you use default options, you should link font-awesome css.

```html
<link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
```

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
  >	If ture, it allow keyboard control. It is similar to Windows viewer.
  
  - `←` prev image
  - `→` next image
  - `+` zoom in image
  - `-` zoom out image
  - `ctrl + alt + 0` image autual size
  - `ctrl + ,` rotate image left
  - `ctrl + .` rotate image right


- **title** `true`
  > If ture, it will show image title on header.

- **fixedModalSize** `false`
  > Init modal size will expand with image size.

- **modalWidth** `320`
  > Set init modal width.

- **modalHeight** `320`
  > Set init modal height.

- **gapThreshold** `0.02`
  > There will have a gap if modal too big to beyond the browser.

- **ratioThreshold** `0.01`
  > Image zoom ratio threshold.

- **minRatio** `0.1` (10%)
  > The min ratio to show image.

- **maxRatio** `16` (1600%)
  > The max ratio to show image.

- **icons** 
  > You can customize the icons class in following key.
  
  - **maximize** `fa fa-window-maximize` 

  - **close** `fa fa-close` 

  - **zoomIn** `fa fa-search-plus` 

  - **zoomOut** `fa fa-search-minus` 

  - **prev** `fa fa-arrow-left` 

  - **next** `fa fa-arrow-right` 

  - **fullscreen** `fa fa-photo` 

  - **actualSize** `fa fa-arrows-alt` 
 
  - **rotateLeft** `fa fa-rotate-left` 

  - **rotateRight** `fa fa-rotate-right` 

    

- **toolbar** `['zoomIn','zoomOut','prev','fullscreen','next','actualSize','rotateRight']`
  >	The buttons display in footer toolbar.



## License

MIT License

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.