(function () {
    
    var effectElement = document.querySelector('.adp-logo-wrapper h1');
    var currentEffect = 'fade';
    
    var showElement = function () {
        ADP.show(effectElement, currentEffect);
    };
    
    var hideElement = function () {
        ADP.hide(effectElement, currentEffect);
    };
    
    var toggleElement = function () {
        ADP.toggle(effectElement, currentEffect);
    };
    
    var handleEffectChange = function (event) {
        currentEffect = event.currentTarget.value;
        effectElement.classList.add('adp-hide');
        showElement();
    };
    
    var attachListeners = function () {
        document.getElementById('effects-select').addEventListener('change', handleEffectChange);
        document.getElementById('show-button').addEventListener('click', showElement);
        document.getElementById('hide-button').addEventListener('click', hideElement);
        document.getElementById('toggle-button').addEventListener('click', toggleElement);
    };
    
    var onLoad = function () {
        attachListeners();
    };
    
    window.addEventListener('load', onLoad);
    
}());