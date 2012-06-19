var sources = {
    'model': {
        'node': { 'path': '' },
        'tip': 'tip'
    },
    'view': {}
};

sources.open = function(node, path, bootstrap) { // open function
    if (node == 'tip') {
        node = sources.model.tip;
    }
    if (typeof path == 'undefined') {
        path = '';
    }
    sources.get(node, path, function(pt) {
        if (pt.type == 'folder') {
            sources.setList(pt);
            sources.slideList({
                'before': sources.showList,
                'after': sources.bindList
            });
        } else if (pt.type == 'file') {
            sources.setList(pt.parent);
            sources.setFile(pt);
            sources.showList();
            sources.showFile();
            sources.bindFile();
        }
        sources.setAnchor();
    }, bootstrap);
}

sources.get = function(node, path, callback, bootstrap) { // model function, encapsulate everything about jsonp
    var pt = sources.travel(node, path);
    if (pt != 'undefined' && pt.full) {
        callback(pt);
    } else {
        // cross-domain communication now
        sources.jsonp(node, path, function(data) {
            data.node = data.node.toUpperCase();
            if (node == 'tip') {
                sources.model.tip = data.node;
            }
            if (data.path.charAt(0) == '/') { // folder
                var pt = sources.createFolder(data);
                callback(pt);
            } else { // file
                var tmp = data.path.split('/');
                var file = tmp[ tmp.length - 1 ];
                data.path = '';
                for (var i = 0; i < tmp.length - 1; i++) {
                    data.path = data.path + '/' + tmp[i];
                }
                if (typeof bootstrap != 'undefined' && bootstrap) {
                    sources.jsonp(data.node, data.path, function(folder) {
                        folder.node = folder.node.toUpperCase();
                        var pt = sources.createFolder(folder);
                        pt[file].data = data.data;
                        callback(pt[file]);
                    });
                } else {
                    var pt = sources.createFolder(data);
                    sources.createFile(data, file, data, pt);
                    pt[file].data = data.data;
                    callback(pt[file]);
                }
            }
        });
    }
}

sources.createFolder = function(data) { // model function, create model nodes
    var pt = sources.travel(data.node, data.path, 'create');
    $(data.directories).each(function() {
        if (typeof pt[this] == 'undefined') {
            pt[this] = [];
            pt[this].type = 'folder';
            pt[this].path = '/' + data.node + data.path + this;
            pt[this].parent = pt;
        }
    });
    $(data.files).each(function() {
        var tmp = this.path.split('/');
        var file = tmp[ tmp.length - 1 ];
        sources.createFile(data, file, this, pt);
    });
    return pt;
}

sources.createFile = function(data, file, item, pt) {
    if (typeof pt[file] == 'undefined') {
        pt[file] = [];
        pt[file].type = 'file';
        pt[file].path = '/' + data.node + '/' + item.path;
        pt[file].parent = pt;
    }
    if (typeof item.revision != 'undefined') { // if item has revision, it will has all
        pt[file].revision = item.revision.toUpperCase();
        pt[file].size = item.size;
        pt[file].timestamp = item.timestamp;
    }
}

sources.travel = function(node, path, mode) { // model function, travel the file tree
    var paths = path.split('/');
    while (paths.length > 1 && paths[ paths.length - 1 ] == '') {
        paths.pop();
    };
    paths[0] = node;
    q = 0;
    var p = sources.model.node;
    while (q < paths.length) {
        if (typeof p[ paths[q] ] == 'undefined') {
            if (mode == 'create') {
                p[ paths[q] ] = [];
                p[ paths[q] ].type = 'folder';
                p[ paths[q] ].path = p.path + '/' + paths[q];
                p[ paths[q] ].full = false;
                p[ paths[q] ].parent = p;
            } else {
                return 'undefined';
            }
        }
        p = p[ paths[q] ];
        q++;
    }
    if (mode == 'create') {
        p.full = true;
    }
    return p;
}

sources.jsonp = function(node, path, callback) { // model, for connect jsonp
    blog.model.jsonp = $.jsonp({
        url: blog.model.apibase + '/src/' + node + '/' + path,
        anchor: '?source=' + path,
        success: callback
    });
}

sources.setList = function(pt) { // set view function
    var paths = pt.path.split('/');
    sources.view = {};
    sources.view.node = paths[1];
    sources.view.path = [];
    sources.view.path.push('root');
    for (var i = 2; i < paths.length; i++) {
        sources.view.path.push(paths[i]);
    }
    sources.view.list = [];
    for (var key in pt) {
        if (pt[key].type == 'folder') {
            sources.view.list.push({
                'name': key != 'parent' ? key : '..',
                'type': pt[key].type
            });
        } else if (pt[key].type == 'file') {
            sources.view.list.push({
                'name': key,
                'type': pt[key].type,
                'size': pt[key].size,
                'timestamp': pt[key].timestamp,
                'revision': pt[key].revision
            });
        }
    }
    sources.view.list.sort(function(a, b) {
        if (a.type != b.type) {
            return (a.type == 'folder') ? -1 : +1;
        } else {
            var ret = parseInt(a.name) - parseInt(b.name);
            if (ret != 0 && isNaN(ret) == false) {
                return ret;
            } else {
                return (a.name < b.name) ? -1 : +1;
            }
        }
    });
}

