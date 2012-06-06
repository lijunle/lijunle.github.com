function getChangesetsList(start, limit) {
    GLOBAL['jsonp'] = $.jsonp({
        url: GLOBAL['apibase'] + '/changesets',
        anchor: '?changeset=page' + '1',
        data: {
            'start': start,
            'limit': limit,
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
    $('#content').empty().attr({ class: 'changesetslist' });
    $.each(GLOBAL['changesetslist'], function() {
        var index = GLOBAL['changesetscount'] - this.revision;
        $('#content').append($('<div>')
            .attr({ class: 'changeset' })
            .append($('<p>')
                .attr({ class: 'title' })
                .append($('<span>')
                    .attr({ class: 'index' })
                    .text(index))
                .append($('<a>')
                    .attr({ class: 'node', href: 'javascript:void(0);' })
                    .text(this.node)
                )
            )
            .append($('<p>')
                .attr({ class: 'paragraph' })
                .html(this.message))
        );
    });

    // append pagination bar
    var page = $('<div>').attr({ class: 'pagination' });
    $('#content').append(page);
    var count = Math.ceil(GLOBAL['changesetscount'] / GLOBAL['pagelimits']);
    var curpage = Math.ceil((GLOBAL['changesetscount'] - GLOBAL['changesetslist'][0].revision) / GLOBAL['pagelimits']);
    for (var i = 1; i <= count; i++) {
        var span = $('<span>');
        page.append(span);
        if (i == curpage) {
            span.attr({ class: 'current' }).text(i);
        } else {
            span.append($('<a>')
                    .attr({ href: 'javascript:void(0);', class: 'page' })
                    .text(i)
                    )
        }
    }

    // bind a link for node anchor
    $('.node').live('click', function() {
        showChangeset(this.text);
        var anchor = '?changeset=' + this.text;
        history.pushState(getState(), $('title').text(), anchor);
    });

    // bind click action to page navigation bar
    $('.page').live('click', function() {
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
    $('#content').empty().attr({ class: 'changeset' });
    // append back anchor
    $('#content').append($('<a>')
            .attr({ id: 'back', href: 'javascript:void(0);'})
            .text('Back to list'));
    // append title
    $('#content').append($('<h2>')
            .attr({ class: 'title' })
            .text(changeset.node));
    // append subtitle for showing time
    $('#content').append($('<h4>')
            .attr({ class: 'subtitle' })
            .text(changeset.timestamp));
    // append paragraph content
    $('#content').append($('<p>')
            .attr({ class: 'paragraph' })
            .html(changeset.message));

    var fileslist = $('<div>').append($('<span>')
            .attr({ class: 'list-head' })
            .text('Changed Files:'));
    $('#content').append(fileslist);

    // append files list
    var list = $('<ul>');
    $(fileslist).append(list);
    $(changeset.files).each(function(index) {
        var li = $('<li>').appendTo(list);
        var file = $('<span>').attr({ class: 'filename' }).text(this.file).appendTo(li);
        var status = $('<span>').attr({ class: 'status' }).appendTo(li);
        if (this.type == 'removed') {
            status.text('removed');
        } else {
            status.append($('<a>')
                .attr({ href: 'javascript:void(0);', class: 'show-file' })
                .text('#')
                );
        }
    });

    // bind back anchor back to changesets list
    $('#back').live('click', function() {
        showChangesetsList();
        var anchor = '?changeset=' + 'tip';
        history.pushState(getState(), $('title').text(), anchor);
    });

    // bind show file to file list
    $('.show-file').live('click', function() {
        var parent = $(this).parents('.changeset ul li');
        var pre = parent.find('pre');
        if (pre.length == 0) {
            var file = parent.find('.filename').text();
            getSource(changeset.node, file, function(source) {
                parent.append($('<pre>')
                    .attr({ class: 'prettyprint linenums' })
                    .append($('<code>').text(source.data))
                    );
                prettyPrint();
            });
        } else if (pre.is(':visible')) {
            pre.hide();
        } else {
            pre.show();
        }
    });

}

