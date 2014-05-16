var blog = {
    'model': {
        /*
         * apibase:     the url base for all api request
         *
         * blog_name:   the blog name
         * footer:      the HTML target for footer to display
         * contact_me:  the URI for contacting me, it can be the weibo link, or email address
         *
         * timeout:     the jsonp request will be abort automatically if no respone is
         *              received in this specified time. unit: millisecond
         * page_limits: how many changesets will be shown on one page
         * slide_time:  the time for the sliding animation. unit: millisecond
         * 
         */
    }
};

$(function() {
    hint.run();
    blog.parseUrl();
    blog.showContent();
});

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

blog.showContent = function() {
    var changeset = blog.get('changeset', 'c');
    var source = blog.get('source', 'n');
    if (changeset != undefined && changeset.match('page') != null) { // go to specify page
        var page = changeset.substr(4);
        changesets.turnToPage(page);
    } else if (changeset != undefined && (changeset.length == 12 || changeset < 10000)) { // a hex node value
        changesets.openChangeset(changeset);
    } else if (source != undefined) { // it is a path
        sources.open('tip', source, true);
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
