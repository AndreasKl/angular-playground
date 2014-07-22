(function() {

  var gameLogic = function() {

    var worldDimensions = {
      width: 9,
      height: 6
    };

    var arena = [];

    function initializeArena() {
      arena = [];
      for (var i = 0; i < worldDimensions.height; i++) {
        var row = [];
        for (var y = 0; y < worldDimensions.width; y++) {
          row.push(undefined);
        }
        arena.push(row);
      }
    }
    initializeArena();

    var players = [{
      name: 'Player 1',
      symbol: 'X'
    }, {
      name: 'Player 2',
      symbol: 'O'
    }];

    var currentPlayerIndex = 0;

    function switchPlayer() {
      if (currentPlayerIndex === 0) {
        currentPlayerIndex = 1;
      } else {
        currentPlayerIndex = 0;
      }
      return players[currentPlayerIndex];
    }

    function isValidMove(x, y) {
      // The move must be within the arena.
      if (x < 0 || x >= worldDimensions.width) {
        return false;
      }

      if (y < 0 || y >= worldDimensions.height) {
        return false;
      }

      // Only empty fields can be used
      if (typeof arena[y][x] !== 'undefined') {
        return false;
      }

      // Placing a chip at the bottom of our arena is OK
      if (y === worldDimensions.height - 1) {
        return true;
      }

      // Placing a chip onto another is OK
      if (typeof arena[y + 1][x] !== 'undefined') {
        return true;
      }

      // All other moves are invalid.
      return false;
    }

    function isStraightLine(array) {
      var counter, row, char;
      for (var i = 0; i < array.length; i++) {
        row = array[i];
        counter = 0;
        for (var y = 0; y < row.length; y++) {
          if (char !== row[y]) {
            counter = 1;
            char = row[y];
          } else {
            counter++;
          }
          if (typeof char !== 'undefined' && counter === 4) {
            return true;
          }
        }
      }
    }

    function rotateMatrixBy45(matrix) {
      var summax = (matrix.length - 1) * (matrix[0].length - 1);
      var rotated = [],
        i;
      for (i = 0; i <= summax; ++i) {
        rotated.push([]);
      }
      // Fill it up by partitioning the original matrix.
      for (var j = 0; j < matrix[0].length; ++j) {
        for (i = 0; i < matrix.length; ++i) {
          rotated[i + j].push(matrix[i][j]);
        }
      }
      return rotated;
    }

    function rotateMatrixBy90(array) {
      var rotatedArray = Object.keys(array[0]).map(function(c) {
        return array.map(function(r) {
          return r[c];
        });
      });
      for (var i in rotatedArray) {
        rotatedArray[i] = rotatedArray[i].reverse();
      }
      return rotatedArray;
    }

    function isThereAWinner() {
      // When there are four coins in a straight row there is a winner.
      if (isStraightLine(arena)) {
        return true;
      }

      // When there are four coins diagonal then there is a winner.
      var rotatedBy45 = rotateMatrixBy45(arena);
      if (isStraightLine(rotatedBy45)) {
        return true;
      }

      // When there are four coins in a straight row there is a winner.
      var rotatedBy90 = rotateMatrixBy90(arena);
      if (isStraightLine(rotatedBy90)) {
        return true;
      }

      // When there are four coins diagonal then there is a winner.
      var rotatedBy135 = rotateMatrixBy45(rotatedBy90);
      if (isStraightLine(rotatedBy135)) {
        return true;
      }

      return false;
    }

    return {
      getArena: function() {
        return arena;
      },
      resetGame: function() {
        // Reset the player and the area.
        currentPlayerIndex = 0;
        initializeArena();
      },
      applyMove: function(x, y) {
        if (!isThereAWinner() && isValidMove(x, y)) {
          // FIXME: This should be a method call.
          arena[y][x] = players[currentPlayerIndex].symbol;
          switchPlayer();

          return {
            valid: true,
            player: players[currentPlayerIndex]
          };
        }
        return {
          valid: false,
          player: players[currentPlayerIndex]
        };
      },
      isThereAWinner: function() {
        return isThereAWinner();
      },
      getCurrentPlayer: function() {
        return players[currentPlayerIndex];
      }
    };
  }();

  var app = angular.module("fourInRow", ['ngRoute']);

  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/welcome', {
          controller: 'WelcomeController',
          templateUrl: 'welcome.html'
        })
        .when('/game', {
          controller: 'GameController',
          templateUrl: 'game.html'
        })
        .otherwise({
          redirectTo: '/welcome'
        });
    }
  ]);

  app.controller('WelcomeController', ['$scope',
    function() {
      // Currently empty.
    }
  ]);

  app.controller('GameController', ['$scope',
    function($scope) {

      // Initalize scope with the current arena and the first player.
      $scope.player = gameLogic.getCurrentPlayer();
      $scope.arena = gameLogic.getArena();
      $scope.winner = gameLogic.isThereAWinner();

      $scope.selectedCell = function(x, y) {
        var result = gameLogic.applyMove(x, y);
        if (result.valid) {
          // FIXME: Change to databinding.
          $scope.player = result.player;
          $scope.arena = gameLogic.getArena();
          $scope.winner = gameLogic.isThereAWinner();
        }
      };

      $scope.reset = function() {
        gameLogic.resetGame();
        $scope.player = gameLogic.getCurrentPlayer();
        $scope.arena = gameLogic.getArena();
      };
    }
  ]);

  app.directive('playfield', ['$rootScope',
    function($rootScope) {
      return {
        restrict: 'E',
        templateUrl: "playfield.html"
      };
    }
  ]);

})();