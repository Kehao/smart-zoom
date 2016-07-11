;(function (factory) {
    'use strict';
    // if (typeof define === 'function' && define.amd) {
    //     // Register as an anonymous AMD module:
    //     define(['zepto'], factory);

    // } else if (typeof exports === 'object') {
    //     // Node/CommonJS:
    //     factory(
    //         require('zepto')
    //     );
    // } else {
    //     // Browser globals:
        factory(
            window.$
        );
    // }
}(function ($) {
   'use strict';

    var SmartZoom = function(container, options) {
        this.defaults = {
            'element': 'img' 
        }
        this.options = $.extend({}, this.defaults, options);
        this.$container = container;
        this.$elements = this.$container.find(this.options.element);
    };

    SmartZoom.prototype.init = function() {
        var self = this;
        this.$elements.each(function(){
            var zoom = new Zoom(self.$container, $(this));
            zoom.init();
        })
    };


    var Zoom = function(container, element) {
        this.$container = container;
        this.$element = element;
    };

    Zoom.prototype.init = function() {
        this.$container.css({"position":"relative"});
        this.$element.css({"position":"absolute"});
        this.$element.on("touchstart", this.onTouchstart.bind(this));
        this.$element.on("touchmove", this.onTouchmove.bind(this));
        this.$element.on("touchend", this.onTouchend.bind(this));

        this.posTop = parseInt(this.$element.css('top'));        
        this.posLeft = parseInt(this.$element.css('left'));

        this.isMoveMode = true;
        this.startPoint = [0, 0];
        this.extraX = 0;
        this.extraY = 0;

        this.startDis = 0;
        this.extraScale = 1;
    };

    Zoom.toFloat =  function(num) {
        return parseFloat(num.toFixed(2));
    };

    Zoom.prototype.move = function (touch) {
        var targetPoint = [Math.floor(touch.pageX), Math.floor(touch.pageY)]
        this.extraX += (targetPoint[0] - this.startPoint[0]);
        this.extraY += (targetPoint[1] - this.startPoint[1]);
          
        var posTop = this.extraY;
        if (!isNaN(this.posTop)) {
            posTop += this.posTop 
        }

        var posLeft = this.extraX;
        if (!isNaN(this.posLeft)) {
            posLeft += this.posLeft; 
        }

        this.$element.css({
            "left": posLeft,
            "top": posTop
        });
        this.startPoint = targetPoint;
    };

    Zoom.prototype.scale = function (touches) {
        var touch0 = touches[0];
        var touch1 = touches[1];
        var disx = (touch1.pageX - touch0.pageX) * (touch1.pageX - touch0.pageX);
        var disy = (touch1.pageY - touch0.pageY) * (touch1.pageY - touch0.pageY);
        var nowDis = Math.sqrt(disx + disy);
        this.extraScale += Zoom.toFloat(Math.floor(nowDis - this.satrtDis) * 0.005);

        this.$element.css({
            "transform": "scale(" + this.extraScale +")",
            "-webkit-transform": "scale("+ this.extraScale +")"
        });
        this.satrtDis = nowDis;
    };


    Zoom.prototype.onTouchstart = function (event) {
        var touches = event.touches || event.originalEvent.touches;
        event.preventDefault();
        event.stopPropagation();

        if (!touches.length) throw new Error('Cant get touch points !');

        if (touches.length === 1) {
            this.isMoveMode = true;
            var touch = touches[0];
            this.startPoint = [touch.pageX, touch.pageY]; 
        } else {
            this.isMoveMode = false;
            var touch0 = touches[0];
            var touch1 = touches[1];
            var disx = (touch1.pageX - touch0.pageX) * (touch1.pageX - touch0.pageX);
            var disy = (touch1.pageY - touch0.pageY) * (touch1.pageY - touch0.pageY);
            this.satrtDis = Math.sqrt(disx + disy);
        }
    }

    Zoom.prototype.onTouchmove = function (event) {
        var touches = event.touches || event.originalEvent.touches;
        event.preventDefault();
        event.stopPropagation();
        if (!touches.length) throw new Error('Cant get touch points !');

        if (this.isMoveMode) {
            this.move(touches[0]);
        } else {
            if (touches.length < 2) throw new Error('Scale Mode: Cant get touch points !');
            this.scale(touches);
        }
    }

    Zoom.prototype.onTouchend = function (event) {
        return false;
    }

    $.fn.smartZoom = function(options) {
        return this.each(function() {
            var smartZoom = new SmartZoom($(this), options);
            smartZoom.init();
        })
    }

}));
