function getChangesetsList(start, limit) {
    GLOBAL['jsonp'] = $.jsonp({
        url: GLOBAL['apibase'] + '/changesets',
        data: {
            'start': start,
            'limit': limit
        },
        success: function(data) {
            GLOBAL['changesetscount'] = data.count;
            GLOBAL['changesetslist'] = data.changesets.reverse();
            $.each(GLOBAL['changesetslist'], function() {
                this.node = this.node.toUpperCase();
                this.message = this.message.replace(/\n/g, '<br/>');
            });
            showChangesetsList();
        }
    });
}

function showChangesetsList() {
    // show changeset list to content
    $('#content').empty();
    $.each(GLOBAL['changesetslist'], function() {
        var index = GLOBAL['changesetscount'] - this.revision;
        $('#content').append($('<div>')
            .append($('<p>')
                .append('(')
                .append(index)
                .append(') ')
                .append($('<a>')
                    .attr({ class: 'node', href: 'javascript:void(0);' })
                    .text(this.node)
                )
            )
            .append($('<p>').html(this.message))
        );
    });

    // append page navigation bar
    var page = $('<div>');
    $('#content').append(page);
    var count = Math.ceil(GLOBAL['changesetscount'] / GLOBAL['pagelimits']);
    var curpage = Math.ceil((GLOBAL['changesetscount'] - GLOBAL['changesetslist'][0].revision) / GLOBAL['pagelimits']);
    for (var i = 1; i <= count; i++) {
        var span = $('<span>');
        page.append(span);
        if (i == curpage) {
            span.text(i);
        } else {
            span.append($('<a>')
                    .attr({ href: 'javascript:void(0);', class: 'page' })
                    .text(i)
                    )
        }
    }

    // bind a link for node anchor
    $('.node').bind('click', function() {
        showChangeset(this.text);
    });

    // bind click action to page navigation bar
    $('.page').bind('click', function() {
        var start = GLOBAL['changesetscount'] - (this.text - 1) * GLOBAL['pagelimits'] - 1;
        getChangesetsList(start, GLOBAL['pagelimits']);
    });
}

function showChangeset(node) {
    // select the right DOM, equals to node
    var changeset = null;
    $(GLOBAL['changesetslist']).each(function() {
        if (this.node == node) {
            changeset = this;
        }
    });

    // show the specified changeset information to content
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
                    .text('Changed Files:')
                    )
               );

    // append files list
    var list = $('<ul>');
    $(changeset.files).each(function(index) {
        var file = $('<li>').append(this.file);
        if (this.type == 'removed') {
            file.append($('<span>').text('(removed)'))
        } else {
            file.append($('<a>')
                .attr({ href: 'javascript:void(0);', class: 'show-file' })
                .text('#')
                );
        }
        list.append(file);
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
                parent.append($('<pre>')
                    .attr({ class: 'prettyprint linenums' })
                    .append($('<code>').text(source.data))
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

