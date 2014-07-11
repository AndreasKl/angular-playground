'use strict';

(function(){
  var app = angular.module('testit', ['ngRoute']);
  
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/world', { controller: 'WorldCtrl', templateUrl: 'world.html' })
      .when('/hello', { controller: 'HelloCtrl', templateUrl: 'hello.html' })
      .otherwise({ redirectTo: '/world' });
  }]);
  
  app.controller('OverallCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
  }]);
  
  app.controller('HelloCtrl', ['$scope', function ($scope) {
    $scope.world = 'Hello';
  }]);
  
  app.controller('WorldCtrl', ['$scope', function ($scope) {
    $scope.world = 'World';
  }]);
})();