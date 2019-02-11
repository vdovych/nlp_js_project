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
                if(succ) {
                        notification.innerHTML = '<div style="display: flex;\
            flex-direction: revert;\
            flex-wrap: wrap;\
            position: fixed;\
            top: 10px;\
            right: 10px;\
            height: 160px;\
            width: 80px;\
            background: lightgreen;">\
            <span>Technical content</span>\
            <button>Analyze on server</button>\
            </div>';
                }else {
                        notification.innerHTML = '<div style="display: flex;\
            flex-direction: revert;\
            flex-wrap: wrap;\
            position: fixed;\
            top: 10px;\
            right: 10px;\
            height: 160px;\
            width: 80px;\
            background: red;">\
            <span>Non-technical content</span>\
            <button>Analyze on server</button>\
            </div>';
                }

                document.body.appendChild(notification);
        }
    });
