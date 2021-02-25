function rollDiceIntoPool(e) {
    for (var i=0; i<ListOfrpghudDiceControls.length; i++) {
        ListOfrpghudDiceControls[i].roll();
    }
    updateDisplayWidgets();
}

function sortPool(e) {
    PoolManager.diceInThePool.sort(diceSorter);
    for (var i=0; i<PoolManager.diceInThePool.length; i++) {
        PoolManager.diceInThePool[i].poolIndex = i;
        PoolManager.diceInThePool[i].updatePosition(); // for Hangouts overlay
        if (!diceresults.childNodes[i].isSameNode(PoolManager.diceInThePool[i].img)) {
            // reorder the img elements in the HTML dice pool.
            diceresults.insertBefore(PoolManager.diceInThePool[i].img, diceresults.childNodes[i]);
        }

        var p = PoolManager.diceInThePool[i];
        var cacheKey = "c"+p.home.uid+"v"+p.value+"h"+p.highlight;
        poolDB.set(p.poolIndex, cacheKey);

    }
}

function clearPool(e) {
    while (PoolManager.diceInThePool.length > 0) {
        PoolManager.diceInThePool[PoolManager.diceInThePool.length-1].remove();
    }
    updateDisplayWidgets();
}

function removeXsFromPool(e) {
    var diceToRemove = [];
    for (var i=0; i<PoolManager.diceInThePool.length; i++) {
        // check to see if it's highlighted with an X
        if (PoolManager.diceInThePool[i].highlight == 6) {
            diceToRemove.push(PoolManager.diceInThePool[i]);
        }
    }
    for (var i=0; i<diceToRemove.length; i++) {
        diceToRemove[i].remove();
    }
    updateDisplayWidgets();
}
function pickUpXsFromPool(e) {
    var diceToRemove = [];
    for (var i=0; i<PoolManager.diceInThePool.length; i++) {
        // check to see if it's highlighted with an X
        if (PoolManager.diceInThePool[i].highlight == 6) {
            diceToRemove.push(PoolManager.diceInThePool[i]);
        }
    }
    for (var i=0; i<diceToRemove.length; i++) {
        diceToRemove[i].home.dinput.value++;
        diceToRemove[i].remove();
    }
    updateDisplayWidgets();
}
function changepickupxs(e) {
    if (pickupxsenable.checked) {
        pickupxsbutton.style.display = "inline";
    } else {
        pickupxsbutton.style.display = "none";
    }
}
function changelocalmirror(e) {
}
function addTokenToPool(e) {
    var val = parseInt(numberontoken.value);
    TokenControl.generateToken(val);
    numberontoken.value = "";
    updateDisplayWidgets();
}

function addDisplayWidget(e) {
    new rpghudDisplayWidget("sum", 0);
    updateDisplayWidgets();
}

