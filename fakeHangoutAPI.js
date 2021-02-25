console.log("Create a bunch of fake Hangout API stuff");

const bc = new BroadcastChannel('RPGHUD');
bc.addEventListener("message", function (e) {console.log(e);});


var srcDB = new BroadcastDB("RPGHUDsrc");
var poolDB = new BroadcastDB("RPGHUDpool");
var widgetDB = new BroadcastDB("RPGHUDwidget");



var gapi = {};
gapi.hangout = {};
gapi.hangout.av = {};

gapi.hangout.av.setLocalParticipantVideoMirrored = function(setting) {this.videoMirrored = setting;}


gapi.hangout.layout = {};
var fakeVideoCanvas = {};
fakeVideoCanvas.getAspectRatio = function () {return 825 / 476;}
gapi.hangout.layout.getVideoCanvas = function () {
    return fakeVideoCanvas;
}


gapi.hangout.av = {};
gapi.hangout.av.effects = {};
gapi.hangout.av.effects.ScaleReference = {WIDTH: "w", HEIGHT: "h"};
var FakeHangoutsImageResourceUniqueID = 0;
gapi.hangout.av.effects.createImageResource = function (imgsrc) {
    var hangoutResource = {"fakeID":"FHR"+FakeHangoutsImageResourceUniqueID++, "nextOverlayID":0};
    console.log("Make fake ID "+hangoutResource.fakeID);
    hangoutResource.src = imgsrc;
    hangoutResource.createOverlay = function (obj) {
        var overlay = {"fakeID":this.fakeID+"O"+this.nextOverlayID++};
        bc.postMessage({"fid":this.fakeID, "function":"createOverlay", "param":obj}, "*");
        overlay.setPosition = function (x, y) {
            bc.postMessage({"fid":this.fakeID, "function":"setPosition", "param":{"x":x,"y":y}}, "*");
        }
        overlay.setVisible = function (onOrOff) {
            bc.postMessage({"fid":this.fakeID, "function":"setVisible", "param":onOrOff}, "*");
        }
        overlay.dispose = function () {
            bc.postMessage({"fid":this.fakeID, "function":"dispose"}, "*");
        }
        return overlay;
    }
    hangoutResource.dispose = function () {
        bc.postMessage({"fid":this.fakeID, "function":"dispose"}, "*");
    }
    bc.postMessage({"function":"createImageResource", "param":imgsrc}, "*");
    return hangoutResource;
}

gapi.hangout.getLocalParticipant = function() {
    var i = {url:"https://www.allaboutbirds.org/guide/PHOTO/LARGE/northern_cardinal_glamour.jpg"};
    var p = {id: 12345, displayName:"Fakey McFakerson", image:i};
    return {"person":p}
}

gapi.hangout.data = {};
gapi.hangout.data.getState = function () {return {};};
