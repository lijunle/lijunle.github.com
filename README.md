# [ACM Blog][] - Blog for Sharing Ideas and Codes

[ACM Blog]: https://bitbucket.org/lijunle/lijunle.bitbucket.org

This blog is writen in static HTML page and JavaScript. There are
two parts in the blog, changesets and sources.

Every **changeset** is handled as a single blog post. The post
content is the changeset comment. And the changed file list
is also appended after the content, as one part of the post.

The **sources** part of the blog is to show the sources tree in the
code repository. At the newest release, only the tree hierarchy with
the `tip` tag can be shown.

## Install

All components of this blog can be run in static html host. Deploy
it on [bitbucket][] via its [page service][] is on [my way][].

Everything is loaded via JavaScript, visitors must premit JavaScript
codes to run in their browser.

Besides, for manipulating the browser address bar and history
navigation, HTML5 technology is used. Therefore, browsers which
support HTML5 is recommended.

[bitbucket]: https://bitbucket.org/
[page service]: http://pages.bitbucket.org/
[my way]: https://bitbucket.org/lijunle/lijunle.bitbucket.org

## Configuration

Configuration is in `configure.json` at the root folder.

Details:

+ `api`  
The basic API for VCS website. Use
`https://api.bitbucket.org/1.0/repositories/` for bitbucket.
I give no test on github, and have no ideas about github.

+ `username` and `repository`  
The repository information which you want to blog it. Because this
blog is on static host and run in JavaScript, that is no way to
store password for a private repository, please ensure the 
repository is public, which can be access by anyone.

+ `blog`  
The blog name

+ `contact_me`  
The URI you can set anywhere, especially when errors happen when
requesting. This value can be set as email address or HTTP address.

+ `footer`  
The snippet is shown at the footer of every page.

+ `timeout`  
If the time of a request pass is larger the this value, the request
will be aborted. Unit: `millisecond`. Default is `15000`.

+ `page_limits`  
The number of posts shown on one single page. Default is `15`.

+ `slide_time`  
The time for the sliding animation. Unit: `millisecond`. Default 
is `250`.

## License

Copyright 2012 [JunLe Li].

Released under **MIT License**.
Read more about in the `LICENSE.txt` file.

## About me

I am [JunLe Li][], you can follow me in [SinaWeibo][] or [Twitter][].

[JunLe Li]: mailto:lijunle@gmail.com
[SinaWeibo]: http://www.weibo.com/lijunle
[Twitter]: https://twitter.com/#!/LiJunLe
