(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('signalk-client-angular', ['exports', '@angular/core', '@angular/common/http', 'rxjs'], factory) :
    (factory((global['signalk-client-angular'] = {}),global.ng.core,global.ng.common.http,global.rxjs));
}(this, (function (exports,i0,i1,rxjs) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                if (path.indexOf('.') != -1) {
                    return path.split('.').join('/');
                }
                else {
                    return path;
                }
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
        flodding: 'notifications.flooding',
        collision: 'notifications.collision',
        grounding: 'notifications.grounding',
        listing: 'notifications.listing',
        adrift: 'notifications.adrift',
        piracy: 'notifications.piracy',
        abandon: 'notifications.abandon',
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SignalKHttp = /** @class */ (function () {
        // *******************************************************
        function SignalKHttp(http) {
            this.http = http;
        }
        Object.defineProperty(SignalKHttp.prototype, "token", {
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
         * @param {?} context
         * @param {?} path
         * @param {?=} key
         * @param {?=} value
         * @return {?}
         */
        SignalKHttp.prototype.put = /**
         * @param {?} context
         * @param {?} path
         * @param {?=} key
         * @param {?=} value
         * @return {?}
         */
            function (context, path, key, value) {
                if (!this.endpoint) {
                    return;
                }
                if (path[0] == '/') {
                    path = path.slice(1);
                }
                /** @type {?} */
                var url = this.endpoint + Path.contextToPath(context) + '/' + Path.dotToSlash(path);
                /** @type {?} */
                var msg = { value: {} };
                if (typeof value == 'undefined') {
                    msg.value = key;
                }
                else {
                    msg.value[key] = value;
                }
                if (this._token) {
                    /** @type {?} */
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.put(url, msg, { headers: headers });
                }
                else {
                    return this.http.put(url, msg);
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        Object.defineProperty(SignalKStream.prototype, "token", {
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
                setTimeout(function () {
                    if (_this.ws && (_this.ws.readyState != 1 && _this.ws.readyState != 3)) {
                        console.warn("Connection watchdog expired (" + _this._wsTimeout / 1000 + " sec): " + _this.ws.readyState + "... aborting connection...");
                        _this.close();
                    }
                }, this._wsTimeout);
                this.ws.onopen = function (e) { _this._connect.next(e); };
                this.ws.onclose = function (e) { _this._close.next(e); };
                this.ws.onerror = function (e) { _this._error.next(e); };
                this.ws.onmessage = function (e) { _this.parseOnMessage(e); };
            };
        // ** parse received message
        // ** parse received message
        /**
         * @param {?} e
         * @return {?}
         */
        SignalKStream.prototype.parseOnMessage =
            // ** parse received message
            /**
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
                else if (this._filter && this.isDelta(data)) {
                    if (data.context == this._filter) {
                        this._message.next(data);
                    }
                }
                else {
                    this._message.next(data);
                }
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                this.worker.onmessage = function (event) { _this._message.next(event); };
                this.worker.onerror = function (event) { _this._error.next(event); };
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                this.api.token = val;
                this.stream.token = val;
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
                return new Promise(function (resolve, reject) {
                    _this.debug('Contacting Signal K server.........');
                    _this.hello(hostname, port, useSSL).subscribe(// ** discover endpoints **
                    function (// ** discover endpoints **
                    response) {
                        if (_this.stream) {
                            _this.stream.close();
                        }
                        _this.processHello(response);
                        _this.api.endpoint = _this.resolveHttpEndpoint();
                        _this.stream.endpoint = _this.resolveStreamEndpoint();
                        resolve(true);
                    }, function (error) {
                        _this.disconnectedFromServer();
                        reject(error);
                    });
                });
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
                return new Promise(function (resolve, reject) {
                    _this.connect(hostname, port, useSSL)
                        .then(function () {
                        // ** connect to stream api at preferred version else fall back to default version
                        /** @type {?} */
                        var url = _this.resolveStreamEndpoint();
                        if (!url) {
                            reject(new Error('Server has no advertised Stream endpoints!'));
                            return;
                        }
                        _this.stream.open(url, subscribe);
                        resolve(true);
                    })
                        .catch(function (e) { reject(e); });
                });
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
                return new Promise(function (resolve, reject) {
                    _this.connect(hostname, port, useSSL)
                        .then(function () {
                        // ** connect to playback api at preferred version else fall back to default version
                        _this.openPlayback(null, options, _this._token);
                        resolve(true);
                    })
                        .catch(function (e) { reject(e); });
                });
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V1aWQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V0aWxzLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9odHRwLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLXdvcmtlci50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBVVUlEOiBBIGpzIGxpYnJhcnkgdG8gZ2VuZXJhdGUgYW5kIHBhcnNlIFVVSURzLCBUaW1lVVVJRHMgYW5kIGdlbmVyYXRlXHJcbiAqIFRpbWVVVUlEIGJhc2VkIG9uIGRhdGVzIGZvciByYW5nZSBzZWxlY3Rpb25zLlxyXG4gKiBAc2VlIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XHJcbiAqKi9cclxuZXhwb3J0IGNsYXNzIFVVSUQge1xyXG5cclxuICAgIHByaXZhdGUgbGltaXRVSTA0O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDY7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwODtcclxuICAgIHByaXZhdGUgbGltaXRVSTEyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTMyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJNDA7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0ODtcclxuXHJcbiAgICBwcml2YXRlIHZlcnNpb246bnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBoZXg6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA0ID0gdGhpcy5tYXhGcm9tQml0cyg0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwNiA9IHRoaXMubWF4RnJvbUJpdHMoNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDggPSB0aGlzLm1heEZyb21CaXRzKDgpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTEyID0gdGhpcy5tYXhGcm9tQml0cygxMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTQgPSB0aGlzLm1heEZyb21CaXRzKDE0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNiA9IHRoaXMubWF4RnJvbUJpdHMoMTYpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTMyID0gdGhpcy5tYXhGcm9tQml0cygzMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJNDAgPSB0aGlzLm1heEZyb21CaXRzKDQwKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0OCA9IHRoaXMubWF4RnJvbUJpdHMoNDgpOyBcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMuaGV4IH1cclxuICAgIHRvVVJOKCkgeyByZXR1cm4gJ3Vybjp1dWlkOicgKyB0aGlzLmhleCB9XHJcbiAgICB0b1NpZ25hbEsoKTpzdHJpbmcgIHsgcmV0dXJuIGB1cm46bXJuOnNpZ25hbGs6dXVpZDoke3RoaXMuaGV4fWAgfVxyXG4gICAgdG9CeXRlcygpIHtcclxuICAgICAgICBsZXQgcGFydHMgPSB0aGlzLmhleC5zcGxpdCgnLScpO1xyXG4gICAgICAgIGxldCBpbnRzID0gW107XHJcbiAgICAgICAgbGV0IGludFBvcyA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldLmxlbmd0aDsgais9Mikge1xyXG4gICAgICAgICAgICBpbnRzW2ludFBvcysrXSA9IHBhcnNlSW50KHBhcnRzW2ldLnN1YnN0cihqLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnRzO1xyXG4gICAgfTsgICAgXHJcblxyXG4gICAgcHJpdmF0ZSBtYXhGcm9tQml0cyhiaXRzKSB7IHJldHVybiBNYXRoLnBvdygyLCBiaXRzKSB9O1xyXG5cclxuICAgIHByaXZhdGUgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7IHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluIH1cclxuXHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNi0xKTt9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDgoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwOC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMzIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkzMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJNDAoKSB7IHJldHVybiAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCAzMCkpICsgKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgNDAgLSAzMCkpICogKDEgPDwgMzApIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0OCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0OCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIHRoaXMuZnJvbVBhcnRzKFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMzIoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTE2KCksXHJcbiAgICAgICAgICAgIDB4NDAwMCB8IHRoaXMucmFuZG9tVUkxMigpLFxyXG4gICAgICAgICAgICAweDgwICAgfCB0aGlzLnJhbmRvbVVJMDYoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTA4KCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUk0OCgpXHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBwYWRkZWRTdHJpbmcoc3RyaW5nLCBsZW5ndGgsIHo9bnVsbCkge1xyXG4gICAgICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xyXG4gICAgICAgIHogPSAoIXopID8gJzAnIDogejtcclxuICAgICAgICBsZXQgaSA9IGxlbmd0aCAtIHN0cmluZy5sZW5ndGg7XHJcbiAgICAgICAgZm9yICg7IGkgPiAwOyBpID4+Pj0gMSwgeiArPSB6KSB7XHJcbiAgICAgICAgICAgIGlmIChpICYgMSkge1xyXG4gICAgICAgICAgICBzdHJpbmcgPSB6ICsgc3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJpbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZnJvbVBhcnRzKHRpbWVMb3csIHRpbWVNaWQsIHRpbWVIaUFuZFZlcnNpb24sIGNsb2NrU2VxSGlBbmRSZXNlcnZlZCwgY2xvY2tTZXFMb3csIG5vZGUpIHtcclxuICAgICAgICB0aGlzLnZlcnNpb24gPSAodGltZUhpQW5kVmVyc2lvbiA+PiAxMikgJiAweEY7XHJcbiAgICAgICAgdGhpcy5oZXggPSB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTG93LnRvU3RyaW5nKDE2KSwgOClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTWlkLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lSGlBbmRWZXJzaW9uLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhjbG9ja1NlcUhpQW5kUmVzZXJ2ZWQudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxTG93LnRvU3RyaW5nKDE2KSwgMilcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhub2RlLnRvU3RyaW5nKDE2KSwgMTIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTsgICAgXHJcbiAgICBcclxuICAgIC8qXHJcbiAgICBwcml2YXRlIGdldFRpbWVGaWVsZFZhbHVlcyh0aW1lKSB7XHJcbiAgICAgICAgbGV0IHRzID0gdGltZSAtIERhdGUuVVRDKDE1ODIsIDksIDE1KTtcclxuICAgICAgICBsZXQgaG0gPSAoKHRzIC8gMHgxMDAwMDAwMDApICogMTAwMDApICYgMHhGRkZGRkZGO1xyXG4gICAgICAgIHJldHVybiB7IGxvdzogKCh0cyAmIDB4RkZGRkZGRikgKiAxMDAwMCkgJSAweDEwMDAwMDAwMCxcclxuICAgICAgICAgICAgICAgIG1pZDogaG0gJiAweEZGRkYsIGhpOiBobSA+Pj4gMTYsIHRpbWVzdGFtcDogdHMgfTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVRpbWUodGltZSwgbGFzdDpib29sZWFuKSB7XHJcbiAgICAgICAgbGFzdCA9ICghbGFzdCkgPyBmYWxzZSA6IGxhc3Q7XHJcbiAgICAgICAgbGV0IHRmID0gdGhpcy5nZXRUaW1lRmllbGRWYWx1ZXModGltZSk7XHJcbiAgICAgICAgbGV0IHRsID0gdGYubG93O1xyXG4gICAgICAgIGxldCB0aGF2ID0gKHRmLmhpICYgMHhGRkYpIHwgMHgxMDAwOyAgLy8gc2V0IHZlcnNpb24gJzAwMDEnXHJcbiAgICAgICAgaWYgKGxhc3QgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRCgpLmZyb21QYXJ0cyh0bCwgdGYubWlkLCB0aGF2LCAwLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVVSUQoKS5mcm9tUGFydHModGwsIHRmLm1pZCwgdGhhdiwgMHg4MCB8IHRoaXMubGltaXRVSTA2LCB0aGlzLmxpbWl0VUkwOCAtIDEsIHRoaXMubGltaXRVSTQ4IC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmaXJzdEZyb21UaW1lKHRpbWUpIHsgcmV0dXJuIHRoaXMuZnJvbVRpbWUodGltZSwgZmFsc2UpIH1cclxuICAgIGxhc3RGcm9tVGltZSh0aW1lKSB7IHJldHVybiB0aGlzLmZyb21UaW1lKHRpbWUsIHRydWUpIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBlcXVhbHModXVpZCkge1xyXG4gICAgICAgIGlmICghKHV1aWQgaW5zdGFuY2VvZiBVVUlEKSkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmICh0aGlzLmhleCAhPT0gdXVpZC5oZXgpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVVSTihzdHJJZCkge1xyXG4gICAgICAgIGxldCByO1xyXG4gICAgICAgIGxldCBwID0gL14oPzp1cm46dXVpZDp8XFx7KT8oWzAtOWEtZl17OH0pLShbMC05YS1mXXs0fSktKFswLTlhLWZdezR9KS0oWzAtOWEtZl17Mn0pKFswLTlhLWZdezJ9KS0oWzAtOWEtZl17MTJ9KSg/OlxcfSk/JC9pO1xyXG4gICAgICAgIGlmICgociA9IHAuZXhlYyhzdHJJZCkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb21QYXJ0cyhcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbMV0sIDE2KSwgcGFyc2VJbnQoclsyXSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoclszXSwgMTYpLCBwYXJzZUludChyWzRdLCAxNiksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzVdLCAxNiksIHBhcnNlSW50KHJbNl0sIDE2KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQnl0ZXMoaW50cykge1xyXG4gICAgICAgIGlmIChpbnRzLmxlbmd0aCA8IDUpIHsgcmV0dXJuIG51bGwgfVxyXG4gICAgICAgIGxldCBzdHIgPSAnJztcclxuICAgICAgICBsZXQgcG9zID0gMDtcclxuICAgICAgICBsZXQgcGFydHMgPSBbNCwgMiwgMiwgMiwgNl07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG9jdGV0ID0gaW50c1twb3MrK10udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICBpZiAob2N0ZXQubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIG9jdGV0ID0gJzAnICsgb2N0ZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyICs9IG9jdGV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXJ0c1tpXSAhPT0gNikge1xyXG4gICAgICAgICAgICBzdHIgKz0gJy0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb21VUk4oc3RyKTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbUJpbmFyeShiaW5hcnkpIHtcclxuICAgICAgICBsZXQgaW50cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGludHNbaV0gPSBiaW5hcnkuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAgICAgaWYgKGludHNbaV0gPiAyNTUgfHwgaW50c1tpXSA8IDApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGJ5dGUgaW4gYmluYXJ5IGRhdGEuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbUJ5dGVzKGludHMpO1xyXG4gICAgfTtcclxuICAgICovXHJcblxyXG59OyIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xyXG5cclxuLy8gKiogUGF0aCB1dGlsaXRpZXNcclxuZXhwb3J0IGNsYXNzIFBhdGgge1xyXG5cclxuICAgIC8vICoqIHRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gc2xhc2hcclxuICAgIHN0YXRpYyBkb3RUb1NsYXNoKHBhdGg6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLicpIT0tMSkgeyByZXR1cm4gcGF0aC5zcGxpdCgnLicpLmpvaW4oJy8nKSB9XHJcbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBwYXJzZSBjb250ZXh0IHRvIHZhbGlkIFNpZ25hbCBLIHBhdGhcclxuICAgIHN0YXRpYyBjb250ZXh0VG9QYXRoKGNvbnRleHQ6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGxldCByZXM9IChjb250ZXh0PT0nc2VsZicgKSA/ICd2ZXNzZWxzLnNlbGYnOiBjb250ZXh0O1xyXG4gICAgICAgIHJldHVybiByZXMuc3BsaXQoJy4nKS5qb2luKCcvJyk7XHJcbiAgICB9ICAgIFxyXG5cclxufVxyXG5cclxuLy8gKiogTWVzc2FnZSB0ZW1wbGF0ZXMgKipcclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2Uge1xyXG4gICBcclxuICAgIC8vICoqIHJldHVybiBVUERBVEVTIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgdXBkYXRlcygpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IHZhbHVlczogWyB7cGF0aDogeHgsIHZhbHVlOiB4eCB9IF0gfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1cGRhdGVzOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyAqKiByZXR1cm4gU1VCU0NSSUJFIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgc3Vic2NyaWJlKCkgeyBcclxuICAgICAgICAvKiBhcnJheSB2YWx1ZXM9IHtcclxuICAgICAgICAgICAgXCJwYXRoXCI6IFwicGF0aC50by5rZXlcIixcclxuICAgICAgICAgICAgXCJwZXJpb2RcIjogMTAwMCxcclxuICAgICAgICAgICAgXCJmb3JtYXRcIjogXCJkZWx0YVwiLFxyXG4gICAgICAgICAgICBcInBvbGljeVwiOiBcImlkZWFsXCIsXHJcbiAgICAgICAgICAgIFwibWluUGVyaW9kXCI6IDIwMFxyXG4gICAgICAgICAgICB9ICovXHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICBcclxuICAgIC8vICoqIHJldHVybiBVTlNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVuc3Vic2NyaWJlKCkgeyBcclxuICAgICAgICAvLyBhcnJheSB2YWx1ZXM9IHsgXCJwYXRoXCI6IFwicGF0aC50by5rZXlcIiB9XHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9ICBcclxuICAgIC8vICoqIHJldHVybiBSRVFVRVNUIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgcmVxdWVzdCgpIHsgXHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIHJlcXVlc3RJZDogbmV3IFVVSUQoKS50b1N0cmluZygpXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICAgICAgICAgXHJcblxyXG59XHJcblxyXG4vLyAqKiBBbGFybSBtZXNzYWdlICoqXHJcbmV4cG9ydCBjbGFzcyBBbGFybSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3RhdGU6QWxhcm1TdGF0ZTtcclxuICAgIHByaXZhdGUgX21ldGhvZDpBcnJheTxBbGFybU1ldGhvZD49IFtdO1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZTpzdHJpbmc9Jyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcsIHN0YXRlPzpBbGFybVN0YXRlLCB2aXN1YWw/OmJvb2xlYW4sIHNvdW5kPzpib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gKHR5cGVvZiBtZXNzYWdlIT09ICd1bmRlZmluZWQnKSA/IG1lc3NhZ2UgOiAnJztcclxuICAgICAgICB0aGlzLl9zdGF0ZT0gKHR5cGVvZiBzdGF0ZSE9PSAndW5kZWZpbmVkJykgPyBzdGF0ZSA6IEFsYXJtU3RhdGUuYWxhcm07XHJcbiAgICAgICAgaWYodmlzdWFsKSB7IHRoaXMuX21ldGhvZC5wdXNoKEFsYXJtTWV0aG9kLnZpc3VhbCl9O1xyXG4gICAgICAgIGlmKHNvdW5kKSB7IHRoaXMuX21ldGhvZC5wdXNoKEFsYXJtTWV0aG9kLnNvdW5kKX07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMuX21lc3NhZ2UsXHJcbiAgICAgICAgICAgIHN0YXRlOiB0aGlzLl9zdGF0ZSxcclxuICAgICAgICAgICAgbWV0aG9kOiB0aGlzLl9tZXRob2RcclxuICAgICAgICB9XHJcbiAgICB9ICBcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQWxhcm1TdGF0ZSB7XHJcbiAgICBub3JtYWw9ICdub3JtYWwnLFxyXG4gICAgYWxlcnQ9ICdhbGVydCcsXHJcbiAgICB3YXJuPSAnd2FybicsXHJcbiAgICBhbGFybT0gJ2FsYXJtJyxcclxuICAgIGVtZXJnZW5jeT0gJ2VtZXJnZW5jeSdcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtTWV0aG9kIHtcclxuICAgIHZpc3VhbD0gJ3Zpc3VhbCcsXHJcbiAgICBzb3VuZD0gJ3NvdW5kJ1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gQWxhcm1UeXBlIHtcclxuICAgIG1vYj0gJ25vdGlmaWNhdGlvbnMubW9iJyxcclxuICAgIGZpcmU9ICdub3RpZmljYXRpb25zLmZpcmUnLFxyXG4gICAgc2lua2luZz0gJ25vdGlmaWNhdGlvbnMuc2lua2luZycsXHJcbiAgICBmbG9kZGluZz0gJ25vdGlmaWNhdGlvbnMuZmxvb2RpbmcnLFxyXG4gICAgY29sbGlzaW9uPSAnbm90aWZpY2F0aW9ucy5jb2xsaXNpb24nLFxyXG4gICAgZ3JvdW5kaW5nPSAnbm90aWZpY2F0aW9ucy5ncm91bmRpbmcnLFxyXG4gICAgbGlzdGluZz0gJ25vdGlmaWNhdGlvbnMubGlzdGluZycsXHJcbiAgICBhZHJpZnQ9ICdub3RpZmljYXRpb25zLmFkcmlmdCcsXHJcbiAgICBwaXJhY3k9ICdub3RpZmljYXRpb25zLnBpcmFjeScsXHJcbiAgICBhYmFuZG9uPSAnbm90aWZpY2F0aW9ucy5hYmFuZG9uJ1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0h0dHAge1xyXG5cclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCB0b2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgfSAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBnZXQgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZi4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmdldChgdmVzc2Vscy9zZWxmYCkgfVxyXG5cclxuICAgIC8vKiogZ2V0IElEIG9mIHZlc3NlbCBzZWxmIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5nZXQoYHNlbGZgKSB9XHJcblxyXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxyXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGAke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9L21ldGFgKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8qKiBnZXQgQVBJIHBhdGggdmFsdWUgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gdGhpcy5lbmRwb2ludCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIHB1dC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuXHRwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XHJcbiAgICBwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk/OmFueSwgdmFsdWU/OmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpICsgJy8nICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGxldCBtc2cgPSB7IHZhbHVlOiB7fSB9IFxyXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZT09J3VuZGVmaW5lZCcpIHsgbXNnLnZhbHVlPSBrZXkgfVxyXG5cdFx0ZWxzZSB7IG1zZy52YWx1ZVtrZXldPSB2YWx1ZSB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZykgfVxyXG4gICAgfSBcclxuXHJcbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWVzc2FnZSwgQWxhcm0sIEFsYXJtVHlwZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW0ge1xyXG5cclxuXHRwcml2YXRlIF9jb25uZWN0OiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIF9jbG9zZTogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcblxyXG4gICAgcHJpdmF0ZSB3czogYW55OyAgICBcclxuICAgIHByaXZhdGUgX2ZpbHRlcj0gbnVsbDsgICAgICAgICAgICAgICAvLyAqKiBpZCBvZiB2ZXNzZWwgdG8gZmlsdGVyIGRlbHRhIG1lc3NhZ2VzXHJcbiAgICBwcml2YXRlIF93c1RpbWVvdXQ9IDIwMDAwOyAgICAgICAgICAgLy8gKiogd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAgXHJcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgXHJcbiAgICBwcml2YXRlIF9wbGF5YmFja01vZGU6IGJvb2xlYW49IGZhbHNlO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBwdWJsaWMgb25Db25uZWN0OiBPYnNlcnZhYmxlPGFueT47XHRcdFxyXG4gICAgcHVibGljIG9uQ2xvc2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgICBwdWJsaWMgZW5kcG9pbnQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBzZWxmSWQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBfc291cmNlOiBhbnk9IG51bGw7XHJcblxyXG4gICAgLy8gKiogc2V0IHNvdXJjZSBsYWJlbCBmb3IgdXNlIGluIG1lc3NhZ2VzXHJcbiAgICBzZXQgc291cmNlKHZhbDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuX3NvdXJjZSkgeyB0aGlzLl9zb3VyY2U9IHt9IH1cclxuICAgICAgICB0aGlzLl9zb3VyY2VbJ2xhYmVsJ109IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcclxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxyXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcclxuICAgIH0gICBcclxuICAgIC8vICoqIGlzIFdTIFN0cmVhbSBjb25uZWN0ZWQ/XHJcbiAgICBnZXQgaXNPcGVuKCk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXHJcbiAgICBnZXQgZmlsdGVyKCk6c3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XHJcbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xyXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIGlkICYmIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj0gKHRoaXMuc2VsZklkKSA/IHRoaXMuc2VsZklkIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gaWQgfVxyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIFBsYXliYWNrIEhlbGxvIG1lc3NhZ2VcclxuICAgIGdldCBwbGF5YmFja01vZGUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuX3BsYXliYWNrTW9kZSB9XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoICkgeyBcclxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgICAgICAgIFxyXG4gICAgfSAgIFxyXG5cclxuICAgIC8vICoqIENsb3NlIFdlYlNvY2tldCBjb25uZWN0aW9uXHJcbiAgICBjbG9zZSgpIHsgaWYodGhpcy53cykgeyB0aGlzLndzLmNsb3NlKCk7IHRoaXMud3M9IG51bGw7IH0gfVxyXG4gICBcclxuXHQvLyAqKiBPcGVuIGEgV2ViU29ja2V0IGF0IHByb3ZpZGVkIHVybFxyXG5cdG9wZW4odXJsOnN0cmluZywgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcclxuICAgICAgICB1cmw9ICh1cmwpID8gdXJsIDogdGhpcy5lbmRwb2ludDtcclxuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IHE9ICh1cmwuaW5kZXhPZignPycpPT0tMSkgPyAnPycgOiAnJidcclxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gJHtxfXN1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4gfHwgdG9rZW4pIHsgdXJsKz0gYCR7KHN1YnNjcmliZSkgPyAnJicgOiAnPyd9dG9rZW49JHt0aGlzLl90b2tlbiB8fCB0b2tlbn1gIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxyXG4gICAgICAgIHNldFRpbWVvdXQoIFxyXG4gICAgICAgICAgICAoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxyXG4gICAgICAgICk7XHJcblx0XHRcclxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5fZXJyb3IubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHt0aGlzLnBhcnNlT25NZXNzYWdlKGUpIH1cclxuICAgIH0gIFxyXG4gICAgXHJcbiAgICAvLyAqKiBwYXJzZSByZWNlaXZlZCBtZXNzYWdlXHJcbiAgICBwYXJzZU9uTWVzc2FnZShlKSB7XHJcbiAgICAgICAgbGV0IGRhdGE6IGFueTtcclxuICAgICAgICBpZih0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxyXG4gICAgICAgICAgICBjYXRjaChlKSB7IHJldHVybiB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkgeyBcclxuICAgICAgICAgICAgdGhpcy5zZWxmSWQ9IGRhdGEuc2VsZjtcclxuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2tNb2RlPSAodHlwZW9mIGRhdGEuc3RhcnRUaW1lIT0gJ3VuZGVmaW5lZCcpID8gdHJ1ZSA6IGZhbHNlOyAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKTtcclxuICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5fZmlsdGVyICYmIHRoaXMuaXNEZWx0YShkYXRhKSkge1xyXG4gICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXHJcbiAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICBlbHNlIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2VuZCBkYXRhIHRvIFNpZ25hbCBLIHN0cmVhbVxyXG4gICAgc2VuZChkYXRhOmFueSkge1xyXG4gICAgICAgIGlmKHRoaXMud3MpIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7IGRhdGE9IEpTT04uc3RyaW5naWZ5KGRhdGEpIH1cclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZW5kIHZhbHVlKHMpIHZpYSBkZWx0YSBzdHJlYW0gdXBkYXRlICoqXHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOkFycmF5PGFueT4pO1xyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgcGF0aDogc3RyaW5nIHwgQXJyYXk8YW55PiwgdmFsdWU/OmFueSkge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2UudXBkYXRlcygpO1xyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgbGV0IHVWYWx1ZXM9IFtdO1xyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB1VmFsdWVzLnB1c2goeyBwYXRoOiBwYXRoLCB2YWx1ZTogdmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgICB1VmFsdWVzPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdT0geyBcclxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIFxyXG4gICAgICAgICAgICB2YWx1ZXM6IHVWYWx1ZXMgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3NvdXJjZSkgeyB1Wydzb3VyY2UnXT0gdGhpcy5fc291cmNlIH1cclxuICAgICAgICB2YWwudXBkYXRlcy5wdXNoKCB1ICk7IFxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgb3B0aW9uczogey4ufSoqXHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBvcHRpb25zPzphbnkpO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmcgfCBBcnJheTxhbnk+PScqJywgb3B0aW9ucz86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS5zdWJzY3JpYmUoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgc1ZhbHVlPSB7fTtcclxuICAgICAgICAgICAgc1ZhbHVlWydwYXRoJ109IHBhdGg7XHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwZXJpb2QnXSkgeyBzVmFsdWVbJ3BlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydtaW5QZXJpb2QnXSkgeyBzVmFsdWVbJ21pblBlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydmb3JtYXQnXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1snZm9ybWF0J109PSdkZWx0YScgfHwgb3B0aW9uc1snZm9ybWF0J109PSdmdWxsJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ2Zvcm1hdCddPSBvcHRpb25zWydmb3JtYXQnXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BvbGljeSddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydwb2xpY3knXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0naWRlYWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1sncG9saWN5J109PSdmaXhlZCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydwb2xpY3knXT0gb3B0aW9uc1sncG9saWN5J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsLnN1YnNjcmliZS5wdXNoKHNWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcclxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDphbnk9JyonKSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnVuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHsgdmFsLnVuc3Vic2NyaWJlLnB1c2goe3BhdGg6IHBhdGh9KSB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHJhaXNlIGFsYXJtIGZvciBwYXRoXHJcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nLCBuYW1lOnN0cmluZywgYWxhcm06QWxhcm0pO1xyXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZywgdHlwZTpBbGFybVR5cGUsIGFsYXJtOkFsYXJtKTtcclxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmc9JyonLCBhbGFybUlkOmFueSwgYWxhcm06QWxhcm0pIHtcclxuICAgICAgICBsZXQgbjpzdHJpbmc7XHJcbiAgICAgICAgaWYodHlwZW9mIGFsYXJtSWQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG49KGFsYXJtSWQuaW5kZXhPZignbm90aWZpY2F0aW9ucy4nKT09LTEpID8gYG5vdGlmaWNhdGlvbnMuJHthbGFybUlkfWAgOiBhbGFybUlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgbj0gYWxhcm1JZCB9XHJcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIG4sIGFsYXJtLnZhbHVlICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcmFpc2UgYWxhcm0gZm9yIHBhdGhcclxuICAgIGNsZWFyQWxhcm0oY29udGV4dDpzdHJpbmc9JyonLCBuYW1lOnN0cmluZykge1xyXG4gICAgICAgIGxldCBuPShuYW1lLmluZGV4T2YoJ25vdGlmaWNhdGlvbnMuJyk9PS0xKSA/IGBub3RpZmljYXRpb25zLiR7bmFtZX1gIDogbmFtZTtcclxuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgbiwgbnVsbCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiBNRVNTQUdFIFBBUlNJTkcgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBjb250ZXh0IGlzICdzZWxmJ1xyXG4gICAgaXNTZWxmKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gKG1zZy5jb250ZXh0PT0gdGhpcy5zZWxmSWQpIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxyXG4gICAgaXNEZWx0YShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxyXG4gICAgaXNIZWxsbyhtc2c6YW55KTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNnLnNlbGYhPSAndW5kZWZpbmVkJyk7XHJcbiAgICB9ICAgICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgcmVxdWVzdCBSZXNwb25zZSBtZXNzYWdlXHJcbiAgICBpc1Jlc3BvbnNlKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5yZXF1ZXN0SWQhPSAndW5kZWZpbmVkJyB9IFxyXG59IiwiLyoqIFdlYiBXb3JrZXIgU2VydmljZVxyXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW1Xb3JrZXIgIHtcclxuXHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIHdvcmtlcjogV29ya2VyO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgfSBcclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IHRoaXMud29ya2VyID0gdW5kZWZpbmVkOyB9XHJcblxyXG4gICAgLy8gKiogSW5pdGlhbGlzZSB3b3JrZXJcclxuICAgIGluaXQocGF0aFRvRmlsZTpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYodHlwZW9mKFdvcmtlcik9PSBcInVuZGVmaW5lZFwiKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYodGhpcy53b3JrZXIpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCkgfSAgIC8vICoqIHRlcm1pbmF0ZSBhbiBvcGVuIHdvcmtlclxyXG5cclxuICAgICAgICB0aGlzLndvcmtlcj0gbmV3IFdvcmtlcihwYXRoVG9GaWxlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2U9IGV2ZW50PT4geyB0aGlzLl9tZXNzYWdlLm5leHQoZXZlbnQpIH07XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25lcnJvcj0gZXZlbnQ9PiB7IHRoaXMuX2Vycm9yLm5leHQoZXZlbnQpIH07ICAgICAgICAgICBcclxuICAgICAgICAvLyAqKiB3b3JrZXIgcmVhZHkgZm9yIHBvc3RNZXNzYWdlKClcclxuICAgIH0gICAgXHJcbiAgICBcclxuICAgIC8vICoqIFNlbmQgbWVzc2FnZSB0byB3b3JrZXJcclxuICAgIHBvc3RNZXNzYWdlKG1zZzphbnkpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci5wb3N0TWVzc2FnZShtc2cpIH0gfVxyXG5cclxuICAgIC8vICoqIHRlcm1pbmF0ZSB3b3JrZXJcclxuICAgIHRlcm1pbmF0ZSgpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci50ZXJtaW5hdGUoKX0gfVxyXG59IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgU2lnbmFsS0h0dHAgfSBmcm9tICcuL2h0dHAtYXBpJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW0gfSBmcm9tICcuL3N0cmVhbS1hcGknO1xuaW1wb3J0IHsgUGF0aCwgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbVdvcmtlcn0gZnJvbSAnLi9zdHJlYW0td29ya2VyJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gIFxuICAgIHByaXZhdGUgX3ZlcnNpb246IHN0cmluZz0gJ3YxJzsgICAgICAvLyAqKiBkZWZhdWx0IFNpZ25hbCBLIGFwaSB2ZXJzaW9uXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICBwcml2YXRlIGRlYnVnKHZhbDogYW55KSB7IGlmKGlzRGV2TW9kZSgpKXsgY29uc29sZS5sb2codmFsKSB9IH1cbiAgICBcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwdWJsaWMgc2VydmVyPSB7XG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW11cbiAgICB9ICAgIFxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IFxuICAgICAgICB0aGlzLl90b2tlbj0gdmFsO1xuICAgICAgICB0aGlzLmFwaS50b2tlbj0gdmFsO1xuICAgICAgICB0aGlzLnN0cmVhbS50b2tlbj0gdmFsO1xuICAgIH0gICAgXG4gICAgLy8gKiogTWVzc2FnZSBPYmplY3RcbiAgICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuIE1lc3NhZ2UgfVxuXG4gICAgLy8gKiogZ2VuZXJhdGUgYW5kIHJldHVybiBhIFVVSUQgb2JqZWN0XG4gICAgZ2V0IHV1aWQoKTpVVUlEIHsgcmV0dXJuIG5ldyBVVUlEKCkgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhcGk6IFNpZ25hbEtIdHRwLCBcbiAgICAgICAgICAgICAgICBwdWJsaWMgc3RyZWFtOiBTaWduYWxLU3RyZWFtLFxuICAgICAgICAgICAgICAgIHB1YmxpYyB3b3JrZXI6IFNpZ25hbEtTdHJlYW1Xb3JrZXIgKSB7IFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH0gICBcbiAgICBcbiAgICAvLyAqKiBpbml0aWFsaXNlIHByb3RvY29sLCBob3N0bmFtZSwgcG9ydCB2YWx1ZXNcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPSdsb2NhbGhvc3QnLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDQ0MztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfSAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogQ09OTkVDVElPTiBBTkQgRElTQ09WRVJZICAqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGVuZHBvaW50IGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlciAoZW5kcG9pbnQgZGlzY292ZXJ5KSBhbmQgRE8gTk9UIG9wZW4gU3RyZWFtXG4gICAgY29ubmVjdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgICAgICByZXNwb25zZT0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0uZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpOyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIHNlcnZlclxuICAgIGRpc2Nvbm5lY3QoKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCk7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB9XG4gICAgXG4gICAgLy8gKiogQ29ubmVjdCArIG9wZW4gRGVsdGEgU3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFN0cmVhbShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpXG4gICAgICAgICAgICAudGhlbiggKCk9PiB7IFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KTtcbiAgICB9IFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0UGxheWJhY2soaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBvcHRpb25zOmFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpXG4gICAgICAgICAgICAudGhlbiggKCk9PiB7IFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIHRoaXMub3BlblBsYXliYWNrKG51bGwsIG9wdGlvbnMsIHRoaXMuX3Rva2VuKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCBlPT4geyByZWplY3QoIGUgKSB9KTtcbiAgICAgICAgfSlcbiAgICB9ICAgICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSB3aXRoIChOTyBlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgb3BlblN0cmVhbSh1cmw6c3RyaW5nPW51bGwsIHN1YnNjcmliZT86c3RyaW5nLCB0b2tlbj86c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ29wZW5TdHJlYW0uLi4uLi4uLi4nKTsgIFxuICAgICAgICBpZighdXJsKSB7ICAgICAvLyBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgZGlzY292ZXJlZCBlbmRwb2ludFxuICAgICAgICAgICAgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4oIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCwgc3Vic2NyaWJlLCB0b2tlbik7ICBcbiAgICAgICAgcmV0dXJuIHRydWU7ICAgICAgXG4gICAgfSAgIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuUGxheWJhY2sodXJsOnN0cmluZz1udWxsLCBvcHRpb25zPzphbnksIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblBsYXliYWNrLi4uLi4uLi4uJyk7XG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXJsPSB1cmwucmVwbGFjZSgnc3RyZWFtJywgJ3BsYXliYWNrJyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBsZXQgcGI9ICcnO1xuICAgICAgICBsZXQgc3Vic2NyaWJlOiBzdHJpbmc7XG4gICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09J29iamVjdCcpe1xuICAgICAgICAgICAgcGIrPSAob3B0aW9ucy5zdGFydFRpbWUpID8gJz9zdGFydFRpbWU9JyArIG9wdGlvbnMuc3RhcnRUaW1lLnNsaWNlKDAsb3B0aW9ucy5zdGFydFRpbWUuaW5kZXhPZignLicpKSArICdaJyA6ICcnO1xuICAgICAgICAgICAgcGIrPSAob3B0aW9ucy5wbGF5YmFja1JhdGUpID8gYCZwbGF5YmFja1JhdGU9JHtvcHRpb25zLnBsYXliYWNrUmF0ZX1gIDogJyc7XG4gICAgICAgICAgICBzdWJzY3JpYmU9IChvcHRpb25zLnN1YnNjcmliZSkgPyBvcHRpb25zLnN1YnNjcmliZSA6IG51bGw7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwgKyBwYiwgc3Vic2NyaWJlLCB0b2tlbik7IFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9ICAgICAgXG5cbiAgICAvLyAqKiBwcm9jZXNzIEhlbGxvIHJlc3BvbnNlIFxuICAgIHByaXZhdGUgcHJvY2Vzc0hlbGxvKHJlc3BvbnNlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSAocmVzcG9uc2VbJ2VuZHBvaW50cyddKSA/IHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2VbJ3NlcnZlciddKSA/IHJlc3BvbnNlWydzZXJ2ZXInXSA6IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gKHRoaXMuc2VydmVyLmVuZHBvaW50cykgPyBPYmplY3Qua2V5cyh0aGlzLnNlcnZlci5lbmRwb2ludHMpIDogW107XG4gICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICB9XG5cbiAgICAvLyAqKiByZXR1cm4gcHJlZmVycmVkIFdTIHN0cmVhbSB1cmxcbiAgICBwdWJsaWMgcmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk6c3RyaW5nIHtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIGVuZHBvaW50IHZlcnNpb246ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBmYWxsaW5nIGJhY2sgdG86IHYxYCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ119YCBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIG51bGwgfVxuICAgIH0gIFxuXG4gICAgLy8gKiogcmV0dXJuIHNpZ25hbGstaHR0cCBlbmRwb2ludCB1cmxcbiAgICBwcml2YXRlIHJlc29sdmVIdHRwRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSkgeyAvLyAqKiBjb25uZWN0aW9uIG1hZGVcbiAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gaHR0cCBlbmRwb2ludCBhdCBwcmVzY3JpYmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddKSB7XG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstaHR0cCddfWAgfSAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtc2c9ICdObyBjdXJyZW50IGNvbm5lY3Rpb24gaHR0cCBlbmRwb2ludCBzZXJ2aWNlISBVc2UgY29ubmVjdCgpIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uJ1xuICAgICAgICAgICAgdGhpcy5kZWJ1Zyhtc2cpO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdXJsOyAgIFxuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY2xlYW51cCBvbiBzZXJ2ZXIgZGlzY29ubmVjdGlvblxuICAgIHByaXZhdGUgZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgIFxuICAgIH1cblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIHBhdGhcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBnZXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwdXQgdG8gaHR0cCBwYXRoXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwdXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTtcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHBvc3QgdG8gaHR0cCBwYXRoXG4gICAgcG9zdChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcG9zdCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07ICAgXG5cbiAgICAvLyAqKiBnZXQgYXV0aCB0b2tlbiBmb3Igc3VwcGxpZWQgdXNlciBkZXRhaWxzICoqXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgYGFwcGxpY2F0aW9uL2pzb25gKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXHRcbiAgICAvLyAqKiBsb2dvdXQgZnJvbSBzZXJ2ZXIgKipcbiAgICBsb2dvdXQoKSB7XG5cdFx0bGV0IHVybD1gJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ291dGA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCwgeyBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsICkgfVxuICAgIH1cdCAgIFxuICAgIFxuICAgIC8vKiogZ2V0IGRhdGEgdmlhIHRoZSBzbmFwc2hvdCBodHRwIGFwaSBwYXRoIGZvciBzdXBwbGllZCB0aW1lXG4gICAgc25hcHNob3QoY29udGV4dDpzdHJpbmcsIHRpbWU6c3RyaW5nKSB7IFxuICAgICAgICBpZighdGltZSkgeyByZXR1cm4gfVxuICAgICAgICB0aW1lPSB0aW1lLnNsaWNlKDAsdGltZS5pbmRleE9mKCcuJykpICsgJ1onO1xuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICB1cmw9IGAke3VybC5yZXBsYWNlKCdhcGknLCdzbmFwc2hvdCcpfSR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfT90aW1lPSR7dGltZX1gO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxuICAgIH1cblxufVxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIFNpZ25hbEtDbGllbnQgTW9kdWxlOlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogWyBIdHRwQ2xpZW50TW9kdWxlIF0sICAgIFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOiBbXSwgXHJcbiAgICBwcm92aWRlcnM6IFtdICBcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnRNb2R1bGUge31cclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vc2lnbmFsay1jbGllbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3V0aWxzJzsiXSwibmFtZXMiOlsiSHR0cEhlYWRlcnMiLCJJbmplY3RhYmxlIiwiSHR0cENsaWVudCIsIlN1YmplY3QiLCJpc0Rldk1vZGUiLCJOZ01vZHVsZSIsIkh0dHBDbGllbnRNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUtBOzs7OztRQWVJO1lBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFD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