'use strict';

describe('Controller:HelloCtrl', function(){

  var controller;

  beforeEach(module('testit'));

  beforeEach(inject(function($controller){
    controller = $controller;
  }));

  it('hello is set', function() {
    var $scope = {};
    controller('HelloCtrl', { $scope: $scope });
    expect($scope.world).toBe('Hello');
  });

});