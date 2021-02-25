///////////////////////////////////////////////////////////////
// Global constants
///////////////////////////////////////////////////////////////
var BlackTextThreshold = 75;


///////////////////////////////////////////////////////////////
// Functions for the dice-roller controls and rolling the dice
///////////////////////////////////////////////////////////////
var ListOfrpghudDiceControls = [];

function rpghudDiceControl(size, geometry, color) {
    this.type = "die"; // other option is "bag"
    this.size = size;
    this.name = "d"+size;
    this.customName = false;
    this.geometry = geometry;
    this.facecolor = color;
    this.edgecolor = new rpghudColor("LCh", color.L - 3, color.C, color.h);
    this.shadcolor = new rpghudColor("LCh", color.L - 1, color.C, color.h);
    this.diceTextColor = (this.facecolor.L > BlackTextThreshold) ? "#000000" : "#FFFFFF";
    //console.log("L is "+this.facecolor.L+" so text is "+this.diceTextColor);
    this.displayOverride = {};
    this.valueOverride = {};
    this.autoHighlight = {};
    this.imageCache = [];
    this.bagType = "stateless";
    this.tokenBag = new rpghudBag(size, false);
    this.tokenDefault = new rpghudBag(size, false);
    this.customFont = undefined;

    ListOfrpghudDiceControls.push(this);
    this.createHTMLControl();

    this.uid = rpghudDiceControl.nextUid++;
}
rpghudDiceControl.nextUid = 0;

rpghudDiceControl.prototype.roll = function() {
    // make sure we're not trying to draw more tokens than exist.
    if ((this.type == "bag") && (this.bagType != "stateless")) {
        if (this.dinput.value > this.tokenBag.numTokens) {this.dinput.value = this.tokenBag.numTokens;}
    }
    for (var i=0; i<this.dinput.value; i++) {
        var val = ((this.type == "bag") && (this.bagType != "stateless")) ? this.tokenBag.draw() : Math.floor(this.size*Math.random())+1;
        var h = (this.autoHighlight[val] != undefined) ? this.autoHighlight[val] : PoolManager.autoHighlight[val].h;
        var d = new rpghudDie(val, h, this);
    }
    this.dinput.value = 0;

    // changed number of tokens in bag, check if need to set image to empty.
    if ((this.type == "bag") && (this.bagType != "stateless")) {this.updateBagImage();}
}

rpghudDiceControl.prototype.getDieImage = function(val, highlight=0) {
    var cacheKey = "c"+this.uid+"v"+val+"h"+highlight;
    //console.log("cacheKey", cacheKey, "from", this.uid, val, highlight);

    if (this.imageCache[highlight] == undefined) {this.imageCache[highlight] = [];}
    if (this.imageCache[highlight][val] != undefined) {
        this.imageCache[highlight][val].count++;

        // if it's in the data structure but has no users it was probably cleaned up, so create resource.
        if (this.imageCache[highlight][val].count == 1) {
            srcDB.set(cacheKey, this.imageCache[highlight][val].img);
        }

        return this.imageCache[highlight][val];
    }

    // we don't have it in the cache, so draw it.
    var context = diecanvas.getContext("2d");
    drawDiePolygon(context, this.geometry, this.facecolor, this.edgecolor, this.shadcolor);
    var txt = (this.displayOverride[val] != undefined) ? this.displayOverride[val] : val;
    drawDieText(context, txt, this.geometry, this.diceTextColor, this.customFont);
    drawHighlight(context, highlight, PoolManager.highlights[highlight].color);
    this.imageCache[highlight][val] = {"count":1, "img":diecanvas.toDataURL()};
    srcDB.set(cacheKey, this.imageCache[highlight][val].img);
    this.disableEditing(); // don't allow editing while there are "live" dice in play.
    return this.imageCache[highlight][val];
}
rpghudDiceControl.prototype.releaseDieImage = function(val, highlight) {
    this.imageCache[highlight][val].count--;
    if (this.imageCache[highlight][val].count == 0) {
        // nothing is using this image, it can be cleaned up.
        //console.log("I would clean up "+this.facecolor.CSS+" d"+this.size+" val="+val+" highlight="+highlight);
        var cacheKey = "c"+this.uid+"v"+val+"h"+highlight;
        srcDB.remove(cacheKey);
        this.enableEditing();
    }
}
rpghudDiceControl.prototype.cacheShootdown = function(h) {
    // clear out our image cache. If h is specified just clear cache for that highlight, otherwise clear all.
    if (h == undefined) {
        this.imageCache = [];
    } else {
        this.imageCache[h] = [];
    }
}

