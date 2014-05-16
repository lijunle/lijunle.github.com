'use strict';

angular
    .module('blogConfig', [])
    .value('model', {
        apibase: 'https://api.bitbucket.org/1.0/repositories/lijunle/acm',
        blog_name: 'LiJunLe ACM Code',
        timeout: 15000,
        page_limits: 15,
        slide_time: 250
    });
