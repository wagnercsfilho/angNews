'use strict';



angular.module('angNewsApp')

.factory('Post', function ($firebase, FIREBASE_URL) {

	  var ref = new Firebase(FIREBASE_URL);
	  var posts = $firebase(ref.child('posts')).$asArray();

	  var Post = {
	    all: posts,
	    create: function (post) {
	        var p = posts.$add(post);
	        
	        p.then(function(postRef){
	      	$firebase(ref.child('user_posts')
	      			  .child(post.creatorUID))
	      			  .$push(postRef.name()); 

	      });

	       return p;
	    },
	    get: function (postId) {
	      return $firebase(ref.child('posts').child(postId)).$asObject();
	    },
	    delete: function (post) {
	      return posts.$remove(post);
	    },
	    comments: function (postId) {
		  return $firebase(ref.child('comments').child(postId)).$asArray();
		}
	  };

	  return Post;

});