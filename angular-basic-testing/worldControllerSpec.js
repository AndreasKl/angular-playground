'use strict';

describe('Controller:WorldCtrl', function(){

  var controller;

  beforeEach(module('testit'));

  beforeEach(inject(function($controller){
    controller = $controller;
  }));

  it('world is set', function() {
    var $scope = {};
    controller('WorldCtrl', { $scope: $scope });
    expect($scope.world).toBe('World');
  });

});