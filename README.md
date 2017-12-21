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

### 2.html structure

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



## License

MIT License

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.