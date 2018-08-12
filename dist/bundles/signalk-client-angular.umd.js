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
        Object.defineProperty(SignalKClient.prototype, "authToken", {
            // **************** CONNECTION  ***************************
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
                this.ws.onopen = function (e) {
                    _this.debug("ws.open");
                    _this._connect.next(e);
                };
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
                this.debug("sending update: " + path + "= " + value + ")");
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
        // ** Clear notification / alarm **
        /*clearAlarm(context:string='self', alarmPath:string) {
            this.sendUpdate(context, `notifications.${alarmPath}`, null);
        }
        
        // ** Set notification / alarm **
        setAlarm(context:string='self', alarmPath:string, value:Alarm) {
        let meta.zones= [
                {"upper": 4, "state": "alarm", "message": "Stopped or very slow"},
                {"lower": 4, "upper": 60, "state": "normal"},
                {"lower": 60, "upper": 65, "state": "warn", "message": "Approaching maximum"},
                {"lower": 65, "state": "alarm", "message": "Exceeding maximum"}
              ]
        }*/
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
                return this.apiGet(this.contextToPath(context) + "/" + path.split('.').join('/') + "/meta");
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
                url += path;
                this.debug("apiGet " + url);
                if (this._token) {
                    /** @type {?} */
                    var headers = new i1.HttpHeaders({ 'Authorization': "JWT " + this._token });
                    return this.http.get(url, { headers: headers });
                }
                else {
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
                url += this.contextToPath(context) + '/' + path;
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
                    return this.http.put(url, msg);
                }
            };
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
                var url = this.protocol + "://" + this.hostname + ":" + this.port + path;
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
    var Alarm = (function () {
        function Alarm() {
            this.upper = null;
            this.lower = null;
            this.state = null;
            this.message = null;
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
    exports.Alarm = Alarm;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL3NpZ25hbGstY2xpZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuXG5cdHByaXZhdGUgX2Nvbm5lY3Q7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNvbm5lY3Q7XHQgXHRcdFxuXHRwcml2YXRlIF9jbG9zZTsgXHRcdFx0XG4gICAgcHVibGljIG9uQ2xvc2U7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfZXJyb3I7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkVycm9yO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX21lc3NhZ2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbk1lc3NhZ2U7XHQgXHRcdCAgXG4gICAgcHJpdmF0ZSB3czsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgd3NQcm90b2NvbDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0XG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwcml2YXRlIHNlcnZlcj0ge1xuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdLFxuICAgICAgICB3czogeyBzZWxmOiBudWxsLCByb2xlczoge30gfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU2lnbmFsIEsgQVBJIFZFUlNJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuXG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OICAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfVxuXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsIGBhcHBsaWNhdGlvbi9qc29uYCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vbG9naW5gLFxuICAgICAgICAgICAgeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICB7IGhlYWRlcnMgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XG5cbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGluaXRpYWxpc2UgY2xpZW50IGNvbm5lY3Rpb24gc2V0dGluZ3NcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIGlmKGlzRGV2TW9kZSgpKSB7IFxuICAgICAgICAgICAgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICcxOTIuMTY4Ljk5LjEwMCc7XG4gICAgICAgICAgICBwb3J0PSBwb3J0IHx8IDMwMDA7ICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICdsb2NhbGhvc3QnIH1cblxuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3NzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlclxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgIHJlc3BvbnNlPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2VbJ3NlcnZlciddKSA/IHJlc3BvbnNlWydzZXJ2ZXInXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKHRoaXMuc2VydmVyLmVuZHBvaW50cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQoIG5ldyBFcnJvcignTm8gU2lnbmFsIEsgZW5kcG9pbnRzIGZvdW5kIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgICAgICAgICAgaWYoc3Vic2NyaWJlICYmIFsnc2VsZicsJ2FsbCcsJ25vbmUnXS5pbmRleE9mKHN1YnNjcmliZSkhPS0xKSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWA7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byAke3VybH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvci5uZXh0KCBlcnJvciApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCBubyBlbmRwb2ludCBkaXNjb3ZlcnlcbiAgICBjb25uZWN0RGVsdGEoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29ubmVjdERlbHRhLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy53c1Byb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9zdHJlYW1gO1xuICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgaWYoc3Vic2NyaWJlICYmIFsnc2VsZicsJ2FsbCcsJ25vbmUnXS5pbmRleE9mKHN1YnNjcmliZSkhPS0xKSB7IFxuICAgICAgICAgICAgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gO1xuICAgICAgICB9IFxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9XG4gICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gZGVsdGEgc3RyZWFtIGF0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgfSAgXG5cblx0Ly8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gYXQgcHJvdmlkZWQgdXJsXG5cdHByaXZhdGUgY29ubmVjdERlbHRhQnlVcmwodXJsKSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHsgdGhpcy5kaXNjb25uZWN0KCkgfVxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICAvLyAqKiBzdGFydCBjb25uZWN0aW9uIHdhdGNoZG9nICoqXG4gICAgICAgIHNldFRpbWVvdXQoIFxuICAgICAgICAgICAgKCk9PntcbiAgICAgICAgICAgICAgICBpZih0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gd2F0Y2hkb2cgZXhwaXJlZCAoJHt0aGlzLl93c1RpbWVvdXQvMTAwMH0gc2VjKTogJHt0aGlzLndzLnJlYWR5U3RhdGV9Li4uIGFib3J0aW5nIGNvbm5lY3Rpb24uLi5gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxuICAgICAgICApO1xuXHRcdFxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyBcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYHdzLm9wZW5gKTtcblx0XHRcdHRoaXMuX2Nvbm5lY3QubmV4dChlKTtcblx0XHR9XG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5jbG9zZWApOyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9uZXJyb3I9IGU9PiB7IHRoaXMuZGVidWcoYHdzLmVycm9yYCk7IHRoaXMuX2Vycm9yLm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25tZXNzYWdlPSBlPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBpZih0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XG4gICAgICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Mucm9sZXM9IGRhdGEucm9sZXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Muc2VsZj0gZGF0YS5zZWxmO1xuICAgICAgICAgICAgfSAgICAgICAgICBcblx0XHRcdGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH1cblx0XHR9XG4gICAgfSAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gU2lnbmFsIEsgc3RyZWFtXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xuICAgICAgICB0aGlzLndzPSBudWxsO1xuICAgICAgICB0aGlzLnNlcnZlci53cz0geyBzZWxmOiBudWxsLCByb2xlczoge30gfTtcbiAgICB9XG5cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU1RSRUFNIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cbiAgICBzZW5kKGRhdGE6YW55KSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKiBzZW5kIHZhbHVlIHZpYSBkZWx0YSBzdHJlYW0gdXBkYXRlICoqXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgbGV0IHZhbD0geyBcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxuICAgICAgICAgICAgdXBkYXRlczogWyB7XG4gICAgICAgICAgICAgICAgdmFsdWVzOiBbeyBwYXRoOiBwYXRoLCB2YWx1ZTogdmFsdWUgfV0gXG4gICAgICAgICAgICB9IF0gXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWJ1Zyhgc2VuZGluZyB1cGRhdGU6ICR7cGF0aH09ICR7dmFsdWV9KWApO1xuICAgICAgICB0aGlzLnNlbmQodmFsKTtcbiAgICB9XG5cbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonLCAuLi5vcHRpb25zKSB7XG4gICAgICAgIGxldCBkYXRhPSB7XG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHN1YnNjcmliZTogW11cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uPSB7fTtcbiAgICAgICAgc3Vic2NyaXB0aW9uWydwYXRoJ109IHBhdGg7XG4gICAgICAgIGZvcihsZXQgaSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBzd2l0Y2goaSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJzAnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydwZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcxJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0nZGVsdGEnIHx8IG9wdGlvbnNbaV09PSdmdWxsJykgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsnZm9ybWF0J109IG9wdGlvbnNbaV0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMic6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbaV09PSdpZGVhbCcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1tpXT09ICdmaXhlZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsncG9saWN5J109IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgICBcbiAgICAgICAgICAgICAgICBjYXNlICczJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblsncG9saWN5J109PSdpbnN0YW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydtaW5QZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhLnN1YnNjcmliZS5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuc2VuZChkYXRhKTsgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicpIHtcbiAgICAgICAgY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuc2VuZCh7XG4gICAgICAgICAgICBcImNvbnRleHRcIjogY29udGV4dCxcbiAgICAgICAgICAgIFwidW5zdWJzY3JpYmVcIjogWyB7XCJwYXRoXCI6IHBhdGh9IF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXG4gICAgaXNEZWx0YShtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcbiAgICBpc0hlbGxvKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgfVxuXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcbiAgICBnZXQgZmlsdGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCFpZCkgeyAgIC8vICoqIGNsZWFyIGZpbHRlclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPW51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXG4gICAgICAgICAgICBpZighdGhpcy5zZXJ2ZXIud3Muc2VsZikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VsZklkKCkuc3Vic2NyaWJlKCBpZD0+IHsgdGhpcy5fZmlsdGVyPSBpZCB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSB0aGlzLnNlcnZlci53cy5zZWxmIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgIC8vICoqIHV1aWRcbiAgICAgICAgICAgIGxldCB1dWlkPSBSZWdFeHAoXCJedXJuOm1ybjpzaWduYWxrOnV1aWQ6WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVs4OUFCYWJdWzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17MTJ9JFwiKVxuICAgICAgICAgICAgaWYoaWQuaW5kZXhPZigndmVzc2Vscy4nKSE9LTEpIHsgaWQ9IGlkLnNsaWNlKGlkLmluZGV4T2YoJy4nKSsxKSB9XG4gICAgICAgICAgICBpZih1dWlkLnRlc3QoaWQpKSB7IHRoaXMuX2ZpbHRlcj0gYHZlc3NlbHMuJHtpZH1gIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIENsZWFyIG5vdGlmaWNhdGlvbiAvIGFsYXJtICoqXG4gICAgLypjbGVhckFsYXJtKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgYWxhcm1QYXRoOnN0cmluZykge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgYG5vdGlmaWNhdGlvbnMuJHthbGFybVBhdGh9YCwgbnVsbCk7XG4gICAgfSBcbiAgICBcbiAgICAvLyAqKiBTZXQgbm90aWZpY2F0aW9uIC8gYWxhcm0gKipcbiAgICBzZXRBbGFybShjb250ZXh0OnN0cmluZz0nc2VsZicsIGFsYXJtUGF0aDpzdHJpbmcsIHZhbHVlOkFsYXJtKSB7XG4gICAgbGV0IG1ldGEuem9uZXM9IFtcbiAgICAgICAgICAgIHtcInVwcGVyXCI6IDQsIFwic3RhdGVcIjogXCJhbGFybVwiLCBcIm1lc3NhZ2VcIjogXCJTdG9wcGVkIG9yIHZlcnkgc2xvd1wifSxcbiAgICAgICAgICAgIHtcImxvd2VyXCI6IDQsIFwidXBwZXJcIjogNjAsIFwic3RhdGVcIjogXCJub3JtYWxcIn0sXG4gICAgICAgICAgICB7XCJsb3dlclwiOiA2MCwgXCJ1cHBlclwiOiA2NSwgXCJzdGF0ZVwiOiBcIndhcm5cIiwgXCJtZXNzYWdlXCI6IFwiQXBwcm9hY2hpbmcgbWF4aW11bVwifSxcbiAgICAgICAgICAgIHtcImxvd2VyXCI6IDY1LCBcInN0YXRlXCI6IFwiYWxhcm1cIiwgXCJtZXNzYWdlXCI6IFwiRXhjZWVkaW5nIG1heGltdW1cIn1cbiAgICAgICAgICBdXG4gICAgfSovXG4gICAgICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBIVFRQIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBcbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGZcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHZlc3NlbHMvc2VsZmApIH1cblxuICAgIC8vICoqIFJldHVybnMgdGhlIHNlbGYgaWRlbnRpdHlcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmFwaUdldChgc2VsZmApIH1cblxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpR2V0KGAke3RoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHtwYXRoLnNwbGl0KCcuJykuam9pbignLycpfS9tZXRhYCk7XG4gICAgfSAgICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIGFwaSBwYXRoXG4gICAgYXBpR2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHBhdGg7XG4gICAgICAgIHRoaXMuZGVidWcoYGFwaUdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxuICAgIH1cblxuICAgIC8vKiogU2VuZCB2YWx1ZSB0byBodHRwIGFwaSBwYXRoXG4gICAgYXBpUHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KSArICcvJyArIHBhdGg7XG5cbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXG4gICAgICAgIG1zZy52YWx1ZVtrZXldPSB2YWx1ZTtcblxuICAgICAgICB0aGlzLmRlYnVnKGBhcGlQdXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuZGVidWcoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZykgfVxuICAgIH0gICAgXG4gICAgXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIHByaXZhdGUgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtwYXRofWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfSAgICAgICAgXG4gICAgfTsgIFxuXG4gICAgLy8gKiogcmV0dXJuIHVybCBmb3IgY29ubmVjdGVkIHNpZ25hbGstaHR0cCBlbmRwb2ludFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpIHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcihtc2cpICk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfVxuXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXG4gICAgcHJpdmF0ZSBjb250ZXh0VG9QYXRoKGNvbnRleHQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCByZXM9IChjb250ZXh0PT0nc2VsZicgKSA/ICd2ZXNzZWxzLnNlbGYnOiBjb250ZXh0O1xuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgIH1cblxufVxuXG5cbi8vICoqIFNpZ25hbCBLIEFsYXJtIGNsYXNzXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xuICAgIHVwcGVyOiBudW1iZXI9IG51bGw7ICAgIC8vICoqIHVwcGVyIGxpbWl0IHZhbHVlXG4gICAgbG93ZXI6IG51bWJlcj0gbnVsbDsgICAgLy8gKiogbG93ZXIgbGltaXQgdmFsdWVcbiAgICBzdGF0ZTogc3RyaW5nPSBudWxsOyAgICAgIC8vICoqIFsnd2FybicsICdhbGFybSddXG4gICAgbWVzc2FnZTogc3RyaW5nPSBudWxsOyAgLy8gKiogbWVzc2FnZSB0ZXh0XG59XG5cblxuIl0sIm5hbWVzIjpbIlN1YmplY3QiLCJpc0Rldk1vZGUiLCJIdHRwSGVhZGVycyIsIkluamVjdGFibGUiLCJIdHRwQ2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUF1Q0ksdUJBQXFCLElBQWdCO1lBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7NEJBZlgsSUFBSTsyQkFDYixJQUFJOzhCQUNELEtBQUs7MEJBSVQ7Z0JBQ1osU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLEVBQUU7Z0JBQ2YsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO2FBQ2hDO1lBS0csSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJQSxZQUFPLEVBQVUsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJQSxZQUFPLEVBQVUsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJQSxZQUFPLEVBQVUsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJQSxZQUFPLEVBQVUsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFD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