var pageReady = (function(){
    if (document.hidden == null || !document.hidden) {
        $('html').addClass('page-ready');
    }
    function onFocus(){
        $('html').addClass('page-ready');
    }
    window.onfocus = onFocus;
})();
