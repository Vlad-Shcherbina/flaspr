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
      words: {
        "hello": {
          "hallo": makeWordInfo()}
    }},
    "de-en": {
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

function DictsController($scope) {
  $scope.q_to_add = "";
  $scope.a_to_add = "";

  $scope.add = function(q, a) {
    console.log("q and a: ", q, a);

    var words = $scope.data.dicts["en-de"].words;
    if (!(q in words)) words[q] = {};
    words[q][a] = makeWordInfo();

    words = $scope.data.dicts["de-en"].words;
    if (!(a in words)) words[a] = {};
    words[a][q] = makeWordInfo();

    $scope.q_to_add = "";
    $scope.a_to_add = "";
  }

  $scope.delete = function(dict_name, q, a) {
    var words = $scope.data.dicts[dict_name].words;
    delete words[q][a];
  }
}

function getQuestion(dicts) {
  var n = 0;
  var result = {question: null, expect: null, but: null};
  for (var dict_name in dicts) {
    var dict = dicts[dict_name];
    for (var word in dict.words) {
      if (Math.random() * (n + 1) < 1.0) {
        result.question = word;
        do {
          result.expect = [];
          for (var a in dict.words[word]) {
            if (Math.random() < 0.7)
              result.expect.push(a);
          }
        } while (result.expect.length == 0);
        result.but = []
        for (var a in dict.words[word])
          if (result.expect.indexOf(a) == -1)
            result.but.push(a);
        n += 1;
      }
    }
  }
  return result;
}

function AskController($scope, $location) {
  if (!('data' in $scope)) {
    $location.path('/dicts');
    return;
  }

  function askQuestion() {
    console.log('asking');
    $scope.q = getQuestion($scope.data.dicts);
    //$scope.dot = {scoring: false, scores: {}};
    $scope.scoring = false;
    $scope.scores = {};
  }

  askQuestion();

  $scope.$watch('scores', function() {
    if (!$scope.scoring)
      return;
    var flag = true;
    for (var i = 0; i < $scope.q.expect.length; i++) {
      var k = $scope.q.expect[i];
      if (!(k in $scope.scores)) {
        flag = false;
        break;
      }
    }
    if (flag) {
      console.log($scope.scores);
      askQuestion();
    }
  },
  /*objectEquality=*/true);
}