rpghudDiceControl.prototype.createHTMLControl = function() {
    this.controlDiv = document.createElement("div");
    this.controlDiv.className = "dieinput";

    this.diceImg = document.createElement("img");
    var context = diecanvas.getContext("2d");
    drawDiePolygon(context, this.geometry, this.facecolor, this.edgecolor, this.shadcolor);  // placeholder?
    this.diceImg.src = diecanvas.toDataURL();
    this.diceImg.height = 60;
    this.diceImg.width = 60;
    this.diceImg.className = "dieimg";
    this.controlDiv.appendChild(this.diceImg);

    this.incrButton = document.createElement("input");
    this.incrButton.className = "incrbutton";
    this.incrButton.type = "button";
    this.incrButton.value = '\u25b2';
    this.incrButton.onclick = rpghudDiceControlIncrement.bind(this);
    this.controlDiv.appendChild(this.incrButton);

    this.centerDiv = document.createElement("div");
    this.centerDiv.className = "dnumcontainer";
    this.centerDiv.style.color = this.diceTextColor;
    this.controlDiv.appendChild(this.centerDiv);

    this.dinput = document.createElement("input");
    this.dinput.className = "dnumdie";
    this.dinput.type = "text";
    this.dinput.size = 2;
    this.dinput.maxLength = 2;
    this.dinput.value = 0;
    this.centerDiv.appendChild(this.dinput);
    this.centerDiv.appendChild(document.createTextNode("d"+this.size));

    this.decrButton = document.createElement("input");
    this.decrButton.className = "decrbutton";
    this.decrButton.type = "button";
    this.decrButton.value = '\u25bc';
    this.decrButton.onclick = rpghudDiceControlDecrement.bind(this);
    this.controlDiv.appendChild(this.decrButton);

    this.bagButton = document.createElement("input");
    this.bagButton.className = "manipulatebag";
    this.bagButton.type = "button";
    this.bagButton.value = '\uD83D\uDC46';
    this.bagButton.style.display = "none";
    this.bagButton.onclick = this.tokenContentsPopup.bind(this, "dynamic");
    this.controlDiv.appendChild(this.bagButton);

    dicecontrols.appendChild(this.controlDiv);


    this.configDiv = document.createElement("div");
    this.configDiv.className = "dieinput";
    this.configDiv.oncontextmenu = popupMenu.bind(this);

    this.colorDiv = document.createElement("div");
    //this.colorDiv.appendChild(document.createTextNode("color:"));
    this.colorPicker = document.createElement("input");
    this.colorPicker.style.width = "80%";
    this.colorPicker.type = "color";
    this.colorPicker.value = this.facecolor.CSS;
    this.colorPicker.onchange = tryToChangeColor.bind(this);
    this.colorDiv.appendChild(this.colorPicker);
    this.configDiv.appendChild(this.colorDiv);


    this.geometryDiv = document.createElement("div");
    this.deleteButton = document.createElement("input");
    this.deleteButton.className = "cfgbutton";
    this.deleteButton.type = "button";
    this.deleteButton.style.width = "18%";
    this.deleteButton.style.padding = "0px";
    this.deleteButton.value = "X";
    this.deleteButton.onclick = this.deleteControl.bind(this);
    this.geometryDiv.appendChild(this.deleteButton);
    //this.geometryDiv.appendChild(document.createTextNode("shape:"));
    this.geometryPicker = document.createElement("select");
    this.geometryPicker.className = "cfgbutton";
    this.geometryPicker.style.width = "62%";
    var dice = {0: "bag", 2:"d2", 4:"d4", 6:"d6", 8:"d8", 10:"d10", 12:"d12", 20:"d20"};
    for (var d in dice) {
        var opt = document.createElement("option");
        opt.value = d;
        opt.text = dice[d];
        this.geometryPicker.add(opt);
    }
    this.geometryPicker.value = this.size;
    this.geometryPicker.onchange = tryToChangeGeometry.bind(this);
    this.geometryDiv.appendChild(this.geometryPicker);
    this.configDiv.appendChild(this.geometryDiv);

    this.customizeDiv = document.createElement("div");
    var leftButton = document.createElement("input");
    leftButton.className = "cfgbutton";
    leftButton.style.width = "18%";
    leftButton.style.padding = "0px";
    leftButton.type = "button";
    leftButton.value = "\u25c0"; //"<"; //
    leftButton.onclick = this.swap.bind(this, false);
    this.customizeDiv.appendChild(leftButton);
    this.customizeButton = document.createElement("input");
    this.customizeButton.className = "cfgbutton";
    this.customizeButton.style.width = "44%";
    this.customizeButton.style.padding = "0px";
    this.customizeButton.type = "button";
    this.customizeButton.value = "cfg";
    this.customizeButton.onclick = this.editPopup.bind(this);
    this.customizeDiv.appendChild(this.customizeButton);
    var rightButton = document.createElement("input");
    rightButton.className = "cfgbutton";
    rightButton.style.width = "18%";
    rightButton.style.padding = "0px";
    rightButton.type = "button";
    rightButton.value = "\u25b6"; //">"; //
    rightButton.onclick = this.swap.bind(this, true);
    this.customizeDiv.appendChild(rightButton);
    this.configDiv.appendChild(this.customizeDiv);

    dicecontrolsconfig.insertBefore(this.configDiv, adddiecontainer);

}
rpghudDiceControl.prototype.populateContextMenu = function() {
    var items = [];

    if (!this.customizeButton.disabled) {
        items.push({"text":"Set as Fudge die", functionality:this.hardcodedConfigure.bind(this, "fudge")});
        items.push({"text":"Set as pipped d6", functionality:this.hardcodedConfigure.bind(this, "pipped")});
        items.push({"text":"Set as head/tail coin", functionality:this.hardcodedConfigure.bind(this, "coin")});
        items.push(undefined);
        items.push({"text":"Remove this die type", "functionality":this.deleteControl.bind(this)});
    }

    // can only auto-configure entire app if there are no dice in the pool.
    if (PoolManager.diceInThePool.length == 0) {
        items.push(undefined);
        items.push({"text":"Default Layout", "functionality":globalHardcodeConfigure.bind(this, "default")});
        items.push({"text":"DitV Layout", "functionality":globalHardcodeConfigure.bind(this, "ditv")});
        items.push({"text":"MLwM Layout", "functionality":globalHardcodeConfigure.bind(this, "mlwm")});
        items.push({"text":"Burning Wheel", "functionality":globalHardcodeConfigure.bind(this, "bw")});
    }

    return items;
}
rpghudDiceControl.prototype.swap = function(up) {
    var currentIndex = ListOfrpghudDiceControls.indexOf(this);
    var desiredIndex = up ? currentIndex+1 : currentIndex -1;
    if ((desiredIndex < 1) || (desiredIndex == ListOfrpghudDiceControls.length)) {
        return; // already at extreme end, can't swap further.
    }

    ListOfrpghudDiceControls.splice(currentIndex, 1);
    ListOfrpghudDiceControls.splice(desiredIndex, 0, this);
    if (up) {
        dicecontrols.insertBefore(ListOfrpghudDiceControls[currentIndex].controlDiv, this.controlDiv);
        dicecontrolsconfig.insertBefore(ListOfrpghudDiceControls[currentIndex].configDiv, this.configDiv);
    } else {
        dicecontrols.insertBefore(this.controlDiv, ListOfrpghudDiceControls[currentIndex].controlDiv);
        dicecontrolsconfig.insertBefore(this.configDiv, ListOfrpghudDiceControls[currentIndex].configDiv);
    }
}