function globalHardcodeConfigure(kind) {
    // clear whatever's there. (element 0 of ListOfrpghudDiceControls is TokenControl)
    while (ListOfrpghudDiceControls.length > 1) {
        ListOfrpghudDiceControls[ListOfrpghudDiceControls.length-1].deleteControl();
    }
    while (ListOfrpghudDisplayWidgets.length > 0) {
        ListOfrpghudDisplayWidgets[ListOfrpghudDisplayWidgets.length-1].removeWidget();
    }

    if (kind == "default") {
        new rpghudDiceControl(4,  d4geometry, new rpghudColor("RGB", 255,225,232));
        new rpghudDiceControl(6,  d6geometry, new rpghudColor("RGB", 102,197,169));
        new rpghudDiceControl(8,  d8geometry, new rpghudColor("RGB", 251,177,136));
        new rpghudDiceControl(10, d10geometry, new rpghudColor("RGB", 159,97,149));
        new rpghudDiceControl(12, d12geometry, new rpghudColor("RGB", 220,46,20));
        new rpghudDiceControl(20, d20geometry, new rpghudColor("RGB", 120,212,238));
        PoolManager.highlightSettings(0, true, true);
        PoolManager.highlightSettings(1, false, false);
        PoolManager.highlightSettings(2, false, false);
        PoolManager.highlightSettings(3, false, false);
        PoolManager.highlightSettings(4, false, false);
        PoolManager.highlightSettings(5, false, false);
        PoolManager.highlightSettings(6, true, true);
        pickupxsenable.checked = false;
        changepickupxs();
    } else if (kind == "ditv") {
        new rpghudDiceControl(4, d4geometry, new rpghudColor("CSS", "#FFFFFF"));
        new rpghudDiceControl(6, d6geometry, new rpghudColor("CSS", "#FFFFFF"));
        new rpghudDiceControl(8, d8geometry, new rpghudColor("CSS", "#FFFFFF"));
        new rpghudDiceControl(10, d10geometry, new rpghudColor("CSS", "#FFFFFF"));
        PoolManager.highlightSettings(0, true, true);
        PoolManager.highlightSettings(1, true, true);
        PoolManager.highlightSettings(2, false, false);
        PoolManager.highlightSettings(3, false, false);
        PoolManager.highlightSettings(4, false, false);
        PoolManager.highlightSettings(5, false, false);
        PoolManager.highlightSettings(6, true, true);
        new rpghudDisplayWidget("sum", 1);
        updateDisplayWidgets();
        pickupxsenable.checked = false;
        changepickupxs();
    } else if (kind == "mlwm") {
        var die = new rpghudDiceControl(4, d4geometry, new rpghudColor("CSS", "#E0E0E0"));
        die.autoHighlight = {4:6};
        new rpghudDiceControl(4, d4geometry, new rpghudColor("RGB", 168,66,94));
        new rpghudDiceControl(6, d6geometry, new rpghudColor("RGB", 247,148,101));
        new rpghudDiceControl(8, d8geometry, new rpghudColor("CSS", "#FFFFFF"));
        PoolManager.highlightSettings(0, true, true);
        PoolManager.highlightSettings(1, false, false);
        PoolManager.highlightSettings(2, false, false);
        PoolManager.highlightSettings(3, false, false);
        PoolManager.highlightSettings(4, false, false);
        PoolManager.highlightSettings(5, false, false);
        PoolManager.highlightSettings(6, true, true);
        new rpghudDisplayWidget("sum", 0);
        updateDisplayWidgets();
        pickupxsenable.checked = false;
        changepickupxs();
    } else if (kind == "bw") {
        var black = new rpghudDiceControl(6, d6geometry, new rpghudColor("CSS", "#4F4F4F"));
        black.autoHighlight = {1:6,2:6,3:6};
        var gray =  new rpghudDiceControl(6, d6geometry, new rpghudColor("CSS", "#E0E0E0"));
        gray.autoHighlight = {1:6,2:6};
        var white = new rpghudDiceControl(6, d6geometry, new rpghudColor("CSS", "#FFFFFF"));
        white.autoHighlight = {1:6};
        white.hardcodedConfigure("pipped");
        gray.hardcodedConfigure("pipped");
        black.hardcodedConfigure("pipped");
        PoolManager.highlightSettings(0, true, true);
        PoolManager.highlightSettings(1, false, false);
        PoolManager.highlightSettings(2, false, false);
        PoolManager.highlightSettings(3, false, false);
        PoolManager.highlightSettings(4, false, false);
        PoolManager.highlightSettings(5, false, false);
        PoolManager.highlightSettings(6, true, true);
        new rpghudDisplayWidget("count", 0, true, "successes");
        updateDisplayWidgets();
        pickupxsenable.checked = true;
        changepickupxs();
    }
}


var PoolManager = {};



////////////////////////////////////////////////////////////////////////////
// Highlight controls
////////////////////////////////////////////////////////////////////////////
PoolManager.highlights = [
    {"symbol":" ",      "color":"#000000", "cycle":true,  "enabled":true,  "count":0},
    {"symbol":'\u25ef', "color":"#00FF00", "cycle":true,  "enabled":true,  "count":0},
    {"symbol":'\u25B3', "color":"#FF0000", "cycle":false, "enabled":false, "count":0},
    {"symbol":'\u2B1C', "color":"#0000FF", "cycle":false, "enabled":false, "count":0},
    {"symbol":'\u2b20', "color":"#FF00FF", "cycle":false, "enabled":false, "count":0},
    {"symbol":'\u2b21', "color":"#00FFFF", "cycle":false, "enabled":false, "count":0},
    {"symbol":'\u2715', "color":"#000000", "cycle":true,  "enabled":true,  "count":0}
];
PoolManager.autoHighlight = [undefined];
for (var i=1; i<=20; i++) {
    PoolManager.autoHighlight.push({h:0, opts:[], picker:undefined});
}
//PoolManager.autoHighlight = [undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//PoolManager.autoHighlightPicker = [];
PoolManager.diceInThePool = [];

