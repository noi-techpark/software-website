if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    on_ready();
} else {
    document.addEventListener('DOMContentLoaded', on_ready);
}


function on_ready() {
    var bookbutton = $.getClass('book');
    for (var i = 0; i < bookbutton.length; i++) {
        bookbutton[i].addEventListener("click", function(e) {
            var selection = e.explicitOriginalTarget.dataset.title;
            $.get('service-title').innerHTML = selection;
            $.activate('booking');
        });
    }

    $.get('service-booking-close').addEventListener("click", function() {
        $.activate('booking');
    });

    $.get('booking-confirm').addEventListener("click", function() {
        $.activate('loading');
    })
}