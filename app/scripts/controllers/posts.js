'use strict';

/**
 * @ngdoc function
 * @name angNewsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angNewsApp
 */
angular.module('angNewsApp')
  .controller('PostsCtrl', function ($scope, $location, Post, Auth) {

		 $scope.posts = Post.all;
		 $scope.user = Auth.user;

		  $scope.deletePost = function (post) {
		    Post.delete(post);
		  };


  });
