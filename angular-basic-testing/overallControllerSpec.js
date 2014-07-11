'use strict';

describe('Controller:OverallCtrl', function(){

  var controller;
  var location;

  beforeEach(module('testit'));
  
  beforeEach(function(){
    location = {
      path: function() {
        return 'truthy';
      }
    };  
  });

  beforeEach(inject(function($controller){
    controller = $controller;
  }));

  it('isActive is falsy when route matches', function() {
    var $scope = {};
    var overall = controller('OverallCtrl', { $scope: $scope, $location: location });
    expect($scope.isActive('falsy')).toBe(false);
  });
  
  it('isActive is truthy when route matches', function() {
    var $scope = {};
    var overall = controller('OverallCtrl', { $scope: $scope, $location: location });
    expect($scope.isActive('truthy')).toBe(true);
  });

});