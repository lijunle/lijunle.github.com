'use strict';

angular
    .module('blogControllers', [])
    .controller('ChangesetListCtrl', function ($scope, $routeParams) {
        console.log('changesets.openList(tip)');
        $scope.currentPageId = $routeParams.pageId;
        $scope.changesetList = [];
    })
    .controller('ChangesetDetailCtrl', function ($scope, $routeParams) {
        $scope.changesetId = $routeParams.changesetId;
    })
    .controller('SourceCtl', function ($scope, $routeParams) {
        console.log('sources.open(tip)');
        $scope.todo = 'TODO...';
        $scope.filepath = $routeParams.filepath;
    });
