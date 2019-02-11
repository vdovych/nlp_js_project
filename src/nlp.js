'use strict';

import * as tf from '@tensorflow/tfjs';
import * as tfidf from '../src/tfidf.js';
var last_selected = null;
chrome.contextMenus.create({contexts:["selection"], title:"Analyze text", id:"analyze"});
chrome.contextMenus.create({contexts:["selection"], title:"Send text for deep analysis", id:"send_text"});

chrome.contextMenus.onClicked.addListener(async function (info) {
    console.log(info.menuItemId);
    if(info.menuItemId == "analyze") {
        const vals = tfidf.tfidf_transform(info.selectionText),
            model = await tf.loadModel("model.json");
        last_selected = info.selectionText;
        const prediction = await model.predict(tf.tensor2d(vals, [1, vals.length]));
        //alert(prediction);
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            console.log(tabs);
            chrome.tabs.sendMessage(tabs[0].id, {prediction: prediction.get(0, 0)});
        });
    }
    else if(info.menuItemId == "send_text"){
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/';
        var data = new FormData();
        data.append('text', info.selectionText);
        http.open('POST', url, true);

//Send the proper header information along with the request

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log(http.responseText);
            }
        };
        http.send(data);

    }
});