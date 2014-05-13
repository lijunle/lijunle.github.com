var hint = {};

hint.run = function() {
    hint.setup();
    hint.bind();
}

hint.setup = function() {
    // create loading DOM node
    var load = $('<span id="loading">').text('loading')
        .append($('<span id="loadingpoint">'))
        .append($('<a id="stop" href="javascript:void(0);">').text('stop'));

    // create contact DOM node
    var contact = $('<span>')
        .append(', contact ')
        .append($('<a>').attr({ href: blog.model.contact_me, target: '_blank' }).text('me'))
        .append(' or ')
        .append($('<a id="try" href="javascript:void(0);">').text('try'))
        .append(' again later.');

    // setup jsonp request for hint
    $.jsonp.setup({
        callbackParameter: 'callback',
        timeout: blog.model.timeout,
        cache: true,
        beforeSend: function(x) {
            $('#hint').html(load).stop().stop().show();
        },
        complete: function(x, status) {
            if (status == 'success') {
                $('#hint').hide();
            } else {
                var error = $('<span>').text('Request ' + status).append(contact);
                $('#hint').html(error).delay(10000).fadeOut(800);
            }
        }
    });

    window.onpopstate = function(event) {
        if (event.state != null) {
            eval(event.state.entry).setState(event.state.view);
        }
    }
}

hint.bind = function() {
    // dynamically roll the loading points
    var timeout = 100;
    setTimeout(function loadingpoint() {
        $('#loadingpoint').append('.');
        if ($('#loadingpoint').text().length > 5) {
            $('#loadingpoint').text('.');
        }
        setTimeout(loadingpoint, timeout);
    }, timeout);

    // bind anchor to abort jsonp request
    var abort = $('<span>').text('The requeset is aborted by user.');
    $('#hint #stop').live('click', function() {
        if (blog.model.jsonp instanceof Object) {
            blog.model.jsonp.abort();
            $('#hint').html(abort).delay(2000).fadeOut(800);
        }
    });

    // bind anchor to try the jsonp request again
    $('#hint #try').live('click', function() {
        blog.model.jsonp = $.jsonp({
            url: blog.model.jsonp.url,
            data: blog.model.jsonp.data,
            success: blog.model.jsonp.success
        });
    });
}

