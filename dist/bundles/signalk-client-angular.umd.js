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
                else if (this._filter && this.isDelta(data)) {
                    if (data.context == this._filter) {
                        this._message.next(data);
                    }
                }
                else {
                    this._message.next(data);
                }
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
                var val = Message.request();
                if (this._token) {
                    val['token'] = this._token;
                }
                val['context'] = (context == 'self') ? 'vessels.self' : context;
                val['put'] = { path: path, value: value };
                this.send(val);
                return val.requestId;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V1aWQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V0aWxzLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9odHRwLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLXdvcmtlci50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBVVUlEOiBBIGpzIGxpYnJhcnkgdG8gZ2VuZXJhdGUgYW5kIHBhcnNlIFVVSURzLCBUaW1lVVVJRHMgYW5kIGdlbmVyYXRlXHJcbiAqIFRpbWVVVUlEIGJhc2VkIG9uIGRhdGVzIGZvciByYW5nZSBzZWxlY3Rpb25zLlxyXG4gKiBAc2VlIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XHJcbiAqKi9cclxuZXhwb3J0IGNsYXNzIFVVSUQge1xyXG5cclxuICAgIHByaXZhdGUgbGltaXRVSTA0O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDY7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwODtcclxuICAgIHByaXZhdGUgbGltaXRVSTEyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTMyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJNDA7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0ODtcclxuXHJcbiAgICBwcml2YXRlIHZlcnNpb246bnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBoZXg6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA0ID0gdGhpcy5tYXhGcm9tQml0cyg0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwNiA9IHRoaXMubWF4RnJvbUJpdHMoNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDggPSB0aGlzLm1heEZyb21CaXRzKDgpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTEyID0gdGhpcy5tYXhGcm9tQml0cygxMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTQgPSB0aGlzLm1heEZyb21CaXRzKDE0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNiA9IHRoaXMubWF4RnJvbUJpdHMoMTYpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTMyID0gdGhpcy5tYXhGcm9tQml0cygzMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJNDAgPSB0aGlzLm1heEZyb21CaXRzKDQwKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0OCA9IHRoaXMubWF4RnJvbUJpdHMoNDgpOyBcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMuaGV4IH1cclxuICAgIHRvVVJOKCkgeyByZXR1cm4gJ3Vybjp1dWlkOicgKyB0aGlzLmhleCB9XHJcbiAgICB0b1NpZ25hbEsoKTpzdHJpbmcgIHsgcmV0dXJuIGB1cm46bXJuOnNpZ25hbGs6dXVpZDoke3RoaXMuaGV4fWAgfVxyXG4gICAgdG9CeXRlcygpIHtcclxuICAgICAgICBsZXQgcGFydHMgPSB0aGlzLmhleC5zcGxpdCgnLScpO1xyXG4gICAgICAgIGxldCBpbnRzID0gW107XHJcbiAgICAgICAgbGV0IGludFBvcyA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldLmxlbmd0aDsgais9Mikge1xyXG4gICAgICAgICAgICBpbnRzW2ludFBvcysrXSA9IHBhcnNlSW50KHBhcnRzW2ldLnN1YnN0cihqLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnRzO1xyXG4gICAgfTsgICAgXHJcblxyXG4gICAgcHJpdmF0ZSBtYXhGcm9tQml0cyhiaXRzKSB7IHJldHVybiBNYXRoLnBvdygyLCBiaXRzKSB9O1xyXG5cclxuICAgIHByaXZhdGUgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7IHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluIH1cclxuXHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNi0xKTt9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDgoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwOC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMzIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkzMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJNDAoKSB7IHJldHVybiAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCAzMCkpICsgKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgNDAgLSAzMCkpICogKDEgPDwgMzApIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0OCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0OCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIHRoaXMuZnJvbVBhcnRzKFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMzIoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTE2KCksXHJcbiAgICAgICAgICAgIDB4NDAwMCB8IHRoaXMucmFuZG9tVUkxMigpLFxyXG4gICAgICAgICAgICAweDgwICAgfCB0aGlzLnJhbmRvbVVJMDYoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTA4KCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUk0OCgpXHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBwYWRkZWRTdHJpbmcoc3RyaW5nLCBsZW5ndGgsIHo9bnVsbCkge1xyXG4gICAgICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xyXG4gICAgICAgIHogPSAoIXopID8gJzAnIDogejtcclxuICAgICAgICBsZXQgaSA9IGxlbmd0aCAtIHN0cmluZy5sZW5ndGg7XHJcbiAgICAgICAgZm9yICg7IGkgPiAwOyBpID4+Pj0gMSwgeiArPSB6KSB7XHJcbiAgICAgICAgICAgIGlmIChpICYgMSkge1xyXG4gICAgICAgICAgICBzdHJpbmcgPSB6ICsgc3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJpbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZnJvbVBhcnRzKHRpbWVMb3csIHRpbWVNaWQsIHRpbWVIaUFuZFZlcnNpb24sIGNsb2NrU2VxSGlBbmRSZXNlcnZlZCwgY2xvY2tTZXFMb3csIG5vZGUpIHtcclxuICAgICAgICB0aGlzLnZlcnNpb24gPSAodGltZUhpQW5kVmVyc2lvbiA+PiAxMikgJiAweEY7XHJcbiAgICAgICAgdGhpcy5oZXggPSB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTG93LnRvU3RyaW5nKDE2KSwgOClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTWlkLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lSGlBbmRWZXJzaW9uLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhjbG9ja1NlcUhpQW5kUmVzZXJ2ZWQudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxTG93LnRvU3RyaW5nKDE2KSwgMilcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhub2RlLnRvU3RyaW5nKDE2KSwgMTIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTsgICAgXHJcbiAgICBcclxuICAgIC8qXHJcbiAgICBwcml2YXRlIGdldFRpbWVGaWVsZFZhbHVlcyh0aW1lKSB7XHJcbiAgICAgICAgbGV0IHRzID0gdGltZSAtIERhdGUuVVRDKDE1ODIsIDksIDE1KTtcclxuICAgICAgICBsZXQgaG0gPSAoKHRzIC8gMHgxMDAwMDAwMDApICogMTAwMDApICYgMHhGRkZGRkZGO1xyXG4gICAgICAgIHJldHVybiB7IGxvdzogKCh0cyAmIDB4RkZGRkZGRikgKiAxMDAwMCkgJSAweDEwMDAwMDAwMCxcclxuICAgICAgICAgICAgICAgIG1pZDogaG0gJiAweEZGRkYsIGhpOiBobSA+Pj4gMTYsIHRpbWVzdGFtcDogdHMgfTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVRpbWUodGltZSwgbGFzdDpib29sZWFuKSB7XHJcbiAgICAgICAgbGFzdCA9ICghbGFzdCkgPyBmYWxzZSA6IGxhc3Q7XHJcbiAgICAgICAgbGV0IHRmID0gdGhpcy5nZXRUaW1lRmllbGRWYWx1ZXModGltZSk7XHJcbiAgICAgICAgbGV0IHRsID0gdGYubG93O1xyXG4gICAgICAgIGxldCB0aGF2ID0gKHRmLmhpICYgMHhGRkYpIHwgMHgxMDAwOyAgLy8gc2V0IHZlcnNpb24gJzAwMDEnXHJcbiAgICAgICAgaWYgKGxhc3QgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRCgpLmZyb21QYXJ0cyh0bCwgdGYubWlkLCB0aGF2LCAwLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVVSUQoKS5mcm9tUGFydHModGwsIHRmLm1pZCwgdGhhdiwgMHg4MCB8IHRoaXMubGltaXRVSTA2LCB0aGlzLmxpbWl0VUkwOCAtIDEsIHRoaXMubGltaXRVSTQ4IC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmaXJzdEZyb21UaW1lKHRpbWUpIHsgcmV0dXJuIHRoaXMuZnJvbVRpbWUodGltZSwgZmFsc2UpIH1cclxuICAgIGxhc3RGcm9tVGltZSh0aW1lKSB7IHJldHVybiB0aGlzLmZyb21UaW1lKHRpbWUsIHRydWUpIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBlcXVhbHModXVpZCkge1xyXG4gICAgICAgIGlmICghKHV1aWQgaW5zdGFuY2VvZiBVVUlEKSkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmICh0aGlzLmhleCAhPT0gdXVpZC5oZXgpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVVSTihzdHJJZCkge1xyXG4gICAgICAgIGxldCByO1xyXG4gICAgICAgIGxldCBwID0gL14oPzp1cm46dXVpZDp8XFx7KT8oWzAtOWEtZl17OH0pLShbMC05YS1mXXs0fSktKFswLTlhLWZdezR9KS0oWzAtOWEtZl17Mn0pKFswLTlhLWZdezJ9KS0oWzAtOWEtZl17MTJ9KSg/OlxcfSk/JC9pO1xyXG4gICAgICAgIGlmICgociA9IHAuZXhlYyhzdHJJZCkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb21QYXJ0cyhcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbMV0sIDE2KSwgcGFyc2VJbnQoclsyXSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoclszXSwgMTYpLCBwYXJzZUludChyWzRdLCAxNiksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzVdLCAxNiksIHBhcnNlSW50KHJbNl0sIDE2KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQnl0ZXMoaW50cykge1xyXG4gICAgICAgIGlmIChpbnRzLmxlbmd0aCA8IDUpIHsgcmV0dXJuIG51bGwgfVxyXG4gICAgICAgIGxldCBzdHIgPSAnJztcclxuICAgICAgICBsZXQgcG9zID0gMDtcclxuICAgICAgICBsZXQgcGFydHMgPSBbNCwgMiwgMiwgMiwgNl07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG9jdGV0ID0gaW50c1twb3MrK10udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICBpZiAob2N0ZXQubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIG9jdGV0ID0gJzAnICsgb2N0ZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyICs9IG9jdGV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXJ0c1tpXSAhPT0gNikge1xyXG4gICAgICAgICAgICBzdHIgKz0gJy0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb21VUk4oc3RyKTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbUJpbmFyeShiaW5hcnkpIHtcclxuICAgICAgICBsZXQgaW50cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGludHNbaV0gPSBiaW5hcnkuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAgICAgaWYgKGludHNbaV0gPiAyNTUgfHwgaW50c1tpXSA8IDApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGJ5dGUgaW4gYmluYXJ5IGRhdGEuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbUJ5dGVzKGludHMpO1xyXG4gICAgfTtcclxuICAgICovXHJcblxyXG59OyIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xyXG5cclxuLy8gKiogUGF0aCB1dGlsaXRpZXNcclxuZXhwb3J0IGNsYXNzIFBhdGgge1xyXG5cclxuICAgIC8vICoqIHRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gc2xhc2hcclxuICAgIHN0YXRpYyBkb3RUb1NsYXNoKHBhdGg6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLicpIT0tMSkgeyByZXR1cm4gcGF0aC5zcGxpdCgnLicpLmpvaW4oJy8nKSB9XHJcbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBwYXJzZSBjb250ZXh0IHRvIHZhbGlkIFNpZ25hbCBLIHBhdGhcclxuICAgIHN0YXRpYyBjb250ZXh0VG9QYXRoKGNvbnRleHQ6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGxldCByZXM9IChjb250ZXh0PT0nc2VsZicgKSA/ICd2ZXNzZWxzLnNlbGYnOiBjb250ZXh0O1xyXG4gICAgICAgIHJldHVybiByZXMuc3BsaXQoJy4nKS5qb2luKCcvJyk7XHJcbiAgICB9ICAgIFxyXG5cclxufVxyXG5cclxuLy8gKiogTWVzc2FnZSB0ZW1wbGF0ZXMgKipcclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2Uge1xyXG4gICBcclxuICAgIC8vICoqIHJldHVybiBVUERBVEVTIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgdXBkYXRlcygpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IHZhbHVlczogWyB7cGF0aDogeHgsIHZhbHVlOiB4eCB9IF0gfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1cGRhdGVzOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyAqKiByZXR1cm4gU1VCU0NSSUJFIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgc3Vic2NyaWJlKCkgeyBcclxuICAgICAgICAvKiBhcnJheSB2YWx1ZXM9IHtcclxuICAgICAgICAgICAgXCJwYXRoXCI6IFwicGF0aC50by5rZXlcIixcclxuICAgICAgICAgICAgXCJwZXJpb2RcIjogMTAwMCxcclxuICAgICAgICAgICAgXCJmb3JtYXRcIjogXCJkZWx0YVwiLFxyXG4gICAgICAgICAgICBcInBvbGljeVwiOiBcImlkZWFsXCIsXHJcbiAgICAgICAgICAgIFwibWluUGVyaW9kXCI6IDIwMFxyXG4gICAgICAgICAgICB9ICovXHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICBcclxuICAgIC8vICoqIHJldHVybiBVTlNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVuc3Vic2NyaWJlKCkgeyBcclxuICAgICAgICAvLyBhcnJheSB2YWx1ZXM9IHsgXCJwYXRoXCI6IFwicGF0aC50by5rZXlcIiB9XHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9ICBcclxuICAgIC8vICoqIHJldHVybiBSRVFVRVNUIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgcmVxdWVzdCgpIHsgXHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIHJlcXVlc3RJZDogbmV3IFVVSUQoKS50b1N0cmluZygpXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICAgICAgICAgXHJcblxyXG59XHJcblxyXG4vLyAqKiBBbGFybSBtZXNzYWdlICoqXHJcbmV4cG9ydCBjbGFzcyBBbGFybSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3RhdGU6QWxhcm1TdGF0ZTtcclxuICAgIHByaXZhdGUgX21ldGhvZDpBcnJheTxBbGFybU1ldGhvZD49IFtdO1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZTpzdHJpbmc9Jyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcsIHN0YXRlPzpBbGFybVN0YXRlLCB2aXN1YWw/OmJvb2xlYW4sIHNvdW5kPzpib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gKHR5cGVvZiBtZXNzYWdlIT09ICd1bmRlZmluZWQnKSA/IG1lc3NhZ2UgOiAnJztcclxuICAgICAgICB0aGlzLl9zdGF0ZT0gKHR5cGVvZiBzdGF0ZSE9PSAndW5kZWZpbmVkJykgPyBzdGF0ZSA6IEFsYXJtU3RhdGUuYWxhcm07XHJcbiAgICAgICAgaWYodmlzdWFsKSB7IHRoaXMuX21ldGhvZC5wdXNoKEFsYXJtTWV0aG9kLnZpc3VhbCl9O1xyXG4gICAgICAgIGlmKHNvdW5kKSB7IHRoaXMuX21ldGhvZC5wdXNoKEFsYXJtTWV0aG9kLnNvdW5kKX07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMuX21lc3NhZ2UsXHJcbiAgICAgICAgICAgIHN0YXRlOiB0aGlzLl9zdGF0ZSxcclxuICAgICAgICAgICAgbWV0aG9kOiB0aGlzLl9tZXRob2RcclxuICAgICAgICB9XHJcbiAgICB9ICBcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQWxhcm1TdGF0ZSB7XHJcbiAgICBub3JtYWw9ICdub3JtYWwnLFxyXG4gICAgYWxlcnQ9ICdhbGVydCcsXHJcbiAgICB3YXJuPSAnd2FybicsXHJcbiAgICBhbGFybT0gJ2FsYXJtJyxcclxuICAgIGVtZXJnZW5jeT0gJ2VtZXJnZW5jeSdcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtTWV0aG9kIHtcclxuICAgIHZpc3VhbD0gJ3Zpc3VhbCcsXHJcbiAgICBzb3VuZD0gJ3NvdW5kJ1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gQWxhcm1UeXBlIHtcclxuICAgIG1vYj0gJ25vdGlmaWNhdGlvbnMubW9iJyxcclxuICAgIGZpcmU9ICdub3RpZmljYXRpb25zLmZpcmUnLFxyXG4gICAgc2lua2luZz0gJ25vdGlmaWNhdGlvbnMuc2lua2luZycsXHJcbiAgICBmbG9kZGluZz0gJ25vdGlmaWNhdGlvbnMuZmxvb2RpbmcnLFxyXG4gICAgY29sbGlzaW9uPSAnbm90aWZpY2F0aW9ucy5jb2xsaXNpb24nLFxyXG4gICAgZ3JvdW5kaW5nPSAnbm90aWZpY2F0aW9ucy5ncm91bmRpbmcnLFxyXG4gICAgbGlzdGluZz0gJ25vdGlmaWNhdGlvbnMubGlzdGluZycsXHJcbiAgICBhZHJpZnQ9ICdub3RpZmljYXRpb25zLmFkcmlmdCcsXHJcbiAgICBwaXJhY3k9ICdub3RpZmljYXRpb25zLnBpcmFjeScsXHJcbiAgICBhYmFuZG9uPSAnbm90aWZpY2F0aW9ucy5hYmFuZG9uJ1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0h0dHAge1xyXG5cclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH0gICAgXHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7IH0gICBcclxuICAgIFxyXG4gICAgLy8gKiogZ2V0IHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGYuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5nZXQoYHZlc3NlbHMvc2VsZmApIH1cclxuXHJcbiAgICAvLyoqIGdldCBJRCBvZiB2ZXNzZWwgc2VsZiB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGZJZCgpIHsgcmV0dXJuIHRoaXMuZ2V0KGBzZWxmYCkgfVxyXG5cclxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcclxuICAgIGdldE1ldGEoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChgJHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfS9tZXRhYCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vKiogZ2V0IEFQSSBwYXRoIHZhbHVlIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vKiogc2VuZCB2YWx1ZSB0byBBUEkgcGF0aCB2aWEgaHR0cCBwdXQuIHJldHVybnM6IE9ic2VydmFibGUgXHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuXHRwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk6YW55LCB2YWx1ZTphbnkpO1xyXG4gICAgcHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5PzphbnksIHZhbHVlPzphbnkpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gdGhpcy5lbmRwb2ludCArIFBhdGguY29udGV4dFRvUGF0aChjb250ZXh0KSArICcvJyArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBsZXQgbXNnID0geyB2YWx1ZToge30gfSBcclxuICAgICAgICBpZih0eXBlb2YgdmFsdWU9PSd1bmRlZmluZWQnKSB7IG1zZy52YWx1ZT0ga2V5IH1cclxuXHRcdGVsc2UgeyBtc2cudmFsdWVba2V5XT0gdmFsdWUgfVxyXG5cclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2cpIH1cclxuICAgIH0gXHJcblxyXG59IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UsIEFsYXJtLCBBbGFybVR5cGUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLU3RyZWFtIHtcclxuXHJcblx0cHJpdmF0ZSBfY29ubmVjdDogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSBfY2xvc2U6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9lcnJvcjogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG5cclxuICAgIHByaXZhdGUgd3M6IGFueTsgICAgXHJcbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xyXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgIFxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgIFxyXG4gICAgcHJpdmF0ZSBfcGxheWJhY2tNb2RlOiBib29sZWFuPSBmYWxzZTtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIG9uQ29ubmVjdDogT2JzZXJ2YWJsZTxhbnk+O1x0XHRcclxuICAgIHB1YmxpYyBvbkNsb3NlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2VsZklkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgX3NvdXJjZTogYW55PSBudWxsO1xyXG5cclxuICAgIC8vICoqIHNldCBzb3VyY2UgbGFiZWwgZm9yIHVzZSBpbiBtZXNzYWdlc1xyXG4gICAgc2V0IHNvdXJjZSh2YWw6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLl9zb3VyY2UpIHsgdGhpcy5fc291cmNlPSB7fSB9XHJcbiAgICAgICAgdGhpcy5fc291cmNlWydsYWJlbCddPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH0gICAgXHJcbiAgICAvLyAqKiBnZXQgLyBzZXQgd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAzMDAwPD10aW1lb3V0PD02MDAwMCAqKlxyXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XHJcbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3dzVGltZW91dD0gKHZhbDwzMDAwKSA/IDMwMDAgOiAodmFsPjYwMDAwKSA/IDYwMDAwIDogdmFsO1xyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogaXMgV1MgU3RyZWFtIGNvbm5lY3RlZD9cclxuICAgIGdldCBpc09wZW4oKTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfSAgXHJcbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcclxuICAgIGdldCBmaWx0ZXIoKTpzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmlsdGVyIH1cclxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXHJcbiAgICBzZXQgZmlsdGVyKGlkOnN0cmluZykgeyBcclxuICAgICAgICBpZiggaWQgJiYgaWQuaW5kZXhPZignc2VsZicpIT0tMSApIHsgIC8vICoqIHNlbGZcclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPSAodGhpcy5zZWxmSWQpID8gdGhpcy5zZWxmSWQgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSBpZCB9XHJcbiAgICB9ICAgXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgUGxheWJhY2sgSGVsbG8gbWVzc2FnZVxyXG4gICAgZ2V0IHBsYXliYWNrTW9kZSgpOmJvb2xlYW4geyByZXR1cm4gdGhpcy5fcGxheWJhY2tNb2RlIH1cclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggKSB7IFxyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ29ubmVjdD0gdGhpcy5fY29ubmVjdC5hc09ic2VydmFibGUoKTsgICBcclxuICAgICAgICB0aGlzLl9jbG9zZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgICAgICAgXHJcbiAgICB9ICAgXHJcblxyXG4gICAgLy8gKiogQ2xvc2UgV2ViU29ja2V0IGNvbm5lY3Rpb25cclxuICAgIGNsb3NlKCkgeyBpZih0aGlzLndzKSB7IHRoaXMud3MuY2xvc2UoKTsgdGhpcy53cz0gbnVsbDsgfSB9XHJcbiAgIFxyXG5cdC8vICoqIE9wZW4gYSBXZWJTb2NrZXQgYXQgcHJvdmlkZWQgdXJsXHJcblx0b3Blbih1cmw6c3RyaW5nLCBzdWJzY3JpYmU/OnN0cmluZywgdG9rZW4/OnN0cmluZykge1xyXG4gICAgICAgIHVybD0gKHVybCkgPyB1cmwgOiB0aGlzLmVuZHBvaW50O1xyXG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cclxuICAgICAgICBsZXQgcT0gKHVybC5pbmRleE9mKCc/Jyk9PS0xKSA/ICc/JyA6ICcmJ1xyXG4gICAgICAgIGlmKHN1YnNjcmliZSkgeyB1cmwrPWAke3F9c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWAgfSBcclxuICAgICAgICBpZih0aGlzLl90b2tlbiB8fCB0b2tlbikgeyB1cmwrPSBgJHsoc3Vic2NyaWJlKSA/ICcmJyA6ICc/J310b2tlbj0ke3RoaXMuX3Rva2VuIHx8IHRva2VufWAgfSBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcclxuICAgICAgICAvLyAqKiBzdGFydCBjb25uZWN0aW9uIHdhdGNoZG9nICoqXHJcbiAgICAgICAgc2V0VGltZW91dCggXHJcbiAgICAgICAgICAgICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb25uZWN0aW9uIHdhdGNoZG9nIGV4cGlyZWQgKCR7dGhpcy5fd3NUaW1lb3V0LzEwMDB9IHNlYyk6ICR7dGhpcy53cy5yZWFkeVN0YXRlfS4uLiBhYm9ydGluZyBjb25uZWN0aW9uLi4uYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5fd3NUaW1lb3V0XHJcbiAgICAgICAgKTtcclxuXHRcdFxyXG5cdFx0dGhpcy53cy5vbm9wZW49IGU9PiB7IHRoaXMuX2Nvbm5lY3QubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9uY2xvc2U9IGU9PiB7IHRoaXMuX2Nsb3NlLm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25tZXNzYWdlPSBlPT4ge3RoaXMucGFyc2VPbk1lc3NhZ2UoZSkgfVxyXG4gICAgfSAgXHJcbiAgICBcclxuICAgIC8vICoqIHBhcnNlIHJlY2VpdmVkIG1lc3NhZ2VcclxuICAgIHByaXZhdGUgcGFyc2VPbk1lc3NhZ2UoZSkge1xyXG4gICAgICAgIGxldCBkYXRhOiBhbnk7XHJcbiAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdHJ5IHsgZGF0YT0gSlNPTi5wYXJzZShlLmRhdGEpIH1cclxuICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzSGVsbG8oZGF0YSkpIHsgXHJcbiAgICAgICAgICAgIHRoaXMuc2VsZklkPSBkYXRhLnNlbGY7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrTW9kZT0gKHR5cGVvZiBkYXRhLnN0YXJ0VGltZSE9ICd1bmRlZmluZWQnKSA/IHRydWUgOiBmYWxzZTsgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSk7XHJcbiAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcclxuICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG4gICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgcHV0IHJlcXVlc3QgdmlhIERlbHRhIHN0cmVhbVxyXG4gICAgcHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTpzdHJpbmcge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2UucmVxdWVzdCgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG4gICAgICAgIHZhbFsnY29udGV4dCddPSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICB2YWxbJ3B1dCddPSB7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHZhbC5yZXF1ZXN0SWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2VuZCBkYXRhIHRvIFNpZ25hbCBLIHN0cmVhbVxyXG4gICAgc2VuZChkYXRhOmFueSkge1xyXG4gICAgICAgIGlmKHRoaXMud3MpIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7IGRhdGE9IEpTT04uc3RyaW5naWZ5KGRhdGEpIH1cclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZW5kIHZhbHVlKHMpIHZpYSBkZWx0YSBzdHJlYW0gdXBkYXRlICoqXHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOkFycmF5PGFueT4pO1xyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgcGF0aDogc3RyaW5nIHwgQXJyYXk8YW55PiwgdmFsdWU/OmFueSkge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2UudXBkYXRlcygpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgbGV0IHVWYWx1ZXM9IFtdO1xyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB1VmFsdWVzLnB1c2goeyBwYXRoOiBwYXRoLCB2YWx1ZTogdmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgICB1VmFsdWVzPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdT0geyBcclxuICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIFxyXG4gICAgICAgICAgICB2YWx1ZXM6IHVWYWx1ZXMgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3NvdXJjZSkgeyB1Wydzb3VyY2UnXT0gdGhpcy5fc291cmNlIH1cclxuICAgICAgICB2YWwudXBkYXRlcy5wdXNoKCB1ICk7IFxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgb3B0aW9uczogey4ufSoqXHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBvcHRpb25zPzphbnkpO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmcgfCBBcnJheTxhbnk+PScqJywgb3B0aW9ucz86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS5zdWJzY3JpYmUoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgc1ZhbHVlPSB7fTtcclxuICAgICAgICAgICAgc1ZhbHVlWydwYXRoJ109IHBhdGg7XHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwZXJpb2QnXSkgeyBzVmFsdWVbJ3BlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydtaW5QZXJpb2QnXSkgeyBzVmFsdWVbJ21pblBlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydmb3JtYXQnXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1snZm9ybWF0J109PSdkZWx0YScgfHwgb3B0aW9uc1snZm9ybWF0J109PSdmdWxsJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ2Zvcm1hdCddPSBvcHRpb25zWydmb3JtYXQnXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BvbGljeSddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydwb2xpY3knXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0naWRlYWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1sncG9saWN5J109PSdmaXhlZCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydwb2xpY3knXT0gb3B0aW9uc1sncG9saWN5J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsLnN1YnNjcmliZS5wdXNoKHNWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcclxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDphbnk9JyonKSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnVuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHsgdmFsLnVuc3Vic2NyaWJlLnB1c2goe3BhdGg6IHBhdGh9KSB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHJhaXNlIGFsYXJtIGZvciBwYXRoXHJcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nLCBuYW1lOnN0cmluZywgYWxhcm06QWxhcm0pO1xyXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZywgdHlwZTpBbGFybVR5cGUsIGFsYXJtOkFsYXJtKTtcclxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmc9JyonLCBhbGFybUlkOmFueSwgYWxhcm06QWxhcm0pIHtcclxuICAgICAgICBsZXQgbjpzdHJpbmc7XHJcbiAgICAgICAgaWYodHlwZW9mIGFsYXJtSWQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG49KGFsYXJtSWQuaW5kZXhPZignbm90aWZpY2F0aW9ucy4nKT09LTEpID8gYG5vdGlmaWNhdGlvbnMuJHthbGFybUlkfWAgOiBhbGFybUlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgbj0gYWxhcm1JZCB9XHJcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIG4sIGFsYXJtLnZhbHVlICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcmFpc2UgYWxhcm0gZm9yIHBhdGhcclxuICAgIGNsZWFyQWxhcm0oY29udGV4dDpzdHJpbmc9JyonLCBuYW1lOnN0cmluZykge1xyXG4gICAgICAgIGxldCBuPShuYW1lLmluZGV4T2YoJ25vdGlmaWNhdGlvbnMuJyk9PS0xKSA/IGBub3RpZmljYXRpb25zLiR7bmFtZX1gIDogbmFtZTtcclxuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgbiwgbnVsbCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiBNRVNTQUdFIFBBUlNJTkcgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBjb250ZXh0IGlzICdzZWxmJ1xyXG4gICAgaXNTZWxmKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gKG1zZy5jb250ZXh0PT0gdGhpcy5zZWxmSWQpIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxyXG4gICAgaXNEZWx0YShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxyXG4gICAgaXNIZWxsbyhtc2c6YW55KTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNnLnNlbGYhPSAndW5kZWZpbmVkJyk7XHJcbiAgICB9ICAgICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgcmVxdWVzdCBSZXNwb25zZSBtZXNzYWdlXHJcbiAgICBpc1Jlc3BvbnNlKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5yZXF1ZXN0SWQhPSAndW5kZWZpbmVkJyB9IFxyXG59IiwiLyoqIFdlYiBXb3JrZXIgU2VydmljZVxyXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW1Xb3JrZXIgIHtcclxuXHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIHdvcmtlcjogV29ya2VyO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgfSBcclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IHRoaXMud29ya2VyID0gdW5kZWZpbmVkOyB9XHJcblxyXG4gICAgLy8gKiogSW5pdGlhbGlzZSB3b3JrZXJcclxuICAgIGluaXQocGF0aFRvRmlsZTpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYodHlwZW9mKFdvcmtlcik9PSBcInVuZGVmaW5lZFwiKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYodGhpcy53b3JrZXIpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCkgfSAgIC8vICoqIHRlcm1pbmF0ZSBhbiBvcGVuIHdvcmtlclxyXG5cclxuICAgICAgICB0aGlzLndvcmtlcj0gbmV3IFdvcmtlcihwYXRoVG9GaWxlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2U9IGV2ZW50PT4geyB0aGlzLl9tZXNzYWdlLm5leHQoZXZlbnQpIH07XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25lcnJvcj0gZXZlbnQ9PiB7IHRoaXMuX2Vycm9yLm5leHQoZXZlbnQpIH07ICAgICAgICAgICBcclxuICAgICAgICAvLyAqKiB3b3JrZXIgcmVhZHkgZm9yIHBvc3RNZXNzYWdlKClcclxuICAgIH0gICAgXHJcbiAgICBcclxuICAgIC8vICoqIFNlbmQgbWVzc2FnZSB0byB3b3JrZXJcclxuICAgIHBvc3RNZXNzYWdlKG1zZzphbnkpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci5wb3N0TWVzc2FnZShtc2cpIH0gfVxyXG5cclxuICAgIC8vICoqIHRlcm1pbmF0ZSB3b3JrZXJcclxuICAgIHRlcm1pbmF0ZSgpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci50ZXJtaW5hdGUoKX0gfVxyXG59IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgU2lnbmFsS0h0dHAgfSBmcm9tICcuL2h0dHAtYXBpJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW0gfSBmcm9tICcuL3N0cmVhbS1hcGknO1xuaW1wb3J0IHsgUGF0aCwgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbVdvcmtlcn0gZnJvbSAnLi9zdHJlYW0td29ya2VyJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gIFxuICAgIHByaXZhdGUgX3ZlcnNpb246IHN0cmluZz0gJ3YxJzsgICAgICAvLyAqKiBkZWZhdWx0IFNpZ25hbCBLIGFwaSB2ZXJzaW9uXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICBwcml2YXRlIGRlYnVnKHZhbDogYW55KSB7IGlmKGlzRGV2TW9kZSgpKXsgY29uc29sZS5sb2codmFsKSB9IH1cbiAgICBcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwdWJsaWMgc2VydmVyPSB7XG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW11cbiAgICB9ICAgIFxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IFxuICAgICAgICB0aGlzLl90b2tlbj0gdmFsO1xuICAgICAgICB0aGlzLmFwaS5hdXRoVG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5zdHJlYW0uYXV0aFRva2VuPSB2YWw7XG4gICAgfSAgICBcbiAgICAvLyAqKiBNZXNzYWdlIE9iamVjdFxuICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gTWVzc2FnZSB9XG5cbiAgICAvLyAqKiBnZW5lcmF0ZSBhbmQgcmV0dXJuIGEgVVVJRCBvYmplY3RcbiAgICBnZXQgdXVpZCgpOlVVSUQgeyByZXR1cm4gbmV3IFVVSUQoKSB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgXG4gICAgICAgICAgICAgICAgcHVibGljIGFwaTogU2lnbmFsS0h0dHAsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzdHJlYW06IFNpZ25hbEtTdHJlYW0sXG4gICAgICAgICAgICAgICAgcHVibGljIHdvcmtlcjogU2lnbmFsS1N0cmVhbVdvcmtlciApIHsgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfSAgIFxuICAgIFxuICAgIC8vICoqIGluaXRpYWxpc2UgcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0IHZhbHVlc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9J2xvY2FsaG9zdCcsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OIEFORCBESVNDT1ZFUlkgICoqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZW5kcG9pbnQgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyIChlbmRwb2ludCBkaXNjb3ZlcnkpIGFuZCBETyBOT1Qgb3BlbiBTdHJlYW1cbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlPT4geyBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKTsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IH1cbiAgICBcbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RQbGF5YmFjayhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIG9wdGlvbnM6YW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHB1dCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTsgICBcblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwgKSB9XG4gICAgfVx0ICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuXG59XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogU2lnbmFsS0NsaWVudCBNb2R1bGU6XHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbIEh0dHBDbGllbnRNb2R1bGUgXSwgICAgXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW10sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdLCBcclxuICAgIHByb3ZpZGVyczogW10gIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudE1vZHVsZSB7fVxyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9zaWduYWxrLWNsaWVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdXRpbHMnOyJdLCJuYW1lcyI6WyJIdHRwSGVhZGVycyIsIkluamVjdGFibGUiLCJIdHRwQ2xpZW50IiwiU3ViamVjdCIsImlzRGV2TW9kZSIsIk5nTW9kdWxlIiwiSHR0cENsaWVudE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBS0E7Ozs7O1FBZUk7WUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV0QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FD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