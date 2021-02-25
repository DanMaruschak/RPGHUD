////////////////////////////////////////////////////////////
// Color objects, with internal conversion functions (formulas from wikipedia)
//
// use property get/set to implement lazy evaluation of conversion functions,
// since we may not always need them.
//
// RGB space: R,G,B are 0-255, r,g,b are 0.0-1.0,
// XYZ space: X,Y,Z are 0-100, x,y,z are 0.0-1.0
// L*a*b* space: L is 0 for black ~8.9 for white. as and bs are 0-centered, +/- 10 or so is visible
// LCh space: L is same as Lab, C 0~10 is visible, h is 0 to 360 degrees
////////////////////////////////////////////////////////////
console.log("Running colors.js");
var debugConversions = false;
function rpghudColor(type, first, second, third) {
    this._R = undefined;
    this._G = undefined;
    this._B = undefined;
    this._RGBdirty = true;
    this._r = undefined;
    this._g = undefined;
    this._b = undefined;
    this._rgbdirty = true;
    this._X = undefined;
    this._Y = undefined;
    this._Z = undefined;
    this._XYZdirty = true;
    this._x = undefined;
    this._y = undefined;
    this._z = undefined;
    this._xyzdirty = true;
    this._L = undefined;
    this._Ldirty = true;
    this._as = undefined;
    this._bs = undefined;
    this._abdirty = true;
    this._C = undefined;
    this._h = undefined;
    this._Chdirty = true;
    
    if (type == "CSS") {
        var chars = first.split("");
        this._R = parseInt(chars[1].concat(chars[2]), 16);
        this._G = parseInt(chars[3].concat(chars[4]), 16);
        this._B = parseInt(chars[5].concat(chars[6]), 16);
        this._RGBdirty = false;
    }
    if (type == "RGB") {this._R = first, this._G = second, this._B = third; this._RGBdirty=false;}
    if (type == "rgb") {this._r = first, this._g = second, this._b = third; this._rgbdirty=false;}
    if (type == "XYZ") {this._X = first, this._Y = second, this._Z = third; this._XYZdirty=false;}
    if (type == "xyz") {this._x = first, this._y = second, this._z = third; this._xyzdirty=false;}
    if (type == "Lab") {this._L = first, this._as= second, this._bs= third; this._abdirty=false; this._Ldirty=false;}
    if (type == "LCh") {this._L = first, this._C = second, this._h = third; this._Chdirty=false; this._Ldirty=false;}

    if (debugConversions) {this.debugMsg("new");}
}

rpghudColor.prototype._RGBfromrgb = function() {
    this._R = 255*this._r;
    this._G = 255*this._g;
    this._B = 255*this._b;
    this._RGBdirty = false;
    if (debugConversions) this.debugMsg("RGBfromrgb");
}
rpghudColor.prototype._rgbfromRGB = function() {
    this._r = this._R / 255;
    this._g = this._G / 255;
    this._b = this._B / 255;
    this._rgbdirty = false;
    if (debugConversions) this.debugMsg("rgbfromRGB");
}
rpghudColor.prototype._xyzfromrgb = function() {
    this._x = this._r*0.412453 + this._g*0.357580 + this._b*0.180423;
    this._y = this._r*0.212671 + this._g*0.715160 + this._b*0.072169;
    this._z = this._r*0.019334 + this._g*0.119193 + this._b*0.950227;
    this._xyzdirty = false;
    if (debugConversions) this.debugMsg("xyzfromrgb");
}
rpghudColor.prototype._rgbfromxyz = function() {
    this._r = this._x * 3.240479 + this._y *-1.537150 + this._z *-0.498535;
    this._g = this._x *-0.969256 + this._y * 1.875992 + this._z * 0.041556;
    this._b = this._x * 0.055648 + this._y *-0.204043 + this._z * 1.057311;
    this._rgbdirty = false;
    if (debugConversions) this.debugMsg("rgbfromxyz");
}
rpghudColor.prototype._xyzfromXYZ = function() {
    this._x = this._X * 0.01;
    this._y = this._Y * 0.01;
    this._z = this._Z * 0.01;
    this._xyzdirty = false;
    if (debugConversions) this.debugMsg("xyzfromXYZ");
}
rpghudColor.prototype._XYZfromxyz = function() {
    this._X = this._x * 100;
    this._Y = this._y * 100;
    this._Z = this._z * 100;
    this._XYZdirty = false;
    if (debugConversions) this.debugMsg("XYZfromxyz");
}

