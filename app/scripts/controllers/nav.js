'use strict';

angular.module('angNewsApp')

.controller('NavCtrl', function ($scope, $location, Auth, Post, $mdSidenav, $mdBottomSheet) {
  
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;

   $scope.user = Auth.user;

   $scope.close = function() {
    $mdSidenav('left').close();
  };

  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle();
  };

  $scope.openBottomSheet = function() {
    $mdBottomSheet.show({
      template: '<md-bottom-sheet class="list has-header">'+
                '<md-subheader>Comment Actions</md-subheader>'+
                '<md-list>'+
                   ' <md-item>'+
                    '  <a href="#/login">Entrar</a>'+
                   ' </md-item>'+
                   ' <md-item>'+
                    '  <a href="#/register">Register</a>'+
                   ' </md-item>'+
                    ' <md-item>'+
                    '  <a ng-click="logout()">Logout</a>'+
                   ' </md-item>'+
                  '</md-list></md-bottom-sheet>'
    });
  };


  $scope.post = {url: 'http://', title: ''};


  $scope.submitPost = function () {
  	$scope.post.creator = $scope.user.profile.username;
    $scope.post.creatorUID = $scope.user.uid;
    Post.create($scope.post).then(function (ref) {
      $location.path('/posts/' + ref.name());
      $scope.post = {url: 'http://', title: ''};
    });
  };

});