rpghudDiceControl.prototype.setSize = function(s) {
    this.type = "die";
    this.size = s;
    this.geometryPicker.value = this.size;
    this.geometry = DieSizes[this.size];
    var context = diecanvas.getContext("2d");
    drawDiePolygon(context, this.geometry, this.facecolor, this.edgecolor, this.shadcolor);
    this.diceImg.src = diecanvas.toDataURL();
    this.cacheShootdown();
}
rpghudDiceControl.prototype.setBag = function() {
    this.type = "bag";
    this.geometry = DieSizes[2];  // use "token" geometry.
    this.updateBagImage();
    this.cacheShootdown();
    for (i=1; i<=this.size; i++) {
        if (this.tokenBag.choices[i] == undefined) {
            this.tokenBag.choices[i] = 0;
        }
        if (this.tokenDefault.choices[i] == undefined) {
            this.tokenDefault.choices[i] = 0;
        }
    }
}
rpghudDiceControl.prototype.updateBagImage = function() {
    var context = diecanvas.getContext("2d");
    drawBag(context, this.tokenBag.empty, this.facecolor, this.edgecolor, this.shadcolor);
    this.diceImg.src = diecanvas.toDataURL();

    // button display may change.
    if (this.bagType == "stateless") {
        this.bagButton.style.display = "none";
    } else if (this.bagType == "statefulEdit") {
        this.bagButton.style.display = "block";
        this.bagButton.value = '\uD83D\uDC46';
    } else if (this.bagType == "statefulAdd") {
        this.bagButton.style.display = "block";
        this.bagButton.value = "+";
    } else if (this.bagType == "statefulEmpty") {
        if (this.tokenBag.empty) {
            this.bagButton.style.display = "block";
            this.bagButton.value = '\uD83D\uDC46';
        } else {
            this.bagButton.style.display = "none";
        }
    } else if (this.bagType == "statefulReset") {
        if (this.tokenBag.empty) {
            this.bagButton.style.display = "block";
            this.bagButton.value = '\u267a';
        } else {
            this.bagButton.style.display = "none";
        }
    }
}

rpghudDiceControl.prototype.hardcodedConfigure = function(kind) {
    if (kind == "fudge") {
        this.setSize(6);
        this.displayOverride = {1:"\u2013",2:"\u2013",3:" ",4:" ",5:"+",6:"+"};
        this.valueOverride = {1:-1, 2:-1, 3:0, 4:0, 5:1, 6:1};
        this.customName = true;
        this.setName("dF");
    } else if (kind == "pipped") {
        this.setSize(6);
        this.displayOverride = {1:"\u2680", 2:"\u2681", 3:"\u2682", 4:"\u2683", 5:"\u2684", 6:"\u2685"};
        this.customName = true;
        this.setName("d6\u2685");
    } else if (kind == "coin") {
        this.setSize(2);
        this.displayOverride = {1:'\uD83D\uDE38', 2:'\uD83D\uDC08'};  // these are "surrogate halves" for single unicode characters
        this.valueOverride = {1:0, 2:0};
        this.customName = true;
        this.setName("coin");
    }
    this.cacheShootdown();
}

rpghudDiceControl.prototype.deleteControl = function() {
    //var areYouSure = window.confirm("Delete this die type?");
    //if (areYouSure) {
        dicecontrols.removeChild(this.controlDiv);
        dicecontrolsconfig.removeChild(this.configDiv);
        ListOfrpghudDiceControls.splice(ListOfrpghudDiceControls.indexOf(this), 1);
    //}
}

rpghudDiceControl.prototype.setName = function(newName) {
    this.name = newName;
    this.centerDiv.removeChild(this.dinput.nextSibling);
    this.centerDiv.appendChild(document.createTextNode(newName));
}

rpghudDiceControl.prototype.disableEditing = function() {
    this.deleteButton.disabled = true;
    this.colorPicker.disabled = true;
    this.geometryPicker.disabled = true;
    this.customizeButton.disabled = true;
}
rpghudDiceControl.prototype.enableEditing = function() {
    this.deleteButton.disabled = false;
    this.colorPicker.disabled = false;
    this.geometryPicker.disabled = false;
    this.customizeButton.disabled = false;
}


