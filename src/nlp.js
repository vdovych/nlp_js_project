import * as tf from '@tensorflow/tfjs';
import * as tfidf from '../src/tfidf.js';
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({contexts:["selection"], title:"Analyze text", id:"analyze"});
    chrome.contextMenus.onClicked.addListener(async function (info) {
        var text = info.selectionText;
        // Define a model for linear regression
        const model = await tf.loadModel("model.json");
        var vals = tfidf.tfidf_transform(text);
        //var vals1 = require("../dist/transformed.json");
        model.predict(tf.tensor2d(vals, [1,vals.length])).print();
        console.log(vals);
        // console.log(Math.max.apply(null,vals1[0]));
    })
});