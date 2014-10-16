'use strict';

/**
 * @ngdoc function
 * @name angNewsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angNewsApp
 */
angular.module('angNewsApp')
  .controller('PostsCtrl', function ($scope, Post) {

		 $scope.posts = Post.all;

		  $scope.post = {url: 'http://', 'title': ''};

		  $scope.submitPost = function () {
		    Post.create($scope.post).then(function () {
		      $scope.post = {url: 'http://', 'title': ''};
		    });
		  };

		  $scope.deletePost = function (post) {
		    Post.delete(post);
		  };


  });
