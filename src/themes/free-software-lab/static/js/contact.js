if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    on_ready();
} else {
    document.addEventListener('DOMContentLoaded', on_ready);
}


function on_ready() {
    $.get('confirm').addEventListener("click", function(e) {
        e.preventDefault();

        $.get('response').innerHTML = "";
        data = new FormData($.get('contact'));
        console.log(data);
        req.open('POST', url + 'contact');
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