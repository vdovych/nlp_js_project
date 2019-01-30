(function () {

    function tokenize(text) {
        return text.match(/\b\w\w+\b/g)
            // .replace(/'/g, '')
            // .replace(/[^A-Za-zА-Яа-яçÇğĞıİöÖşŞüÜ0-9_]/g, ' ')
            // .replace(/\s\s+/g, ' ')
            // .split(' ')
            .map(function (s) {
                return s.toLowerCase();
            });
    }

    function extractDictionary(textArray) {
        var dict = {},
            keys = [],
            words;
        textArray = Array.isArray(textArray) ? textArray : [textArray];
        textArray.forEach(function (text) {
            words = tokenize(text);
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

    function tf(word, text) {
        var input = word.toLowerCase();
        var dict = extractDictionary(text).dict;
        return dict[input] / tokenize(text).length;
    }


    function wordInDocsCount(word, textlist) {
        var sum = 0;
        textlist.forEach(function (text) {
            sum += tokenize(text).indexOf(word) > -1 ? 1 : 0;
        });
        return sum;
    }

    function idf(word, textlist) {
        return Math.log(textlist.length / (1 + wordInDocsCount(word, textlist)));
    }

    function tfidf(word, text, textlist) {
        return tf(word, text) * idf(word, textlist);
    }

    function loadDictionary() {
        return require("../dist/tfidf_vocab.json");
    }

    function loadIdf() {
        var json = require("../dist/idf_.json");
        return json;
    }

    function tfidf_transform(text){
        const vocab = loadDictionary();
        var bag_of_text = bow(text,vocab);
        var idf_loaded = loadIdf();
        bag_of_text.forEach(function (val, idx) {
            bag_of_text[idx] = val/*tf*/ * idf_loaded[idx];
        });
        return bag_of_text;
    }

    module.exports = {
        dict: extractDictionary,
        bow: bow,
        tfidf: tfidf,
        tokenize: tokenize,
        tfidf_transform: tfidf_transform,
        loadIdf: loadIdf,
        loadDictionary:loadDictionary
    };

}());