rpghudDiceControl.prototype.tokenContentsPopup = function(dyn) {
    // special case: if we only reset to defaults don't need to pop up window.
    if (this.bagType == "statefulReset") {
        for (i=1; i<=this.size; i++) {this.tokenBag.choices[i] = this.tokenDefault.choices[i];}
        this.updateBagImage();
        return;
    }

    var popup = {
        div: document.createElement("div"),
        quantity : [],
        target: this,
        popupType: dyn
    };

    popup.div.className = "popupwindow";
    popup.div.style.backgroundColor = popup.target.facecolor.CSS;
    popup.div.style.color = popup.target.diceTextColor;
    //popup.div.style.overflowY = "scroll";

    var headerElt = document.createElement("h3");
    var txt = (this.bagType == "statefulAdd") ? "Add Tokens" : "Bag Contents";
    headerElt.appendChild(document.createTextNode(txt));
    popup.div.appendChild(headerElt);

    var tableDiv = document.createElement("div");
    tableDiv.className = "popuptablediv";

    var tab = document.createElement("table");
    //var hr = document.createElement("tr");
    //var hdr = document.createElement("th");
    //hdr.appendChild(document.createTextNode("Contents"));
    //hr.appendChild(hdr);
    //tab.appendChild(hr);

    for (var i=1; i<=this.size; i++) {
        var row = document.createElement("tr");
        var txt = (this.displayOverride[i] != undefined) ? this.displayOverride[i] : i;

        var q = document.createElement("td");
        q.style.position = "relative";
        q.style.backgroundColor = "white";

        var upButton = document.createElement("input");
        upButton.className = "incrbutton";
        upButton.type = "button";
        upButton.value = '\u25b2';
        q.appendChild(upButton);

        var centerDiv = document.createElement("div");
        centerDiv.className = "dnumcontainer";
        centerDiv.style.margin = "0px";
        popup.quantity[i] = document.createElement("input");
        popup.quantity[i].className = "dnumdie";
        popup.quantity[i].value = (popup.popupType == "default") ? this.tokenDefault.choices[i] : ((this.bagType == "statefulAdd") ? 0 : this.tokenBag.choices[i]);
        centerDiv.appendChild(popup.quantity[i]);
        q.appendChild(centerDiv);

        var downButton = document.createElement("input");
        downButton.className = "decrbutton";
        downButton.type = "button";
        downButton.value = '\u25bc';
        q.appendChild(downButton);

        upButton.onclick = rpghudGeneralIncrement.bind(popup.quantity[i]);
        downButton.onclick = rpghudGeneralDecrement.bind(popup.quantity[i]);

        var tokenImg = document.createElement("img");
        tokenImg.className = "tokenbagimg";
        var context = diecanvas.getContext("2d");
        drawDiePolygon(context, this.geometry, this.facecolor, this.edgecolor, this.shadcolor);
        drawDieText(context, txt, this.geometry, this.diceTextColor, this.customFont);
        tokenImg.src = diecanvas.toDataURL();
        q.appendChild(tokenImg);

        row.appendChild(q);

        tab.appendChild(row);
    }
    //popup.div.appendChild(tab);
    tableDiv.appendChild(tab);
    popup.div.appendChild(tableDiv);

    if (popup.popupType != "default") {
        var resetDiv = document.createElement("div");
        resetDiv.className = "popupbuttons";
        var resetButton = document.createElement("input");
        resetButton.type = "button";
        resetButton.value = "Set quantities to default";
        resetButton.onclick = setQuantitiesToDefault.bind(popup);
        resetDiv.appendChild(resetButton);
        popup.div.appendChild(resetDiv);
    }

    var clearDiv = document.createElement("div");
    clearDiv.className = "popupbuttons";
    var assignButton = document.createElement("input");
    var assignValue = document.createElement("input");
    assignButton.type = "button";
    assignButton.value = "Set all to:";
    assignButton.onclick = assignAllTokens.bind(popup, assignValue);
    assignValue.type = "number";
    assignValue.value = "0";
    assignValue.style.width = "20%";
    clearDiv.appendChild(assignButton);
    clearDiv.appendChild(assignValue);
    popup.div.appendChild(clearDiv);

    var popupButtons = document.createElement("div");
    popupButtons.className = "popupbuttons";

    var okButton = document.createElement("input");
    okButton.type = "button";
    okButton.value = "OK";
    okButton.onclick = commitTokenContents.bind(popup);
    popupButtons.appendChild(okButton);

    var cancelButton = document.createElement("input");
    cancelButton.type = "button";
    cancelButton.value = "Cancel";
    cancelButton.onclick = clearPopup.bind(popup);
    popupButtons.appendChild(cancelButton);

    popup.div.appendChild(popupButtons);

    document.getElementsByTagName("body")[0].appendChild(popup.div);

}
function setQuantitiesToDefault() {
    for (var i=1; i<=this.target.size; i++) {
        this.quantity[i].value = this.target.tokenDefault.choices[i];
    }
}
function assignAllTokens(toWhat) {
    for (var i=1; i<=this.target.size; i++) {
        this.quantity[i].value = Math.max(0, toWhat.value);
    }
}
function commitTokenContents() {
    for (var i=1; i<=this.target.size; i++) {
        if (this.popupType == "default") {
            this.target.tokenDefault.choices[i] = parseInt(this.quantity[i].value);
        } else {
            if (this.target.bagType == "statefulAdd") {
                this.target.tokenBag.choices[i] += parseInt(this.quantity[i].value);
            } else {
                this.target.tokenBag.choices[i] = parseInt(this.quantity[i].value);
            }
        }
    }
    this.target.updateBagImage(); // changed number of tokens, may need to update image.
    document.getElementsByTagName("body")[0].removeChild(this.div);
}

