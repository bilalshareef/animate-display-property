var ADP = (function () {

    /**
     * State representing what happened to the element when show/hide was called.
     * @type {Object}
     */
    var states = {
        ANIMATION_COMPLETE: "animation-complete",
        ALREADY_VISIBLE: "already-visible",
        SHOW_ALREADY_IN_PROGRESS: "show-already-in-progress",
        ALREADY_HIDDEN: "already-hidden",
        HIDE_ALREADY_IN_PROGRESS: "hide-already-in-progress",
        ANIMATION_CANCELLED: "animation-cancelled"
    };

    /**
     * Animation stack to maintain active animations.
     * @type {Array<Object>}
     */
    var animationStack = [];

    /**
     * Function to add an active animation to animation stack.
     * @param {Object} animationDetails Animation details consisting of element, effect, callback and animationType.
     */
    function pushToStack(animationDetails) {
        animationStack.push(animationDetails);
    }

    /**
     * Function to remove an inactive animation from animation stack.
     * @param {Object} element DOM element whose animation data to be removed from animation stack.
     */
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
    }

    /**
     * Function to check if an element with specific animation type is present in the animation stack or not.
     * @param {Object} element DOM element which is being checked if present in animation stack.
     * @param {string} animationType Either show or hide.
     * @returns {boolean} Returns true if element present in stack and false otherwise.
     */
    function inStack(element, animationType) {
        var inStack = false;

        for (var i = 0; i < animationStack.length; i++) {
            if (animationStack[i].element === element && animationStack[i].animationType === animationType) {
                inStack = true;
                break;
            }
        }

        return inStack;
    }

    /**
     * Function to get active animation of an element from animation stack.
     * @param {Object} element DOM element whose animation details are being fetched.
     * @returns {Object|boolean} Animation details for the passed element. If animation not present in stack, returns false.
     */
    function getFromStack(element) {
        var animation = false;

        for (var i = 0; i < animationStack.length; i++) {
            if (animationStack[i].element === element) {
                animation = animationStack[i];
                break;
            }
        }

        return animation;
    }

    /**
     * Function to check if a DOM element is visible or not.
     * @param {Object} element DOM element which is being checked if visible or not.
     * @returns {boolean} Returns true if element is visible and false otherwise.
     */
    function isElementVisible(element) {
        return (element.classList.contains("adp-hide")) ? false : true;
    }

    /**
     * Function to run callback(if present) which indicates end of show or hide operation.
     * @param {function} callback Callback function which is passed by the caller of show, hide or toggle methods.
     * @param {string} state State indicating what happened to the element when show/hide was called.
     */
    function runCallback(callback, state) {
        if (callback) {
            callback(state);
        }
    }

    /**
     * Function to cancel currently running animation.
     * @param {Object} element DOM element whose animation needs to be cancelled.
     * @param {string} nextAnimationType Either show or hide.
     */
    function cancelAnimation(element, nextAnimationType) {
        // The last animation is still running. Cancel It.
        // Get currently running animation details.
        var currentAnimation = getFromStack(element);

        element.classList.remove(currentAnimation.effect + "-adp-show");
        element.classList.remove(currentAnimation.effect + "-adp-hide");
        runCallback(currentAnimation.callback, states.ANIMATION_CANCELLED);
        removeFromStack(element);

        if (nextAnimationType == "show") {
            element.classList.add("adp-hide");
        }
    }

    /**
     * Function to show an element with animation.
     * @param {Object} element DOM element which needs to be shown.
     * @param {string} effect The animation effect to be applied while showing the element.
     * @param {function} callback Callback function which will be invoked once the show operation is completed.
     * @returns void
     */
    function show(element, effect, callback) {
        if (inStack(element, "show")) {
            // The element is currently being animated to show. So do nothing.
            runCallback(callback, states.SHOW_ALREADY_IN_PROGRESS);
            return;
        }

        if (inStack(element, "hide")) {
            // The element is currently being animated to hide. Cancel hide animation and proceed with show.
            cancelAnimation(element, "show");
        }

        if (isElementVisible(element)) {
            // The element is already showing up.
            runCallback(callback, states.ALREADY_VISIBLE);
            return;
        }

        /**
         * Event listener function for animation end.
         * If the element is in stack then animation is successfully completed.
         */
        function animationEndListener() {
            if (inStack(element, "show")) {
                // The animation hasn't been canceled.
                removeFromStack(element);
                element.classList.remove(effect + "-adp-show");
                runCallback(callback, states.ANIMATION_COMPLETE);
            }
            element.removeEventListener(animationEndEvent, animationEndListener);
        }

        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.remove("adp-hide");
        element.classList.add(effect + "-adp-show");
        pushToStack({
            element: element,
            effect: effect,
            callback: callback,
            animationType: "show"
        });
    }

    /**
     * Function to hide an element with animation.
     * @param {Object} element DOM element which needs to be hidden.
     * @param {string} effect The animation effect to be applied while hiding the element.
     * @param {function} callback Callback function which will be invoked once the hide operation is completed.
     * @returns void
     */
    function hide(element, effect, callback) {
        if (inStack(element, "hide")) {
            // The element is currently being animated to hide. So do nothing.
            runCallback(callback, states.HIDE_ALREADY_IN_PROGRESS);
            return;
        }

        if (inStack(element, "show")) {
            // The element is currently being animated to show. Cancel show animation and proceed with hide.
            cancelAnimation(element, "hide");
        }

        if (!isElementVisible(element)) {
            // The element is hidden already.
            runCallback(callback, states.ALREADY_HIDDEN);
            return;
        }

        /**
         * Event listener function for animation end.
         * If the element is in stack then animation is successfully completed.
         */
        function animationEndListener() {
            if (inStack(element, "hide")) {
                // The animation hasn't been canceled.
                removeFromStack(element);
                element.classList.add("adp-hide");
                element.classList.remove(effect + "-adp-hide");
                runCallback(callback, states.ANIMATION_COMPLETE);
            }
            element.removeEventListener(animationEndEvent, animationEndListener);
        }

        element.addEventListener(animationEndEvent, animationEndListener);
        element.classList.add(effect + "-adp-hide");
        pushToStack({
            element: element,
            effect: effect,
            callback: callback,
            animationType: "hide"
        });
    }

    /**
     * Function to toggle an element between show and hide.
     * @param {Object} element DOM element which needs to be shown/hidden.
     * @param {string} effect The animation effect to be applied while showing/hiding the element.
     * @param {function} callback Callback function which will be invoked once the show/hide operation is completed.
     * @returns void
     */
    function toggle(element, effect, callback) {
        if (inStack(element, "show")) {
            // The element is currently being animated to show. So perform hide.
            hide(element, effect, callback);
            return;
        }
        if (inStack(element, "hide")) {
            // The element is currently being animated to hide. So perform show.
            show(element, effect, callback);
            return;
        }

        if (isElementVisible(element)) {
            hide(element, effect, callback);
        } else {
            show(element, effect, callback);
        }
    }

    /**
     * Function to get proper animation end event name so that older versions of browsers are also supported.
     * @returns {string} Animation end event name.
     */
    function getEventName() {
        var element = document.createElement("div");
        if (element.style.webkitAnimation) {
            return "webkitAnimationEnd";
        } else if (element.style.mozAnimation) {
            return "mozAnimationEnd";
        } else {
            return "animationend";
        }
    }

    /**
     * Animation end event name.
     * @type {string}
     */
    var animationEndEvent = getEventName();

    return {
        show: show,
        hide: hide,
        toggle: toggle
    };

}());

window.ADP = ADP;
