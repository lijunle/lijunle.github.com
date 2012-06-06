function get(key, shortkey) {
    if (GLOBAL['GET'][key] != undefined) {
        return GLOBAL['GET'][key];
    } else if (GLOBAL['GET'][shortkey] != undefined) {
        return GLOBAL['GET'][shortkey];
    } else {
        return undefined;
    }
}

function getPath(source) {
    // judge the source path is a folder or a file
    // (according to the path has dot or not)
    if (source.match(/\./) == null) {
        return [ source ];
    } else {
        var path = source.split('/');
        for (var i = 1; i < path.length - 1; i++) {
            path[0] += '/' + path[i];
        }
        return [ path[0], path[path.length - 1] ];
    }
}

function getState() {
    return {
        // FIXME too much bugs
        /*'class': $('#content').attr('class'),
        'content': $('#content').html(),
        'changesetslist': GLOBAL['changesetslist'],
        'changeset': get('changeset', 'c'),
        'source': get('source', 's')*/
    };
}

function setState() {
    if (event.state != null) {
        // FIXME too much bugs
        /*if (event.state.class != 'sources') {
            $('#content')
                .attr({ class: event.state.class })
                .html(event.state.content);
            GLOBAL['changesetslist'] = event.state.changesetslist;
        } else {
            showPage(event.state.changeset, event.state.source);
        }*/
    }
}

function hint() {
    // create loading DOM node
    var load = $('<span>')
        .attr({ id: 'loading' })
        .text('loading')
        .append($('<span>').attr({ id: 'loadingpoint' }))
        .append($('<a>')
                .attr({ id: 'stop', href: 'javascript:void(0);' })
                .text('stop')
               );

    // dynamically roll the loading points
    var timeout = 100;
    setTimeout(function loadingpoint() {
        $('#loadingpoint').append('.');
        if ($('#loadingpoint').text().length > 5) {
            $('#loadingpoint').text('.');
        }
        setTimeout(loadingpoint, timeout);
    }, timeout);

    // create abort DOM node
    var abort = $('<span>').text('The requeset is aborted by user.');

    // bind anchor to abort jsonp request
    $('#stop').live('click', function() {
        if (GLOBAL['jsonp'] instanceof Object) {
            GLOBAL['jsonp'].abort();
            $('#hint').html(abort).delay(2000).fadeOut(800);
        }
    })

    // create contact DOM node
    var contact = $('<span>')
        .append(', contact ')
        .append($('<a>')
                .attr({ href: GLOBAL['contactme'], target: '_blank' })
                .text('me')
               )
        .append(' or try again later.');

    // setup jsonp request for hint
    $.jsonp.setup({
        callbackParameter: 'callback',
        timeout: GLOBAL['timeout'],
        cache: true,
        beforeSend: function(x) {
            $('#hint').html(load).stop().stop().show();
        },
        complete: function(x, status) {
            if (status == 'success') {
                $('#hint').hide();
                if (GLOBAL['_hack_anchor'] === false) { // TODO hack not to make a new url
                    delete GLOBAL['_hack_anchor'];
                } else {
                    history.pushState(getState(), $('title').text(), x.anchor);
                }
            } else {
                var error = $('<span>').text('Request ' + status).append(contact);
                $('#hint').html(error).delay(10000).fadeOut(800);
            }
        }
    });

    // FIXME too much bug for pop back history
    //window.onpopstate = setState;
}