PoolManager.init = function () {
    var tab = document.createElement("table");
    tab.style.textAlign = "center";
    tab.style.border = "1px solid black";
    tab.style.display = "inline-block";
    tab.style.verticalAlign = "top";
    tab.style.margin = "2px";
    var headers = document.createElement("tr");
    var labels = ["", "Color", "Cycle", "Enable"];
    for (var t=0; t<labels.length; t++) {
        var h = document.createElement("th");
        h.appendChild(document.createTextNode(labels[t]));
        headers.appendChild(h);
    }
    tab.appendChild(headers);

    for (var i=0; i<this.highlights.length; i++) {
        var row = document.createElement("tr");

        var highlight = document.createElement("td");
        highlight.appendChild(document.createTextNode(this.highlights[i].symbol));
        row.appendChild(highlight);

        var colorTD = document.createElement("td");
        this.highlights[i].colorPicker = document.createElement("input");
        this.highlights[i].colorPicker.type = "color";
        this.highlights[i].colorPicker.value = this.highlights[i].color;
        this.highlights[i].colorPicker.onchange = highlightSettingsColor.bind(this.highlights[i]);
        colorTD.appendChild(this.highlights[i].colorPicker);
        row.appendChild(colorTD);

        var cycleTD = document.createElement("td");
        this.highlights[i].cycleBox = document.createElement("input");
        this.highlights[i].cycleBox.type = "checkbox";
        this.highlights[i].cycleBox.checked = this.highlights[i].cycle;
        this.highlights[i].cycleBox.onchange = highlightSettingsCycle.bind(this.highlights[i]);
        cycleTD.appendChild(this.highlights[i].cycleBox);
        row.appendChild(cycleTD);

        var enableTD = document.createElement("td");
        this.highlights[i].enableBox = document.createElement("input");
        this.highlights[i].enableBox.type = "checkbox";
        this.highlights[i].enableBox.checked = this.highlights[i].enabled;
        this.highlights[i].enableBox.onchange = highlightSettingsEnable.bind(this.highlights[i]);
        enableTD.appendChild(this.highlights[i].enableBox);
        row.appendChild(enableTD);

        tab.appendChild(row);
    }
    diceresultsconfig.appendChild(tab);

    var autoHighlightTab = document.createElement("table");
    autoHighlightTab.style.border = "1px solid black";
    autoHighlightTab.style.display = "inline-block";
    autoHighlightTab.style.margin = "2px";
    var hr = document.createElement("tr");
    var aHead = document.createElement("th");
    aHead.colSpan = 2;
    aHead.appendChild(document.createTextNode("Roll state"));
    hr.appendChild(aHead);
    autoHighlightTab.appendChild(hr);
    for (var i=1; i<this.autoHighlight.length; i++) {
        var row = document.createElement("tr");
        var face = document.createElement("td");
        face.appendChild(document.createTextNode(i));
        row.appendChild(face);

        var picker = document.createElement("td");
        this.autoHighlight[i].picker = document.createElement("select");
        for (var j=0; j<this.highlights.length; j++) {
            this.autoHighlight[i].opts[j] = document.createElement("option");
            this.autoHighlight[i].opts[j].text = this.highlights[j].symbol;
            this.autoHighlight[i].opts[j].value = j;
            this.autoHighlight[i].opts[j].disabled = !this.highlights[j].enabled;
            this.autoHighlight[i].picker.add(this.autoHighlight[i].opts[j]);
        }
        this.autoHighlight[i].picker.onchange = PoolManager.updateAutoHighlight.bind(this);
        this.reserveHighlight(0);
        picker.appendChild(this.autoHighlight[i].picker);
        row.appendChild(picker);
        autoHighlightTab.appendChild(row);
    }
    diceresultsconfig.appendChild(autoHighlightTab);
}

