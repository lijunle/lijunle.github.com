'use strict';

angular
    .module('app', ['ngRoute', 'blogControllers', 'blogConfig'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/changeset/page-:pageId', {
                templateUrl: 'views/changeset-list.html',
                controller: 'ChangesetCtrl'
            })
            .when('/changeset/id-:pageId', {
                templateUrl: 'views/changeset-details.html',
                controller: 'ChangesetCtrl'
            })
            .when('/source', {
                templateUrl: 'views/source.html',
                controller: 'SourceCtl'
            })
            .otherwise({
                redirectTo: '/changeset/page-1'
            })
    })
    .controller('layout', function ($scope, model) {
        $scope.title = model.blog_name;
    });
