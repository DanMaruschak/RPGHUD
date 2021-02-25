////////////////////////////////////////////////////////////
// Functions and geometry for drawing dice on a canvas
////////////////////////////////////////////////////////////
var d2geometry = {
    vertices: [[0.5,0.139],
               [0.579,0.149], [0.654,0.17], [0.724,0.204], [0.789,0.252], [0.839,0.308], [0.881,0.374], [0.905,0.438],
               [0.912,0.512],
               [0.906,0.588], [0.888,0.653], [0.849,0.723], [0.799,0.781], [0.735,0.831], [0.661,0.866], [0.587,0.884],
               [0.5,0.893],
               [0.413,0.884], [0.339,0.866], [0.265,0.831], [0.201,0.781], [0.151,0.723], [0.112, 0.653], [0.094, 0.588],
               [0.088, 0.512],
               [0.095,0.438], [0.119,0.374], [0.161,0.308], [0.211,0.252], [0.276,0.204], [0.346,0.17], [0.421,0.149],
               [0.802,0.801], [0.73,0.864], [0.662,0.898], [0.583,0.925], [0.501,0.932], [0.417,0.925], [0.338,0.898], [0.27,0.864], [0.198,0.801]],
    polyList: [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
               [10,32,33,34,35,36,37,38,39,40,22,21,20,19,18,17,16,15,14,13,12,11]],
    //textSize: 0.5
    textSize: 0.754
};
var d4geometry = {
    vertices: [[0.02, 0.78691667], [0.491666667, 0.282333333], [0.963333333, 0.78691667], [0.4916666667, 0.0308333333]],
    polyList: [[0, 1, 2], [0, 1, 3], [3, 1, 2]],
    textSize: 0.305
};
var d6geometry = {
    vertices: [[0.1305, 0.835833333], [0.879666667, 0.835833333], [0.8355, 0.151833333], [0.166333333, 0.151833333], [0.764, 0.976833333], [0.2125, 0.976833333]],
    polyList: [[0, 1, 2, 3], [0, 1, 4, 5]],
    textSize: 0.5
};
var d6pips = {
    vertices: [[0.2607,0.7122], [0.2671,0.4773], [0.2753,0.2557], [0.5013,0.4779], [0.7488,0.7128], [0.7368,0.4773], [0.7292,0.2557]],
    radii: [0.0752, 0.07128, 0.0692, 0.07128, 0.0752, 0.07128, 0.0692],
    symbols: {"\u2680":1, "\u2681":2, "\u2682":3, "\u2683":4, "\u2684":5, "\u2685":6}
}
// original pips were too close to edges, scale them down a bit...
for (var i=0; i<d6pips.vertices.length; i++) {
    d6pips.vertices[i][0] = 0.5 - 0.8*(0.5 - d6pips.vertices[i][0]);
    d6pips.vertices[i][1] = 0.5 - 0.8*(0.5 - d6pips.vertices[i][1]);
}

var d8geometry = {
    vertices: [[0.131, 0.721666667], [0.485166667, 0.1355], [0.8675, 0.721666667], [0.211333333, 0.450833333], [0.7738333333, 0.4508333333], [0.473166667, 0.979166667]],
    polyList: [[0, 1, 2], [0, 1, 3], [1, 2, 4], [0, 2, 5]],
    textSize: 0.305
};
var d10geometry = {
    vertices: [[0.498333333, 0.852666667], [0.19933333, 0.6785], [0.498333333, 0.0685], [0.823, 0.675666667], [0.034166667, 0.642833333], [0.5, 0.953833333], [0.961333333, 0.641333333], [0.0996666667, 0.427], [0.9076666667, 0.422666667]],
    polyList: [[0, 1, 2, 3], [0, 1, 4, 5], [0, 3, 6, 5], [1, 4, 7, 2], [3, 2, 8, 6]],
    textSize: 0.35
};
var d12geometry = {
    vertices: [[0.5,0.215], [0.77,0.409], [0.678,0.744], [0.309,0.74], [0.222,0.404], [0.501,0.136], [0.734,0.258], [0.89,0.414], [0.878,0.7], [0.751,0.885], [0.481,0.985], [0.237,0.888], [0.092,0.692], [0.093,0.403], [0.25,0.238]],
    polyList: [[0,1,2,3,4], [0,5,6,7,1], [1,7,8,9,2], [2,9,10,11,3], [3,11,12,13,4], [4,13,14,5,0]],
    textSize: 0.288
}
var d20geometry = {
    vertices: [[0.505, 0.156], [0.778, 0.636], [0.198, 0.638], [0.485, 0.998], [0.909, 0.751], [0.101, 0.755], [0.917, 0.261], [0.09, 0.269], [0.5, 0.075]],
    polyList: [[0,1,2], [1,2,3], [1,3,4], [1,4,6], [0,1,6], [0,6,8], [0,8,7], [0,7,2], [2,7,5], [2,5,3]],
    textSize: 0.255
};
var DieSizes = {2:d2geometry, 4:d4geometry, 6:d6geometry, 8:d8geometry, 10:d10geometry, 12:d12geometry, 20:d20geometry};

