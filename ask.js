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