PoolManager.highlightSettings = function(h, enabled, cycle) {
    this.highlights[h].enableBox.checked = enabled;
    this.highlights[h].cycleBox.checked = cycle;
    highlightSettingsEnable.bind(this.highlights[h])();
    highlightSettingsCycle.bind(this.highlights[h])();
}


PoolManager.updateAutoHighlight = function() {
    for (var i=1; i<this.autoHighlight.length; i++) {
        if (this.autoHighlight[i].h != this.autoHighlight[i].picker.value) {
            this.releaseHighlight(this.autoHighlight[i].h);
            this.autoHighlight[i].h = this.autoHighlight[i].picker.value;
            this.reserveHighlight(this.autoHighlight[i].h);
        }
    }
}

PoolManager.addDieToPool = function(die) {
    var idx = this.diceInThePool.length;
    this.diceInThePool.push(die);
    this.highlights[die.highlight].count++;
    if (this.highlights[die.highlight].count == 1) {this.disableEditing(die.highlight);}
    return idx;
}

PoolManager.removeDieFromPool = function(die) {
    this.highlights[die.highlight].count--;
    if (this.highlights[die.highlight].count == 0) {this.enableEditing(die.highlight);}

    this.diceInThePool.splice(die.poolIndex, 1);
    // TBD: is there a way to batch this, so we don't re-index multiple times per delete?
    for (var i=die.poolIndex; i<this.diceInThePool.length; i++) {
        this.diceInThePool[i].poolIndex = i;
        this.diceInThePool[i].updatePosition();
    }
}

PoolManager.reserveHighlight = function(h) {
    this.highlights[h].count++;
    if (this.highlights[h].count == 1) {this.disableEditing(h);}
}
PoolManager.releaseHighlight = function(h) {
    this.highlights[h].count--;
    if (this.highlights[h].count == 0) {this.enableEditing(h);}
}


PoolManager.cycleHighlight = function(die) {
    var highlight = die.highlight;

    // find next highlight that is active to cycle to.
    do {
        highlight++;
        if (highlight >= PoolManager.highlights.length) {highlight = 0};
    } while ((!PoolManager.highlights[highlight].enabled || !PoolManager.highlights[highlight].cycle) && (highlight != die.highlight));

    this.setHighlight(die, highlight);
}

PoolManager.setHighlight = function(die, h) {
    var oldHighlight = die.highlight;
    die.highlight = h;

    if (die.highlight != oldHighlight) {
        // we changed highlight state, so we need a new image to work with (and throw away old one)
        die.refreshImage();
        die.home.releaseDieImage(die.value, oldHighlight);

        this.highlights[oldHighlight].count--;
        if (this.highlights[oldHighlight].count == 0) {this.enableEditing(oldHighlight);}
        this.highlights[die.highlight].count++;
        if (this.highlights[die.highlight].count == 1) {this.disableEditing(die.highlight);}

        // since we're changing the highlighting the display widgets might change.
        updateDisplayWidgets();
    }
}

PoolManager.disableEditing = function(highlight) {
    //console.log("Disable editing of "+this.highlights[highlight].symbol);
    this.highlights[highlight].colorPicker.disabled = true;
    this.highlights[highlight].enableBox.disabled = true;
}
PoolManager.enableEditing = function(highlight) {
    //console.log("Enable editing of "+this.highlights[highlight].symbol);
    this.highlights[highlight].colorPicker.disabled = false;
    this.highlights[highlight].enableBox.disabled = false;
}

PoolManager.autoHighlightPopup = function(e) {

}


function highlightSettingsColor() {
    this.color = this.colorPicker.value;
    for (var i=0; i<ListOfrpghudDiceControls.length; i++) {
        ListOfrpghudDiceControls[i].cacheShootdown(PoolManager.highlights.indexOf(this));
    }
    updateDisplayWidgets();
}
function highlightSettingsCycle() {this.cycle = this.cycleBox.checked;}
function highlightSettingsEnable() {
    var idx = PoolManager.highlights.indexOf(this);
    this.enabled = this.enableBox.checked;
    for (var i=1; i<PoolManager.autoHighlight.length; i++) {
        PoolManager.autoHighlight[i].opts[idx].disabled = !this.enabled;
    }
}
// TBD: Shoot down cache on color changes.




