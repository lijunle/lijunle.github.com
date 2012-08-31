var changesets = {
    'model': {
        /* 
         * count:   the total number of changesets in the repostory
         *
         * list:    the list of changesets
         *      key:    revison value, reference to every single changeset
         *      value:  content:    changeset comment, for displaying as blog content
         *              files:      changed files list in the specified changeset
         *              node:       changeset node hex value (hex)
         *              revision:   changeset revision value (decimal)
         *              timestamp:  timestamp for every changeset
         *              title:      if Markdown is used for writing comment,
         *                          the head will be title in the changeset comment,
         *                          otherwise it is the node hex value
         *
         * hex:     transform changeset node hex value into revision decimal value
         *      key:    the changeset node hex value
         *      value:  the corresponding changeset revision decimal value
         */
        'list': {},
        'hex': {}
    },
    'view': {}
};

changesets.openList = function(start, end) { // open list function
    changesets.get(start, end, function(node) {
        changesets.setList(node);
        changesets.setPagination(node);
        changesets.slide({
            'before': changesets.showList,
            'after': function() {
                changesets.bindList();
                changesets.showPagination();
                changesets.bindPagination();

                var anchor = '?changeset=page' + changesets.view.curpage;
                changesets.setAnchor(anchor);
            }
        });
    });
}

changesets.openChangeset = function(start) { // open single changeset
    changesets.get(start, start, function(node) {
        changesets.setChangeset(node);
        changesets.slide({
            'before': changesets.showChangeset,
            'after': function() {
                var anchor = '?changeset=' + changesets.view.index;
                changesets.setAnchor(anchor);
                changesets.bindChangeset();
            }
        });
    });
}

changesets.turnToPage = function(page) { // controller, for turning pages
    changesets.bootstrap(function() {
        var start = changesets.model.count - (page - 1) * blog.model.page_limits - 1;
        var end = Math.max(0, start - blog.model.page_limits + 1);
        changesets.openList(start, end);
    });
}

changesets.get = function(start, end, callback) {
    if (start.length == 12) { // that is hex value
        if (typeof changesets.model.hex[start] != 'undefined') {
            start = changesets.model.hex[start];
            changesets.getByRevision(start, start, callback);
        } else { // transform hex value to revision value
            changesets.getList(start, 1, function() {
                start = changesets.model.hex[start];
                changesets.getByRevision(start, start, callback);
            });
        }
    } else {
        changesets.getByRevision(start, end, callback);
    }
}

changesets.getByRevision = function(start, end, callback) {
    changesets.bootstrap(function() {
        if (start == 'tip') {
            start = changesets.model.count - 1;
            end = start - blog.model.page_limits + 1;
        }
        var need = false;
        for (var i = start; need == false && i >= end; i--) {
            if (typeof changesets.model.list[i] == 'undefined') {
                need = true;
            }
        }
        if (need == false) {
            callback(start);
        } else {
            changesets.getList(start, start - end + 1, callback);
        }
    });
}

changesets.bootstrap = function(callback) { // bootstrap
    if (typeof changesets.model.count != 'undefined') {
        callback();
    } else {
        changesets.getList('tip', blog.model.page_limits, callback);
    }
}

changesets.getList = function(start, limit, callback) {
    changesets.jsonp(start, limit, function(data) {
        changesets.model.count = data.count;
        $(data.changesets).each(function() {
            this.node = this.node.toUpperCase();
            var tmp = changesets.filterMessage(this.message);
            if (tmp.length == 1) {
                this.title = this.node;
                this.content = tmp[0];
            } else {
                this.title = tmp[0];
                this.content = $(tmp[1]).html();
            }
            changesets.model.hex[this.node] = this.revision;
            changesets.model.list[this.revision] = {
                'revision': this.revision,
                'node': this.node,
                'title': this.title,
                'timestamp': this.timestamp,
                'content': this.content,
                'files': this.files
            };
        });
        callback(start);
    });
}

changesets.jsonp = function(start, limit, callback) { // model, fetch data
    blog.model.jsonp = $.jsonp({
        url: blog.model.apibase + '/changesets',
        data: { 'start': start, 'limit': limit },
        success: callback
    });
}

changesets.setList = function(start) { // controller
    changesets.view.list = [];
    var cnt = 0;
    var index = start;
    while (index >= 0 && cnt < blog.model.page_limits) {
        changesets.view.list[cnt] = new Object();

        var view = changesets.view.list[cnt]
        var model = changesets.model.list[index];
        
        view.index = model.revision;
        view.node = model.node;
        view.title = model.title;
        view.time = model.timestamp;
        view.content = model.content;
        view.files = model.files;
        
        cnt++;
        index--;
    }
}

changesets.slide = function(callback) {
    var dir = ['left', 'right'];
    var length = [$('#content.changesetslist').length, $('#content.changeset').length];
    if (length[0] == 0) {
        dir = ['right', 'left'];
    }
    if (length[0] == 0 && length[1] == 0) {
        callback.before();
        callback.after();
    } else {
        $('#content').hide('drop', {direction: dir[0]}, blog.model.slide_time, function() {
            callback.before();
            $('#content').show('drop', {direction: dir[1]}, blog.model.slide_time, callback.after);
        });
    }
}

changesets.showList = function() { // view
    // show changeset list to content
    $('#content').empty().removeClass().addClass('changesetslist');
    $(changesets.view.list).each(function() {
        $('#content').append($('<div class="changeset">')
            .append($('<p class="title">')
                .append($('<span class="index">').text(this.index))
                .append($('<a class="node" href="javascript:void(0);">').text(this.title))
            )
            .append($('<p class="paragraph">').html(this.content))
        );
    });
}

