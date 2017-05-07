'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngSanitize'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', { templateUrl: 'template.html', controller: 'HomeCtrl' });
}])
.factory('Contacts', function() {
  return new AlgoliaSearch('9UEO6QR879', '9fb58a85dd2d418e1db0da5942fa8d40').initIndex('food');
})
.controller('HomeCtrl', function ($scope, Contacts) {
    $scope.hits = [];
    $scope.query = '';
    $scope.initRun = true;
    $scope.search = function() {
      Contacts.search($scope.query, function(success, content) {
        if (!success || $scope.query != content.query) {
          return;
        }
        $scope.hits = content.hits;
        if ($scope.initRun){
          $scope.$apply();
          $scope.initRun = false;
        }
      });
    };
    $scope.search();
});
