# smart-zoom
### Usage

``` html
<div class="zoom">
    <img class='source-img first' src="../images/test.jpeg" alt="">
    <img class='source-img' src="../images/test.jpeg" alt="">
</div>
```

``` javascript
require('zepto');
require('smart-zoom')

$('.zoom').smartZoom(/*{element: '.source-img'}*/);

```