rpghudDiceControl.prototype.editPopup = function() {
    var popup = {
        fontBox: document.createElement("input"),
        fontEntry : document.createElement("input"),
        bagTypePicker : document.createElement("select"),
        tab : document.createElement("table"),
        displayBox: [],
        displayEntry: [],
        valBox: [],
        valEntry: [],
        autoHighlightBox: [],
        autoHighlightPicker: [],
        div: document.createElement("div"),
        target: this
    };

    popup.div.className = "popupwindow";
    popup.div.style.backgroundColor = popup.target.facecolor.CSS;
    popup.div.style.color = popup.target.diceTextColor;

    fontDiv = document.createElement("div");
    fontDiv.appendChild(document.createTextNode("Font:"));
    popup.fontBox.type = "checkbox";
    popup.fontBox.checked = (this.customFont != undefined);
    popup.fontBox.title = "Use custom font?";
    popup.fontBox.onchange = fontChange.bind(popup);
    popup.fontEntry.style.width = "70%";
    popup.fontEntry.value = (this.customFont != undefined) ? this.customFont : "";
    popup.fontEntry.onchange = fontChange.bind(popup);
    fontDiv.appendChild(popup.fontBox);
    fontDiv.appendChild(popup.fontEntry);
    popup.div.appendChild(fontDiv);

    var nameDiv = document.createElement("div");
    nameDiv.appendChild(document.createTextNode((this.type == "die") ? "Die label:" : "Bag label:"));
    popup.namePicker = document.createElement("select");
    var optDefault = document.createElement("option");
    optDefault.text = "default", optDefault.value = "default";
    var optCustom = document.createElement("option");
    optCustom.text = "custom"; optCustom.value = "custom";
    popup.namePicker.add(optDefault);
    popup.namePicker.add(optCustom);
    popup.namePicker.value = popup.target.customName ? "custom" : "default";
    popup.namePicker.onchange = displayPickerChange.bind(popup);
    nameDiv.appendChild(popup.namePicker);
    popup.nameEntry = document.createElement("input");
    popup.nameEntry.type = "text";
    popup.nameEntry.style.width = "36%";
    popup.nameEntry.value = popup.target.name;
    popup.nameEntry.style.display = popup.target.customName ? "inline" : "none";
    nameDiv.appendChild(popup.nameEntry);
    popup.div.appendChild(nameDiv);

    var tableDiv = document.createElement("div");
    tableDiv.className = "popuptablediv";

    //popup.tab.style.width = "90%";
    popup.tab.style.color = popup.target.diceTextColor;
    var headers = document.createElement("tr");
    var labels = ["#", "Alt-display", "Alt-value", "Auto-Highlight"];
    var classes = ["facecolumn", "displaycolumn", "displaycolumn", "highlightcolumn"];
    for (var i=0; i<labels.length; i++) {
        var th = document.createElement("th");
        th.className = classes[i];
        th.appendChild(document.createTextNode(labels[i]));
        headers.appendChild(th);
    }
    popup.tab.appendChild(headers);


    for (var i=1; i<=this.size; i++) {
        this._addCfgPopupTableRow(popup, i);
    }
    //popup.div.appendChild(popup.tab);
    tableDiv.appendChild(popup.tab);
    popup.div.appendChild(tableDiv);

    if (this.type == "bag") {
        var addRemoveDiv = document.createElement("div");
        addRemoveDiv.className = "popupbuttons";
        var removeButton = document.createElement("input");
        removeButton.type = "button";
        removeButton.value = "Remove choice";
        removeButton.onclick = removeCfgOption.bind(popup);
        addRemoveDiv.appendChild(removeButton);
        var addButton = document.createElement("input");
        addButton.type = "button";
        addButton.value = "Add choice";
        addButton.onclick = addCfgOption.bind(popup);
        addRemoveDiv.appendChild(addButton);
        popup.div.appendChild(addRemoveDiv);

        var editDefaultDiv = document.createElement("div");
        editDefaultDiv.className = "popupbuttons";
        var editDefaultButton = document.createElement("input");
        editDefaultButton.type = "button";
        editDefaultButton.value = "Edit default contents";
        editDefaultButton.onclick = this.tokenContentsPopup.bind(this, "default");
        editDefaultDiv.appendChild(editDefaultButton);
        popup.div.appendChild(editDefaultDiv);

        var statefulDiv = document.createElement("div");
        statefulDiv.appendChild(document.createTextNode("Bag type:"));
        var optStateless = document.createElement("option");
        optStateless.value = "stateless";
        optStateless.text = "Stateless";
        optStateless.title = "Bag auto-restocks after each token pull (stateless, like dice)";
        popup.bagTypePicker.add(optStateless);
        var optStatefulEdit = document.createElement("option");
        optStatefulEdit.value = "statefulEdit";
        optStatefulEdit.text = "Full Access";
        optStatefulEdit.title = "Can manipulate contents of bag via button";
        popup.bagTypePicker.add(optStatefulEdit);
        var optStatefulAdd = document.createElement("option");
        optStatefulAdd.value = "statefulAdd";
        optStatefulAdd.text = "Add-only";
        optStatefulAdd.title = "Can add to contents, but only remove via draws";
        popup.bagTypePicker.add(optStatefulAdd);
        var optStatefulEmpty = document.createElement("option");
        optStatefulEmpty.value = "statefulEmpty";
        optStatefulEmpty.text = "Add-when-empty";
        optStatefulEmpty.title = "Can add to bag, but only when it's empty";
        popup.bagTypePicker.add(optStatefulEmpty);
        var optStatefulReset = document.createElement("option");
        optStatefulReset.value = "statefulReset";
        optStatefulReset.text = "Reset-when-empty";
        optStatefulReset.title = "Can reset bag contents to default, but only when it's empty";
        popup.bagTypePicker.add(optStatefulReset);

        popup.bagTypePicker.value = this.bagType;
        statefulDiv.appendChild(popup.bagTypePicker);
        popup.div.appendChild(statefulDiv);
    }


    var popupButtons = document.createElement("div");
    popupButtons.className = "popupbuttons";

    var okButton = document.createElement("input");
    okButton.type = "button";
    okButton.value = "OK";
    okButton.onclick = commitPopup.bind(popup);
    popupButtons.appendChild(okButton);

    var cancelButton = document.createElement("input");
    cancelButton.type = "button";
    cancelButton.value = "Cancel";
    cancelButton.onclick = clearPopup.bind(popup);
    popupButtons.appendChild(cancelButton);

    popup.div.appendChild(popupButtons);

    document.getElementsByTagName("body")[0].appendChild(popup.div);
}
rpghudDiceControl.prototype._removeCfgPopupTableRow = function(popup, i) {
    popup.displayBox.splice(i, 1);
    popup.displayEntry.splice(i, 1);
    popup.valBox.splice(i, 1);
    popup.valEntry.splice(i, 1);
    popup.autoHighlightBox.splice(i, 1);
    popup.autoHighlightPicker.splice(i, 1);
    popup.tab.removeChild(popup.tab.childNodes[i]);
}
rpghudDiceControl.prototype._addCfgPopupTableRow = function(popup, i) {
    var row = document.createElement("tr");
    var face = document.createElement("td");
    face.className = "facecolumn";
    face.appendChild(document.createTextNode(i));
    row.appendChild(face);

    var display = document.createElement("td");
    display.className = "displaycolumn";

    popup.displayBox[i] = document.createElement("input");
    popup.displayBox[i].type = "checkbox";
    popup.displayBox[i].onchange = displayPickerChange.bind(popup);
    popup.displayEntry[i] = document.createElement("input");
    popup.displayEntry[i].type = "text";
    //popup.displayEntry[i].size = 3;
    popup.displayEntry[i].maxLength = 3;
    if (popup.target.displayOverride[i] != undefined) {
        popup.displayBox[i].checked = true;
        popup.displayEntry[i].value = popup.target.displayOverride[i];
    } else {
        popup.displayBox[i].checked = false;
        popup.displayEntry[i].style.display = "none";
    }
    display.appendChild(popup.displayBox[i]);
    display.appendChild(popup.displayEntry[i]);
    row.appendChild(display);

    var altValue = document.createElement("td");
    altValue.className = "displaycolumn";
    popup.valBox[i] = document.createElement("input");
    popup.valBox[i].type = "checkbox";
    popup.valBox[i].onchange = displayPickerChange.bind(popup);
    popup.valEntry[i] = document.createElement("input");
    popup.valEntry[i].type = "text";
    popup.valEntry[i].size = 3;
    popup.valEntry[i].maxLength = 3;
    if (popup.target.valueOverride[i] != undefined) {
        popup.valBox[i].checked = true;
        popup.valEntry[i].value = popup.target.valueOverride[i];
    } else {
        popup.valBox[i].checked = false;
        popup.valEntry[i].style.display = "none";
    }
    altValue.appendChild(popup.valBox[i]);
    altValue.appendChild(popup.valEntry[i]);
    row.appendChild(altValue);

    var autoHighlight = document.createElement("td");
    autoHighlight.className = "highlightcolumn";
    popup.autoHighlightBox[i] = document.createElement("input");
    popup.autoHighlightBox[i].type = "checkbox";
    popup.autoHighlightBox[i].checked = (this.autoHighlight[i] != undefined);
    autoHighlight.appendChild(popup.autoHighlightBox[i]);
    popup.autoHighlightPicker[i] = document.createElement("select");
    for (var j=0; j<PoolManager.highlights.length; j++) {
        if (PoolManager.highlights[j].enabled) {
            var symOpt = document.createElement("option");
            symOpt.text = PoolManager.highlights[j].symbol;
            symOpt.value = j;
            popup.autoHighlightPicker[i].add(symOpt);
        }
    }
    if (this.autoHighlight[i] != undefined) {
        popup.autoHighlightPicker[i].value = this.autoHighlight[i];
        popup.autoHighlightBox.checked = true;
    }
    autoHighlight.appendChild(popup.autoHighlightPicker[i]);
    row.appendChild(autoHighlight);

    popup.tab.appendChild(row);
}
function addCfgOption(e) {
    this.target.size++;
    this.target._addCfgPopupTableRow(this, this.target.size);
    this.target.tokenBag.choices[this.target.size] = 0;
    this.target.tokenDefault.choices[this.target.size] = 0;
}
function removeCfgOption(e) {
    this.target._removeCfgPopupTableRow(this, this.target.size);
    this.target.tokenBag.choices.splice(this.target.size, 1);
    this.target.tokenDefault.choices.splice(this.target.size, 1);
    this.target.size--;
}
function fontChange(e) {
    if (this.fontBox.checked) {
        this.target.customFont = this.fontEntry.value;
    } else {
        this.target.customFont = undefined;
    }
}
function randomizerTypeChange(e) {
    if (this.randomizerPicker.value == "bag") {
        console.log("Switching to bag");
        var context = diecanvas.getContext("2d");
        drawBag(context, true, this.target.facecolor, this.target.edgecolor, this.target.shadcolor);
        this.target.diceImg.src = diecanvas.toDataURL();
        this.target.cacheShootdown();
    } else {
        tryToChangeGeometry.bind(this, e)();
    }
}
function displayPickerChange() {
    if (this.namePicker.value == "custom") {
        this.nameEntry.style.display = "inline";
    } else {
        this.nameEntry.style.display = "none";
    }
    for (var i=1; i<this.displayBox.length; i++) {
        if (this.displayBox[i].checked) {
            this.displayEntry[i].style.display = "inline";
        } else {
            this.displayEntry[i].style.display = "none";
        }
    }
    for (var i=1; i<this.valBox.length; i++) {
        if (this.valBox[i].checked) {
            this.valEntry[i].style.display = "inline";
        } else {
            this.valEntry[i].style.display = "none";
        }
    }
}
function commitPopup(e) {
    if (this.target.type == "bag") {
        this.target.bagType = this.bagTypePicker.value;
        this.target.tokenBag.stateful = (this.target.bagType != "stateless");
    }

    for (var i=1; i<this.displayBox.length; i++) {
        if (this.displayBox[i].checked) {
            this.target.displayOverride[i] = this.displayEntry[i].value;
        } else if (this.target.displayOverride[i] != undefined) {
            delete this.target.displayOverride[i];
        }

        if (this.valBox[i].checked) {
            this.target.valueOverride[i] = parseInt(this.valEntry[i].value);
        } else if (this.target.valueOverride[i] != undefined) {
            delete this.target.valueOverride[i];
        }

        if (this.autoHighlightBox[i].checked) {
            if (this.target.autoHighlight[i] != undefined) {
                PoolManager.releaseHighlight(this.target.autoHighlight[i]);
            }
            this.target.autoHighlight[i] = this.autoHighlightPicker[i].value;
            // need to allocate space in highlight obj, so user can't disable it while in-use
            PoolManager.reserveHighlight(this.target.autoHighlight[i]);
        } else if (this.target.autoHighlight[i] != undefined) {
            PoolManager.releaseHighlight(this.target.autoHighlight[i]);
            delete this.target.autoHighlight[i];
        }
    }
    this.target.customName = (this.namePicker.value == "custom");
    var defaultName = "d" + this.target.size +
        (((Object.keys(this.target.displayOverride).length > 0) ||
          (Object.keys(this.target.valueOverride).length > 0) ||
          (Object.keys(this.target.autoHighlight).length > 0)) ? "*" : "");
    var newName = this.target.customName ? this.nameEntry.value : defaultName;
    this.target.setName(newName);
    this.target.cacheShootdown();

    // "this" is the popup object. Not sure if we need to clear stuff to garbage-collect it...
    this.displayBox = undefined;
    this.displayEntry = undefined;
    this.autoHighlightBox = undefined;
    this.autoHighlightPicker = undefined;
    document.getElementsByTagName("body")[0].removeChild(this.div);
    this.div = undefined;

    this.target.updateBagImage();

}
function clearPopup(e) {
    // "this" is the popup object. Not sure if we need to clear stuff to garbage-collect it...
    this.displayBox = undefined;
    this.displayEntry = undefined;
    this.autoHighlightBox = undefined;
    this.autoHighlightPicker = undefined;
    document.getElementsByTagName("body")[0].removeChild(this.div);
    this.div = undefined;
}

