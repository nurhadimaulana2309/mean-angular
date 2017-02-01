//
// here we adding ngRoute module into the apps as the dependency module - so we can use $route. etc
// here we run $rootScope because we want to declare and initalize two variables for handling authenticate status
//
var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http){
  $rootScope.authenticated = false;
  $rootScope.current_user = "";

  $rootScope.signout = function(){
    $http.get('/authenticate/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = "";
  };
});

//
// routes
// NOTES : don't forget to inject ngRoute to the angular module and include it into the header
//
app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController' // will automatically use mainController as the controller
    })
    //the login display
    .when('/login', { // in the front end this route will be triggered when you access #/login
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

//
// custom services / factory
//
app.factory('postService', function($resource){
  return $resource('/api/posts');
})

//
// controllers
// here we inject a service called $scope
// you can see that we add postService service as this controller dependency
//
app.controller('mainController', function($rootScope, $scope, postService){
  $scope.posts = postService.query();
  $scope.newPost = {created_by: '', text: '', created_at: ''};

  $scope.post = function(){
    $scope.newPost.created_by = $rootScope.current_user;
    $scope.newPost.created_at = Date.now();
    postService.save($scope.newPost, function(){
      $scope.posts = postService.query();
      $scope.newPost = {created_by: '', text: '', created_at: ''};
    });
  };
});


//
// here we inject some services like $scope, $http, $rootScope and $location
//
app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/authenticate/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  }

  $scope.register = function(){
    $http.post('/authenticate/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;

        $location.path('/');
      }
    });
  }
});