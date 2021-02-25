// dicepoolViewer.js -- support code for being a passive observer of dice pool

var srcDB = new BroadcastDB("RPGHUDsrc");
srcDB.localHandler = srcUpdate;
srcDB.requestSync(); // there might already be data out there.

var poolDB = new BroadcastDB("RPGHUDpool");
poolDB.localHandler = poolUpdate;
poolDB.requestSync();

var widgetDB = new BroadcastDB("RPGHUDwidget");
widgetDB.localHandler = widgetUpdate;
widgetDB.requestSync();

function srcUpdate(msg) {

}

function poolUpdate(msg) {
  //console.log(msg);
  var keys = Object.keys(msg.obj);
  var vals = Object.values(msg.obj);

  if (msg.operator == "remove") {
      // get rid of excess dice elements.
      for (var i=0; i<Object.keys(msg.obj).length; i++) {
        //console.log("Try to remove a die", keys[i]);
        obsdicearea.removeChild(obsdicearea.lastChild);
      }
  } else {
    // add img elements if there aren't enough.
    while(obsdicearea.children.length <= Math.max(...keys)) {
      var die = document.createElement("img");
      die.height = 60;
      die.width = 60;
      die.className = "dieimg";
      obsdicearea.appendChild(die);
    }

    // update images.
    //for (var i=0; i<keys.length; i++) {
    //  obsdicearea.children[i].src = srcDB.get(vals[i]);
    //}
    for (var i=Math.min(...keys); i<obsdicearea.children.length; i++) {
      obsdicearea.children[i].src = srcDB.get(poolDB.get(i));
    }
  }
}

function widgetUpdate(msg) {
  //console.log("Widget update", msg);
  var keys = Object.keys(msg.obj);
  var vals = Object.values(msg.obj);

  if (msg.operator == "remove") {
      // get rid of excess dice elements.
      for (var i=0; i<Object.keys(msg.obj).length; i++) {
        //console.log("Try to remove a die", keys[i]);
        obswidgetarea.removeChild(obswidgetarea.lastChild);
      }
  } else {
    // add img elements if there aren't enough.
    while(obswidgetarea.children.length <= Math.max(...keys)) {
      var die = document.createElement("img");
      die.height = 120;
      die.width = 120;
      die.className = "dieimg";
      obswidgetarea.appendChild(die);
    }

    // update images.
    //for (var i=0; i<keys.length; i++) {
    //  obsdicearea.children[i].src = srcDB.get(vals[i]);
    //}
    for (var i=Math.min(...keys); i<obswidgetarea.children.length; i++) {
      var newSrc = widgetDB.get(i);
      if (newSrc == "invisible") {
        obswidgetarea.children[i].style.visibility = "hidden";
      } else {
        obswidgetarea.children[i].style.visibility = "visible";
        obswidgetarea.children[i].src = newSrc;
      }
    }
  }
}
