'use strict';

angular.module('angNewsApp')

.controller('AuthCtrl', function ($scope, $firebase, FIREBASE_URL, $firebaseSimpleLogin, $location, Auth, user) {
  if (user) {
    $location.path('/');
  }

  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseSimpleLogin(ref);


  $scope.user = {};
  $scope.user.email = 'wagnercsfilho@hotmail.com';
  $scope.user.password = '88558806';

   $scope.login = function () {
    Auth.login($scope.user).then(function () {
      $location.path('/');
    }, function (error) {
      alert('sds');
      $scope.error = error.toString();
    });
  };

  $scope.register = function () {
    Auth.register($scope.user).then(function(user) {
      Auth.login($scope.user).then(function() {
        user.username = $scope.user.username;
        Auth.createProfile(user);
        $location.path('/');
      });
    }, function(error) {
      $scope.error = error.toString();
    });
  };
  
});