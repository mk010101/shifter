(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.glide = factory());
}(this, (function () { 'use strict';

    class Func {
        static getPowInOut(pow) {
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            };
        }
        ;
        static getPowIn(pow) {
            return function (t) {
                return Math.pow(t, pow);
            };
        }
        ;
        static getPowOut(pow) {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            };
        }
        ;
        static getBackIn(s = 1.70158) {
            return function (t = 0.0) {
                return t * t * ((s + 1) * t - s);
            };
        }
        static getBackOut(s = 1.70158) {
            return function (t = 0.0) {
                return (t = t - 1) * t * ((s + 1) * t + s) + 1;
            };
        }
        static getBackInOut(s = 1.70158) {
            return function (t = 0.0) {
                if ((t *= 2) < 1)
                    return 0.5 * (t * t * ((s + 1) * t - s));
                return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
            };
        }
        static getElasticIn(period = 0.3, amplitude = 1.70158) {
            return function (t) {
                let a = 1;
                if (t === 0)
                    return 0;
                if (t === 1)
                    return 1;
                if (!period)
                    period = 0.3;
                if (a < 1) {
                    a = 1;
                    amplitude = period / 4;
                }
                else
                    amplitude = period / (2 * Math.PI) * Math.asin(1 / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - amplitude) * (2 * Math.PI) / period));
            };
        }
        static getElasticOut(period = 0.3, amplitude = 1.70158) {
            return function (t) {
                let a = 1;
                if (t === 0)
                    return 0;
                if (t === 1)
                    return 1;
                if (a < 1) {
                    a = 1;
                    amplitude = period / 4;
                }
                else
                    amplitude = period / (2 * Math.PI) * Math.asin(1 / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t - amplitude) * (2 * Math.PI) / period) + 1;
            };
        }
        static getElasticInOut(period = 0.45, amplitude = 1.70158) {
            return function (t) {
                let a = 1;
                if (t === 0)
                    return 0;
                if ((t /= 1 / 2) === 2)
                    return 1;
                if (a < 1) {
                    a = 1;
                    amplitude = period / 4;
                }
                else
                    amplitude = period / (2 * Math.PI) * Math.asin(1 / a);
                if (t < 1)
                    return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - amplitude) * (2 * Math.PI) / period));
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - amplitude) * (2 * Math.PI) / period) * 0.5 + 1;
            };
        }
        static linear(t = 0.0) {
            return t;
        }
        static quadIn(t = 0.0) {
            return t * t;
        }
        static quadOut(t = 0.0) {
            return t * (2 - t);
        }
        ;
        static quadInOut(t = 0.0) {
            if (t < 0.5)
                return 2.0 * t * t;
            else
                return -1.0 + (4.0 - 2.0 * t) * t;
        }
        static circleIn(t = 0.0) {
            return -1 * (Math.sqrt(1 - t * t) - 1);
        }
        static circleOut(t = 0.0) {
            return Math.sqrt(1 - (t = t - 1) * t);
        }
        ;
        static circleInOut(t = 0.0) {
            if ((t /= 1 / 2) < 1)
                return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
            return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        }
        static expoIn(t = 0.0) {
            return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1));
        }
        static expoOut(t = 0.0) {
            return (t === 1) ? 1 : (-Math.pow(2, -10 * t) + 1);
        }
        static expoInOut(t = 0.0) {
            if (t === 0)
                return 0;
            if (t === 1)
                return 1;
            if ((t /= 1 / 2) < 1)
                return 1 / 2 * Math.pow(2, 10 * (t - 1));
            return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
        }
        static bounceIn(t) {
            return 1 - Func.bounceOut(1 - t);
        }
        ;
        static bounceOut(t) {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            }
            else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            }
            else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            }
            else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        }
        ;
        static bounceInOut(t) {
            if (t < 0.5)
                return Func.bounceIn(t * 2) * .5;
            return Func.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }
        ;
    }
    Func.cubicIn = Func.getPowIn(3);
    Func.cubicOut = Func.getPowOut(3);
    Func.cubicInOut = Func.getPowInOut(3);
    Func.backIn = Func.getBackIn();
    Func.backOut = Func.getBackOut();
    Func.backInOut = Func.getBackInOut();
    Func.elasticIn = Func.getElasticIn();
    Func.elasticOut = Func.getElasticOut();
    Func.elasticInOut = Func.getElasticInOut();

    class Ticker {
        constructor() {
            this._fps = 10.0;
            this._useFps = false;
            this._interval = 1000.0 / this._fps;
            this._lastTick = 0.0;
            this._isRunning = false;
            this._rafId = 0;
            this._useFrames = false;
            this._items = [];
            this.tickRAF = this.tickRAF.bind(this);
            this.tickFrames = this.tickFrames.bind(this);
        }
        start() {
            if (this._isRunning)
                return;
            this._isRunning = true;
            this._lastTick = performance.now();
            this._rafId = requestAnimationFrame(this.tickRAF);
        }
        removeAll() {
            this._items = [];
        }
        stop() {
            this._isRunning = false;
        }
        set useFrames(value) {
            this._useFrames = value;
            if (value) {
                cancelAnimationFrame(this._rafId);
                this._rafId = requestAnimationFrame(this.tickFrames);
            }
            else {
                cancelAnimationFrame(this._rafId);
                this._lastTick = performance.now();
                this._rafId = requestAnimationFrame(this.tickRAF);
            }
        }
        set fps(value) {
            this._fps = value;
            this._interval = 1000.0 / this._fps;
            this._useFps = true;
        }
        get fps() {
            return this._fps;
        }
        get items() {
            return this._items;
        }
        tickRAF() {
            if (!this._isRunning)
                return;
            this._rafId = requestAnimationFrame(this.tickRAF);
            let now = performance.now();
            if (this._useFps && now - this._lastTick < this._interval + 1) {
                return;
            }
            let frameTime = (now - this._lastTick);
            this.update(frameTime);
            this._lastTick = now;
        }
        tickFrames() {
            if (!this._isRunning)
                return;
            this._rafId = requestAnimationFrame(this.tickFrames);
            this.update(1);
        }
        update(frameTime = 1) {
            for (let k = this._items.length - 1, i = k; i >= 0; i--) {
                let u = this._items[i];
                if (u.status === -1) {
                    this._items.splice(i, 1);
                }
                else {
                    u.update(frameTime);
                }
            }
        }
        add(u) {
            this._items.push(u);
        }
    }

    class Dispatcher {
        constructor() {
            this._listeners = {};
            this._numListeners = 0;
        }
        addListener(evt, listener) {
            if (!this._listeners[evt])
                this._listeners[evt] = [];
            if (this._listeners[evt].indexOf(listener) === -1) {
                this._listeners[evt].push(listener);
                this._numListeners++;
            }
        }
        removeListener(evt, listener) {
            if (!this._listeners[evt])
                return;
            let ind = this._listeners[evt].indexOf(listener);
            if (ind > -1) {
                this._listeners[evt].splice(ind, 1);
                this._numListeners++;
            }
        }
        dispatch(evt, args) {
            let ls = this._listeners[evt];
            if (ls !== void 0) {
                for (let i = 0; i < ls.length; i++) {
                    ls[i](args);
                }
            }
        }
        removeAllListeners() {
            this._listeners = {};
            this._numListeners = 0;
        }
    }

    class BaseTween extends Dispatcher {
        constructor() {
            super();
            this.status = 1;
            this.keepAlive = false;
            this._ignoreActions = false;
            this._useCompStyle = false;
            this._useFrames = false;
            this._dir = 1;
            this._listeners = {
                call: [] = [],
                end: [] = [],
                tweenStart: [] = [],
                tweenEnd: [] = [],
                repeat: [] = [],
                progress: [] = [],
                update: [] = [],
            };
            this.id = BaseTween.__ids++;
        }
        init() {
        }
        setStatus(value) {
            this.status = value;
            return this;
        }
        to(dur, params, options) {
            return this;
        }
        ;
        update(frameTime) {
        }
        remove() {
        }
        pause() {
            return this;
        }
        play() {
            return this;
        }
        start() {
            return this;
        }
        reset() {
            return this;
        }
        wait(time) {
            return this;
        }
        repeat(times, reverse) {
            return this;
        }
        on(evt, func) {
            this.addListener(evt, func);
            return this;
        }
        off(evt, func) {
            this.removeListener(evt, func);
            return this;
        }
        offAll() {
            this.removeAllListeners();
            return this;
        }
        call(func, scope, params) {
            return this;
        }
        get totalDuration() {
            return 0;
        }
        get percentComplete() {
            return 0;
        }
        get position() {
            return 0;
        }
        get target() {
            return null;
        }
        set useComputedStyle(value) {
            this._useCompStyle = value;
        }
        set useFrames(value) {
            this._useFrames = value;
        }
        reverse() {
            this._dir *= -1;
        }
        _callEnd() {
            if (this._ignoreActions)
                return;
            this.status = this.keepAlive === true ? 0 : -1;
            if (this._listeners.end) {
                for (let i = 0; i < this._listeners.end.length; i++) {
                    this._listeners.end[i]();
                }
            }
            if (this.status === -1)
                this.remove();
        }
        _callTweenStart() {
            if (!this._ignoreActions && this._listeners.tweenStart != void null) {
                for (let i = 0; i < this._listeners.tweenStart.length; i++) {
                    this._listeners.tweenStart[i]();
                }
            }
        }
        _callTweenEnd() {
            if (!this._ignoreActions && this._listeners.tweenEnd != void null) {
                for (let i = 0; i < this._listeners.tweenEnd.length; i++) {
                    this._listeners.tweenEnd[i]();
                }
            }
        }
        _callRepeat() {
            if (!this._ignoreActions && this._listeners.repeat != void null) {
                for (let i = 0; i < this._listeners.repeat.length; i++) {
                    this._listeners.repeat[i]();
                }
            }
        }
        _callProgress() {
            if (!this._ignoreActions && this._listeners.progress != void null) {
                for (let i = 0; i < this._listeners.progress.length; i++) {
                    this._listeners.progress[i]();
                }
            }
        }
        _callUpdate() {
            if (!this._ignoreActions && this._listeners.update != void null) {
                for (let i = 0; i < this._listeners.update.length; i++) {
                    this._listeners.update[i]();
                }
            }
        }
    }
    BaseTween.__ids = 0;

    class Action {
        constructor(type, dur = 0, params = void 0, options = void 0) {
            this.params = void 0;
            this.options = void 0;
            this.timeScale = 1.0;
            this.isDelay = false;
            this.isStartDelay = false;
            this.totalTime = 0.0;
            this.dur = 0.0;
            this.time = 0.0;
            this.repeat = 0;
            this.repeatCount = 0;
            this.ease = Func.quadInOut;
            this.callFunc = void 0;
            this.callParams = void 0;
            this.callScope = void 0;
            this.subs = void 0;
            if (options) {
                this.ease = options.ease !== void 0 ? options.ease : Func.quadInOut;
                if (options.timeScale !== void 0 && options.timeScale > 0)
                    this.timeScale = options.timeScale;
            }
            this.dur = dur;
            this.type = type;
            this.params = params;
            this.options = options;
            this.totalTime = this.dur * this.timeScale;
        }
        remove() {
            if (this.subs === void 0)
                return;
            for (let i = 0; i < this.subs.length; i++) {
                this.subs[i].destroy();
            }
            this.callFunc = null;
        }
        resetSubs() {
            if (this.subs !== void 0) {
                for (let i = 0; i < this.subs.length; i++) {
                    this.subs[i].reset();
                }
            }
        }
    }

    class AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            this.target = void 0;
            this.prop = "";
            this.b = 0.0;
            this.e = 0.0;
            this.v = 0.000001;
            this.unit = "";
            this.str = "";
            this._isDom = true;
            this.style = null;
            this.reversed = false;
            this.values = [];
            this.strings = [];
            this.target = target;
            this.prop = prop;
        }
        init(value, elStyle, compStyle) {
        }
        update(v) {
        }
        reset() {
            this.v = 0;
            this.update(0);
        }
        destroy() {
            this.target = null;
            this.style = null;
        }
    }

    class Regex {
    }
    Regex.regColor = /color|fill/i;
    Regex.isHex = /#[0-9a-f]+/gi;
    Regex.regColorSpace = /^#|^rgba|^rgb|^hsl+/i;
    Regex.regOpacity = /opacity/i;
    Regex.regNum = /[0-9.-]+/;
    Regex.regScroll = /scroll/i;
    Regex.regValues = /(\+=|-=)?([\-0-9.]+)([a-z%]+)?/;
    Regex.regNoUnit = /scale|opacity|scroll|brightness/;
    Regex.regDefault1 = /scale|opacity|brightness/;
    Regex.regPercent = /contrast|grayscale|invert|saturate|sepia/;
    Regex.regDeg = /rotate|skew|hue-rotate/;
    Regex.regSplit = /(translate3d)|(rotate3d)|(scale3d)|(matrix3d)|([a-z% ,]+)|([0-9.-]+)|([()])/gi;
    class Util {
        static getNormalizedTransforms(transforms) {
            let arr = transforms.split(" ");
            let props = transforms.split(/\([\-0-9.[a-z]+\)+ ?/i);
            props.pop();
            let tmp = [props.shift()];
            let res = [arr.shift()];
            for (let i = 0; i < arr.length; i++) {
                let prop = props[i];
                let ind = tmp.indexOf(prop);
                let val = Util.getNum(arr[i]);
                let unit = Util.getUnit(arr[i]);
                if (ind === -1) {
                    tmp.push(prop);
                    res.push(arr[i]);
                }
                else {
                    let valNew = Util.getNum(arr[i]);
                    let valOld = Util.getNum(res[ind]);
                    let val;
                    if (/scale/i.test(prop)) {
                        val = valOld * valNew;
                    }
                    else {
                        val = valOld + valNew;
                    }
                    res[ind] = `${prop}(${val}${unit})`;
                }
            }
            return res;
        }
        static getParams(key, value, oldVal = null) {
            let sign;
            let obj = {
                b: 0,
                e: 0,
                prop: "",
                unit: ""
            };
            obj.prop = key;
            if (Array.isArray(value)) {
                if (!isNaN(value[0])) {
                    obj.b = parseFloat(value[0]);
                }
                else {
                    let res = value[0].split(Regex.regValues);
                    obj.b = parseFloat(res[2]);
                    obj.unit = res[3];
                    console.log(obj.b);
                }
                if (!isNaN(value[1])) {
                    obj.e = parseFloat(value[1]) - obj.b;
                }
                else {
                    let res2 = value[1].split(Regex.regValues);
                    obj.e = parseFloat(res2[2]) - obj.b;
                }
                if (oldVal && !obj.unit) {
                    let oldRes = oldVal.split(Regex.regValues);
                    obj.unit = oldRes[3];
                }
            }
            else {
                if (!isNaN(value)) {
                    obj.e = parseFloat(value);
                }
                else {
                    let res = value.split(Regex.regValues);
                    if (res[1])
                        sign = res[1];
                    obj.e = parseFloat(res[2]);
                    if (res[3])
                        obj.unit = res[3];
                }
                if (oldVal) {
                    let oldRes = oldVal.split(Regex.regValues);
                    if (obj.unit === oldRes[3] || !obj.unit) {
                        obj.b = parseFloat(oldRes[2]);
                        obj.unit = oldRes[3];
                    }
                }
                else if (Regex.regDefault1.test(key)) {
                    obj.b = 1;
                }
                if (sign === "+=") ;
                else if (sign === "-=") {
                    obj.e = -obj.e;
                }
                else {
                    obj.e = obj.e - obj.b;
                }
            }
            if (!obj.unit) {
                obj.unit = "";
                if (Regex.regPercent.test(key)) {
                    obj.unit = "%";
                }
                else if (!Regex.regNoUnit.test(key)) {
                    if (Regex.regDeg.test(key)) {
                        obj.unit = "deg";
                    }
                    else {
                        obj.unit = "px";
                    }
                }
            }
            return obj;
        }
        static getUnit(input, prop = null) {
            if (!isNaN(input)) {
                if (prop && prop.match(Regex.regOpacity))
                    return "";
                return Util.getTransformUnit(prop);
            }
            let res = input.match(/([0-9.()]+)([a-z%]+)/i);
            if (res) {
                return res[2];
            }
            return Util.getTransformUnit(prop);
        }
        static getTransformUnit(prop) {
            if (!prop)
                return "";
            if (/rotate|skew/i.test(prop)) {
                return "deg";
            }
            else if (/scale/i.test(prop)) {
                return "";
            }
            return "px";
        }
        static getNum(value) {
            if (!isNaN(value)) {
                return parseFloat(value);
            }
            value = value.replace(/^-=/, "");
            return parseFloat(Regex.regNum.exec(value)[0]);
        }
        static extend(target, src) {
            src.forEach(src => {
                Object.getOwnPropertyNames(src.prototype).forEach(name => {
                    target.prototype[name] = src.prototype[name];
                });
            });
        }
    }
    class Color {
        static getRGBa(value) {
            if (!value)
                return [0, 0, 0, 0];
            if (Regex.isHex.test(value)) {
                return Color.hexToRGB(value);
            }
            let arr = value.split(/[rgba(),]+/);
            let arr2 = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i])
                    arr2.push(parseFloat(arr[i]));
            }
            return arr2;
        }
        static hexToRGB(hex) {
            hex = hex.replace(/^#/, "");
            let bigint;
            return [(bigint = parseInt(hex, 16)) >> 16 & 255, bigint >> 8 & 255, bigint & 255];
        }
        static hexToHsl(hex) {
            let rgb = Color.hexToRGB(hex);
            return Color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
        }
        static rgbToHsl(r, g, b) {
            let min, max, i, l, s, maxcolor, h, rgb = [];
            rgb[0] = r / 255;
            rgb[1] = g / 255;
            rgb[2] = b / 255;
            min = rgb[0];
            max = rgb[0];
            maxcolor = 0;
            for (i = 0; i < rgb.length - 1; i++) {
                if (rgb[i + 1] <= min) {
                    min = rgb[i + 1];
                }
                if (rgb[i + 1] >= max) {
                    max = rgb[i + 1];
                    maxcolor = i + 1;
                }
            }
            if (maxcolor == 0) {
                h = (rgb[1] - rgb[2]) / (max - min);
            }
            if (maxcolor == 1) {
                h = 2 + (rgb[2] - rgb[0]) / (max - min);
            }
            if (maxcolor == 2) {
                h = 4 + (rgb[0] - rgb[1]) / (max - min);
            }
            if (isNaN(h)) {
                h = 0;
            }
            h = h * 60;
            if (h < 0) {
                h = h + 360;
            }
            l = (min + max) / 2;
            if (min == max) {
                s = 0;
            }
            else {
                if (l < 0.5) {
                    s = (max - min) / (max + min);
                }
                else {
                    s = (max - min) / (2 - max - min);
                }
            }
            return [h, s * 100, l * 100];
        }
        static hslToRgb(h, s, l) {
            let t1, t2, r, g, b;
            h = h / 60;
            if (l <= 0.5) {
                t2 = l * (s + 1);
            }
            else {
                t2 = l + s - (l * s);
            }
            t1 = l * 2 - t2;
            r = Math.round(Color._hueToRgb(t1, t2, h + 2) * 255);
            g = Math.round(Color._hueToRgb(t1, t2, h) * 255);
            b = Math.round(Color._hueToRgb(t1, t2, h - 2) * 255);
            return [r, g, b];
        }
        static _hueToRgb(t1, t2, hue) {
            if (hue < 0)
                hue += 6;
            if (hue >= 6)
                hue -= 6;
            if (hue < 1)
                return (t2 - t1) * hue + t1;
            else if (hue < 3)
                return t2;
            else if (hue < 4)
                return (t2 - t1) * (4 - hue) + t1;
            else
                return t1;
        }
    }

    class TransformSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this.init(to, elStyle, compStyle);
        }
        init(to, elStyle, compStyle) {
            this.style = this.target.style;
            let oldTransform = elStyle.transform;
            if (oldTransform) {
                this.strings = Util.getNormalizedTransforms(oldTransform);
                for (let i = 0; i < this.strings.length; i++) {
                    this.values.push(null);
                }
            }
            let keys = Object.keys(to);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let val = to[key];
                if (key === "x") {
                    key = "translateX";
                }
                else if (key === "y") {
                    key = "translateY";
                }
                if (!oldTransform) {
                    this.values.push(Util.getParams(key, val));
                }
                else {
                    for (let j = 0; j < this.strings.length; j++) {
                        let ind = this.strings[j].indexOf(key);
                        if (ind > -1) {
                            this.values[j] = Util.getParams(key, val, this.strings[j]);
                            this.strings[j] = key;
                        }
                    }
                    if (this.strings.indexOf(key) === -1) {
                        this.strings.push(key);
                        this.values.push(Util.getParams(key, val));
                    }
                }
            }
        }
        update(v) {
            for (let i = 0, k = this.values.length; i < k; i++) {
                let tr = this.values[i];
                if (tr !== null) {
                    let val = v * tr.e + tr.b;
                    this.strings[i] = `${tr.prop}(${val}${tr.unit})`;
                }
            }
            this.style.transform = this.strings.join(" ");
        }
    }

    class FilterSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this.init(to, elStyle, compStyle);
        }
        init(to, elStyle, compStyle) {
            this.style = this.target.style;
            let oldStyle = elStyle.filter;
            if (oldStyle) {
                this.strings = Util.getNormalizedTransforms(oldStyle);
                for (let i = 0; i < this.strings.length; i++) {
                    this.values.push(null);
                }
            }
            let keys = Object.keys(to);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let val = to[key];
                if (!oldStyle) {
                    this.values.push(Util.getParams(key, val));
                }
                else {
                    for (let j = 0; j < this.strings.length; j++) {
                        let ind = this.strings[j].indexOf(key);
                        if (ind > -1) {
                            this.values[j] = Util.getParams(key, val, this.strings[j]);
                            this.strings[j] = key;
                        }
                    }
                    if (this.strings.indexOf(key) === -1) {
                        this.strings.push(key);
                        this.values.push(Util.getParams(key, val));
                    }
                }
            }
        }
        update(v) {
            for (let i = 0; i < this.values.length; i++) {
                let tr = this.values[i];
                if (tr !== null) {
                    this.strings[i] = `${tr.prop}(${(v * tr.e + tr.b).toFixed(3)}${tr.unit})`;
                }
            }
            this.str = this.strings.join(" ");
            this.style.filter = this.str;
        }
    }

    class ColorSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this.colorSpace = "rgb";
            this.arr0 = [];
            this.arr1 = [];
            this.init(to, elStyle, compStyle);
        }
        init(to, elStyle, compStyle) {
            if (this.prop === "bg")
                this.prop = "backgroundColor";
            this.style = this.target.style;
            let newVal;
            if (!Array.isArray(to)) {
                this.colorSpace = ColorSub._getColorSpace(to);
                let cssStr;
                let compStyleStr;
                let oldCssStr;
                if (elStyle && (cssStr = elStyle[this.prop])) {
                    oldCssStr = cssStr;
                }
                else if (compStyle && (compStyleStr = compStyle[this.prop])) {
                    oldCssStr = compStyleStr;
                }
                this.arr0 = ColorSub._getValues(oldCssStr);
                if (this.colorSpace === "hsl") {
                    let [a, b, c] = Color.rgbToHsl(this.arr0[0], this.arr0[1], this.arr0[2]);
                    this.arr0[0] = a;
                    this.arr0[1] = b;
                    this.arr0[2] = c;
                }
                newVal = ColorSub._getValues(to);
            }
            else {
                this.colorSpace = ColorSub._getColorSpace(to[0]);
                this.arr0 = ColorSub._getValues(to[0]);
                newVal = ColorSub._getValues(to[1]);
            }
            if (this.arr0.length > newVal.length) {
                newVal.push(1);
            }
            else if (this.arr0.length < newVal.length) {
                this.arr0.push(1);
            }
            this.arr1 = ColorSub._getNormalisedValues(this.arr0, newVal);
        }
        static _getColorSpace(to) {
            let match = to.match(Regex.regColorSpace);
            if (!match)
                return;
            let colSpace = match[0].toLowerCase();
            if (colSpace === "hsl") {
                return "hsl";
            }
            else {
                return "rgb";
            }
        }
        static _getValues(str) {
            if (str.indexOf("#") === 0) {
                return Color.hexToRGB(str);
            }
            let res = str.match(/[0-9.]+/gi);
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                arr.push(parseFloat(res[i]));
            }
            return arr;
        }
        static _getNormalisedValues(arr0, arr1) {
            let arr = [];
            for (let i = 0; i < arr0.length; i++) {
                arr.push(arr1[i] - arr0[i]);
            }
            return arr;
        }
        update(v) {
            let c0 = ~~(v * this.arr1[0] + this.arr0[0]);
            let c1 = ~~(v * this.arr1[1] + this.arr0[1]);
            let c2 = ~~(v * this.arr1[2] + this.arr0[2]);
            let len = this.arr0.length;
            let c3 = len === 4 ? ` ,${v * this.arr1[3] + this.arr0[3]}` : "";
            let a = len === 4 ? "a" : "";
            if (this.colorSpace === "rgb") {
                this.style[this.prop] = `rgb${a}(${c0}, ${c1}, ${c2}${c3})`;
            }
            else {
                this.style[this.prop] = `hsl${a}(${c0}, ${c1}%, ${c2}%${c3})`;
            }
        }
    }

    class PathSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this.path = null;
            this.len = 0.0;
            this.pos = { x: 0, y: 0 };
            this.rotation = 0.0;
            this.init(to, elStyle, compStyle);
        }
        init(to, elStyle, compStyle) {
            this.style = this.target.style;
            this._isDom = (this.target.nodeType === 1);
            this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            this.path.setAttribute("d", to);
            this.len = this.path.getTotalLength();
            this.str = "-";
        }
        update(v) {
            this.pos = this.path.getPointAtLength(this.len * v);
            let p0 = this.path.getPointAtLength(this.len * (v - 0.01));
            let p1 = this.path.getPointAtLength(this.len * (v + 0.01));
            this.rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
            this.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) rotate(${this.rotation}deg)`;
        }
    }

    class BaseSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this._isDom = false;
            this.init(to, null, null);
        }
        init(to, elStyle, compStyle) {
            let oldVal = this.target[this.prop] || 0.0;
            if (Array.isArray(to)) {
                this.b = to[0];
                this.e = to[1] - this.b;
            }
            else {
                let vals = Util.getParams(this.prop, to, oldVal.toString());
                this.b = vals.b;
                this.e = vals.e;
            }
        }
        update(v) {
            this.target[this.prop] = v * this.e + this.b;
        }
    }

    class RawSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this._parts = [];
            this.init(to, elStyle, compStyle);
        }
        init(to, elStyle, compStyle) {
            this.style = elStyle ? elStyle : this.target;
            let keys = Object.keys(to);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let obj = to[key];
                let part = {
                    propName: key,
                    floats: [],
                    begins: [],
                    ends: [],
                    results: [],
                };
                if (!Array.isArray(obj)) {
                    let p = RawSub._getPart(obj);
                    part.floats = p.floats;
                    part.begins = p.begins;
                    part.ends = p.ends;
                    part.results = p.results;
                }
                else {
                    let p0 = RawSub._getPart(obj[0]);
                    let p1 = RawSub._getPart(obj[1]);
                    if (p0.floats.length !== p1.floats.length) {
                        throw new RangeError("Begin and end parameters don't match.");
                    }
                    part.floats = p0.floats;
                    part.begins = p0.ends;
                    part.ends = p1.ends;
                    part.results = p1.results;
                    for (let j = 0; j < part.begins.length; j++) {
                        part.ends[j] = part.ends[j] - part.begins[j];
                    }
                }
                this._parts.push(part);
            }
        }
        update(v) {
            for (let i = 0; i < this._parts.length; i++) {
                let part = this._parts[i];
                for (let j = 0; j < part.floats.length; j++) {
                    let type = part.floats[j];
                    let val;
                    if (type === 1) {
                        val = v * part.ends[j] + part.begins[j];
                        part.results[j] = val;
                    }
                    else if (type === 0) {
                        val = ~~(v * part.ends[j] + part.begins[j]);
                        part.results[j] = val;
                    }
                }
                this.style[part.propName] = part.results.join("");
            }
        }
        static _getPart(value) {
            let part = {
                floats: [],
                begins: [],
                ends: [],
                results: [],
            };
            let hex = value.match(Regex.isHex);
            if (hex) {
                let [r, g, b] = Color.hexToRGB(hex[0]);
                value = value.replace(Regex.isHex, `rgb(${r}, ${g}, ${b})`);
            }
            let reg = value.match(Regex.regSplit);
            for (let i = 0; i < reg.length; i++) {
                let obj = reg[i];
                let num = parseFloat(obj);
                if (!isNaN(num)) {
                    if (obj.indexOf(".") > -1) {
                        part.floats.push(1);
                        part.begins.push(0);
                        part.ends.push(num);
                    }
                    else {
                        part.floats.push(0);
                        part.begins.push(0);
                        part.ends.push(num);
                    }
                    part.results.push(num);
                }
                else {
                    part.floats.push(-1);
                    part.begins.push(-1);
                    part.ends.push(-1);
                    part.results.push(obj);
                }
            }
            return part;
        }
    }

    class CssSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this.init(to, elStyle, compStyle);
        }
        init(to, elStyle, compStyle) {
            this.style = this.target.style;
            let obj;
            let oldElStyle;
            let oldCompStyle;
            if (elStyle && (oldElStyle = elStyle[this.prop])) {
                obj = Util.getParams(this.prop, to, oldElStyle);
            }
            else if (compStyle && (oldCompStyle = compStyle[this.prop])) {
                obj = Util.getParams(this.prop, to, oldCompStyle);
            }
            else {
                obj = Util.getParams(this.prop, to);
            }
            this.b = obj.b;
            this.e = obj.e;
            this.unit = obj.unit;
        }
        update(v) {
            this.str = (v * this.e + this.b) + this.unit;
            this.style[this.prop] = this.str;
        }
    }

    class MatrixSub extends AbstractSub {
        constructor(target, to, prop, elStyle, compStyle) {
            super(target, to, prop, elStyle, compStyle);
            this.oldT = [];
            this.newT = [];
            this.init(to, elStyle, compStyle);
        }
        init(to, elStyle, compStyle) {
            this.style = this.target.style;
            this.oldT = [1, 0, 0, 1, 0, 0];
            this.newT = to;
            if (to.length === 2) {
                this.oldT = to[0];
                this.newT = to[1];
            }
            else {
                if (compStyle && compStyle.transform) {
                    this.oldT = MatrixSub.splitTransformMatrix(compStyle.transform);
                }
                else if (elStyle.transform) {
                    if (elStyle.transform.indexOf("matrix") === -1) {
                        console.log("You can't use non-matrix inline styles in Matrix transforms");
                    }
                    else {
                        this.oldT = MatrixSub.splitTransformMatrix(elStyle.transform);
                    }
                }
            }
            for (let i = 0; i < this.newT.length; i++) {
                this.values.push(0);
                this.newT[i] -= this.oldT[i];
            }
        }
        update(v) {
            for (let i = 0, k = this.values.length; i < k; i++) {
                this.values[i] = v * this.newT[i] + this.oldT[i];
            }
            this.style.transform = "matrix(" + this.values.join(", ") + ")";
        }
        static splitTransformMatrix(str) {
            let res = str.match(/[-0-9.]+/gi);
            if (res) {
                res = res.map((v) => parseFloat(v));
            }
            else
                res = [1, 0, 0, 1, 0, 0];
            return res;
        }
    }

    class Tween extends BaseTween {
        constructor(target, duration, params, options) {
            super();
            this._delay = 0.0;
            this._time = 0.0;
            this._totalTime = 0.0;
            this._totalDur = 0;
            this._delayCount = 0.0;
            this._ease = Func.quadInOut;
            this._paused = false;
            this._actions = [];
            this._isDom = void 0;
            this._style = void 0;
            this._compStyle = void 0;
            this._useCssTom = false;
            this._initialized = false;
            this._repeat = 0;
            this._repeatCount = 0;
            this._reverse = false;
            this._timeScale = 1;
            this._subs = [];
            this._funcs = [];
            this._pos = 0;
            this._lastDt = 0;
            if (duration <= 0)
                duration = 1;
            this._targ = target;
            this._useCompStyle = options.useComputedStyle;
            this._useFrames = options.useFrames;
            this._useCssTom = options.cssTom;
            if (options.startDelay) {
                this._startDelay(options.startDelay);
            }
            if (options.delay) {
                this.wait(options.delay);
            }
            if (options.paused) {
                this._paused = true;
            }
            if (options.tweenStart) {
                this.on("tweenStart", options.tweenStart);
            }
            this.to(duration, params, options);
            if (options.status !== 0)
                this._next();
        }
        static _getDur(t) {
            if (t < 0)
                t = .001;
            return t;
        }
        init() {
            this.status = 1;
            this._next();
        }
        wait(time) {
            let a = new Action(Tween.Type.WAIT, Tween._getDur(time), null, { ease: Func.linear });
            a.isDelay = true;
            this._actions.push(a);
            return this;
        }
        to(dur, params = null, options = null) {
            let a = new Action(Tween.Type.TO, Tween._getDur(dur), params, options);
            this._actions.push(a);
            return this;
        }
        repeat(times, reverse = false) {
            this._repeat = times > 0 ? times : 0;
            this._repeatCount = this._repeat;
            this._reverse = reverse;
            return this;
        }
        pause() {
            this._paused = true;
            return this;
        }
        play() {
            this._paused = false;
            this.status = 1;
            return this;
        }
        start() {
            if (this.status === -1)
                return;
            this._pos = 0;
            this._time = 0;
            this._dir = 1;
            this._delayCount = 0;
            this.status = 1;
            this._next();
            return this;
        }
        reset() {
            if (this.status === -1)
                return;
            this._pos = 0;
            this._time = 0;
            this._dir = 1;
            this._totalTime = 0;
            this._repeatCount = this._repeat;
            this._delayCount = 0;
            this._resetSubs();
            this.status = 1;
            this._next();
            return this;
        }
        reverse() {
            this._dir *= -1;
            this._time = 0;
            this._pos = this._actions.length - 1;
        }
        call(func, scope, params) {
            let a = new Action(Tween.Type.CALL);
            a.callFunc = func;
            a.callScope = scope;
            a.callParams = params;
            this._actions.push(a);
            return this;
        }
        remove() {
            this.status = -1;
            this.keepAlive = false;
            this.removeAllListeners();
            this._targ = null;
            this._style = null;
            this._compStyle = null;
            for (let i = 0; i < this._actions.length; i++) {
                this._actions[i].remove();
            }
        }
        get totalDuration() {
            if (this._totalDur === 0) {
                let aFirst = this._actions[0];
                let aLast = this._actions[this._actions.length - 1];
                let pos = aFirst.isStartDelay ? 1 : 0;
                for (let i = pos; i < this._actions.length; i++) {
                    let a = this._actions[i];
                    this._totalDur += a.totalTime;
                }
                if (this._repeat > 0) {
                    this._totalDur += this._totalDur * this._repeat;
                    if (this._reverse && aFirst.isDelay && !aFirst.isStartDelay) {
                        if (this._repeat % 2 === 0) {
                            this._totalDur -= (this._repeat / 2) * aFirst.dur;
                        }
                        else {
                            this._totalDur -= ((this._repeat + 1) / 2) * aFirst.dur;
                        }
                    }
                    else if (this._reverse && aLast.isDelay) {
                        if (this._repeat % 2 === 0) {
                            this._totalDur -= (this._repeat / 2 + 1) * aLast.dur;
                        }
                        else {
                            this._totalDur -= ((this._repeat + 1) / 2) * aLast.dur;
                        }
                    }
                }
                if (aFirst.isStartDelay) {
                    this._totalDur += aFirst.dur;
                }
            }
            return this._totalDur;
        }
        get percentComplete() {
            return Math.round(this._totalTime / this.totalDuration * 100);
        }
        get position() {
            return Math.round(this._totalTime);
        }
        set position(value) {
            if (value < 0)
                value = 0;
            if (value > this.totalDuration)
                value = this.totalDuration;
            let p = 0;
            this._ignoreActions = true;
            this.reset();
            while ((p += 1) <= value) {
                this.update(1);
            }
            this._ignoreActions = false;
        }
        get target() {
            return this._targ;
        }
        update(dt) {
            if (this.status < 1 || this._paused)
                return;
            this._callUpdate();
            this._totalTime += dt;
            if (this._delay > 0 && this._delayCount <= this._delay) {
                this._delayCount += dt;
                if (this._delayCount >= this._delay) {
                    this._time = (this._delayCount - this._delay);
                    this._pos += this._dir;
                    this._lastDt = dt;
                    this._next();
                }
                return;
            }
            let ratio = this._dir > 0 ? this._time / this._dur : 1 - this._time / this._dur;
            let end = this._dir > 0 ? ratio >= 1 : ratio <= 0;
            let val = this._dir > 0 ? 1 : 0;
            if (end) {
                this._render(val);
                this._callTweenEnd();
                let time = this._actions[this._pos].dur;
                this._pos += this._dir;
                this._time = this._time - time + dt + this._lastDt;
                this._lastDt = 0;
                this._next();
                return;
            }
            this._callProgress();
            this._time += dt;
            this._render(this._ease(ratio));
        }
        _next() {
            let l = this._actions.length;
            if (this._repeat > 0 && this._repeatCount === 0) {
                if (this._dir < 0 && this._actions[0].isDelay && this._pos === 0) {
                    this._callEnd();
                    return;
                }
                else if (this._dir > 0 && this._actions[l - 1].isDelay && this._pos === l - 1) {
                    this._callEnd();
                    return;
                }
            }
            this._delay = 0;
            this._delayCount = 0;
            let end = this._dir > 0 ? this._pos > this._actions.length - 1 : this._pos === -1;
            if (this._repeatCount === 0 && end) {
                this._callEnd();
                return;
            }
            if (this._repeatCount > 0 && end) {
                this._callRepeat();
                if (this._actions[0].isStartDelay) {
                    this._actions.splice(0, 1);
                    l -= 1;
                }
                if (this._reverse) {
                    if (this._dir > 0) {
                        this._dir = -1;
                        this._pos = this._actions[l - 1].isDelay ? l - 2 : l - 1;
                    }
                    else {
                        this._dir = 1;
                        this._pos = this._actions[0].isDelay ? 1 : 0;
                    }
                }
                else {
                    this._pos = 0;
                    this._resetSubs();
                }
                this._repeatCount--;
            }
            let a = this._actions[this._pos];
            switch (a.type) {
                case Tween.Type.TO:
                    if (!a.subs && !a.isDelay) {
                        this._setSubs(a);
                    }
                    this._dur = a.dur;
                    this._ease = a.ease;
                    this._subs = a.subs;
                    this._callTweenStart();
                    break;
                case Tween.Type.WAIT:
                    this._delay = a.dur;
                    this._delayCount = 0;
                    break;
                case Tween.Type.CALL:
                    a.callFunc.call(a.callScope, a.callParams);
                    this._pos += this._dir;
                    this._next();
                    break;
            }
        }
        _render(ratio) {
            for (let i = 0, k = this._subs.length; i < k; i++) {
                this._subs[i].update(ratio);
            }
        }
        _init() {
            if (this._initialized)
                return;
            this._isDom = (this._targ.nodeType === 1);
            if (this._isDom) {
                if (this._useCssTom) {
                    this._style = this._targ.style;
                    if (this._useCompStyle)
                        this._compStyle = getComputedStyle(this._targ);
                }
                else {
                    this._style = this._targ.style;
                    if (this._useCompStyle)
                        this._compStyle = getComputedStyle(this._targ);
                }
            }
            this._initialized = true;
        }
        _setSubs(action) {
            this._init();
            let targ = this._targ;
            let keys = Object.keys(action.params);
            let subs = [];
            for (let i = 0, n = keys.length; i < n; i++) {
                let prop = keys[i];
                let to = action.params[prop];
                if (this._isDom) {
                    if (prop === "transform" || prop === "t") {
                        if (!this._useCssTom) {
                            subs.push(new TransformSub(targ, to, prop, this._style, this._compStyle));
                        }
                        else {
                            subs.push(new TransformSub(targ, to, prop, this._style, this._compStyle));
                        }
                    }
                    else if (prop === "matrix" || prop === "m") {
                        subs.push(new MatrixSub(targ, to, prop, this._style, this._compStyle));
                    }
                    else if (prop === "filter" || prop === "f") {
                        subs.push(new FilterSub(targ, to, prop, this._style, this._compStyle));
                    }
                    else if (prop === "path" || prop === "p") {
                        subs.push(new PathSub(targ, to, prop, this._style, this._compStyle));
                    }
                    else if (prop === "bg" || Regex.regColor.test(prop)) {
                        subs.push(new ColorSub(targ, to, prop, this._style, this._compStyle));
                    }
                    else if (Regex.regScroll.test(prop)) {
                        subs.push(new BaseSub(targ, to, prop, this._style, this._compStyle));
                    }
                    else if (prop === "raw") {
                        subs.push(new RawSub(targ, to, prop, this._style, this._compStyle));
                    }
                    else {
                        subs.push(new CssSub(targ, to, prop, this._style, this._compStyle));
                    }
                }
                else {
                    subs.push(new BaseSub(targ, to, prop, this._style, this._compStyle));
                }
            }
            if (action.options && action.options.keepAlive !== void 0)
                this.keepAlive = action.options.keepAlive;
            action.subs = subs;
        }
        _startDelay(time) {
            let a = new Action(Tween.Type.WAIT, Tween._getDur(time), null, { ease: Func.linear });
            a.isDelay = true;
            a.isStartDelay = true;
            this._actions.push(a);
        }
        _resetSubs() {
            for (let i = this._actions.length - 1; i >= 0; i--) {
                this._actions[i].resetSubs();
            }
        }
    }
    Tween.Type = {
        CALL: 1,
        TO: 2,
        WAIT: 3
    };

    class Group extends BaseTween {
        constructor(ticker, target, duration, params, options = {}) {
            super();
            this.ticker = ticker;
            this._items = [];
            this._numEnded = 0;
            this._paused = false;
            this._totalDuration = 0;
            this._totalTime = 0;
            this._end = this._end.bind(this);
            if (options.useComputedStyle === true)
                this._useCompStyle = true;
            if (options.useFrames === true)
                this._useFrames = true;
            if (options.keepAlive)
                this.keepAlive = options.keepAlive;
            if (target) {
                this.add(target, duration, params, options);
            }
            else {
                this._paused = true;
            }
            if (!options.manualUpdate)
                ticker.add(this);
        }
        add(target, duration, params, options = {}) {
            if (options.useComputedStyle === void null) {
                options.useComputedStyle = this._useCompStyle;
            }
            if (options.useFrames === void null) {
                options.useFrames = this._useFrames;
            }
            if (Array.isArray(target) || target instanceof NodeList) {
                this._addList(target, duration, params, options);
            }
            else if (typeof target === "object") {
                this._add(target, duration, params, options);
            }
            else if (typeof target === "string") {
                let items = document.querySelectorAll(target);
                this._addList(items, duration, params, options);
            }
            else {
                throw new TypeError("Unknown target.");
            }
            return this;
        }
        init() {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].init();
            }
        }
        setStatus(value) {
            this.status = value;
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].setStatus(value);
            }
            return this;
        }
        update(dt) {
            if (this.status < 1 || this._paused)
                return;
            for (let i = this._items.length - 1; i >= 0; i--) {
                this._items[i].update(dt);
            }
            this._callProgress();
            this._callUpdate();
            this._totalTime += dt;
        }
        to(dur, params, options) {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].to(dur, params, options);
            }
            return this;
        }
        pause() {
            this._paused = true;
            return this;
        }
        play() {
            this._paused = false;
            return this;
        }
        wait(time) {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].wait(time);
            }
            return this;
        }
        repeat(times, reverse) {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].repeat(times, reverse);
            }
            return this;
        }
        call(func, scope, params) {
            this._items[this._items.length - 1].call(func, scope, params);
            return this;
        }
        get totalDuration() {
            if (this._totalDuration === 0) {
                let t = 0;
                for (let i = 0; i < this._items.length; i++) {
                    if (this._items[i].totalDuration > t)
                        t = this._items[i].totalDuration;
                }
                this._totalDuration = t;
            }
            return this._totalDuration;
        }
        get percentComplete() {
            let v = Math.round(this._totalTime / this.totalDuration * 100);
            if (v > 100)
                v = 100;
            return v;
        }
        get position() {
            let p = 0;
            let l = this._items.length;
            for (let i = 0; i < l; i++) {
                p += this._items[i].position;
            }
            return Math.round(p / l);
        }
        set position(value) {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].position = value;
            }
        }
        reverse() {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].reverse();
            }
        }
        remove() {
            this._listeners = {};
            this.status = -1;
            this.ticker = null;
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].setStatus(-1);
            }
        }
        _end() {
            this._numEnded++;
            if (this._numEnded === this._items.length) {
                this._callEnd();
                if (!this.keepAlive)
                    this._listeners = {};
                this._numEnded = 0;
            }
        }
        _addList(list, dur, params, options) {
            for (let i = 0; i < list.length; i++) {
                if (options.steppedDelay !== void 0) {
                    if (options.steppedDelay > 0) {
                        options.startDelay = options.steppedDelay * i;
                    }
                    else {
                        options.startDelay = (list.length - i) * (options.steppedDelay * -1);
                    }
                }
                this._add(list[i], dur, params, options);
            }
        }
        _add(targ, dur, params, options) {
            let t = new Tween(targ, dur, params, options);
            t.on("end", this._end);
            this._items.push(t);
        }
    }

    class Sequence extends BaseTween {
        constructor(ticker, repeat, reverse) {
            super();
            this.ticker = ticker;
            this._items = [];
            this._paused = false;
            this._totalDuration = 0;
            this._totalTime = 0;
            this._repeat = 0;
            this._repeatCount = 0;
            this._reverse = false;
            this._dir = 1;
            this._pos = 0;
            this._repeat = repeat;
            this._end = this._end.bind(this);
            ticker.add(this);
        }
        add(target, duration, params, options = {}) {
            if (options.useComputedStyle === void null) {
                options.useComputedStyle = this._useCompStyle;
            }
            if (options.useFrames === void null) {
                options.useFrames = this._useFrames;
            }
            if (target instanceof Group) {
                target.on("end", this._end);
                this._items.push(target);
            }
            else if (Array.isArray(target) || target instanceof NodeList) {
                this._addList(target, duration, params, options);
            }
            else if (typeof target === "object") {
                this._add(target, duration, params, options);
            }
            else if (typeof target === "string") {
                let items = document.querySelectorAll(target);
                this._addList(items, duration, params, options);
            }
            else {
                throw new TypeError("Unknown target.");
            }
            return this;
        }
        update(dt) {
            if (this.status < 1 || this._paused || this._items.length === 0)
                return;
            this._items[this._pos].update(dt);
            this._callProgress();
            this._callUpdate();
            this._totalTime += dt;
        }
        to(dur, params, options) {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].to(dur, params, options);
            }
            return this;
        }
        pause() {
            this._paused = true;
            return this;
        }
        play() {
            this._paused = false;
            return this;
        }
        wait(time) {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].wait(time);
            }
            return this;
        }
        repeat(times, reverse) {
            this._repeat = times;
            this._reverse = reverse;
            return this;
        }
        call(func, scope, params) {
            this._items[this._items.length - 1].call(func, scope, params);
            return this;
        }
        get totalDuration() {
            if (this._totalDuration === 0) {
                for (let i = 0; i < this._items.length; i++) {
                    this._totalDuration += this._items[i].totalDuration;
                }
                this._totalDuration += this._totalDuration * this._repeat;
            }
            return this._totalDuration;
        }
        get percentComplete() {
            let v = Math.round(this._totalTime / this.totalDuration * 100);
            if (v > 100)
                v = 100;
            return v;
        }
        get position() {
            let p = 0;
            let l = this._items.length;
            for (let i = 0; i < l; i++) {
                p += this._items[i].position;
            }
            return Math.round(p / l);
        }
        set position(value) {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].position = value;
            }
        }
        remove() {
            this._listeners = {};
            this.status = -1;
            this.ticker = null;
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].setStatus(-1);
            }
        }
        _end() {
            let endLoop = this._dir > 0 ? this._pos >= this._items.length - 1 : this._pos === 0;
            let next = this._dir > 0 ? 1 : -1;
            if (!endLoop) {
                this._pos += next;
                this._items[this._pos].init();
            }
            else {
                if (this._repeat === 0 || this._repeatCount >= this._repeat) {
                    this._callEnd();
                }
                else {
                    if (this._reverse) {
                        this._dir *= -1;
                        this._reverseItems();
                    }
                    else {
                        this._reset();
                        this._pos = 0;
                    }
                    this._repeatCount++;
                }
            }
        }
        _addList(list, dur, params, options) {
            for (let i = 0; i < list.length; i++) {
                if (options.steppedDelay !== void 0) {
                    if (options.steppedDelay > 0) {
                        options.startDelay = options.steppedDelay * i;
                    }
                    else {
                        options.startDelay = (list.length - i) * (options.steppedDelay * -1);
                    }
                }
                this._add(list[i], dur, params, options);
            }
        }
        _add(targ, dur, params, options) {
            options.keepAlive = true;
            if (this._items.length !== 0)
                options.status = 0;
            let t = new Tween(targ, dur, params, options);
            t.on("end", this._end);
            this._items.push(t);
        }
        _reset() {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].reset();
                this._items[i].setStatus(1);
            }
        }
        _reverseItems() {
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].reverse();
                this._items[i].setStatus(1);
            }
        }
    }

    class Glide {
        static init() {
            Glide._ticker = new Ticker();
            Glide._ticker.start();
            Glide._hasCssTom = !!(window.CSS && window.CSS.number);
        }
        static to(target, duration, props, options = {}) {
            if (options.useComputedStyle === void null) {
                options.useComputedStyle = Glide._useCompStyle;
            }
            if (options.useFrames === void null) {
                options.useFrames = Glide._useFrames;
            }
            if (Array.isArray(target) || target instanceof NodeList) {
                return new Group(Glide._ticker, target, duration, props, options);
            }
            else if (typeof target === "object") {
                return Glide._add(target, duration, props, options);
            }
            else if (typeof target === "string") {
                return new Group(Glide._ticker, target, duration, props, options);
            }
            throw new TypeError("Unknown target.");
        }
        static set useComputedStyle(value) {
            Glide._useCompStyle = value;
        }
        static set useFrames(value) {
            Glide._useFrames = value;
            Glide._ticker.useFrames = value;
        }
        static set autoUpdate(value) {
            if (!value)
                Glide._ticker.stop();
            Glide._autoUpd = value;
        }
        static set fps(value) {
            Glide._ticker.fps = value;
        }
        static get fps() {
            return Glide._ticker.fps;
        }
        static update(deltaTime) {
            Glide._ticker.update(deltaTime);
        }
        static getTweens(target) {
            let arr = [];
            let items = Glide._ticker.items;
            for (let i = 0; i < items.length; i++) {
                let obj = items[i];
                if (obj.target && obj.target === target) {
                    arr.push(obj);
                }
            }
            return arr;
        }
        static remove(target) {
            let items = Glide.getTweens(target);
            for (let i = 0; i < items.length; i++) {
                items[i].remove();
            }
        }
        static removeAll() {
            Glide._ticker.removeAll();
        }
        static Group() {
            let g = new Group(Glide._ticker, null, 0, null, { useComputedStyle: Glide._useCompStyle, useFrames: Glide._useFrames });
            Glide._groups.push(g);
            return g;
        }
        static removeGroup(group) {
            let ind = Glide._groups.indexOf(group);
            if (ind > -1) {
                Glide._groups[ind].remove();
                Glide._groups.splice(ind, 1);
            }
        }
        static removeAllGroups() {
            for (let i = 0; i < Glide._groups.length; i++) {
                Glide._groups[i].remove();
            }
            Glide._groups = [];
        }
        static Sequence(repeat = 0, reverse = false) {
            let s = new Sequence(Glide._ticker, repeat, reverse);
            s.useComputedStyle = Glide._useCompStyle;
            s.useFrames = Glide._useFrames;
            Glide._seqs.push(s);
            return s;
        }
        static removeSequence(sequence) {
            let ind = Glide._seqs.indexOf(sequence);
            if (ind > -1) {
                Glide._seqs[ind].remove();
                Glide._seqs.splice(ind, 1);
            }
        }
        static removeAllSequences() {
            for (let i = 0; i < Glide._seqs.length; i++) {
                Glide._seqs[i].remove();
            }
            Glide._seqs = [];
        }
        static _add(target, duration, props, options = {}) {
            if (options.removeExisting === true) {
                Glide.remove(target);
            }
            if (options.cssTom === void 0)
                options.cssTom = Glide._hasCssTom;
            let t = new Tween(target, duration, props, options);
            if (!options.manualUpdate)
                Glide._ticker.add(t);
            return t;
        }
    }
    Glide.Ease = Func;
    Glide._useCompStyle = true;
    Glide._useFrames = false;
    Glide._autoUpd = true;
    Glide._groups = [];
    Glide._seqs = [];
    Glide.init();

    return Glide;

})));
