(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('signalk-client-angular', ['exports', '@angular/core', '@angular/common/http', 'rxjs'], factory) :
    (global = global || self, factory(global['signalk-client-angular'] = {}, global.ng.core, global.ng.common.http, global.rxjs));
}(this, function (exports, core, http, rxjs) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /*
     * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
     * TimeUUID based on dates for range selections.
     * @see http://www.ietf.org/rfc/rfc4122.txt
     **/
    var   /*
     * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
     * TimeUUID based on dates for range selections.
     * @see http://www.ietf.org/rfc/rfc4122.txt
     **/
    UUID = /** @class */ (function () {
        function UUID() {
            this.limitUI04 = this.maxFromBits(4);
            this.limitUI06 = this.maxFromBits(6);
            this.limitUI08 = this.maxFromBits(8);
            this.limitUI12 = this.maxFromBits(12);
            this.limitUI14 = this.maxFromBits(14);
            this.limitUI16 = this.maxFromBits(16);
            this.limitUI32 = this.maxFromBits(32);
            this.limitUI40 = this.maxFromBits(40);
            this.limitUI48 = this.maxFromBits(48);
            this.create();
        }
        /**
         * @return {?}
         */
        UUID.prototype.toString = /**
         * @return {?}
         */
        function () { return this.hex; };
        /**
         * @return {?}
         */
        UUID.prototype.toURN = /**
         * @return {?}
         */
        function () { return 'urn:uuid:' + this.hex; };
        /**
         * @return {?}
         */
        UUID.prototype.toSignalK = /**
         * @return {?}
         */
        function () { return "urn:mrn:signalk:uuid:" + this.hex; };
        /**
         * @return {?}
         */
        UUID.prototype.toBytes = /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var parts = this.hex.split('-');
            /** @type {?} */
            var ints = [];
            /** @type {?} */
            var intPos = 0;
            for (var i = 0; i < parts.length; i++) {
                for (var j = 0; j < parts[i].length; j += 2) {
                    ints[intPos++] = parseInt(parts[i].substr(j, 2), 16);
                }
            }
            return ints;
        };
        /**
         * @private
         * @param {?} bits
         * @return {?}
         */
        UUID.prototype.maxFromBits = /**
         * @private
         * @param {?} bits
         * @return {?}
         */
        function (bits) { return Math.pow(2, bits); };
        /**
         * @private
         * @param {?} min
         * @param {?} max
         * @return {?}
         */
        UUID.prototype.getRandomInt = /**
         * @private
         * @param {?} min
         * @param {?} max
         * @return {?}
         */
        function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI04 = /**
         * @private
         * @return {?}
         */
        function () { return this.getRandomInt(0, this.limitUI04 - 1); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI06 = /**
         * @private
         * @return {?}
         */
        function () { return this.getRandomInt(0, this.limitUI06 - 1); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI08 = /**
         * @private
         * @return {?}
         */
        function () { return this.getRandomInt(0, this.limitUI08 - 1); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI12 = /**
         * @private
         * @return {?}
         */
        function () { return this.getRandomInt(0, this.limitUI12 - 1); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI14 = /**
         * @private
         * @return {?}
         */
        function () { return this.getRandomInt(0, this.limitUI14 - 1); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI16 = /**
         * @private
         * @return {?}
         */
        function () { return this.getRandomInt(0, this.limitUI16 - 1); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI32 = /**
         * @private
         * @return {?}
         */
        function () { return this.getRandomInt(0, this.limitUI32 - 1); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI40 = /**
         * @private
         * @return {?}
         */
        function () { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 40 - 30)) * (1 << 30); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.randomUI48 = /**
         * @private
         * @return {?}
         */
        function () { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30); };
        /**
         * @private
         * @return {?}
         */
        UUID.prototype.create = /**
         * @private
         * @return {?}
         */
        function () {
            this.fromParts(this.randomUI32(), this.randomUI16(), 0x4000 | this.randomUI12(), 0x80 | this.randomUI06(), this.randomUI08(), this.randomUI48());
        };
        /**
         * @private
         * @param {?} string
         * @param {?} length
         * @param {?=} z
         * @return {?}
         */
        UUID.prototype.paddedString = /**
         * @private
         * @param {?} string
         * @param {?} length
         * @param {?=} z
         * @return {?}
         */
        function (string, length, z) {
            if (z === void 0) { z = null; }
            string = String(string);
            z = (!z) ? '0' : z;
            /** @type {?} */
            var i = length - string.length;
            for (; i > 0; i >>>= 1, z += z) {
                if (i & 1) {
                    string = z + string;
                }
            }
            return string;
        };
        /**
         * @private
         * @template THIS
         * @this {THIS}
         * @param {?} timeLow
         * @param {?} timeMid
         * @param {?} timeHiAndVersion
         * @param {?} clockSeqHiAndReserved
         * @param {?} clockSeqLow
         * @param {?} node
         * @return {THIS}
         */
        UUID.prototype.fromParts = /**
         * @private
         * @template THIS
         * @this {THIS}
         * @param {?} timeLow
         * @param {?} timeMid
         * @param {?} timeHiAndVersion
         * @param {?} clockSeqHiAndReserved
         * @param {?} clockSeqLow
         * @param {?} node
         * @return {THIS}
         */
        function (timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
            (/** @type {?} */ (this)).version = (timeHiAndVersion >> 12) & 0xF;
            (/** @type {?} */ (this)).hex = (/** @type {?} */ (this)).paddedString(timeLow.toString(16), 8)
                + '-'
                + (/** @type {?} */ (this)).paddedString(timeMid.toString(16), 4)
                + '-'
                + (/** @type {?} */ (this)).paddedString(timeHiAndVersion.toString(16), 4)
                + '-'
                + (/** @type {?} */ (this)).paddedString(clockSeqHiAndReserved.toString(16), 2)
                + (/** @type {?} */ (this)).paddedString(clockSeqLow.toString(16), 2)
                + '-'
                + (/** @type {?} */ (this)).paddedString(node.toString(16), 12);
            return (/** @type {?} */ (this));
        };
        return UUID;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // ** Path utilities
    var   
    // ** Path utilities
    Path = /** @class */ (function () {
        function Path() {
        }
        // ** transform dot notation to slash
        // ** transform dot notation to slash
        /**
         * @param {?} path
         * @return {?}
         */
        Path.dotToSlash = 
        // ** transform dot notation to slash
        /**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            /** @type {?} */
            var p = path.split('?');
            if (p[0].indexOf('.') != -1) {
                p[0] = p[0].split('.').join('/');
            }
            return p.join('?');
        };
        // ** parse context to valid Signal K path
        // ** parse context to valid Signal K path
        /**
         * @param {?} context
         * @return {?}
         */
        Path.contextToPath = 
        // ** parse context to valid Signal K path
        /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            /** @type {?} */
            var res = (context == 'self') ? 'vessels.self' : context;
            return res.split('.').join('/');
        };
        return Path;
    }());
    // ** Message templates **
    var   
    // ** Message templates **
    Message = /** @class */ (function () {
        function Message() {
        }
        // ** return UPDATES message object
        // ** return UPDATES message object
        /**
         * @return {?}
         */
        Message.updates = 
        // ** return UPDATES message object
        /**
         * @return {?}
         */
        function () {
            // array values= { values: [ {path: xx, value: xx } ] }
            return {
                context: null,
                updates: []
            };
        };
        // ** return SUBSCRIBE message object
        // ** return SUBSCRIBE message object
        /**
         * @return {?}
         */
        Message.subscribe = 
        // ** return SUBSCRIBE message object
        /**
         * @return {?}
         */
        function () {
            /* array values= {
                "path": "path.to.key",
                "period": 1000,
                "format": "delta",
                "policy": "ideal",
                "minPeriod": 200
                } */
            return {
                context: null,
                subscribe: []
            };
        };
        // ** return UNSUBSCRIBE message object
        // ** return UNSUBSCRIBE message object
        /**
         * @return {?}
         */
        Message.unsubscribe = 
        // ** return UNSUBSCRIBE message object
        /**
         * @return {?}
         */
        function () {
            // array values= { "path": "path.to.key" }
            return {
                context: null,
                unsubscribe: []
            };
        };
        // ** return REQUEST message object
        // ** return REQUEST message object
        /**
         * @return {?}
         */
        Message.request = 
        // ** return REQUEST message object
        /**
         * @return {?}
         */
        function () {
            return {
                requestId: new UUID().toString()
            };
        };
        return Message;
    }());
    // ** Alarm message **
    var   
    // ** Alarm message **
    Alarm = /** @class */ (function () {
        function Alarm(message, state, visual, sound) {
            this._method = [];
            this._message = '';
            this._message = (typeof message !== 'undefined') ? message : '';
            this._state = (typeof state !== 'undefined') ? state : AlarmState.alarm;
            if (visual) {
                this._method.push(AlarmMethod.visual);
            }
            if (sound) {
                this._method.push(AlarmMethod.sound);
            }
        }
        Object.defineProperty(Alarm.prototype, "value", {
            get: /**
             * @return {?}
             */
            function () {
                return {
                    message: this._message,
                    state: this._state,
                    method: this._method
                };
            },
            enumerable: true,
            configurable: true
        });
        return Alarm;
    }());
    /** @enum {string} */
    var AlarmState = {
        normal: 'normal',
        alert: 'alert',
        warn: 'warn',
        alarm: 'alarm',
        emergency: 'emergency',
    };
    /** @enum {string} */
    var AlarmMethod = {
        visual: 'visual',
        sound: 'sound',
    };
    /** @enum {string} */
    var AlarmType = {
        mob: 'notifications.mob',
        fire: 'notifications.fire',
        sinking: 'notifications.sinking',
        flooding: 'notifications.flooding',
        collision: 'notifications.collision',
        grounding: 'notifications.grounding',
        listing: 'notifications.listing',
        adrift: 'notifications.adrift',
        piracy: 'notifications.piracy',
        abandon: 'notifications.abandon',
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SignalKHttp = /** @class */ (function () {
        // *******************************************************
        function SignalKHttp(http) {
            this.http = http;
        }
        Object.defineProperty(SignalKHttp.prototype, "authToken", {
            // ** set auth token value **
            set: 
            // ** set auth token value **
            /**
             * @param {?} val
             * @return {?}
             */
            function (val) { this._token = val; },
            enumerable: true,
            configurable: true
        });
        // ** get the contents of the Signal K tree pointed to by self. returns: Observable 
        // ** get the contents of the Signal K tree pointed to by self. returns: Observable 
        /**
         * @return {?}
         */
        SignalKHttp.prototype.getSelf = 
        // ** get the contents of the Signal K tree pointed to by self. returns: Observable 
        /**
         * @return {?}
         */
        function () { return this.get("vessels/self"); };
        //** get ID of vessel self via http. returns: Observable 
        //** get ID of vessel self via http. returns: Observable 
        /**
         * @return {?}
         */
        SignalKHttp.prototype.getSelfId = 
        //** get ID of vessel self via http. returns: Observable 
        /**
         * @return {?}
         */
        function () { return this.get("self"); };
        // ** return observable response for meta object at the specified context and path
        // ** return observable response for meta object at the specified context and path
        /**
         * @param {?} context
         * @param {?} path
         * @return {?}
         */
        SignalKHttp.prototype.getMeta = 
        // ** return observable response for meta object at the specified context and path
        /**
         * @param {?} context
         * @param {?} path
         * @return {?}
         */
        function (context, path) {
            return this.get(Path.contextToPath(context) + "/" + Path.dotToSlash(path) + "/meta");
        };
        //** get API path value via http. returns: Observable 
        //** get API path value via http. returns: Observable 
        /**
         * @param {?} path
         * @return {?}
         */
        SignalKHttp.prototype.get = 
        //** get API path value via http. returns: Observable 
        /**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            if (!this.endpoint) {
                return;
            }
            if (path[0] == '/') {
                path = path.slice(1);
            }
            /** @type {?} */
            var url = this.endpoint + Path.dotToSlash(path);
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.get(url, { headers: headers });
            }
            else {
                return this.http.get(url);
            }
        };
        /**
         * @param {?} c
         * @param {?} p
         * @param {?=} k
         * @param {?=} v
         * @return {?}
         */
        SignalKHttp.prototype.put = /**
         * @param {?} c
         * @param {?} p
         * @param {?=} k
         * @param {?=} v
         * @return {?}
         */
        function (c, p, k, v) {
            if (!this.endpoint) {
                return;
            }
            /** @type {?} */
            var context;
            /** @type {?} */
            var path;
            /** @type {?} */
            var msg = { value: {} }
            // ** path / value
            ;
            // ** path / value
            if (typeof k == 'undefined' && typeof v == 'undefined') {
                if (c[0] == '/') {
                    c = c.slice(1);
                }
                path = Path.dotToSlash(c);
                context = '';
                msg.value = p;
            }
            // ** context / path / value
            else if (typeof v == 'undefined') {
                context = (c) ? Path.contextToPath(c) : '';
                path = Path.dotToSlash(p);
                msg.value = k;
            }
            else { // ** context / path / key / value
                context = (c) ? Path.contextToPath(c) : '';
                /** @type {?} */
                var t = Path.dotToSlash(p).split('/');
                t.push(k);
                path = t.join('/');
                msg.value = v;
            }
            if (path[0] == '/') {
                path = path.slice(1);
            }
            // ** patch for node server PUT handling of resources
            /** @type {?} */
            var r = path.split('/');
            if (r[0] == 'resources') {
                context = '';
                if (this.server && this.server.id == 'signalk-server-node') { // ** check for node server
                    // ** check for node server
                    // ** re-format value { uuid: { <resource_data> }}
                    /** @type {?} */
                    var v_1 = JSON.parse(JSON.stringify(msg.value));
                    msg.value = {};
                    msg.value[r[r.length - 1]] = v_1;
                    // ** add self context and remove uuid from path
                    path = 'vessels/self/' + r.slice(0, r.length - 1).join('/');
                }
            }
            // ****************************************
            context = (context) ? context + '/' : '';
            /** @type {?} */
            var url = this.endpoint + context + Path.dotToSlash(path);
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.put(url, msg, { headers: headers });
            }
            else {
                return this.http.put(url, msg);
            }
        };
        //** send value to API path via http POST. returns: Observable 
        //** send value to API path via http POST. returns: Observable 
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        SignalKHttp.prototype.post = 
        //** send value to API path via http POST. returns: Observable 
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        function (path, value) {
            if (!this.endpoint) {
                return;
            }
            if (path[0] == '/') {
                path = path.slice(1);
            }
            /** @type {?} */
            var url = "" + this.endpoint + Path.dotToSlash(path);
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.post(url, value, { headers: headers });
            }
            else {
                return this.http.post(url, value);
            }
        };
        //** delete value from API path via http DELETE. returns: Observable 
        //** delete value from API path via http DELETE. returns: Observable 
        /**
         * @param {?} path
         * @return {?}
         */
        SignalKHttp.prototype.delete = 
        //** delete value from API path via http DELETE. returns: Observable 
        /**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            if (!this.endpoint) {
                return;
            }
            if (path[0] == '/') {
                path = path.slice(1);
            }
            /** @type {?} */
            var url = "" + this.endpoint + Path.dotToSlash(path);
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.delete(url, { headers: headers });
            }
            else {
                return this.http.delete(url);
            }
        };
        SignalKHttp.decorators = [
            { type: core.Injectable, args: [{ providedIn: 'root' },] }
        ];
        /** @nocollapse */
        SignalKHttp.ctorParameters = function () { return [
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ SignalKHttp.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(core.ɵɵinject(http.HttpClient)); }, token: SignalKHttp, providedIn: "root" });
        return SignalKHttp;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SignalKStream = /** @class */ (function () {
        // ******************************************************
        function SignalKStream() {
            this._filter = null; // ** id of vessel to filter delta messages
            // ** id of vessel to filter delta messages
            this._wsTimeout = 20000; // ** websocket connection timeout  
            this._playbackMode = false;
            this._source = null;
            this._connect = new rxjs.Subject();
            this.onConnect = this._connect.asObservable();
            this._close = new rxjs.Subject();
            this.onClose = this._close.asObservable();
            this._error = new rxjs.Subject();
            this.onError = this._error.asObservable();
            this._message = new rxjs.Subject();
            this.onMessage = this._message.asObservable();
        }
        Object.defineProperty(SignalKStream.prototype, "source", {
            // ** set source label for use in messages
            set: 
            // ** set source label for use in messages
            /**
             * @param {?} val
             * @return {?}
             */
            function (val) {
                if (!this._source) {
                    this._source = {};
                }
                this._source['label'] = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKStream.prototype, "authToken", {
            // ** set auth token value **
            set: 
            // ** set auth token value **
            /**
             * @param {?} val
             * @return {?}
             */
            function (val) { this._token = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKStream.prototype, "connectionTimeout", {
            // ** get / set websocket connection timeout 3000<=timeout<=60000 **
            get: 
            // ** get / set websocket connection timeout 3000<=timeout<=60000 **
            /**
             * @return {?}
             */
            function () { return this._wsTimeout; },
            set: /**
             * @param {?} val
             * @return {?}
             */
            function (val) {
                this._wsTimeout = (val < 3000) ? 3000 : (val > 60000) ? 60000 : val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKStream.prototype, "isOpen", {
            // ** is WS Stream connected?
            get: 
            // ** is WS Stream connected?
            /**
             * @return {?}
             */
            function () {
                return (this.ws && (this.ws.readyState != 1 && this.ws.readyState != 3)) ? true : false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKStream.prototype, "filter", {
            // ** get / set filter to select delta messages just for supplied vessel id   
            get: 
            // ** get / set filter to select delta messages just for supplied vessel id   
            /**
             * @return {?}
             */
            function () { return this._filter; },
            // ** set filter= null to remove message filtering
            set: 
            // ** set filter= null to remove message filtering
            /**
             * @param {?} id
             * @return {?}
             */
            function (id) {
                if (id && id.indexOf('self') != -1) { // ** self
                    this._filter = (this.selfId) ? this.selfId : null;
                }
                else {
                    this._filter = id;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKStream.prototype, "playbackMode", {
            // ** returns true if Playback Hello message
            get: 
            // ** returns true if Playback Hello message
            /**
             * @return {?}
             */
            function () { return this._playbackMode; },
            enumerable: true,
            configurable: true
        });
        // ** Close WebSocket connection
        // ** Close WebSocket connection
        /**
         * @return {?}
         */
        SignalKStream.prototype.close = 
        // ** Close WebSocket connection
        /**
         * @return {?}
         */
        function () { if (this.ws) {
            this.ws.close();
            this.ws = null;
        } };
        // ** Open a WebSocket at provided url
        // ** Open a WebSocket at provided url
        /**
         * @param {?} url
         * @param {?=} subscribe
         * @param {?=} token
         * @return {?}
         */
        SignalKStream.prototype.open = 
        // ** Open a WebSocket at provided url
        /**
         * @param {?} url
         * @param {?=} subscribe
         * @param {?=} token
         * @return {?}
         */
        function (url, subscribe, token) {
            var _this = this;
            url = (url) ? url : this.endpoint;
            if (!url) {
                return;
            }
            /** @type {?} */
            var q = (url.indexOf('?') == -1) ? '?' : '&';
            if (subscribe) {
                url += q + "subscribe=" + subscribe;
            }
            if (this._token || token) {
                url += ((subscribe) ? '&' : '?') + "token=" + (this._token || token);
            }
            this.close();
            this.ws = new WebSocket(url);
            // ** start connection watchdog **
            setTimeout((/**
             * @return {?}
             */
            function () {
                if (_this.ws && (_this.ws.readyState != 1 && _this.ws.readyState != 3)) {
                    console.warn("Connection watchdog expired (" + _this._wsTimeout / 1000 + " sec): " + _this.ws.readyState + "... aborting connection...");
                    _this.close();
                }
            }), this._wsTimeout);
            this.ws.onopen = (/**
             * @param {?} e
             * @return {?}
             */
            function (e) { _this._connect.next(e); });
            this.ws.onclose = (/**
             * @param {?} e
             * @return {?}
             */
            function (e) { _this._close.next(e); });
            this.ws.onerror = (/**
             * @param {?} e
             * @return {?}
             */
            function (e) { _this._error.next(e); });
            this.ws.onmessage = (/**
             * @param {?} e
             * @return {?}
             */
            function (e) { _this.parseOnMessage(e); });
        };
        // ** parse received message
        // ** parse received message
        /**
         * @private
         * @param {?} e
         * @return {?}
         */
        SignalKStream.prototype.parseOnMessage = 
        // ** parse received message
        /**
         * @private
         * @param {?} e
         * @return {?}
         */
        function (e) {
            /** @type {?} */
            var data;
            if (typeof e.data === 'string') {
                try {
                    data = JSON.parse(e.data);
                }
                catch (e) {
                    return;
                }
            }
            if (this.isHello(data)) {
                this.selfId = data.self;
                this._playbackMode = (typeof data.startTime != 'undefined') ? true : false;
                this._message.next(data);
            }
            else if (this.isResponse(data)) {
                if (typeof data.login !== 'undefined') {
                    if (typeof data.login.token !== 'undefined') {
                        this._token = data.login.token;
                    }
                }
                this._message.next(data);
            }
            else if (this._filter && this.isDelta(data)) {
                if (data.context == this._filter) {
                    this._message.next(data);
                }
            }
            else {
                this._message.next(data);
            }
        };
        // ** send request via Delta stream
        // ** send request via Delta stream
        /**
         * @param {?} value
         * @return {?}
         */
        SignalKStream.prototype.sendRequest = 
        // ** send request via Delta stream
        /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (typeof value !== 'object') {
                return null;
            }
            /** @type {?} */
            var msg = Message.request();
            if (typeof value.login === 'undefined' && this._token) {
                msg['token'] = this._token;
            }
            /** @type {?} */
            var keys = Object.keys(value);
            keys.forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) { msg[k] = value[k]; }));
            this.send(msg);
            return msg.requestId;
        };
        // ** send put request via Delta stream
        // ** send put request via Delta stream
        /**
         * @param {?} context
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        SignalKStream.prototype.put = 
        // ** send put request via Delta stream
        /**
         * @param {?} context
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        function (context, path, value) {
            /** @type {?} */
            var msg = {
                context: (context == 'self') ? 'vessels.self' : context,
                put: { path: path, value: value }
            };
            return this.sendRequest(msg);
        };
        // ** get auth token for supplied user details **
        // ** get auth token for supplied user details **
        /**
         * @param {?} username
         * @param {?} password
         * @return {?}
         */
        SignalKStream.prototype.login = 
        // ** get auth token for supplied user details **
        /**
         * @param {?} username
         * @param {?} password
         * @return {?}
         */
        function (username, password) {
            /** @type {?} */
            var msg = {
                login: { "username": username, "password": password }
            };
            return this.sendRequest(msg);
        };
        // ** send data to Signal K stream
        // ** send data to Signal K stream
        /**
         * @param {?} data
         * @return {?}
         */
        SignalKStream.prototype.send = 
        // ** send data to Signal K stream
        /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (this.ws) {
                if (typeof data === 'object') {
                    data = JSON.stringify(data);
                }
                this.ws.send(data);
            }
        };
        /**
         * @param {?=} context
         * @param {?=} path
         * @param {?=} value
         * @return {?}
         */
        SignalKStream.prototype.sendUpdate = /**
         * @param {?=} context
         * @param {?=} path
         * @param {?=} value
         * @return {?}
         */
        function (context, path, value) {
            if (context === void 0) { context = 'self'; }
            /** @type {?} */
            var val = Message.updates();
            if (this._token) {
                val['token'] = this._token;
            }
            val.context = (context == 'self') ? 'vessels.self' : context;
            if (this._token) {
                val['token'] = this._token;
            }
            /** @type {?} */
            var uValues = [];
            if (typeof path === 'string') {
                uValues.push({ path: path, value: value });
            }
            if (typeof path === 'object' && Array.isArray(path)) {
                uValues = path;
            }
            /** @type {?} */
            var u = {
                timestamp: new Date().toISOString(),
                values: uValues
            };
            if (this._source) {
                u['source'] = this._source;
            }
            val.updates.push(u);
            this.send(val);
        };
        /**
         * @param {?=} context
         * @param {?=} path
         * @param {?=} options
         * @return {?}
         */
        SignalKStream.prototype.subscribe = /**
         * @param {?=} context
         * @param {?=} path
         * @param {?=} options
         * @return {?}
         */
        function (context, path, options) {
            if (context === void 0) { context = '*'; }
            if (path === void 0) { path = '*'; }
            /** @type {?} */
            var val = Message.subscribe();
            if (this._token) {
                val['token'] = this._token;
            }
            val.context = (context == 'self') ? 'vessels.self' : context;
            if (this._token) {
                val['token'] = this._token;
            }
            if (typeof path === 'object' && Array.isArray(path)) {
                val.subscribe = path;
            }
            if (typeof path === 'string') {
                /** @type {?} */
                var sValue = {};
                sValue['path'] = path;
                if (options && typeof options === 'object') {
                    if (options['period']) {
                        sValue['period'] = options['period'];
                    }
                    if (options['minPeriod']) {
                        sValue['minPeriod'] = options['period'];
                    }
                    if (options['format'] &&
                        (options['format'] == 'delta' || options['format'] == 'full')) {
                        sValue['format'] = options['format'];
                    }
                    if (options['policy'] &&
                        (options['policy'] == 'instant' || options['policy'] == 'ideal'
                            || options['policy'] == 'fixed')) {
                        sValue['policy'] = options['policy'];
                    }
                }
                val.subscribe.push(sValue);
            }
            this.send(val);
        };
        // ** Unsubscribe from Delta stream messages **
        // ** Unsubscribe from Delta stream messages **
        /**
         * @param {?=} context
         * @param {?=} path
         * @return {?}
         */
        SignalKStream.prototype.unsubscribe = 
        // ** Unsubscribe from Delta stream messages **
        /**
         * @param {?=} context
         * @param {?=} path
         * @return {?}
         */
        function (context, path) {
            if (context === void 0) { context = '*'; }
            if (path === void 0) { path = '*'; }
            /** @type {?} */
            var val = Message.unsubscribe();
            if (this._token) {
                val['token'] = this._token;
            }
            val.context = (context == 'self') ? 'vessels.self' : context;
            if (this._token) {
                val['token'] = this._token;
            }
            if (typeof path === 'object' && Array.isArray(path)) {
                val.unsubscribe = path;
            }
            if (typeof path === 'string') {
                val.unsubscribe.push({ path: path });
            }
            this.send(val);
        };
        /**
         * @param {?=} context
         * @param {?=} alarmId
         * @param {?=} alarm
         * @return {?}
         */
        SignalKStream.prototype.raiseAlarm = /**
         * @param {?=} context
         * @param {?=} alarmId
         * @param {?=} alarm
         * @return {?}
         */
        function (context, alarmId, alarm) {
            if (context === void 0) { context = '*'; }
            /** @type {?} */
            var n;
            if (typeof alarmId === 'string') {
                n = (alarmId.indexOf('notifications.') == -1) ? "notifications." + alarmId : alarmId;
            }
            else {
                n = alarmId;
            }
            this.sendUpdate(context, n, alarm.value);
        };
        // ** raise alarm for path
        // ** raise alarm for path
        /**
         * @param {?=} context
         * @param {?=} name
         * @return {?}
         */
        SignalKStream.prototype.clearAlarm = 
        // ** raise alarm for path
        /**
         * @param {?=} context
         * @param {?=} name
         * @return {?}
         */
        function (context, name) {
            if (context === void 0) { context = '*'; }
            /** @type {?} */
            var n = (name.indexOf('notifications.') == -1) ? "notifications." + name : name;
            this.sendUpdate(context, n, null);
        };
        // *************** MESSAGE PARSING ******************************
        // ** returns true if message context is 'self'
        // *************** MESSAGE PARSING ******************************
        // ** returns true if message context is 'self'
        /**
         * @param {?} msg
         * @return {?}
         */
        SignalKStream.prototype.isSelf = 
        // *************** MESSAGE PARSING ******************************
        // ** returns true if message context is 'self'
        /**
         * @param {?} msg
         * @return {?}
         */
        function (msg) { return (msg.context == this.selfId); };
        // ** returns true if message is a Delta message
        // ** returns true if message is a Delta message
        /**
         * @param {?} msg
         * @return {?}
         */
        SignalKStream.prototype.isDelta = 
        // ** returns true if message is a Delta message
        /**
         * @param {?} msg
         * @return {?}
         */
        function (msg) { return typeof msg.context != 'undefined'; };
        // ** returns true if message is a Hello message
        // ** returns true if message is a Hello message
        /**
         * @param {?} msg
         * @return {?}
         */
        SignalKStream.prototype.isHello = 
        // ** returns true if message is a Hello message
        /**
         * @param {?} msg
         * @return {?}
         */
        function (msg) {
            return (typeof msg.version != 'undefined' && typeof msg.self != 'undefined');
        };
        // ** returns true if message is a request Response message
        // ** returns true if message is a request Response message
        /**
         * @param {?} msg
         * @return {?}
         */
        SignalKStream.prototype.isResponse = 
        // ** returns true if message is a request Response message
        /**
         * @param {?} msg
         * @return {?}
         */
        function (msg) { return typeof msg.requestId != 'undefined'; };
        SignalKStream.decorators = [
            { type: core.Injectable, args: [{ providedIn: 'root' },] }
        ];
        /** @nocollapse */
        SignalKStream.ctorParameters = function () { return []; };
        /** @nocollapse */ SignalKStream.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function SignalKStream_Factory() { return new SignalKStream(); }, token: SignalKStream, providedIn: "root" });
        return SignalKStream;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SignalKStreamWorker = /** @class */ (function () {
        // *******************************************************    
        function SignalKStreamWorker() {
            this._error = new rxjs.Subject();
            this.onError = this._error.asObservable();
            this._message = new rxjs.Subject();
            this.onMessage = this._message.asObservable();
        }
        /**
         * @return {?}
         */
        SignalKStreamWorker.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () { this.worker.terminate(); this.worker = undefined; };
        // ** Initialise worker
        // ** Initialise worker
        /**
         * @param {?} pathToFile
         * @return {?}
         */
        SignalKStreamWorker.prototype.init = 
        // ** Initialise worker
        /**
         * @param {?} pathToFile
         * @return {?}
         */
        function (pathToFile) {
            var _this = this;
            if (typeof (Worker) == "undefined") {
                return false;
            }
            if (this.worker) {
                this.worker.terminate();
            } // ** terminate an open worker
            this.worker = new Worker(pathToFile);
            this.worker.onmessage = (/**
             * @param {?} event
             * @return {?}
             */
            function (event) { _this._message.next(event); });
            this.worker.onerror = (/**
             * @param {?} event
             * @return {?}
             */
            function (event) { _this._error.next(event); });
            // ** worker ready for postMessage()
        };
        // ** Send message to worker
        // ** Send message to worker
        /**
         * @param {?} msg
         * @return {?}
         */
        SignalKStreamWorker.prototype.postMessage = 
        // ** Send message to worker
        /**
         * @param {?} msg
         * @return {?}
         */
        function (msg) { if (this.worker) {
            this.worker.postMessage(msg);
        } };
        // ** terminate worker
        // ** terminate worker
        /**
         * @return {?}
         */
        SignalKStreamWorker.prototype.terminate = 
        // ** terminate worker
        /**
         * @return {?}
         */
        function () { if (this.worker) {
            this.worker.terminate();
        } };
        SignalKStreamWorker.decorators = [
            { type: core.Injectable, args: [{ providedIn: 'root' },] }
        ];
        /** @nocollapse */
        SignalKStreamWorker.ctorParameters = function () { return []; };
        /** @nocollapse */ SignalKStreamWorker.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function SignalKStreamWorker_Factory() { return new SignalKStreamWorker(); }, token: SignalKStreamWorker, providedIn: "root" });
        return SignalKStreamWorker;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SignalKClient = /** @class */ (function () {
        // *******************************************************
        function SignalKClient(http, api, stream, worker) {
            this.http = http;
            this.api = api;
            this.stream = stream;
            this.worker = worker;
            this._version = 'v1'; // ** default Signal K api version
            // ** endpoints to fallback to if hello response is not received.
            this.fallbackEndpoints = {
                endpoints: { v1: {} },
                server: { id: "fallback" }
            };
            // **************** ATTRIBUTES ***************************
            // ** server information block **
            this.server = {
                endpoints: {},
                info: {},
                apiVersions: []
            };
            // ** endpoints fallback to host address when no hello response
            this.fallback = false;
            this.init();
        }
        // token for when security is enabled on the server
        /**
         * @private
         * @param {?} val
         * @return {?}
         */
        SignalKClient.prototype.debug = 
        // token for when security is enabled on the server
        /**
         * @private
         * @param {?} val
         * @return {?}
         */
        function (val) { if (core.isDevMode()) {
            console.log(val);
        } };
        Object.defineProperty(SignalKClient.prototype, "version", {
            // ** get / set Signal K preferred api version to use **
            get: 
            // ** get / set Signal K preferred api version to use **
            /**
             * @return {?}
             */
            function () { return parseInt(this._version.slice(1)); },
            set: /**
             * @param {?} val
             * @return {?}
             */
            function (val) {
                /** @type {?} */
                var v = 'v' + val;
                if (this.server.apiVersions.length == 0) {
                    this._version = v;
                    this.debug("Signal K api version set to: " + v);
                }
                else {
                    this._version = (this.server.apiVersions.indexOf(v) != -1) ? v : this._version;
                    this.debug("Signal K api version set request: " + v + ", result: " + this._version);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKClient.prototype, "authToken", {
            // ** set auth token value **
            set: 
            // ** set auth token value **
            /**
             * @param {?} val
             * @return {?}
             */
            function (val) {
                this._token = val;
                this.api.authToken = val;
                this.stream.authToken = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKClient.prototype, "message", {
            // ** Message Object
            get: 
            // ** Message Object
            /**
             * @return {?}
             */
            function () { return Message; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKClient.prototype, "uuid", {
            // ** generate and return a UUID object
            get: 
            // ** generate and return a UUID object
            /**
             * @return {?}
             */
            function () { return new UUID(); },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        SignalKClient.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () { this.stream.close(); };
        // ** initialise protocol, hostname, port values
        // ** initialise protocol, hostname, port values
        /**
         * @private
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        SignalKClient.prototype.init = 
        // ** initialise protocol, hostname, port values
        /**
         * @private
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        function (hostname, port, useSSL) {
            if (hostname === void 0) { hostname = 'localhost'; }
            if (port === void 0) { port = null; }
            if (useSSL === void 0) { useSSL = false; }
            this.hostname = hostname;
            if (useSSL) {
                this.protocol = 'https';
                this.port = port || 443;
            }
            else {
                this.protocol = 'http';
                this.port = port || 80;
            }
            /** @type {?} */
            var url = this.protocol + "://" + this.hostname + ":" + this.port;
            this.fallbackEndpoints.endpoints.v1['signalk-http'] = url + "/signalk/v1/api/";
            this.fallbackEndpoints.endpoints.v1['signalk-ws'] = url + "/signalk/v1/stream";
        };
        // **************** CONNECTION AND DISCOVERY  ********************
        // ** Signal K server endpoint discovery request (/signalk).  
        // **************** CONNECTION AND DISCOVERY  ********************
        // ** Signal K server endpoint discovery request (/signalk).  
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        SignalKClient.prototype.hello = 
        // **************** CONNECTION AND DISCOVERY  ********************
        // ** Signal K server endpoint discovery request (/signalk).  
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        function (hostname, port, useSSL) {
            if (hostname === void 0) { hostname = null; }
            if (port === void 0) { port = null; }
            if (useSSL === void 0) { useSSL = false; }
            this.init(hostname, port, useSSL);
            return this.get('/signalk');
        };
        // ** connect to server (endpoint discovery) and DO NOT open Stream
        // ** connect to server (endpoint discovery) and DO NOT open Stream
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        SignalKClient.prototype.connect = 
        // ** connect to server (endpoint discovery) and DO NOT open Stream
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        function (hostname, port, useSSL) {
            var _this = this;
            if (hostname === void 0) { hostname = null; }
            if (port === void 0) { port = null; }
            if (useSSL === void 0) { useSSL = false; }
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.debug('Contacting Signal K server.........');
                _this.hello(hostname, port, useSSL).subscribe((
                // ** discover endpoints **
                /**
                 * @param {?} response
                 * @return {?}
                 */
                function (// ** discover endpoints **
                response) {
                    if (_this.stream) {
                        _this.stream.close();
                    }
                    _this.processHello(response);
                    _this.api.endpoint = _this.resolveHttpEndpoint();
                    _this.stream.endpoint = _this.resolveStreamEndpoint();
                    resolve(true);
                }), (/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) {
                    if (_this.fallback) { // fallback if no hello response
                        if (_this.stream) {
                            _this.stream.close();
                        }
                        _this.processHello(null);
                        _this.api.endpoint = _this.resolveHttpEndpoint();
                        _this.stream.endpoint = _this.resolveStreamEndpoint();
                        resolve(true);
                    }
                    else {
                        _this.disconnectedFromServer();
                        reject(error);
                    }
                }));
            }));
        };
        // ** disconnect from server
        // ** disconnect from server
        /**
         * @return {?}
         */
        SignalKClient.prototype.disconnect = 
        // ** disconnect from server
        /**
         * @return {?}
         */
        function () { this.stream.close(); this.worker.terminate(); };
        // ** Connect + open Delta Stream (endpoint discovery)
        // ** Connect + open Delta Stream (endpoint discovery)
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @param {?=} subscribe
         * @return {?}
         */
        SignalKClient.prototype.connectStream = 
        // ** Connect + open Delta Stream (endpoint discovery)
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @param {?=} subscribe
         * @return {?}
         */
        function (hostname, port, useSSL, subscribe) {
            var _this = this;
            if (hostname === void 0) { hostname = null; }
            if (port === void 0) { port = null; }
            if (useSSL === void 0) { useSSL = false; }
            if (subscribe === void 0) { subscribe = null; }
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.connect(hostname, port, useSSL)
                    .then((/**
                 * @return {?}
                 */
                function () {
                    // ** connect to stream api at preferred version else fall back to default version
                    /** @type {?} */
                    var url = _this.resolveStreamEndpoint();
                    if (!url) {
                        reject(new Error('Server has no advertised Stream endpoints!'));
                        return;
                    }
                    _this.stream.open(url, subscribe);
                    resolve(true);
                }))
                    .catch((/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { reject(e); }));
            }));
        };
        // ** connect to playback stream (endpoint discovery)
        // ** connect to playback stream (endpoint discovery)
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @param {?=} options
         * @return {?}
         */
        SignalKClient.prototype.connectPlayback = 
        // ** connect to playback stream (endpoint discovery)
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @param {?=} options
         * @return {?}
         */
        function (hostname, port, useSSL, options) {
            var _this = this;
            if (hostname === void 0) { hostname = null; }
            if (port === void 0) { port = null; }
            if (useSSL === void 0) { useSSL = false; }
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.connect(hostname, port, useSSL)
                    .then((/**
                 * @return {?}
                 */
                function () {
                    // ** connect to playback api at preferred version else fall back to default version
                    _this.openPlayback(null, options, _this._token);
                    resolve(true);
                }))
                    .catch((/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { reject(e); }));
            }));
        };
        // ** connect to delta stream with (NO endpoint discovery)
        // ** connect to delta stream with (NO endpoint discovery)
        /**
         * @param {?=} url
         * @param {?=} subscribe
         * @param {?=} token
         * @return {?}
         */
        SignalKClient.prototype.openStream = 
        // ** connect to delta stream with (NO endpoint discovery)
        /**
         * @param {?=} url
         * @param {?=} subscribe
         * @param {?=} token
         * @return {?}
         */
        function (url, subscribe, token) {
            if (url === void 0) { url = null; }
            this.debug('openStream.........');
            if (!url) { // connect to stream api at discovered endpoint
                url = this.resolveStreamEndpoint();
                if (!url) {
                    return (new Error('Server has no advertised Stream endpoints!'));
                }
            }
            this.stream.open(url, subscribe, token);
            return true;
        };
        // ** connect to playback stream (NO endpoint discovery)
        // ** connect to playback stream (NO endpoint discovery)
        /**
         * @param {?=} url
         * @param {?=} options
         * @param {?=} token
         * @return {?}
         */
        SignalKClient.prototype.openPlayback = 
        // ** connect to playback stream (NO endpoint discovery)
        /**
         * @param {?=} url
         * @param {?=} options
         * @param {?=} token
         * @return {?}
         */
        function (url, options, token) {
            if (url === void 0) { url = null; }
            this.debug('openPlayback.........');
            if (!url) { // connect to stream api at discovered endpoint
                url = this.resolveStreamEndpoint();
                if (!url) {
                    return (new Error('Server has no advertised Stream endpoints!'));
                }
                url = url.replace('stream', 'playback');
            }
            /** @type {?} */
            var pb = '';
            /** @type {?} */
            var subscribe;
            if (options && typeof options === 'object') {
                pb += (options.startTime) ? '?startTime=' + options.startTime.slice(0, options.startTime.indexOf('.')) + 'Z' : '';
                pb += (options.playbackRate) ? "&playbackRate=" + options.playbackRate : '';
                subscribe = (options.subscribe) ? options.subscribe : null;
            }
            this.stream.open(url + pb, subscribe, token);
            return true;
        };
        // ** process Hello response 
        // ** process Hello response 
        /**
         * @private
         * @param {?} response
         * @return {?}
         */
        SignalKClient.prototype.processHello = 
        // ** process Hello response 
        /**
         * @private
         * @param {?} response
         * @return {?}
         */
        function (response) {
            this.server.endpoints = (response && response['endpoints']) ?
                response['endpoints'] : this.fallbackEndpoints.endpoints;
            this.server.info = (response && response['server']) ?
                response['server'] : this.fallbackEndpoints.server;
            this.server.apiVersions = (this.server.endpoints) ? Object.keys(this.server.endpoints) : [];
            this.debug(this.server.endpoints);
            this.api.server = this.server.info;
        };
        // ** return preferred WS stream url
        // ** return preferred WS stream url
        /**
         * @return {?}
         */
        SignalKClient.prototype.resolveStreamEndpoint = 
        // ** return preferred WS stream url
        /**
         * @return {?}
         */
        function () {
            if (this.server.endpoints[this._version] && this.server.endpoints[this._version]['signalk-ws']) {
                this.debug("Connecting endpoint version: " + this._version);
                return "" + this.server.endpoints[this._version]['signalk-ws'];
            }
            else if (this.server.endpoints['v1'] && this.server.endpoints['v1']['signalk-ws']) {
                this.debug("Connection falling back to: v1");
                return "" + this.server.endpoints['v1']['signalk-ws'];
            }
            else {
                return null;
            }
        };
        // ** return signalk-http endpoint url
        // ** return signalk-http endpoint url
        /**
         * @private
         * @return {?}
         */
        SignalKClient.prototype.resolveHttpEndpoint = 
        // ** return signalk-http endpoint url
        /**
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var url;
            if (this.server.endpoints[this._version]) { // ** connection made
                // ** connect to http endpoint at prescribed version else fall back to default version
                if (this.server.endpoints[this._version]['signalk-http']) {
                    url = "" + this.server.endpoints[this._version]['signalk-http'];
                }
                else {
                    url = "" + this.server.endpoints['v1']['signalk-http'];
                }
            }
            else {
                /** @type {?} */
                var msg = 'No current connection http endpoint service! Use connect() to establish a connection.';
                this.debug(msg);
            }
            return url;
        };
        // ** cleanup on server disconnection
        // ** cleanup on server disconnection
        /**
         * @private
         * @return {?}
         */
        SignalKClient.prototype.disconnectedFromServer = 
        // ** cleanup on server disconnection
        /**
         * @private
         * @return {?}
         */
        function () {
            this.server.endpoints = {};
            this.server.info = {};
            this.server.apiVersions = [];
        };
        //** return observable response from http path
        //** return observable response from http path
        /**
         * @param {?} path
         * @return {?}
         */
        SignalKClient.prototype.get = 
        //** return observable response from http path
        /**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            /** @type {?} */
            var url = this.protocol + "://" + this.hostname + ":" + this.port + Path.dotToSlash(path);
            this.debug("get " + url);
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.get(url, { headers: headers });
            }
            else {
                return this.http.get(url);
            }
        };
        //** return observable response for put to http path
        //** return observable response for put to http path
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        SignalKClient.prototype.put = 
        //** return observable response for put to http path
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        function (path, value) {
            /** @type {?} */
            var url = this.protocol + "://" + this.hostname + ":" + this.port + Path.dotToSlash(path);
            this.debug("put " + url);
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.put(url, { headers: headers });
            }
            else {
                return this.http.put(url, value);
            }
        };
        //** return observable response for post to http path
        //** return observable response for post to http path
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        SignalKClient.prototype.post = 
        //** return observable response for post to http path
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        function (path, value) {
            /** @type {?} */
            var url = this.protocol + "://" + this.hostname + ":" + this.port + Path.dotToSlash(path);
            this.debug("post " + url);
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.post(url, { headers: headers });
            }
            else {
                return this.http.post(url, value);
            }
        };
        // ** get auth token for supplied user details **
        // ** get auth token for supplied user details **
        /**
         * @param {?} username
         * @param {?} password
         * @return {?}
         */
        SignalKClient.prototype.login = 
        // ** get auth token for supplied user details **
        /**
         * @param {?} username
         * @param {?} password
         * @return {?}
         */
        function (username, password) {
            /** @type {?} */
            var headers = new http.HttpHeaders().set('Content-Type', "application/json");
            return this.http.post(this.protocol + "://" + this.hostname + ":" + this.port + "/signalk/" + this._version + "/auth/login", { "username": username, "password": password }, { headers: headers });
        };
        // ** logout from server **
        // ** logout from server **
        /**
         * @return {?}
         */
        SignalKClient.prototype.logout = 
        // ** logout from server **
        /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var url = this.protocol + "://" + this.hostname + ":" + this.port + "/signalk/" + this._version + "/auth/logout";
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.put(url, null, { headers: headers });
            }
            else {
                return this.http.put(url, null);
            }
        };
        //** get data via the snapshot http api path for supplied time
        //** get data via the snapshot http api path for supplied time
        /**
         * @param {?} context
         * @param {?} time
         * @return {?}
         */
        SignalKClient.prototype.snapshot = 
        //** get data via the snapshot http api path for supplied time
        /**
         * @param {?} context
         * @param {?} time
         * @return {?}
         */
        function (context, time) {
            if (!time) {
                return;
            }
            time = time.slice(0, time.indexOf('.')) + 'Z';
            /** @type {?} */
            var url = this.resolveHttpEndpoint();
            if (!url) {
                return;
            }
            url = "" + url.replace('api', 'snapshot') + Path.contextToPath(context) + "?time=" + time;
            if (this._token) {
                /** @type {?} */
                var headers = new http.HttpHeaders({ 'Authorization': "JWT " + this._token });
                return this.http.get(url, { headers: headers });
            }
            else {
                return this.http.get(url);
            }
        };
        SignalKClient.decorators = [
            { type: core.Injectable, args: [{ providedIn: 'root' },] }
        ];
        /** @nocollapse */
        SignalKClient.ctorParameters = function () { return [
            { type: http.HttpClient },
            { type: SignalKHttp },
            { type: SignalKStream },
            { type: SignalKStreamWorker }
        ]; };
        /** @nocollapse */ SignalKClient.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(core.ɵɵinject(http.HttpClient), core.ɵɵinject(SignalKHttp), core.ɵɵinject(SignalKStream), core.ɵɵinject(SignalKStreamWorker)); }, token: SignalKClient, providedIn: "root" });
        return SignalKClient;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SignalKClientModule = /** @class */ (function () {
        function SignalKClientModule() {
        }
        SignalKClientModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [http.HttpClientModule],
                        declarations: [],
                        exports: [],
                        entryComponents: [],
                        providers: []
                    },] }
        ];
        return SignalKClientModule;
    }());

    exports.Alarm = Alarm;
    exports.AlarmMethod = AlarmMethod;
    exports.AlarmState = AlarmState;
    exports.AlarmType = AlarmType;
    exports.Message = Message;
    exports.Path = Path;
    exports.SignalKClient = SignalKClient;
    exports.SignalKClientModule = SignalKClientModule;
    exports.SignalKHttp = SignalKHttp;
    exports.SignalKStream = SignalKStream;
    exports.ɵa = SignalKStreamWorker;
    exports.ɵb = UUID;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=signalk-client-angular.umd.js.map