var bezierBagFull = [
    0.5000, 0.8411,
    0.4470, 0.8422, 0.3268, 0.8330, 0.3036, 0.8259, 
    0.1911, 0.7973, 0.1625, 0.7357, 0.1545, 0.6464, 
    0.1464, 0.5536, 0.1945, 0.4495, 0.2248, 0.4217,
    0.2879, 0.3662, 0.3643, 0.3259, 0.4071, 0.2321,
    0.4384, 0.1652, 0.3000, 0.1125, 0.3098, 0.1027,
    0.3464, 0.0670, 0.4071, 0.1393, 0.4482, 0.1295,
    0.4875, 0.1214, 0.4518, 0.0902, 0.5000, 0.0875];
    
    //0.5000, 0.9117,
    //0.4470, 0.9155, 0.3378, 0.9123, 0.3131, 0.9047,
    //0.1995, 0.8769, 0.1673, 0.8327, 0.1591, 0.7450,
    //0.1522, 0.6736, 0.2071, 0.5884, 0.2210, 0.5632,
    //0.2532, 0.4988, 0.4198, 0.3554, 0.4022, 0.2696,
    //0.3858, 0.1907, 0.2999, 0.1452, 0.3094, 0.1357,
    //0.3453, 0.0985, 0.4097, 0.1686, 0.4539, 0.1578,
    //0.4906, 0.1515, 0.4501, 0.0890, 0.5000, 0.0890];
var bezierBagEmptyOutside = [
    0.5446, 0.8156,
    0.5366, 0.8170, 0.5295, 0.8161, 0.5228, 0.8147,
    0.5112, 0.8129, 0.4413, 0.8088, 0.4243, 0.8037,
    0.3681, 0.7892, 0.2980, 0.7513, 0.2475, 0.7134,
    0.1856, 0.6661, 0.0372, 0.5158, 0.0366, 0.4823,
    0.0354, 0.4306, 0.0830, 0.4009, 0.1515, 0.3782,
    0.1888, 0.3662, 0.2161, 0.3558, 0.2522, 0.3384,
    0.2951, 0.3183, 0.3883, 0.2942, 0.4522, 0.3012,
    0.5007, 0.3037, 0.5278, 0.3163, 0.5524, 0.3302,
    0.5928, 0.3517, 0.6212, 0.3655, 0.6591, 0.3908,
    0.7538, 0.4527, 0.8788, 0.5326, 0.9156, 0.5821];
    //0.5446, 0.8156,
    //0.5366, 0.8170, 0.5295, 0.8161, 0.5228, 0.8147,
    //0.5112, 0.8129, 0.4835, 0.8022, 0.4679, 0.7946,
    //0.4214, 0.7723, 0.3978, 0.7513, 0.3433, 0.7241,
    //0.3138, 0.7089, 0.0379, 0.5143, 0.0366, 0.4799,
    //0.0362, 0.4404, 0.0830, 0.4009, 0.1527, 0.3777,
    //0.1879, 0.3665, 0.2161, 0.3558, 0.2522, 0.3384,
    //0.2951, 0.3183, 0.3897, 0.2853, 0.4522, 0.3089,
    //0.4670, 0.3138, 0.4808, 0.3192, 0.5004, 0.3384,
    //0.5330, 0.3719, 0.5777, 0.3929, 0.6152, 0.4196,
    //0.7103, 0.4813, 0.8795, 0.5326, 0.9156, 0.5821];
