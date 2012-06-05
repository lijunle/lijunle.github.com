var GLOBAL = new Array();
var source = null;

function configure() {
    // load blog configure
    GLOBAL['jqxhr'] = $.ajax({
        url: 'configure.json',
        datatype: 'json',
        async: false
    }).done(function(data) {
        GLOBAL['apibase'] = data['api'] + data['username'] + '/' + data['repository'];
        GLOBAL['blogname'] = data['blog'];
        GLOBAL['pagelimits'] = data['pagelimits'];
    });
}

function hint() {
    var load = $('<span>')
        .attr({ id: 'loading' })
        .text('loading')
        .append($('<span>').attr({ id: 'loadingpoint' }))
        .append($('<br>'))
        .append($('<a>')
            .attr({ id: 'stop', href: 'javascript:void(0);' })
            .text('stop it!')
            );

    // setup ajax hints
    $('#hint').ajaxStart(function() {
        $(this).html(load);
        var timeout = 500;
        setTimeout(function loadingpoint() {
            var length = $('#loadingpoint').text().length % 5 + 1;
            $('#loadingpoint').empty();
            for (var i = 0; i < length; i++) {
                $('#loadingpoint').append('.');
            }
            setTimeout(loadingpoint, timeout);
        }, timeout);
    }).ajaxError(function(e, xhr, setting, error) {
        // FIXME: won't run when cross-domain ajax
        //        there is a way to fix it using timeout
        $(this).html('Error!<br/>Status:' + xhr.status + '<br/>' + error);
    }).ajaxSuccess(function() {
        $(this).html('Success!');
    }).ajaxComplete(function() {
        if ($(this).html().match('Error!') > 0) {
            //$(this).delay(2000); //FIXME
        } else {
            $(this).html('');
        }
    });
    $.ajaxPrefilter(function(options) {
        options.global = true;
    });

    // bind stop anchor to stop ajax request
    $('#stop').live('click', function() {
        if (GLOBAL['jqxhr'] != null) {
            GLOBAL['jqxhr'].abort(); // FIXME: abort because no this function
        }
    })
}

$(function() {
    hint();
    configure();

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
