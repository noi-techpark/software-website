if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    on_ready();
} else {
    document.addEventListener('DOMContentLoaded', on_ready);
}

data = null;

function on_ready() {
    var bookbutton = $.getClass('book');
    for (var i = 0; i < bookbutton.length; i++) {
        bookbutton[i].addEventListener("click", function(e) {
            var selection = e.explicitOriginalTarget.dataset.title;
            $.get('service-title').innerHTML = selection;
            $.activate('booking');
        });
    }

    var x = $.get('service-booking-close');
    if (x) {
        x.addEventListener("click", function() {
            $.activate('booking');
        });
    }
}