rpghudColor.prototype._labf = function(t) {
    if (t > 0.008856) {
        return Math.pow(t, 0.3333333333);
    } else {
        return 0.008856*t + 0.137931034;
    }
}
rpghudColor.prototype._labinversef = function(t) {
    if (t > 0.206896552) {
        return Math.pow(t, 3);
    } else {
        return 0.128418549*t - 0.017712903;
    }
}
rpghudColor.prototype._LabfromXYZ = function() {
    // Xn =  95.047;  1/Xn = 0.01052111
    // Yn = 100.000;  1/Yn = 0.01
    // Zn = 108.883;  1/Zn = 0.00918417
    
    var Xnorm = this._X * 0.0105211   // X/Yn
    var Ynorm = this._Y * 0.01;       // Y/Yn
    var Znorm = this._Z * 0.00918417  // Z/Zn
    this._L =  116 * this._labf(Ynorm) - 16;
    this._as = 500 * (this._labf(Xnorm) - this._labf(Ynorm));
    this._bs = 200 * (this._labf(Ynorm) - this._labf(Znorm));
    this._abdirty = false; this._Ldirty = false;
    if (debugConversions) this.debugMsg("LabfromXYZ");
}
rpghudColor.prototype._XYZfromLab = function() {
    // Xn =  95.047;  1/Xn = 0.01052111
    // Yn = 100.000;  1/Yn = 0.01
    // Zn = 108.883;  1/Zn = 0.00918417
    this._X =  95.047 * this._labinversef((this._L+16)/116 + this._as/500);
    this._Y = 100.000 * this._labinversef((this._L+16)/116);
    this._Z = 108.883 * this._labinversef((this._L+16)/116 - this._bs/200);
    this._XYZdirty = false;
    if (debugConversions) this.debugMsg("XYZfromLab");
}
rpghudColor.prototype._LChfromLab = function() {
    this._C = Math.sqrt(Math.pow(this._as, 2)+Math.pow(this._bs, 2));
    this._h = Math.atan2(this._bs,this._as);
    this._Chdirty = false;
    if (debugConversions) this.debugMsg("LChfromLab");
}
rpghudColor.prototype._LabfromLCh = function() {
    this._as = this._C*Math.cos(this._h);
    this._bs = this._C*Math.sin(this._h);
    this._abdirty = false;
    if (debugConversions) this.debugMsg("LabfromLCh");
}
rpghudColor.prototype._cleanRGB = function() {
    if (debugConversions) console.log("_cleanRGB");
    if (this._RGBdirty) {
        if (!this._rgbdirty) {
            this._RGBfromrgb();
        } else if (!this._xyzdirty) {
            this._rgbfromxyz();
            this._RGBfromrgb();
        } else if (!this._XYZdirty) {
            this._xyzfromXYZ();
            this._rgbfromxyz();
            this._RGBfromrgb();
        } else if (!this._abdirty) {
            this._XYZfromLab();
            this._xyzfromXYZ();
            this._rgbfromxyz();
            this._RGBfromrgb();
        } else if (!this._Chdirty) {
            this._LabfromLCh();
            this._XYZfromLab();
            this._xyzfromXYZ();
            this._rgbfromxyz();
            this._RGBfromrgb();
        } else {
            console.error("Trying to generate RGB on "+this+", but nothing to generate from");
        }
    }    
}
rpghudColor.prototype._cleanrgb = function() {
    if (debugConversions) console.log("_cleanrgb");
    if (this._rgbdirty) {
        if (!this._RGBdirty) {
            this._rgbfromRGB();
        } else if (!this._xyzdirty) {
            this._rgbfromxyz();
        } else if (!this._xyzdirty) {
            this._xyzfromXYZ();
            this._rgbfromxyz();
        } else if (!this._abdirty) {
            this._XYZfromLab();
            this._xyzfromXYZ();
            this._rgbfromxyz();
        } else if (!this._Chdirty) {
            this._LabfromLCh();
            this._XYZfromLab();
            this._xyzfromXYZ();
            this._rgbfromxyz();
        } else {
            console.error("Trying to generate rgb on "+this+", but nothing to generate from");
        }
    }
}
rpghudColor.prototype._cleanxyz = function() {
    if (debugConversions) console.log("_cleanxyz");
    if (this._xyzdirty) {
        if (!this._XYZdirty) {
            this._xyzfromXYZ();
        } else if (!this._rgbdirty) {
            this._xyzfromrgb();
        } else if (!this._RGBdirty) {
            this._rgbfromRGB();
            this._xyzfromrgb();
        } else if (!this._abdirty) {
            this._XYZfromLab();
            this._xyzfromXYZ();
        } else if (!this._Chdirty) {
            this._LabfromLCh();
            this._XYZfromLab();
            this._xyzfromXYZ();
        } else {
            console.error("Trying to generate xyz on "+this+", but nothing to generate from");            
        }
    }
}
rpghudColor.prototype._cleanXYZ = function() {
    if (debugConversions) console.log("_cleanXYZ");
    if (this._XYZdirty) {
        if (!this._xyzdirty) {
            this._XYZfromxyz();
        } else if (!this._rgbdirty) {
            this._xyzfromrgb();
            this._XYZfromzyz();
        } else if (!this._RGBdirty) {
            this._rgbfromRGB();
            this._xyzfromrgb();
            this._XYZfromzyz();
        } else if (!this._abdirty) {
            this._XYZfromLab();
        } else if (!this._Chdirty) {
            this._LabfromLCh();
            this._XYZfromLab();
        } else {
            console.error("Trying to generate XYZ on "+this+", but nothing to generate from");            
        }
    }
}
rpghudColor.prototype._cleanLab = function() {
    if (debugConversions) console.log("_cleanLab");
    if (this._abdirty) {
        if (!this._XYZdirty) {
            this._LabfromXYZ();
        } else if (!this._xyzdirty) {
            this._XYZfromxyz();
            this._LabfromXYZ();
        } else if (!this._rgbdirty) {
            this._xyzfromrgb();
            this._XYZfromxyz();
            this._LabfromXYZ();            
        } else if (!this._RGBdirty) {
            this._rgbfromRGB();
            this._xyzfromrgb();
            this._XYZfromxyz();
            this._LabfromXYZ();            
        } else if (!this._Chdirty) {
            this._LabfromLCh();
        } else {
            console.error("Trying to generate Lab on "+this+", but nothing to generate from");            
        }
    }
}
rpghudColor.prototype._cleanLCh = function() {
    if (debugConversions) console.log("_cleanLCh");
    if (this._Chdirty) {
        if (!this._abdirty) {
            this._LChfromLab();
        } else if (!this._XYZdirty) {
            this._LabfromXYZ();
            this._LChfromLab();            
        } else if (!this._xyzdirty) {
            this._XYZfromxyz();
            this._LabfromXYZ();
            this._LChfromLab();            
        } else if (!this._rgbdirty) {
            this._xyzfromrgb();
            this._XYZfromxyz();
            this._LabfromXYZ();
            this._LChfromLab();                        
        } else if (!this._RGBdirty) {
            this._rgbfromRGB();
            this._xyzfromrgb();
            this._XYZfromxyz();
            this._LabfromXYZ();
            this._LChfromLab();                        
        } else {
            console.error("Trying to generate LCh on "+this+", but nothing to generate from");            
        }
    }
}

