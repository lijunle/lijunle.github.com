'use strict';

angular
    .module('app', ['ngRoute', 'blogControllers'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/changeset', {
                templateUrl: 'views/changeset-list.html',
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
    .controller('layout', function ($scope) {
        $scope.title = 'LiJunLe ACM Code';
    });
