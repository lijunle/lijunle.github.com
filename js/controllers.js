'use strict';

angular
    .module('blogControllers', [])
    .controller('ChangesetCtrl', function($scope) {
        $scope.title = 'LiJunLe ACM Code';
    })
    .controller('SourceCtl', function($scope) {
        $scope.todo = 'TODO...';
    });
