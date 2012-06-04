function getChangesetsList(start, limit) {
    var url = base + '/changesets?start=' + start + '&limit=' + limit + '&callback=?';
    xhr = $.getJSON(url, function(data) {
        changesetslist = data.changesets.reverse();
        $.each(changesetslist, function() {
            this.node = this.node.toUpperCase();
            this.message = this.message.replace(/\n/g, '<br/>');
            showChangesetsList();
        });
    });
}

function showChangesetsList() {
    $('#content').empty();
    $.each(changesetslist, function(index) {
        $('#content').append($('<div>')
            .append($('<p>')
                .append('(')
                .append(index + 1)
                .append(') ')
                .append($('<a>')
                    .attr({ class: 'node', href: 'javascript:void(0);' })
                    .text(this.node)
                )
            )
            .append($('<p>').html(this.message))
        );
    });

    // bind a link for node class
    $('.node').bind('click', function() {
        showChangeset(this.text);
    });
}

function showChangeset(node) {
    // select the right DOM, equals to node
    var changeset = null;
    $(changesetslist).each(function() {
        if (this.node == node) {
            changeset = this;
        }
    });

    $('#content')
        .empty()
        .append($('<a>')
                .attr({ id: 'back', href: 'javascript:void(0);'})
                .text('Back to list')
               )
        .append($('<h2>').text(changeset.node))
        .append($('<h4>').text(changeset.timestamp))
        .append($('<p>').html(changeset.message))
        .append($('<div>')
                .append($('<span>')
                    .attr({ class: 'list-head' })
                    .text('Modified Files:')
                    )
               );

    var list = $('<ul>');
    $(changeset.files).each(function(index) {
        list.append($('<li>')
            .append(this.file)
            .append($('<a>')
                .attr({ href: 'javascript:void(0);', class: 'show-file' })
                .text('#')
                )
            );
    });
    $('#content').append(list);

    // bind back anchor back to changesets list
    $('#back').bind('click', function() {
        showChangesetsList();
    });

    // bind show file to file list
    $('.show-file').bind('click', function() {
        var parent = $(this).parent();
        var next = $(this).next();
        if (next.length == 0) {
            var file = this.previousSibling.data;
            getSource(changeset.node, file, function(source) {
                source = source.data;
                parent.append($('<pre>')
                    .attr({ class: 'prettyprint' })
                    .append($('<code>')
                        .attr({ class: 'language-cpp' })
                        .text(source)
                        )
                    );
                prettyPrint();
            });
        } else if (next.is(':visible')) {
            next.hide();
        } else {
            next.show();
        }
    });

}