function tryToChangeColor(e) {
    //console.log("I think we should change color to:"+this.colorPicker.value);
    var newFacecolor = new rpghudColor("CSS", this.colorPicker.value);
    //console.log("The new color is "+newFacecolor.CSS);
    var newEdgecolor = new rpghudColor("LCh", newFacecolor.L-3, newFacecolor.C, newFacecolor.h);
    var newShadcolor = new rpghudColor("LCh", newFacecolor.L-1, newFacecolor.C, newFacecolor.h);

    if (newFacecolor.inGamut && newEdgecolor.inGamut && newShadcolor.inGamut) {
        this.facecolor = newFacecolor;
        this.edgecolor = newEdgecolor;
        this.shadcolor = newShadcolor;
        this.diceTextColor = (this.facecolor.L > BlackTextThreshold) ? "#000000" : "#FFFFFF";
        this.centerDiv.style.color = this.diceTextColor;
        //console.log("L is "+this.facecolor.L+" so text is "+this.diceTextColor);
        if (this.type == "bag") {
            this.updateBagImage();
        } else {
            var context = diecanvas.getContext("2d");
            drawDiePolygon(context, this.geometry, this.facecolor, this.edgecolor, this.shadcolor);  // placeholder?
            this.diceImg.src = diecanvas.toDataURL();
        }
        this.cacheShootdown();
    } else {
        console.error("Can't use that color for die, not all required shades in color gamut");
        this.colorPicker.value = this.facecolor.CSS;
    }
}
function tryToChangeGeometry(e) {
    var statefulBag = (this.geometryPicker.value == 0) && (this.bagType != "stateless");
    this.bagButton.style.display = statefulBag ? "block" : "none"; // only display for "bag"

    if (this.geometryPicker.value == 0) {
        // bag!
        this.setBag();
        if (!this.customName) {
            var newName = "d" + this.size +
                (((Object.keys(this.displayOverride).length > 0) ||
                  (Object.keys(this.valueOverride).length > 0) ||
                  (Object.keys(this.autoHighlight).length > 0)) ? "*" : "");
            this.setName(newName);
        }
    } else {
        this.setSize(this.geometryPicker.value);
        if (!this.customName) {
            var newName = "d" + this.size +
                (((Object.keys(this.displayOverride).length > 0) ||
                  (Object.keys(this.valueOverride).length > 0) ||
                  (Object.keys(this.autoHighlight).length > 0)) ? "*" : "");
            this.setName(newName);
        }
    }
}