rpghudColor.prototype.debugMsg = function(txt) {
    console.log(txt,
                "RGB:", this._RGBdirty ? "*" : "" + this._R + " " + this._G + " " + this._B,
                "rgb:", this._rgbdirty ? "*" : "" + this._r + " " + this._g + " " + this._b,
                "xyz:", this._xyzdirty ? "*" : "" + this._x + " " + this._y + " " + this._z,
                "XYZ:", this._XYZdirty ? "*" : "" + this._X + " " + this._Y + " " + this._Z,
                "L:", this._Ldirty ? "*" : "" + this._L,
                "Ch:", this._Chdirty ? "*" : "" + this._C + " " + this._h,
                "ab:", this._abdirty ? "*" : "" + this._as + " " + this._bs
                );
}

Object.defineProperty(rpghudColor.prototype, "R", {
    get: function() {this._cleanRGB(); return this._R;},
    set: function(value) {
        this._R = value;
        this._RGBdirty = false; this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "G", {
    get: function() {this._cleanRGB(); return this._G;},
    set: function(value) {
        this._G = value;
        this._RGBdirty = false; this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "B", {
    get: function() {this._cleanRGB(); return this._B;},
    set: function(value) {
        this._B = value;
        this._RGBdirty = false; this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "CSS", {
    get: function() {
        this._cleanRGB();
        var roundR = Math.round(this._R);
        var roundG = Math.round(this._G);
        var roundB = Math.round(this._B);
        var rStr = (roundR>15)? roundR.toString(16) : "0" + roundR.toString(16);
        var gStr = (roundG>15)? roundG.toString(16) : "0" + roundG.toString(16);
        var bStr = (roundB>15)? roundB.toString(16) : "0" + roundB.toString(16);
        return "#".concat(rStr, gStr, bStr);
    },
    set: function(value) {
        var chars = value.split("");
        this._R = parseInt(chars[1].concat(chars[2]), 16);
        this._G = parseInt(chars[3].concat(chars[4]), 16);
        this._B = parseInt(chars[5].concat(chars[6]), 16);
        this._RGBdirty = false; this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "inGamut", {
   get: function() {
    this._cleanRGB();
    return ((this._R >= 0) && (this._R < 255.5) &&
            (this._G >= 0) && (this._G < 255.5) &&
            (this._B >= 0) && (this._B < 255.5));
   }
});
Object.defineProperty(rpghudColor.prototype, "r", {
    get: function() {this._cleanrgb(); return this._r;},
    set: function(value) {
        this._r = value;
        this._RGBdirty = true; this._rgbdirty = false;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "g", {
    get: function() {this._cleanrgb(); return this._g;},
    set: function(value) {
        this._g = value;
        this._RGBdirty = true;  this._rgbdirty = false;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "b", {
    get: function() {this._cleanrgb(); return this._b;},
    set: function(value) {
        this._b = value;
        this._RGBdirty = true;  this._rgbdirty = false;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "X", {
    get: function() {this._cleanXYZ(); return this._X;},
    set: function(value) {
        this._X = value;
        this._RGBdirty = true; this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = false;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "Y", {
    get: function() {this._cleanXYZ(); return this._Y;},
    set: function(value) {
        this._Y = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = false;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "Z", {
    get: function() {this._cleanXYZ(); return this._Z;},
    set: function(value) {
        this._Z = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = false;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "x", {
    get: function() {this._cleanxyz(); return this._x;},
    set: function(value) {
        this._x = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = false; this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "y", {
    get: function() {this._cleanxyz(); return this._y;},
    set: function(value) {
        this._y = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = false; this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "z", {
    get: function() {this._cleanxyz(); return this._z;},
    set: function(value) {
        this._z = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = false; this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = true;
    }
});
Object.defineProperty(rpghudColor.prototype, "L", {
    get: function() {this._cleanLab(); return this._L;},
    set: function(value) {
        this._L = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        //this._abdirty = true;  this._Chdirty = true;
        this._Ldirty = false;
    }
});
Object.defineProperty(rpghudColor.prototype, "as", {
    get: function() {this._cleanLab(); return this._as;},
    set: function(value) {
        this._as = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = false; this._Chdirty = true;
        //this._Ldirty = false;
    }
});
Object.defineProperty(rpghudColor.prototype, "bs", {
    get: function() {this._cleanLab(); return this._bs;},
    set: function(value) {
        this._bs = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = false; this._Chdirty = true;
        //this._Ldirty = false;
    }
});
Object.defineProperty(rpghudColor.prototype, "C", {
    get: function() {this._cleanLCh(); return this._C;},
    set: function(value) {
        this._C = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = false;
        //this._Ldirty = false;
    }
});
Object.defineProperty(rpghudColor.prototype, "h", {
    get: function() {this._cleanLCh(); return this._h;},
    set: function(value) {
        this._h = value;
        this._RGBdirty = true;  this._rgbdirty = true;
        this._xyzdirty = true;  this._XYZdirty = true;
        this._abdirty = true;  this._Chdirty = false;
        //this._Ldirty = false;
    }
});




function RGBtoHexStr(r, g, b) {
    var rStr = (r>15)? r.toString(16) : "0" + r.toString(16);
    var gStr = (g>15)? g.toString(16) : "0" + g.toString(16);
    var bStr = (b>15)? b.toString(16) : "0" + b.toString(16);
    return "#".concat(rStr, gStr, bStr);
}

function ColorToString(color) {
    return "["+color[0].toFixed(3)+","+color[1].toFixed(3)+","+color[2].toFixed(3)+"]";
}

// formulas from wikipedia
function RGBtoXYZ(rgbColor) {
    // R,G,B from 0 to 255, X,Y,Z from 0 to 100
    //var R = rgbColor[0]/255;
    //var G = rgbColor[1]/255;
    //var B = rgbColor[2]/255;
    //
    //var X = R*0.412453 + G*0.357580 + B*0.180423;
    //var Y = R*0.212671 + G*0.715160 + B*0.072169;
    //var Z = R*0.019334 + G*0.119193 + B*0.950227;
    //
    //return [100*X, 100*Y, 100*Z];
    
    var R = rgbColor[0];
    var G = rgbColor[1];
    var B = rgbColor[2];
    
    var X = 0.161746275*R + 0.140227451*G + 0.070754118*B;
    var Y = 0.083400392*R + 0.280454902*G + 0.028301569*B;
    var Z = 0.007581961*R + 0.046742353*G + 0.372638039*B;
    
    return [X, Y, Z];
}
function XYZtoRGB(xyzColor) {
    //var X = xyzColor[0]/100;
    //var Y = xyzColor[1]/100;
    //var Z = xyzColor[2]/100;
    //
    //var R = X * 3.240479 + Y *-1.537150 + Z *-0.498535;
    //var G = X *-0.969256 + Y * 1.875992 + Z * 0.041556;
    //var B = X * 0.055648 + Y *-0.204043 + Z * 1.057311;
    //
    //return [Math.round(255*R), Math.round(255*G), Math.round(255*B)];
    
    var X = xyzColor[0];
    var Y = xyzColor[1];
    var Z = xyzColor[2];
    
    var R =  8.26322145*X - 3.9197325*Y  - 1.27126425*Z;
    var G = -2.4716028*X  + 4.7837796*Y  + 0.10596780*Z;
    var B =  0.1419024*Z  - 0.52030965*Y + 2.69614305*Z;
}

function XYZtoLab(xyzColor) {
    var X = xyzColor[0]/100;
    var Y = xyzColor[1]/100;
    var Z = xyzColor[2]/100;
    
    var Xn =  95.047; // from wikipedia
    var Yn = 100.000;
    var Zn = 108.883;
    
    var L = (Y/Yn > 0.008856) ? 116 * Math.pow(Y/Yn, 0.33333333) - 16 : 903.3*Y/Yn;
    var a = 500 * (LabF(X/Xn) - LabF(Y/Yn));
    var b = 200 * (LabF(Y/Yn) - LabF(Z/Zn));
    
    return [L, a, b];
}
function LabToXYZ(LabColor) {
    var L = LabColor[0];
    var a = LabColor[1];
    var b = LabColor[2];

    var Xn =  95.047; // from wikipedia
    var Yn = 100.000;
    var Zn = 108.883;
    
    var X = Xn * LabInverseF((L+16)/116 + a/500);
    var Y = Yn * LabInverseF((L+16)/116);
    var Z = Zn * LabInverseF((L+16)/116 - b/200);
    
    return [100*X, 100*Y, 100*Z];
}

function LabF(t) {
    if (t > 6/29) {
        return Math.pow(t, 0.3333333333);
    } else {
        return Math.pow(29/6, 2)*t/3 + 4/29;
    }
}
function LabInverseF(t) {
    if (t > 6/29) {
        return Math.pow(t, 3);
    } else {
        return 3*Math.pow(6/29, 2)*(t - 4/29);
    }
}

function LabtoLCh(LabColor) {
    var L = LabColor[0];
    var a = LabColor[1];
    var b = LabColor[2];
    
    var C = Math.sqrt(Math.pow(a, 2)+Math.pow(b, 2));
    var h = 180/Math.PI*Math.atan2(b,a);
    
    return [L, C, h];
}
function LChtoLab(LChColor) {
    var L = LChColor[0];
    var C = LChColor[1];
    var h = LChColor[2]*Math.PI/180;
    
    var a = C*Math.cos(h);
    var b = C*Math.sin(h);
    
    return [L, a, b];
}

function RGBtoLab(rgbColor) {
    return XYZtoLab(RGBtoXYZ(rgbColor));
}
function LabtoRGB(LabColor) {
    return XYZtoRGB(LabToXYZ(LabColor));
}
