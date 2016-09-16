var menu = (function() {
    var scrolled;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.top-header').outerHeight();
    // escape id

    function hasScrolled() {
        var top = $(this).scrollTop();
        if(Math.abs(lastScrollTop - top) <= delta) {
            return;
        }


        if (top > lastScrollTop && top > navbarHeight) {
            $('.top-header').addClass('is-minimized');
        } else {
            if(top + $(window).height() < $(document).height()) {
                $('.top-header').removeClass('is-minimized');
            }
        }
        lastScrollTop = top;
    }
    $(function(){
        $(window).scroll(function(event) {
            scrolled = true;
        });
        setInterval(function(){
            if(scrolled) {
                hasScrolled();
                scrolled = false;
            }
        }, 250);
    });
    $(".menu-button").click(function(){
        $(this).toggleClass('open');
        $('.menu').toggleClass("closed");
        $('html').toggleClass("no-scrollbar");
    });
    console.log('this is the menu action');
})();
