console.log("Running startup.js");
var diecanvas;
var TokenControl;

function init() {
    
    diecanvas = document.createElement("canvas");
    diecanvas.width = DieCanvasSize;
    diecanvas.height = DieCanvasSize;
    var context = diecanvas.getContext("2d");

    TokenControl = new rpghudTokenControl(new rpghudColor("RGB", 255, 255, 255));
    tokenbkgrnd.src = TokenControl.getDieImage(" ", 0).img;
    TokenControl.releaseDieImage(" ", 0);
    tokencolor.value = TokenControl.facecolor.CSS;
    tokencolor.onchange = tryToChangeTokenColor.bind(TokenControl);
    
    
    //dieSizes = [4, 6, 8, 10, 12, 20];
    //dieGeoms = {4: d4geometry,
    //            6: d6geometry,
    //            8: d8geometry,
    //           10: d10geometry,
    //           12: d12geometry,
    //           20: d20geometry};    
    //for (var i=0; i<3; i++) {
    //    dSize = dieSizes[Math.floor(dieSizes.length * Math.random())];
    //    var dc = new rpghudDiceControl(dSize, dieGeoms[dSize], randomDieColor());
    //}


    PoolManager.init();
    
    //var widge = new rpghudDisplayWidget("sum", 1);
    //var widge2 = new rpghudDisplayWidget("count", 0);
    //updateDisplayWidgets();
    globalHardcodeConfigure("default");
}

function debugColor(a, b, c) {
    return a.toFixed(3)+" "+b.toFixed(3)+" "+c.toFixed(3);
}