var jumpAnimation = (function() {
    function q(x) {
        return x.replace(/(:|\.)/g,'\\$1');
    }
    $('a.jump, a.footnote-backref, a.footnote-ref, a[href^="#"]:not(.carousel-control), .home a[href^="/#"]').click(function(event) {

        event.preventDefault();

        var the_url = this.href;
        var parts = the_url.split("#");
        var target = q(parts[1]);

        var offset = $("#"+target).offset();
        var top = offset.top;
        $('html, body').animate({scrollTop:top-150}, 500);
    });
})();