sources.showList = function() {
    // clear the content DOM
    $('#content').empty().removeClass().addClass('sources');

    // append path nevigation bar
    var path = $('<div class="path">').appendTo($('#content'));
    $(sources.view.path).each(function() {
        path.append('/').append($('<a class="paths" href="javascript:void(0);">').text(this));
    });

    // append table header
    var table = $('<table>')
        .append($('<tr>')
                .append($('<th>').text('filename'))
                .append($('<th>').text('size'))
                .append($('<th>').text('Last Modified')))
        .appendTo($('#content'));

    // append code view frame
    $('#content').append($('<div id="code">'));

    // append folders and files infomation to table
    $(sources.view.list).each(function() {
        var item = $('<a class="source" href="javascript:void(0);">').text(this.name);
        if (this.type == 'folder') {
            table.append($('<tr>')
                .append($('<td>').append(item))
                .append($('<td>'))
                .append($('<td>')));
        } else if (this.type == 'file') {
            table.append($('<tr>')
                .append($('<td>').append(item))
                .append($('<td>').text(this.size + 'B'))
                .append($('<td>').append(this.timestamp).append(' at ')
                        .append($('<a class="changeset" href="javascript:void(0);">').text(this.revision)))
                );
        }
    });
}

sources.slideList = function(callback) { // show view function
    var dir = ['left', 'right'];
    var length = [$('.path a').length, sources.view.path.length];
    if (length[0] > length[1]) {
        dir = ['right', 'left'];
    }
    if (length[0] == 0) {
        callback.before();
        callback.after();
    } else {
        $('#content').hide('drop', {direction: dir[0]}, blog.model.slide_time, function() {
            callback.before();
            $('#content').show('drop', {direction: dir[1]}, blog.model.slide_time, callback.after);
        });
    }
}

sources.bindList = function() {
    // bind click action to path navigation bar
    $('.paths').bind('click', function() {
        var path = '/';
        if (this.text != 'root') { // when click root, path is empty!
            $(this).prevAll('a').each(function() {
                if (this.text != 'root') {
                    path = '/' + this.text + path;
                }
            });
            path = path + this.text;
        }
        sources.open(sources.view.node, path);
    });

    // bind click action to folders and files anchors
    $('.source').bind('click', function() {
        var path = '/';
        var length = sources.view.path.length;
        if (this.text == '..') {
            length--;
        }
        for (var i = 1; i < length; i++) {
            path = path + sources.view.path[i] + '/';
        }
        if (this.text != '..') {
            path = path + this.text;
        }
        sources.open(sources.view.node, path);
    });
}

sources.setFile = function(pt) {
    sources.view.file = [];
    sources.view.file.data = pt.data;
    sources.view.file.path = pt.path;
}

sources.showFile = function() {
    // show source with overlay
    $('body').append($('<div id="overlay">'));

    // show source code or html page
    var file = sources.view.file;
    if (file.path.search(".html") == -1) {
        $('#code').empty().append($('<pre class="prettyprint linenums">')
                .append($('<code>').text(file.data)));
        prettyPrint(); // pretty the code with google code prettify
    } else {
        $('#code').append($('<div id="webpage">').html($(file.data)));
    }
    scroll(0, 0);
}

sources.bindFile = function() {
    // bind click action to overlay
    $('#overlay').bind('click', function() {
        $('#code').empty();
        $('#overlay').remove();
        delete sources.view.file;
        sources.bindList();
        sources.setAnchor();
    });
}

sources.getState = function() {
    return {
        'entry': 'sources',
        'view': sources.view
    };
}

sources.setState = function(view) {
    $('#overlay').remove();
    sources.view = view;
    sources.slideList({
        'before': sources.showList,
        'after': function() {
            if (typeof view.file == 'undefined') { // folder
                sources.bindList();
            } else { // file
                sources.showFile();
                sources.bindFile();
            }
        }
    });
}

sources.setAnchor = function() {
    if (typeof sources.view.file != 'undefined') {
        var anchor = sources.view.file.path.substr(13);
    } else {
        var anchor = '/';
        for (var i = 1; i < sources.view.path.length; i++) {
            anchor = anchor + sources.view.path[i] + '/';
        }
    }
    anchor = '?source=' + anchor;
    history.pushState(sources.getState(), $('title').text(), anchor);
}

