$ = null;

/* Provides shortcuts to manage elements in the document */
function ElementSelector() {
    'use strict';
}

/* Returns an element form its id */
ElementSelector.prototype.get = function(element_id) {
    'use strict';

    return document.getElementById(element_id);
};

ElementSelector.prototype.getClass = function(classname) {
    'use strict';

    return document.getElementsByClassName(classname);
};

ElementSelector.prototype.activate = function(element_id) {
    return $.get(element_id).classList.toggle('is-active');
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    on_ready();
} else {
    document.addEventListener('DOMContentLoaded', on_ready);
}


function on_ready() {
    $ = new ElementSelector();

    // Add event listeners
    $.get('menu-toggle').addEventListener("click", function() {
        $.activate('menu-toggle');
        $.activate('menu-wrap-mobile');
    });
}

// contact/ Listener