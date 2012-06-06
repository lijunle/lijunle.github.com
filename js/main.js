var GLOBAL = new Array();

function configure() {
    // load blog configure
    $.ajax({
        url: 'configure.json',
        datatype: 'json',
        async: false,
        success: function(data) {
            GLOBAL['apibase'] = data['api'] + data['username'] + '/' + data['repository'];
            GLOBAL['blogname'] = data['blog'];
            GLOBAL['timeout'] = data['timeout'];
            GLOBAL['pagelimits'] = data['pagelimits'];
            GLOBAL['contactme'] = data['contactme'];
            GLOBAL['footer'] = data['footer'];
        }
    });
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

    // setup ajax hints
    $.jsonp.setup({
        callbackParameter: 'callback',
        timeout: GLOBAL['timeout'],
        cache: true,
        beforeSend: function() {
            $('#hint').html(load).show();
        },
        complete: function(xOption, status) {
            if (status == 'success') {
                $('#hint').hide();
            } else {
                var error = $('<span>').text('Request ' + status).append(contact);
                $('#hint').html(error).delay(10000).fadeOut(800);
            }
        }
    });

    $('#hint').live('click', function() {
        if ($(this).has('span#loading').length == 0) {
            $(this).stop().fadeOut(800);
        }
    });
}

$(function() {
    configure();
    hint();

    // set blog name for title and header
    $('title').html(GLOBAL['blogname']);
    $('#header').append($('<h1>').text(GLOBAL['blogname']));

    // append information to menu bar
    var changesets = $('<a>').attr({ href: 'javascript:void(0);', id: 'changesets' }).text('Changesets');
    var sources = $('<a>').attr({ href: 'javascript:void(0);', id: 'sources' }).text('Sources');
    $('#menu').append(changesets).append(sources);

    // append footer to footer div
    $('#footer').html(GLOBAL['footer']);

    // bind click action for menu
    $('#changesets').click(function() {
        getChangesetsList('tip', GLOBAL['pagelimits']);
    });
    $('#sources').click(function() {
        getSourcesList('tip', '');
    });

    // set home page for show changesets list
    // if you want to set show sources list by default
    // uncomment the next line
    getChangesetsList('tip', GLOBAL['pagelimits']);
    //getSourcesList('tip', '');
});
