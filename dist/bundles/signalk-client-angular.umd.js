(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('signalk-client-angular', ['exports', '@angular/core', '@angular/common/http', 'rxjs'], factory) :
    (factory((global['signalk-client-angular'] = {}),global.ng.core,global.ng.common.http,global.rxjs));
}(this, (function (exports,i0,i1,rxjs) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SignalKClient = (function () {
        function SignalKClient(http) {
            this.http = http;
            this._version = 'v1';
            this._filter = null;
            this._wsTimeout = 20000;
            this.server = {
                authRequired: false,
                endpoints: {},
                info: {},
                apiVersions: [],
                ws: { self: null, roles: {} }
            };
            this._connect = new rxjs.Subject();
            this.onConnect = this._connect.asObservable();
            this._close = new rxjs.Subject();
            this.onClose = this._close.asObservable();
            this._error = new rxjs.Subject();
            this.onError = this._error.asObservable();
            this._message = new rxjs.Subject();
            this.onMessage = this._message.asObservable();
            this.init();
        }
        /**
         * @param {?} val
         * @return {?}
         */
        SignalKClient.prototype.debug = /**
         * @param {?} val
         * @return {?}
         */
            function (val) {
                if (i0.isDevMode()) {
                    console.log(val);
                }
            };
        Object.defineProperty(SignalKClient.prototype, "version", {
            // **************** Signal K API VERSION ***************************
            // ** get / set Signal K preferred api version to use **
            get: /**
             * @return {?}
             */ function () { return parseInt(this._version.slice(1)); },
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
        Object.defineProperty(SignalKClient.prototype, "apiVersions", {
            // ** get list of api versions supported by server
            get: /**
             * @return {?}
             */ function () { return this.server.apiVersions; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKClient.prototype, "authRequired", {
            // **************** CONNECTION  ***************************
            // ** is Auth required for this server **
            get: /**
             * @return {?}
             */ function () { return this.server.authRequired; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalKClient.prototype, "authToken", {
            // ** set auth token value **
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) { this._token = val; },
            enumerable: true,
            configurable: true
        });
        // ** get auth token for supplied user details **
        /**
         * @param {?} username
         * @param {?} password
         * @return {?}
         */
        SignalKClient.prototype.login = /**
         * @param {?} username
         * @param {?} password
         * @return {?}
         */
            function (username, password) {
                /** @type {?} */
                var headers = new i1.HttpHeaders().set('Content-Type', "application/json");
                return this.http.post(this.protocol + "://" + this.hostname + ":" + this.port + "/login", { "username": username, "password": password }, { headers: headers });
            };
        Object.defineProperty(SignalKClient.prototype, "connectionTimeout", {
            // ** get / set websocket connection timeout 3000<=timeout<=60000 **
            get: /**
             * @return {?}
             */ function () { return this._wsTimeout; },
            set: /**
             * @param {?} val
             * @return {?}
             */ function (val) {
                this._wsTimeout = (val < 3000) ? 3000 : (val > 60000) ? 60000 : val;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        SignalKClient.prototype.init = /**
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
                if (i0.isDevMode()) {
                    hostname = hostname || '192.168.99.100';
                    port = port || 3000;
                }
                else {
                    hostname = hostname || 'localhost';
                }
                this.hostname = hostname;
                if (useSSL) {
                    this.protocol = 'https';
                    this.wsProtocol = 'wss';
                    this.port = port || 443;
                }
                else {
                    this.protocol = 'http';
                    this.wsProtocol = 'ws';
                    this.port = port || 80;
                }
            };
        // ** Signal K server discovery request (/signalk).  
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @return {?}
         */
        SignalKClient.prototype.hello = /**
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
                this.init(hostname, port, useSSL);
                this.get('/loginStatus').subscribe(function (r) {
                    _this.server.authRequired = (r['authenticationRequired']) ? true : false;
                });
                return this.get('/signalk');
            };
        // ** connect to server
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @param {?=} subscribe
         * @return {?}
         */
        SignalKClient.prototype.connect = /**
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
                this.debug('Contacting Signal K server.........');
                this.hello(hostname, port).subscribe(// ** discover endpoints **
                // ** discover endpoints **
                function (// ** discover endpoints **
                response) {
                    _this.server.endpoints = (response['endpoints']) ? response['endpoints'] : {};
                    _this.server.info = (response['server']) ? response['server'] : {};
                    _this.server.apiVersions = (_this.server.endpoints) ? Object.keys(_this.server.endpoints) : [];
                    _this.debug(_this.server.endpoints);
                    /** @type {?} */
                    var url;
                    if (_this.server.endpoints[_this._version] && _this.server.endpoints[_this._version]['signalk-ws']) {
                        _this.debug("Connecting endpoint version: " + _this._version);
                        url = "" + _this.server.endpoints[_this._version]['signalk-ws'];
                    }
                    else if (_this.server.endpoints['v1'] && _this.server.endpoints['v1']['signalk-ws']) {
                        _this.debug("Connection falling back to: v1");
                        url = "" + _this.server.endpoints['v1']['signalk-ws'];
                    }
                    else {
                        _this._error.next(new Error('No Signal K endpoints found!'));
                        return;
                    }
                    // ** subscribe **
                    if (subscribe && ['self', 'all', 'none'].indexOf(subscribe) != -1) {
                        url += "?subscribe=" + subscribe;
                    }
                    if (_this._token) {
                        url += "&token=" + _this._token;
                    }
                    _this.debug("Connecting to " + url);
                    _this.connectDeltaByUrl(url);
                }, function (error) {
                    _this.server.endpoints = {};
                    _this.server.info = {};
                    _this.server.apiVersions = [];
                    return _this._error.next(error);
                });
            };
        // ** connect to delta stream with no endpoint discovery
        /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @param {?=} subscribe
         * @return {?}
         */
        SignalKClient.prototype.connectDelta = /**
         * @param {?=} hostname
         * @param {?=} port
         * @param {?=} useSSL
         * @param {?=} subscribe
         * @return {?}
         */
            function (hostname, port, useSSL, subscribe) {
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
                this.debug('ConnectDelta.........');
                this.init(hostname, port, useSSL);
                /** @type {?} */
                var url = this.wsProtocol + "://" + this.hostname + ":" + this.port + "/signalk/" + this._version + "/stream";
                // ** subscribe **
                if (subscribe && ['self', 'all', 'none'].indexOf(subscribe) != -1) {
                    url += "?subscribe=" + subscribe;
                }
                if (this._token) {
                    url += "&token=" + this._token;
                }
                this.debug("Connecting to delta stream at " + url);
                this.connectDeltaByUrl(url);
            };
        /**
         * @param {?} url
         * @return {?}
         */
        SignalKClient.prototype.connectDeltaByUrl = /**
         * @param {?} url
         * @return {?}
         */
            function (url) {
                var _this = this;
                if (this.server.authRequired && !this._token) {
                    this.debug('Auth Required and NO token available!');
                    this._error.next(new Error('Auth Required and NO token available!'));
                }
                if (this.ws) {
                    this.disconnect();
                }
                this.ws = new WebSocket(url);
                // ** start connection watchdog **
                setTimeout(function () {
                    if (_this.ws && (_this.ws.readyState != 1 && _this.ws.readyState != 3)) {
                        _this.debug("Connection watchdog expired (" + _this._wsTimeout / 1000 + " sec): " + _this.ws.readyState + "... aborting connection...");
                        _this.disconnect();
                    }
                }, this._wsTimeout);
                this.ws.onopen = function (e) { _this.debug("ws.open"); _this._connect.next(e); };
                this.ws.onclose = function (e) { _this.debug("ws.close"); _this._close.next(e); };
                this.ws.onerror = function (e) { _this.debug("ws.error"); _this._error.next(e); };
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
                        _this.server.ws.roles = data.roles;
                        _this.server.ws.self = data.self;
                    }
                    if (_this._filter && _this.isDelta(data)) {
                        if (data.context == _this._filter) {
                            _this._message.next(data);
                        }
                    }
                    else {
                        _this._message.next(data);
                    }
                };
            };
        // ** disconnect from Signal K stream
        /**
         * @return {?}
         */
        SignalKClient.prototype.disconnect = /**
         * @return {?}
         */
            function () {
                this.ws.close();
                this.ws = null;
                this.server.ws = { self: null, roles: {} };
            };
        // **************** STREAM API ***************************
        // ** send data to Signal K stream
        /**
         * @param {?} data
         * @return {?}
         */
        SignalKClient.prototype.send = /**
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
        // ** send value via delta stream update **
        /**
         * @param {?=} context
         * @param {?=} path
         * @param {?=} value
         * @return {?}
         */
        SignalKClient.prototype.sendUpdate = /**
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
                var val = {
                    context: (context == 'self') ? 'vessels.self' : context,
                    updates: [{
                            values: [{ path: path, value: value }]
                        }]
                };
                this.debug("sending update: " + JSON.stringify(val));
                this.send(val);
            };
        // ** Subscribe to Delta stream messages **
        /**
         * @param {?=} context
         * @param {?=} path
         * @param {...?} options
         * @return {?}
         */
        SignalKClient.prototype.subscribe = /**
         * @param {?=} context
         * @param {?=} path
         * @param {...?} options
         * @return {?}
         */
            function (context, path) {
                if (context === void 0) {
                    context = '*';
                }
                if (path === void 0) {
                    path = '*';
                }
                var options = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    options[_i - 2] = arguments[_i];
                }
                /** @type {?} */
                var data = {
                    context: (context == 'self') ? 'vessels.self' : context,
                    subscribe: []
                };
                /** @type {?} */
                var subscription = {};
                subscription['path'] = path;
                for (var i in options) {
                    switch (i) {
                        case '0':
                            if (!isNaN(options[i])) {
                                subscription['period'] = parseInt(options[i]);
                            }
                            break;
                        case '1':
                            if (options[i] == 'delta' || options[i] == 'full') {
                                subscription['format'] = options[i];
                            }
                            break;
                        case '2':
                            if (options[i] == 'instant' || options[i] == 'ideal'
                                || options[i] == 'fixed') {
                                subscription['policy'] = options[i];
                            }
                            break;
                        case '3':
                            if (subscription['policy'] == 'instant') {
                                if (!isNaN(options[i])) {
                                    subscription['minPeriod'] = parseInt(options[i]);
                                }
                            }
                            break;
                    }
                }
                data.subscribe.push(subscription);
                this.send(data);
            };
        // ** Unsubscribe from Delta stream messages **
        /**
         * @param {?=} context
         * @param {?=} path
         * @return {?}
         */
        SignalKClient.prototype.unsubscribe = /**
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
                context = (context == 'self') ? 'vessels.self' : context;
                this.send({
                    "context": context,
                    "unsubscribe": [{ "path": path }]
                });
            };
        // ** returns true if recieved message is a Delta message
        /**
         * @param {?} msg
         * @return {?}
         */
        SignalKClient.prototype.isDelta = /**
         * @param {?} msg
         * @return {?}
         */
            function (msg) { return typeof msg.context != 'undefined'; };
        // ** returns true if recieved message is a Hello message
        /**
         * @param {?} msg
         * @return {?}
         */
        SignalKClient.prototype.isHello = /**
         * @param {?} msg
         * @return {?}
         */
            function (msg) { return typeof msg.version != 'undefined'; };
        Object.defineProperty(SignalKClient.prototype, "filter", {
            // ** get / set filter to select delta messages just for supplied vessel id   
            get: /**
             * @return {?}
             */ function () { return this._filter; },
            // ** set filter= null to remove message filtering
            set: /**
             * @param {?} id
             * @return {?}
             */ function (id) {
                var _this = this;
                if (!id) {
                    // ** clear filter
                    this._filter = null;
                    return;
                }
                if (id.indexOf('self') != -1) {
                    // ** self
                    if (!this.server.ws.self) {
                        this.getSelfId().subscribe(function (id) { _this._filter = id; });
                    }
                    else {
                        this._filter = this.server.ws.self;
                    }
                }
                else {
                    /** @type {?} */
                    var uuid = RegExp("^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$");
                    if (id.indexOf('vessels.') != -1) {
                        id = id.slice(id.indexOf('.') + 1);
                    }
                    if (uuid.test(id)) {
                        this._filter = "vessels." + id;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        // ** Raise an alarm message **
        /**
         * @param {?=} context
         * @param {?=} alarmPath
         * @param {?=} alarm
         * @return {?}
         */
        SignalKClient.prototype.raiseAlarm = /**
         * @param {?=} context
         * @param {?=} alarmPath
         * @param {?=} alarm
         * @return {?}
         */
            function (context, alarmPath, alarm) {
                if (context === void 0) {
                    context = 'self';
                }
                this.sendUpdate(context, "notifications." + alarmPath, alarm);
            };
        // ** Clear alarm **
        /**
         * @param {?=} context
         * @param {?=} alarmPath
         * @return {?}
         */
        SignalKClient.prototype.clearAlarm = /**
         * @param {?=} context
         * @param {?=} alarmPath
         * @return {?}
         */
            function (context, alarmPath) {
                if (context === void 0) {
                    context = 'self';
                }
                this.sendUpdate(context, "notifications." + alarmPath, null);
            };
        // **************** HTTP API ***************************
        // ** Returns the contents of the Signal K tree pointed to by self
        /**
         * @return {?}
         */
        SignalKClient.prototype.getSelf = /**
         * @return {?}
         */
            function () { return this.apiGet("vessels/self"); };
        // ** Returns the self identity
        /**
         * @return {?}
         */
        SignalKClient.prototype.getSelfId = /**
         * @return {?}
         */
            function () { return this.apiGet("self"); };
        // ** return observable response for meta object at the specified context and path
        /**
         * @param {?} context
         * @param {?} path
         * @return {?}
         */
        SignalKClient.prototype.getMeta = /**
         * @param {?} context
         * @param {?} path
         * @return {?}
         */
            function (context, path) {
                return this.apiGet(this.contextToPath(context) + "/" + this.dotToSlash(path) + "/meta");
            };
        //** return observable response from http api path
        /**
         * @param {?} path
         * @return {?}
         */
        SignalKClient.prototype.apiGet = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                /** @type {?} */
                var url = this.resolveHttpEndpoint();
                if (!url) {
                    return;
                }
                if (path[0] == '/') {
                    path = path.slice(1);
                }
                url += this.dotToSlash(path);
                this.debug("apiGet " + url);
                if (this._token) {
                    /** @type {?} */
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.get(url, { headers: headers });
                }
                else {
                    if (this.server.authRequired) {
                        this.debug('Auth Required and NO token available!');
                        this._error.next(new Error('Auth Required and NO token available!'));
                    }
                    return this.http.get(url);
                }
            };
        //** Send value to http api path
        /**
         * @param {?} context
         * @param {?} path
         * @param {?} key
         * @param {?} value
         * @return {?}
         */
        SignalKClient.prototype.apiPut = /**
         * @param {?} context
         * @param {?} path
         * @param {?} key
         * @param {?} value
         * @return {?}
         */
            function (context, path, key, value) {
                /** @type {?} */
                var url = this.resolveHttpEndpoint();
                if (!url) {
                    return;
                }
                if (path[0] == '/') {
                    path = path.slice(1);
                }
                url += this.contextToPath(context) + '/' + this.dotToSlash(path);
                /** @type {?} */
                var msg = { value: {} };
                msg.value[key] = value;
                this.debug("apiPut " + url);
                this.debug(JSON.stringify(msg));
                if (this._token) {
                    /** @type {?} */
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.put(url, msg, { headers: headers });
                }
                else {
                    if (this.server.authRequired) {
                        this.debug('Auth Required and NO token available!');
                        this._error.next(new Error('Auth Required and NO token available!'));
                    }
                    return this.http.put(url, msg);
                }
            };
        //** return observable response from http path
        /**
         * @param {?} path
         * @return {?}
         */
        SignalKClient.prototype.get = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                /** @type {?} */
                var url = this.protocol + "://" + this.hostname + ":" + this.port + this.dotToSlash(path);
                this.debug("get " + url);
                if (this._token) {
                    /** @type {?} */
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.get(url, { headers: headers });
                }
                else {
                    if (this.server.authRequired) {
                        this.debug('Auth Required and NO token available!');
                        this._error.next(new Error('Auth Required and NO token available!'));
                    }
                    return this.http.get(url);
                }
            };
        /**
         * @return {?}
         */
        SignalKClient.prototype.resolveHttpEndpoint = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var url;
                if (this.server.endpoints[this._version]) {
                    // ** connection made
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
                    this._error.next(new Error(msg));
                }
                return url;
            };
        /**
         * @param {?} context
         * @return {?}
         */
        SignalKClient.prototype.contextToPath = /**
         * @param {?} context
         * @return {?}
         */
            function (context) {
                /** @type {?} */
                var res = (context == 'self') ? 'vessels.self' : context;
                return res.split('.').join('/');
            };
        /**
         * @param {?} path
         * @return {?}
         */
        SignalKClient.prototype.dotToSlash = /**
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
        /**
         * @param {?} path
         * @return {?}
         */
        SignalKClient.prototype.slashToDot = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                if (path.indexOf('/') != -1) {
                    return path.split('/').join('.');
                }
                else {
                    return path;
                }
            };
        SignalKClient.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        SignalKClient.ctorParameters = function () {
            return [
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ SignalKClient.ngInjectableDef = i0.defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.inject(i1.HttpClient)); }, token: SignalKClient, providedIn: "root" });
        return SignalKClient;
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
    var Alarm = (function () {
        function Alarm(message) {
            if (message === void 0) {
                message = null;
            }
            this.state = AlarmState.normal;
            this.method = [AlarmMethod.visual, AlarmMethod.sound];
            this.message = message;
        }
        return Alarm;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.SignalKClient = SignalKClient;
    exports.AlarmState = AlarmState;
    exports.AlarmMethod = AlarmMethod;
    exports.Alarm = Alarm;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuXG5cdHByaXZhdGUgX2Nvbm5lY3Q7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNvbm5lY3Q7XHQgXHRcdFxuXHRwcml2YXRlIF9jbG9zZTsgXHRcdFx0XG4gICAgcHVibGljIG9uQ2xvc2U7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfZXJyb3I7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkVycm9yO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX21lc3NhZ2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbk1lc3NhZ2U7XHQgXHRcdCAgXG4gICAgcHJpdmF0ZSB3czsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgd3NQcm90b2NvbDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0XG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwcml2YXRlIHNlcnZlcj0ge1xuICAgICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdLFxuICAgICAgICB3czogeyBzZWxmOiBudWxsLCByb2xlczoge30gfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU2lnbmFsIEsgQVBJIFZFUlNJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuXG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIGdldCBsaXN0IG9mIGFwaSB2ZXJzaW9ucyBzdXBwb3J0ZWQgYnkgc2VydmVyXG4gICAgZ2V0IGFwaVZlcnNpb25zKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OICAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIGlzIEF1dGggcmVxdWlyZWQgZm9yIHRoaXMgc2VydmVyICoqXG4gICAgZ2V0IGF1dGhSZXF1aXJlZCgpIHsgcmV0dXJuIHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCB9XG5cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH1cblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAzMDAwPD10aW1lb3V0PD02MDAwMCAqKlxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxuXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3dzVGltZW91dD0gKHZhbDwzMDAwKSA/IDMwMDAgOiAodmFsPjYwMDAwKSA/IDYwMDAwIDogdmFsO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBpbml0aWFsaXNlIGNsaWVudCBjb25uZWN0aW9uIHNldHRpbmdzXG4gICAgcHJpdmF0ZSBpbml0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICBpZihpc0Rldk1vZGUoKSkgeyBcbiAgICAgICAgICAgIGhvc3RuYW1lPSBob3N0bmFtZSB8fCAnMTkyLjE2OC45OS4xMDAnO1xuICAgICAgICAgICAgcG9ydD0gcG9ydCB8fCAzMDAwOyAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IGhvc3RuYW1lPSBob3N0bmFtZSB8fCAnbG9jYWxob3N0JyB9XG5cbiAgICAgICAgdGhpcy5ob3N0bmFtZSA9IGhvc3RuYW1lO1xuICAgICAgICBpZih1c2VTU0wpIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cHMnO1xuICAgICAgICAgICAgdGhpcy53c1Byb3RvY29sID0gJ3dzcyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDQ0MztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy53c1Byb3RvY29sID0gJ3dzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgODA7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqIFNpZ25hbCBLIHNlcnZlciBkaXNjb3ZlcnkgcmVxdWVzdCAoL3NpZ25hbGspLiAgXG4gICAgaGVsbG8oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgdGhpcy5nZXQoJy9sb2dpblN0YXR1cycpLnN1YnNjcmliZSggcj0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZD0oclsnYXV0aGVudGljYXRpb25SZXF1aXJlZCddKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCcvc2lnbmFsaycpO1xuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXJcbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQpLnN1YnNjcmliZSggICAgLy8gKiogZGlzY292ZXIgZW5kcG9pbnRzICoqXG4gICAgICAgICAgICByZXNwb25zZT0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0gKHJlc3BvbnNlWydzZXJ2ZXInXSkgPyByZXNwb25zZVsnc2VydmVyJ10gOiB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gKHRoaXMuc2VydmVyLmVuZHBvaW50cykgPyBPYmplY3Qua2V5cyh0aGlzLnNlcnZlci5lbmRwb2ludHMpIDogW107XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICBsZXQgdXJsO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIGVuZHBvaW50IHZlcnNpb246ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXSkgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBmYWxsaW5nIGJhY2sgdG86IHYxYCk7XG4gICAgICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ119YCBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KCBuZXcgRXJyb3IoJ05vIFNpZ25hbCBLIGVuZHBvaW50cyBmb3VuZCEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICoqIHN1YnNjcmliZSAqKlxuICAgICAgICAgICAgICAgIGlmKHN1YnNjcmliZSAmJiBbJ3NlbGYnLCdhbGwnLCdub25lJ10uaW5kZXhPZihzdWJzY3JpYmUpIT0tMSkgeyBcbiAgICAgICAgICAgICAgICAgICAgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfSAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gJHt1cmx9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmluZm89IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3IubmV4dCggZXJyb3IgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9ICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggbm8gZW5kcG9pbnQgZGlzY292ZXJ5XG4gICAgY29ubmVjdERlbHRhKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0Nvbm5lY3REZWx0YS4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMud3NQcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vc3RyZWFtYDtcbiAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgIGlmKHN1YnNjcmliZSAmJiBbJ3NlbGYnLCdhbGwnLCdub25lJ10uaW5kZXhPZihzdWJzY3JpYmUpIT0tMSkgeyBcbiAgICAgICAgICAgIHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YDtcbiAgICAgICAgfSBcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfVxuICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvIGRlbHRhIHN0cmVhbSBhdCAke3VybH1gKTtcbiAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgIH0gIFxuXG5cdC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIGF0IHByb3ZpZGVkIHVybFxuXHRwcml2YXRlIGNvbm5lY3REZWx0YUJ5VXJsKHVybCkge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQgJiYgIXRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLndzKSB7IHRoaXMuZGlzY29ubmVjdCgpIH1cbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxuICAgICAgICBzZXRUaW1lb3V0KCBcbiAgICAgICAgICAgICgpPT57XG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIHdhdGNoZG9nIGV4cGlyZWQgKCR7dGhpcy5fd3NUaW1lb3V0LzEwMDB9IHNlYyk6ICR7dGhpcy53cy5yZWFkeVN0YXRlfS4uLiBhYm9ydGluZyBjb25uZWN0aW9uLi4uYCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl93c1RpbWVvdXRcbiAgICAgICAgKTtcblx0XHRcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3Mub3BlbmApOyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3MuY2xvc2VgKTsgdGhpcy5fY2xvc2UubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5lcnJvcmApOyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnJvbGVzPSBkYXRhLnJvbGVzO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnNlbGY9IGRhdGEuc2VsZjtcbiAgICAgICAgICAgIH0gICAgICAgICAgXG5cdFx0XHRpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9XG5cdFx0fVxuICAgIH0gIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIFNpZ25hbCBLIHN0cmVhbVxuICAgIGRpc2Nvbm5lY3QoKSB7XG4gICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgdGhpcy53cz0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXJ2ZXIud3M9IHsgc2VsZjogbnVsbCwgcm9sZXM6IHt9IH07XG4gICAgfVxuXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIFNUUkVBTSBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXG4gICAgc2VuZChkYXRhOmFueSkge1xuICAgICAgICBpZih0aGlzLndzKSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKiogc2VuZCB2YWx1ZSB2aWEgZGVsdGEgc3RyZWFtIHVwZGF0ZSAqKlxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7XG4gICAgICAgIGxldCB2YWw9IHsgXG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHVwZGF0ZXM6IFsge1xuICAgICAgICAgICAgICAgIHZhbHVlczogW3sgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH1dIFxuICAgICAgICAgICAgfSBdIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVidWcoYHNlbmRpbmcgdXBkYXRlOiAke0pTT04uc3RyaW5naWZ5KHZhbCl9YCk7XG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xuICAgIH1cblxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicsIC4uLm9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGRhdGE9IHtcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxuICAgICAgICAgICAgc3Vic2NyaWJlOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb249IHt9O1xuICAgICAgICBzdWJzY3JpcHRpb25bJ3BhdGgnXT0gcGF0aDtcbiAgICAgICAgZm9yKGxldCBpIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHN3aXRjaChpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnMCc6IFxuICAgICAgICAgICAgICAgICAgICBpZiggIWlzTmFOKG9wdGlvbnNbaV0pICkgeyBzdWJzY3JpcHRpb25bJ3BlcmlvZCddPSBwYXJzZUludChvcHRpb25zW2ldKSB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzEnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdGlvbnNbaV09PSdkZWx0YScgfHwgb3B0aW9uc1tpXT09J2Z1bGwnKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uWydmb3JtYXQnXT0gb3B0aW9uc1tpXSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcyJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0naW5zdGFudCcgfHwgb3B0aW9uc1tpXT09J2lkZWFsJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvcHRpb25zW2ldPT0gJ2ZpeGVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uWydwb2xpY3knXT0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhazsgICAgIFxuICAgICAgICAgICAgICAgIGNhc2UgJzMnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uWydwb2xpY3knXT09J2luc3RhbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggIWlzTmFOKG9wdGlvbnNbaV0pICkgeyBzdWJzY3JpcHRpb25bJ21pblBlcmlvZCddPSBwYXJzZUludChvcHRpb25zW2ldKSB9IFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRhdGEuc3Vic2NyaWJlLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5zZW5kKGRhdGEpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcbiAgICB1bnN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nPScqJykge1xuICAgICAgICBjb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcbiAgICAgICAgdGhpcy5zZW5kKHtcbiAgICAgICAgICAgIFwiY29udGV4dFwiOiBjb250ZXh0LFxuICAgICAgICAgICAgXCJ1bnN1YnNjcmliZVwiOiBbIHtcInBhdGhcIjogcGF0aH0gXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIERlbHRhIG1lc3NhZ2VcbiAgICBpc0RlbHRhKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy5jb250ZXh0IT0gJ3VuZGVmaW5lZCcgfVxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiByZWNpZXZlZCBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxuICAgIGlzSGVsbG8obXNnKSB7IHJldHVybiB0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyB9XG5cblxuICAgIC8vICoqIGdldCAvIHNldCBmaWx0ZXIgdG8gc2VsZWN0IGRlbHRhIG1lc3NhZ2VzIGp1c3QgZm9yIHN1cHBsaWVkIHZlc3NlbCBpZCAgIFxuICAgIGdldCBmaWx0ZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XG4gICAgLy8gKiogc2V0IGZpbHRlcj0gbnVsbCB0byByZW1vdmUgbWVzc2FnZSBmaWx0ZXJpbmdcbiAgICBzZXQgZmlsdGVyKGlkOnN0cmluZykgeyBcbiAgICAgICAgaWYoIWlkKSB7ICAgLy8gKiogY2xlYXIgZmlsdGVyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXI9bnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiggaWQuaW5kZXhPZignc2VsZicpIT0tMSApIHsgIC8vICoqIHNlbGZcbiAgICAgICAgICAgIGlmKCF0aGlzLnNlcnZlci53cy5zZWxmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTZWxmSWQoKS5zdWJzY3JpYmUoIGlkPT4geyB0aGlzLl9maWx0ZXI9IGlkIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9maWx0ZXI9IHRoaXMuc2VydmVyLndzLnNlbGYgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAgLy8gKiogdXVpZFxuICAgICAgICAgICAgbGV0IHV1aWQ9IFJlZ0V4cChcIl51cm46bXJuOnNpZ25hbGs6dXVpZDpbMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzg5QUJhYl1bMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXsxMn0kXCIpXG4gICAgICAgICAgICBpZihpZC5pbmRleE9mKCd2ZXNzZWxzLicpIT0tMSkgeyBpZD0gaWQuc2xpY2UoaWQuaW5kZXhPZignLicpKzEpIH1cbiAgICAgICAgICAgIGlmKHV1aWQudGVzdChpZCkpIHsgdGhpcy5fZmlsdGVyPSBgdmVzc2Vscy4ke2lkfWAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKiogUmFpc2UgYW4gYWxhcm0gbWVzc2FnZSAqKlxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmc9J3NlbGYnLCBhbGFybVBhdGg6c3RyaW5nLCBhbGFybTpBbGFybSkge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgYG5vdGlmaWNhdGlvbnMuJHthbGFybVBhdGh9YCwgYWxhcm0pO1xuICAgIH1cblxuICAgIC8vICoqIENsZWFyIGFsYXJtICoqXG4gICAgY2xlYXJBbGFybShjb250ZXh0OnN0cmluZz0nc2VsZicsIGFsYXJtUGF0aDpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIGBub3RpZmljYXRpb25zLiR7YWxhcm1QYXRofWAsIG51bGwpO1xuICAgIH0gXG4gICAgICAgICAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogSFRUUCBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgXG4gICAgLy8gKiogUmV0dXJucyB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuYXBpR2V0KGB2ZXNzZWxzL3NlbGZgKSB9XG5cbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBzZWxmIGlkZW50aXR5XG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHNlbGZgKSB9XG5cbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIHJldHVybiB0aGlzLmFwaUdldChgJHt0aGlzLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7dGhpcy5kb3RUb1NsYXNoKHBhdGgpfS9tZXRhYCk7XG4gICAgfSAgICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIGFwaSBwYXRoXG4gICAgYXBpR2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuZG90VG9TbGFzaChwYXRoKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgYXBpR2V0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8qKiBTZW5kIHZhbHVlIHRvIGh0dHAgYXBpIHBhdGhcbiAgICBhcGlQdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk6YW55LCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgdXJsKz0gdGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpICsgJy8nICsgdGhpcy5kb3RUb1NsYXNoKHBhdGgpO1xuXG4gICAgICAgIGxldCBtc2cgPSB7IHZhbHVlOiB7fSB9IFxuICAgICAgICBtc2cudmFsdWVba2V5XT0gdmFsdWU7XG5cbiAgICAgICAgdGhpcy5kZWJ1ZyhgYXBpUHV0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmRlYnVnKEpTT04uc3RyaW5naWZ5KG1zZykpO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZyk7IFxuICAgICAgICB9XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBwYXRoXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgZ2V0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyAqKiByZXR1cm4gdXJsIGZvciBjb25uZWN0ZWQgc2lnbmFsay1odHRwIGVuZHBvaW50XG4gICAgcHJpdmF0ZSByZXNvbHZlSHR0cEVuZHBvaW50KCkge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0pIHsgLy8gKiogY29ubmVjdGlvbiBtYWRlXG4gICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIGh0dHAgZW5kcG9pbnQgYXQgcHJlc2NyaWJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXSkge1xuICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLWh0dHAnXX1gIH0gICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbXNnPSAnTm8gY3VycmVudCBjb25uZWN0aW9uIGh0dHAgZW5kcG9pbnQgc2VydmljZSEgVXNlIGNvbm5lY3QoKSB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uLidcbiAgICAgICAgICAgIHRoaXMuZGVidWcobXNnKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKG1zZykgKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHVybDsgICBcbiAgICB9XG5cbiAgICAvLyAqKiBwYXJzZSBjb250ZXh0IHRvIHZhbGlkIFNpZ25hbCBLIHBhdGhcbiAgICBwcml2YXRlIGNvbnRleHRUb1BhdGgoY29udGV4dDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IHJlcz0gKGNvbnRleHQ9PSdzZWxmJyApID8gJ3Zlc3NlbHMuc2VsZic6IGNvbnRleHQ7XG4gICAgICAgIHJldHVybiByZXMuc3BsaXQoJy4nKS5qb2luKCcvJyk7XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxuICAgIHByaXZhdGUgZG90VG9TbGFzaChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIHNsYXNoIG5vdGF0aW9uIHRvIGRvdFxuICAgIHByaXZhdGUgc2xhc2hUb0RvdChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy8nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJykuam9pbignLicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfSAgICBcblxufVxuXG4vLyAqKiBBbGFybSBzdGF0ZSAqKlxuZXhwb3J0IGVudW0gIEFsYXJtU3RhdGUge1xuICAgIG5vcm1hbD0nbm9ybWFsJyxcbiAgICBhbGVydD0nYWxlcnQnLFxuICAgIHdhcm49J3dhcm4nLFxuICAgIGFsYXJtPSdhbGFybScsXG4gICAgZW1lcmdlbmN5PSdlbWVyZ2VuY3knXG59XG5cbi8vICoqIEFsYXJtIE1ldGhvZCAqKlxuZXhwb3J0IGVudW0gIEFsYXJtTWV0aG9kIHtcbiAgICB2aXN1YWw9J3Zpc3VhbCcsXG4gICAgc291bmQ9J3NvdW5kJ1xufVxuXG4vLyAqKiBBbGFybSBjbGFzc1xuZXhwb3J0IGNsYXNzIEFsYXJtIHtcbiAgICBzdGF0ZTogQWxhcm1TdGF0ZT0gQWxhcm1TdGF0ZS5ub3JtYWw7XG4gICAgbWV0aG9kOiBBcnJheTxBbGFybU1ldGhvZD49IFtBbGFybU1ldGhvZC52aXN1YWwsIEFsYXJtTWV0aG9kLnNvdW5kXTtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOnN0cmluZz1udWxsKSB7IHRoaXMubWVzc2FnZT0gbWVzc2FnZSB9XG59XG5cblxuIl0sIm5hbWVzIjpbIlN1YmplY3QiLCJpc0Rldk1vZGUiLCJIdHRwSGVhZGVycyIsIkluamVjdGFibGUiLCJIdHRwQ2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUF3Q0ksdUJBQXFCLElBQWdCO1lBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7NEJBaEJYLElBQUk7MkJBQ2IsSUFBSTs4QkFDRCxLQUFLOzBCQUlUO2dCQUNaLFlBQVksRUFBRSxLQUFLO2dCQUNuQixTQUFTLEVBQUUsRUFBRTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixXQUFXLEVBQUUsRUFBRTtnQkFDZixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7YUFDaEM7WUFLRyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjs7Ozs7UUFaTyw2QkFB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