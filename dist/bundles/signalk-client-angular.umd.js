(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('signalk-client-angular', ['exports', '@angular/core', '@angular/common/http', 'rxjs'], factory) :
    (factory((global['signalk-client-angular'] = {}),global.ng.core,global.ng.common.http,global.rxjs));
}(this, (function (exports,i0,i1,rxjs) { 'use strict';

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
                    requestId: null
                };
            };
        return Message;
    }());

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
            this._connect = new rxjs.Subject();
            this.onConnect = this._connect.asObservable();
            this._close = new rxjs.Subject();
            this.onClose = this._close.asObservable();
            this._error = new rxjs.Subject();
            this.onError = this._error.asObservable();
            this._message = new rxjs.Subject();
            this.onMessage = this._message.asObservable();
        }
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
                this.ws.onmessage = function (e) {
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
                    if (_this.isHello(data)) {
                        _this.selfId = data.self;
                        _this._playbackMode = (typeof data.startTime != 'undefined') ? true : false;
                        _this._message.next(data);
                    }
                    else if (_this._filter && _this.isDelta(data)) {
                        if (data.context == _this._filter) {
                            _this._message.next(data);
                        }
                    }
                    else {
                        _this._message.next(data);
                    }
                };
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
                val.updates.push({ values: uValues });
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
    exports.ɵa = SignalKHttp;
    exports.ɵb = SignalKStream;
    exports.ɵc = SignalKStreamWorker;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V0aWxzLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9odHRwLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLXdvcmtlci50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXVpZC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAqKiBQYXRoIHV0aWxpdGllc1xyXG5leHBvcnQgY2xhc3MgUGF0aCB7XHJcblxyXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxyXG4gICAgc3RhdGljIGRvdFRvU2xhc2gocGF0aDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgaWYocGF0aC5pbmRleE9mKCcuJykhPS0xKSB7IHJldHVybiBwYXRoLnNwbGl0KCcuJykuam9pbignLycpIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHBhdGggfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHBhcnNlIGNvbnRleHQgdG8gdmFsaWQgU2lnbmFsIEsgcGF0aFxyXG4gICAgc3RhdGljIGNvbnRleHRUb1BhdGgoY29udGV4dDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJlcz0gKGNvbnRleHQ9PSdzZWxmJyApID8gJ3Zlc3NlbHMuc2VsZic6IGNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zcGxpdCgnLicpLmpvaW4oJy8nKTtcclxuICAgIH0gICAgXHJcblxyXG59XHJcblxyXG4vLyAqKiBNZXNzYWdlIHRlbXBsYXRlcyAqKlxyXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XHJcbiAgIFxyXG4gICAgLy8gKiogcmV0dXJuIFVQREFURVMgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1cGRhdGVzKCkgeyBcclxuICAgICAgICAvLyBhcnJheSB2YWx1ZXM9IHsgdmFsdWVzOiBbIHtwYXRoOiB4eCwgdmFsdWU6IHh4IH0gXSB9XHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVwZGF0ZXM6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vICoqIHJldHVybiBTVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyBzdWJzY3JpYmUoKSB7IFxyXG4gICAgICAgIC8qIGFycmF5IHZhbHVlcz0ge1xyXG4gICAgICAgICAgICBcInBhdGhcIjogXCJwYXRoLnRvLmtleVwiLFxyXG4gICAgICAgICAgICBcInBlcmlvZFwiOiAxMDAwLFxyXG4gICAgICAgICAgICBcImZvcm1hdFwiOiBcImRlbHRhXCIsXHJcbiAgICAgICAgICAgIFwicG9saWN5XCI6IFwiaWRlYWxcIixcclxuICAgICAgICAgICAgXCJtaW5QZXJpb2RcIjogMjAwXHJcbiAgICAgICAgICAgIH0gKi9cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgc3Vic2NyaWJlOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9ICAgIFxyXG4gICAgLy8gKiogcmV0dXJuIFVOU1VCU0NSSUJFIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgdW5zdWJzY3JpYmUoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyBcInBhdGhcIjogXCJwYXRoLnRvLmtleVwiIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gIFxyXG4gICAgLy8gKiogcmV0dXJuIFJFUVVFU1QgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyByZXF1ZXN0KCkgeyBcclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgcmVxdWVzdElkOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICAgICAgICAgXHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0h0dHAge1xyXG5cclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCB0b2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgfSAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBnZXQgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZi4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmdldChgdmVzc2Vscy9zZWxmYCkgfVxyXG5cclxuICAgIC8vKiogZ2V0IElEIG9mIHZlc3NlbCBzZWxmIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5nZXQoYHNlbGZgKSB9XHJcblxyXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxyXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGAke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9L21ldGFgKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8qKiBnZXQgQVBJIHBhdGggdmFsdWUgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gdGhpcy5lbmRwb2ludCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIHB1dC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuXHRwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XHJcbiAgICBwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk/OmFueSwgdmFsdWU/OmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpICsgJy8nICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGxldCBtc2cgPSB7IHZhbHVlOiB7fSB9IFxyXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZT09J3VuZGVmaW5lZCcpIHsgbXNnLnZhbHVlPSBrZXkgfVxyXG5cdFx0ZWxzZSB7IG1zZy52YWx1ZVtrZXldPSB2YWx1ZSB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZykgfVxyXG4gICAgfSBcclxuXHJcbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW0ge1xyXG5cclxuXHRwcml2YXRlIF9jb25uZWN0OiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIF9jbG9zZTogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG5cclxuICAgIHByaXZhdGUgd3M6IGFueTsgICAgXHJcbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xyXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgIFxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgIFxyXG4gICAgcHJpdmF0ZSBfcGxheWJhY2tNb2RlOiBib29sZWFuPSBmYWxzZTtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIG9uQ29ubmVjdDogT2JzZXJ2YWJsZTxhbnk+O1x0XHRcclxuICAgIHB1YmxpYyBvbkNsb3NlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2VsZklkOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCB0b2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXHJcbiAgICBnZXQgY29ubmVjdGlvblRpbWVvdXQoKTpudW1iZXIgeyByZXR1cm4gdGhpcy5fd3NUaW1lb3V0IH1cclxuICAgIHNldCBjb25uZWN0aW9uVGltZW91dCh2YWw6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XHJcbiAgICB9ICAgXHJcbiAgICAvLyAqKiBpcyBXUyBTdHJlYW0gY29ubmVjdGVkP1xyXG4gICAgZ2V0IGlzT3BlbigpOmJvb2xlYW4geyBcclxuICAgICAgICByZXR1cm4gKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9ICBcclxuICAgIC8vICoqIGdldCAvIHNldCBmaWx0ZXIgdG8gc2VsZWN0IGRlbHRhIG1lc3NhZ2VzIGp1c3QgZm9yIHN1cHBsaWVkIHZlc3NlbCBpZCAgIFxyXG4gICAgZ2V0IGZpbHRlcigpOnN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxyXG4gICAgLy8gKiogc2V0IGZpbHRlcj0gbnVsbCB0byByZW1vdmUgbWVzc2FnZSBmaWx0ZXJpbmdcclxuICAgIHNldCBmaWx0ZXIoaWQ6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCBpZCAmJiBpZC5pbmRleE9mKCdzZWxmJykhPS0xICkgeyAgLy8gKiogc2VsZlxyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXI9ICh0aGlzLnNlbGZJZCkgPyB0aGlzLnNlbGZJZCA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyB0aGlzLl9maWx0ZXI9IGlkIH1cclxuICAgIH0gICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBQbGF5YmFjayBIZWxsbyBtZXNzYWdlXHJcbiAgICBnZXQgcGxheWJhY2tNb2RlKCk6Ym9vbGVhbiB7IHJldHVybiB0aGlzLl9wbGF5YmFja01vZGUgfVxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCApIHsgXHJcbiAgICAgICAgdGhpcy5fY29ubmVjdD0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25Db25uZWN0PSB0aGlzLl9jb25uZWN0LmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNsb3NlPSB0aGlzLl9jbG9zZS5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICAgICAgICBcclxuICAgIH0gICBcclxuXHJcbiAgICAvLyAqKiBDbG9zZSBXZWJTb2NrZXQgY29ubmVjdGlvblxyXG4gICAgY2xvc2UoKSB7IGlmKHRoaXMud3MpIHsgdGhpcy53cy5jbG9zZSgpOyB0aGlzLndzPSBudWxsOyB9IH1cclxuICAgXHJcblx0Ly8gKiogT3BlbiBhIFdlYlNvY2tldCBhdCBwcm92aWRlZCB1cmxcclxuXHRvcGVuKHVybDpzdHJpbmcsIHN1YnNjcmliZT86c3RyaW5nLCB0b2tlbj86c3RyaW5nKSB7XHJcbiAgICAgICAgdXJsPSAodXJsKSA/IHVybCA6IHRoaXMuZW5kcG9pbnQ7XHJcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGxldCBxPSAodXJsLmluZGV4T2YoJz8nKT09LTEpID8gJz8nIDogJyYnXHJcbiAgICAgICAgaWYoc3Vic2NyaWJlKSB7IHVybCs9YCR7cX1zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuIHx8IHRva2VuKSB7IHVybCs9IGAkeyhzdWJzY3JpYmUpID8gJyYnIDogJz8nfXRva2VuPSR7dGhpcy5fdG9rZW4gfHwgdG9rZW59YCB9IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xyXG4gICAgICAgIC8vICoqIHN0YXJ0IGNvbm5lY3Rpb24gd2F0Y2hkb2cgKipcclxuICAgICAgICBzZXRUaW1lb3V0KCBcclxuICAgICAgICAgICAgKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENvbm5lY3Rpb24gd2F0Y2hkb2cgZXhwaXJlZCAoJHt0aGlzLl93c1RpbWVvdXQvMTAwMH0gc2VjKTogJHt0aGlzLndzLnJlYWR5U3RhdGV9Li4uIGFib3J0aW5nIGNvbm5lY3Rpb24uLi5gKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzLl93c1RpbWVvdXRcclxuICAgICAgICApO1xyXG5cdFx0XHJcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgdGhpcy5fY29ubmVjdC5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5fY2xvc2UubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9uZXJyb3I9IGU9PiB7IHRoaXMuX2Vycm9yLm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbm1lc3NhZ2U9IGU9PiB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOiBhbnk7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkgeyBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZklkPSBkYXRhLnNlbGY7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5YmFja01vZGU9ICh0eXBlb2YgZGF0YS5zdGFydFRpbWUhPSAndW5kZWZpbmVkJykgPyB0cnVlIDogZmFsc2U7ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuXHRcdH1cclxuICAgIH0gICAgICBcclxuXHJcbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXHJcbiAgICBzZW5kKGRhdGE6YW55KSB7XHJcbiAgICAgICAgaWYodGhpcy53cykge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgdmFsdWUocykgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOiBzdHJpbmcgfCBBcnJheTxhbnk+LCB2YWx1ZT86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51cGRhdGVzKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBsZXQgdVZhbHVlcz0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXMucHVzaCh7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXM9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbC51cGRhdGVzLnB1c2goeyB2YWx1ZXM6IHVWYWx1ZXMgfSApOyBcclxuICAgICAgICB0aGlzLnNlbmQodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzIG9wdGlvbnM6IHsuLn0qKlxyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOkFycmF5PGFueT4pO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgb3B0aW9ucz86YW55KTtcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nIHwgQXJyYXk8YW55Pj0nKicsIG9wdGlvbnM/OmFueSkge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2Uuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICB2YWwuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHNWYWx1ZT0ge307XHJcbiAgICAgICAgICAgIHNWYWx1ZVsncGF0aCddPSBwYXRoO1xyXG4gICAgICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1sncGVyaW9kJ10pIHsgc1ZhbHVlWydwZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snbWluUGVyaW9kJ10pIHsgc1ZhbHVlWydtaW5QZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snZm9ybWF0J10gJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnNbJ2Zvcm1hdCddPT0nZGVsdGEnIHx8IG9wdGlvbnNbJ2Zvcm1hdCddPT0nZnVsbCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydmb3JtYXQnXT0gb3B0aW9uc1snZm9ybWF0J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwb2xpY3knXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1sncG9saWN5J109PSdpbnN0YW50JyB8fCBvcHRpb25zWydwb2xpY3knXT09J2lkZWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0nZml4ZWQnKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNWYWx1ZVsncG9saWN5J109IG9wdGlvbnNbJ3BvbGljeSddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbC5zdWJzY3JpYmUucHVzaChzVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbmQodmFsKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXHJcbiAgICB1bnN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6YW55PScqJykge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2UudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC51bnN1YnNjcmliZT0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7IHZhbC51bnN1YnNjcmliZS5wdXNoKHtwYXRoOiBwYXRofSkgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKiogTUVTU0FHRSBQQVJTSU5HICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgY29udGV4dCBpcyAnc2VsZidcclxuICAgIGlzU2VsZihtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIChtc2cuY29udGV4dD09IHRoaXMuc2VsZklkKSB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIERlbHRhIG1lc3NhZ2VcclxuICAgIGlzRGVsdGEobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiB0eXBlb2YgbXNnLmNvbnRleHQhPSAndW5kZWZpbmVkJyB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcclxuICAgIGlzSGVsbG8obXNnOmFueSk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zZy5zZWxmIT0gJ3VuZGVmaW5lZCcpO1xyXG4gICAgfSAgICAgXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIHJlcXVlc3QgUmVzcG9uc2UgbWVzc2FnZVxyXG4gICAgaXNSZXNwb25zZShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cucmVxdWVzdElkIT0gJ3VuZGVmaW5lZCcgfSBcclxufSIsIi8qKiBXZWIgV29ya2VyIFNlcnZpY2VcclxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLU3RyZWFtV29ya2VyICB7XHJcblxyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSB3b3JrZXI6IFdvcmtlcjtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcblxyXG4gICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICBcclxuICAgIH0gXHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB0aGlzLndvcmtlciA9IHVuZGVmaW5lZDsgfVxyXG5cclxuICAgIC8vICoqIEluaXRpYWxpc2Ugd29ya2VyXHJcbiAgICBpbml0KHBhdGhUb0ZpbGU6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKHR5cGVvZihXb3JrZXIpPT0gXCJ1bmRlZmluZWRcIikgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmKHRoaXMud29ya2VyKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpIH0gICAvLyAqKiB0ZXJtaW5hdGUgYW4gb3BlbiB3b3JrZXJcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZXI9IG5ldyBXb3JrZXIocGF0aFRvRmlsZSk7XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25tZXNzYWdlPSBldmVudD0+IHsgdGhpcy5fbWVzc2FnZS5uZXh0KGV2ZW50KSB9O1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9uZXJyb3I9IGV2ZW50PT4geyB0aGlzLl9lcnJvci5uZXh0KGV2ZW50KSB9OyAgICAgICAgICAgXHJcbiAgICAgICAgLy8gKiogd29ya2VyIHJlYWR5IGZvciBwb3N0TWVzc2FnZSgpXHJcbiAgICB9ICAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBTZW5kIG1lc3NhZ2UgdG8gd29ya2VyXHJcbiAgICBwb3N0TWVzc2FnZShtc2c6YW55KSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIucG9zdE1lc3NhZ2UobXNnKSB9IH1cclxuXHJcbiAgICAvLyAqKiB0ZXJtaW5hdGUgd29ya2VyXHJcbiAgICB0ZXJtaW5hdGUoKSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIudGVybWluYXRlKCl9IH1cclxufSIsIi8qXHJcbiAqIFVVSUQ6IEEganMgbGlicmFyeSB0byBnZW5lcmF0ZSBhbmQgcGFyc2UgVVVJRHMsIFRpbWVVVUlEcyBhbmQgZ2VuZXJhdGVcclxuICogVGltZVVVSUQgYmFzZWQgb24gZGF0ZXMgZm9yIHJhbmdlIHNlbGVjdGlvbnMuXHJcbiAqIEBzZWUgaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcclxuICoqL1xyXG5leHBvcnQgY2xhc3MgVVVJRCB7XHJcblxyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTA4O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNDtcclxuICAgIHByaXZhdGUgbGltaXRVSTE2O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMzI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0MDtcclxuICAgIHByaXZhdGUgbGltaXRVSTQ4O1xyXG5cclxuICAgIHByaXZhdGUgdmVyc2lvbjpudW1iZXI7XHJcbiAgICBwcml2YXRlIGhleDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDQgPSB0aGlzLm1heEZyb21CaXRzKDQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA2ID0gdGhpcy5tYXhGcm9tQml0cyg2KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwOCA9IHRoaXMubWF4RnJvbUJpdHMoOCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTIgPSB0aGlzLm1heEZyb21CaXRzKDEyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNCA9IHRoaXMubWF4RnJvbUJpdHMoMTQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTE2ID0gdGhpcy5tYXhGcm9tQml0cygxNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMzIgPSB0aGlzLm1heEZyb21CaXRzKDMyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0MCA9IHRoaXMubWF4RnJvbUJpdHMoNDApO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTQ4ID0gdGhpcy5tYXhGcm9tQml0cyg0OCk7IFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gdGhpcy5oZXggfVxyXG4gICAgdG9VUk4oKSB7IHJldHVybiAndXJuOnV1aWQ6JyArIHRoaXMuaGV4IH1cclxuICAgIHRvU2lnbmFsSygpOnN0cmluZyAgeyByZXR1cm4gYHVybjptcm46c2lnbmFsazp1dWlkOiR7dGhpcy5oZXh9YCB9XHJcbiAgICB0b0J5dGVzKCkge1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IHRoaXMuaGV4LnNwbGl0KCctJyk7XHJcbiAgICAgICAgbGV0IGludHMgPSBbXTtcclxuICAgICAgICBsZXQgaW50UG9zID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydHNbaV0ubGVuZ3RoOyBqKz0yKSB7XHJcbiAgICAgICAgICAgIGludHNbaW50UG9zKytdID0gcGFyc2VJbnQocGFydHNbaV0uc3Vic3RyKGosIDIpLCAxNik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludHM7XHJcbiAgICB9OyAgICBcclxuXHJcbiAgICBwcml2YXRlIG1heEZyb21CaXRzKGJpdHMpIHsgcmV0dXJuIE1hdGgucG93KDIsIGJpdHMpIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSYW5kb21JbnQobWluLCBtYXgpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4gfVxyXG5cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA2LTEpO31cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwOCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA4LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTEyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE2LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkzMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTMyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0MCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0MCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTQ4KCkgeyByZXR1cm4gKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgMzApKSArICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDQ4IC0gMzApKSAqICgxIDw8IDMwKSB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5mcm9tUGFydHMoXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkzMigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMTYoKSxcclxuICAgICAgICAgICAgMHg0MDAwIHwgdGhpcy5yYW5kb21VSTEyKCksXHJcbiAgICAgICAgICAgIDB4ODAgICB8IHRoaXMucmFuZG9tVUkwNigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMDgoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTQ4KClcclxuICAgICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHBhZGRlZFN0cmluZyhzdHJpbmcsIGxlbmd0aCwgej1udWxsKSB7XHJcbiAgICAgICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XHJcbiAgICAgICAgeiA9ICgheikgPyAnMCcgOiB6O1xyXG4gICAgICAgIGxldCBpID0gbGVuZ3RoIC0gc3RyaW5nLmxlbmd0aDtcclxuICAgICAgICBmb3IgKDsgaSA+IDA7IGkgPj4+PSAxLCB6ICs9IHopIHtcclxuICAgICAgICAgICAgaWYgKGkgJiAxKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyA9IHogKyBzdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cmluZztcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBmcm9tUGFydHModGltZUxvdywgdGltZU1pZCwgdGltZUhpQW5kVmVyc2lvbiwgY2xvY2tTZXFIaUFuZFJlc2VydmVkLCBjbG9ja1NlcUxvdywgbm9kZSkge1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9ICh0aW1lSGlBbmRWZXJzaW9uID4+IDEyKSAmIDB4RjtcclxuICAgICAgICB0aGlzLmhleCA9IHRoaXMucGFkZGVkU3RyaW5nKHRpbWVMb3cudG9TdHJpbmcoMTYpLCA4KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVNaWQudG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVIaUFuZFZlcnNpb24udG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxSGlBbmRSZXNlcnZlZC50b1N0cmluZygxNiksIDIpXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcoY2xvY2tTZXFMb3cudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKG5vZGUudG9TdHJpbmcoMTYpLCAxMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9OyAgICBcclxuICAgIFxyXG4gICAgLypcclxuICAgIHByaXZhdGUgZ2V0VGltZUZpZWxkVmFsdWVzKHRpbWUpIHtcclxuICAgICAgICBsZXQgdHMgPSB0aW1lIC0gRGF0ZS5VVEMoMTU4MiwgOSwgMTUpO1xyXG4gICAgICAgIGxldCBobSA9ICgodHMgLyAweDEwMDAwMDAwMCkgKiAxMDAwMCkgJiAweEZGRkZGRkY7XHJcbiAgICAgICAgcmV0dXJuIHsgbG93OiAoKHRzICYgMHhGRkZGRkZGKSAqIDEwMDAwKSAlIDB4MTAwMDAwMDAwLFxyXG4gICAgICAgICAgICAgICAgbWlkOiBobSAmIDB4RkZGRiwgaGk6IGhtID4+PiAxNiwgdGltZXN0YW1wOiB0cyB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tVGltZSh0aW1lLCBsYXN0OmJvb2xlYW4pIHtcclxuICAgICAgICBsYXN0ID0gKCFsYXN0KSA/IGZhbHNlIDogbGFzdDtcclxuICAgICAgICBsZXQgdGYgPSB0aGlzLmdldFRpbWVGaWVsZFZhbHVlcyh0aW1lKTtcclxuICAgICAgICBsZXQgdGwgPSB0Zi5sb3c7XHJcbiAgICAgICAgbGV0IHRoYXYgPSAodGYuaGkgJiAweEZGRikgfCAweDEwMDA7ICAvLyBzZXQgdmVyc2lvbiAnMDAwMSdcclxuICAgICAgICBpZiAobGFzdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVVUlEKCkuZnJvbVBhcnRzKHRsLCB0Zi5taWQsIHRoYXYsIDAsIDAsIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRCgpLmZyb21QYXJ0cyh0bCwgdGYubWlkLCB0aGF2LCAweDgwIHwgdGhpcy5saW1pdFVJMDYsIHRoaXMubGltaXRVSTA4IC0gMSwgdGhpcy5saW1pdFVJNDggLSAxKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZpcnN0RnJvbVRpbWUodGltZSkgeyByZXR1cm4gdGhpcy5mcm9tVGltZSh0aW1lLCBmYWxzZSkgfVxyXG4gICAgbGFzdEZyb21UaW1lKHRpbWUpIHsgcmV0dXJuIHRoaXMuZnJvbVRpbWUodGltZSwgdHJ1ZSkgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIGVxdWFscyh1dWlkKSB7XHJcbiAgICAgICAgaWYgKCEodXVpZCBpbnN0YW5jZW9mIFVVSUQpKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGV4ICE9PSB1dWlkLmhleCkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tVVJOKHN0cklkKSB7XHJcbiAgICAgICAgbGV0IHI7XHJcbiAgICAgICAgbGV0IHAgPSAvXig/OnVybjp1dWlkOnxcXHspPyhbMC05YS1mXXs4fSktKFswLTlhLWZdezR9KS0oWzAtOWEtZl17NH0pLShbMC05YS1mXXsyfSkoWzAtOWEtZl17Mn0pLShbMC05YS1mXXsxMn0pKD86XFx9KT8kL2k7XHJcbiAgICAgICAgaWYgKChyID0gcC5leGVjKHN0cklkKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnJvbVBhcnRzKFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoclsxXSwgMTYpLCBwYXJzZUludChyWzJdLCAxNiksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzNdLCAxNiksIHBhcnNlSW50KHJbNF0sIDE2KSxcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbNV0sIDE2KSwgcGFyc2VJbnQocls2XSwgMTYpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZyb21CeXRlcyhpbnRzKSB7XHJcbiAgICAgICAgaWYgKGludHMubGVuZ3RoIDwgNSkgeyByZXR1cm4gbnVsbCB9XHJcbiAgICAgICAgbGV0IHN0ciA9ICcnO1xyXG4gICAgICAgIGxldCBwb3MgPSAwO1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IFs0LCAyLCAyLCAyLCA2XTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydHNbaV07IGorKykge1xyXG4gICAgICAgICAgICBsZXQgb2N0ZXQgPSBpbnRzW3BvcysrXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIGlmIChvY3RldC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgb2N0ZXQgPSAnMCcgKyBvY3RldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHIgKz0gb2N0ZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhcnRzW2ldICE9PSA2KSB7XHJcbiAgICAgICAgICAgIHN0ciArPSAnLSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbVVSTihzdHIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tQmluYXJ5KGJpbmFyeSkge1xyXG4gICAgICAgIGxldCBpbnRzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaW50c1tpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBpZiAoaW50c1tpXSA+IDI1NSB8fCBpbnRzW2ldIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgYnl0ZSBpbiBiaW5hcnkgZGF0YS4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9tQnl0ZXMoaW50cyk7XHJcbiAgICB9O1xyXG4gICAgKi9cclxuXHJcbn07IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgU2lnbmFsS0h0dHAgfSBmcm9tICcuL2h0dHAtYXBpJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW0gfSBmcm9tICcuL3N0cmVhbS1hcGknO1xuaW1wb3J0IHsgUGF0aCwgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbVdvcmtlcn0gZnJvbSAnLi9zdHJlYW0td29ya2VyJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gIFxuICAgIHByaXZhdGUgX3ZlcnNpb246IHN0cmluZz0gJ3YxJzsgICAgICAvLyAqKiBkZWZhdWx0IFNpZ25hbCBLIGFwaSB2ZXJzaW9uXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICBwcml2YXRlIGRlYnVnKHZhbDogYW55KSB7IGlmKGlzRGV2TW9kZSgpKXsgY29uc29sZS5sb2codmFsKSB9IH1cbiAgICBcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwdWJsaWMgc2VydmVyPSB7XG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW11cbiAgICB9ICAgIFxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IFxuICAgICAgICB0aGlzLl90b2tlbj0gdmFsO1xuICAgICAgICB0aGlzLmFwaS50b2tlbj0gdmFsO1xuICAgICAgICB0aGlzLnN0cmVhbS50b2tlbj0gdmFsO1xuICAgIH0gICAgXG4gICAgLy8gKiogTWVzc2FnZSBPYmplY3RcbiAgICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuIE1lc3NhZ2UgfVxuXG4gICAgLy8gKiogZ2VuZXJhdGUgYW5kIHJldHVybiBhIFVVSUQgb2JqZWN0XG4gICAgZ2V0IHV1aWQoKTpVVUlEIHsgcmV0dXJuIG5ldyBVVUlEKCkgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhcGk6IFNpZ25hbEtIdHRwLCBcbiAgICAgICAgICAgICAgICBwdWJsaWMgc3RyZWFtOiBTaWduYWxLU3RyZWFtLFxuICAgICAgICAgICAgICAgIHB1YmxpYyB3b3JrZXI6IFNpZ25hbEtTdHJlYW1Xb3JrZXIgKSB7IFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH0gICBcbiAgICBcbiAgICAvLyAqKiBpbml0aWFsaXNlIHByb3RvY29sLCBob3N0bmFtZSwgcG9ydCB2YWx1ZXNcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPSdsb2NhbGhvc3QnLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDQ0MztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfSAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogQ09OTkVDVElPTiBBTkQgRElTQ09WRVJZICAqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGVuZHBvaW50IGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlciAoZW5kcG9pbnQgZGlzY292ZXJ5KSBhbmQgRE8gTk9UIG9wZW4gU3RyZWFtXG4gICAgY29ubmVjdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgICAgICByZXNwb25zZT0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0uZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpOyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIHNlcnZlclxuICAgIGRpc2Nvbm5lY3QoKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCk7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB9XG4gICAgXG4gICAgLy8gKiogQ29ubmVjdCArIG9wZW4gRGVsdGEgU3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFN0cmVhbShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpXG4gICAgICAgICAgICAudGhlbiggKCk9PiB7IFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KTtcbiAgICB9IFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0UGxheWJhY2soaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBvcHRpb25zOmFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpXG4gICAgICAgICAgICAudGhlbiggKCk9PiB7IFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIHRoaXMub3BlblBsYXliYWNrKG51bGwsIG9wdGlvbnMsIHRoaXMuX3Rva2VuKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCBlPT4geyByZWplY3QoIGUgKSB9KTtcbiAgICAgICAgfSlcbiAgICB9ICAgICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSB3aXRoIChOTyBlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgb3BlblN0cmVhbSh1cmw6c3RyaW5nPW51bGwsIHN1YnNjcmliZT86c3RyaW5nLCB0b2tlbj86c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ29wZW5TdHJlYW0uLi4uLi4uLi4nKTsgIFxuICAgICAgICBpZighdXJsKSB7ICAgICAvLyBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgZGlzY292ZXJlZCBlbmRwb2ludFxuICAgICAgICAgICAgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4oIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCwgc3Vic2NyaWJlLCB0b2tlbik7ICBcbiAgICAgICAgcmV0dXJuIHRydWU7ICAgICAgXG4gICAgfSAgIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuUGxheWJhY2sodXJsOnN0cmluZz1udWxsLCBvcHRpb25zPzphbnksIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblBsYXliYWNrLi4uLi4uLi4uJyk7XG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXJsPSB1cmwucmVwbGFjZSgnc3RyZWFtJywgJ3BsYXliYWNrJyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBsZXQgcGI9ICcnO1xuICAgICAgICBsZXQgc3Vic2NyaWJlOiBzdHJpbmc7XG4gICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09J29iamVjdCcpe1xuICAgICAgICAgICAgcGIrPSAob3B0aW9ucy5zdGFydFRpbWUpID8gJz9zdGFydFRpbWU9JyArIG9wdGlvbnMuc3RhcnRUaW1lLnNsaWNlKDAsb3B0aW9ucy5zdGFydFRpbWUuaW5kZXhPZignLicpKSArICdaJyA6ICcnO1xuICAgICAgICAgICAgcGIrPSAob3B0aW9ucy5wbGF5YmFja1JhdGUpID8gYCZwbGF5YmFja1JhdGU9JHtvcHRpb25zLnBsYXliYWNrUmF0ZX1gIDogJyc7XG4gICAgICAgICAgICBzdWJzY3JpYmU9IChvcHRpb25zLnN1YnNjcmliZSkgPyBvcHRpb25zLnN1YnNjcmliZSA6IG51bGw7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwgKyBwYiwgc3Vic2NyaWJlLCB0b2tlbik7IFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9ICAgICAgXG5cbiAgICAvLyAqKiBwcm9jZXNzIEhlbGxvIHJlc3BvbnNlIFxuICAgIHByaXZhdGUgcHJvY2Vzc0hlbGxvKHJlc3BvbnNlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSAocmVzcG9uc2VbJ2VuZHBvaW50cyddKSA/IHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2VbJ3NlcnZlciddKSA/IHJlc3BvbnNlWydzZXJ2ZXInXSA6IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gKHRoaXMuc2VydmVyLmVuZHBvaW50cykgPyBPYmplY3Qua2V5cyh0aGlzLnNlcnZlci5lbmRwb2ludHMpIDogW107XG4gICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICB9XG5cbiAgICAvLyAqKiByZXR1cm4gcHJlZmVycmVkIFdTIHN0cmVhbSB1cmxcbiAgICBwdWJsaWMgcmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk6c3RyaW5nIHtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIGVuZHBvaW50IHZlcnNpb246ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBmYWxsaW5nIGJhY2sgdG86IHYxYCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ119YCBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIG51bGwgfVxuICAgIH0gIFxuXG4gICAgLy8gKiogcmV0dXJuIHNpZ25hbGstaHR0cCBlbmRwb2ludCB1cmxcbiAgICBwcml2YXRlIHJlc29sdmVIdHRwRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSkgeyAvLyAqKiBjb25uZWN0aW9uIG1hZGVcbiAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gaHR0cCBlbmRwb2ludCBhdCBwcmVzY3JpYmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddKSB7XG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstaHR0cCddfWAgfSAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtc2c9ICdObyBjdXJyZW50IGNvbm5lY3Rpb24gaHR0cCBlbmRwb2ludCBzZXJ2aWNlISBVc2UgY29ubmVjdCgpIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uJ1xuICAgICAgICAgICAgdGhpcy5kZWJ1Zyhtc2cpO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdXJsOyAgIFxuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY2xlYW51cCBvbiBzZXJ2ZXIgZGlzY29ubmVjdGlvblxuICAgIHByaXZhdGUgZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgIFxuICAgIH1cblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIHBhdGhcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBnZXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwdXQgdG8gaHR0cCBwYXRoXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwdXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTtcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHBvc3QgdG8gaHR0cCBwYXRoXG4gICAgcG9zdChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcG9zdCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07ICAgXG5cbiAgICAvLyAqKiBnZXQgYXV0aCB0b2tlbiBmb3Igc3VwcGxpZWQgdXNlciBkZXRhaWxzICoqXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgYGFwcGxpY2F0aW9uL2pzb25gKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXHRcbiAgICAvLyAqKiBsb2dvdXQgZnJvbSBzZXJ2ZXIgKipcbiAgICBsb2dvdXQoKSB7XG5cdFx0bGV0IHVybD1gJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ291dGA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCwgeyBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsICkgfVxuICAgIH1cdCAgIFxuICAgIFxuICAgIC8vKiogZ2V0IGRhdGEgdmlhIHRoZSBzbmFwc2hvdCBodHRwIGFwaSBwYXRoIGZvciBzdXBwbGllZCB0aW1lXG4gICAgc25hcHNob3QoY29udGV4dDpzdHJpbmcsIHRpbWU6c3RyaW5nKSB7IFxuICAgICAgICBpZighdGltZSkgeyByZXR1cm4gfVxuICAgICAgICB0aW1lPSB0aW1lLnNsaWNlKDAsdGltZS5pbmRleE9mKCcuJykpICsgJ1onO1xuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICB1cmw9IGAke3VybC5yZXBsYWNlKCdhcGknLCdzbmFwc2hvdCcpfSR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfT90aW1lPSR7dGltZX1gO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxuICAgIH1cblxufVxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIFNpZ25hbEtDbGllbnQgTW9kdWxlOlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogWyBIdHRwQ2xpZW50TW9kdWxlIF0sICAgIFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOiBbXSwgXHJcbiAgICBwcm92aWRlcnM6IFtdICBcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnRNb2R1bGUge31cclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vc2lnbmFsay1jbGllbnQnOyJdLCJuYW1lcyI6WyJIdHRwSGVhZGVycyIsIkluamVjdGFibGUiLCJIdHRwQ2xpZW50IiwiU3ViamVjdCIsImlzRGV2TW9kZSIsIk5nTW9kdWxlIiwiSHR0cENsaWVudE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFDQTs7O1FBQUE7U0FjQzs7Ozs7OztRQVhVLGVBQVU7Ozs7OztZQUFqQixVQUFrQixJQUFXO2dCQUN6QixJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUUsQ0FBQyxDQUFDLEVBQUU7b0JBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFBRTtxQkFDekQ7b0JBQUUsT0FBTyxJQUFJLENBQUE7aUJBQUU7YUFDdkI7Ozs7Ozs7UUFHTSxrQkFBYTs7Ozs7O1lBQXBCLFVBQXFCLE9BQWM7O29CQUMz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