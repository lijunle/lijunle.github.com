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
            GLOBAL['pagelimits'] = data['pagelimits'];
            GLOBAL['contactme'] = data['contactme'];
            GLOBAL['footer'] = data['footer'];
        }
    });

    // if footer is undefined, set it to default
    if (GLOBAL['footer'] === undefined) {
        GLOBAL['footer'] = $('<span>').append('power by ')
            .append($('<a>')
                    .attr({ href: 'https://bitbucket.org/lijunle/lijunle.bitbucket.org', target: '_blank' })
                    .text('CodeBlog')
                   )
            .append(' and ')
            .append($('<a>')
                    .attr({ href: 'http://weibo.com/lijunle', target: '_blank' })
                    .text('LiJunLe')
                   );
    }
}

function hint() {
    // create loading DOM node
    var load = $('<span>')
        .attr({ id: 'loading' })
        .text('loading')
        .append($('<span>').attr({ id: 'loadingpoint' }))
        .append($('<br>'))
        .append($('<a>')
                .attr({ id: 'stop', href: 'javascript:void(0);' })
                .text('stop it!')
               );

    // dynamically roll the loading points
    var timeout = 100;
    setTimeout(function loadingpoint() {
        var length = $('#loadingpoint').text().length % 5 + 1;
        $('#loadingpoint').empty();
        for (var i = 0; i < length; i++) {
            $('#loadingpoint').append('.');
        }
        setTimeout(loadingpoint, timeout);
    }, timeout);

    // create abort DOM node
    var abort = $('<span>').text('The requeset is aborted by user.');

    // bind anchor to abort jsonp request
    $('#stop').live('click', function() {
        if (GLOBAL['jsonp'] instanceof Object) {
            GLOBAL['jsonp'].abort();
            $('#hint').html(abort);
            $(abort).show().delay(2000).fadeOut(800);
        }
    })

    // create contactme DOM node
    var contactme = $('<span>')
        .append('Error occur, contact ')
        .append($('<a>')
                .attr({ href: GLOBAL['contactme'], target: '_blank' })
                .text('me')
               )
        .append(' or try again later.<br/>');

    // setup ajax hints
    $.jsonp.setup({
        callbackParameter: 'callback',
        timeout: 7000,
        cache: true,
        beforeSend: function() {
            $('#hint').html(load);
        },
        complete: function(xOption, status) {
            if (status == 'success') {
                $('#hint').empty();
            } else {
                var error = contactme.clone().append('Request ' + status);
                $('#hint').html(error);
                error.show().delay(10000).fadeOut(800);
            }
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
