import { Injectable, NgModule, isDevMode, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';

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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.put(url, msg, { headers: headers });
        }
        else {
            return this.http.put(url, msg);
        }
    };
    SignalKHttp.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    SignalKHttp.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ SignalKHttp.ngInjectableDef = defineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(inject(HttpClient)); }, token: SignalKHttp, providedIn: "root" });
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
        this._connect = new Subject();
        this.onConnect = this._connect.asObservable();
        this._close = new Subject();
        this.onClose = this._close.asObservable();
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
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
        if (context === void 0) { context = 'self'; }
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
        if (context === void 0) { context = '*'; }
        if (path === void 0) { path = '*'; }
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
        if (context === void 0) { context = '*'; }
        if (path === void 0) { path = '*'; }
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
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    SignalKStream.ctorParameters = function () { return []; };
    /** @nocollapse */ SignalKStream.ngInjectableDef = defineInjectable({ factory: function SignalKStream_Factory() { return new SignalKStream(); }, token: SignalKStream, providedIn: "root" });
    return SignalKStream;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var SignalKStreamWorker = /** @class */ (function () {
    // *******************************************************    
    function SignalKStreamWorker() {
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
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
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    SignalKStreamWorker.ctorParameters = function () { return []; };
    /** @nocollapse */ SignalKStreamWorker.ngInjectableDef = defineInjectable({ factory: function SignalKStreamWorker_Factory() { return new SignalKStreamWorker(); }, token: SignalKStreamWorker, providedIn: "root" });
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
    function (val) { if (isDevMode()) {
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
        if (hostname === void 0) { hostname = null; }
        if (port === void 0) { port = null; }
        if (useSSL === void 0) { useSSL = false; }
        if (subscribe === void 0) { subscribe = null; }
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
        if (hostname === void 0) { hostname = null; }
        if (port === void 0) { port = null; }
        if (useSSL === void 0) { useSSL = false; }
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
        var headers = new HttpHeaders().set('Content-Type', "application/json");
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    };
    SignalKClient.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    SignalKClient.ctorParameters = function () { return [
        { type: HttpClient },
        { type: SignalKHttp },
        { type: SignalKStream },
        { type: SignalKStreamWorker }
    ]; };
    /** @nocollapse */ SignalKClient.ngInjectableDef = defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(inject(HttpClient), inject(SignalKHttp), inject(SignalKStream), inject(SignalKStreamWorker)); }, token: SignalKClient, providedIn: "root" });
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
        { type: NgModule, args: [{
                    imports: [HttpClientModule],
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

export { SignalKClientModule, SignalKClient, SignalKHttp as ɵa, SignalKStream as ɵb, SignalKStreamWorker as ɵc };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXRpbHMudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL2h0dHAtYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0tYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0td29ya2VyLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi91dWlkLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zaWduYWxrLWNsaWVudC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vICoqIFBhdGggdXRpbGl0aWVzXHJcbmV4cG9ydCBjbGFzcyBQYXRoIHtcclxuXHJcbiAgICAvLyAqKiB0cmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIHNsYXNoXHJcbiAgICBzdGF0aWMgZG90VG9TbGFzaChwYXRoOnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHsgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5qb2luKCcvJykgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXHJcbiAgICBzdGF0aWMgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcclxuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgfSAgICBcclxuXHJcbn1cclxuXHJcbi8vICoqIE1lc3NhZ2UgdGVtcGxhdGVzICoqXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcclxuICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVVBEQVRFUyBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVwZGF0ZXMoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyB2YWx1ZXM6IFsge3BhdGg6IHh4LCB2YWx1ZTogeHggfSBdIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdXBkYXRlczogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gKiogcmV0dXJuIFNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLyogYXJyYXkgdmFsdWVzPSB7XHJcbiAgICAgICAgICAgIFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kXCI6IDEwMDAsXHJcbiAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwiZGVsdGFcIixcclxuICAgICAgICAgICAgXCJwb2xpY3lcIjogXCJpZGVhbFwiLFxyXG4gICAgICAgICAgICBcIm1pblBlcmlvZFwiOiAyMDBcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVU5TVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1bnN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIgfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1bnN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbiAgICAvLyAqKiByZXR1cm4gUkVRVUVTVCBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHJlcXVlc3QoKSB7IFxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICByZXF1ZXN0SWQ6IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9ICAgICAgICAgICBcclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFBhdGggfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLSHR0cCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZztcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyB9ICAgXHJcbiAgICBcclxuICAgIC8vICoqIGdldCB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuZ2V0KGB2ZXNzZWxzL3NlbGZgKSB9XHJcblxyXG4gICAgLy8qKiBnZXQgSUQgb2YgdmVzc2VsIHNlbGYgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmdldChgc2VsZmApIH1cclxuXHJcbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXHJcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoYCR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICAvLyoqIGdldCBBUEkgcGF0aCB2YWx1ZSB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldChwYXRoOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyoqIHNlbmQgdmFsdWUgdG8gQVBJIHBhdGggdmlhIGh0dHAgcHV0LiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KTtcclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleT86YW55LCB2YWx1ZT86YW55KSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCkgKyAnLycgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlPT0ndW5kZWZpbmVkJykgeyBtc2cudmFsdWU9IGtleSB9XHJcblx0XHRlbHNlIHsgbXNnLnZhbHVlW2tleV09IHZhbHVlIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKSB9XHJcbiAgICB9IFxyXG5cclxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbSB7XHJcblxyXG5cdHByaXZhdGUgX2Nvbm5lY3Q6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX2Nsb3NlOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcblxyXG4gICAgcHJpdmF0ZSB3czogYW55OyAgICBcclxuICAgIHByaXZhdGUgX2ZpbHRlcj0gbnVsbDsgICAgICAgICAgICAgICAvLyAqKiBpZCBvZiB2ZXNzZWwgdG8gZmlsdGVyIGRlbHRhIG1lc3NhZ2VzXHJcbiAgICBwcml2YXRlIF93c1RpbWVvdXQ9IDIwMDAwOyAgICAgICAgICAgLy8gKiogd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAgXHJcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgXHJcbiAgICBwcml2YXRlIF9wbGF5YmFja01vZGU6IGJvb2xlYW49IGZhbHNlO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBwdWJsaWMgb25Db25uZWN0OiBPYnNlcnZhYmxlPGFueT47XHRcdFxyXG4gICAgcHVibGljIG9uQ2xvc2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgICBwdWJsaWMgZW5kcG9pbnQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBzZWxmSWQ6IHN0cmluZztcclxuXHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcclxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxyXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcclxuICAgIH0gICBcclxuICAgIC8vICoqIGlzIFdTIFN0cmVhbSBjb25uZWN0ZWQ/XHJcbiAgICBnZXQgaXNPcGVuKCk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXHJcbiAgICBnZXQgZmlsdGVyKCk6c3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XHJcbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xyXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIGlkICYmIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj0gKHRoaXMuc2VsZklkKSA/IHRoaXMuc2VsZklkIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gaWQgfVxyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIFBsYXliYWNrIEhlbGxvIG1lc3NhZ2VcclxuICAgIGdldCBwbGF5YmFja01vZGUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuX3BsYXliYWNrTW9kZSB9XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoICkgeyBcclxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgICAgICAgIFxyXG4gICAgfSAgIFxyXG5cclxuICAgIC8vICoqIENsb3NlIFdlYlNvY2tldCBjb25uZWN0aW9uXHJcbiAgICBjbG9zZSgpIHsgaWYodGhpcy53cykgeyB0aGlzLndzLmNsb3NlKCk7IHRoaXMud3M9IG51bGw7IH0gfVxyXG4gICBcclxuXHQvLyAqKiBPcGVuIGEgV2ViU29ja2V0IGF0IHByb3ZpZGVkIHVybFxyXG5cdG9wZW4odXJsOnN0cmluZywgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcclxuICAgICAgICB1cmw9ICh1cmwpID8gdXJsIDogdGhpcy5lbmRwb2ludDtcclxuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IHE9ICh1cmwuaW5kZXhPZignPycpPT0tMSkgPyAnPycgOiAnJidcclxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gJHtxfXN1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4gfHwgdG9rZW4pIHsgdXJsKz0gYCR7KHN1YnNjcmliZSkgPyAnJicgOiAnPyd9dG9rZW49JHt0aGlzLl90b2tlbiB8fCB0b2tlbn1gIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxyXG4gICAgICAgIHNldFRpbWVvdXQoIFxyXG4gICAgICAgICAgICAoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxyXG4gICAgICAgICk7XHJcblx0XHRcclxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5fZXJyb3IubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcclxuICAgICAgICAgICAgbGV0IGRhdGE6IGFueTtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7IHJldHVybiB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxmSWQ9IGRhdGEuc2VsZjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrTW9kZT0gKHR5cGVvZiBkYXRhLnN0YXJ0VGltZSE9ICd1bmRlZmluZWQnKSA/IHRydWUgOiBmYWxzZTsgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEuY29udGV4dD09IHRoaXMuX2ZpbHRlcikgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG5cdFx0fVxyXG4gICAgfSAgICAgIFxyXG5cclxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cclxuICAgIHNlbmQoZGF0YTphbnkpIHtcclxuICAgICAgICBpZih0aGlzLndzKSB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2VuZCB2YWx1ZShzKSB2aWEgZGVsdGEgc3RyZWFtIHVwZGF0ZSAqKlxyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZywgcGF0aDpBcnJheTxhbnk+KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6IHN0cmluZyB8IEFycmF5PGFueT4sIHZhbHVlPzphbnkpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnVwZGF0ZXMoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGxldCB1VmFsdWVzPSBbXTtcclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdVZhbHVlcy5wdXNoKHsgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICAgdVZhbHVlcz0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsLnVwZGF0ZXMucHVzaCh7IHZhbHVlczogdVZhbHVlcyB9ICk7IFxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgb3B0aW9uczogey4ufSoqXHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBvcHRpb25zPzphbnkpO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmcgfCBBcnJheTxhbnk+PScqJywgb3B0aW9ucz86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS5zdWJzY3JpYmUoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgc1ZhbHVlPSB7fTtcclxuICAgICAgICAgICAgc1ZhbHVlWydwYXRoJ109IHBhdGg7XHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwZXJpb2QnXSkgeyBzVmFsdWVbJ3BlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydtaW5QZXJpb2QnXSkgeyBzVmFsdWVbJ21pblBlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydmb3JtYXQnXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1snZm9ybWF0J109PSdkZWx0YScgfHwgb3B0aW9uc1snZm9ybWF0J109PSdmdWxsJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ2Zvcm1hdCddPSBvcHRpb25zWydmb3JtYXQnXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BvbGljeSddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydwb2xpY3knXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0naWRlYWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1sncG9saWN5J109PSdmaXhlZCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydwb2xpY3knXT0gb3B0aW9uc1sncG9saWN5J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsLnN1YnNjcmliZS5wdXNoKHNWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcclxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDphbnk9JyonKSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnVuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHsgdmFsLnVuc3Vic2NyaWJlLnB1c2goe3BhdGg6IHBhdGh9KSB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiBNRVNTQUdFIFBBUlNJTkcgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBjb250ZXh0IGlzICdzZWxmJ1xyXG4gICAgaXNTZWxmKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gKG1zZy5jb250ZXh0PT0gdGhpcy5zZWxmSWQpIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxyXG4gICAgaXNEZWx0YShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxyXG4gICAgaXNIZWxsbyhtc2c6YW55KTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNnLnNlbGYhPSAndW5kZWZpbmVkJyk7XHJcbiAgICB9ICAgICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgcmVxdWVzdCBSZXNwb25zZSBtZXNzYWdlXHJcbiAgICBpc1Jlc3BvbnNlKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5yZXF1ZXN0SWQhPSAndW5kZWZpbmVkJyB9IFxyXG59IiwiLyoqIFdlYiBXb3JrZXIgU2VydmljZVxyXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW1Xb3JrZXIgIHtcclxuXHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIHdvcmtlcjogV29ya2VyO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgfSBcclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IHRoaXMud29ya2VyID0gdW5kZWZpbmVkOyB9XHJcblxyXG4gICAgLy8gKiogSW5pdGlhbGlzZSB3b3JrZXJcclxuICAgIGluaXQocGF0aFRvRmlsZTpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYodHlwZW9mKFdvcmtlcik9PSBcInVuZGVmaW5lZFwiKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYodGhpcy53b3JrZXIpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCkgfSAgIC8vICoqIHRlcm1pbmF0ZSBhbiBvcGVuIHdvcmtlclxyXG5cclxuICAgICAgICB0aGlzLndvcmtlcj0gbmV3IFdvcmtlcihwYXRoVG9GaWxlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2U9IGV2ZW50PT4geyB0aGlzLl9tZXNzYWdlLm5leHQoZXZlbnQpIH07XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25lcnJvcj0gZXZlbnQ9PiB7IHRoaXMuX2Vycm9yLm5leHQoZXZlbnQpIH07ICAgICAgICAgICBcclxuICAgICAgICAvLyAqKiB3b3JrZXIgcmVhZHkgZm9yIHBvc3RNZXNzYWdlKClcclxuICAgIH0gICAgXHJcbiAgICBcclxuICAgIC8vICoqIFNlbmQgbWVzc2FnZSB0byB3b3JrZXJcclxuICAgIHBvc3RNZXNzYWdlKG1zZzphbnkpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci5wb3N0TWVzc2FnZShtc2cpIH0gfVxyXG5cclxuICAgIC8vICoqIHRlcm1pbmF0ZSB3b3JrZXJcclxuICAgIHRlcm1pbmF0ZSgpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci50ZXJtaW5hdGUoKX0gfVxyXG59IiwiLypcclxuICogVVVJRDogQSBqcyBsaWJyYXJ5IHRvIGdlbmVyYXRlIGFuZCBwYXJzZSBVVUlEcywgVGltZVVVSURzIGFuZCBnZW5lcmF0ZVxyXG4gKiBUaW1lVVVJRCBiYXNlZCBvbiBkYXRlcyBmb3IgcmFuZ2Ugc2VsZWN0aW9ucy5cclxuICogQHNlZSBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gKiovXHJcbmV4cG9ydCBjbGFzcyBVVUlEIHtcclxuXHJcbiAgICBwcml2YXRlIGxpbWl0VUkwNDtcclxuICAgIHByaXZhdGUgbGltaXRVSTA2O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDg7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxMjtcclxuICAgIHByaXZhdGUgbGltaXRVSTE0O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTY7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkzMjtcclxuICAgIHByaXZhdGUgbGltaXRVSTQwO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJNDg7XHJcblxyXG4gICAgcHJpdmF0ZSB2ZXJzaW9uOm51bWJlcjtcclxuICAgIHByaXZhdGUgaGV4OnN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwNCA9IHRoaXMubWF4RnJvbUJpdHMoNCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDYgPSB0aGlzLm1heEZyb21CaXRzKDYpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA4ID0gdGhpcy5tYXhGcm9tQml0cyg4KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxMiA9IHRoaXMubWF4RnJvbUJpdHMoMTIpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTE0ID0gdGhpcy5tYXhGcm9tQml0cygxNCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTYgPSB0aGlzLm1heEZyb21CaXRzKDE2KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkzMiA9IHRoaXMubWF4RnJvbUJpdHMoMzIpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTQwID0gdGhpcy5tYXhGcm9tQml0cyg0MCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJNDggPSB0aGlzLm1heEZyb21CaXRzKDQ4KTsgXHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKSB7IHJldHVybiB0aGlzLmhleCB9XHJcbiAgICB0b1VSTigpIHsgcmV0dXJuICd1cm46dXVpZDonICsgdGhpcy5oZXggfVxyXG4gICAgdG9TaWduYWxLKCk6c3RyaW5nICB7IHJldHVybiBgdXJuOm1ybjpzaWduYWxrOnV1aWQ6JHt0aGlzLmhleH1gIH1cclxuICAgIHRvQnl0ZXMoKSB7XHJcbiAgICAgICAgbGV0IHBhcnRzID0gdGhpcy5oZXguc3BsaXQoJy0nKTtcclxuICAgICAgICBsZXQgaW50cyA9IFtdO1xyXG4gICAgICAgIGxldCBpbnRQb3MgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJ0c1tpXS5sZW5ndGg7IGorPTIpIHtcclxuICAgICAgICAgICAgaW50c1tpbnRQb3MrK10gPSBwYXJzZUludChwYXJ0c1tpXS5zdWJzdHIoaiwgMiksIDE2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW50cztcclxuICAgIH07ICAgIFxyXG5cclxuICAgIHByaXZhdGUgbWF4RnJvbUJpdHMoYml0cykgeyByZXR1cm4gTWF0aC5wb3coMiwgYml0cykgfTtcclxuXHJcbiAgICBwcml2YXRlIGdldFJhbmRvbUludChtaW4sIG1heCkgeyByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbiB9XHJcblxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTA0KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMDQtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTA2KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMDYtMSk7fVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTA4KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMDgtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTEyKCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMTItMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTE0KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMTQtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTE2KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMTYtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTMyKCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMzItMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTQwKCkgeyByZXR1cm4gKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgMzApKSArICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDQwIC0gMzApKSAqICgxIDw8IDMwKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJNDgoKSB7IHJldHVybiAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCAzMCkpICsgKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgNDggLSAzMCkpICogKDEgPDwgMzApIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcclxuICAgICAgICB0aGlzLmZyb21QYXJ0cyhcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTMyKCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkxNigpLFxyXG4gICAgICAgICAgICAweDQwMDAgfCB0aGlzLnJhbmRvbVVJMTIoKSxcclxuICAgICAgICAgICAgMHg4MCAgIHwgdGhpcy5yYW5kb21VSTA2KCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkwOCgpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJNDgoKVxyXG4gICAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgcGFkZGVkU3RyaW5nKHN0cmluZywgbGVuZ3RoLCB6PW51bGwpIHtcclxuICAgICAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKTtcclxuICAgICAgICB6ID0gKCF6KSA/ICcwJyA6IHo7XHJcbiAgICAgICAgbGV0IGkgPSBsZW5ndGggLSBzdHJpbmcubGVuZ3RoO1xyXG4gICAgICAgIGZvciAoOyBpID4gMDsgaSA+Pj49IDEsIHogKz0geikge1xyXG4gICAgICAgICAgICBpZiAoaSAmIDEpIHtcclxuICAgICAgICAgICAgc3RyaW5nID0geiArIHN0cmluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGZyb21QYXJ0cyh0aW1lTG93LCB0aW1lTWlkLCB0aW1lSGlBbmRWZXJzaW9uLCBjbG9ja1NlcUhpQW5kUmVzZXJ2ZWQsIGNsb2NrU2VxTG93LCBub2RlKSB7XHJcbiAgICAgICAgdGhpcy52ZXJzaW9uID0gKHRpbWVIaUFuZFZlcnNpb24gPj4gMTIpICYgMHhGO1xyXG4gICAgICAgIHRoaXMuaGV4ID0gdGhpcy5wYWRkZWRTdHJpbmcodGltZUxvdy50b1N0cmluZygxNiksIDgpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcodGltZU1pZC50b1N0cmluZygxNiksIDQpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcodGltZUhpQW5kVmVyc2lvbi50b1N0cmluZygxNiksIDQpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcoY2xvY2tTZXFIaUFuZFJlc2VydmVkLnRvU3RyaW5nKDE2KSwgMilcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhjbG9ja1NlcUxvdy50b1N0cmluZygxNiksIDIpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcobm9kZS50b1N0cmluZygxNiksIDEyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07ICAgIFxyXG4gICAgXHJcbiAgICAvKlxyXG4gICAgcHJpdmF0ZSBnZXRUaW1lRmllbGRWYWx1ZXModGltZSkge1xyXG4gICAgICAgIGxldCB0cyA9IHRpbWUgLSBEYXRlLlVUQygxNTgyLCA5LCAxNSk7XHJcbiAgICAgICAgbGV0IGhtID0gKCh0cyAvIDB4MTAwMDAwMDAwKSAqIDEwMDAwKSAmIDB4RkZGRkZGRjtcclxuICAgICAgICByZXR1cm4geyBsb3c6ICgodHMgJiAweEZGRkZGRkYpICogMTAwMDApICUgMHgxMDAwMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBtaWQ6IGhtICYgMHhGRkZGLCBoaTogaG0gPj4+IDE2LCB0aW1lc3RhbXA6IHRzIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGZyb21UaW1lKHRpbWUsIGxhc3Q6Ym9vbGVhbikge1xyXG4gICAgICAgIGxhc3QgPSAoIWxhc3QpID8gZmFsc2UgOiBsYXN0O1xyXG4gICAgICAgIGxldCB0ZiA9IHRoaXMuZ2V0VGltZUZpZWxkVmFsdWVzKHRpbWUpO1xyXG4gICAgICAgIGxldCB0bCA9IHRmLmxvdztcclxuICAgICAgICBsZXQgdGhhdiA9ICh0Zi5oaSAmIDB4RkZGKSB8IDB4MTAwMDsgIC8vIHNldCB2ZXJzaW9uICcwMDAxJ1xyXG4gICAgICAgIGlmIChsYXN0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVVSUQoKS5mcm9tUGFydHModGwsIHRmLm1pZCwgdGhhdiwgMCwgMCwgMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVVUlEKCkuZnJvbVBhcnRzKHRsLCB0Zi5taWQsIHRoYXYsIDB4ODAgfCB0aGlzLmxpbWl0VUkwNiwgdGhpcy5saW1pdFVJMDggLSAxLCB0aGlzLmxpbWl0VUk0OCAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZmlyc3RGcm9tVGltZSh0aW1lKSB7IHJldHVybiB0aGlzLmZyb21UaW1lKHRpbWUsIGZhbHNlKSB9XHJcbiAgICBsYXN0RnJvbVRpbWUodGltZSkgeyByZXR1cm4gdGhpcy5mcm9tVGltZSh0aW1lLCB0cnVlKSB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgZXF1YWxzKHV1aWQpIHtcclxuICAgICAgICBpZiAoISh1dWlkIGluc3RhbmNlb2YgVVVJRCkpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICBpZiAodGhpcy5oZXggIT09IHV1aWQuaGV4KSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGZyb21VUk4oc3RySWQpIHtcclxuICAgICAgICBsZXQgcjtcclxuICAgICAgICBsZXQgcCA9IC9eKD86dXJuOnV1aWQ6fFxceyk/KFswLTlhLWZdezh9KS0oWzAtOWEtZl17NH0pLShbMC05YS1mXXs0fSktKFswLTlhLWZdezJ9KShbMC05YS1mXXsyfSktKFswLTlhLWZdezEyfSkoPzpcXH0pPyQvaTtcclxuICAgICAgICBpZiAoKHIgPSBwLmV4ZWMoc3RySWQpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mcm9tUGFydHMoXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzFdLCAxNiksIHBhcnNlSW50KHJbMl0sIDE2KSxcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbM10sIDE2KSwgcGFyc2VJbnQocls0XSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQocls1XSwgMTYpLCBwYXJzZUludChyWzZdLCAxNilcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnJvbUJ5dGVzKGludHMpIHtcclxuICAgICAgICBpZiAoaW50cy5sZW5ndGggPCA1KSB7IHJldHVybiBudWxsIH1cclxuICAgICAgICBsZXQgc3RyID0gJyc7XHJcbiAgICAgICAgbGV0IHBvcyA9IDA7XHJcbiAgICAgICAgbGV0IHBhcnRzID0gWzQsIDIsIDIsIDIsIDZdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJ0c1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBvY3RldCA9IGludHNbcG9zKytdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgaWYgKG9jdGV0Lmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBvY3RldCA9ICcwJyArIG9jdGV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0ciArPSBvY3RldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGFydHNbaV0gIT09IDYpIHtcclxuICAgICAgICAgICAgc3RyICs9ICctJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9tVVJOKHN0cik7XHJcbiAgICB9O1xyXG5cclxuICAgIGZyb21CaW5hcnkoYmluYXJ5KSB7XHJcbiAgICAgICAgbGV0IGludHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpbnRzW2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgIGlmIChpbnRzW2ldID4gMjU1IHx8IGludHNbaV0gPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBieXRlIGluIGJpbmFyeSBkYXRhLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb21CeXRlcyhpbnRzKTtcclxuICAgIH07XHJcbiAgICAqL1xyXG5cclxufTsiLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBTaWduYWxLSHR0cCB9IGZyb20gJy4vaHR0cC1hcGknO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbSB9IGZyb20gJy4vc3RyZWFtLWFwaSc7XG5pbXBvcnQgeyBQYXRoLCBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtV29ya2VyfSBmcm9tICcuL3N0cmVhbS13b3JrZXInO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuICAgIFxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHB1YmxpYyBzZXJ2ZXI9IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXVxuICAgIH0gICAgXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgXG4gICAgICAgIHRoaXMuX3Rva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuYXBpLnRva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuc3RyZWFtLnRva2VuPSB2YWw7XG4gICAgfSAgICBcbiAgICAvLyAqKiBNZXNzYWdlIE9iamVjdFxuICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gTWVzc2FnZSB9XG5cbiAgICAvLyAqKiBnZW5lcmF0ZSBhbmQgcmV0dXJuIGEgVVVJRCBvYmplY3RcbiAgICBnZXQgdXVpZCgpOlVVSUQgeyByZXR1cm4gbmV3IFVVSUQoKSB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgXG4gICAgICAgICAgICAgICAgcHVibGljIGFwaTogU2lnbmFsS0h0dHAsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzdHJlYW06IFNpZ25hbEtTdHJlYW0sXG4gICAgICAgICAgICAgICAgcHVibGljIHdvcmtlcjogU2lnbmFsS1N0cmVhbVdvcmtlciApIHsgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfSAgIFxuICAgIFxuICAgIC8vICoqIGluaXRpYWxpc2UgcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0IHZhbHVlc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9J2xvY2FsaG9zdCcsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OIEFORCBESVNDT1ZFUlkgICoqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZW5kcG9pbnQgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyIChlbmRwb2ludCBkaXNjb3ZlcnkpIGFuZCBETyBOT1Qgb3BlbiBTdHJlYW1cbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlPT4geyBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKTsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IH1cbiAgICBcbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RQbGF5YmFjayhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIG9wdGlvbnM6YW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHB1dCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTsgICBcblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwgKSB9XG4gICAgfVx0ICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuXG59XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogU2lnbmFsS0NsaWVudCBNb2R1bGU6XHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbIEh0dHBDbGllbnRNb2R1bGUgXSwgICAgXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW10sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdLCBcclxuICAgIHByb3ZpZGVyczogW10gIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudE1vZHVsZSB7fVxyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9zaWduYWxrLWNsaWVudCc7Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7SUFBQTtLQWNDOzs7Ozs7O0lBWFUsZUFBVTs7Ozs7O0lBQWpCLFVBQWtCLElBQVc7UUFDekIsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFFLENBQUMsQ0FBQyxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFO2FBQ3pEO1lBQUUsT0FBTyxJQUFJLENBQUE7U0FBRTtLQUN2Qjs7Ozs7OztJQUdNLGtCQUFhOzs7Ozs7SUFBcEIsVUFBcUIsT0FBYzs7WUFDM0IsR0FBRyxHQUFFLENBQUMsT0FBTyxJQUFFLE1BQU0sSUFBSyxjQUFjLEdBQUUsT0FBTztRQUNyRCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ25DO0lBRUwsV0FBQztDQUFBLElBQUE7O0FBR0Q7OztJQUFBO0tBdUNDOzs7Ozs7SUFwQ1UsZUFBTzs7Ozs7SUFBZDs7UUFFSSxPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsRUFBRTtTQUNkLENBQUE7S0FDSjs7Ozs7O0lBRU0saUJBQVM7Ozs7O0lBQWhCOzs7Ozs7OztRQVFJLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLFNBQVMsRUFBRSxFQUFFO1NBQ2hCLENBQUE7S0FDSjs7Ozs7O0lBRU0sbUJBQVc7Ozs7O0lBQWxCOztRQUVJLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxFQUFFO1NBQ2xCLENBQUE7S0FDSjs7Ozs7O0lBRU0sZUFBTzs7Ozs7SUFBZDtRQUNJLE9BQU87WUFDSCxTQUFTLEVBQUUsSUFBSTtTQUNsQixDQUFBO0tBQ0o7SUFFTCxjQUFDO0NBQUEsSUFBQTs7Ozs7O0FDekREOztJQWlCSSxxQkFBcUIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtLQUFNO0lBSjNDLHNCQUFJLDhCQUFLOzs7Ozs7OztRQUFULFVBQVUsR0FBVSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUUsR0FBRyxDQUFBLEVBQUU7OztPQUFBOzs7Ozs7SUFPMUMsNkJBQU87Ozs7O0lBQVAsY0FBWSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUEsRUFBRTs7Ozs7O0lBRzdDLCtCQUFTOzs7OztJQUFULGNBQWMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBLEVBQUU7Ozs7Ozs7O0lBR3ZDLDZCQUFPOzs7Ozs7O0lBQVAsVUFBUSxPQUFjLEVBQUUsSUFBVztRQUMvQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFPLENBQUMsQ0FBQztLQUNuRjs7Ozs7OztJQUdELHlCQUFHOzs7Ozs7SUFBSCxVQUFJLElBQVc7UUFDWCxJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUFFLE9BQU07U0FBRTtRQUM3QixJQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBRSxHQUFHLEVBQUU7WUFBRSxJQUFJLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUFFOztZQUNwQyxHQUFHLEdBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUM5QyxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O2dCQUNSLE9BQU8sR0FBRSxJQUFJLFdBQVcsQ0FBRSxFQUFFLGVBQWUsRUFBRSxTQUFPLElBQUksQ0FBQyxNQUFRLEVBQUUsQ0FBRTtZQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO1NBQ3JEO2FBQ0k7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQUU7S0FDckM7Ozs7Ozs7O0lBS0QseUJBQUc7Ozs7Ozs7SUFBSCxVQUFJLE9BQWMsRUFBRSxJQUFXLEVBQUUsR0FBUSxFQUFFLEtBQVU7UUFDakQsSUFBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFBRSxPQUFNO1NBQUU7UUFDN0IsSUFBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUUsR0FBRyxFQUFFO1lBQUUsSUFBSSxHQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FBRTs7WUFDcEMsR0FBRyxHQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7O1lBQzlFLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7UUFDdkIsSUFBRyxPQUFPLEtBQUssSUFBRSxXQUFXLEVBQUU7WUFBRSxHQUFHLENBQUMsS0FBSyxHQUFFLEdBQUcsQ0FBQTtTQUFFO2FBQ2pEO1lBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRSxLQUFLLENBQUE7U0FBRTtRQUV4QixJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O2dCQUNSLE9BQU8sR0FBRSxJQUFJLFdBQVcsQ0FBRSxFQUFFLGVBQWUsRUFBRSxTQUFPLElBQUksQ0FBQyxNQUFRLEVBQUUsQ0FBRTtZQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztTQUN6RDthQUNJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7U0FBRTtLQUMxQzs7Z0JBdERKLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Ozs7Z0JBSHpCLFVBQVU7OztzQkFEbkI7Q0E0REM7Ozs7OztBQzVERDs7SUFxREk7UUF4Q1EsWUFBTyxHQUFFLElBQUksQ0FBQzs7UUFDZCxlQUFVLEdBQUUsS0FBSyxDQUFDO1FBRWxCLGtCQUFhLEdBQVcsS0FBSyxDQUFDO1FBc0NsQyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFPLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFPLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ2hEO0lBakNELHNCQUFJLGdDQUFLOzs7Ozs7OztRQUFULFVBQVUsR0FBVSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUUsR0FBRyxDQUFBLEVBQUU7OztPQUFBO0lBRTFDLHNCQUFJLDRDQUFpQjs7Ozs7OztRQUFyQixjQUFpQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsRUFBRTs7Ozs7UUFDekQsVUFBc0IsR0FBVTtZQUM1QixJQUFJLENBQUMsVUFBVSxHQUFFLENBQUMsR0FBRyxHQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUMsS0FBSyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7U0FDbEU7OztPQUh3RDtJQUt6RCxzQkFBSSxpQ0FBTTs7Ozs7OztRQUFWO1lBQ0ksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLElBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxJQUFFLENBQUMsQ0FBQyxJQUFLLElBQUksR0FBRyxLQUFLLENBQUM7U0FDeEY7OztPQUFBO0lBRUQsc0JBQUksaUNBQU07Ozs7Ozs7UUFBVixjQUFzQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsRUFBRTs7Ozs7Ozs7UUFFM0MsVUFBVyxFQUFTO1lBQ2hCLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDLEVBQUc7Z0JBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ3BEO2lCQUNJO2dCQUFFLElBQUksQ0FBQyxPQUFPLEdBQUUsRUFBRSxDQUFBO2FBQUU7U0FDNUI7OztPQVAwQztJQVMzQyxzQkFBSSx1Q0FBWTs7Ozs7OztRQUFoQixjQUE2QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUEsRUFBRTs7O09BQUE7Ozs7OztJQWdCeEQsNkJBQUs7Ozs7O0lBQUwsY0FBVSxJQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRSxJQUFJLENBQUM7S0FBRSxFQUFFOzs7Ozs7Ozs7SUFHOUQsNEJBQUk7Ozs7Ozs7O0lBQUosVUFBSyxHQUFVLEVBQUUsU0FBaUIsRUFBRSxLQUFhO1FBQWpELGlCQXNDSTtRQXJDRyxHQUFHLEdBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBRyxDQUFDLEdBQUcsRUFBRTtZQUFFLE9BQU07U0FBRTs7WUFDZixDQUFDLEdBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHO1FBQ3pDLElBQUcsU0FBUyxFQUFFO1lBQUUsR0FBRyxJQUFLLENBQUMsa0JBQWEsU0FBVyxDQUFBO1NBQUU7UUFDbkQsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtZQUFFLEdBQUcsSUFBRyxDQUFHLENBQUMsU0FBUyxJQUFJLEdBQUcsR0FBRyxHQUFHLGdCQUFTLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFFLENBQUE7U0FBRTtRQUU1RixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUU3QixVQUFVLENBQ047WUFDSSxJQUFHLEtBQUksQ0FBQyxFQUFFLEtBQUssS0FBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLElBQUUsQ0FBQyxJQUFJLEtBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxJQUFFLENBQUMsQ0FBQyxFQUFHO2dCQUM3RCxPQUFPLENBQUMsSUFBSSxDQUFDLGtDQUFnQyxLQUFJLENBQUMsVUFBVSxHQUFDLElBQUksZUFBVSxLQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsK0JBQTRCLENBQUMsQ0FBQztnQkFDM0gsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2hCO1NBQ0osRUFBRSxJQUFJLENBQUMsVUFBVSxDQUNyQixDQUFDO1FBRVIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUUsVUFBQSxDQUFDLElBQUssS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRSxDQUFBO1FBQzdDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFFLFVBQUEsQ0FBQyxJQUFLLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUUsQ0FBQTtRQUM1QyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRSxVQUFBLENBQUMsSUFBSyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFLENBQUE7UUFDNUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUUsVUFBQSxDQUFDOztnQkFDTixJQUFTO1lBQ2IsSUFBRyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUMzQixJQUFJO29CQUFFLElBQUksR0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFBRTtnQkFDaEMsT0FBTSxDQUFDLEVBQUU7b0JBQUUsT0FBTTtpQkFBRTthQUN0QjtZQUNELElBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsS0FBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN2QixLQUFJLENBQUMsYUFBYSxHQUFFLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFHLFdBQVcsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUN6RSxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QjtpQkFDSSxJQUFHLEtBQUksQ0FBQyxPQUFPLElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEMsSUFBRyxJQUFJLENBQUMsT0FBTyxJQUFHLEtBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQUU7YUFDL0Q7aUJBQ0k7Z0JBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7YUFBRTtTQUMxQyxDQUFBO0tBQ0U7Ozs7Ozs7SUFHRCw0QkFBSTs7Ozs7O0lBQUosVUFBSyxJQUFRO1FBQ1QsSUFBRyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1IsSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQUUsSUFBSSxHQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7YUFBRTtZQUMzRCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjtLQUNKOzs7Ozs7O0lBS0Qsa0NBQVU7Ozs7OztJQUFWLFVBQVcsT0FBcUIsRUFBRSxJQUF5QixFQUFFLEtBQVU7UUFBNUQsd0JBQUEsRUFBQSxnQkFBcUI7O1lBQ3hCLEdBQUcsR0FBRSxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxPQUFPLEdBQUUsQ0FBQyxPQUFPLElBQUUsTUFBTSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUM7UUFDMUQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUE7U0FBRTs7WUFFekMsT0FBTyxHQUFFLEVBQUU7UUFDZixJQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM5QztRQUNELElBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUc7WUFDakQsT0FBTyxHQUFFLElBQUksQ0FBQztTQUNqQjtRQUNELEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsQjs7Ozs7OztJQUtELGlDQUFTOzs7Ozs7SUFBVCxVQUFVLE9BQWtCLEVBQUUsSUFBNEIsRUFBRSxPQUFZO1FBQTlELHdCQUFBLEVBQUEsYUFBa0I7UUFBRSxxQkFBQSxFQUFBLFVBQTRCOztZQUNsRCxHQUFHLEdBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUM1QixHQUFHLENBQUMsT0FBTyxHQUFFLENBQUMsT0FBTyxJQUFFLE1BQU0sSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDO1FBQzFELElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFBO1NBQUU7UUFFN0MsSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRztZQUNsRCxHQUFHLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQztTQUN0QjtRQUNELElBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFOztnQkFDckIsTUFBTSxHQUFFLEVBQUU7WUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUUsSUFBSSxDQUFDO1lBQ3JCLElBQUcsT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDdkMsSUFBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtpQkFBRTtnQkFDN0QsSUFBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtpQkFBRTtnQkFDbkUsSUFBRyxPQUFPLENBQUMsUUFBUSxDQUFDO3FCQUNmLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBRSxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFFLE1BQU0sQ0FBQyxFQUFHO29CQUN4RCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUMzQztnQkFDRCxJQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7cUJBQ2YsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFFLFNBQVMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUUsT0FBTzsyQkFDeEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFFLE9BQU8sQ0FBQyxFQUFHO29CQUM3QixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUMzQzthQUNKO1lBQ0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCOzs7Ozs7OztJQUdELG1DQUFXOzs7Ozs7O0lBQVgsVUFBWSxPQUFrQixFQUFFLElBQVk7UUFBaEMsd0JBQUEsRUFBQSxhQUFrQjtRQUFFLHFCQUFBLEVBQUEsVUFBWTs7WUFDcEMsR0FBRyxHQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUU7UUFDOUIsR0FBRyxDQUFDLE9BQU8sR0FBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQztRQUMxRCxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQTtTQUFFO1FBRTdDLElBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUc7WUFDbEQsR0FBRyxDQUFDLFdBQVcsR0FBRSxJQUFJLENBQUM7U0FDeEI7UUFDRCxJQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7U0FBRTtRQUNuRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCOzs7Ozs7Ozs7SUFJRCw4QkFBTTs7Ozs7OztJQUFOLFVBQU8sR0FBTyxJQUFZLFFBQVEsR0FBRyxDQUFDLE9BQU8sSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFDLEVBQUU7Ozs7Ozs7SUFFOUQsK0JBQU87Ozs7OztJQUFQLFVBQVEsR0FBTyxJQUFZLE9BQU8sT0FBTyxHQUFHLENBQUMsT0FBTyxJQUFHLFdBQVcsQ0FBQSxFQUFFOzs7Ozs7O0lBRXBFLCtCQUFPOzs7Ozs7SUFBUCxVQUFRLEdBQU87UUFDWCxRQUFRLE9BQU8sR0FBRyxDQUFDLE9BQU8sSUFBRyxXQUFXLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFHLFdBQVcsRUFBRTtLQUM5RTs7Ozs7OztJQUVELGtDQUFVOzs7Ozs7SUFBVixVQUFXLEdBQU8sSUFBWSxPQUFPLE9BQU8sR0FBRyxDQUFDLFNBQVMsSUFBRyxXQUFXLENBQUEsRUFBRTs7Z0JBMUw1RSxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7Ozt3QkFKbEM7Q0ErTEM7Ozs7Ozs7O0lDNUtHO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ2hEOzs7O0lBRUQseUNBQVc7OztJQUFYLGNBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxFQUFFOzs7Ozs7O0lBR25FLGtDQUFJOzs7Ozs7SUFBSixVQUFLLFVBQWlCO1FBQXRCLGlCQVFDO1FBUEcsSUFBRyxRQUFPLE1BQU0sQ0FBQyxJQUFHLFdBQVcsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFBO1NBQUU7UUFDakQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtTQUFFO1FBRTNDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUUsVUFBQSxLQUFLLElBQUssS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsRUFBRSxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFFLFVBQUEsS0FBSyxJQUFLLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBLEVBQUUsQ0FBQzs7S0FFNUQ7Ozs7Ozs7SUFHRCx5Q0FBVzs7Ozs7O0lBQVgsVUFBWSxHQUFPLElBQUksSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7S0FBRSxFQUFFOzs7Ozs7SUFHeEUsdUNBQVM7Ozs7O0lBQVQsY0FBYyxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQUMsRUFBRTs7Z0JBdEM1RCxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7Ozs4QkFMbEM7Q0E0Q0M7Ozs7Ozs7Ozs7O0FDdkNEOzs7Ozs7SUFlSTtRQUNJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNqQjs7OztJQUVELHVCQUFROzs7SUFBUixjQUFhLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQSxFQUFFOzs7O0lBQzlCLG9CQUFLOzs7SUFBTCxjQUFVLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUEsRUFBRTs7OztJQUN6Qyx3QkFBUzs7O0lBQVQsY0FBc0IsT0FBTywwQkFBd0IsSUFBSSxDQUFDLEdBQUssQ0FBQSxFQUFFOzs7O0lBQ2pFLHNCQUFPOzs7SUFBUDs7WUFDUSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztZQUMzQixJQUFJLEdBQUcsRUFBRTs7WUFDVCxNQUFNLEdBQUcsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7O0lBRU8sMEJBQVc7Ozs7O0lBQW5CLFVBQW9CLElBQUksSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBLEVBQUU7Ozs7Ozs7SUFFOUMsMkJBQVk7Ozs7OztJQUFwQixVQUFxQixHQUFHLEVBQUUsR0FBRyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQSxFQUFFOzs7OztJQUVuRix5QkFBVTs7OztJQUFsQixjQUF1QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQseUJBQVU7Ozs7SUFBbEIsY0FBdUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCx5QkFBVTs7OztJQUFsQixjQUF1QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQseUJBQVU7Ozs7SUFBbEIsY0FBdUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUU7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCx5QkFBVTs7OztJQUFsQixjQUF1QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQseUJBQVU7Ozs7SUFBbEIsY0FBdUIsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQSxFQUFFOzs7OztJQUMxRyx5QkFBVTs7OztJQUFsQixjQUF1QixPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBLEVBQUU7Ozs7O0lBRTFHLHFCQUFNOzs7O0lBQWQ7UUFDSSxJQUFJLENBQUMsU0FBUyxDQUNWLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFDakIsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUNqQixNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUMxQixJQUFJLEdBQUssSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUMxQixJQUFJLENBQUMsVUFBVSxFQUFFLEVBQ2pCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FDcEIsQ0FBQztLQUNMOzs7Ozs7OztJQUVPLDJCQUFZOzs7Ozs7O0lBQXBCLFVBQXFCLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBTTtRQUFOLGtCQUFBLEVBQUEsUUFBTTtRQUN2QyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7O1lBQ2YsQ0FBQyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTTtRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDWCxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQzthQUNuQjtTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDakI7Ozs7Ozs7Ozs7Ozs7SUFFTyx3QkFBUzs7Ozs7Ozs7Ozs7O0lBQWpCLFVBQWtCLE9BQU8sRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxFQUFFLElBQUk7UUFDMUYsbUJBQUEsSUFBSSxHQUFDLE9BQU8sR0FBRyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUM7UUFDOUMsbUJBQUEsSUFBSSxHQUFDLEdBQUcsR0FBRyxtQkFBQSxJQUFJLEdBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2NBQy9DLEdBQUc7Y0FDSCxtQkFBQSxJQUFJLEdBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2NBQzFDLEdBQUc7Y0FDSCxtQkFBQSxJQUFJLEdBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Y0FDbkQsR0FBRztjQUNILG1CQUFBLElBQUksR0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztjQUN4RCxtQkFBQSxJQUFJLEdBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2NBQzlDLEdBQUc7Y0FDSCxtQkFBQSxJQUFJLEdBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0MsMEJBQU8sSUFBSSxHQUFDO0tBQ2Y7SUE2RUwsV0FBQztDQUFBLElBQUE7Ozs7OztBQ2hMRDs7SUF1REksdUJBQXFCLElBQWdCLEVBQ2xCLEdBQWdCLEVBQ2hCLE1BQXFCLEVBQ3JCLE1BQTJCO1FBSHpCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDbEIsUUFBRyxHQUFILEdBQUcsQ0FBYTtRQUNoQixXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQXFCO1FBMUN0QyxhQUFRLEdBQVUsSUFBSSxDQUFDOzs7UUFReEIsV0FBTSxHQUFFO1lBQ1gsU0FBUyxFQUFFLEVBQUU7WUFDYixJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxFQUFFO1NBQ2xCLENBQUE7UUErQkcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2Y7Ozs7Ozs7SUF6Q08sNkJBQUs7Ozs7Ozs7SUFBYixVQUFjLEdBQVEsSUFBSSxJQUFHLFNBQVMsRUFBRSxFQUFDO1FBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUFFLEVBQUU7SUFXL0Qsc0JBQUksa0NBQU87Ozs7Ozs7UUFBWCxjQUF1QixPQUFPLFFBQVEsQ0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFBLEVBQUU7Ozs7O1FBQ2xFLFVBQVksR0FBVzs7Z0JBQ2YsQ0FBQyxHQUFTLEdBQUcsR0FBRSxHQUFHO1lBQ3RCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFFLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRSxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsa0NBQWdDLENBQUcsQ0FBQyxDQUFDO2FBQ25EO2lCQUNJO2dCQUNELElBQUksQ0FBQyxRQUFRLEdBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxLQUFLLENBQUMsdUNBQXFDLENBQUMsa0JBQWEsSUFBSSxDQUFDLFFBQVUsQ0FBQyxDQUFDO2FBQ2xGO1NBQ0o7OztPQVhpRTtJQWFsRSxzQkFBSSxvQ0FBUzs7Ozs7Ozs7UUFBYixVQUFjLEdBQVU7WUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRSxHQUFHLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUUsR0FBRyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFFLEdBQUcsQ0FBQztTQUMxQjs7O09BQUE7SUFFRCxzQkFBSSxrQ0FBTzs7Ozs7OztRQUFYLGNBQWdCLE9BQU8sT0FBTyxDQUFBLEVBQUU7OztPQUFBO0lBR2hDLHNCQUFJLCtCQUFJOzs7Ozs7O1FBQVIsY0FBa0IsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFBLEVBQUU7OztPQUFBOzs7O0lBVXJDLG1DQUFXOzs7SUFBWCxjQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBLEVBQUU7Ozs7Ozs7Ozs7SUFHN0IsNEJBQUk7Ozs7Ozs7OztJQUFaLFVBQWEsUUFBMkIsRUFBRSxJQUFnQixFQUFFLE1BQW9CO1FBQW5FLHlCQUFBLEVBQUEsc0JBQTJCO1FBQUUscUJBQUEsRUFBQSxXQUFnQjtRQUFFLHVCQUFBLEVBQUEsY0FBb0I7UUFDNUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBRyxNQUFNLEVBQUU7WUFDUCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxHQUFHLENBQUM7U0FDM0I7YUFDSTtZQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztTQUMxQjtLQUNKOzs7Ozs7Ozs7OztJQUtELDZCQUFLOzs7Ozs7Ozs7SUFBTCxVQUFNLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQjtRQUE1RCx5QkFBQSxFQUFBLGVBQW9CO1FBQUUscUJBQUEsRUFBQSxXQUFnQjtRQUFFLHVCQUFBLEVBQUEsY0FBb0I7UUFDOUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMvQjs7Ozs7Ozs7O0lBRUQsK0JBQU87Ozs7Ozs7O0lBQVAsVUFBUSxRQUFvQixFQUFFLElBQWdCLEVBQUUsTUFBb0I7UUFBcEUsaUJBaUJDO1FBakJPLHlCQUFBLEVBQUEsZUFBb0I7UUFBRSxxQkFBQSxFQUFBLFdBQWdCO1FBQUUsdUJBQUEsRUFBQSxjQUFvQjtRQUNoRSxPQUFPLElBQUksT0FBTyxDQUFFLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDaEMsS0FBSSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ2xELEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxTQUFTO1lBQ3hDO1lBQUEsUUFBUTtnQkFDSixJQUFHLEtBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtpQkFBRTtnQkFDdkMsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDNUIsS0FBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUUsS0FBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQzlDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUNuRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakIsRUFDRCxVQUFBLEtBQUs7Z0JBQ0QsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNqQixDQUNKLENBQUM7U0FDTCxDQUFDLENBQUM7S0FDTjs7Ozs7O0lBR0Qsa0NBQVU7Ozs7O0lBQVYsY0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFOzs7Ozs7Ozs7O0lBRzlELHFDQUFhOzs7Ozs7Ozs7SUFBYixVQUFjLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQixFQUFFLFNBQXFCO1FBQWpHLGlCQWVDO1FBZmEseUJBQUEsRUFBQSxlQUFvQjtRQUFFLHFCQUFBLEVBQUEsV0FBZ0I7UUFBRSx1QkFBQSxFQUFBLGNBQW9CO1FBQUUsMEJBQUEsRUFBQSxnQkFBcUI7UUFDN0YsT0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2hDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7aUJBQ25DLElBQUksQ0FBRTs7O29CQUVDLEdBQUcsR0FBRSxLQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBQ3JDLElBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ0wsTUFBTSxDQUFFLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUUsQ0FBQztvQkFDbEUsT0FBTztpQkFDVjtnQkFDRCxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2pDLE9BQU8sQ0FBRSxJQUFJLENBQUUsQ0FBQzthQUNuQixDQUFDO2lCQUNELEtBQUssQ0FBRSxVQUFBLENBQUMsSUFBSyxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUEsRUFBRSxDQUFDLENBQUM7U0FDaEMsQ0FBQyxDQUFDO0tBQ047Ozs7Ozs7Ozs7SUFHRCx1Q0FBZTs7Ozs7Ozs7O0lBQWYsVUFBZ0IsUUFBb0IsRUFBRSxJQUFnQixFQUFFLE1BQW9CLEVBQUUsT0FBVztRQUF6RixpQkFVQztRQVZlLHlCQUFBLEVBQUEsZUFBb0I7UUFBRSxxQkFBQSxFQUFBLFdBQWdCO1FBQUUsdUJBQUEsRUFBQSxjQUFvQjtRQUN4RSxPQUFPLElBQUksT0FBTyxDQUFFLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDaEMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQztpQkFDbkMsSUFBSSxDQUFFOztnQkFFSCxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUUsSUFBSSxDQUFFLENBQUM7YUFDbkIsQ0FBQztpQkFDRCxLQUFLLENBQUUsVUFBQSxDQUFDLElBQUssTUFBTSxDQUFFLENBQUMsQ0FBRSxDQUFBLEVBQUUsQ0FBQyxDQUFDO1NBQ2hDLENBQUMsQ0FBQTtLQUNMOzs7Ozs7Ozs7SUFHRCxrQ0FBVTs7Ozs7Ozs7SUFBVixVQUFXLEdBQWUsRUFBRSxTQUFpQixFQUFFLEtBQWE7UUFBakQsb0JBQUEsRUFBQSxVQUFlO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNsQyxJQUFHLENBQUMsR0FBRyxFQUFFO1lBQ0wsR0FBRyxHQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ2xDLElBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQ0wsUUFBUSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxFQUFHO2FBQ3JFO1NBQ0o7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7Ozs7Ozs7OztJQUdELG9DQUFZOzs7Ozs7OztJQUFaLFVBQWEsR0FBZSxFQUFFLE9BQVksRUFBRSxLQUFhO1FBQTVDLG9CQUFBLEVBQUEsVUFBZTtRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDcEMsSUFBRyxDQUFDLEdBQUcsRUFBRTtZQUNMLEdBQUcsR0FBRSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNsQyxJQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNMLFFBQVEsSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsRUFBRzthQUNyRTtZQUNELEdBQUcsR0FBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUMxQzs7WUFDRyxFQUFFLEdBQUUsRUFBRTs7WUFDTixTQUFpQjtRQUNyQixJQUFHLE9BQU8sSUFBSSxPQUFPLE9BQU8sS0FBSSxRQUFRLEVBQUM7WUFDckMsRUFBRSxJQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNoSCxFQUFFLElBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLG1CQUFpQixPQUFPLENBQUMsWUFBYyxHQUFHLEVBQUUsQ0FBQztZQUMzRSxTQUFTLEdBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQzdEO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7Ozs7SUFHTyxvQ0FBWTs7Ozs7OztJQUFwQixVQUFxQixRQUFhO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNqRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3JDOzs7Ozs7SUFHTSw2Q0FBcUI7Ozs7O0lBQTVCO1FBQ0ksSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzNGLElBQUksQ0FBQyxLQUFLLENBQUMsa0NBQWdDLElBQUksQ0FBQyxRQUFVLENBQUMsQ0FBQztZQUM1RCxPQUFPLEtBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBRyxDQUFDO1NBQ2xFO2FBQ0ksSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUM5RSxJQUFJLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDN0MsT0FBTyxLQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBRyxDQUFBO1NBQ3hEO2FBQ0k7WUFBRSxPQUFPLElBQUksQ0FBQTtTQUFFO0tBQ3ZCOzs7Ozs7O0lBR08sMkNBQW1COzs7Ozs7SUFBM0I7O1lBQ1EsR0FBVztRQUNmLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFOztZQUVyQyxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDckQsR0FBRyxHQUFFLEtBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBRyxDQUFDO2FBQ2xFO2lCQUNJO2dCQUFFLEdBQUcsR0FBRSxLQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBRyxDQUFBO2FBQUU7U0FDakU7YUFDSTs7Z0JBQ0csR0FBRyxHQUFFLHVGQUF1RjtZQUNoRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxHQUFHLENBQUM7S0FDZDs7Ozs7OztJQUdPLDhDQUFzQjs7Ozs7O0lBQTlCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUUsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFFLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRSxFQUFFLENBQUM7S0FDL0I7Ozs7Ozs7SUFHRCwyQkFBRzs7Ozs7O0lBQUgsVUFBSSxJQUFXOztZQUNQLEdBQUcsR0FBSyxJQUFJLENBQUMsUUFBUSxXQUFNLElBQUksQ0FBQyxRQUFRLFNBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRztRQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQU8sR0FBSyxDQUFDLENBQUM7UUFDekIsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFOztnQkFDUixPQUFPLEdBQUUsSUFBSSxXQUFXLENBQUUsRUFBRSxlQUFlLEVBQUUsU0FBTyxJQUFJLENBQUMsTUFBUSxFQUFFLENBQUU7WUFDekUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztTQUNyRDthQUNJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFO0tBQ3JDOzs7Ozs7OztJQUdELDJCQUFHOzs7Ozs7O0lBQUgsVUFBSSxJQUFXLEVBQUUsS0FBUzs7WUFDbEIsR0FBRyxHQUFLLElBQUksQ0FBQyxRQUFRLFdBQU0sSUFBSSxDQUFDLFFBQVEsU0FBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFHO1FBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBTyxHQUFLLENBQUMsQ0FBQztRQUN6QixJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O2dCQUNSLE9BQU8sR0FBRSxJQUFJLFdBQVcsQ0FBRSxFQUFFLGVBQWUsRUFBRSxTQUFPLElBQUksQ0FBQyxNQUFRLEVBQUUsQ0FBRTtZQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO1NBQ3JEO2FBQ0k7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUFFO0tBQzVDOzs7Ozs7OztJQUdELDRCQUFJOzs7Ozs7O0lBQUosVUFBSyxJQUFXLEVBQUUsS0FBUzs7WUFDbkIsR0FBRyxHQUFLLElBQUksQ0FBQyxRQUFRLFdBQU0sSUFBSSxDQUFDLFFBQVEsU0FBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFHO1FBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBUSxHQUFLLENBQUMsQ0FBQztRQUMxQixJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O2dCQUNSLE9BQU8sR0FBRSxJQUFJLFdBQVcsQ0FBRSxFQUFFLGVBQWUsRUFBRSxTQUFPLElBQUksQ0FBQyxNQUFRLEVBQUUsQ0FBRTtZQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO1NBQ3REO2FBQ0k7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUFFO0tBQzdDOzs7Ozs7OztJQUdELDZCQUFLOzs7Ozs7O0lBQUwsVUFBTSxRQUFlLEVBQUUsUUFBZTs7WUFDOUIsT0FBTyxHQUFFLElBQUksV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQztRQUN0RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNkLElBQUksQ0FBQyxRQUFRLFdBQU0sSUFBSSxDQUFDLFFBQVEsU0FBSSxJQUFJLENBQUMsSUFBSSxpQkFBWSxJQUFJLENBQUMsUUFBUSxnQkFBYSxFQUN0RixFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUM5QyxFQUFFLE9BQU8sU0FBQSxFQUFFLENBQ2QsQ0FBQztLQUNMOzs7Ozs7SUFHRCw4QkFBTTs7Ozs7SUFBTjs7WUFDRSxHQUFHLEdBQUksSUFBSSxDQUFDLFFBQVEsV0FBTSxJQUFJLENBQUMsUUFBUSxTQUFJLElBQUksQ0FBQyxJQUFJLGlCQUFZLElBQUksQ0FBQyxRQUFRLGlCQUFjO1FBQ3pGLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTs7Z0JBQ1IsT0FBTyxHQUFFLElBQUksV0FBVyxDQUFFLEVBQUUsZUFBZSxFQUFFLFNBQU8sSUFBSSxDQUFDLE1BQVEsRUFBRSxDQUFFO1lBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sU0FBQSxFQUFFLENBQUUsQ0FBQztTQUNsRDthQUNJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUUsSUFBSSxDQUFFLENBQUE7U0FBRTtLQUM3Qzs7Ozs7Ozs7SUFHRCxnQ0FBUTs7Ozs7OztJQUFSLFVBQVMsT0FBYyxFQUFFLElBQVc7UUFDaEMsSUFBRyxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU07U0FBRTtRQUNwQixJQUFJLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7WUFDeEMsR0FBRyxHQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtRQUNuQyxJQUFHLENBQUMsR0FBRyxFQUFFO1lBQUUsT0FBTTtTQUFFO1FBQ25CLEdBQUcsR0FBRSxLQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQVMsSUFBTSxDQUFDO1FBQ25GLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTs7Z0JBQ1IsT0FBTyxHQUFFLElBQUksV0FBVyxDQUFFLEVBQUUsZUFBZSxFQUFFLFNBQU8sSUFBSSxDQUFDLE1BQVEsRUFBRSxDQUFFO1lBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFFLENBQUM7U0FDckQ7YUFDSTtZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRTtLQUNyQzs7Z0JBalJKLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Ozs7Z0JBUnpCLFVBQVU7Z0JBRVYsV0FBVztnQkFDWCxhQUFhO2dCQUViLG1CQUFtQjs7O3dCQU41QjtDQTRSQzs7Ozs7OztJQ3JSRDtLQU9tQzs7Z0JBUGxDLFFBQVEsU0FBQztvQkFDTixPQUFPLEVBQUUsQ0FBRSxnQkFBZ0IsQ0FBRTtvQkFDN0IsWUFBWSxFQUFFLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRSxFQUFFO29CQUNYLGVBQWUsRUFBRSxFQUFFO29CQUNuQixTQUFTLEVBQUUsRUFBRTtpQkFDaEI7O0lBQ2lDLDBCQUFDO0NBQUE7Ozs7Ozs7Ozs7Ozs7OyJ9