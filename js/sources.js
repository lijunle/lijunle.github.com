function getSourcesList(changeset, path) {
    GLOBAL['jsonp'] = $.jsonp({
        url: GLOBAL['apibase'] + '/src/' + changeset + '/' + path,
        anchor: '?source=' + path,
        success: function(data) {
            data.directories.sort();
            data.files.sort(function(a, b) {
                return a.path < b.path ? -1 : +1;
            });
            GLOBAL['sourceslist'] = data;
            showSourcesList();
        }
    });
}

function getSource(changeset, file, callback) {
    GLOBAL['jsonp'] = $.jsonp({
        url: GLOBAL['apibase'] + '/src/' + changeset + '/' + file,
        anchor: '?source=' + file,
        success: function(data) {
            callback(data);
        }
    });
}

function showSourcesList() {
    // clear the content DOM
    $('#content').empty().attr({ class: 'sources' });

    // append path nevigation bar
    var div = $('<div>').attr({ class: 'path' });
    $('#content').append(div);
    var path = new Array('root').concat(GLOBAL['sourceslist'].path.split('/'));
    $(path).each(function() {
        if (this != '') {
            div.append('/').append($('<a>')
                .attr({ class: 'source', href: 'javascript:void(0);' })
                .text(this)
                )
        }
    });

    // append table header
    var table = $('<table>');
    $('#content').append(table);
    $('#content').append($('<div>').attr({ id: 'code' }));
    table.append($('<tr>')
            .append($('<th>').text('filename'))
            .append($('<th>').text('size'))
            .append($('<th>').text('Last Modified'))
            );

    // append folders infomation to table
    $(GLOBAL['sourceslist'].directories).each(function() {
        table.append($('<tr>')
            .append($('<td>')
                .attr({ class: 'folder' })
                .html($('<a>')
                    .attr({ class: 'source', href: 'javascript:void(0);' })
                    .text(this)
                    )
                )
            .append($('<td>'))
            .append($('<td>'))
            );
    });

    // append files infomation to table
    $(GLOBAL['sourceslist'].files).each(function() {
        var filename = this.path.split('/');
        table.append($('<tr>')
            .append($('<td>').append($('<a>')
                    .attr({ href: 'javascript:void(0);', class: 'show-file' })
                    .text(filename[filename.length - 1])
                ))
            .append($('<td>').text(this.size + 'B'))
            .append($('<td>').text(this.timestamp))
            );
    });

    // bind click action to path navigation bar
    $('.source').bind('click', function() {
        var url = '';
        if ($(this).parent().is('td')) {
            url = GLOBAL['sourceslist'].path + this.text;
        } else if (this.text != 'root') { // when click root, path is empty!
            $.each($(this).prevAll('a'), function() {
                if (this.text != 'root') {
                    url = '/' + this.text + url;
                }
            });
            url = url + '/' + this.text;
        }
        getSourcesList(GLOBAL['sourceslist'].node, url);
    });

    // bind show file source code when click filename
    $('.show-file').bind('click', function() {
        var file = GLOBAL['sourceslist'].path + this.text;
        showSource(file);
    });
}

function showSource(file) {
    // show source with overlay
    getSource(GLOBAL['sourceslist'].node, file, function(source) {
        $('body').append($('<div id="overlay">'));
        if (file.search(".html") == -1) {
            $('#code').empty()
            .append($('<pre>')
                .attr({ class: 'prettyprint linenums' })
                .append($('<code>')
                    .attr({ class: 'language-cpp' })
                    .text(source.data)
                    )
                );

            // pretty the code with google code prettify
            prettyPrint();

        } else {
            var content = $(source.data);
            $("#code").append($("<div id='webpage'>").html(content));
        }

        // bind click action to overlay
        $('#overlay').bind('click', function() {
            $('#code').empty();
            $('#overlay').remove();
            history.pushState(getState(), $('title').text(), '?source=' + GLOBAL['sourceslist'].path);
        });
    });
}
