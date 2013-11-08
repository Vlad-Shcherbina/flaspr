function DictsController($scope) {
  $scope.language_pair = 'en-de';
  $scope.left_lang = 'en';
  $scope.right_lang = 'de';

  $scope.q_to_add = "";
  $scope.a_to_add = "";

  $scope.add = function(q, a) {
    console.log("q and a: ", q, a);

    var words =
        $scope.data.dicts[$scope.left_lang + '-' + $scope.right_lang].words;
    if (!(q in words)) words[q] = {};
    words[q][a] = makeWordInfo();

    words =
        $scope.data.dicts[$scope.right_lang + '-' + $scope.left_lang].words;
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