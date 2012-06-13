var GLOBAL = new Array();

$(function() {
    analytics();
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
        getChangesetsList('tip', GLOBAL['pagelimits'], 'list');
    });
    $('#sources').click(function() {
        getSourcesList('tip', '');
    });

    var changeset = get('changeset', 'c');
    var source = get('source', 'n');
    showPage(changeset, source);
});

function configure() {
    // get url get key-value
    GLOBAL['GET'] = new Array();
    var url = window.location.search.substring(1);
    if (url) {
        var pairs = url.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            GLOBAL['GET'][pair[0]] = pair[1];
        }
    }

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

function showPage(changeset, source) {
    if (changeset != undefined && changeset.match('page') != null) { // go to specify page
        var page = changeset.substr(4);
        changesets.turnToPage(page);
    } else if (changeset != undefined && (changeset.length == 12 || changeset < 10000)) { // a hex node value
        changesets.openChangeset(changeset);
        /*getChangesetsList(changeset, GLOBAL['pagelimits']);
        GLOBAL['jsonp'].done(function() {
            showChangeset(changeset);
        });*/
    } else if (source != undefined) { // it is a path
        var path = getPath(source);
        getSourcesList('tip', path[0]);
        if (path.length > 1) {
            GLOBAL['jsonp'].done(function() {
                showSource(path[0] + '/' + path[1]);
            });
        }
    } else {
        getChangesetsList('tip', GLOBAL['pagelimits']);
    }
}
