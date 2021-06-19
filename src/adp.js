var ADP = (function () {

    var animationStack = [];

    var pushToStack = function (animationDetails) {
        animationStack.push(animationDetails);
    };

    var removeFromStack = function (element) {
        var index = -1;

        for (var i = 0; i < animationStack.length; i++) {
            if (animationStack[i].element === element) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            animationStack.splice(index, 1);
        }
    };

    var inStack = function (element, animationType) {
        var inStack = false;

        for (var i = 0; i < animationStack.length; i++) {
            if (animationStack[i].element === element && animationStack[i].animationType === animationType) {
                inStack = true;
                break;
            }
        }

        return inStack;
    };

    var getFromStack = function (element) {
        var animation = false;

        for (var i = 0; i < animationStack.length; i++) {
            if (animationStack[i].element === element) {
                animation = animationStack[i];
                break;
            }
        }

        return animation;
    };

    var isElementVisible = function (element) {
        return (element.classList.contains('adp-hide')) ? false : true;
    };

    var runCallback = function (callback) {
        if (callback) {
            callback();
        }
    };

    var cancelAnimation = function (element, nextAnimationType) {
        // The last animation is still running. Cancel It.
        // Get currently running animation details.
        var currentAnimation = getFromStack(element);

        element.classList.remove(currentAnimation.effect + '-adp-show');
        element.classList.remove(currentAnimation.effect + '-adp-hide');
        removeFromStack(element);

        if (nextAnimationType == 'show') {
            element.classList.add('adp-hide');
        }
    };

    var show = function (element, effect, callback) {
        if (inStack(element, 'show')) {
            // The element is currently being animated to show. So do nothing.
            return;
        }

        if (inStack(element, 'hide')) {
            // The element is currently being animated to hide. Cancel hide animation and proceed with show.
            cancelAnimation(element, 'show');
        }

        if (isElementVisible(element)) {
            // The element is already showing up.
            runCallback(callback);
            return;
        }

        var animationEndListener = function () {
            if (inStack(element, 'show')) {
                // The animation hasn't been canceled.
                removeFromStack(element);
                element.classList.remove(effect + '-adp-show');
                runCallback(callback);
            }
            element.removeEventListener(animationEndEvent, animationEndListener);
        };

        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.remove('adp-hide');
        element.classList.add(effect + '-adp-show');
        pushToStack({
            element: element,
            effect: effect,
            animationType: 'show'
        });
    };

    var hide = function (element, effect, callback) {
        if (inStack(element, 'hide')) {
            // The element is currently being animated to hide. So do nothing.
            return;
        }

        if (inStack(element, 'show')) {
            // The element is currently being animated to show. Cancel show animation and proceed with hide.
            cancelAnimation(element, 'hide');
        }

        if (!isElementVisible(element)) {
            // The element is hidden already.
            runCallback(callback);
            return;
        }

        var animationEndListener = function () {
            if (inStack(element, 'hide')) {
                // The animation hasn't been canceled.
                removeFromStack(element);
                element.classList.add('adp-hide');
                element.classList.remove(effect + '-adp-hide');
                runCallback(callback);
            }
            element.removeEventListener(animationEndEvent, animationEndListener);
        };

        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.add(effect + '-adp-hide');
        pushToStack({
            element: element,
            effect: effect,
            animationType: 'hide'
        });
    };

    var toggle = function (element, effect, callback) {
        if (inStack(element, 'show')) {
            // The element is currently being animated to show. So perform hide.
            hide(element, effect, callback);
            return;
        }
        if (inStack(element, 'hide')) {
            // The element is currently being animated to hide. So perform show.
            show(element, effect, callback);
            return;
        }

        if (isElementVisible(element)) {
            hide(element, effect, callback);
        } else {
            show(element, effect, callback);
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
