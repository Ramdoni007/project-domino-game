! function() {
    "use strict";

    function e() {
        try {
            "undefined" != typeof AudioContext ? n = new AudioContext : "undefined" != typeof webkitAudioContext ? n = new webkitAudioContext : o = !1
        } catch (e) {
            o = !1
        }
        if (!o)
            if ("undefined" != typeof Audio) try {
                new Audio
            } catch (e) {
                t = !0
            } else t = !0
    }
    var n = null,
        o = !0,
        t = !1;
    if (e(), o) {
        var r = "undefined" == typeof n.createGain ? n.createGainNode() : n.createGain();
        r.gain.value = 1, r.connect(n.destination)
    }
    var i = function() {
        this.init()
    };
    i.prototype = {
        init: function() {
            var e = this || a;
            return e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e.iOSAutoEnable = !0, e.noAudio = t, e.usingWebAudio = o, e.ctx = n, t || e._setupCodecs(), e
        },
        volume: function(e) {
            var n = this || a;
            if (e = parseFloat(e), "undefined" != typeof e && e >= 0 && 1 >= e) {
                n._volume = e, o && (r.gain.value = e);
                for (var t = 0; t < n._howls.length; t++)
                    if (!n._howls[t]._webAudio)
                        for (var i = n._howls[t]._getSoundIds(), d = 0; d < i.length; d++) {
                            var u = n._howls[t]._soundById(i[d]);
                            u && u._node && (u._node.volume = u._volume * e)
                        }
                return n
            }
            return n._volume
        },
        mute: function(e) {
            var n = this || a;
            n._muted = e, o && (r.gain.value = e ? 0 : n._volume);
            for (var t = 0; t < n._howls.length; t++)
                if (!n._howls[t]._webAudio)
                    for (var i = n._howls[t]._getSoundIds(), d = 0; d < i.length; d++) {
                        var u = n._howls[t]._soundById(i[d]);
                        u && u._node && (u._node.muted = !!e || u._muted)
                    }
            return n
        },
        codecs: function(e) {
            return (this || a)._codecs[e]
        },
        _setupCodecs: function() {
            var e = this || a,
                n = new Audio,
                o = n.canPlayType("audio/mpeg;").replace(/^no$/, "");
            return e._codecs = {
                mp3: !(!o && !n.canPlayType("audio/mp3;").replace(/^no$/, "")),
                mpeg: !!o,
                opus: !!n.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!n.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                aac: !!n.canPlayType("audio/aac;").replace(/^no$/, ""),
                m4a: !!(n.canPlayType("audio/x-m4a;") || n.canPlayType("audio/m4a;") || n.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(n.canPlayType("audio/x-mp4;") || n.canPlayType("audio/mp4;") || n.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                webm: !!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
            }, e
        },
        _enableiOSAudio: function() {
            var e = this || a;
            if (!n || !e._iOSEnabled && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                e._iOSEnabled = !1;
                var o = function() {
                    var t = n.createBuffer(1, 1, 22050),
                        r = n.createBufferSource();
                    r.buffer = t, r.connect(n.destination), "undefined" == typeof r.start ? r.noteOn(0) : r.start(0), setTimeout(function() {
                        (r.playbackState === r.PLAYING_STATE || r.playbackState === r.FINISHED_STATE) && (e._iOSEnabled = !0, e.iOSAutoEnable = !1, document.removeEventListener("touchstart", o, !1))
                    }, 0)
                };
                return document.addEventListener("touchstart", o, !1), e
            }
        }
    };
    var a = new i,
        d = function(e) {
            var n = this;
            return e.src && 0 !== e.src.length ? void n.init(e) : void console.error("An array of source files must be passed with any new Howl.")
        };
    d.prototype = {
        init: function(e) {
            var t = this;
            return t._autoplay = e.autoplay || !1, t._ext = e.ext || null, t._html5 = e.html5 || !1, t._muted = e.mute || !1, t._loop = e.loop || !1, t._pool = e.pool || 5, t._preload = "boolean" != typeof e.preload || e.preload, t._rate = e.rate || 1, t._sprite = e.sprite || {}, t._src = "string" != typeof e.src ? e.src : [e.src], t._volume = void 0 !== e.volume ? e.volume : 1, t._duration = 0, t._loaded = !1, t._sounds = [], t._endTimers = {}, t._onend = e.onend ? [{
                fn: e.onend
            }] : [], t._onfaded = e.onfaded ? [{
                fn: e.onfaded
            }] : [], t._onload = e.onload ? [{
                fn: e.onload
            }] : [], t._onloaderror = e.onloaderror ? [{
                fn: e.onloaderror
            }] : [], t._onpause = e.onpause ? [{
                fn: e.onpause
            }] : [], t._onplay = e.onplay ? [{
                fn: e.onplay
            }] : [], t._webAudio = o && !t._html5, "undefined" != typeof n && n && a.iOSAutoEnable && a._enableiOSAudio(), a._howls.push(t), t._preload && t.load(), t
        },
        load: function() {
            var e = this,
                n = null;
            if (t) return void e._emit("loaderror");
            "string" == typeof e._src && (e._src = [e._src]);
            for (var o = 0; o < e._src.length; o++) {
                var r, i;
                if (e._ext && e._ext[o] ? r = e._ext[o] : (i = e._src[o], r = /^data:audio\/([^;,]+);/i.exec(i), r || (r = /\.([^.]+)$/.exec(i.split("?", 1)[0])), r && (r = r[1].toLowerCase())), a.codecs(r)) {
                    n = e._src[o];
                    break
                }
            }
            return n ? (e._src = n, new u(e), e._webAudio && s(e), e) : void e._emit("loaderror")
        },
        play: function(e) {
            var o = this,
                t = arguments,
                r = null;
            if ("number" == typeof e) r = e, e = null;
            else if ("undefined" == typeof e) {
                e = "__default";
                for (var i = 0, d = 0; d < o._sounds.length; d++) o._sounds[d]._paused && !o._sounds[d]._ended && (i++, r = o._sounds[d]._id);
                1 === i ? e = null : r = null
            }
            var u = r ? o._soundById(r) : o._inactiveSound();
            if (!u) return null;
            if (r && !e && (e = u._sprite || "__default"), !o._loaded && !o._sprite[e]) return o.once("load", function() {
                o.play(o._soundById(u._id) ? u._id : void 0)
            }), u._id;
            if (r && !u._paused) return u._id;
            var _ = u._seek > 0 ? u._seek : o._sprite[e][0] / 1e3,
                s = (o._sprite[e][0] + o._sprite[e][1]) / 1e3 - _,
                l = function() {
                    var t = !(!u._loop && !o._sprite[e][2]);
                    o._emit("end", u._id), !o._webAudio && t && o.stop(u._id).play(u._id), o._webAudio && t && (o._emit("play", u._id), u._seek = u._start || 0, u._playStart = n.currentTime, o._endTimers[u._id] = setTimeout(l, 1e3 * (u._stop - u._start) / Math.abs(o._rate))), o._webAudio && !t && (u._paused = !0, u._ended = !0, u._seek = u._start || 0, o._clearTimer(u._id), u._node.bufferSource = null), o._webAudio || t || o.stop(u._id)
                };
            o._endTimers[u._id] = setTimeout(l, 1e3 * s / Math.abs(o._rate)), u._paused = !1, u._ended = !1, u._sprite = e, u._seek = _, u._start = o._sprite[e][0] / 1e3, u._stop = (o._sprite[e][0] + o._sprite[e][1]) / 1e3, u._loop = !(!u._loop && !o._sprite[e][2]);
            var f = u._node;
            if (o._webAudio) {
                var c = function() {
                    o._refreshBuffer(u);
                    var e = u._muted || o._muted ? 0 : u._volume * a.volume();
                    f.gain.setValueAtTime(e, n.currentTime), u._playStart = n.currentTime, "undefined" == typeof f.bufferSource.start ? u._loop ? f.bufferSource.noteGrainOn(0, _, 86400) : f.bufferSource.noteGrainOn(0, _, s) : u._loop ? f.bufferSource.start(0, _, 86400) : f.bufferSource.start(0, _, s), o._endTimers[u._id] || (o._endTimers[u._id] = setTimeout(l, 1e3 * s / Math.abs(o._rate))), t[1] || setTimeout(function() {
                        o._emit("play", u._id)
                    }, 0)
                };
                o._loaded ? c() : (o.once("load", c), o._clearTimer(u._id))
            } else {
                var p = function() {
                    f.currentTime = _, f.muted = u._muted || o._muted || a._muted || f.muted, f.volume = u._volume * a.volume(), f.playbackRate = o._rate, setTimeout(function() {
                        f.play(), t[1] || o._emit("play", u._id)
                    }, 0)
                };
                if (4 === f.readyState || !f.readyState && navigator.isCocoonJS) p();
                else {
                    var y = function() {
                        o._endTimers[u._id] = setTimeout(l, 1e3 * s / Math.abs(o._rate)), p(), f.removeEventListener("canplaythrough", y, !1)
                    };
                    f.addEventListener("canplaythrough", y, !1), o._clearTimer(u._id)
                }
            }
            return u._id
        },
        pause: function(e) {
            var n = this;
            if (!n._loaded) return n.once("play", function() {
                n.pause(e)
            }), n;
            for (var o = n._getSoundIds(e), t = 0; t < o.length; t++) {
                n._clearTimer(o[t]);
                var r = n._soundById(o[t]);
                if (r && !r._paused) {
                    if (r._seek = n.seek(o[t]), r._paused = !0, n._webAudio) {
                        if (!r._node.bufferSource) return n;
                        "undefined" == typeof r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), r._node.bufferSource = null
                    } else isNaN(r._node.duration) || r._node.pause();
                    arguments[1] || n._emit("pause", r._id)
                }
            }
            return n
        },
        stop: function(e) {
            var n = this;
            if (!n._loaded) return "undefined" != typeof n._sounds[0]._sprite && n.once("play", function() {
                n.stop(e)
            }), n;
            for (var o = n._getSoundIds(e), t = 0; t < o.length; t++) {
                n._clearTimer(o[t]);
                var r = n._soundById(o[t]);
                if (r && !r._paused)
                    if (r._seek = r._start || 0, r._paused = !0, r._ended = !0, n._webAudio && r._node) {
                        if (!r._node.bufferSource) return n;
                        "undefined" == typeof r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), r._node.bufferSource = null
                    } else r._node && !isNaN(r._node.duration) && (r._node.pause(), r._node.currentTime = r._start || 0)
            }
            return n
        },
        mute: function(e, o) {
            var t = this;
            if (!t._loaded) return t.once("play", function() {
                t.mute(e, o)
            }), t;
            if ("undefined" == typeof o) {
                if ("boolean" != typeof e) return t._muted;
                t._muted = e
            }
            for (var r = t._getSoundIds(o), i = 0; i < r.length; i++) {
                var d = t._soundById(r[i]);
                d && (d._muted = e, t._webAudio && d._node ? d._node.gain.setValueAtTime(e ? 0 : d._volume * a.volume(), n.currentTime) : d._node && (d._node.muted = !!a._muted || e))
            }
            return t
        },
        volume: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) return t._volume;
            if (1 === r.length) {
                var i = t._getSoundIds(),
                    d = i.indexOf(r[0]);
                d >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            var u;
            if (!("undefined" != typeof e && e >= 0 && 1 >= e)) return u = o ? t._soundById(o) : t._sounds[0], u ? u._volume : 0;
            if (!t._loaded) return t.once("play", function() {
                t.volume.apply(t, r)
            }), t;
            "undefined" == typeof o && (t._volume = e), o = t._getSoundIds(o);
            for (var _ = 0; _ < o.length; _++) u = t._soundById(o[_]), u && (u._volume = e, t._webAudio && u._node ? u._node.gain.setValueAtTime(e * a.volume(), n.currentTime) : u._node && (u._node.volume = e * a.volume()));
            return t
        },
        fade: function(e, o, t, r) {
            var i = this;
            if (!i._loaded) return i.once("play", function() {
                i.fade(e, o, t, r)
            }), i;
            i.volume(e, r);
            for (var a = i._getSoundIds(r), d = 0; d < a.length; d++) {
                var u = i._soundById(a[d]);
                if (u)
                    if (i._webAudio) {
                        var _ = n.currentTime,
                            s = _ + t / 1e3;
                        u._volume = e, u._node.gain.setValueAtTime(e, _), u._node.gain.linearRampToValueAtTime(o, s), setTimeout(function(e, t) {
                            setTimeout(function() {
                                t._volume = o, i._emit("faded", e)
                            }, s - n.currentTime > 0 ? Math.ceil(1e3 * (s - n.currentTime)) : 0)
                        }.bind(i, a[d], u), t)
                    } else {
                        var l = Math.abs(e - o),
                            f = e > o ? "out" : "in",
                            c = l / .01,
                            p = t / c;
                        ! function() {
                            var n = e,
                                t = setInterval(function(e) {
                                    n += "in" === f ? .01 : -.01, n = Math.max(0, n), n = Math.min(1, n), n = Math.round(100 * n) / 100, i.volume(n, e), n === o && (clearInterval(t), i._emit("faded", e))
                                }.bind(i, a[d]), p)
                        }()
                    }
            }
            return i
        },
        loop: function() {
            var e, n, o, t = this,
                r = arguments;
            if (0 === r.length) return t._loop;
            if (1 === r.length) {
                if ("boolean" != typeof r[0]) return o = t._soundById(parseInt(r[0], 10)), !!o && o._loop;
                e = r[0], t._loop = e
            } else 2 === r.length && (e = r[0], n = parseInt(r[1], 10));
            for (var i = t._getSoundIds(n), a = 0; a < i.length; a++) o = t._soundById(i[a]), o && (o._loop = e, t._webAudio && o._node && (o._node.bufferSource.loop = e));
            return t
        },
        seek: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) o = t._sounds[0]._id;
            else if (1 === r.length) {
                var i = t._getSoundIds(),
                    a = i.indexOf(r[0]);
                a >= 0 ? o = parseInt(r[0], 10) : (o = t._sounds[0]._id, e = parseFloat(r[0]))
            } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            if ("undefined" == typeof o) return t;
            if (!t._loaded) return t.once("load", function() {
                t.seek.apply(t, r)
            }), t;
            var d = t._soundById(o);
            if (d) {
                if (!(e >= 0)) return t._webAudio ? d._seek + (t.playing(o) ? n.currentTime - d._playStart : 0) : d._node.currentTime;
                var u = t.playing(o);
                u && t.pause(o, !0), d._seek = e, t._clearTimer(o), u && t.play(o, !0)
            }
            return t
        },
        playing: function(e) {
            var n = this,
                o = n._soundById(e) || n._sounds[0];
            return !!o && !o._paused
        },
        duration: function() {
            return this._duration
        },
        unload: function() {
            for (var e = this, n = e._sounds, o = 0; o < n.length; o++) {
                n[o]._paused || (e.stop(n[o]._id), e._emit("end", n[o]._id)), e._webAudio || (n[o]._node.src = "", n[o]._node.removeEventListener("error", n[o]._errorFn, !1), n[o]._node.removeEventListener("canplaythrough", n[o]._loadFn, !1)), delete n[o]._node, e._clearTimer(n[o]._id);
                var t = a._howls.indexOf(e);
                t >= 0 && a._howls.splice(t, 1)
            }
            return _ && delete _[e._src], e = null, null
        },
        on: function(e, n, o) {
            var t = this,
                r = t["_on" + e];
            return "function" == typeof n && r.push({
                id: o,
                fn: n
            }), t
        },
        off: function(e, n, o) {
            var t = this,
                r = t["_on" + e];
            if (n) {
                for (var i = 0; i < r.length; i++)
                    if (n === r[i].fn && o === r[i].id) {
                        r.splice(i, 1);
                        break
                    }
            } else r = [];
            return t
        },
        once: function(e, n, o) {
            var t = this,
                r = function() {
                    n.apply(t, arguments), t.off(e, r, o)
                };
            return t.on(e, r, o), t
        },
        _emit: function(e, n, o) {
            for (var t = this, r = t["_on" + e], i = 0; i < r.length; i++) r[i].id && r[i].id !== n || setTimeout(function(e) {
                e.call(this, n, o)
            }.bind(t, r[i].fn), 0);
            return t
        },
        _clearTimer: function(e) {
            var n = this;
            return n._endTimers[e] && (clearTimeout(n._endTimers[e]), delete n._endTimers[e]), n
        },
        _soundById: function(e) {
            for (var n = this, o = 0; o < n._sounds.length; o++)
                if (e === n._sounds[o]._id) return n._sounds[o];
            return null
        },
        _inactiveSound: function() {
            var e = this;
            e._drain();
            for (var n = 0; n < e._sounds.length; n++)
                if (e._sounds[n]._ended) return e._sounds[n].reset();
            return new u(e)
        },
        _drain: function() {
            var e = this,
                n = e._pool,
                o = 0,
                t = 0;
            if (!(e._sounds.length < n)) {
                for (t = 0; t < e._sounds.length; t++) e._sounds[t]._ended && o++;
                for (t = e._sounds.length - 1; t >= 0; t--) {
                    if (n >= o) return;
                    e._sounds[t]._ended && (e._webAudio && e._sounds[t]._node && e._sounds[t]._node.disconnect(0), e._sounds.splice(t, 1), o--)
                }
            }
        },
        _getSoundIds: function(e) {
            var n = this;
            if ("undefined" == typeof e) {
                for (var o = [], t = 0; t < n._sounds.length; t++) o.push(n._sounds[t]._id);
                return o
            }
            return [e]
        },
        _refreshBuffer: function(e) {
            var o = this;
            return e._node.bufferSource = n.createBufferSource(), e._node.bufferSource.buffer = _[o._src], e._node.bufferSource.connect(e._panner ? e._panner : e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.value = o._rate, o
        }
    };
    var u = function(e) {
        this._parent = e, this.init()
    };
    if (u.prototype = {
            init: function() {
                var e = this,
                    n = e._parent;
                return e._muted = n._muted, e._loop = n._loop, e._volume = n._volume, e._muted = n._muted, e._seek = 0, e._paused = !0, e._ended = !0, e._id = Math.round(Date.now() * Math.random()), n._sounds.push(e), e.create(), e
            },
            create: function() {
                var e = this,
                    o = e._parent,
                    t = a._muted || e._muted || e._parent._muted ? 0 : e._volume * a.volume();
                return o._webAudio ? (e._node = "undefined" == typeof n.createGain ? n.createGainNode() : n.createGain(), e._node.gain.setValueAtTime(t, n.currentTime), e._node.paused = !0, e._node.connect(r)) : (e._node = new Audio, e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener("canplaythrough", e._loadFn, !1), e._node.src = o._src, e._node.preload = "auto", e._node.volume = t, e._node.load()), e
            },
            reset: function() {
                var e = this,
                    n = e._parent;
                return e._muted = n._muted, e._loop = n._loop, e._volume = n._volume, e._muted = n._muted, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = null, e._id = Math.round(Date.now() * Math.random()), e
            },
            _errorListener: function() {
                var e = this;
                e._node.error && 4 === e._node.error.code && (a.noAudio = !0), e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorListener, !1)
            },
            _loadListener: function() {
                var e = this,
                    n = e._parent;
                n._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(n._sprite).length && (n._sprite = {
                    __default: [0, 1e3 * n._duration]
                }), n._loaded || (n._loaded = !0, n._emit("load")), n._autoplay && n.play(), e._node.removeEventListener("canplaythrough", e._loadFn, !1)
            }
        }, o) var _ = {},
        s = function(e) {
            var n = e._src;
            if (_[n]) return e._duration = _[n].duration, void c(e);
            if (/^data:[^;]+;base64,/.test(n)) {
                window.atob = window.atob || function(e) {
                    for (var n, o, t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", r = String(e).replace(/=+$/, ""), i = 0, a = 0, d = ""; o = r.charAt(a++); ~o && (n = i % 4 ? 64 * n + o : o, i++ % 4) ? d += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0) o = t.indexOf(o);
                    return d
                };
                for (var o = atob(n.split(",")[1]), t = new Uint8Array(o.length), r = 0; r < o.length; ++r) t[r] = o.charCodeAt(r);
                f(t.buffer, e)
            } else {
                var i = new XMLHttpRequest;
                i.open("GET", n, !0), i.responseType = "arraybuffer", i.onload = function() {
                    f(i.response, e)
                }, i.onerror = function() {
                    e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete _[n], e.load())
                }, l(i)
            }
        },
        l = function(e) {
            try {
                e.send()
            } catch (n) {
                e.onerror()
            }
        },
        f = function(e, o) {
            n.decodeAudioData(e, function(e) {
                e && (_[o._src] = e, c(o, e))
            }, function() {
                o._emit("loaderror")
            })
        },
        c = function(e, n) {
            n && !e._duration && (e._duration = n.duration), 0 === Object.keys(e._sprite).length && (e._sprite = {
                __default: [0, 1e3 * e._duration]
            }), e._loaded || (e._loaded = !0, e._emit("load")), e._autoplay && e.play()
        };
    "function" == typeof define && define.amd && define("howler", function() {
        return {
            Howler: a,
            Howl: d
        }
    }), "undefined" != typeof exports && (exports.Howler = a, exports.Howl = d), "undefined" != typeof window && (window.HowlerGlobal = i, window.Howler = a, window.Howl = d, window.Sound = u)
}(), ! function() {
    "use strict";
    HowlerGlobal.prototype.init = function(e) {
        return function() {
            var n = this;
            return n._pos = [0, 0, 0], n._orientation = [0, 0, -1, 0, 1, 0], n._velocity = [0, 0, 0], n._listenerAttr = {
                dopplerFactor: 1,
                speedOfSound: 343.3
            }, e.call(this, o)
        }
    }(HowlerGlobal.prototype.init), HowlerGlobal.prototype.pos = function(e, n, o) {
        var t = this;
        return t.ctx && t.ctx.listener ? (n = "number" != typeof n ? t._pos[1] : n, o = "number" != typeof o ? t._pos[2] : o, "number" != typeof e ? t._pos : (t._pos = [e, n, o], t.ctx.listener.setPosition(t._pos[0], t._pos[1], t._pos[2]), t)) : t
    }, HowlerGlobal.prototype.orientation = function(e, n, o, t, r, i) {
        var a = this;
        if (!a.ctx || !a.ctx.listener) return a;
        var d = a._orientation;
        return n = "number" != typeof n ? d[1] : n, o = "number" != typeof o ? d[2] : o, t = "number" != typeof t ? d[3] : t, r = "number" != typeof r ? d[4] : r, i = "number" != typeof i ? d[5] : i, "number" != typeof e ? d : (a._orientation = [e, n, o, t, r, i], a.ctx.listener.setOrientation(d[0], d[1], d[2], d[3], d[4], d[5]), a)
    }, HowlerGlobal.prototype.velocity = function(e, n, o) {
        var t = this;
        return t.ctx && t.ctx.listener ? (n = "number" != typeof n ? t._velocity[1] : n, o = "number" != typeof o ? t._velocity[2] : o, "number" != typeof e ? t._velocity : (t._velocity = [e, n, o], t.ctx.listener.setVelocity(t._velocity[0], t._velocity[1], t._velocity[2]), t)) : t
    }, HowlerGlobal.prototype.listenerAttr = function(e) {
        var n = this;
        if (!n.ctx || !n.ctx.listener) return n;
        var o = n._listenerAttr;
        return e ? (n._listenerAttr = {
            dopplerFactor: "undefined" != typeof e.dopplerFactor ? e.dopplerFactor : o.dopplerFactor,
            speedOfSound: "undefined" != typeof e.speedOfSound ? e.speedOfSound : o.speedOfSound
        }, n.ctx.listener.dopplerFactor = o.dopplerFactor, n.ctx.listener.speedOfSound = o.speedOfSound, n) : o
    }, Howl.prototype.init = function(e) {
        return function(n) {
            var o = this;
            return o._orientation = n.orientation || [1, 0, 0], o._pos = n.pos || null, o._velocity = n.velocity || [0, 0, 0], o._pannerAttr = {
                coneInnerAngle: "undefined" != typeof n.coneInnerAngle ? n.coneInnerAngle : 360,
                coneOUterAngle: "undefined" != typeof n.coneOUterAngle ? n.coneOUterAngle : 360,
                coneOuterGain: "undefined" != typeof n.coneOuterGain ? n.coneOuterGain : 0,
                distanceModel: "undefined" != typeof n.distanceModel ? n.distanceModel : "inverse",
                maxDistance: "undefined" != typeof n.maxDistance ? n.maxDistance : 1e4,
                panningModel: "undefined" != typeof n.panningModel ? n.panningModel : "HRTF",
                refDistance: "undefined" != typeof n.refDistance ? n.refDistance : 1,
                rolloffFactor: "undefined" != typeof n.rolloffFactor ? n.rolloffFactor : 1
            }, e.call(this, n)
        }
    }(Howl.prototype.init), Howl.prototype.pos = function(n, o, t, r) {
        var i = this;
        if (!i._webAudio) return i;
        if (!i._loaded) return i.once("play", function() {
            i.pos(n, o, t, r)
        }), i;
        if (o = "number" != typeof o ? 0 : o, t = "number" != typeof t ? -.5 : t, "undefined" == typeof r) {
            if ("number" != typeof n) return i._pos;
            i._pos = [n, o, t]
        }
        for (var a = i._getSoundIds(r), d = 0; d < a.length; d++) {
            var u = i._soundById(a[d]);
            if (u) {
                if ("number" != typeof n) return u._pos;
                u._pos = [n, o, t], u._node && (u._panner || e(u), u._panner.setPosition(n, o, t))
            }
        }
        return i
    }, Howl.prototype.orientation = function(n, o, t, r) {
        var i = this;
        if (!i._webAudio) return i;
        if (!i._loaded) return i.once("play", function() {
            i.orientation(n, o, t, r)
        }), i;
        if (o = "number" != typeof o ? i._orientation[1] : o, t = "number" != typeof t ? i._orientation[1] : t, "undefined" == typeof r) {
            if ("number" != typeof n) return i._orientation;
            i._orientation = [n, o, t]
        }
        for (var a = i._getSoundIds(r), d = 0; d < a.length; d++) {
            var u = i._soundById(a[d]);
            if (u) {
                if ("number" != typeof n) return u._orientation;
                u._orientation = [n, o, t], u._node && (u._panner || e(u), u._panner.setOrientation(n, o, t))
            }
        }
        return i
    }, Howl.prototype.velocity = function(n, o, t, r) {
        var i = this;
        if (!i._webAudio) return i;
        if (!i._loaded) return i.once("play", function() {
            i.velocity(n, o, t, r)
        }), i;
        if (o = "number" != typeof o ? i._velocity[1] : o, t = "number" != typeof t ? i._velocity[1] : t, "undefined" == typeof r) {
            if ("number" != typeof n) return i._velocity;
            i._velocity = [n, o, t]
        }
        for (var a = i._getSoundIds(r), d = 0; d < a.length; d++) {
            var u = i._soundById(a[d]);
            if (u) {
                if ("number" != typeof n) return u._velocity;
                u._velocity = [n, o, t], u._node && (u._panner || e(u), u._panner.setVelocity(n, o, t))
            }
        }
        return i
    }, Howl.prototype.pannerAttr = function() {
        var n, o, t, r = this,
            i = arguments;
        if (!r._webAudio) return r;
        if (0 === i.length) return r._pannerAttr;
        if (1 === i.length) {
            if ("object" != typeof i[0]) return t = r._soundById(parseInt(i[0], 10)), t ? t._pannerAttr : r._pannerAttr;
            n = i[0], "undefined" == typeof o && (r._pannerAttr = {
                coneInnerAngle: "undefined" != typeof n.coneInnerAngle ? n.coneInnerAngle : r._coneInnerAngle,
                coneOUterAngle: "undefined" != typeof n.coneOUterAngle ? n.coneOUterAngle : r._coneOUterAngle,
                coneOuterGain: "undefined" != typeof n.coneOuterGain ? n.coneOuterGain : r._coneOuterGain,
                distanceModel: "undefined" != typeof n.distanceModel ? n.distanceModel : r._distanceModel,
                maxDistance: "undefined" != typeof n.maxDistance ? n.maxDistance : r._maxDistance,
                panningModel: "undefined" != typeof n.panningModel ? n.panningModel : r._panningModel,
                refDistance: "undefined" != typeof n.refDistance ? n.refDistance : r._refDistance,
                rolloffFactor: "undefined" != typeof n.rolloffFactor ? n.rolloffFactor : r._rolloffFactor
            })
        } else 2 === i.length && (n = i[0], o = parseInt(i[1], 10));
        for (var a = r._getSoundIds(o), d = 0; d < a.length; d++)
            if (t = r._soundById(a[d])) {
                var u = t._pannerAttr;
                u = {
                    coneInnerAngle: "undefined" != typeof n.coneInnerAngle ? n.coneInnerAngle : u.coneInnerAngle,
                    coneOUterAngle: "undefined" != typeof n.coneOUterAngle ? n.coneOUterAngle : u.coneOUterAngle,
                    coneOuterGain: "undefined" != typeof n.coneOuterGain ? n.coneOuterGain : u.coneOuterGain,
                    distanceModel: "undefined" != typeof n.distanceModel ? n.distanceModel : u.distanceModel,
                    maxDistance: "undefined" != typeof n.maxDistance ? n.maxDistance : u.maxDistance,
                    panningModel: "undefined" != typeof n.panningModel ? n.panningModel : u.panningModel,
                    refDistance: "undefined" != typeof n.refDistance ? n.refDistance : u.refDistance,
                    rolloffFactor: "undefined" != typeof n.rolloffFactor ? n.rolloffFactor : u.rolloffFactor
                };
                var _ = t._panner;
                _ ? (_.coneInnerAngle = u.coneInnerAngle, _.coneOUterAngle = u.coneOUterAngle, _.coneOuterGain = u.coneOuterGain, _.distanceModel = u.distanceModel, _.maxDistance = u.maxDistance, _.panningModel = u.panningModel, _.refDistance = u.refDistance, _.rolloffFactor = u.rolloffFactor) : (t._pos || (t._pos = r._pos || [0, 0, -.5]), e(t))
            }
        return r
    }, Sound.prototype.init = function(e) {
        return function() {
            var n = this,
                o = n._parent;
            n._orientation = o._orientation, n._pos = o._pos, n._velocity = o._velocity, n._pannerAttr = o._pannerAttr, e.call(this), n._pos && o.pos(n._pos[0], n._pos[1], n._pos[2], n._id)
        }
    }(Sound.prototype.init), Sound.prototype.reset = function(e) {
        return function() {
            var n = this,
                o = n._parent;
            return n._orientation = o._orientation, n._pos = o._pos, n._velocity = o._velocity, n._pannerAttr = o._pannerAttr, e.call(this)
        }
    }(Sound.prototype.reset);
    var e = function(e) {
        e._panner = Howler.ctx.createPanner(), e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle, e._panner.coneOUterAngle = e._pannerAttr.coneOUterAngle, e._panner.coneOuterGain = e._pannerAttr.coneOuterGain, e._panner.distanceModel = e._pannerAttr.distanceModel, e._panner.maxDistance = e._pannerAttr.maxDistance, e._panner.panningModel = e._pannerAttr.panningModel, e._panner.refDistance = e._pannerAttr.refDistance, e._panner.rolloffFactor = e._pannerAttr.rolloffFactor, e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]), e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2]), e._panner.setVelocity(e._velocity[0], e._velocity[1], e._velocity[2]), e._panner.connect(e._node), e._paused || e._parent.pause(e._id).play(e._id)
    }
}();

