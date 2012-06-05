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
        }
    });
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
        timeout: 3000,
        beforeSend: function() {
            $('#hint').html(load);
        },
        error: function(xOption, status) {
            console.log(status);
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

    $('title').html(GLOBAL['blogname']);

    $('#header').append($('<h1>').text(GLOBAL['blogname']));

    $('#menu')
    .append($('<a>')
        .attr({
            href: 'javascript:void(0);',
            id: 'changesets'
        })
        .text('Changesets')
        )
    .append($('<span>').text(' '))
    .append($('<a>')
        .attr({
            href: 'javascript:void(0);',
            id: 'sources'
        })
        .text('Sources')
        );


$('#changesets').click(function() {
    getChangesetsList('tip', GLOBAL['pagelimits']);
});
$('#sources').click(function() {
    getSourcesList('tip', '');
});

//getSourcesList('tip', '');
getChangesetsList('tip', GLOBAL['pagelimits']);
});
