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


  $scope.canAddDict = function(left_lang, right_lang) {
    if (!('data' in $scope))
      return false;
    lang_pair = joinLangPair(left_lang, right_lang);
    return left_lang != right_lang && !(lang_pair in $scope.data.dicts);
  }
  $scope.addDict = function(left_lang, right_lang) {
    assert($scope.canAddDict(left_lang,right_lang));

    $scope.data.dicts[joinLangPair(left_lang, right_lang)] = {placeholder: 42};
  }

  $scope.canAddWord = function(left_lang, right_lang, left_word, right_word) {

  }
  $scope.addWord = function(left_lang, right_lang, left_word, right_word) {
    assert($scope.canAddWord(left_lang, right_lang, left_word, right_word));
  }

  $scope.q_to_add = "";
  $scope.a_to_add = "";

  $scope.add = function(q, a) {
    console.log("q and a: ", q, a);

    var words = setDefault($scope.data.dicts[$scope.lang_pair], 'words', {})
    if (!(q in words)) words[q] = {};
    words[q][a] = makeWordInfo();

    words = setDefault(
      $scope.data.dicts[joinLangPair($scope.right_lang, $scope.left_lang)],
      'words',
      {})
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