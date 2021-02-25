//////////////////////////////////////////////////////////////////
// GUI function that implements popup menu
//////////////////////////////////////////////////////////////////

function popupMenu(e) {
    var popup = document.createElement("div");
    popup.className = "popupmenu";
    popup.style.left = e.pageX - 5;
    popup.style.top = e.pageY -5;

    console.log("Running popupMenu for "+this);
    
    var items = this.populateContextMenu();
    for (var i=0; i<items.length; i++) {
        if (items[i] == undefined) {
            popup.appendChild(document.createElement("hr"));
        } else {
            var entry = document.createElement("div");
            entry.className = "popupentry";
            entry.appendChild(document.createTextNode(items[i].text));
            entry.addEventListener("click", items[i].functionality);
            entry.addEventListener("click", popupClearMenu.bind(popup));
            popup.appendChild(entry);
        }
    }
    
    popup.addEventListener("mouseleave", popupClearMenu.bind(popup));
    document.getElementsByTagName("body")[0].appendChild(popup);
}

function popupClearMenu(e) {
    document.getElementsByTagName("body")[0].removeChild(this);
}


///////////////////////////////////////////////////
// Placeholder lower-third stuff
///////////////////////////////////////////////////
var LTResource = undefined;
var LTOverlay = undefined;
var LTCanvas = undefined;
var LTContext = undefined;
function lowerthirdchange() {
    if (whatkindoflowerthird.value != "basic") {
        basiclowerthird.style.display = "none";
        if (LTOverlay  != undefined) {LTOverlay.dispose(); LTOverlay = undefined;}
        if (LTResource != undefined) {LTResource.dispose();LTResource= undefined;}
    } else {
        // we've enable the basic lower third.
        basiclowerthird.style.display = "block";
        if (LTCanvas == undefined) {
            LTCanvas = document.createElement("canvas");
            LTCanvas.height = 63;
            LTCanvas.width = 637;
            LTContext = LTCanvas.getContext("2d");
        }
        LTContext.clearRect(0, 0, LTCanvas.width, LTCanvas.height);
        if (lttitleenable.checked) {
            LTContext.fillStyle = lttitlecolor.value;
            LTContext.fillRect(63,0,574,42);
            LTContext.strokeStyle = lttitletextcolor.value;
            LTContext.fillStyle = lttitletextcolor.value;
            LTContext.textBaseline = "top";
            LTContext.font = "32px Helvetica";
            LTContext.fillText(lttitle.value, 68,0);
        }
        if (ltsubtitleenable.checked) {
            LTContext.fillStyle = ltsubtitlecolor.value;
            LTContext.fillRect(74,37,552,26);
            LTContext.strokeStyle = ltsubtitletextcolor.value;
            LTContext.fillStyle = ltsubtitletextcolor.value;
            LTContext.textBaseline = "top";
            LTContext.font = "22px Helvetica";
            LTContext.fillText(ltsubtitle.value, 79,37);
        }
        var imgSrc = LTCanvas.toDataURL();
        var newResource = gapi.hangout.av.effects.createImageResource(imgSrc);
        var newOverlay = newResource.createOverlay({scale : {magnitude: 0.664,
                                                             reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
        newOverlay.setPosition(0.664*0.5-0.5,
                               0.5-0.5*(63/697*gapi.hangout.layout.getVideoCanvas().getAspectRatio()));
        newOverlay.setVisible(true);
        if (LTOverlay != undefined) {LTOverlay.dispose();}
        LTOverlay = newOverlay;
        if (LTResource != undefined) {LTResource.dispose();}
        LTResource = newResource;
    }
}