//////////////////////////////////////////////////////////////////////////////
// Display widgets for summing or counting dice
//////////////////////////////////////////////////////////////////////////////
var ListOfrpghudDisplayWidgets = [];
function rpghudDisplayWidget(type, highlight, hideZero, label) {
    this.type = (type != undefined) ? type : "sum";
    this.highlight = (highlight != undefined) ? highlight : 0;
    this.displayValue = undefined;
    this.displayDirty = true;
    this.enabled = true;
    this.hideZero = (hideZero != undefined) ? hideZero : true;
    this.label = (label != undefined) ? label : "";
    this.keepInThumbnail = true;
    this.displayMe = true;

    this.uid = ListOfrpghudDisplayWidgets.length;
    ListOfrpghudDisplayWidgets.push(this);

    this.div = document.createElement("div");
    this.div.className = "displaywidget";
    var txt = ((type == "sum") ? "Sum " : "Count ")+PoolManager.highlights[highlight].symbol;
    this.div.appendChild(document.createTextNode(txt));
    this.img = document.createElement("img");
    this.img.height = 60;
    this.img.width = 60;
    this.div.appendChild(this.img);
    //displaywidgets.appendChild(this.div);
    displaywidgets.insertBefore(this.div, tokenwidget);

    this.configDiv = document.createElement("div");
    this.configDiv.className = "displaywidget";
    this.configDiv.style.border = "1px solid black";

    this.displayPicker = document.createElement("select");
    var optShow = document.createElement("option");
    optShow.text = "show"; optShow.value = "show"; optShow.title = "Always show on-screen";
    this.displayPicker.add(optShow);
    var optNonZero = document.createElement("option");
    optNonZero.text = "nonzero"; optNonZero.value = "nonzero"; optNonZero.title = "Show on-screen if non-zero result";
    this.displayPicker.add(optNonZero);
    var optHide = document.createElement("option");
    optHide.text = "hide"; optHide.value = "hide"; optHide.title = "Don't show on-screen";
    this.displayPicker.add(optHide);
    this.displayPicker.value = "nonzero";
    this.displayPicker.onchange = updateWidgetConfig.bind(this)
    this.configDiv.appendChild(this.displayPicker);

    //this.typePicker = document.createElement("select");
    //this.typePicker.style.width = "49%";
    //var s = document.createElement("option");
    //s.value = "sum"; s.text = "\u03A3"; s.title = "Sum highlighted dice";
    //var c = document.createElement("option");
    //c.value = "count"; c.text = "N"; c.title = "Count of highlighted dice";
    //this.typePicker.add(s);
    //this.typePicker.add(c);
    //this.typePicker.value = this.type;
    //this.typePicker.onchange = updateWidgetConfig.bind(this);
    //this.configDiv.appendChild(this.typePicker);
    //
    //this.highlightPicker = document.createElement("select");
    //this.highlightPicker.style.width = "50%";
    //for (var i=0; i<PoolManager.highlights.length; i++) {
    //    var o = document.createElement("option");
    //    o.text = PoolManager.highlights[i].symbol;
    //    o.value = i;
    //    this.highlightPicker.add(o);
    //}
    //this.highlightPicker.value = this.highlight;
    //this.highlightPicker.onchange = updateWidgetConfig.bind(this);
    //this.configDiv.appendChild(this.highlightPicker);

    this.functionPicker = document.createElement("select");
    for (var i=0; i<PoolManager.highlights.length; i++) {
        var o = document.createElement("option");
        o.text = "\u03A3 "+PoolManager.highlights[i].symbol;
        o.title = "Sum of "+PoolManager.highlights[i].symbol+" dice";
        o.value = "sum"+"|"+i;
        this.functionPicker.add(o);
    }
    for (var i=0; i<PoolManager.highlights.length; i++) {
        var o = document.createElement("option");
        o.text = "N "+PoolManager.highlights[i].symbol;
        o.title = "Count of "+PoolManager.highlights[i].symbol+" dice";
        o.value = "count"+"|"+i;
        this.functionPicker.add(o);
    }
    this.functionPicker.value = this.type+"|"+this.highlight;
    this.functionPicker.onchange = updateWidgetConfig.bind(this);
    this.configDiv.appendChild(this.functionPicker);


    var rightAlignDiv = document.createElement("div");
    this.rightAlignBox = document.createElement("input");
    this.rightAlignBox.type = "checkbox";
    this.rightAlignBox.checked = !this.keepInThumbnail;
    this.rightAlignBox.title = "Align to right of window, don't keep in thumbnail";
    this.rightAlignBox.onchange = updateWidgetConfig.bind(this);
    rightAlignDiv.appendChild(this.rightAlignBox);
    rightAlignDiv.appendChild(document.createTextNode("\u2192\u007C")); // --> |
    this.configDiv.appendChild(rightAlignDiv);

    var deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "X";
    deleteButton.onclick = this.removeWidget.bind(this);
    deleteButton.style.width = "20%";
    this.configDiv.appendChild(deleteButton);

    this.labelButton = document.createElement("input");
    this.labelButton.type = "button";
    this.labelButton.value = (this.label == "") ? " " : this.label;
    this.labelButton.title = "Change Label";
    this.labelButton.onclick = editWidgetLabelPopup.bind(this);
    this.labelButton.style.width = "75%";
    this.configDiv.appendChild(this.labelButton);

    displaywidgetsconfig.insertBefore(this.configDiv, addwidgetdiv);

    this.updateValue();
    this.drawWidgetDisplay();

    for (var i=0; i<ListOfrpghudDisplayWidgets.length; i++) {
        ListOfrpghudDisplayWidgets[i].updatePosition();
    }
}

