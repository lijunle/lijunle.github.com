'use strict';

angular
    .module('app', ['ngRoute', 'blogControllers', 'blogConfig'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/changeset', {
                redirectTo: '/changeset=page1'
            })
            .when('/changeset=page:pageId', {
                templateUrl: 'views/changeset-list.html',
                controller: 'ChangesetListCtrl'
            })
            .when('/changeset=:changesetId', {
                templateUrl: 'views/changeset-detail.html',
                controller: 'ChangesetDetailCtrl'
            })
            .when('/source', {
                redirectTo: '/source=/'
            })
            .when('/source=:filepath*', {
                templateUrl: 'views/source.html',
                controller: 'SourceCtl'
            })
            .otherwise({
                redirectTo: '/changeset'
            })
    })
    .controller('layout', function ($scope, model) {
        console.log('hint.run()');
        $scope.title = model.blog_name;
    });
