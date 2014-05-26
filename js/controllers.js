'use strict';

angular
    .module('blogControllers', ['blogModels'])
    .controller('ChangesetListCtrl', function ($scope, $routeParams, changeset) {
        console.log('changesets.openList(tip)');
        console.log('changesets.turnToPage(pageId)');
        $scope.currentPageId = $routeParams.pageId;
        $scope.changesetList = changset.getList('tip');
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
