function getSourcesList(changeset, path) {
    // make a home page
    var url = base + '/src/' + changeset + '/' + path + '/?callback=?';
    xhr = $.getJSON(url, function(data) {
        sourceslist = data;
        showSourcesList();
    });
}

function getSource(changeset, file, callback) {
    var url = base + '/src/' + changeset + '/' + file + '?callback=?';
    xhr = $.getJSON(url, function(data) {
        callback(data);
    });
}

function showSourcesList() {
    // clear the content DOM
    $('#content').empty();

    // path nevigation bar
    var div = $('<div>');
    $('#content').append(div);
    var path = new Array('root').concat(sourceslist.path.split('/'));
    $(path).each(function() {
        if (this != '') {
            div.append('/').append($('<a>')
                .attr({ class: 'source', href: 'javascript:void(0);' })
                .text(this)
                )
        }
    });

    var table = $('<table>');
    $('#content').append(table);
    $('#content').append($('<div>').attr({ id: 'code' }));
    // append table header
    table.append($('<th>')
            .append($('<td>').text('filename'))
            .append($('<td>').text('size'))
            .append($('<td>').text('Last Modified'))
            );
    // append folders infomation to table
    $(sourceslist.directories).each(function() {
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
    $(sourceslist.files).each(function() {
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

    // bind the anchor link to DOM with '.source'
    $('.source').bind('click', function() {
        var url = '';
        if ($(this).parent().is('td')) {
            url = sourceslist.path + this.text;
        } else if (this.text != 'root') { // when click root, path is empty!
            $.each($(this).prevAll('a'), function() {
                if (this.text != 'root') {
                    url = '/' + this.text + url;
                }
            });
            url = url + '/' + this.text;
        }
        getSourcesList(sourceslist.node, url);
    });

    // bind show file to file list
    $('.show-file').bind('click', function() {
        var file = sourceslist.path + this.text;
        getSource(sourceslist.node, file, function(source) {
            source = source.data;
            $('#code').html($('<pre>')
                .attr({ class: 'prettyprint linenums' })
                .append($('<code>')
                    .attr({ class: 'language-cpp' })
                    .text(source)
                    )
                );
            prettyPrint();
        });
    });
}
