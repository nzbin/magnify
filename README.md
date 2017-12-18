# Magnify

Magnify a jQuery plugin to view images just like in windows. 

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

### Include files

```html
<link href="/path/to/magnify.css" rel="stylesheet">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery.magnify.js"></script>
```

### HTML Structure

```html
<a data-magnify="gallery" href="">
  <img src="">
</a>
<a data-magnify="gallery" href="">
  <img src="">
</a>
<a data-magnify="gallery" href="">
  <img src="">
</a>
```

### Call plugin

```html
$("[data-magnify=gallery]").magnify();
```

## License

MIT License

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.