changesets.bindList = function() { // bind function
    // bind a link for node anchor
    $('.node').bind('click', function() {
        var index = $(this).prev().text();
        changesets.openChangeset(index);
    });
}

changesets.setPagination = function(start) { // controller
    changesets.view.cntpage = Math.ceil(changesets.model.count / blog.model.page_limits);
    changesets.view.curpage = Math.ceil((changesets.model.count - start) / blog.model.page_limits);
}

changesets.showPagination = function() { // view
    // append pagination bar
    var page = $('<div class="pagination">').appendTo($('#content'));
    for (var i = 1; i <= changesets.view.cntpage; i++) {
        var anchor = $('<a>').appendTo(page);
        if (i == changesets.view.curpage) {
            anchor.addClass('curpage').text(i);
        } else {
            anchor.addClass('lnkpage').attr('href', 'javascript:void(0);').text(i);
        }
    }
}

changesets.bindPagination = function() { // bind function
    // bind click action to pagination bar
    $('.lnkpage').bind('click', function() {
        changesets.turnToPage(this.text);
    });
}

changesets.setChangeset = function(index) { // controller
    changesets.view = [];
    var model = changesets.model.list[index];
    var view = changesets.view;
    view.index = model.revision;
    view.node = model.node;
    view.title = model.title;
    view.timestamp = model.timestamp;
    view.content = model.content;
    view.files = model.files;
}

changesets.showChangeset = function(callback) { // view
    // show the specified changeset information to content
    $('#content').empty().removeClass().addClass('changeset');
    // append back anchor
    $('#content').append($('<a id="back" href="javascript:void(0);">').text('Back to list'));
    // append title
    $('#content').append($('<h1 class="title">').text(changesets.view.title));
    // append subtitle for showing time
    $('#content').append($('<h4 class="subtitle">').text(changesets.view.timestamp));
    // append paragraph content
    $('#content').append($('<p class="paragraph">').html(changesets.view.content));
    // append files list
    var fileslist = $('<div>').append($('<span class="list-head">').text('Changed Files:')).appendTo($('#content'));
    var list = $('<ul>').appendTo(fileslist);
    $(changesets.view.files).each(function(index) {
        var li = $('<li>').appendTo(list);
        var file = $('<span class="filename">').text(this.file).appendTo(li);
        var anchor = $('<a class="status">').appendTo(li);
        if (this.type == 'removed') {
            anchor.addClass('removed').text('removed');
        } else {
            anchor.addClass('show-file').attr({ 'href': 'javascript:void(0);' }).text('#');
        }
    });
    // append div for disqus comment system
    $('#content').append($('<a id="show-disqus">').attr({ 'href': 'javascript:void(0);' }).text('Show Disqus Comments'));
}

changesets.bindChangeset = function() { // bind function
    // bind back anchor back to changesets list
    $('#back').bind('click', function() {
        var page = Math.floor((changesets.model.count - changesets.view.index - 1) / blog.model.page_limits);
        var start = changesets.model.count - page * blog.model.page_limits - 1;
        var end = Math.max(0, start - blog.model.page_limits + 1);
        changesets.openList(start, end);
    });

    // bind show file to file list
    $('.show-file').bind('click', function() {
        var parent = $(this).parents('.changeset ul li');
        var pre = parent.find('pre');
        if (pre.length == 0) {
            var file = parent.find('.filename').text();
            sources.get(changesets.view.node, file, function(source) {
                parent.append($('<pre class="prettyprint linenums">').append($('<code>').text(source.data)));
                prettyPrint();
            });
        } else if (pre.is(':visible')) {
            pre.hide();
        } else {
            pre.show();
        }
    });

    $('#show-disqus').bind('click', function() {
        $('#show-disqus').remove();
        // show disqus comments
        $('#content').append($('<div id="disqus_thread">'));
        if (typeof window.disqus_shortname == 'undefined') { // first load
            window.disqus_shortname = 'lijunle-bitbucket';
            window.disqus_identifier = 'changeset=' + changesets.view.index;
            disqus_developer = 1; //FIXME
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        } else { // second load, using reset function.
            console.log("second load");
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = 'changeset=' + changesets.view.index;
                    this.page.url = window.location.href;
                }
            });
        }
    });
}

changesets.filterMessage = function(message) { // changesets contorller 
    // judge message is markdown syntax or not
    // return array of title and content
    var converter = new Markdown.Converter();
    var content = $('<div>').html(converter.makeHtml(message));
    if (message.search('SCNU_2012_Summer #1\n') != -1) { //FIXME: hack post #104
        var html = content.html();
        html = html.replace(/<h2>/g, '<h_1>').replace(/<h1>/g, '<h2>').replace(/<h_1>/g, '<h1>');
        content.html(html);
    }
    if ($(content).children('h1').length != 0) {
        // that is markdown syntax
        var title = $(content).children('h1').text();
        $(content).children('h1').remove();
        return [ title, content ];
    } else {
        // not markdown syntax
        return [ message.replace(/\n/g, '<br/>') ];
    }
}

changesets.getState = function() {
    return {
        'entry': 'changesets',
        'view': changesets.view
    };
}

changesets.setState = function(view) {
    changesets.view = view;
    if (typeof view.list != 'undefined') { // list
        changesets.slide({
            'before': changesets.showList,
            'after': function() {
                changesets.bindList();
                changesets.showPagination();
                changesets.bindPagination();
            }
        });
    } else { // content
        changesets.slide({
            'before': changesets.showChangeset,
            'after': changesets.bindChangeset
        });
    }
}

changesets.setAnchor = function(anchor) {
    scroll(0, 0);
    history.pushState(changesets.getState(), $('title').text(), anchor);
}