var bezierBagEmptyInside = [
    0.9147, 0.5830,
    0.9250, 0.5946, 0.9433, 0.6121, 0.9321, 0.6232,
    0.9179, 0.6371, 0.9103, 0.6554, 0.8964, 0.6688,
    0.8754, 0.6893, 0.5647, 0.8210, 0.5464, 0.8174,
    0.5103, 0.8080, 0.5290, 0.7813, 0.5357, 0.7741,
    0.5759, 0.7339, 0.6580, 0.6741, 0.7174, 0.6728,
    0.7808, 0.6737, 0.8357, 0.5897, 0.9147, 0.5830];


var DieCanvasSize = 256;


function drawDiePolygon(context, geom, faceColor, edgeColor, shadowColor) {
    context.clearRect(0, 0, DieCanvasSize, DieCanvasSize);
    context.lineJoin = "round";
    context.lineCap = "round";
    context.fillStyle = faceColor.CSS;
    context.strokeStyle = edgeColor.CSS;
    context.lineWidth = 10;

    for (i=0; i<geom["polyList"].length; i++) {
        p = geom["polyList"][i]; // ordered list of vertices
        
        x = geom["vertices"][p[0]][0];
        y = geom["vertices"][p[0]][1];
        
        context.beginPath();
        context.moveTo(DieCanvasSize*x, DieCanvasSize*y);
        for (v=1; v<p.length; v++) {
            x = geom["vertices"][p[v]][0];
            y = geom["vertices"][p[v]][1];
            context.lineTo(DieCanvasSize*x, DieCanvasSize*y);
        }
        context.closePath();
        context.fill();
        context.stroke();

        context.fillStyle = shadowColor.CSS;
    }
}

