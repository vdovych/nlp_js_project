chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(request.prediction);
        if(typeof request.prediction != "undefined") {
                const succ = request.prediction > 0.5;
                alert((succ?"It's a technical text.\n":"It's a non-technical text.\n") +"Probability of being technical is " + request.prediction);
                var notification = document.createElement("div");
                var elem = document.getElementById("nlp_ext-popup");
                if(elem!=null){elem.parentNode.removeChild(elem);}
                if(succ) {
                        notification.innerHTML = '<div id="nlp_ext-popup" style="display: flex;\
            flex-direction: revert;\
            flex-wrap: wrap;\
            position: fixed;\
            top: 10px;\
            right: 10px;\
            height: 240px;\
            width: 130px;\
            background: lightgreen;\
            padding: 0;\
            z-index: 999;">\
            <span>Technical content</span>\
            <button id="nlp_ext-send" style="background: yellow;\
            margin: 0;\
            width: 100%;\
            box-sizing: border-box;">Analyze on server</button>\
            </div>';
                }else {
                        notification.innerHTML = '<div id="nlp_ext-popup" style="display: flex;\
            flex-direction: revert;\
            flex-wrap: wrap;\
            position: fixed;\
            top: 10px;\
            right: 10px;\
            height: 240px;\
            width: 130px;\
            background: red;\
            z-index: 999;">\
            <span>Non-technical content</span>\
            </div>';
                }

                document.body.appendChild(notification);
                var button = document.getElementById("nlp_ext-send");
                button.addEventListener("click", ()=>{
                        var http = new XMLHttpRequest();
                        var url = 'http://localhost:3000/';
                        var data = new FormData();
                        data.append('text', request.selection);
                        http.open('POST', url, true);

//Send the proper header information along with the request

                        http.onreadystatechange = function() {//Call a function when the state changes.
                                if(http.readyState == 4 && http.status == 200) {
                                        console.log(http.responseText);
                                }
                        };
                        http.send(data);})


        }

    });
