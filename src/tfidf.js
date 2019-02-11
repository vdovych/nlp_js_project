(function () {

    function tokenize(text) {
        return text.match(/\b\w\w+\b/g)
            .map(function (s) {
                return s.toLowerCase();
            })
            .concat(text.match(/(\b\w\w+\b\W+\b\w\w+\b)/g)
            .map(function (s) {
                return s.toLowerCase();
            }));

    }

    function extractDictionary(textArray) {
        var dict = {},
            keys = [],
            words;
        textArray = Array.isArray(textArray) ? textArray : [textArray];
        textArray.forEach(function (text) {
            words = tokenize(text);
            console.log(words);
            words.forEach(function (word) {
                word = word.toLowerCase();
                if (!dict[word] && word !== '') {
                    dict[word] = 1;
                    keys.push(word);
                } else {
                    dict[word] += 1;
                }
            });
        });

        return {
            words: keys,
            dict: dict
        };
    }


    function bow(text, vocabulary) {
        var dict = extractDictionary([text]).dict;
        var vector = Array(Object.keys(vocabulary).length).fill(0);

        Object.keys(vocabulary).forEach(function (word) {
            vector[vocabulary[word]] = dict[word] || 0;
        });
        return vector;
    }

    function loadDictionary() {
        return require("../dist/tfidf_vocab.json");
    }

    function loadIdf() {
        return require("../dist/idf_.json");
    }

    function tfidf_transform(text){
        const vocab = loadDictionary();
        var bag_of_text = bow(text,vocab);
        var idf_loaded = loadIdf();

        bag_of_text.forEach(function (val, idx) {
            bag_of_text[idx] = val * idf_loaded[idx];//perform tf-idf transformation, similar to sklearn TfIdfVectorizer implementation
        });

        return bag_of_text;
    }

    module.exports = {
        dict: extractDictionary,
        bow: bow,
        tokenize: tokenize,
        tfidf_transform: tfidf_transform,
        loadIdf: loadIdf,
        loadDictionary:loadDictionary
    };

}());