function drawHeaderText(context, textToDraw, geom, color) {
    fontSize = Math.round(0.35*geom["textSize"]*DieCanvasSize);
    context.strokeStyle = color;
    context.fillStyle = color;
    context.font = fontSize+"px dejavu_sansbook, 'DejaVu Sans', sans-serif";
    context.textBaseline = "bottom";
    tMeasure = context.measureText(textToDraw);
    context.fillText(textToDraw, 0.5*DieCanvasSize-0.5*tMeasure.width, DieCanvasSize-8); // TBD: replace hardcode
}
function drawDieText(context, textToDraw, geom, color, font) {
    if (font == undefined) {font = "";} else {font = "'"+font+"',";}
    
    //context.scale(0.824/0.754, 1);
    var a = 0.824/0.754;
    var e = (1-a)*0.5*DieCanvasSize;
    context.transform(a, 0, 0, 1, e, 0);
    if ((geom == d6geometry) && (d6pips.symbols[textToDraw] != undefined)) {
        context.strokeStyle = color;
        context.fillStyle = color;
        drawPips(context, d6pips.symbols[textToDraw]);
    } else {
        fontSize = Math.round(geom["textSize"]*DieCanvasSize);    
        context.strokeStyle = color;
        context.fillStyle = color;
        context.font = fontSize+"px "+font+" 'DajaVu Sans', sans-serif";
        context.textBaseline = "middle";
        tMeasure = context.measureText(textToDraw);
        context.fillText(textToDraw, 0.5*DieCanvasSize-0.5*tMeasure.width, 0.5*DieCanvasSize);
    }
    //context.scale(0.754/0.824, 1);
    context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawHighlight(context, hNumber, color) {
    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = 10;
    if (hNumber == 0) {
        // "blank" highlight
    } else if (hNumber == 1) {
        // circle
        context.beginPath();
        context.arc(0.5*DieCanvasSize, 0.5*DieCanvasSize, 0.45*DieCanvasSize, 0, 2*Math.PI);
        context.stroke();
    } else if (hNumber == 2) {
        // triangle
        context.beginPath();
        context.moveTo(0.5*DieCanvasSize, 0.05*DieCanvasSize);
        context.lineTo(0.95*DieCanvasSize, (0.05 + 0.45*Math.sqrt(3)*DieCanvasSize));
        context.lineTo(0.05*DieCanvasSize, (0.05 + 0.45*Math.sqrt(3)*DieCanvasSize));
        context.lineTo(0.5*DieCanvasSize, 0.05*DieCanvasSize);
        context.stroke();
    } else if (hNumber == 3) {
        // square
        context.beginPath();
        context.moveTo(0.05*DieCanvasSize, 0.05*DieCanvasSize);
        context.lineTo(0.95*DieCanvasSize, 0.05*DieCanvasSize);
        context.lineTo(0.95*DieCanvasSize, 0.95*DieCanvasSize);
        context.lineTo(0.05*DieCanvasSize, 0.95*DieCanvasSize);
        context.lineTo(0.05*DieCanvasSize, 0.05*DieCanvasSize);
        context.stroke();
    } else if (hNumber == 4) {
        // pentagon
        context.beginPath();
        context.moveTo(0.5*DieCanvasSize,  0.05*DieCanvasSize);
        context.lineTo(0.95*DieCanvasSize, 0.377*DieCanvasSize);
        context.lineTo(0.78*DieCanvasSize, 0.91*DieCanvasSize);
        context.lineTo(0.22*DieCanvasSize, 0.91*DieCanvasSize);
        context.lineTo(0.05*DieCanvasSize, 0.377*DieCanvasSize);
        context.lineTo(0.5*DieCanvasSize,  0.05*DieCanvasSize);
        context.stroke();
    } else if (hNumber == 5) {
        // hexagon
        context.beginPath();
        context.moveTo(0.5*DieCanvasSize,  0.05*DieCanvasSize);
        context.lineTo(0.95*DieCanvasSize, 0.275*DieCanvasSize);
        context.lineTo(0.95*DieCanvasSize, 0.725*DieCanvasSize);
        context.lineTo(0.5*DieCanvasSize,  0.95*DieCanvasSize);
        context.lineTo(0.05*DieCanvasSize, 0.725*DieCanvasSize);
        context.lineTo(0.05*DieCanvasSize, 0.275*DieCanvasSize);
        context.lineTo(0.5*DieCanvasSize,  0.05*DieCanvasSize);
        context.stroke();
    } else {
        // X
        context.beginPath();
        context.moveTo(0.1*DieCanvasSize, 0.1*DieCanvasSize);
        context.lineTo(0.9*DieCanvasSize, 0.9*DieCanvasSize);
        context.stroke();
        context.beginPath();
        context.moveTo(0.9*DieCanvasSize, 0.1*DieCanvasSize);
        context.lineTo(0.1*DieCanvasSize, 0.9*DieCanvasSize);
        context.stroke();
    }
}

function drawPips(context, num) {
    console.log("Time to draw pips for "+num);
    if (num == 1) {
        context.beginPath();
        context.arc(d6pips.vertices[3][0]*DieCanvasSize, d6pips.vertices[3][1]*DieCanvasSize, d6pips.radii[3]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
    } else if (num == 2) {
        context.beginPath();
        context.arc(d6pips.vertices[0][0]*DieCanvasSize, d6pips.vertices[0][1]*DieCanvasSize, d6pips.radii[0]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[6][0]*DieCanvasSize, d6pips.vertices[6][1]*DieCanvasSize, d6pips.radii[6]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
    } else if (num == 3) {
        context.beginPath();
        context.arc(d6pips.vertices[0][0]*DieCanvasSize, d6pips.vertices[0][1]*DieCanvasSize, d6pips.radii[0]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[3][0]*DieCanvasSize, d6pips.vertices[3][1]*DieCanvasSize, d6pips.radii[3]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[6][0]*DieCanvasSize, d6pips.vertices[6][1]*DieCanvasSize, d6pips.radii[6]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
    } else if (num == 4) {
        context.beginPath();
        context.arc(d6pips.vertices[0][0]*DieCanvasSize, d6pips.vertices[0][1]*DieCanvasSize, d6pips.radii[0]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[2][0]*DieCanvasSize, d6pips.vertices[2][1]*DieCanvasSize, d6pips.radii[2]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[4][0]*DieCanvasSize, d6pips.vertices[4][1]*DieCanvasSize, d6pips.radii[4]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[6][0]*DieCanvasSize, d6pips.vertices[6][1]*DieCanvasSize, d6pips.radii[6]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
    } else if (num == 5) {
        context.beginPath();
        context.arc(d6pips.vertices[0][0]*DieCanvasSize, d6pips.vertices[0][1]*DieCanvasSize, d6pips.radii[0]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[2][0]*DieCanvasSize, d6pips.vertices[2][1]*DieCanvasSize, d6pips.radii[2]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[3][0]*DieCanvasSize, d6pips.vertices[3][1]*DieCanvasSize, d6pips.radii[3]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[4][0]*DieCanvasSize, d6pips.vertices[4][1]*DieCanvasSize, d6pips.radii[4]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[6][0]*DieCanvasSize, d6pips.vertices[6][1]*DieCanvasSize, d6pips.radii[6]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
    } else if (num == 6) {
        context.beginPath();
        context.arc(d6pips.vertices[0][0]*DieCanvasSize, d6pips.vertices[0][1]*DieCanvasSize, d6pips.radii[0]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[1][0]*DieCanvasSize, d6pips.vertices[1][1]*DieCanvasSize, d6pips.radii[1]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[2][0]*DieCanvasSize, d6pips.vertices[2][1]*DieCanvasSize, d6pips.radii[2]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[4][0]*DieCanvasSize, d6pips.vertices[4][1]*DieCanvasSize, d6pips.radii[4]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[5][0]*DieCanvasSize, d6pips.vertices[5][1]*DieCanvasSize, d6pips.radii[5]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
        context.arc(d6pips.vertices[6][0]*DieCanvasSize, d6pips.vertices[6][1]*DieCanvasSize, d6pips.radii[6]*DieCanvasSize, 0, 2*Math.PI);
        context.fill();
    }
}

// scale bag vertices to DieCanvasSize coords
for (var i=0; i<bezierBagFull.length; i++) {bezierBagFull[i] *= DieCanvasSize;}

for (var i=0; i<bezierBagEmptyOutside.length; i++) {bezierBagEmptyOutside[i] *= DieCanvasSize;}
for (var i=0; i<bezierBagEmptyInside.length; i++) {bezierBagEmptyInside[i] *= DieCanvasSize;}
function drawBag(context, empty, faceColor, edgeColor, shadowColor) {
    context.clearRect(0, 0, DieCanvasSize, DieCanvasSize);
    context.strokeStyle = edgeColor.CSS;
    context.fillStyle = faceColor.CSS;
    context.lineWidth = 10;
    if (!empty) {
        // draw full bag
        context.beginPath();
        context.moveTo(bezierBagFull[0], bezierBagFull[1]);
        for (var i=2; i<bezierBagFull.length; i += 6) {
            context.bezierCurveTo(bezierBagFull[i], bezierBagFull[i+1],
                                  bezierBagFull[i+2], bezierBagFull[i+3],
                                  bezierBagFull[i+4], bezierBagFull[i+5]);
        }
        for (var i=bezierBagFull.length-4; i>0; i -= 6) {
            context.bezierCurveTo(DieCanvasSize-bezierBagFull[i], bezierBagFull[i+1],
                                  DieCanvasSize-bezierBagFull[i-2], bezierBagFull[i-1],
                                  DieCanvasSize-bezierBagFull[i-4], bezierBagFull[i-3]);
        }
        context.fill();
        context.stroke();
        
    } else {
        // empty
        context.beginPath();
        context.moveTo(bezierBagEmptyOutside[0], bezierBagEmptyOutside[1]);
        for (var i=2; i<bezierBagEmptyOutside.length; i+=6) {
            context.bezierCurveTo(bezierBagEmptyOutside[i], bezierBagEmptyOutside[i+1],
                                  bezierBagEmptyOutside[i+2], bezierBagEmptyOutside[i+3],
                                  bezierBagEmptyOutside[i+4], bezierBagEmptyOutside[i+5]);
        }
        context.fill();
        context.stroke();
        
        context.fillStyle = shadowColor.CSS;
        context.beginPath();
        context.moveTo(bezierBagEmptyInside[0], bezierBagEmptyInside[1]);
        for (var i=2; i<bezierBagEmptyInside.length; i+=6) {
            context.bezierCurveTo(bezierBagEmptyInside[i], bezierBagEmptyInside[i+1],
                                  bezierBagEmptyInside[i+2], bezierBagEmptyInside[i+3],
                                  bezierBagEmptyInside[i+4], bezierBagEmptyInside[i+5]);
        }
        context.fill();
        context.stroke();
    }
}
