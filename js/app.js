'use strict';

angular
    .module('app', ['ngRoute', 'blogControllers', 'blogConfig'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/changeset', {
                templateUrl: 'views/changeset.html',
                controller: 'ChangesetCtrl'
            })
            .when('/source', {
                templateUrl: 'views/source.html',
                controller: 'SourceCtl'
            })
            .otherwise({
                redirectTo: '/changeset'
            })
    })
    .controller('layout', function ($scope, model) {
        $scope.title = model.blog_name;
    });
