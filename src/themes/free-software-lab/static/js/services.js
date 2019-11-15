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

    $.get('confirm').addEventListener("click", function(e) {
        e.preventDefault();

        $.get('response').innerHTML = "";
        data = new FormData($.get('book-service'));
        data.append("service", $.get('service-title').innerHTML);
        req.open('POST', url + 'book-service');
        req.send(data);

        $.activate('loading');
        req.onload = function() {
            json = JSON.parse(this.responseText);
            $.activate('loading');
            if (json.status === 1) {
                $.get('response').innerHTML = '&#10004; Your request has been processed.';
            } else {
                $.get('response').innerHTML = 'Sorry, your request could not be processed. Retry.';
            }
        };
    });
}