function editWidgetLabelPopup(e) {
    var popup = {
        div : document.createElement("div"),
        labelBox : document.createElement("input"),
        target: this
    }
    popup.div.className = "popupwindow";
    popup.div.style.backgroundColor = "#F9F9F9";
    popup.labelBox.style.margin = "1px";
    popup.labelBox.value = this.label;
    popup.div.appendChild(popup.labelBox);
    var popupButtons = document.createElement("div");
    popupButtons.className = "popupbuttons";
    var okButton = document.createElement("input");
    okButton.style.width = "40%";
    okButton.type = "button";
    okButton.value = "OK";
    okButton.onclick = commitWidgetPopup.bind(popup);
    popupButtons.appendChild(okButton);
    var cancelButton = document.createElement("input");
    cancelButton.style.width = "40%";
    cancelButton.type = "button";
    cancelButton.value = "Cancel";
    cancelButton.onclick = clearWidgetPopup.bind(popup);
    popupButtons.appendChild(cancelButton);
    popup.div.appendChild(popupButtons);
    displaywidgetsconfig.appendChild(popup.div);
}
function commitWidgetPopup(e) {
    this.target.label = this.labelBox.value;
    displaywidgetsconfig.removeChild(this.div);
    this.target.labelButton.value = (this.target.label == "") ? " " : this.target.label;
    updateDisplayWidgets();
}
function clearWidgetPopup(e) {
    displaywidgetsconfig.removeChild(this.div);
}

rpghudDisplayWidget.prototype.removeWidget = function() {
    displaywidgets.removeChild(this.div);
    displaywidgetsconfig.removeChild(this.configDiv);
    var widgetIndex = ListOfrpghudDisplayWidgets.indexOf(this);
    ListOfrpghudDisplayWidgets.splice(widgetIndex, 1);
    widgetDB.remove(widgetIndex);
}

