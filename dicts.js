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
    var lang_pair = joinLangPair(left_lang, right_lang);
    var dict = $scope.data.dicts[lang_pair];
    if (dict === undefined)
      return false;
    var words = setDefault(dict, 'words', {});
    return !(left_word in words && right_word in words[left_word]);
  }

  $scope.addWord = function(left_lang, right_lang, left_word, right_word) {
    assert($scope.canAddWord(left_lang, right_lang, left_word, right_word));
    var lang_pair = joinLangPair(left_lang, right_lang);
    var words = setDefault($scope.data.dicts[lang_pair], 'words', {});
    var word = setDefault(words, left_word, {});
    word[right_word] = makeWordInfo();
  }

  $scope.left_word = "";
  $scope.right_word = "";

  $scope.delete = function(dict_name, q, a) {
    var words = $scope.data.dicts[dict_name].words;
    delete words[q][a];
  }
}