function randomDieColor() {
    var facecolor;
    var edgecolor;
    var shadcolor;
    do {
        var newL = 50+50*Math.random();
        var newC = 2*(50-Math.abs(50 - newL))*Math.random();
        var newh = 360*Math.random();
        facecolor = new rpghudColor("LCh", newL, newC, newh);
        edgecolor = new rpghudColor("LCh", newL-3, newC, newh);
        shadcolor = new rpghudColor("LCh", newL-1, newC, newh);
    } while (!facecolor.inGamut || !edgecolor.inGamut || !shadcolor.inGamut);
    return facecolor;
}

////////////////////////////////////////////////////////////////////////////
// GUI helper function
////////////////////////////////////////////////////////////////////////////
function rpghudDiceControlIncrement(e) {
    var num = parseInt(this.dinput.value);
    var max = ((this.type == "bag") && (this.bagType != "stateless")) ? this.tokenBag.numTokens : 99;
    if (isNaN(num)) {num = 0;}
    this.dinput.value = Math.min(max, num+1);
}
function rpghudDiceControlDecrement(e) {
    var num = parseInt(this.dinput.value);
    if (isNaN(num)) {num = 0;}
    this.dinput.value = Math.max(0, num-1);
}
function rpghudGeneralIncrement(e) {
    var num = parseInt(this.value);
    if (isNaN(num)) {num = 0;}
    this.value = Math.min(99, num+1);
}
function rpghudGeneralDecrement(e) {
    var num = parseInt(this.value);
    if (isNaN(num)) {num = 0;}
    this.value = Math.max(0, num-1);
}

function rpghudAddNewDieType(e) {
    dieSizes = [4, 6, 8, 10, 12, 20];
    dieGeoms = {4: d4geometry,
                6: d6geometry,
                8: d8geometry,
               10: d10geometry,
               12: d12geometry,
               20: d20geometry};
    dSize = dieSizes[Math.floor(dieSizes.length * Math.random())];
    var color = userandomdiecolors.checked ? randomDieColor() : new rpghudColor("RGB", 200, 200, 200);
    var dc = new rpghudDiceControl(dSize, dieGeoms[dSize], randomDieColor());
}
////////////////////////////////////////////////////////////////////////////
// Objects for the dice
////////////////////////////////////////////////////////////////////////////
function rpghudDie(value, highlight, home) {
    this.value = value;
    this.highlight = highlight;
    this.home = home;
    this.mathValue = (home.valueOverride[value] != undefined) ? home.valueOverride[value] : value;
    this.poolIndex = PoolManager.addDieToPool(this);

    this.dieImage = home.getDieImage(value, highlight);
    this.img = document.createElement("img");
    this.img.src = this.dieImage.img;
    this.img.height = 60;
    this.img.width = 60;
    this.img.onclick = rpghudDieCycleHighlight.bind(this);
    this.img.oncontextmenu = popupMenu.bind(this);
    diceresults.appendChild(this.img);

    var cacheKey = "c"+this.home.uid+"v"+this.value+"h"+this.highlight;
    poolDB.set(this.poolIndex, cacheKey);

    //this.calculateHangoutPosition();

}
rpghudDie.prototype.updatePosition = function() {
    var cacheKey = "c"+this.home.uid+"v"+this.value+"h"+this.highlight;
    poolDB.set(this.poolIndex, cacheKey);
}
rpghudDie.prototype.remove = function() {
    var cacheKey = "c"+this.home.uid+"v"+this.value+"h"+this.highlight;
    //console.log("Try to remove", cacheKey);
    poolDB.remove(this.poolIndex);

    diceresults.removeChild(this.img);
    this.img = undefined;
    this.home.releaseDieImage(this.value, this.highlight);
    PoolManager.removeDieFromPool(this);
}
rpghudDie.prototype.populateContextMenu = function() {
    var items = [];
    for (var i=0; i<PoolManager.highlights.length; i++) {
        if (PoolManager.highlights[i].enabled) {
            items.push({"text":"Set state to "+PoolManager.highlights[i].symbol,
                        "functionality":this.setHighlight.bind(this, i)});
        }
    }
    items.push(undefined);
    items.push({"text":"Remove this die", "functionality":this.remove.bind(this)});
    return items;
}
rpghudDie.prototype.setHighlight = function(h) {
    PoolManager.setHighlight(this, h);
}

function diceSorter(a, b) {
    if (b.value != a.value) {return b.value - a.value;}
    if (b.home.size != a.home.size) {return b.home.size - a.home.size;}
    return ListOfrpghudDiceControls.indexOf(b.home) - ListOfrpghudDiceControls.indexOf(a.home);
}

var HangoutLeftRightMinMargin = 0.079;
var HangoutDieImageScale = 0.07; // a fraction of the hangout width to display a nice-sized die
                                   // (determined empirically, i.e. eyeballed until about same size)
var HangoutDieVertImageScale = undefined; // calculate in init based on aspect ratio.
var HangoutDicePerRow = Math.floor((1.0 - 2*HangoutLeftRightMinMargin) / HangoutDieImageScale);
var HangoutLeftMargin = 0.5 - ((HangoutDicePerRow-1)/2)*HangoutDieImageScale; // they're center-positioned.

rpghudDie.prototype.calculateHangoutPosition = function() {
    if (HangoutDieVertImageScale == undefined) {
        HangoutDieVertImageScale = HangoutDieImageScale * gapi.hangout.layout.getVideoCanvas().getAspectRatio();
    }

    var column = this.poolIndex % HangoutDicePerRow;
    var row = Math.floor(this.poolIndex / HangoutDicePerRow);
    this.hangoutPosX = -0.5 + HangoutLeftMargin + column * HangoutDieImageScale;
    this.hangoutPosY = -0.5 + (row+0.5)*HangoutDieVertImageScale; // offset by half due to center-based positioning.
}

