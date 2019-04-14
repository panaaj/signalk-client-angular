(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('signalk-client-angular', ['exports', '@angular/core', '@angular/common/http', 'rxjs'], factory) :
    (factory((global['signalk-client-angular'] = {}),global.ng.core,global.ng.common.http,global.rxjs));
}(this, (function (exports,i0,i1,rxjs) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /*
     * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
     * TimeUUID based on dates for range selections.
     * @see http://www.ietf.org/rfc/rfc4122.txt
     **/
    var /*
     * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
     * TimeUUID based on dates for range selections.
     * @see http://www.ietf.org/rfc/rfc4122.txt
     **/ UUID = /** @class */ (function () {
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
                if (z === void 0) {
                    z = null;
                }
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
                ( /** @type {?} */(this)).version = (timeHiAndVersion >> 12) & 0xF;
                ( /** @type {?} */(this)).hex = ( /** @type {?} */(this)).paddedString(timeLow.toString(16), 8)
                    + '-'
                    + ( /** @type {?} */(this)).paddedString(timeMid.toString(16), 4)
                    + '-'
                    + ( /** @type {?} */(this)).paddedString(timeHiAndVersion.toString(16), 4)
                    + '-'
                    + ( /** @type {?} */(this)).paddedString(clockSeqHiAndReserved.toString(16), 2)
                    + ( /** @type {?} */(this)).paddedString(clockSeqLow.toString(16), 2)
                    + '-'
                    + ( /** @type {?} */(this)).paddedString(node.toString(16), 12);
                return ( /** @type {?} */(this));
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
             */ function () {
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
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
                var msg = { value: {} };
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.delete(url, { headers: headers });
                }
                else {
                    return this.http.delete(url);
                }
            };
        SignalKHttp.decorators = [
            { type: i0.Injectable, args: [{ providedIn: 'root' },] },
        ];
        /** @nocollapse */
        SignalKHttp.ctorParameters = function () {
            return [
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ SignalKHttp.ngInjectableDef = i0.defineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(i0.inject(i1.HttpClient)); }, token: SignalKHttp, providedIn: "root" });
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
             */ function (val) {
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
            function () {
                if (this.ws) {
                    this.ws.close();
                    this.ws = null;
                }
            };
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
                setTimeout(( /**
                 * @return {?}
                 */function () {
                    if (_this.ws && (_this.ws.readyState != 1 && _this.ws.readyState != 3)) {
                        console.warn("Connection watchdog expired (" + _this._wsTimeout / 1000 + " sec): " + _this.ws.readyState + "... aborting connection...");
                        _this.close();
                    }
                }), this._wsTimeout);
                this.ws.onopen = ( /**
                 * @param {?} e
                 * @return {?}
                 */function (e) { _this._connect.next(e); });
                this.ws.onclose = ( /**
                 * @param {?} e
                 * @return {?}
                 */function (e) { _this._close.next(e); });
                this.ws.onerror = ( /**
                 * @param {?} e
                 * @return {?}
                 */function (e) { _this._error.next(e); });
                this.ws.onmessage = ( /**
                 * @param {?} e
                 * @return {?}
                 */function (e) { _this.parseOnMessage(e); });
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
                keys.forEach(( /**
                 * @param {?} k
                 * @return {?}
                 */function (k) { msg[k] = value[k]; }));
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
                if (context === void 0) {
                    context = 'self';
                }
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
                if (context === void 0) {
                    context = '*';
                }
                if (path === void 0) {
                    path = '*';
                }
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
                if (context === void 0) {
                    context = '*';
                }
                if (path === void 0) {
                    path = '*';
                }
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
                if (context === void 0) {
                    context = '*';
                }
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
                if (context === void 0) {
                    context = '*';
                }
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
            { type: i0.Injectable, args: [{ providedIn: 'root' },] },
        ];
        /** @nocollapse */
        SignalKStream.ctorParameters = function () { return []; };
        /** @nocollapse */ SignalKStream.ngInjectableDef = i0.defineInjectable({ factory: function SignalKStream_Factory() { return new SignalKStream(); }, token: SignalKStream, providedIn: "root" });
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
                this.worker.onmessage = ( /**
                 * @param {?} event
                 * @return {?}
                 */function (event) { _this._message.next(event); });
                this.worker.onerror = ( /**
                 * @param {?} event
                 * @return {?}
                 */function (event) { _this._error.next(event); });
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
            function (msg) {
                if (this.worker) {
                    this.worker.postMessage(msg);
                }
            };
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
            function () {
                if (this.worker) {
                    this.worker.terminate();
                }
            };
        SignalKStreamWorker.decorators = [
            { type: i0.Injectable, args: [{ providedIn: 'root' },] },
        ];
        /** @nocollapse */
        SignalKStreamWorker.ctorParameters = function () { return []; };
        /** @nocollapse */ SignalKStreamWorker.ngInjectableDef = i0.defineInjectable({ factory: function SignalKStreamWorker_Factory() { return new SignalKStreamWorker(); }, token: SignalKStreamWorker, providedIn: "root" });
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
            // **************** ATTRIBUTES ***************************
            // ** server information block **
            this.server = {
                endpoints: {},
                info: {},
                apiVersions: []
            };
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
            function (val) {
                if (i0.isDevMode()) {
                    console.log(val);
                }
            };
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
             */ function (val) {
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
                if (hostname === void 0) {
                    hostname = 'localhost';
                }
                if (port === void 0) {
                    port = null;
                }
                if (useSSL === void 0) {
                    useSSL = false;
                }
                this.hostname = hostname;
                if (useSSL) {
                    this.protocol = 'https';
                    this.port = port || 443;
                }
                else {
                    this.protocol = 'http';
                    this.port = port || 80;
                }
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
                if (hostname === void 0) {
                    hostname = null;
                }
                if (port === void 0) {
                    port = null;
                }
                if (useSSL === void 0) {
                    useSSL = false;
                }
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
                if (hostname === void 0) {
                    hostname = null;
                }
                if (port === void 0) {
                    port = null;
                }
                if (useSSL === void 0) {
                    useSSL = false;
                }
                return new Promise(( /**
                 * @param {?} resolve
                 * @param {?} reject
                 * @return {?}
                 */function (resolve, reject) {
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
                    }), ( /**
                     * @param {?} error
                     * @return {?}
                     */function (error) {
                        _this.disconnectedFromServer();
                        reject(error);
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
                if (hostname === void 0) {
                    hostname = null;
                }
                if (port === void 0) {
                    port = null;
                }
                if (useSSL === void 0) {
                    useSSL = false;
                }
                if (subscribe === void 0) {
                    subscribe = null;
                }
                return new Promise(( /**
                 * @param {?} resolve
                 * @param {?} reject
                 * @return {?}
                 */function (resolve, reject) {
                    _this.connect(hostname, port, useSSL)
                        .then(( /**
                 * @return {?}
                 */function () {
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
                        .catch(( /**
                 * @param {?} e
                 * @return {?}
                 */function (e) { reject(e); }));
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
                if (hostname === void 0) {
                    hostname = null;
                }
                if (port === void 0) {
                    port = null;
                }
                if (useSSL === void 0) {
                    useSSL = false;
                }
                return new Promise(( /**
                 * @param {?} resolve
                 * @param {?} reject
                 * @return {?}
                 */function (resolve, reject) {
                    _this.connect(hostname, port, useSSL)
                        .then(( /**
                 * @return {?}
                 */function () {
                        // ** connect to playback api at preferred version else fall back to default version
                        _this.openPlayback(null, options, _this._token);
                        resolve(true);
                    }))
                        .catch(( /**
                 * @param {?} e
                 * @return {?}
                 */function (e) { reject(e); }));
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
                if (url === void 0) {
                    url = null;
                }
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
                if (url === void 0) {
                    url = null;
                }
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
                this.server.endpoints = (response['endpoints']) ? response['endpoints'] : {};
                this.server.info = (response['server']) ? response['server'] : {};
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
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
                var headers = new i1.HttpHeaders().set('Content-Type', "application/json");
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
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
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.get(url, { headers: headers });
                }
                else {
                    return this.http.get(url);
                }
            };
        SignalKClient.decorators = [
            { type: i0.Injectable, args: [{ providedIn: 'root' },] },
        ];
        /** @nocollapse */
        SignalKClient.ctorParameters = function () {
            return [
                { type: i1.HttpClient },
                { type: SignalKHttp },
                { type: SignalKStream },
                { type: SignalKStreamWorker }
            ];
        };
        /** @nocollapse */ SignalKClient.ngInjectableDef = i0.defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.inject(i1.HttpClient), i0.inject(SignalKHttp), i0.inject(SignalKStream), i0.inject(SignalKStreamWorker)); }, token: SignalKClient, providedIn: "root" });
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
            { type: i0.NgModule, args: [{
                        imports: [i1.HttpClientModule],
                        declarations: [],
                        exports: [],
                        entryComponents: [],
                        providers: []
                    },] },
        ];
        return SignalKClientModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.SignalKClientModule = SignalKClientModule;
    exports.SignalKClient = SignalKClient;
    exports.Path = Path;
    exports.Message = Message;
    exports.Alarm = Alarm;
    exports.AlarmState = AlarmState;
    exports.AlarmMethod = AlarmMethod;
    exports.AlarmType = AlarmType;
    exports.ɵa = SignalKHttp;
    exports.ɵb = SignalKStream;
    exports.ɵc = SignalKStreamWorker;
    exports.ɵd = UUID;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V1aWQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V0aWxzLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9odHRwLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLXdvcmtlci50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBVVUlEOiBBIGpzIGxpYnJhcnkgdG8gZ2VuZXJhdGUgYW5kIHBhcnNlIFVVSURzLCBUaW1lVVVJRHMgYW5kIGdlbmVyYXRlXHJcbiAqIFRpbWVVVUlEIGJhc2VkIG9uIGRhdGVzIGZvciByYW5nZSBzZWxlY3Rpb25zLlxyXG4gKiBAc2VlIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XHJcbiAqKi9cclxuZXhwb3J0IGNsYXNzIFVVSUQge1xyXG5cclxuICAgIHByaXZhdGUgbGltaXRVSTA0O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDY7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwODtcclxuICAgIHByaXZhdGUgbGltaXRVSTEyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTMyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJNDA7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0ODtcclxuXHJcbiAgICBwcml2YXRlIHZlcnNpb246bnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBoZXg6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA0ID0gdGhpcy5tYXhGcm9tQml0cyg0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwNiA9IHRoaXMubWF4RnJvbUJpdHMoNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDggPSB0aGlzLm1heEZyb21CaXRzKDgpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTEyID0gdGhpcy5tYXhGcm9tQml0cygxMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTQgPSB0aGlzLm1heEZyb21CaXRzKDE0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNiA9IHRoaXMubWF4RnJvbUJpdHMoMTYpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTMyID0gdGhpcy5tYXhGcm9tQml0cygzMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJNDAgPSB0aGlzLm1heEZyb21CaXRzKDQwKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0OCA9IHRoaXMubWF4RnJvbUJpdHMoNDgpOyBcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMuaGV4IH1cclxuICAgIHRvVVJOKCkgeyByZXR1cm4gJ3Vybjp1dWlkOicgKyB0aGlzLmhleCB9XHJcbiAgICB0b1NpZ25hbEsoKTpzdHJpbmcgIHsgcmV0dXJuIGB1cm46bXJuOnNpZ25hbGs6dXVpZDoke3RoaXMuaGV4fWAgfVxyXG4gICAgdG9CeXRlcygpIHtcclxuICAgICAgICBsZXQgcGFydHMgPSB0aGlzLmhleC5zcGxpdCgnLScpO1xyXG4gICAgICAgIGxldCBpbnRzID0gW107XHJcbiAgICAgICAgbGV0IGludFBvcyA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldLmxlbmd0aDsgais9Mikge1xyXG4gICAgICAgICAgICBpbnRzW2ludFBvcysrXSA9IHBhcnNlSW50KHBhcnRzW2ldLnN1YnN0cihqLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnRzO1xyXG4gICAgfTsgICAgXHJcblxyXG4gICAgcHJpdmF0ZSBtYXhGcm9tQml0cyhiaXRzKSB7IHJldHVybiBNYXRoLnBvdygyLCBiaXRzKSB9O1xyXG5cclxuICAgIHByaXZhdGUgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7IHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluIH1cclxuXHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNi0xKTt9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDgoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwOC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMzIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkzMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJNDAoKSB7IHJldHVybiAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCAzMCkpICsgKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgNDAgLSAzMCkpICogKDEgPDwgMzApIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0OCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0OCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIHRoaXMuZnJvbVBhcnRzKFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMzIoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTE2KCksXHJcbiAgICAgICAgICAgIDB4NDAwMCB8IHRoaXMucmFuZG9tVUkxMigpLFxyXG4gICAgICAgICAgICAweDgwICAgfCB0aGlzLnJhbmRvbVVJMDYoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTA4KCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUk0OCgpXHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBwYWRkZWRTdHJpbmcoc3RyaW5nLCBsZW5ndGgsIHo9bnVsbCkge1xyXG4gICAgICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xyXG4gICAgICAgIHogPSAoIXopID8gJzAnIDogejtcclxuICAgICAgICBsZXQgaSA9IGxlbmd0aCAtIHN0cmluZy5sZW5ndGg7XHJcbiAgICAgICAgZm9yICg7IGkgPiAwOyBpID4+Pj0gMSwgeiArPSB6KSB7XHJcbiAgICAgICAgICAgIGlmIChpICYgMSkge1xyXG4gICAgICAgICAgICBzdHJpbmcgPSB6ICsgc3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJpbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZnJvbVBhcnRzKHRpbWVMb3csIHRpbWVNaWQsIHRpbWVIaUFuZFZlcnNpb24sIGNsb2NrU2VxSGlBbmRSZXNlcnZlZCwgY2xvY2tTZXFMb3csIG5vZGUpIHtcclxuICAgICAgICB0aGlzLnZlcnNpb24gPSAodGltZUhpQW5kVmVyc2lvbiA+PiAxMikgJiAweEY7XHJcbiAgICAgICAgdGhpcy5oZXggPSB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTG93LnRvU3RyaW5nKDE2KSwgOClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTWlkLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lSGlBbmRWZXJzaW9uLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhjbG9ja1NlcUhpQW5kUmVzZXJ2ZWQudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxTG93LnRvU3RyaW5nKDE2KSwgMilcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhub2RlLnRvU3RyaW5nKDE2KSwgMTIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTsgICAgXHJcbiAgICBcclxuICAgIC8qXHJcbiAgICBwcml2YXRlIGdldFRpbWVGaWVsZFZhbHVlcyh0aW1lKSB7XHJcbiAgICAgICAgbGV0IHRzID0gdGltZSAtIERhdGUuVVRDKDE1ODIsIDksIDE1KTtcclxuICAgICAgICBsZXQgaG0gPSAoKHRzIC8gMHgxMDAwMDAwMDApICogMTAwMDApICYgMHhGRkZGRkZGO1xyXG4gICAgICAgIHJldHVybiB7IGxvdzogKCh0cyAmIDB4RkZGRkZGRikgKiAxMDAwMCkgJSAweDEwMDAwMDAwMCxcclxuICAgICAgICAgICAgICAgIG1pZDogaG0gJiAweEZGRkYsIGhpOiBobSA+Pj4gMTYsIHRpbWVzdGFtcDogdHMgfTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVRpbWUodGltZSwgbGFzdDpib29sZWFuKSB7XHJcbiAgICAgICAgbGFzdCA9ICghbGFzdCkgPyBmYWxzZSA6IGxhc3Q7XHJcbiAgICAgICAgbGV0IHRmID0gdGhpcy5nZXRUaW1lRmllbGRWYWx1ZXModGltZSk7XHJcbiAgICAgICAgbGV0IHRsID0gdGYubG93O1xyXG4gICAgICAgIGxldCB0aGF2ID0gKHRmLmhpICYgMHhGRkYpIHwgMHgxMDAwOyAgLy8gc2V0IHZlcnNpb24gJzAwMDEnXHJcbiAgICAgICAgaWYgKGxhc3QgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRCgpLmZyb21QYXJ0cyh0bCwgdGYubWlkLCB0aGF2LCAwLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVVSUQoKS5mcm9tUGFydHModGwsIHRmLm1pZCwgdGhhdiwgMHg4MCB8IHRoaXMubGltaXRVSTA2LCB0aGlzLmxpbWl0VUkwOCAtIDEsIHRoaXMubGltaXRVSTQ4IC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmaXJzdEZyb21UaW1lKHRpbWUpIHsgcmV0dXJuIHRoaXMuZnJvbVRpbWUodGltZSwgZmFsc2UpIH1cclxuICAgIGxhc3RGcm9tVGltZSh0aW1lKSB7IHJldHVybiB0aGlzLmZyb21UaW1lKHRpbWUsIHRydWUpIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBlcXVhbHModXVpZCkge1xyXG4gICAgICAgIGlmICghKHV1aWQgaW5zdGFuY2VvZiBVVUlEKSkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmICh0aGlzLmhleCAhPT0gdXVpZC5oZXgpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVVSTihzdHJJZCkge1xyXG4gICAgICAgIGxldCByO1xyXG4gICAgICAgIGxldCBwID0gL14oPzp1cm46dXVpZDp8XFx7KT8oWzAtOWEtZl17OH0pLShbMC05YS1mXXs0fSktKFswLTlhLWZdezR9KS0oWzAtOWEtZl17Mn0pKFswLTlhLWZdezJ9KS0oWzAtOWEtZl17MTJ9KSg/OlxcfSk/JC9pO1xyXG4gICAgICAgIGlmICgociA9IHAuZXhlYyhzdHJJZCkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb21QYXJ0cyhcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbMV0sIDE2KSwgcGFyc2VJbnQoclsyXSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoclszXSwgMTYpLCBwYXJzZUludChyWzRdLCAxNiksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzVdLCAxNiksIHBhcnNlSW50KHJbNl0sIDE2KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQnl0ZXMoaW50cykge1xyXG4gICAgICAgIGlmIChpbnRzLmxlbmd0aCA8IDUpIHsgcmV0dXJuIG51bGwgfVxyXG4gICAgICAgIGxldCBzdHIgPSAnJztcclxuICAgICAgICBsZXQgcG9zID0gMDtcclxuICAgICAgICBsZXQgcGFydHMgPSBbNCwgMiwgMiwgMiwgNl07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG9jdGV0ID0gaW50c1twb3MrK10udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICBpZiAob2N0ZXQubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIG9jdGV0ID0gJzAnICsgb2N0ZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyICs9IG9jdGV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXJ0c1tpXSAhPT0gNikge1xyXG4gICAgICAgICAgICBzdHIgKz0gJy0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb21VUk4oc3RyKTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbUJpbmFyeShiaW5hcnkpIHtcclxuICAgICAgICBsZXQgaW50cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGludHNbaV0gPSBiaW5hcnkuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAgICAgaWYgKGludHNbaV0gPiAyNTUgfHwgaW50c1tpXSA8IDApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGJ5dGUgaW4gYmluYXJ5IGRhdGEuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbUJ5dGVzKGludHMpO1xyXG4gICAgfTtcclxuICAgICovXHJcblxyXG59OyIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xyXG5cclxuLy8gKiogUGF0aCB1dGlsaXRpZXNcclxuZXhwb3J0IGNsYXNzIFBhdGgge1xyXG5cclxuICAgIC8vICoqIHRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gc2xhc2hcclxuICAgIHN0YXRpYyBkb3RUb1NsYXNoKHBhdGg6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGxldCBwPSBwYXRoLnNwbGl0KCc/Jyk7XHJcbiAgICAgICAgaWYocFswXS5pbmRleE9mKCcuJykhPS0xKSB7IFxyXG4gICAgICAgICAgICBwWzBdPSBwWzBdLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcC5qb2luKCc/Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXHJcbiAgICBzdGF0aWMgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcclxuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgfSAgICBcclxuXHJcbn1cclxuXHJcbi8vICoqIE1lc3NhZ2UgdGVtcGxhdGVzICoqXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcclxuICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVVBEQVRFUyBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVwZGF0ZXMoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyB2YWx1ZXM6IFsge3BhdGg6IHh4LCB2YWx1ZTogeHggfSBdIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdXBkYXRlczogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gKiogcmV0dXJuIFNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLyogYXJyYXkgdmFsdWVzPSB7XHJcbiAgICAgICAgICAgIFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kXCI6IDEwMDAsXHJcbiAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwiZGVsdGFcIixcclxuICAgICAgICAgICAgXCJwb2xpY3lcIjogXCJpZGVhbFwiLFxyXG4gICAgICAgICAgICBcIm1pblBlcmlvZFwiOiAyMDBcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVU5TVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1bnN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIgfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1bnN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbiAgICAvLyAqKiByZXR1cm4gUkVRVUVTVCBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHJlcXVlc3QoKSB7IFxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICByZXF1ZXN0SWQ6IG5ldyBVVUlEKCkudG9TdHJpbmcoKVxyXG4gICAgICAgIH1cclxuICAgIH0gICAgICAgICAgIFxyXG5cclxufVxyXG5cclxuLy8gKiogQWxhcm0gbWVzc2FnZSAqKlxyXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xyXG5cclxuICAgIHByaXZhdGUgX3N0YXRlOkFsYXJtU3RhdGU7XHJcbiAgICBwcml2YXRlIF9tZXRob2Q6QXJyYXk8QWxhcm1NZXRob2Q+PSBbXTtcclxuICAgIHByaXZhdGUgX21lc3NhZ2U6c3RyaW5nPScnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nLCBzdGF0ZT86QWxhcm1TdGF0ZSwgdmlzdWFsPzpib29sZWFuLCBzb3VuZD86Ym9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9ICh0eXBlb2YgbWVzc2FnZSE9PSAndW5kZWZpbmVkJykgPyBtZXNzYWdlIDogJyc7XHJcbiAgICAgICAgdGhpcy5fc3RhdGU9ICh0eXBlb2Ygc3RhdGUhPT0gJ3VuZGVmaW5lZCcpID8gc3RhdGUgOiBBbGFybVN0YXRlLmFsYXJtO1xyXG4gICAgICAgIGlmKHZpc3VhbCkgeyB0aGlzLl9tZXRob2QucHVzaChBbGFybU1ldGhvZC52aXN1YWwpfTtcclxuICAgICAgICBpZihzb3VuZCkgeyB0aGlzLl9tZXRob2QucHVzaChBbGFybU1ldGhvZC5zb3VuZCl9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLl9tZXNzYWdlLFxyXG4gICAgICAgICAgICBzdGF0ZTogdGhpcy5fc3RhdGUsXHJcbiAgICAgICAgICAgIG1ldGhvZDogdGhpcy5fbWV0aG9kXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtU3RhdGUge1xyXG4gICAgbm9ybWFsPSAnbm9ybWFsJyxcclxuICAgIGFsZXJ0PSAnYWxlcnQnLFxyXG4gICAgd2Fybj0gJ3dhcm4nLFxyXG4gICAgYWxhcm09ICdhbGFybScsXHJcbiAgICBlbWVyZ2VuY3k9ICdlbWVyZ2VuY3knXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBBbGFybU1ldGhvZCB7XHJcbiAgICB2aXN1YWw9ICd2aXN1YWwnLFxyXG4gICAgc291bmQ9ICdzb3VuZCdcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtVHlwZSB7XHJcbiAgICBtb2I9ICdub3RpZmljYXRpb25zLm1vYicsXHJcbiAgICBmaXJlPSAnbm90aWZpY2F0aW9ucy5maXJlJyxcclxuICAgIHNpbmtpbmc9ICdub3RpZmljYXRpb25zLnNpbmtpbmcnLFxyXG4gICAgZmxvb2Rpbmc9ICdub3RpZmljYXRpb25zLmZsb29kaW5nJyxcclxuICAgIGNvbGxpc2lvbj0gJ25vdGlmaWNhdGlvbnMuY29sbGlzaW9uJyxcclxuICAgIGdyb3VuZGluZz0gJ25vdGlmaWNhdGlvbnMuZ3JvdW5kaW5nJyxcclxuICAgIGxpc3Rpbmc9ICdub3RpZmljYXRpb25zLmxpc3RpbmcnLFxyXG4gICAgYWRyaWZ0PSAnbm90aWZpY2F0aW9ucy5hZHJpZnQnLFxyXG4gICAgcGlyYWN5PSAnbm90aWZpY2F0aW9ucy5waXJhY3knLFxyXG4gICAgYWJhbmRvbj0gJ25vdGlmaWNhdGlvbnMuYWJhbmRvbidcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUGF0aCB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtIdHRwIHtcclxuXHJcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nO1xyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIHB1YmxpYyBzZXJ2ZXI6IGFueTtcclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH0gICAgXHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7IH0gICBcclxuICAgIFxyXG4gICAgLy8gKiogZ2V0IHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGYuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5nZXQoYHZlc3NlbHMvc2VsZmApIH1cclxuXHJcbiAgICAvLyoqIGdldCBJRCBvZiB2ZXNzZWwgc2VsZiB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGZJZCgpIHsgcmV0dXJuIHRoaXMuZ2V0KGBzZWxmYCkgfVxyXG5cclxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcclxuICAgIGdldE1ldGEoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChgJHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfS9tZXRhYCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vKiogZ2V0IEFQSSBwYXRoIHZhbHVlIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vKiogc2VuZCB2YWx1ZSB0byBBUEkgcGF0aCB2aWEgaHR0cCBQVVQuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XHJcbiAgICBwdXQoYzpzdHJpbmcsIHA6YW55LCBrPzphbnksIHY/OmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGxldCBjb250ZXh0OnN0cmluZztcclxuICAgICAgICBsZXQgcGF0aDpzdHJpbmc7XHJcbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXHJcbiAgICAgICAgLy8gKiogcGF0aCAvIHZhbHVlXHJcbiAgICAgICAgaWYodHlwZW9mIGs9PSd1bmRlZmluZWQnICYmIHR5cGVvZiB2PT0ndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZihjWzBdPT0nLycpIHsgYz0gYy5zbGljZSgxKSB9XHJcbiAgICAgICAgICAgIHBhdGg9IFBhdGguZG90VG9TbGFzaChjKTtcclxuICAgICAgICAgICAgY29udGV4dD0gJyc7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gKiogY29udGV4dCAvIHBhdGggLyB2YWx1ZVxyXG4gICAgICAgIGVsc2UgaWYodHlwZW9mIHY9PSd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBjb250ZXh0PSAoYykgPyBQYXRoLmNvbnRleHRUb1BhdGgoYykgOiAnJztcclxuICAgICAgICAgICAgcGF0aD1QYXRoLmRvdFRvU2xhc2gocCk7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7ICAvLyAqKiBjb250ZXh0IC8gcGF0aCAvIGtleSAvIHZhbHVlXHJcbiAgICAgICAgICAgIGNvbnRleHQ9IChjKSA/IFBhdGguY29udGV4dFRvUGF0aChjKSA6ICcnO1xyXG4gICAgICAgICAgICBsZXQgdD0gUGF0aC5kb3RUb1NsYXNoKHApLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgIHQucHVzaChrKTtcclxuICAgICAgICAgICAgcGF0aD0gdC5qb2luKCcvJyk7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gdjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vICoqIHBhdGNoIGZvciBub2RlIHNlcnZlciBQVVQgaGFuZGxpbmcgb2YgcmVzb3VyY2VzXHJcbiAgICAgICAgbGV0IHI9IHBhdGguc3BsaXQoJy8nKTtcclxuICAgICAgICBpZihyWzBdPT0ncmVzb3VyY2VzJykgeyBcclxuICAgICAgICAgICAgY29udGV4dD0gJyc7ICBcclxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXIuaWQ9PSdzaWduYWxrLXNlcnZlci1ub2RlJykgeyAvLyAqKiBjaGVjayBmb3Igbm9kZSBzZXJ2ZXJcclxuICAgICAgICAgICAgICAgIC8vICoqIHJlLWZvcm1hdCB2YWx1ZSB7IHV1aWQ6IHsgPHJlc291cmNlX2RhdGE+IH19XHJcbiAgICAgICAgICAgICAgICBsZXQgdj0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtc2cudmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIG1zZy52YWx1ZT0ge31cclxuICAgICAgICAgICAgICAgIG1zZy52YWx1ZVtyW3IubGVuZ3RoLTFdXT12O1xyXG4gICAgICAgICAgICAgICAgLy8gKiogYWRkIHNlbGYgY29udGV4dCBhbmQgcmVtb3ZlIHV1aWQgZnJvbSBwYXRoXHJcbiAgICAgICAgICAgICAgICBwYXRoPSAndmVzc2Vscy9zZWxmLycgKyByLnNsaWNlKDAsIHIubGVuZ3RoLTEpLmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgICAgIGNvbnRleHQ9IChjb250ZXh0KSA/IGNvbnRleHQgKyAnLycgOiAnJztcclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgY29udGV4dCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2cpIH1cclxuICAgIH0gXHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIFBPU1QuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5lbmRwb2ludH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfVxyXG4gICAgfSAgICAgXHJcblxyXG4gICAgLy8qKiBkZWxldGUgdmFsdWUgZnJvbSBBUEkgcGF0aCB2aWEgaHR0cCBERUxFVEUuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBkZWxldGUocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5lbmRwb2ludH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodXJsKSB9XHJcbiAgICB9ICAgICAgXHJcblxyXG59ICIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlLCBBbGFybSwgQWxhcm1UeXBlIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbSB7XHJcblxyXG5cdHByaXZhdGUgX2Nvbm5lY3Q6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX2Nsb3NlOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX21lc3NhZ2U6IFN1YmplY3Q8YW55PjtcclxuXHJcbiAgICBwcml2YXRlIHdzOiBhbnk7ICAgIFxyXG4gICAgcHJpdmF0ZSBfZmlsdGVyPSBudWxsOyAgICAgICAgICAgICAgIC8vICoqIGlkIG9mIHZlc3NlbCB0byBmaWx0ZXIgZGVsdGEgbWVzc2FnZXNcclxuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0ICBcclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICBcclxuICAgIHByaXZhdGUgX3BsYXliYWNrTW9kZTogYm9vbGVhbj0gZmFsc2U7XHJcbiAgICBcclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIHB1YmxpYyBvbkNvbm5lY3Q6IE9ic2VydmFibGU8YW55PjtcdFx0XHJcbiAgICBwdWJsaWMgb25DbG9zZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgcHVibGljIHNlbGZJZDogc3RyaW5nO1xyXG4gICAgcHVibGljIF9zb3VyY2U6IGFueT0gbnVsbDtcclxuXHJcbiAgICAvLyAqKiBzZXQgc291cmNlIGxhYmVsIGZvciB1c2UgaW4gbWVzc2FnZXNcclxuICAgIHNldCBzb3VyY2UodmFsOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5fc291cmNlKSB7IHRoaXMuX3NvdXJjZT0ge30gfVxyXG4gICAgICAgIHRoaXMuX3NvdXJjZVsnbGFiZWwnXT0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXHJcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcclxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxyXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcclxuICAgIH0gICBcclxuICAgIC8vICoqIGlzIFdTIFN0cmVhbSBjb25uZWN0ZWQ/XHJcbiAgICBnZXQgaXNPcGVuKCk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXHJcbiAgICBnZXQgZmlsdGVyKCk6c3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XHJcbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xyXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIGlkICYmIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj0gKHRoaXMuc2VsZklkKSA/IHRoaXMuc2VsZklkIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gaWQgfVxyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIFBsYXliYWNrIEhlbGxvIG1lc3NhZ2VcclxuICAgIGdldCBwbGF5YmFja01vZGUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuX3BsYXliYWNrTW9kZSB9XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoICkgeyBcclxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgICAgICAgIFxyXG4gICAgfSAgIFxyXG5cclxuICAgIC8vICoqIENsb3NlIFdlYlNvY2tldCBjb25uZWN0aW9uXHJcbiAgICBjbG9zZSgpIHsgaWYodGhpcy53cykgeyB0aGlzLndzLmNsb3NlKCk7IHRoaXMud3M9IG51bGw7IH0gfVxyXG4gICBcclxuXHQvLyAqKiBPcGVuIGEgV2ViU29ja2V0IGF0IHByb3ZpZGVkIHVybFxyXG5cdG9wZW4odXJsOnN0cmluZywgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcclxuICAgICAgICB1cmw9ICh1cmwpID8gdXJsIDogdGhpcy5lbmRwb2ludDtcclxuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IHE9ICh1cmwuaW5kZXhPZignPycpPT0tMSkgPyAnPycgOiAnJidcclxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gJHtxfXN1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4gfHwgdG9rZW4pIHsgdXJsKz0gYCR7KHN1YnNjcmliZSkgPyAnJicgOiAnPyd9dG9rZW49JHt0aGlzLl90b2tlbiB8fCB0b2tlbn1gIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxyXG4gICAgICAgIHNldFRpbWVvdXQoIFxyXG4gICAgICAgICAgICAoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxyXG4gICAgICAgICk7XHJcblx0XHRcclxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5fZXJyb3IubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHt0aGlzLnBhcnNlT25NZXNzYWdlKGUpIH1cclxuICAgIH0gIFxyXG4gICAgXHJcbiAgICAvLyAqKiBwYXJzZSByZWNlaXZlZCBtZXNzYWdlXHJcbiAgICBwcml2YXRlIHBhcnNlT25NZXNzYWdlKGUpIHtcclxuICAgICAgICBsZXQgZGF0YTogYW55O1xyXG4gICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7IFxyXG4gICAgICAgICAgICB0aGlzLnNlbGZJZD0gZGF0YS5zZWxmO1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFja01vZGU9ICh0eXBlb2YgZGF0YS5zdGFydFRpbWUhPSAndW5kZWZpbmVkJykgPyB0cnVlIDogZmFsc2U7ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpO1xyXG4gICAgICAgIH0gICAgICBcclxuICAgICAgICBlbHNlIGlmKHRoaXMuaXNSZXNwb25zZShkYXRhKSkgeyBcclxuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEubG9naW4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgZGF0YS5sb2dpbi50b2tlbiAhPT0gJ3VuZGVmaW5lZCcpIHsgdGhpcy5fdG9rZW49IGRhdGEubG9naW4udG9rZW4gfVxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSk7XHJcbiAgICAgICAgfSAgICAgICAgICAgICBcclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcclxuICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG4gICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgcmVxdWVzdCB2aWEgRGVsdGEgc3RyZWFtXHJcbiAgICBzZW5kUmVxdWVzdCh2YWx1ZTphbnkpOnN0cmluZyB7XHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gbnVsbCB9XHJcbiAgICAgICAgbGV0IG1zZz0gTWVzc2FnZS5yZXF1ZXN0KCk7XHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlLmxvZ2luID09PSAndW5kZWZpbmVkJyAmJiB0aGlzLl90b2tlbikgeyBtc2dbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuICAgICAgICBsZXQga2V5cz0gT2JqZWN0LmtleXModmFsdWUpO1xyXG4gICAgICAgIGtleXMuZm9yRWFjaCggaz0+IHsgbXNnW2tdPSB2YWx1ZVtrXSB9KTtcclxuICAgICAgICB0aGlzLnNlbmQobXNnKTtcclxuICAgICAgICByZXR1cm4gbXNnLnJlcXVlc3RJZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZW5kIHB1dCByZXF1ZXN0IHZpYSBEZWx0YSBzdHJlYW1cclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgbXNnPSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxyXG4gICAgICAgICAgICBwdXQ6IHsgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KG1zZyk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcclxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IG1zZz0geyBcclxuICAgICAgICAgICAgbG9naW46IHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9IFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXHJcbiAgICBzZW5kKGRhdGE6YW55KSB7XHJcbiAgICAgICAgaWYodGhpcy53cykge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgdmFsdWUocykgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOiBzdHJpbmcgfCBBcnJheTxhbnk+LCB2YWx1ZT86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51cGRhdGVzKCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBsZXQgdVZhbHVlcz0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXMucHVzaCh7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXM9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1PSB7IFxyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgXHJcbiAgICAgICAgICAgIHZhbHVlczogdVZhbHVlcyBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc291cmNlKSB7IHVbJ3NvdXJjZSddPSB0aGlzLl9zb3VyY2UgfVxyXG4gICAgICAgIHZhbC51cGRhdGVzLnB1c2goIHUgKTsgXHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogU3Vic2NyaWJlIHRvIERlbHRhIHN0cmVhbSBtZXNzYWdlcyBvcHRpb25zOiB7Li59KipcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZywgcGF0aDpBcnJheTxhbnk+KTtcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIG9wdGlvbnM/OmFueSk7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZyB8IEFycmF5PGFueT49JyonLCBvcHRpb25zPzphbnkpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnN1YnNjcmliZSgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnN1YnNjcmliZT0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxldCBzVmFsdWU9IHt9O1xyXG4gICAgICAgICAgICBzVmFsdWVbJ3BhdGgnXT0gcGF0aDtcclxuICAgICAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BlcmlvZCddKSB7IHNWYWx1ZVsncGVyaW9kJ109IG9wdGlvbnNbJ3BlcmlvZCddIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ21pblBlcmlvZCddKSB7IHNWYWx1ZVsnbWluUGVyaW9kJ109IG9wdGlvbnNbJ3BlcmlvZCddIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ2Zvcm1hdCddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydmb3JtYXQnXT09J2RlbHRhJyB8fCBvcHRpb25zWydmb3JtYXQnXT09J2Z1bGwnKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNWYWx1ZVsnZm9ybWF0J109IG9wdGlvbnNbJ2Zvcm1hdCddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1sncG9saWN5J10gJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnNbJ3BvbGljeSddPT0naW5zdGFudCcgfHwgb3B0aW9uc1sncG9saWN5J109PSdpZGVhbCdcclxuICAgICAgICAgICAgICAgICAgICB8fCBvcHRpb25zWydwb2xpY3knXT09J2ZpeGVkJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ3BvbGljeSddPSBvcHRpb25zWydwb2xpY3knXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWwuc3Vic2NyaWJlLnB1c2goc1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBVbnN1YnNjcmliZSBmcm9tIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxyXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOmFueT0nKicpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICB2YWwudW5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykgeyB2YWwudW5zdWJzY3JpYmUucHVzaCh7cGF0aDogcGF0aH0pIH1cclxuICAgICAgICB0aGlzLnNlbmQodmFsKTsgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcmFpc2UgYWxhcm0gZm9yIHBhdGhcclxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmcsIG5hbWU6c3RyaW5nLCBhbGFybTpBbGFybSk7XHJcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nLCB0eXBlOkFsYXJtVHlwZSwgYWxhcm06QWxhcm0pO1xyXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZz0nKicsIGFsYXJtSWQ6YW55LCBhbGFybTpBbGFybSkge1xyXG4gICAgICAgIGxldCBuOnN0cmluZztcclxuICAgICAgICBpZih0eXBlb2YgYWxhcm1JZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbj0oYWxhcm1JZC5pbmRleE9mKCdub3RpZmljYXRpb25zLicpPT0tMSkgPyBgbm90aWZpY2F0aW9ucy4ke2FsYXJtSWR9YCA6IGFsYXJtSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyBuPSBhbGFybUlkIH1cclxuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgbiwgYWxhcm0udmFsdWUgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiByYWlzZSBhbGFybSBmb3IgcGF0aFxyXG4gICAgY2xlYXJBbGFybShjb250ZXh0OnN0cmluZz0nKicsIG5hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IG49KG5hbWUuaW5kZXhPZignbm90aWZpY2F0aW9ucy4nKT09LTEpID8gYG5vdGlmaWNhdGlvbnMuJHtuYW1lfWAgOiBuYW1lO1xyXG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBuLCBudWxsKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqIE1FU1NBR0UgUEFSU0lORyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGNvbnRleHQgaXMgJ3NlbGYnXHJcbiAgICBpc1NlbGYobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiAobXNnLmNvbnRleHQ9PSB0aGlzLnNlbGZJZCkgfVxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXHJcbiAgICBpc0RlbHRhKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5jb250ZXh0IT0gJ3VuZGVmaW5lZCcgfVxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSBIZWxsbyBtZXNzYWdlXHJcbiAgICBpc0hlbGxvKG1zZzphbnkpOmJvb2xlYW4geyBcclxuICAgICAgICByZXR1cm4gKHR5cGVvZiBtc2cudmVyc2lvbiE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc2cuc2VsZiE9ICd1bmRlZmluZWQnKTtcclxuICAgIH0gICAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSByZXF1ZXN0IFJlc3BvbnNlIG1lc3NhZ2VcclxuICAgIGlzUmVzcG9uc2UobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiB0eXBlb2YgbXNnLnJlcXVlc3RJZCE9ICd1bmRlZmluZWQnIH0gXHJcbn0iLCIvKiogV2ViIFdvcmtlciBTZXJ2aWNlXHJcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbVdvcmtlciAge1xyXG5cclxuXHRwcml2YXRlIF9lcnJvcjogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX21lc3NhZ2U6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgd29ya2VyOiBXb3JrZXI7XHJcbiAgICBcclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG5cclxuICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICB9IFxyXG5cclxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTsgdGhpcy53b3JrZXIgPSB1bmRlZmluZWQ7IH1cclxuXHJcbiAgICAvLyAqKiBJbml0aWFsaXNlIHdvcmtlclxyXG4gICAgaW5pdChwYXRoVG9GaWxlOnN0cmluZykgeyBcclxuICAgICAgICBpZih0eXBlb2YoV29ya2VyKT09IFwidW5kZWZpbmVkXCIpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICBpZih0aGlzLndvcmtlcikgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKSB9ICAgLy8gKiogdGVybWluYXRlIGFuIG9wZW4gd29ya2VyXHJcblxyXG4gICAgICAgIHRoaXMud29ya2VyPSBuZXcgV29ya2VyKHBhdGhUb0ZpbGUpO1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9ubWVzc2FnZT0gZXZlbnQ9PiB7IHRoaXMuX21lc3NhZ2UubmV4dChldmVudCkgfTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbmVycm9yPSBldmVudD0+IHsgdGhpcy5fZXJyb3IubmV4dChldmVudCkgfTsgICAgICAgICAgIFxyXG4gICAgICAgIC8vICoqIHdvcmtlciByZWFkeSBmb3IgcG9zdE1lc3NhZ2UoKVxyXG4gICAgfSAgICBcclxuICAgIFxyXG4gICAgLy8gKiogU2VuZCBtZXNzYWdlIHRvIHdvcmtlclxyXG4gICAgcG9zdE1lc3NhZ2UobXNnOmFueSkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnBvc3RNZXNzYWdlKG1zZykgfSB9XHJcblxyXG4gICAgLy8gKiogdGVybWluYXRlIHdvcmtlclxyXG4gICAgdGVybWluYXRlKCkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnRlcm1pbmF0ZSgpfSB9XHJcbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBTaWduYWxLSHR0cCB9IGZyb20gJy4vaHR0cC1hcGknO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbSB9IGZyb20gJy4vc3RyZWFtLWFwaSc7XG5pbXBvcnQgeyBQYXRoLCBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtV29ya2VyfSBmcm9tICcuL3N0cmVhbS13b3JrZXInO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuICAgIFxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHB1YmxpYyBzZXJ2ZXI9IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXVxuICAgIH0gICAgXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgXG4gICAgICAgIHRoaXMuX3Rva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuYXBpLmF1dGhUb2tlbj0gdmFsO1xuICAgICAgICB0aGlzLnN0cmVhbS5hdXRoVG9rZW49IHZhbDtcbiAgICB9ICAgIFxuICAgIC8vICoqIE1lc3NhZ2UgT2JqZWN0XG4gICAgZ2V0IG1lc3NhZ2UoKSB7IHJldHVybiBNZXNzYWdlIH1cblxuICAgIC8vICoqIGdlbmVyYXRlIGFuZCByZXR1cm4gYSBVVUlEIG9iamVjdFxuICAgIGdldCB1dWlkKCk6VVVJRCB7IHJldHVybiBuZXcgVVVJRCgpIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBcbiAgICAgICAgICAgICAgICBwdWJsaWMgYXBpOiBTaWduYWxLSHR0cCwgXG4gICAgICAgICAgICAgICAgcHVibGljIHN0cmVhbTogU2lnbmFsS1N0cmVhbSxcbiAgICAgICAgICAgICAgICBwdWJsaWMgd29ya2VyOiBTaWduYWxLU3RyZWFtV29ya2VyICkgeyBcbiAgICAgICAgdGhpcy5pbml0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9ICAgXG4gICAgXG4gICAgLy8gKiogaW5pdGlhbGlzZSBwcm90b2NvbCwgaG9zdG5hbWUsIHBvcnQgdmFsdWVzXG4gICAgcHJpdmF0ZSBpbml0KGhvc3RuYW1lOnN0cmluZz0nbG9jYWxob3N0JywgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5ob3N0bmFtZSA9IGhvc3RuYW1lO1xuICAgICAgICBpZih1c2VTU0wpIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cHMnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA0NDM7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgODA7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH0gICAgXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIENPTk5FQ1RJT04gQU5EIERJU0NPVkVSWSAgKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIFNpZ25hbCBLIHNlcnZlciBlbmRwb2ludCBkaXNjb3ZlcnkgcmVxdWVzdCAoL3NpZ25hbGspLiAgXG4gICAgaGVsbG8oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCcvc2lnbmFsaycpO1xuICAgIH0gICAgXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXIgKGVuZHBvaW50IGRpc2NvdmVyeSkgYW5kIERPIE5PVCBvcGVuIFN0cmVhbVxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgICAgICB0aGlzLmhlbGxvKGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpLnN1YnNjcmliZSggICAgLy8gKiogZGlzY292ZXIgZW5kcG9pbnRzICoqXG4gICAgICAgICAgICAgICAgcmVzcG9uc2U9PiB7IFxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnN0cmVhbSkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLmVuZHBvaW50PSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKTsgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGRpc2Nvbm5lY3QgZnJvbSBzZXJ2ZXJcbiAgICBkaXNjb25uZWN0KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpOyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTsgfVxuICAgIFxuICAgIC8vICoqIENvbm5lY3QgKyBvcGVuIERlbHRhIFN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RTdHJlYW0oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCwgc3Vic2NyaWJlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCBlPT4geyByZWplY3QoIGUgKSB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFBsYXliYWNrKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgb3B0aW9uczphbnkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5QbGF5YmFjayhudWxsLCBvcHRpb25zLCB0aGlzLl90b2tlbik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pXG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5TdHJlYW0odXJsOnN0cmluZz1udWxsLCBzdWJzY3JpYmU/OnN0cmluZywgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuU3RyZWFtLi4uLi4uLi4uJyk7ICBcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSwgdG9rZW4pOyAgXG4gICAgICAgIHJldHVybiB0cnVlOyAgICAgIFxuICAgIH0gICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChOTyBlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgb3BlblBsYXliYWNrKHVybDpzdHJpbmc9bnVsbCwgb3B0aW9ucz86YW55LCB0b2tlbj86c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ29wZW5QbGF5YmFjay4uLi4uLi4uLicpO1xuICAgICAgICBpZighdXJsKSB7ICAgICAvLyBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgZGlzY292ZXJlZCBlbmRwb2ludFxuICAgICAgICAgICAgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4oIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVybD0gdXJsLnJlcGxhY2UoJ3N0cmVhbScsICdwbGF5YmFjaycpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgbGV0IHBiPSAnJztcbiAgICAgICAgbGV0IHN1YnNjcmliZTogc3RyaW5nO1xuICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSdvYmplY3QnKXtcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMuc3RhcnRUaW1lKSA/ICc/c3RhcnRUaW1lPScgKyBvcHRpb25zLnN0YXJ0VGltZS5zbGljZSgwLG9wdGlvbnMuc3RhcnRUaW1lLmluZGV4T2YoJy4nKSkgKyAnWicgOiAnJztcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMucGxheWJhY2tSYXRlKSA/IGAmcGxheWJhY2tSYXRlPSR7b3B0aW9ucy5wbGF5YmFja1JhdGV9YCA6ICcnO1xuICAgICAgICAgICAgc3Vic2NyaWJlPSAob3B0aW9ucy5zdWJzY3JpYmUpID8gb3B0aW9ucy5zdWJzY3JpYmUgOiBudWxsOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsICsgcGIsIHN1YnNjcmliZSwgdG9rZW4pOyBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogcHJvY2VzcyBIZWxsbyByZXNwb25zZSBcbiAgICBwcml2YXRlIHByb2Nlc3NIZWxsbyhyZXNwb25zZTogYW55KSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0gKHJlc3BvbnNlWydzZXJ2ZXInXSkgPyByZXNwb25zZVsnc2VydmVyJ10gOiB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9ICh0aGlzLnNlcnZlci5lbmRwb2ludHMpID8gT2JqZWN0LmtleXModGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA6IFtdO1xuICAgICAgICB0aGlzLmRlYnVnKHRoaXMuc2VydmVyLmVuZHBvaW50cyk7XG4gICAgICAgIHRoaXMuYXBpLnNlcnZlcj0gdGhpcy5zZXJ2ZXIuaW5mbztcbiAgICB9XG5cbiAgICAvLyAqKiByZXR1cm4gcHJlZmVycmVkIFdTIHN0cmVhbSB1cmxcbiAgICBwdWJsaWMgcmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk6c3RyaW5nIHtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIGVuZHBvaW50IHZlcnNpb246ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBmYWxsaW5nIGJhY2sgdG86IHYxYCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ119YCBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIG51bGwgfVxuICAgIH0gIFxuXG4gICAgLy8gKiogcmV0dXJuIHNpZ25hbGstaHR0cCBlbmRwb2ludCB1cmxcbiAgICBwcml2YXRlIHJlc29sdmVIdHRwRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSkgeyAvLyAqKiBjb25uZWN0aW9uIG1hZGVcbiAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gaHR0cCBlbmRwb2ludCBhdCBwcmVzY3JpYmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddKSB7XG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstaHR0cCddfWAgfSAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtc2c9ICdObyBjdXJyZW50IGNvbm5lY3Rpb24gaHR0cCBlbmRwb2ludCBzZXJ2aWNlISBVc2UgY29ubmVjdCgpIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uJ1xuICAgICAgICAgICAgdGhpcy5kZWJ1Zyhtc2cpO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdXJsOyAgIFxuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY2xlYW51cCBvbiBzZXJ2ZXIgZGlzY29ubmVjdGlvblxuICAgIHByaXZhdGUgZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgIFxuICAgIH1cblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIHBhdGhcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBnZXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwdXQgdG8gaHR0cCBwYXRoXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwdXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTtcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHBvc3QgdG8gaHR0cCBwYXRoXG4gICAgcG9zdChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcG9zdCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07ICAgXG5cbiAgICAvLyAqKiBnZXQgYXV0aCB0b2tlbiBmb3Igc3VwcGxpZWQgdXNlciBkZXRhaWxzICoqXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgYGFwcGxpY2F0aW9uL2pzb25gKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXHRcbiAgICAvLyAqKiBsb2dvdXQgZnJvbSBzZXJ2ZXIgKipcbiAgICBsb2dvdXQoKSB7XG5cdFx0bGV0IHVybD1gJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ291dGA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCwgeyBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsICkgfVxuICAgIH1cdCAgIFxuICAgIFxuICAgIC8vKiogZ2V0IGRhdGEgdmlhIHRoZSBzbmFwc2hvdCBodHRwIGFwaSBwYXRoIGZvciBzdXBwbGllZCB0aW1lXG4gICAgc25hcHNob3QoY29udGV4dDpzdHJpbmcsIHRpbWU6c3RyaW5nKSB7IFxuICAgICAgICBpZighdGltZSkgeyByZXR1cm4gfVxuICAgICAgICB0aW1lPSB0aW1lLnNsaWNlKDAsdGltZS5pbmRleE9mKCcuJykpICsgJ1onO1xuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICB1cmw9IGAke3VybC5yZXBsYWNlKCdhcGknLCdzbmFwc2hvdCcpfSR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfT90aW1lPSR7dGltZX1gO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxuICAgIH1cblxufVxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIFNpZ25hbEtDbGllbnQgTW9kdWxlOlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogWyBIdHRwQ2xpZW50TW9kdWxlIF0sICAgIFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOiBbXSwgXHJcbiAgICBwcm92aWRlcnM6IFtdICBcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnRNb2R1bGUge31cclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vc2lnbmFsay1jbGllbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3V0aWxzJzsiXSwibmFtZXMiOlsiSHR0cEhlYWRlcnMiLCJJbmplY3RhYmxlIiwiSHR0cENsaWVudCIsIlN1YmplY3QiLCJpc0Rldk1vZGUiLCJOZ01vZHVsZSIsIkh0dHBDbGllbnRNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUtBOzs7OztRQWVJO1lBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFdEMsSUFBSSxDQUFD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