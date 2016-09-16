var toc = (function() {
    $('.touchevents .toc').click(function(e) {
        $(this).toggleClass('open');
    });
    $('.toc').affix({
        offset: {
          top: $('.toc').offset().top - 140,
          bottom: ($('footer').outerHeight(true) + 70)
        }
    });
    console.log('This is the toc Action');
})();
