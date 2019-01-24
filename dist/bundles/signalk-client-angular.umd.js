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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3V0aWxzLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9odHRwLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLWFwaS50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc3RyZWFtLXdvcmtlci50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAqKiBQYXRoIHV0aWxpdGllc1xyXG5leHBvcnQgY2xhc3MgUGF0aCB7XHJcblxyXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxyXG4gICAgc3RhdGljIGRvdFRvU2xhc2gocGF0aDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgaWYocGF0aC5pbmRleE9mKCcuJykhPS0xKSB7IHJldHVybiBwYXRoLnNwbGl0KCcuJykuam9pbignLycpIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHBhdGggfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHBhcnNlIGNvbnRleHQgdG8gdmFsaWQgU2lnbmFsIEsgcGF0aFxyXG4gICAgc3RhdGljIGNvbnRleHRUb1BhdGgoY29udGV4dDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJlcz0gKGNvbnRleHQ9PSdzZWxmJyApID8gJ3Zlc3NlbHMuc2VsZic6IGNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zcGxpdCgnLicpLmpvaW4oJy8nKTtcclxuICAgIH0gICAgXHJcblxyXG59XHJcblxyXG4vLyAqKiBNZXNzYWdlIHRlbXBsYXRlcyAqKlxyXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XHJcbiAgIFxyXG4gICAgLy8gKiogcmV0dXJuIFVQREFURVMgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1cGRhdGVzKCkgeyBcclxuICAgICAgICAvLyBhcnJheSB2YWx1ZXM9IHsgdmFsdWVzOiBbIHtwYXRoOiB4eCwgdmFsdWU6IHh4IH0gXSB9XHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVwZGF0ZXM6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vICoqIHJldHVybiBTVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyBzdWJzY3JpYmUoKSB7IFxyXG4gICAgICAgIC8qIGFycmF5IHZhbHVlcz0ge1xyXG4gICAgICAgICAgICBcInBhdGhcIjogXCJwYXRoLnRvLmtleVwiLFxyXG4gICAgICAgICAgICBcInBlcmlvZFwiOiAxMDAwLFxyXG4gICAgICAgICAgICBcImZvcm1hdFwiOiBcImRlbHRhXCIsXHJcbiAgICAgICAgICAgIFwicG9saWN5XCI6IFwiaWRlYWxcIixcclxuICAgICAgICAgICAgXCJtaW5QZXJpb2RcIjogMjAwXHJcbiAgICAgICAgICAgIH0gKi9cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgc3Vic2NyaWJlOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9ICAgIFxyXG4gICAgLy8gKiogcmV0dXJuIFVOU1VCU0NSSUJFIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgdW5zdWJzY3JpYmUoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyBcInBhdGhcIjogXCJwYXRoLnRvLmtleVwiIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gIFxyXG4gICAgLy8gKiogcmV0dXJuIFJFUVVFU1QgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyByZXF1ZXN0KCkgeyBcclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgcmVxdWVzdElkOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICAgICAgICAgXHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0h0dHAge1xyXG5cclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCB0b2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgfSAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBnZXQgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZi4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmdldChgdmVzc2Vscy9zZWxmYCkgfVxyXG5cclxuICAgIC8vKiogZ2V0IElEIG9mIHZlc3NlbCBzZWxmIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5nZXQoYHNlbGZgKSB9XHJcblxyXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxyXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGAke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9L21ldGFgKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8qKiBnZXQgQVBJIHBhdGggdmFsdWUgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gdGhpcy5lbmRwb2ludCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIHB1dC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuXHRwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XHJcbiAgICBwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk/OmFueSwgdmFsdWU/OmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpICsgJy8nICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGxldCBtc2cgPSB7IHZhbHVlOiB7fSB9IFxyXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZT09J3VuZGVmaW5lZCcpIHsgbXNnLnZhbHVlPSBrZXkgfVxyXG5cdFx0ZWxzZSB7IG1zZy52YWx1ZVtrZXldPSB2YWx1ZSB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZykgfVxyXG4gICAgfSBcclxuXHJcbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW0ge1xyXG5cclxuXHRwcml2YXRlIF9jb25uZWN0OiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIF9jbG9zZTogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG5cclxuICAgIHByaXZhdGUgd3M6IGFueTsgICAgXHJcbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xyXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgIFxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgIFxyXG4gICAgcHJpdmF0ZSBfcGxheWJhY2tNb2RlOiBib29sZWFuPSBmYWxzZTtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIG9uQ29ubmVjdDogT2JzZXJ2YWJsZTxhbnk+O1x0XHRcclxuICAgIHB1YmxpYyBvbkNsb3NlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2VsZklkOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCB0b2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXHJcbiAgICBnZXQgY29ubmVjdGlvblRpbWVvdXQoKTpudW1iZXIgeyByZXR1cm4gdGhpcy5fd3NUaW1lb3V0IH1cclxuICAgIHNldCBjb25uZWN0aW9uVGltZW91dCh2YWw6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XHJcbiAgICB9ICAgXHJcbiAgICAvLyAqKiBpcyBXUyBTdHJlYW0gY29ubmVjdGVkP1xyXG4gICAgZ2V0IGlzT3BlbigpOmJvb2xlYW4geyBcclxuICAgICAgICByZXR1cm4gKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9ICBcclxuICAgIC8vICoqIGdldCAvIHNldCBmaWx0ZXIgdG8gc2VsZWN0IGRlbHRhIG1lc3NhZ2VzIGp1c3QgZm9yIHN1cHBsaWVkIHZlc3NlbCBpZCAgIFxyXG4gICAgZ2V0IGZpbHRlcigpOnN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxyXG4gICAgLy8gKiogc2V0IGZpbHRlcj0gbnVsbCB0byByZW1vdmUgbWVzc2FnZSBmaWx0ZXJpbmdcclxuICAgIHNldCBmaWx0ZXIoaWQ6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCBpZCAmJiBpZC5pbmRleE9mKCdzZWxmJykhPS0xICkgeyAgLy8gKiogc2VsZlxyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXI9ICh0aGlzLnNlbGZJZCkgPyB0aGlzLnNlbGZJZCA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyB0aGlzLl9maWx0ZXI9IGlkIH1cclxuICAgIH0gICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBQbGF5YmFjayBIZWxsbyBtZXNzYWdlXHJcbiAgICBnZXQgcGxheWJhY2tNb2RlKCk6Ym9vbGVhbiB7IHJldHVybiB0aGlzLl9wbGF5YmFja01vZGUgfVxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCApIHsgXHJcbiAgICAgICAgdGhpcy5fY29ubmVjdD0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25Db25uZWN0PSB0aGlzLl9jb25uZWN0LmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNsb3NlPSB0aGlzLl9jbG9zZS5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICAgICAgICBcclxuICAgIH0gICBcclxuXHJcbiAgICAvLyAqKiBDbG9zZSBXZWJTb2NrZXQgY29ubmVjdGlvblxyXG4gICAgY2xvc2UoKSB7IGlmKHRoaXMud3MpIHsgdGhpcy53cy5jbG9zZSgpOyB0aGlzLndzPSBudWxsOyB9IH1cclxuICAgXHJcblx0Ly8gKiogT3BlbiBhIFdlYlNvY2tldCBhdCBwcm92aWRlZCB1cmxcclxuXHRvcGVuKHVybDpzdHJpbmcsIHN1YnNjcmliZT86c3RyaW5nLCB0b2tlbj86c3RyaW5nKSB7XHJcbiAgICAgICAgdXJsPSAodXJsKSA/IHVybCA6IHRoaXMuZW5kcG9pbnQ7XHJcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGxldCBxPSAodXJsLmluZGV4T2YoJz8nKT09LTEpID8gJz8nIDogJyYnXHJcbiAgICAgICAgaWYoc3Vic2NyaWJlKSB7IHVybCs9YCR7cX1zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuIHx8IHRva2VuKSB7IHVybCs9IGAkeyhzdWJzY3JpYmUpID8gJyYnIDogJz8nfXRva2VuPSR7dGhpcy5fdG9rZW4gfHwgdG9rZW59YCB9IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xyXG4gICAgICAgIC8vICoqIHN0YXJ0IGNvbm5lY3Rpb24gd2F0Y2hkb2cgKipcclxuICAgICAgICBzZXRUaW1lb3V0KCBcclxuICAgICAgICAgICAgKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENvbm5lY3Rpb24gd2F0Y2hkb2cgZXhwaXJlZCAoJHt0aGlzLl93c1RpbWVvdXQvMTAwMH0gc2VjKTogJHt0aGlzLndzLnJlYWR5U3RhdGV9Li4uIGFib3J0aW5nIGNvbm5lY3Rpb24uLi5gKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzLl93c1RpbWVvdXRcclxuICAgICAgICApO1xyXG5cdFx0XHJcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgdGhpcy5fY29ubmVjdC5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5fY2xvc2UubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9uZXJyb3I9IGU9PiB7IHRoaXMuX2Vycm9yLm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbm1lc3NhZ2U9IGU9PiB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOiBhbnk7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkgeyBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZklkPSBkYXRhLnNlbGY7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5YmFja01vZGU9ICh0eXBlb2YgZGF0YS5zdGFydFRpbWUhPSAndW5kZWZpbmVkJykgPyB0cnVlIDogZmFsc2U7ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuXHRcdH1cclxuICAgIH0gICAgICBcclxuXHJcbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXHJcbiAgICBzZW5kKGRhdGE6YW55KSB7XHJcbiAgICAgICAgaWYodGhpcy53cykge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgdmFsdWUocykgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOiBzdHJpbmcgfCBBcnJheTxhbnk+LCB2YWx1ZT86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51cGRhdGVzKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBsZXQgdVZhbHVlcz0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXMucHVzaCh7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXM9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbC51cGRhdGVzLnB1c2goeyB2YWx1ZXM6IHVWYWx1ZXMgfSApOyBcclxuICAgICAgICB0aGlzLnNlbmQodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzIG9wdGlvbnM6IHsuLn0qKlxyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOkFycmF5PGFueT4pO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgb3B0aW9ucz86YW55KTtcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nIHwgQXJyYXk8YW55Pj0nKicsIG9wdGlvbnM/OmFueSkge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2Uuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICB2YWwuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHNWYWx1ZT0ge307XHJcbiAgICAgICAgICAgIHNWYWx1ZVsncGF0aCddPSBwYXRoO1xyXG4gICAgICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1sncGVyaW9kJ10pIHsgc1ZhbHVlWydwZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snbWluUGVyaW9kJ10pIHsgc1ZhbHVlWydtaW5QZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snZm9ybWF0J10gJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnNbJ2Zvcm1hdCddPT0nZGVsdGEnIHx8IG9wdGlvbnNbJ2Zvcm1hdCddPT0nZnVsbCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydmb3JtYXQnXT0gb3B0aW9uc1snZm9ybWF0J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwb2xpY3knXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1sncG9saWN5J109PSdpbnN0YW50JyB8fCBvcHRpb25zWydwb2xpY3knXT09J2lkZWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0nZml4ZWQnKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNWYWx1ZVsncG9saWN5J109IG9wdGlvbnNbJ3BvbGljeSddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbC5zdWJzY3JpYmUucHVzaChzVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbmQodmFsKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXHJcbiAgICB1bnN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6YW55PScqJykge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2UudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC51bnN1YnNjcmliZT0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7IHZhbC51bnN1YnNjcmliZS5wdXNoKHtwYXRoOiBwYXRofSkgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKiogTUVTU0FHRSBQQVJTSU5HICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgY29udGV4dCBpcyAnc2VsZidcclxuICAgIGlzU2VsZihtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIChtc2cuY29udGV4dD09IHRoaXMuc2VsZklkKSB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIERlbHRhIG1lc3NhZ2VcclxuICAgIGlzRGVsdGEobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiB0eXBlb2YgbXNnLmNvbnRleHQhPSAndW5kZWZpbmVkJyB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcclxuICAgIGlzSGVsbG8obXNnOmFueSk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zZy5zZWxmIT0gJ3VuZGVmaW5lZCcpO1xyXG4gICAgfSAgICAgXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIHJlcXVlc3QgUmVzcG9uc2UgbWVzc2FnZVxyXG4gICAgaXNSZXNwb25zZShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cucmVxdWVzdElkIT0gJ3VuZGVmaW5lZCcgfSBcclxufSIsIi8qKiBXZWIgV29ya2VyIFNlcnZpY2VcclxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLU3RyZWFtV29ya2VyICB7XHJcblxyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSB3b3JrZXI6IFdvcmtlcjtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcblxyXG4gICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICBcclxuICAgIH0gXHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB0aGlzLndvcmtlciA9IHVuZGVmaW5lZDsgfVxyXG5cclxuICAgIC8vICoqIEluaXRpYWxpc2Ugd29ya2VyXHJcbiAgICBpbml0KHBhdGhUb0ZpbGU6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKHR5cGVvZihXb3JrZXIpPT0gXCJ1bmRlZmluZWRcIikgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmKHRoaXMud29ya2VyKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpIH0gICAvLyAqKiB0ZXJtaW5hdGUgYW4gb3BlbiB3b3JrZXJcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZXI9IG5ldyBXb3JrZXIocGF0aFRvRmlsZSk7XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25tZXNzYWdlPSBldmVudD0+IHsgdGhpcy5fbWVzc2FnZS5uZXh0KGV2ZW50KSB9O1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9uZXJyb3I9IGV2ZW50PT4geyB0aGlzLl9lcnJvci5uZXh0KGV2ZW50KSB9OyAgICAgICAgICAgXHJcbiAgICAgICAgLy8gKiogd29ya2VyIHJlYWR5IGZvciBwb3N0TWVzc2FnZSgpXHJcbiAgICB9ICAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBTZW5kIG1lc3NhZ2UgdG8gd29ya2VyXHJcbiAgICBwb3N0TWVzc2FnZShtc2c6YW55KSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIucG9zdE1lc3NhZ2UobXNnKSB9IH1cclxuXHJcbiAgICAvLyAqKiB0ZXJtaW5hdGUgd29ya2VyXHJcbiAgICB0ZXJtaW5hdGUoKSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIudGVybWluYXRlKCl9IH1cclxufSIsImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IFNpZ25hbEtIdHRwIH0gZnJvbSAnLi9odHRwLWFwaSc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtIH0gZnJvbSAnLi9zdHJlYW0tYXBpJztcbmltcG9ydCB7IFBhdGgsIE1lc3NhZ2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW1Xb3JrZXJ9IGZyb20gJy4vc3RyZWFtLXdvcmtlcic7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuICAgIFxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHB1YmxpYyBzZXJ2ZXI9IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXVxuICAgIH0gICAgXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgXG4gICAgICAgIHRoaXMuX3Rva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuYXBpLnRva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuc3RyZWFtLnRva2VuPSB2YWw7XG4gICAgfSAgICBcbiAgICAvLyAqKiBNZXNzYWdlIE9iamVjdFxuICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gTWVzc2FnZSB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgXG4gICAgICAgICAgICAgICAgcHVibGljIGFwaTogU2lnbmFsS0h0dHAsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzdHJlYW06IFNpZ25hbEtTdHJlYW0sXG4gICAgICAgICAgICAgICAgcHVibGljIHdvcmtlcjogU2lnbmFsS1N0cmVhbVdvcmtlciApIHsgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfSAgIFxuICAgIFxuICAgIC8vICoqIGluaXRpYWxpc2UgcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0IHZhbHVlc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9J2xvY2FsaG9zdCcsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OIEFORCBESVNDT1ZFUlkgICoqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZW5kcG9pbnQgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyIChlbmRwb2ludCBkaXNjb3ZlcnkpIGFuZCBETyBOT1Qgb3BlbiBTdHJlYW1cbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlPT4geyBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKTsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IH1cbiAgICBcbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RQbGF5YmFjayhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIG9wdGlvbnM6YW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHB1dCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTsgICBcblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwgKSB9XG4gICAgfVx0ICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuXG59XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogU2lnbmFsS0NsaWVudCBNb2R1bGU6XHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbIEh0dHBDbGllbnRNb2R1bGUgXSwgICAgXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW10sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdLCBcclxuICAgIHByb3ZpZGVyczogW10gIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudE1vZHVsZSB7fVxyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9zaWduYWxrLWNsaWVudCc7Il0sIm5hbWVzIjpbIkh0dHBIZWFkZXJzIiwiSW5qZWN0YWJsZSIsIkh0dHBDbGllbnQiLCJTdWJqZWN0IiwiaXNEZXZNb2RlIiwiTmdNb2R1bGUiLCJIdHRwQ2xpZW50TW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUNBOzs7UUFBQTtTQWNDOzs7Ozs7O1FBWFUsZUFBVTs7Ozs7O1lBQWpCLFVBQWtCLElBQVc7Z0JBQ3pCLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBRTtvQkFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUFFO3FCQUN6RDtvQkFBRSxPQUFPLElBQUksQ0FBQTtpQkFBRTthQUN2Qjs7Ozs7OztRQUdNLGtCQUFhOzs7Ozs7WUFBcEIsVUFBcUIsT0FBYzs7b0JBQzNCLEdBQUcsR0FBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLElBQUssY0FBYyxHQUFFLE9BQU87Z0JBQ3JELE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkM7UUFFTCxXQUFDO0lBQUQsQ0FBQyxJQUFBOztJQUdEOzs7UUFBQTtTQXVDQzs7Ozs7O1FBcENVLGVBQU87Ozs7O1lBQWQ7O2dCQUVJLE9BQU87b0JBQ0gsT0FBTyxFQUFFLElBQUk7b0JBQ2IsT0FBTyxFQUFFLEVBQUU7aUJBQ2QsQ0FBQTthQUNKOzs7Ozs7UUFFTSxpQkFBUzs7Ozs7WUFBaEI7Ozs7Ozs7O2dCQVFJLE9BQU87b0JBQ0gsT0FBTyxFQUFFLElBQUk7b0JBQ2IsU0FBUyxFQUFFLEVBQUU7aUJBQ2hCLENBQUE7YUFDSjs7Ozs7O1FBRU0sbUJBQVc7Ozs7O1lBQWxCOztnQkFFSSxPQUFPO29CQUNILE9BQU8sRUFBRSxJQUFJO29CQUNiLFdBQVcsRUFBRSxFQUFFO2lCQUNsQixDQUFBO2FBQ0o7Ozs7OztRQUVNLGVBQU87Ozs7O1lBQWQ7Z0JBQ0ksT0FBTztvQkFDSCxTQUFTLEVBQUUsSUFBSTtpQkFDbEIsQ0FBQTthQUNKO1FBRUwsY0FBQztJQUFELENBQUMsSUFBQTs7Ozs7O0FDekREOztRQWlCSSxxQkFBcUIsSUFBZ0I7WUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtTQUFNO1FBSjNDLHNCQUFJLDhCQUFLOzs7Ozs7OztZQUFULFVBQVUsR0FBVSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUUsR0FBRyxDQUFBLEVBQUU7OztXQUFBOzs7Ozs7UUFPMUMsNkJBQU87Ozs7O1lBQVAsY0FBWSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUEsRUFBRTs7Ozs7O1FBRzdDLCtCQUFTOzs7OztZQUFULGNBQWMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBLEVBQUU7Ozs7Ozs7O1FBR3ZDLDZCQUFPOzs7Ozs7O1lBQVAsVUFBUSxPQUFjLEVBQUUsSUFBVztnQkFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBTyxDQUFDLENBQUM7YUFDbkY7Ozs7Ozs7UUFHRCx5QkFBRzs7Ozs7O1lBQUgsVUFBSSxJQUFXO2dCQUNYLElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUFFLE9BQU07aUJBQUU7Z0JBQzdCLElBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsRUFBRTtvQkFBRSxJQUFJLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFBRTs7b0JBQ3BDLEdBQUcsR0FBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUM5QyxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O3dCQUNSLE9BQU8sR0FBRSxJQUFJQSxjQUFXLENBQUUsRUFBRSxlQUFlLEVBQUUsU0FBTyxJQUFJLENBQUMsTUFBUSxFQUFFLENBQUU7b0JBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFFLENBQUM7aUJBQ3JEO3FCQUNJO29CQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQUU7YUFDckM7Ozs7Ozs7O1FBS0QseUJBQUc7Ozs7Ozs7WUFBSCxVQUFJLE9BQWMsRUFBRSxJQUFXLEVBQUUsR0FBUSxFQUFFLEtBQVU7Z0JBQ2pELElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUFFLE9BQU07aUJBQUU7Z0JBQzdCLElBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsRUFBRTtvQkFBRSxJQUFJLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFBRTs7b0JBQ3BDLEdBQUcsR0FBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDOztvQkFDOUUsR0FBRyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtnQkFDdkIsSUFBRyxPQUFPLEtBQUssSUFBRSxXQUFXLEVBQUU7b0JBQUUsR0FBRyxDQUFDLEtBQUssR0FBRSxHQUFHLENBQUE7aUJBQUU7cUJBQ2pEO29CQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUUsS0FBSyxDQUFBO2lCQUFFO2dCQUV4QixJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O3dCQUNSLE9BQU8sR0FBRSxJQUFJQSxjQUFXLENBQUUsRUFBRSxlQUFlLEVBQUUsU0FBTyxJQUFJLENBQUMsTUFBUSxFQUFFLENBQUU7b0JBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO2lCQUN6RDtxQkFDSTtvQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtpQkFBRTthQUMxQzs7b0JBdERKQyxhQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7Ozt3QkFIekJDLGFBQVU7Ozs7MEJBRG5CO0tBNERDOzs7Ozs7QUM1REQ7O1FBcURJO1lBeENRLFlBQU8sR0FBRSxJQUFJLENBQUM7O1lBQ2QsZUFBVSxHQUFFLEtBQUssQ0FBQztZQUVsQixrQkFBYSxHQUFXLEtBQUssQ0FBQztZQXNDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJQyxZQUFPLEVBQU8sQ0FBQztZQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJQSxZQUFPLEVBQU8sQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJQSxZQUFPLEVBQU8sQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJQSxZQUFPLEVBQU8sQ0FBQztZQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDaEQ7UUFqQ0Qsc0JBQUksZ0NBQUs7Ozs7Ozs7O1lBQVQsVUFBVSxHQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRSxHQUFHLENBQUEsRUFBRTs7O1dBQUE7UUFFMUMsc0JBQUksNENBQWlCOzs7Ozs7O1lBQXJCLGNBQWlDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQSxFQUFFOzs7O2dCQUN6RCxVQUFzQixHQUFVO2dCQUM1QixJQUFJLENBQUMsVUFBVSxHQUFFLENBQUMsR0FBRyxHQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUMsS0FBSyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7YUFDbEU7OztXQUh3RDtRQUt6RCxzQkFBSSxpQ0FBTTs7Ozs7OztZQUFWO2dCQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxJQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsSUFBRSxDQUFDLENBQUMsSUFBSyxJQUFJLEdBQUcsS0FBSyxDQUFDO2FBQ3hGOzs7V0FBQTtRQUVELHNCQUFJLGlDQUFNOzs7Ozs7O1lBQVYsY0FBc0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLEVBQUU7Ozs7Ozs7O1lBRTNDLFVBQVcsRUFBUztnQkFDaEIsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBRztvQkFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7aUJBQ3BEO3FCQUNJO29CQUFFLElBQUksQ0FBQyxPQUFPLEdBQUUsRUFBRSxDQUFBO2lCQUFFO2FBQzVCOzs7V0FQMEM7UUFTM0Msc0JBQUksdUNBQVk7Ozs7Ozs7WUFBaEIsY0FBNkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBLEVBQUU7OztXQUFBOzs7Ozs7UUFnQnhELDZCQUFLOzs7OztZQUFMO2dCQUFVLElBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRTtvQkFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLEdBQUUsSUFBSSxDQUFDO2lCQUFFO2FBQUU7Ozs7Ozs7OztRQUc5RCw0QkFBSTs7Ozs7Ozs7WUFBSixVQUFLLEdBQVUsRUFBRSxTQUFpQixFQUFFLEtBQWE7Z0JBQWpELGlCQXNDSTtnQkFyQ0csR0FBRyxHQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNqQyxJQUFHLENBQUMsR0FBRyxFQUFFO29CQUFFLE9BQU07aUJBQUU7O29CQUNmLENBQUMsR0FBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUc7Z0JBQ3pDLElBQUcsU0FBUyxFQUFFO29CQUFFLEdBQUcsSUFBSyxDQUFDLGtCQUFhLFNBQVcsQ0FBQTtpQkFBRTtnQkFDbkQsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtvQkFBRSxHQUFHLElBQUcsQ0FBRyxDQUFDLFNBQVMsSUFBSSxHQUFHLEdBQUcsR0FBRyxnQkFBUyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBRSxDQUFBO2lCQUFFO2dCQUU1RixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Z0JBRTdCLFVBQVUsQ0FDTjtvQkFDSSxJQUFHLEtBQUksQ0FBQyxFQUFFLEtBQUssS0FBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLElBQUUsQ0FBQyxJQUFJLEtBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxJQUFFLENBQUMsQ0FBQyxFQUFHO3dCQUM3RCxPQUFPLENBQUMsSUFBSSxDQUFDLGtDQUFnQyxLQUFJLENBQUMsVUFBVSxHQUFDLElBQUksZUFBVSxLQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsK0JBQTRCLENBQUMsQ0FBQzt3QkFDM0gsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3FCQUNoQjtpQkFDSixFQUFFLElBQUksQ0FBQyxVQUFVLENBQ3JCLENBQUM7Z0JBRVIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUUsVUFBQSxDQUFDLElBQUssS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRSxDQUFBO2dCQUM3QyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRSxVQUFBLENBQUMsSUFBSyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFLENBQUE7Z0JBQzVDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFFLFVBQUEsQ0FBQyxJQUFLLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUUsQ0FBQTtnQkFDNUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUUsVUFBQSxDQUFDOzt3QkFDTixJQUFTO29CQUNiLElBQUcsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTt3QkFDM0IsSUFBSTs0QkFBRSxJQUFJLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7eUJBQUU7d0JBQ2hDLE9BQU0sQ0FBQyxFQUFFOzRCQUFFLE9BQU07eUJBQUU7cUJBQ3RCO29CQUNELElBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDbkIsS0FBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUN2QixLQUFJLENBQUMsYUFBYSxHQUFFLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFHLFdBQVcsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO3dCQUN6RSxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDNUI7eUJBQ0ksSUFBRyxLQUFJLENBQUMsT0FBTyxJQUFJLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3hDLElBQUcsSUFBSSxDQUFDLE9BQU8sSUFBRyxLQUFJLENBQUMsT0FBTyxFQUFFOzRCQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO3lCQUFFO3FCQUMvRDt5QkFDSTt3QkFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFBRTtpQkFDMUMsQ0FBQTthQUNFOzs7Ozs7O1FBR0QsNEJBQUk7Ozs7OztZQUFKLFVBQUssSUFBUTtnQkFDVCxJQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7b0JBQ1IsSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7d0JBQUUsSUFBSSxHQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7cUJBQUU7b0JBQzNELElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN0QjthQUNKOzs7Ozs7O1FBS0Qsa0NBQVU7Ozs7OztZQUFWLFVBQVcsT0FBcUIsRUFBRSxJQUF5QixFQUFFLEtBQVU7Z0JBQTVELHdCQUFBO29CQUFBLGdCQUFxQjs7O29CQUN4QixHQUFHLEdBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDMUIsR0FBRyxDQUFDLE9BQU8sR0FBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQztnQkFDMUQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFBO2lCQUFFOztvQkFFekMsT0FBTyxHQUFFLEVBQUU7Z0JBQ2YsSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7b0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2lCQUM5QztnQkFDRCxJQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFHO29CQUNqRCxPQUFPLEdBQUUsSUFBSSxDQUFDO2lCQUNqQjtnQkFDRCxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO2dCQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCOzs7Ozs7O1FBS0QsaUNBQVM7Ozs7OztZQUFULFVBQVUsT0FBa0IsRUFBRSxJQUE0QixFQUFFLE9BQVk7Z0JBQTlELHdCQUFBO29CQUFBLGFBQWtCOztnQkFBRSxxQkFBQTtvQkFBQSxVQUE0Qjs7O29CQUNsRCxHQUFHLEdBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtnQkFDNUIsR0FBRyxDQUFDLE9BQU8sR0FBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQztnQkFDMUQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFBO2lCQUFFO2dCQUU3QyxJQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFHO29CQUNsRCxHQUFHLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQztpQkFDdEI7Z0JBQ0QsSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7O3dCQUNyQixNQUFNLEdBQUUsRUFBRTtvQkFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUUsSUFBSSxDQUFDO29CQUNyQixJQUFHLE9BQU8sSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7d0JBQ3ZDLElBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFOzRCQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7eUJBQUU7d0JBQzdELElBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFOzRCQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7eUJBQUU7d0JBQ25FLElBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzs2QkFDZixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBRSxNQUFNLENBQUMsRUFBRzs0QkFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDM0M7d0JBQ0QsSUFBRyxPQUFPLENBQUMsUUFBUSxDQUFDOzZCQUNmLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBRSxTQUFTLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFFLE9BQU87bUNBQ3hELE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBRSxPQUFPLENBQUMsRUFBRzs0QkFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDM0M7cUJBQ0o7b0JBQ0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzlCO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEI7Ozs7Ozs7O1FBR0QsbUNBQVc7Ozs7Ozs7WUFBWCxVQUFZLE9BQWtCLEVBQUUsSUFBWTtnQkFBaEMsd0JBQUE7b0JBQUEsYUFBa0I7O2dCQUFFLHFCQUFBO29CQUFBLFVBQVk7OztvQkFDcEMsR0FBRyxHQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUU7Z0JBQzlCLEdBQUcsQ0FBQyxPQUFPLEdBQUUsQ0FBQyxPQUFPLElBQUUsTUFBTSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUM7Z0JBQzFELElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQTtpQkFBRTtnQkFFN0MsSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRztvQkFDbEQsR0FBRyxDQUFDLFdBQVcsR0FBRSxJQUFJLENBQUM7aUJBQ3hCO2dCQUNELElBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO29CQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7aUJBQUU7Z0JBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEI7Ozs7Ozs7OztRQUlELDhCQUFNOzs7Ozs7O1lBQU4sVUFBTyxHQUFPLElBQVksUUFBUSxHQUFHLENBQUMsT0FBTyxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUMsRUFBRTs7Ozs7OztRQUU5RCwrQkFBTzs7Ozs7O1lBQVAsVUFBUSxHQUFPLElBQVksT0FBTyxPQUFPLEdBQUcsQ0FBQyxPQUFPLElBQUcsV0FBVyxDQUFBLEVBQUU7Ozs7Ozs7UUFFcEUsK0JBQU87Ozs7OztZQUFQLFVBQVEsR0FBTztnQkFDWCxRQUFRLE9BQU8sR0FBRyxDQUFDLE9BQU8sSUFBRyxXQUFXLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFHLFdBQVcsRUFBRTthQUM5RTs7Ozs7OztRQUVELGtDQUFVOzs7Ozs7WUFBVixVQUFXLEdBQU8sSUFBWSxPQUFPLE9BQU8sR0FBRyxDQUFDLFNBQVMsSUFBRyxXQUFXLENBQUEsRUFBRTs7b0JBMUw1RUYsYUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7Ozs7NEJBSmxDO0tBK0xDOzs7Ozs7OztRQzVLRztZQUNJLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSUUsWUFBTyxFQUFVLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUUsSUFBSUEsWUFBTyxFQUFVLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ2hEOzs7O1FBRUQseUNBQVc7OztZQUFYLGNBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxFQUFFOzs7Ozs7O1FBR25FLGtDQUFJOzs7Ozs7WUFBSixVQUFLLFVBQWlCO2dCQUF0QixpQkFRQztnQkFQRyxJQUFHLFFBQU8sTUFBTSxDQUFDLElBQUcsV0FBVyxFQUFFO29CQUFFLE9BQU8sS0FBSyxDQUFBO2lCQUFFO2dCQUNqRCxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtpQkFBRTtnQkFFM0MsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUUsVUFBQSxLQUFLLElBQUssS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsRUFBRSxDQUFDO2dCQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRSxVQUFBLEtBQUssSUFBSyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxFQUFFLENBQUM7O2FBRTVEOzs7Ozs7O1FBR0QseUNBQVc7Ozs7OztZQUFYLFVBQVksR0FBTztnQkFBSSxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQUU7YUFBRTs7Ozs7O1FBR3hFLHVDQUFTOzs7OztZQUFUO2dCQUFjLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO2lCQUFDO2FBQUU7O29CQXRDNURGLGFBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Ozs7O2tDQUxsQztLQTRDQzs7Ozs7O0FDNUNEOztRQW1ESSx1QkFBcUIsSUFBZ0IsRUFDbEIsR0FBZ0IsRUFDaEIsTUFBcUIsRUFDckIsTUFBMkI7WUFIekIsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUNsQixRQUFHLEdBQUgsR0FBRyxDQUFhO1lBQ2hCLFdBQU0sR0FBTixNQUFNLENBQWU7WUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBcUI7WUF2Q3RDLGFBQVEsR0FBVSxJQUFJLENBQUM7OztZQVF4QixXQUFNLEdBQUU7Z0JBQ1gsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLEVBQUU7YUFDbEIsQ0FBQTtZQTRCRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjs7Ozs7OztRQXRDTyw2QkFBSzs7Ozs7OztZQUFiLFVBQWMsR0FBUTtnQkFBSSxJQUFHRyxZQUFTLEVBQUUsRUFBQztvQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUFFO2FBQUU7UUFXL0Qsc0JBQUksa0NBQU87Ozs7Ozs7WUFBWCxjQUF1QixPQUFPLFFBQVEsQ0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFBLEVBQUU7Ozs7Z0JBQ2xFLFVBQVksR0FBVzs7b0JBQ2YsQ0FBQyxHQUFTLEdBQUcsR0FBRSxHQUFHO2dCQUN0QixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBRSxDQUFDLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUUsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGtDQUFnQyxDQUFHLENBQUMsQ0FBQztpQkFDbkQ7cUJBQ0k7b0JBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDNUUsSUFBSSxDQUFDLEtBQUssQ0FBQyx1Q0FBcUMsQ0FBQyxrQkFBYSxJQUFJLENBQUMsUUFBVSxDQUFDLENBQUM7aUJBQ2xGO2FBQ0o7OztXQVhpRTtRQWFsRSxzQkFBSSxvQ0FBUzs7Ozs7Ozs7WUFBYixVQUFjLEdBQVU7Z0JBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUUsR0FBRyxDQUFDO2dCQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRSxHQUFHLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFFLEdBQUcsQ0FBQzthQUMxQjs7O1dBQUE7UUFFRCxzQkFBSSxrQ0FBTzs7Ozs7OztZQUFYLGNBQWdCLE9BQU8sT0FBTyxDQUFBLEVBQUU7OztXQUFBOzs7O1FBVWhDLG1DQUFXOzs7WUFBWCxjQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBLEVBQUU7Ozs7Ozs7Ozs7UUFHN0IsNEJBQUk7Ozs7Ozs7OztZQUFaLFVBQWEsUUFBMkIsRUFBRSxJQUFnQixFQUFFLE1BQW9CO2dCQUFuRSx5QkFBQTtvQkFBQSxzQkFBMkI7O2dCQUFFLHFCQUFBO29CQUFBLFdBQWdCOztnQkFBRSx1QkFBQTtvQkFBQSxjQUFvQjs7Z0JBQzVFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO2dCQUN6QixJQUFHLE1BQU0sRUFBRTtvQkFDUCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztvQkFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDO2lCQUMzQjtxQkFDSTtvQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztvQkFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO2lCQUMxQjthQUNKOzs7Ozs7Ozs7OztRQUtELDZCQUFLOzs7Ozs7Ozs7WUFBTCxVQUFNLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQjtnQkFBNUQseUJBQUE7b0JBQUEsZUFBb0I7O2dCQUFFLHFCQUFBO29CQUFBLFdBQWdCOztnQkFBRSx1QkFBQTtvQkFBQSxjQUFvQjs7Z0JBQzlELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQy9COzs7Ozs7Ozs7UUFFRCwrQkFBTzs7Ozs7Ozs7WUFBUCxVQUFRLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQjtnQkFBcEUsaUJBaUJDO2dCQWpCTyx5QkFBQTtvQkFBQSxlQUFvQjs7Z0JBQUUscUJBQUE7b0JBQUEsV0FBZ0I7O2dCQUFFLHVCQUFBO29CQUFBLGNBQW9COztnQkFDaEUsT0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFDLE9BQU8sRUFBRSxNQUFNO29CQUNoQyxLQUFJLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7b0JBQ2xELEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxTQUFTO29CQUN4QztvQkFBQSxRQUFRO3dCQUNKLElBQUcsS0FBSSxDQUFDLE1BQU0sRUFBRTs0QkFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO3lCQUFFO3dCQUN2QyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM1QixLQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRSxLQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzt3QkFDOUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUUsS0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7d0JBQ25ELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDakIsRUFDRCxVQUFBLEtBQUs7d0JBQ0QsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7d0JBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDakIsQ0FDSixDQUFDO2lCQUNMLENBQUMsQ0FBQzthQUNOOzs7Ozs7UUFHRCxrQ0FBVTs7Ozs7WUFBVixjQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUU7Ozs7Ozs7Ozs7UUFHOUQscUNBQWE7Ozs7Ozs7OztZQUFiLFVBQWMsUUFBb0IsRUFBRSxJQUFnQixFQUFFLE1BQW9CLEVBQUUsU0FBcUI7Z0JBQWpHLGlCQWVDO2dCQWZhLHlCQUFBO29CQUFBLGVBQW9COztnQkFBRSxxQkFBQTtvQkFBQSxXQUFnQjs7Z0JBQUUsdUJBQUE7b0JBQUEsY0FBb0I7O2dCQUFFLDBCQUFBO29CQUFBLGdCQUFxQjs7Z0JBQzdGLE9BQU8sSUFBSSxPQUFPLENBQUUsVUFBQyxPQUFPLEVBQUUsTUFBTTtvQkFDaEMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQzt5QkFDbkMsSUFBSSxDQUFFOzs7NEJBRUMsR0FBRyxHQUFFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRTt3QkFDckMsSUFBRyxDQUFDLEdBQUcsRUFBRTs0QkFDTCxNQUFNLENBQUUsSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBRSxDQUFDOzRCQUNsRSxPQUFPO3lCQUNWO3dCQUNELEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDakMsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFDO3FCQUNuQixDQUFDO3lCQUNELEtBQUssQ0FBRSxVQUFBLENBQUMsSUFBSyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUEsRUFBRSxDQUFDLENBQUM7aUJBQ2hDLENBQUMsQ0FBQzthQUNOOzs7Ozs7Ozs7O1FBR0QsdUNBQWU7Ozs7Ozs7OztZQUFmLFVBQWdCLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQixFQUFFLE9BQVc7Z0JBQXpGLGlCQVVDO2dCQVZlLHlCQUFBO29CQUFBLGVBQW9COztnQkFBRSxxQkFBQTtvQkFBQSxXQUFnQjs7Z0JBQUUsdUJBQUE7b0JBQUEsY0FBb0I7O2dCQUN4RSxPQUFPLElBQUksT0FBTyxDQUFFLFVBQUMsT0FBTyxFQUFFLE1BQU07b0JBQ2hDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7eUJBQ25DLElBQUksQ0FBRTs7d0JBRUgsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDOUMsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFDO3FCQUNuQixDQUFDO3lCQUNELEtBQUssQ0FBRSxVQUFBLENBQUMsSUFBSyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUEsRUFBRSxDQUFDLENBQUM7aUJBQ2hDLENBQUMsQ0FBQTthQUNMOzs7Ozs7Ozs7UUFHRCxrQ0FBVTs7Ozs7Ozs7WUFBVixVQUFXLEdBQWUsRUFBRSxTQUFpQixFQUFFLEtBQWE7Z0JBQWpELG9CQUFBO29CQUFBLFVBQWU7O2dCQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ2xDLElBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ0wsR0FBRyxHQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO29CQUNsQyxJQUFHLENBQUMsR0FBRyxFQUFFO3dCQUNMLFFBQVEsSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsRUFBRztxQkFDckU7aUJBQ0o7Z0JBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxJQUFJLENBQUM7YUFDZjs7Ozs7Ozs7O1FBR0Qsb0NBQVk7Ozs7Ozs7O1lBQVosVUFBYSxHQUFlLEVBQUUsT0FBWSxFQUFFLEtBQWE7Z0JBQTVDLG9CQUFBO29CQUFBLFVBQWU7O2dCQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3BDLElBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ0wsR0FBRyxHQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO29CQUNsQyxJQUFHLENBQUMsR0FBRyxFQUFFO3dCQUNMLFFBQVEsSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsRUFBRztxQkFDckU7b0JBQ0QsR0FBRyxHQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUMxQzs7b0JBQ0csRUFBRSxHQUFFLEVBQUU7O29CQUNOLFNBQWlCO2dCQUNyQixJQUFHLE9BQU8sSUFBSSxPQUFPLE9BQU8sS0FBSSxRQUFRLEVBQUM7b0JBQ3JDLEVBQUUsSUFBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2hILEVBQUUsSUFBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksbUJBQWlCLE9BQU8sQ0FBQyxZQUFjLEdBQUcsRUFBRSxDQUFDO29CQUMzRSxTQUFTLEdBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUM3RDtnQkFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDN0MsT0FBTyxJQUFJLENBQUM7YUFDZjs7Ozs7Ozs7UUFHTyxvQ0FBWTs7Ozs7OztZQUFwQixVQUFxQixRQUFhO2dCQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNqRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzNGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNyQzs7Ozs7O1FBR00sNkNBQXFCOzs7OztZQUE1QjtnQkFDSSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQzNGLElBQUksQ0FBQyxLQUFLLENBQUMsa0NBQWdDLElBQUksQ0FBQyxRQUFVLENBQUMsQ0FBQztvQkFDNUQsT0FBTyxLQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUcsQ0FBQztpQkFDbEU7cUJBQ0ksSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRTtvQkFDOUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO29CQUM3QyxPQUFPLEtBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFHLENBQUE7aUJBQ3hEO3FCQUNJO29CQUFFLE9BQU8sSUFBSSxDQUFBO2lCQUFFO2FBQ3ZCOzs7Ozs7O1FBR08sMkNBQW1COzs7Ozs7WUFBM0I7O29CQUNRLEdBQVc7Z0JBQ2YsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7O29CQUVyQyxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRTt3QkFDckQsR0FBRyxHQUFFLEtBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBRyxDQUFDO3FCQUNsRTt5QkFDSTt3QkFBRSxHQUFHLEdBQUUsS0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUcsQ0FBQTtxQkFBRTtpQkFDakU7cUJBQ0k7O3dCQUNHLEdBQUcsR0FBRSx1RkFBdUY7b0JBQ2hHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ25CO2dCQUNELE9BQU8sR0FBRyxDQUFDO2FBQ2Q7Ozs7Ozs7UUFHTyw4Q0FBc0I7Ozs7OztZQUE5QjtnQkFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRSxFQUFFLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFFLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUUsRUFBRSxDQUFDO2FBQy9COzs7Ozs7O1FBR0QsMkJBQUc7Ozs7OztZQUFILFVBQUksSUFBVzs7b0JBQ1AsR0FBRyxHQUFLLElBQUksQ0FBQyxRQUFRLFdBQU0sSUFBSSxDQUFDLFFBQVEsU0FBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFHO2dCQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQU8sR0FBSyxDQUFDLENBQUM7Z0JBQ3pCLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTs7d0JBQ1IsT0FBTyxHQUFFLElBQUlKLGNBQVcsQ0FBRSxFQUFFLGVBQWUsRUFBRSxTQUFPLElBQUksQ0FBQyxNQUFRLEVBQUUsQ0FBRTtvQkFDekUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztpQkFDckQ7cUJBQ0k7b0JBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFBRTthQUNyQzs7Ozs7Ozs7UUFHRCwyQkFBRzs7Ozs7OztZQUFILFVBQUksSUFBVyxFQUFFLEtBQVM7O29CQUNsQixHQUFHLEdBQUssSUFBSSxDQUFDLFFBQVEsV0FBTSxJQUFJLENBQUMsUUFBUSxTQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUc7Z0JBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBTyxHQUFLLENBQUMsQ0FBQztnQkFDekIsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFOzt3QkFDUixPQUFPLEdBQUUsSUFBSUEsY0FBVyxDQUFFLEVBQUUsZUFBZSxFQUFFLFNBQU8sSUFBSSxDQUFDLE1BQVEsRUFBRSxDQUFFO29CQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO2lCQUNyRDtxQkFDSTtvQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtpQkFBRTthQUM1Qzs7Ozs7Ozs7UUFHRCw0QkFBSTs7Ozs7OztZQUFKLFVBQUssSUFBVyxFQUFFLEtBQVM7O29CQUNuQixHQUFHLEdBQUssSUFBSSxDQUFDLFFBQVEsV0FBTSxJQUFJLENBQUMsUUFBUSxTQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUc7Z0JBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBUSxHQUFLLENBQUMsQ0FBQztnQkFDMUIsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFOzt3QkFDUixPQUFPLEdBQUUsSUFBSUEsY0FBVyxDQUFFLEVBQUUsZUFBZSxFQUFFLFNBQU8sSUFBSSxDQUFDLE1BQVEsRUFBRSxDQUFFO29CQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO2lCQUN0RDtxQkFDSTtvQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtpQkFBRTthQUM3Qzs7Ozs7Ozs7UUFHRCw2QkFBSzs7Ozs7OztZQUFMLFVBQU0sUUFBZSxFQUFFLFFBQWU7O29CQUM5QixPQUFPLEdBQUUsSUFBSUEsY0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQztnQkFDdEUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDZCxJQUFJLENBQUMsUUFBUSxXQUFNLElBQUksQ0FBQyxRQUFRLFNBQUksSUFBSSxDQUFDLElBQUksaUJBQVksSUFBSSxDQUFDLFFBQVEsZ0JBQWEsRUFDdEYsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFDOUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUNkLENBQUM7YUFDTDs7Ozs7O1FBR0QsOEJBQU07Ozs7O1lBQU47O29CQUNFLEdBQUcsR0FBSSxJQUFJLENBQUMsUUFBUSxXQUFNLElBQUksQ0FBQyxRQUFRLFNBQUksSUFBSSxDQUFDLElBQUksaUJBQVksSUFBSSxDQUFDLFFBQVEsaUJBQWM7Z0JBQ3pGLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTs7d0JBQ1IsT0FBTyxHQUFFLElBQUlBLGNBQVcsQ0FBRSxFQUFFLGVBQWUsRUFBRSxTQUFPLElBQUksQ0FBQyxNQUFRLEVBQUUsQ0FBRTtvQkFDekUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBRSxDQUFDO2lCQUNsRDtxQkFDSTtvQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRSxJQUFJLENBQUUsQ0FBQTtpQkFBRTthQUM3Qzs7Ozs7Ozs7UUFHRCxnQ0FBUTs7Ozs7OztZQUFSLFVBQVMsT0FBYyxFQUFFLElBQVc7Z0JBQ2hDLElBQUcsQ0FBQyxJQUFJLEVBQUU7b0JBQUUsT0FBTTtpQkFBRTtnQkFDcEIsSUFBSSxHQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7O29CQUN4QyxHQUFHLEdBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUNuQyxJQUFHLENBQUMsR0FBRyxFQUFFO29CQUFFLE9BQU07aUJBQUU7Z0JBQ25CLEdBQUcsR0FBRSxLQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQVMsSUFBTSxDQUFDO2dCQUNuRixJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O3dCQUNSLE9BQU8sR0FBRSxJQUFJQSxjQUFXLENBQUUsRUFBRSxlQUFlLEVBQUUsU0FBTyxJQUFJLENBQUMsTUFBUSxFQUFFLENBQUU7b0JBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFFLENBQUM7aUJBQ3JEO3FCQUNJO29CQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQUU7YUFDckM7O29CQTlRSkMsYUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7Ozs7d0JBUHpCQyxhQUFVO3dCQUVWLFdBQVc7d0JBQ1gsYUFBYTt3QkFFYixtQkFBbUI7Ozs7NEJBTjVCO0tBd1JDOzs7Ozs7O1FDalJEO1NBT21DOztvQkFQbENHLFdBQVEsU0FBQzt3QkFDTixPQUFPLEVBQUUsQ0FBRUMsbUJBQWdCLENBQUU7d0JBQzdCLFlBQVksRUFBRSxFQUFFO3dCQUNoQixPQUFPLEVBQUUsRUFBRTt3QkFDWCxlQUFlLEVBQUUsRUFBRTt3QkFDbkIsU0FBUyxFQUFFLEVBQUU7cUJBQ2hCOztRQUNpQywwQkFBQztLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==