function updateWidgetConfig() {
    if (this.displayPicker.value == "show") {
        this.enabled = true;
        this.hideZero = false;
    } else if (this.displayPicker.value == "nonzero") {
        this.enabled = true;
        this.hideZero = true;
    } else {
        this.enabled = false;
        this.hideZero = false;

    }
    //this.type = this.typePicker.value;
    //this.highlight = this.highlightPicker.value;
    console.log("Try to set type/highlight to "+this.functionPicker.value);
    var typehighlight = this.functionPicker.value.split("|");
    this.type = typehighlight[0];
    this.highlight = typehighlight[1];
    this.keepInThumbnail = !this.rightAlignBox.checked;

    this.div.removeChild(this.div.firstChild);
    var txt = ((this.type == "sum") ? "Sum " : "Count ")+PoolManager.highlights[this.highlight].symbol;
    this.div.insertBefore(document.createTextNode(txt), this.img);

    updateDisplayWidgets();
}
rpghudDisplayWidget.prototype.updateGraphicalRepresentation = function() {
    if (this.displayDirty) {
        this.drawWidgetDisplay();
    }
}
rpghudDisplayWidget.prototype.updateValue = function() {
    var v = 0;
    for (var i=0; i<PoolManager.diceInThePool.length; i++) {
        if (PoolManager.diceInThePool[i].highlight == this.highlight) {
            if (this.type == "sum") {v += PoolManager.diceInThePool[i].mathValue;}
            else if (this.type == "count") {v++;}
            else {console.error("Unknown display widget type: "+this.type);}
        }
    }
    if (this.displayValue != v) {
        this.displayValue = v;
        this.displayDirty = true;
    }
    this.displayMe = this.enabled && (!this.hideZero || (this.displayValue != 0));
}
function updateDisplayWidgets() {
    for (var i=0; i<ListOfrpghudDisplayWidgets.length; i++) {
        ListOfrpghudDisplayWidgets[i].updateValue();
    }
    for (var i=0; i<ListOfrpghudDisplayWidgets.length; i++) {
        ListOfrpghudDisplayWidgets[i].updatePosition();
    }
    for (var i=0; i<ListOfrpghudDisplayWidgets.length; i++) {
        ListOfrpghudDisplayWidgets[i].updateGraphicalRepresentation();
    }
}
rpghudDisplayWidget.prototype.drawWidgetDisplay = function() {
    var context = diecanvas.getContext("2d");
    var corner = 30;
    var linewidth = 10;
    var halfwidth = linewidth * 0.5;
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#ECECEC";
    context.lineWidth = linewidth;

    // rounded-corner rectangle
    context.beginPath();
    context.moveTo(halfwidth+corner, halfwidth);
    context.lineTo(DieCanvasSize-(halfwidth+corner), halfwidth);
    context.quadraticCurveTo(DieCanvasSize-halfwidth, halfwidth, DieCanvasSize-halfwidth, halfwidth+corner);
    context.lineTo(DieCanvasSize-halfwidth, DieCanvasSize-(halfwidth+corner));
    context.quadraticCurveTo(DieCanvasSize-halfwidth, DieCanvasSize-halfwidth, DieCanvasSize-(halfwidth+corner), DieCanvasSize-halfwidth);
    context.lineTo(halfwidth+corner, DieCanvasSize-halfwidth);
    context.quadraticCurveTo(halfwidth, DieCanvasSize-halfwidth, halfwidth, DieCanvasSize-(halfwidth+corner));
    context.lineTo(halfwidth, halfwidth+corner);
    context.quadraticCurveTo(halfwidth, halfwidth, halfwidth+corner, halfwidth);
    context.fill();
    context.stroke();

    // write label below where number goes.
    if (this.label != "") {
        drawHeaderText(context, this.label, d6geometry, "#ECECEC");
    }

    //context.fillRect(0, 0, DieCanvasSize, DieCanvasSize);
    drawDieText(context, this.displayValue, d6geometry, "#000000");
    drawHighlight(context, this.highlight, PoolManager.highlights[this.highlight].color);
    this.img.src = diecanvas.toDataURL();

    if (this.displayMe) {
      widgetDB.set(this.uid, this.img.src);
    } else {
      widgetDB.set(this.uid, "invisible");
    }
}
rpghudDisplayWidget.prototype.updatePosition = function() {
    if (HangoutDieVertImageScale == undefined) {
        HangoutDieVertImageScale = HangoutDieImageScale * gapi.hangout.layout.getVideoCanvas().getAspectRatio();
    }

    var topOfLowerThird = 0.5;  // TBD: change this when we actually have a lower third.
    this.hangoutPosX = this.keepInThumbnail ? 0.234 : 0.5-HangoutDieImageScale;  // arrived at empirically?
    var indexFromBottom=0;
    for (var i=ListOfrpghudDisplayWidgets.indexOf(this)+1; i<ListOfrpghudDisplayWidgets.length; i++) {
        if (ListOfrpghudDisplayWidgets[i].displayMe) {indexFromBottom++;}
    }
    this.hangoutPosY = 0.5 - (indexFromBottom+0.5)*2*HangoutDieVertImageScale;
}
