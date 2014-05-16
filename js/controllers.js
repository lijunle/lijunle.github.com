'use strict';

angular
    .module('blogControllers', [])
    .controller('ChangesetListCtrl', function ($scope, $routeParams) {
        console.log('changesets.openList(tip)');
        console.log('changesets.turnToPage(pageId)');
        $scope.currentPageId = $routeParams.pageId;
        $scope.changesetList = [];
    })
    .controller('ChangesetDetailCtrl', function ($scope, $routeParams) {
        console.log('changesets.openChangeset(changesetId)');
        $scope.changesetId = $routeParams.changesetId;
    })
    .controller('SourceCtl', function ($scope, $routeParams) {
        console.log('sources.open(tip)');
        console.log('sources.open(tip, source, true)');
        $scope.filepath = $routeParams.filepath;
    });
