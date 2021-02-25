// broadcastDB.js -- a data structure kept in synch by a broadcast channel
function BroadcastDB(name = "broadcastDB") {
  this.name = name;
  this._bc = new BroadcastChannel(this.name);
  this._bc.onmessage = this.handleMessage.bind(this);
  this._obj = {};
  this._timesignature = 0;
  this.localHandler = undefined;
}

BroadcastDB.prototype.handleMessage = function(m) {
//console.log("New message:", m);

  switch (m.data.operator) {
    case "set":
      //console.log("Setting", m.data.obj);
      var keys = Object.keys(m.data.obj);
      for (var i=0; i<keys.length; i++) {
        this._obj[keys[i]] = m.data.obj[keys[i]];
      }
      this._timesignature = m.timestamp;
      break;

    case "remove":
      var keys = Object.keys(m.data.obj);
      for (var i=0; i<keys.length; i++) {
        delete this._obj[keys[i]];
      }
      this._timesignature = m.timestamp;
      break;

    case "sync":
      if (m.time > this._timesignature) {
        var keys = Object.keys(m.data.obj);
        for (var i=0; i<keys.length; i++) {
          this._obj[keys[i]] = m.data.obj[keys[i]];
        }
        this._timesignature = m.timestamp;
        break;
      }

    case "query":
      //console.log("Got a query request");
      //this._bc.postMessage({operator: "sync",
      //                      obj: this._obj,
      //                      time: this._timesignature});
      break;

    default:
      console.error("Unkown BroadcastDB operator", m.data.operator, m);

  }

  if (!(typeof(this.localHandler) === 'undefined')) {
    this.localHandler(m.data);
  }
}

BroadcastDB.prototype.set = function(key, value) {
  this._obj[key] = value;
  this._bc.postMessage({operator: "set", obj: {[key]: value}});
}
BroadcastDB.prototype.contains = function(key) {
  return !(typeof(this._obj[key]) === 'undefined');
}
BroadcastDB.prototype.get = function(key) {
  return this._obj[key];
}
BroadcastDB.prototype.remove = function(key) {
  delete this._obj[key];
  this._bc.postMessage({operator: "remove", obj: {[key]: key}});
}
BroadcastDB.prototype.requestSync = function() {
  this._bc.postMessage({operator: "query"});
}
BroadcastDB.prototype.clear = function() {
  this._obj = {};
  this._timesignature = 0;
}
