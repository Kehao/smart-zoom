# smart-zoom
### Usage

``` console
npm install zepto-smart-zoom --save
```

``` html
<div class="zoom">
    <img class='source-img first' src="../images/test.jpeg" alt="">
    <img class='source-img' src="../images/test.jpeg" alt="">
</div>
```

``` javascript
require('zepto');
require('zepto-smart-zoom');

$('.zoom').smartZoom(/*{element: '.source-img'}*/);

```
