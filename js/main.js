var base = null;
var changesetslist = null;
var sourceslist = null;
var source = null;
var blog = null;
var xhr = null;

function hint() {
    // setup ajax hints
    $('#hint').ajaxStart(function() {
        $(this).html('loading... ').append($('<a>')
            .attr({ id: 'stop', href: 'javascript:void(0);' })
            .text('stop it!')
            );
    }).ajaxError(function(e, xhr, setting, error) {
        $(this).html('Error!<br/>Status:' + xhr.status + '<br/>' + error);
    }).ajaxSuccess(function() {
        $(this).html('Success!');
    }).ajaxComplete(function() {
        /*if ($(this).html().match('Error!') > 0) {
            $(this).delay(2000);
        }*/
        $(this).html('');
    });
    $.ajaxPrefilter(function(options) {
        options.global = true;
    });
    // bind stop anchor to stop ajax request
    $('#stop').live('click', function() {
        if (xhr instanceof Object) {
            xhr.abort();
        }
    })
}

function configure() {
    // load blog configure
    xhr = $.ajax({
        url: 'configure.json',
        datatype: 'json',
        async: false
    }).done(function(data) {
        base = data['api'] + data['username'] + '/' + data['repository'];
        blog = data['blog'];
    });
}

$(function() {
    hint();
    configure();

    $('title').html(blog);
    $('#header').append($('<h1>').text(blog));

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
        getChangesetsList('tip', '15');
    });
    $('#sources').click(function() {
        getSourcesList('tip', '');
    });

    //getSourcesList('tip', '');
    getChangesetsList('tip', '15');
});
