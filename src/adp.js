var ADP = (function () {

    var states = {
        ANIMATION_COMPLETE: "animation-complete",
        ALREADY_VISIBLE: "already-visible",
        SHOW_ALREADY_IN_PROGRESS: "show-already-in-progress",
        ALREADY_HIDDEN: "already-hidden",
        HIDE_ALREADY_IN_PROGRESS: "hide-already-in-progress",
        ANIMATION_CANCELLED: "animation-cancelled"
    };

    var animationStack = [];

    function pushToStack(animationDetails) {
        animationStack.push(animationDetails);
    };

    function removeFromStack(element) {
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

    function inStack(element, animationType) {
        var inStack = false;

        for (var i = 0; i < animationStack.length; i++) {
            if (animationStack[i].element === element && animationStack[i].animationType === animationType) {
                inStack = true;
                break;
            }
        }

        return inStack;
    };

    function getFromStack(element) {
        var animation = false;

        for (var i = 0; i < animationStack.length; i++) {
            if (animationStack[i].element === element) {
                animation = animationStack[i];
                break;
            }
        }

        return animation;
    };

    function isElementVisible(element) {
        return (element.classList.contains('adp-hide')) ? false : true;
    };

    function runCallback(callback, state) {
        if (callback) {
            callback(state);
        }
    };

    function cancelAnimation(element, nextAnimationType) {
        // The last animation is still running. Cancel It.
        // Get currently running animation details.
        var currentAnimation = getFromStack(element);

        element.classList.remove(currentAnimation.effect + '-adp-show');
        element.classList.remove(currentAnimation.effect + '-adp-hide');
        runCallback(currentAnimation.callback, states.ANIMATION_CANCELLED);
        removeFromStack(element);

        if (nextAnimationType == 'show') {
            element.classList.add('adp-hide');
        }
    };

    function show(element, effect, callback) {
        if (inStack(element, 'show')) {
            // The element is currently being animated to show. So do nothing.
            runCallback(callback, states.SHOW_ALREADY_IN_PROGRESS);
            return;
        }

        if (inStack(element, 'hide')) {
            // The element is currently being animated to hide. Cancel hide animation and proceed with show.
            cancelAnimation(element, 'show');
        }

        if (isElementVisible(element)) {
            // The element is already showing up.
            runCallback(callback, states.ALREADY_VISIBLE);
            return;
        }

        function animationEndListener() {
            if (inStack(element, 'show')) {
                // The animation hasn't been canceled.
                removeFromStack(element);
                element.classList.remove(effect + '-adp-show');
                runCallback(callback, states.ANIMATION_COMPLETE);
            }
            element.removeEventListener(animationEndEvent, animationEndListener);
        };

        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.remove('adp-hide');
        element.classList.add(effect + '-adp-show');
        pushToStack({
            element: element,
            effect: effect,
            callback: callback,
            animationType: 'show'
        });
    };

    function hide(element, effect, callback) {
        if (inStack(element, 'hide')) {
            // The element is currently being animated to hide. So do nothing.
            runCallback(callback, states.HIDE_ALREADY_IN_PROGRESS);
            return;
        }

        if (inStack(element, 'show')) {
            // The element is currently being animated to show. Cancel show animation and proceed with hide.
            cancelAnimation(element, 'hide');
        }

        if (!isElementVisible(element)) {
            // The element is hidden already.
            runCallback(callback, states.ALREADY_HIDDEN);
            return;
        }

        function animationEndListener() {
            if (inStack(element, 'hide')) {
                // The animation hasn't been canceled.
                removeFromStack(element);
                element.classList.add('adp-hide');
                element.classList.remove(effect + '-adp-hide');
                runCallback(callback, states.ANIMATION_COMPLETE);
            }
            element.removeEventListener(animationEndEvent, animationEndListener);
        };

        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.add(effect + '-adp-hide');
        pushToStack({
            element: element,
            effect: effect,
            callback: callback,
            animationType: 'hide'
        });
    };

    function toggle(element, effect, callback) {
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

    function getEventName() {
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
        toggle: toggle,
        states: states
    };

}());
