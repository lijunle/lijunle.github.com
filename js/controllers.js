'use strict';

angular
    .module('blogControllers', [])
    .controller('ChangesetCtrl', function ($scope, $routeParams) {
        console.log('changesets.openList(tip)');
        $scope.currentPageId = $routeParams.pageId;
        $scope.changesetList = [];
    })
    .controller('SourceCtl', function ($scope) {
        console.log('sources.open(tip)');
        $scope.todo = 'TODO...';
    });
