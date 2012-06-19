var blog = {
    'model': {}
};

$(function() {
    blog.analytics();
    blog.configure();
    blog.showMenu();
    blog.bindMenu();
    blog.parseUrl();
    blog.showContent();
});

blog.configure = function() {
    // load blog configure
    $.ajax({
        url: 'configure.json',
        datatype: 'json',
        async: false,
        success: function(data) {
            blog.model.apibase = data['api'] + data['username'] + '/' + data['repository'];
            blog.model.blog_name = data['blog'];
            blog.model.timeout = data['timeout'];
            blog.model.page_limits = data['page_limits'];
            blog.model.contact_me = data['contact_me'];
            blog.model.footer = data['footer'];
        }
    });
    hint.run();
}

blog.parseUrl = function() {
    // parse url for getting key-value
    blog.model.get = [];
    var url = window.location.search.substring(1);
    if (url) {
        var pairs = url.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (typeof pair[1] == 'undefined') {
                pair[1] = '';
            }
            blog.model.get[pair[0]] = pair[1];
        }
    }
}

blog.showMenu = function() {
    // set blog name for title and header
    $('title').html(blog.model.blog_name);
    $('#header').append($('<h1>').text(blog.model.blog_name));

    // append information to menu bar
    $('<a id="changesets" href="javascript:void(0);">').text('Changesets').appendTo($('#menu'));
    $('<a id="sources" href="javascript:void(0);">').text('Sources').appendTo($('#menu'));

    // append footer to footer div
    $('#footer').html(blog.model.footer);
}

blog.bindMenu = function() {
    // bind click action for menu
    $('#changesets').click(function() {
        changesets.openList('tip');
    });
    $('#sources').click(function() {
        sources.open('tip');
    });
}

blog.showContent = function() {
    var changeset = blog.get('changeset', 'c');
    var source = blog.get('source', 'n');
    if (changeset != undefined && changeset.match('page') != null) { // go to specify page
        var page = changeset.substr(4);
        changesets.turnToPage(page);
    } else if (changeset != undefined && (changeset.length == 12 || changeset < 10000)) { // a hex node value
        changesets.openChangeset(changeset);
    } else if (source != undefined) { // it is a path
        sources.open('tip', source);
    } else {
        changesets.openList('tip');
    }
}

blog.get = function(key, shortkey) {
    if (blog.model.get[key] != undefined) {
        return blog.model.get[key];
    } else if (blog.model.get[shortkey] != undefined) {
        return blog.model.get[shortkey];
    } else {
        return undefined;
    }
}

blog.analytics = function() {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-32455520-1']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}
