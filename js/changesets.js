var changesets = {
    'model': {
        'list': []
    },
    'view': {}
};

changesets.getList = function(start, limit) { // model, fetch data
    GLOBAL['async'] = true;
    GLOBAL['jsonp'] = $.jsonp({
        url: GLOBAL['apibase'] + '/changesets',
        anchor: '?changeset=page' + '1',
        data: { 'start': start, 'limit': limit },
    })
    .done(function(data) {
        changesets.model.count = data.count;
        $(data.changesets).each(function() {
            var tmp = changesets.filterMessage(this.message);
            if (tmp.length == 1) {
                this.title = this.node.toUpperCase();
                this.content = tmp[0];
            } else {
                this.title = tmp[0];
                this.content = $(tmp[1]).html();
            }
            changesets.model.list[this.node.toUpperCase()] = 
            changesets.model.list[this.revision] = {
                'revision': this.revision,
                'node': this.node,
                'title': this.title,
                'timestamp': this.timestamp,
                'content': this.content,
                'files': this.files
            };
        });
    });
}

changesets.bootstrap = function() { // bootstrap
    changesets.getList('tip', GLOBAL['pagelimits']);
}

changesets.openList = function(start, end) { // open list function
    var _render = function() {
        changesets.setList(start);
        changesets.showList();
        changesets.bindList();
        
        changesets.setPagination(start);
        changesets.showPagination();
        changesets.bindPagination();
    }

    var _run = function() {
        if (start == 'tip') {
            start = changesets.model.count - 1;
            end = start - GLOBAL['pagelimits'] + 1;
        }
        var need = 0;
        for (var i = start; need == 0 && i >= end; i--) {
            if (typeof changesets.model.list[i] == 'undefined') {
                need = 1;
            }
        }
        
        if (need) {
            changesets.getList(start, start - end + 1);
            GLOBAL['jsonp'].done(_render);
        } else {
            _render();
        }
    }
    
    if (typeof changesets.model.count == 'undefined') {
        changesets.bootstrap();
        GLOBAL['jsonp'].done(_run);
    } else {
        _run();
    }
}

changesets.openChangeset = function(node) { // open single changeset
    var _run = function() {
        changesets.setChangeset(node);
        changesets.showChangeset();
        changesets.bindChangeset();
    }

    changesets.getList(node, 1);
    GLOBAL['jsonp'].done(_run);
}

changesets.setList = function(start) { //controller
    changesets.view.list = [];
    var cnt = 0;
    var index = start;
    while (index >= 0 && cnt < GLOBAL['pagelimits']) {
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

changesets.showList = function() { // view
    // show changeset list to content
    $('#content').empty().attr({ 'class': 'changesetslist' });
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
        changesets.setChangeset(index);
        changesets.showChangeset();
        changesets.bindChangeset();
        
        var controller = [ 'Changeset' ];
        var anchor = '?changeset=' + index;
        history.pushState(changesets.getState(controller), $('title').text(), anchor);
    });
}

changesets.setPagination = function(start) { // controller
    changesets.view.cntpage = Math.ceil(changesets.model.count / GLOBAL['pagelimits']);
    changesets.view.curpage = Math.ceil((changesets.model.count - start) / GLOBAL['pagelimits']);
}

changesets.showPagination = function() { // view
    // append pagination bar
    var page = $('<div class="pagination">').appendTo($('#content'));
    for (var i = 1; i <= changesets.view.cntpage; i++) {
        var anchor = $('<a>').appendTo(page);
        if (i == changesets.view.curpage) {
            anchor.attr({ 'class': 'curpage' }).text(i);
        } else {
            anchor.attr({ 'class': 'lnkpage', 'href': 'javascript:void(0);' }).text(i);
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

changesets.showChangeset = function() { // view
    // show the specified changeset information to content
    $('#content').empty().attr({ 'class': 'changeset' });
    // append back anchor
    $('#content').append($('<a id="back" href="javascript:void(0);">').text('Back to list'));
    // append title
    $('#content').append($('<h2 class="title">').text(changesets.view.title));
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
}

changesets.bindChangeset = function() { // bind function
    // bind back anchor back to changesets list
    $('#back').bind('click', function() {
        var page = Math.floor((changesets.model.count - changesets.view.index - 1) / GLOBAL['pagelimits']);
        var start = changesets.model.count - page * GLOBAL['pagelimits'] - 1;
        var end = Math.max(0, start - GLOBAL['pagelimits'] + 1);
        changesets.openList(start, end);
        
        var _anchor = function() {
            var controller = [ 'List', 'Pagination' ];
            var anchor = '?changeset=page' + (page + 1);
            history.pushState(changesets.getState(controller), $('title').text(), anchor);
        }
        if (GLOBAL['async']) {
            GLOBAL['jsonp'].done(_anchor);
        } else {
            _anchor();
        }
    });

    // bind show file to file list
    $('.show-file').bind('click', function() {
        var parent = $(this).parents('.changeset ul li');
        var pre = parent.find('pre');
        if (pre.length == 0) {
            var file = parent.find('.filename').text();
            getSource(changesets.view.node, file, function(source) {
                parent.append($('<pre class="prettyprint linenums">').append($('<code>').text(source.data)));
                prettyPrint();
            });
        } else if (pre.is(':visible')) {
            pre.hide();
        } else {
            pre.show();
        }
    });
}

changesets.filterMessage = function(message) { // changesets contorller 
    // judge message is markdown syntax or not
    // return array of title and content
    var converter = new Markdown.Converter();
    var content = $('<div>').html(converter.makeHtml(message));
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

changesets.turnToPage = function(page) { // controller, for turning pages
    var _turnToPage = function() {
        var start = changesets.model.count - (page - 1) * GLOBAL['pagelimits'] - 1;
        var end = Math.max(0, start - GLOBAL['pagelimits'] + 1);
        changesets.openList(start, end);
        
        var _anchor = function() {
            var controller = [ 'List', 'Pagination' ];
            var anchor = "?changeset=page" + page;
            history.pushState(changesets.getState(controller), $('title').text(), anchor);
        }
        if (GLOBAL['async']) {
            GLOBAL['jsonp'].done(_anchor);
        } else {
            _anchor();
        }
    }

    if (typeof changesets.model.count == 'undefined') {
        changesets.bootstrap();
        GLOBAL['jsonp'].done(_turnToPage);
    } else {
        _turnToPage();
    }
}

changesets.getState = function(controller) {
    return {
        'entry': 'changesets',
        'controller': controller,
        'view': changesets.view
    };
}

changesets.setState = function(controller, view) {
    changesets.view = view;
    
    $(controller).each(function() {
        eval('changesets.show' + this + '()');
        eval('changesets.bind' + this + '()');
    });
}

function getChangesetsList(start, limit) {
    changesets.openList(start);
}

