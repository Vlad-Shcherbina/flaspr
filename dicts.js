function joinLangPair(left_lang, right_lang) {
  return left_lang + '-' + right_lang;
}

function splitLangPair(lang_pair) {
    langs = lang_pair.split('-');
    assert(langs.length == 2);
    return {left: langs[0], right: langs[1]};
}

function DictsController($scope) {
  $scope.lang_pair = 'en-de';
  $scope.$watch('lang_pair', function() {
    var langs = splitLangPair($scope.lang_pair);
    $scope.left_lang = langs.left;
    $scope.right_lang = langs.right;
  });

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