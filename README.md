# Magnify

Magnify is a jQuery plugin to view images just like in windows. 

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

#### Include files

```html
<link href="/path/to/magnify.css" rel="stylesheet">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery.magnify.js"></script>
```

#### HTML structure

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

#### Call plugin

```js
$("[data-magnify=gallery]").magnify();
```

## Options
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| draggable | boolean | true | Allow modal dragging |
| resizable | boolean | true | Allow modal resizing |
| movable | boolean | true | Allow image moving |
| keyboard |boolean | true | Allow keyboard control |
| title | boolean | true | Show image title on header |
| fixedModalSize | boolean | false | Init modal size will expand with image size |
| modalWidth | number | 320 | Set init modal width |
| modalHeight | number | 320 | Set init modal height |
| gapThreshold | number | 0.02 | modal too big has a gap to window |
| ratioThreshold | number | 0.01 | image zoom ratio threshold |

## License

MIT License

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.