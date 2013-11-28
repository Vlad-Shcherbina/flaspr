'use strict';

var app = angular.module("flaspr", ["ngRoute", "firebase"]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dicts', {
        templateUrl: 'dicts.html',
        controller: 'DictsController'
      }).
      when('/ask', {
        templateUrl: 'ask.html',
        controller: 'AskController'
      }).
      otherwise({
        redirectTo: '/ask',
      });
  }]);


function makeWordInfo() {
  return {p: 0};
}

function setDefaultData($data) {
  $data.dicts = {
    "en-de": {
      placeholder: 0,
      words: {
        "hello": {
          "hallo": makeWordInfo()}
    }},
    "de-en": {
      placeholder: 0,
      words: {
        "hallo": {
          "hello": makeWordInfo()}
    }}
  };
}

function RootController($scope, angularFire, angularFireAuth) {
  console.log("Root controller");

  $scope.login = function() {
    console.log("login");
    angularFireAuth.login("github");
  };
  $scope.logout = function() {
    angularFireAuth.logout();
  };

  var ref = new Firebase("https://flaspr.firebaseio.com/");
  angularFireAuth.initialize(ref, {scope: $scope, name: "auth"});

  $scope.$on("angularFireAuth:login", function(evt, user) {
    console.log('on login');
    $scope.data = $scope.$new(/*isolate=*/true);

    setDefaultData($scope.data);

    var ref = new Firebase("https://flaspr.firebaseio.com/users/" + user.username + "/dicts");
    angularFire(ref, $scope.data, "dicts");
  });
  $scope.$on("angularFireAuth:logout", function(evt) {
    console.log('on logout');
    if ('data' in $scope)
      $scope.data.$destroy();
    delete $scope.data;
  });
  $scope.$on("angularFireAuth:error", function(evt, err) {
    console.log('login error: ' + err);
  });
}
