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
                return this.http.post(this.protocol + "://" + this.hostname + ":" + this.port + "/auth/login", { "username": username, "password": password }, { headers: headers });
            };
        // ** logout from server **
        /**
         * @return {?}
         */
        SignalKClient.prototype.logout = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var url = this.protocol + "://" + this.hostname + ":" + this.port + "/auth/logout";
                if (this._token) {
                    url += "&token=" + this._token;
                }
                return this.http.put(url, {});
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
                /*this.get('/loginStatus').subscribe( r=> {
                            this.server.authRequired=(r['authenticationRequired']) ? true : false;
                        })*/
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
                this.hello(hostname, port, useSSL).subscribe(// ** discover endpoints **
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
                    if (subscribe) {
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
                if (subscribe) {
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
                if (this.ws) {
                    this.ws.close();
                    this.ws = null;
                    this.server.ws = { self: null, roles: {} };
                }
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
        /**
         * @param {?} context
         * @param {?} path
         * @param {?=} key
         * @param {?=} value
         * @return {?}
         */
        SignalKClient.prototype.apiPut = /**
         * @param {?} context
         * @param {?} path
         * @param {?=} key
         * @param {?=} value
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
                if (typeof value == 'undefined') {
                    msg.value = key;
                }
                else {
                    msg.value[key] = value;
                }
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
        //** return observable response for put to http path
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        SignalKClient.prototype.put = /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
            function (path, value) {
                /** @type {?} */
                var url = this.protocol + "://" + this.hostname + ":" + this.port + this.dotToSlash(path);
                this.debug("put " + url);
                if (this._token) {
                    /** @type {?} */
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.put(url, { headers: headers });
                }
                else {
                    if (this.server.authRequired) {
                        this.debug('Auth Required and NO token available!');
                        this._error.next(new Error('Auth Required and NO token available!'));
                    }
                    return this.http.put(url, value);
                }
            };
        //** return observable response for post to http path
        /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
        SignalKClient.prototype.post = /**
         * @param {?} path
         * @param {?} value
         * @return {?}
         */
            function (path, value) {
                /** @type {?} */
                var url = this.protocol + "://" + this.hostname + ":" + this.port + this.dotToSlash(path);
                this.debug("post " + url);
                if (this._token) {
                    /** @type {?} */
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.post(url, { headers: headers });
                }
                else {
                    if (this.server.authRequired) {
                        this.debug('Auth Required and NO token available!');
                        this._error.next(new Error('Auth Required and NO token available!'));
                    }
                    return this.http.post(url, value);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuXG5cdHByaXZhdGUgX2Nvbm5lY3Q7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNvbm5lY3Q7XHQgXHRcdFxuXHRwcml2YXRlIF9jbG9zZTsgXHRcdFx0XG4gICAgcHVibGljIG9uQ2xvc2U7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfZXJyb3I7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkVycm9yO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX21lc3NhZ2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbk1lc3NhZ2U7XHQgXHRcdCAgXG4gICAgcHJpdmF0ZSB3czsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgd3NQcm90b2NvbDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0XG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwcml2YXRlIHNlcnZlcj0ge1xuICAgICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdLFxuICAgICAgICB3czogeyBzZWxmOiBudWxsLCByb2xlczoge30gfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU2lnbmFsIEsgQVBJIFZFUlNJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuXG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIGdldCBsaXN0IG9mIGFwaSB2ZXJzaW9ucyBzdXBwb3J0ZWQgYnkgc2VydmVyXG4gICAgZ2V0IGFwaVZlcnNpb25zKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OICAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIGlzIEF1dGggcmVxdWlyZWQgZm9yIHRoaXMgc2VydmVyICoqXG4gICAgZ2V0IGF1dGhSZXF1aXJlZCgpIHsgcmV0dXJuIHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCB9XG5cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH1cblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L2F1dGgvbG9naW5gLFxuICAgICAgICAgICAgeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICB7IGhlYWRlcnMgfVxuICAgICAgICApO1xuICAgIH1cblx0XG4gICAgLy8gKiogbG9nb3V0IGZyb20gc2VydmVyICoqXG4gICAgbG9nb3V0KCkge1xuXHRcdGxldCB1cmw9YCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9hdXRoL2xvZ291dGA7XG5cdFx0aWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfSAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KFxuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAge31cbiAgICAgICAgKTtcbiAgICB9XHRcblxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XG5cbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGluaXRpYWxpc2UgY2xpZW50IGNvbm5lY3Rpb24gc2V0dGluZ3NcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIGlmKGlzRGV2TW9kZSgpKSB7IFxuICAgICAgICAgICAgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICcxOTIuMTY4Ljk5LjEwMCc7XG4gICAgICAgICAgICBwb3J0PSBwb3J0IHx8IDMwMDA7ICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICdsb2NhbGhvc3QnIH1cblxuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3NzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICAvKnRoaXMuZ2V0KCcvbG9naW5TdGF0dXMnKS5zdWJzY3JpYmUoIHI9PiB7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQ9KHJbJ2F1dGhlbnRpY2F0aW9uUmVxdWlyZWQnXSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0pKi9cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCcvc2lnbmFsaycpO1xuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXJcbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgIHJlc3BvbnNlPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2VbJ3NlcnZlciddKSA/IHJlc3BvbnNlWydzZXJ2ZXInXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKHRoaXMuc2VydmVyLmVuZHBvaW50cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQoIG5ldyBFcnJvcignTm8gU2lnbmFsIEsgZW5kcG9pbnRzIGZvdW5kIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgICAgICAgICAgaWYoc3Vic2NyaWJlKSB7IHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHVybCs9IGAmdG9rZW49JHt0aGlzLl90b2tlbn1gIH0gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvICR7dXJsfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gW107ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yLm5leHQoIGVycm9yICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSB3aXRoIG5vIGVuZHBvaW50IGRpc2NvdmVyeVxuICAgIGNvbm5lY3REZWx0YShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICB0aGlzLmRlYnVnKCdDb25uZWN0RGVsdGEuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLndzUHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L3N0cmVhbWA7XG4gICAgICAgIC8vICoqIHN1YnNjcmliZSAqKlxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHVybCs9IGAmdG9rZW49JHt0aGlzLl90b2tlbn1gIH1cbiAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byBkZWx0YSBzdHJlYW0gYXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICB9ICBcblxuXHQvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSBhdCBwcm92aWRlZCB1cmxcblx0cHJpdmF0ZSBjb25uZWN0RGVsdGFCeVVybCh1cmwpIHtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkICYmICF0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy53cykgeyB0aGlzLmRpc2Nvbm5lY3QoKSB9XG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgICAgIC8vICoqIHN0YXJ0IGNvbm5lY3Rpb24gd2F0Y2hkb2cgKipcbiAgICAgICAgc2V0VGltZW91dCggXG4gICAgICAgICAgICAoKT0+e1xuICAgICAgICAgICAgICAgIGlmKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTsgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcy5fd3NUaW1lb3V0XG4gICAgICAgICk7XG5cdFx0XG5cdFx0dGhpcy53cy5vbm9wZW49IGU9PiB7IHRoaXMuZGVidWcoYHdzLm9wZW5gKTsgdGhpcy5fY29ubmVjdC5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9uY2xvc2U9IGU9PiB7IHRoaXMuZGVidWcoYHdzLmNsb3NlYCk7IHRoaXMuX2Nsb3NlLm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3MuZXJyb3JgKTsgdGhpcy5fZXJyb3IubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbm1lc3NhZ2U9IGU9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsgZGF0YT0gSlNPTi5wYXJzZShlLmRhdGEpIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7IHJldHVybiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLmlzSGVsbG8oZGF0YSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci53cy5yb2xlcz0gZGF0YS5yb2xlcztcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci53cy5zZWxmPSBkYXRhLnNlbGY7XG4gICAgICAgICAgICB9ICAgICAgICAgIFxuXHRcdFx0aWYodGhpcy5fZmlsdGVyICYmIHRoaXMuaXNEZWx0YShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGlmKGRhdGEuY29udGV4dD09IHRoaXMuX2ZpbHRlcikgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfVxuXHRcdH1cbiAgICB9ICBcblxuICAgIC8vICoqIGRpc2Nvbm5lY3QgZnJvbSBTaWduYWwgSyBzdHJlYW1cbiAgICBkaXNjb25uZWN0KCkge1xuICAgICAgICBpZih0aGlzLndzKSB7XG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLndzPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3M9IHsgc2VsZjogbnVsbCwgcm9sZXM6IHt9IH07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU1RSRUFNIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cbiAgICBzZW5kKGRhdGE6YW55KSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKiBzZW5kIHZhbHVlIHZpYSBkZWx0YSBzdHJlYW0gdXBkYXRlICoqXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgbGV0IHZhbD0geyBcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxuICAgICAgICAgICAgdXBkYXRlczogWyB7XG4gICAgICAgICAgICAgICAgdmFsdWVzOiBbeyBwYXRoOiBwYXRoLCB2YWx1ZTogdmFsdWUgfV0gXG4gICAgICAgICAgICB9IF0gXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWJ1Zyhgc2VuZGluZyB1cGRhdGU6ICR7SlNPTi5zdHJpbmdpZnkodmFsKX1gKTtcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7XG4gICAgfVxuXG4gICAgLy8gKiogU3Vic2NyaWJlIHRvIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nPScqJywgLi4ub3B0aW9ucykge1xuICAgICAgICBsZXQgZGF0YT0ge1xuICAgICAgICAgICAgY29udGV4dDogKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQsXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbj0ge307XG4gICAgICAgIHN1YnNjcmlwdGlvblsncGF0aCddPSBwYXRoO1xuICAgICAgICBmb3IobGV0IGkgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgc3dpdGNoKGkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcwJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCAhaXNOYU4ob3B0aW9uc1tpXSkgKSB7IHN1YnNjcmlwdGlvblsncGVyaW9kJ109IHBhcnNlSW50KG9wdGlvbnNbaV0pIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMSc6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2RlbHRhJyB8fCBvcHRpb25zW2ldPT0nZnVsbCcpIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25bJ2Zvcm1hdCddPSBvcHRpb25zW2ldIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzInOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdGlvbnNbaV09PSdpbnN0YW50JyB8fCBvcHRpb25zW2ldPT0naWRlYWwnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdGlvbnNbaV09PSAnZml4ZWQnICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25bJ3BvbGljeSddPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICAgXG4gICAgICAgICAgICAgICAgY2FzZSAnMyc6IFxuICAgICAgICAgICAgICAgICAgICBpZihzdWJzY3JpcHRpb25bJ3BvbGljeSddPT0naW5zdGFudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhaXNOYU4ob3B0aW9uc1tpXSkgKSB7IHN1YnNjcmlwdGlvblsnbWluUGVyaW9kJ109IHBhcnNlSW50KG9wdGlvbnNbaV0pIH0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5zdWJzY3JpYmUucHVzaChzdWJzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLnNlbmQoZGF0YSk7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKiBVbnN1YnNjcmliZSBmcm9tIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonKSB7XG4gICAgICAgIGNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xuICAgICAgICB0aGlzLnNlbmQoe1xuICAgICAgICAgICAgXCJjb250ZXh0XCI6IGNvbnRleHQsXG4gICAgICAgICAgICBcInVuc3Vic2NyaWJlXCI6IFsge1wicGF0aFwiOiBwYXRofSBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiByZWNpZXZlZCBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxuICAgIGlzRGVsdGEobXNnKSB7IHJldHVybiB0eXBlb2YgbXNnLmNvbnRleHQhPSAndW5kZWZpbmVkJyB9XG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBIZWxsbyBtZXNzYWdlXG4gICAgaXNIZWxsbyhtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cudmVyc2lvbiE9ICd1bmRlZmluZWQnIH1cblxuXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXG4gICAgZ2V0IGZpbHRlcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmlsdGVyIH1cbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xuICAgIHNldCBmaWx0ZXIoaWQ6c3RyaW5nKSB7IFxuICAgICAgICBpZighaWQpIHsgICAvLyAqKiBjbGVhciBmaWx0ZXJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj1udWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKCBpZC5pbmRleE9mKCdzZWxmJykhPS0xICkgeyAgLy8gKiogc2VsZlxuICAgICAgICAgICAgaWYoIXRoaXMuc2VydmVyLndzLnNlbGYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlbGZJZCgpLnN1YnNjcmliZSggaWQ9PiB7IHRoaXMuX2ZpbHRlcj0gaWQgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gdGhpcy5zZXJ2ZXIud3Muc2VsZiB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7ICAvLyAqKiB1dWlkXG4gICAgICAgICAgICBsZXQgdXVpZD0gUmVnRXhwKFwiXnVybjptcm46c2lnbmFsazp1dWlkOlswLTlBLUZhLWZdezh9LVswLTlBLUZhLWZdezR9LTRbMC05QS1GYS1mXXszfS1bODlBQmFiXVswLTlBLUZhLWZdezN9LVswLTlBLUZhLWZdezEyfSRcIilcbiAgICAgICAgICAgIGlmKGlkLmluZGV4T2YoJ3Zlc3NlbHMuJykhPS0xKSB7IGlkPSBpZC5zbGljZShpZC5pbmRleE9mKCcuJykrMSkgfVxuICAgICAgICAgICAgaWYodXVpZC50ZXN0KGlkKSkgeyB0aGlzLl9maWx0ZXI9IGB2ZXNzZWxzLiR7aWR9YCB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKiBSYWlzZSBhbiBhbGFybSBtZXNzYWdlICoqXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZz0nc2VsZicsIGFsYXJtUGF0aDpzdHJpbmcsIGFsYXJtOkFsYXJtKSB7XG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBgbm90aWZpY2F0aW9ucy4ke2FsYXJtUGF0aH1gLCBhbGFybSk7XG4gICAgfVxuXG4gICAgLy8gKiogQ2xlYXIgYWxhcm0gKipcbiAgICBjbGVhckFsYXJtKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgYWxhcm1QYXRoOnN0cmluZykge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgYG5vdGlmaWNhdGlvbnMuJHthbGFybVBhdGh9YCwgbnVsbCk7XG4gICAgfSBcbiAgICAgICAgICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBIVFRQIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBcbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGZcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHZlc3NlbHMvc2VsZmApIH1cblxuICAgIC8vICoqIFJldHVybnMgdGhlIHNlbGYgaWRlbnRpdHlcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmFwaUdldChgc2VsZmApIH1cblxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpR2V0KGAke3RoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9L21ldGFgKTtcbiAgICB9ICAgIFxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgYXBpIHBhdGhcbiAgICBhcGlHZXQocGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgdXJsKz0gdGhpcy5kb3RUb1NsYXNoKHBhdGgpO1xuICAgICAgICB0aGlzLmRlYnVnKGBhcGlHZXQgJHt1cmx9YCk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyoqIFNlbmQgdmFsdWUgdG8gaHR0cCBhcGkgcGF0aFxuXHRhcGlQdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xuXHRhcGlQdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk6YW55LCB2YWx1ZTphbnkpO1xuXHRcbiAgICBhcGlQdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk/OmFueSwgdmFsdWU/OmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxuICAgICAgICB1cmwrPSB0aGlzLmNvbnRleHRUb1BhdGgoY29udGV4dCkgKyAnLycgKyB0aGlzLmRvdFRvU2xhc2gocGF0aCk7XG5cbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZT09J3VuZGVmaW5lZCcpIHsgbXNnLnZhbHVlPSBrZXkgfVxuXHRcdGVsc2UgeyBtc2cudmFsdWVba2V5XT0gdmFsdWUgfVxuXG4gICAgICAgIHRoaXMuZGVidWcoYGFwaVB1dCAke3VybH1gKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyhKU09OLnN0cmluZ2lmeShtc2cpKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2cpOyBcbiAgICAgICAgfVxuICAgIH0gICAgXG4gICAgXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7dGhpcy5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfTsgIFxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcHV0IHRvIGh0dHAgcGF0aFxuICAgIHB1dChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcHV0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfTtcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHBvc3QgdG8gaHR0cCBwYXRoXG4gICAgcG9zdChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcG9zdCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfTsgICAgXG5cbiAgICAvLyAqKiByZXR1cm4gdXJsIGZvciBjb25uZWN0ZWQgc2lnbmFsay1odHRwIGVuZHBvaW50XG4gICAgcHJpdmF0ZSByZXNvbHZlSHR0cEVuZHBvaW50KCkge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0pIHsgLy8gKiogY29ubmVjdGlvbiBtYWRlXG4gICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIGh0dHAgZW5kcG9pbnQgYXQgcHJlc2NyaWJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXSkge1xuICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLWh0dHAnXX1gIH0gICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbXNnPSAnTm8gY3VycmVudCBjb25uZWN0aW9uIGh0dHAgZW5kcG9pbnQgc2VydmljZSEgVXNlIGNvbm5lY3QoKSB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uLidcbiAgICAgICAgICAgIHRoaXMuZGVidWcobXNnKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKG1zZykgKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHVybDsgICBcbiAgICB9XG5cbiAgICAvLyAqKiBwYXJzZSBjb250ZXh0IHRvIHZhbGlkIFNpZ25hbCBLIHBhdGhcbiAgICBwcml2YXRlIGNvbnRleHRUb1BhdGgoY29udGV4dDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IHJlcz0gKGNvbnRleHQ9PSdzZWxmJyApID8gJ3Zlc3NlbHMuc2VsZic6IGNvbnRleHQ7XG4gICAgICAgIHJldHVybiByZXMuc3BsaXQoJy4nKS5qb2luKCcvJyk7XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxuICAgIHByaXZhdGUgZG90VG9TbGFzaChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIHNsYXNoIG5vdGF0aW9uIHRvIGRvdFxuICAgIHByaXZhdGUgc2xhc2hUb0RvdChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy8nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJykuam9pbignLicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfSAgICBcblxufVxuXG4vLyAqKiBBbGFybSBzdGF0ZSAqKlxuZXhwb3J0IGVudW0gIEFsYXJtU3RhdGUge1xuICAgIG5vcm1hbD0nbm9ybWFsJyxcbiAgICBhbGVydD0nYWxlcnQnLFxuICAgIHdhcm49J3dhcm4nLFxuICAgIGFsYXJtPSdhbGFybScsXG4gICAgZW1lcmdlbmN5PSdlbWVyZ2VuY3knXG59XG5cbi8vICoqIEFsYXJtIE1ldGhvZCAqKlxuZXhwb3J0IGVudW0gIEFsYXJtTWV0aG9kIHtcbiAgICB2aXN1YWw9J3Zpc3VhbCcsXG4gICAgc291bmQ9J3NvdW5kJ1xufVxuXG4vLyAqKiBBbGFybSBjbGFzc1xuZXhwb3J0IGNsYXNzIEFsYXJtIHtcbiAgICBzdGF0ZTogQWxhcm1TdGF0ZT0gQWxhcm1TdGF0ZS5ub3JtYWw7XG4gICAgbWV0aG9kOiBBcnJheTxBbGFybU1ldGhvZD49IFtBbGFybU1ldGhvZC52aXN1YWwsIEFsYXJtTWV0aG9kLnNvdW5kXTtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOnN0cmluZz1udWxsKSB7IHRoaXMubWVzc2FnZT0gbWVzc2FnZSB9XG59XG5cblxuIl0sIm5hbWVzIjpbIlN1YmplY3QiLCJpc0Rldk1vZGUiLCJIdHRwSGVhZGVycyIsIkluamVjdGFibGUiLCJIdHRwQ2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUF3Q0ksdUJBQXFCLElBQWdCO1lBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7NEJBaEJYLElBQUk7MkJBQ2IsSUFBSTs4QkFDRCxLQUFLOzBCQUlUO2dCQUNaLFlBQVksRUFBRSxLQUFLO2dCQUNuQixTQUFTLEVBQUUsRUFBRTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixXQUFXLEVBQUUsRUFBRTtnQkFDZixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7YUFDaEM7WUFLRyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUlBLFlBQU8sRUFBVSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM3QyxJQUFJ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