function getSourcesList(changeset, path) {
    var url = GLOBAL['apibase'] + '/src/' + changeset + '/' + path + '/?callback=?';
    GLOBAL['jqxhr'] = $.getJSON(url, function(data) {
        data.directories.sort();
        data.files.sort(function(a, b) {
            return a.path < b.path ? -1 : +1;
        });
        GLOBAL['sourceslist'] = data;
        showSourcesList();
    });
}

function getSource(changeset, file, callback) {
    var url = GLOBAL['apibase'] + '/src/' + changeset + '/' + file + '?callback=?';
    GLOBAL['jqxhr'] = $.getJSON(url, function(data) {
        callback(data);
    });
}

function showSourcesList() {
    // clear the content DOM
    $('#content').empty();

    // path nevigation bar
    var div = $('<div>');
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
        if ($('#code h2').text() == file) {
            $('#code').empty();
        } else {
            getSource(GLOBAL['sourceslist'].node, file, function(source) {
                source = source.data;
                $('#code').empty();
                $('#code').append($('<h2>').text(file)).append($('<pre>')
                    .attr({ class: 'prettyprint linenums' })
                    .append($('<code>')
                        .attr({ class: 'language-cpp' })
                        .text(source)
                        )
                    );
                prettyPrint();
            });
        }
    });
}
