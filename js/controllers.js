'use strict';

angular
    .module('blogControllers', [])
    .controller('ChangesetCtrl', function ($scope) {
        console.log('changesets.openList(tip)');
        $scope.changesetList = [];
    })
    .controller('SourceCtl', function ($scope) {
        console.log('sources.open(tip)');
        $scope.todo = 'TODO...';
    });
