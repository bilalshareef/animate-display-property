var ADP = (function () {
    
    var isElementVisible = function (element) {
        return (element.classList.contains('adp-hide')) ? false : true;
    };
    
    var runCallback = function (callback) {
        if (callback) {
            callback();
        }
    };
    
    var show = function (element, animationName, callback) {
        if (isElementVisible(element)) {
            // The element is already showing up.
            runCallback(callback);
            return;
        }
        
        var animationEndListener = function () {
            element.classList.remove(animationName + '-adp-show');
            runCallback(callback);
            element.removeEventListener(animationEndEvent, animationEndListener);
        };
        
        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.remove('adp-hide');
        element.classList.add(animationName + '-adp-show');
    };
    
    var hide = function (element, animationName, callback) {
        if (!isElementVisible(element)) {
            // The element is hidden already.
            runCallback(callback);
            return;
        }
        
        var animationEndListener = function () {
            element.classList.add('adp-hide');
            element.classList.remove(animationName + '-adp-hide');
            runCallback(callback);
            element.removeEventListener(animationEndEvent, animationEndListener);
        };
        
        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.add(animationName + '-adp-hide');
    };
    
    var toggle = function (element, animationName, callback) {
        if (isElementVisible(element)) {
            hide(element, animationName, callback);
        } else {
            show(element, animationName, callback);
        }
    };
    
    var getEventName = function () {
        var element = document.createElement('div');
        if (element.style.webkitAnimation) {
            return 'webkitAnimationEnd';
        } else if (element.style.mozAnimation) {
            return 'mozAnimationEnd';
        } else {
            return 'animationend';
        }
    };
    
    var animationEndEvent = getEventName();
    
    return {
        show: show,
        hide: hide,
        toggle: toggle
    };
    
}());
