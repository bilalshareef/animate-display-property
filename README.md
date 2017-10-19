# animate-display-property
A JavaScript micro plugin to add transition effects for the CSS display property. This plugin uses CSS3 animations to acheive transition effects when an element's display property changes.

As you all know that CSS3 transitions doesn't work for the display property and we switch between `display: block/inline/flex` and `display: none` to show and hide elements. I found it difficult in my projects to show and hide elements with transition effects. So I wrote this micro plugin to hide and show elements with effects.

Ofcourse, there are many libraries out there to acheive this and there are some CSS tricks as well like changing element's height, changing opacity, etc. But I wanted a precise solution with minimal code.

## Quick Start

To use the plugin, you need to include the js and css files of the plugin in your html document.

```html
<link type="text/css" rel="stylesheet" href="path/to/adp.css">
<script type="text/javascript" src="path/to/adp.js"></script>
```

Typically, to hide an element, we will get the element object and update display property with a value 'none'. Here, use the hide method of the plugin which takes two mandatory arguments(element and animation effect).

```js
var elemToHide = document.querySelector('.content-wrap');
ADP.hide(elemToHide, 'fade');
```

To show an element, use the show method of the plugin which is similar to the hide method.

```js
var elemToShow = document.querySelector('.content-wrap');
ADP.show(elemToShow, 'fade');
```

The functionality of the hide method is that it first adds the animation effect for the element and when the animation completes `adp-hide` class is added which has display property with value `none`.

The functionality of the show method is that it first removes the `adp-hide` class from the element and then adds the animation effect. This plugin makes use of the `animationend` event to fire the callbacks which we will see in the next section.

## Callbacks

The show and hide methods of the plugin also take an optional third parameter which is a callback function. This callback function will be fired on completion of the animation effect.

```js
var elemToShow = document.querySelector('.content-wrap');
ADP.show(elemToShow, 'fade', function() {
    console.log('Callback fired');
});
```

Note that if the element is already visible and if you call the show method for that element, then callback will be fired eventhough the display property's value has not changed. The same applies to the hide method as well.

## Effects

You can apply any kind of animation effect using this plugin and `adp.css` file contains some basic animation effects.

You can create your own animation effects and use them with the plugin. The following is the CSS for a sample fade animation effect.

```css
@keyframes fade-adp-show {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes fade-adp-hide {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.fade-adp-show, .fade-adp-hide {
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.7,0,0.3,1);
}

.fade-adp-show {
    animation-name: fade-adp-show;
}

.fade-adp-hide {
    animation-name: fade-adp-hide;
}
```

In the above code, the name of the animation is `fade` and you need to add two keyframe rules(one for the hiding effect and other for showing effect). The syntax for the animation names are [animation-name]-adp-show and [animation-name]-adp-hide.

Then, you need to write animation styles for two classes([animation-name]-adp-show and [animation-name]-adp-hide) which will be used by the `adp.js` file to perform the animations.

If you are not using any of the animation effects provided in the `adp.css` file, then feel free to ignore the file completely. In that case, you have to add the following CSS code somewhere in your styles.

```css
.adp-hide {
    display: none !important;
}
```

You can also use two different animation effects for showing and hiding the element.

```js
var elemToHide = document.querySelector('.content-wrap');
ADP.hide(elemToHide, 'fade'); // fade effect is used when hiding the element.
```

```js
var elemToShow = document.querySelector('.content-wrap');
ADP.show(elemToShow, 'slide-left'); // slide-left effect is used when showing up the element.
```
