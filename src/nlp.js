import * as tf from '@tensorflow/tfjs';
import * as tfidf from '../src/tfidf.js';


chrome.runtime.onInstalled.addListener(function() {

    chrome.contextMenus.create({contexts:["selection"], title:"Analyze text", id:"analyze"});

    chrome.contextMenus.onClicked.addListener(async function (info) {

        const vals = tfidf.tfidf_transform(info.selectionText),
            model = await tf.loadModel("model.json");

        model.predict(tf.tensor2d(vals, [1,vals.length])).print();

    })
});