rpghudDie.prototype.refreshImage = function() {
    this.dieImage = this.home.getDieImage(this.value, this.highlight)
    this.img.src = this.dieImage.img;

    var cacheKey = "c"+this.home.uid+"v"+this.value+"h"+this.highlight;
    poolDB.set(this.poolIndex, cacheKey);
}

function rpghudDieCycleHighlight(e) {
    PoolManager.cycleHighlight(this);
}


////////////////////////////////////////////////////////////////////////////
// rpghudBag -- a pull-tokens-from-a-bag randomizer
////////////////////////////////////////////////////////////////////////////
function rpghudBag(size, stateful) {
    this.stateful = (stateful != undefined) ? stateful : false;
    this.choices = [];
}
rpghudBag.prototype.draw = function() {
    var num = 0;
    var options = Object.keys(this.choices).sort();
    var pickFromThese = [];
    for (var i=0; i<options.length; i++) {
        for (var j=0; j<this.choices[options[i]]; j++) {
            pickFromThese.push(options[i]);
        }
    }
    var val = Math.floor(pickFromThese.length*Math.random());
    var choice = pickFromThese[val];

    if (this.stateful) {
        this.choices[choice]--;
    }
    return choice;
}
Object.defineProperty(rpghudBag.prototype, "empty", {
   get: function() {
    if (!this.stateful) {return false;}
    var options = Object.keys(this.choices).sort();
    var num = 0;
    for (var i=0; i<options.length; i++) {
        num += this.choices[options[i]];
    }
    return (num == 0);
   }
});
Object.defineProperty(rpghudBag.prototype, "numTokens", {
   get: function() {
    var options = Object.keys(this.choices).sort();
    var num = 0;
    for (var i=0; i<options.length; i++) {
        num += this.choices[options[i]];
    }
    return num;
   }
});

///////////////////////////////////////////////////////////////////////////
// Token control -- basically a specialized dice control
///////////////////////////////////////////////////////////////////////////
function rpghudTokenControl(color) {
    this.size = 1;
    this.name = "token";
    this.customName = false;
    this.geometry = d2geometry;
    this.facecolor = color;
    this.edgecolor = new rpghudColor("LCh", color.L - 3, color.C, color.h);
    this.shadcolor = new rpghudColor("LCh", color.L - 1, color.C, color.h);
    this.diceTextColor = (this.facecolor.L > BlackTextThreshold) ? "#000000" : "#FFFFFF";
    this.displayOverride = {};
    this.valueOverride = {};
    //this.autoHighlight = {};
    this.imageCache = [];

    this.uid = rpghudDiceControl.nextUid++;

    ListOfrpghudDiceControls.push(this);
}

rpghudTokenControl.prototype.roll = function() {
    // dummy function.
}
rpghudTokenControl.prototype.generateToken = function(val) {
    var h = (PoolManager.autoHighlight[val] != undefined) ? PoolManager.autoHighlight[val].h : 0;
    var d = new rpghudDie(val, h, this);
}

rpghudTokenControl.prototype.getDieImage = function(val, highlight=0) {
    var cacheKey = "c"+this.uid+"v"+val+"h"+highlight;

    if (this.imageCache[highlight] == undefined) {this.imageCache[highlight] = {};}
    if (this.imageCache[highlight][val] != undefined) {
        this.imageCache[highlight][val].count++;

        if (this.imageCache[highlight][val].count == 1) {
            srcDB.set(cacheKey, this.imageCache[highlight][val].img);
        }

        return this.imageCache[highlight][val];
    }

    // we don't have it in the cache, so draw it.
    var context = diecanvas.getContext("2d");
    drawDiePolygon(context, this.geometry, this.facecolor, this.edgecolor, this.shadcolor);  // placeholder?
    var txt = val; //(this.displayOverride[val] != undefined) ? this.displayOverride[val] : val;
    drawDieText(context, txt, this.geometry, this.diceTextColor, this.customFont);
    drawHighlight(context, highlight, PoolManager.highlights[highlight].color);
    this.imageCache[highlight][val] = {"count":1, "img":diecanvas.toDataURL()};
    srcDB.set(cacheKey, this.imageCache[highlight][val].img);
    this.disableEditing(); // don't allow editing while there are "live" dice in play.
    return this.imageCache[highlight][val];
}
rpghudTokenControl.prototype.releaseDieImage = function(val, highlight) {
    this.imageCache[highlight][val].count--;
    if (this.imageCache[highlight][val].count == 0) {
        // nothing is using this image, it can be cleaned up.
        //console.log("I would clean up "+this.facecolor.CSS+" d"+this.size+" val="+val+" highlight="+highlight);
        var cacheKey = "c"+this.uid+"v"+val+"h"+highlight;
        srcDB.remove(cacheKey);
        this.enableEditing();
    }
}
rpghudTokenControl.prototype.cacheShootdown = function(h) {
    if (h == undefined) {
        this.imageCache = [];
    } else {
        this.imageCache[h] = [];
    }
}
rpghudTokenControl.prototype.disableEditing = function() {
    tokencolor.disabled = true;
}
rpghudTokenControl.prototype.enableEditing = function() {
    tokencolor.disabled = false;
}
function tryToChangeTokenColor(e) {
    //console.log("I think we should change color to:"+this.colorPicker.value);
    var newFacecolor = new rpghudColor("CSS", tokencolor.value);
    //console.log("The new color is "+newFacecolor.CSS);
    var newEdgecolor = new rpghudColor("LCh", newFacecolor.L-3, newFacecolor.C, newFacecolor.h);
    var newShadcolor = new rpghudColor("LCh", newFacecolor.L-1, newFacecolor.C, newFacecolor.h);

    if (newFacecolor.inGamut && newEdgecolor.inGamut && newShadcolor.inGamut) {
        this.facecolor = newFacecolor;
        this.edgecolor = newEdgecolor;
        this.shadcolor = newShadcolor;
        this.diceTextColor = (this.facecolor.L > BlackTextThreshold) ? "#000000" : "#FFFFFF";
        var context = diecanvas.getContext("2d");
        drawDiePolygon(context, this.geometry, this.facecolor, this.edgecolor, this.shadcolor);  // placeholder?
        tokenbkgrnd.src = diecanvas.toDataURL();
        this.cacheShootdown();
    } else {
        console.error("Can't use that color for die, not all required shades in color gamut");
        tokencolor.value = this.facecolor.CSS;
    }
}
