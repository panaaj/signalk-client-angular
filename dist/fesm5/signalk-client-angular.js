import { Injectable, isDevMode, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SignalKClient = /** @class */ (function () {
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
        this._connect = new Subject();
        this.onConnect = this._connect.asObservable();
        this._close = new Subject();
        this.onClose = this._close.asObservable();
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
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
    function (val) { if (isDevMode()) {
        console.log(val);
    } };
    Object.defineProperty(SignalKClient.prototype, "version", {
        // **************** Signal K API VERSION ***************************
        // ** get / set Signal K preferred api version to use **
        get: /**
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
    Object.defineProperty(SignalKClient.prototype, "apiVersions", {
        // ** get list of api versions supported by server
        get: /**
         * @return {?}
         */
        function () { return this.server.apiVersions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalKClient.prototype, "authRequired", {
        // **************** CONNECTION  ***************************
        // ** is Auth required for this server **
        get: /**
         * @return {?}
         */
        function () { return this.server.authRequired; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalKClient.prototype, "authToken", {
        // ** set auth token value **
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) { this._token = val; },
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
        var headers = new HttpHeaders().set('Content-Type', "application/json");
        return this.http.post(this.protocol + "://" + this.hostname + ":" + this.port + "/login", { "username": username, "password": password }, { headers: headers });
    };
    Object.defineProperty(SignalKClient.prototype, "connectionTimeout", {
        // ** get / set websocket connection timeout 3000<=timeout<=60000 **
        get: /**
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
        if (hostname === void 0) { hostname = null; }
        if (port === void 0) { port = null; }
        if (useSSL === void 0) { useSSL = false; }
        if (isDevMode()) {
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
        if (hostname === void 0) { hostname = null; }
        if (port === void 0) { port = null; }
        if (useSSL === void 0) { useSSL = false; }
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
        if (hostname === void 0) { hostname = null; }
        if (port === void 0) { port = null; }
        if (useSSL === void 0) { useSSL = false; }
        if (subscribe === void 0) { subscribe = null; }
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
        if (hostname === void 0) { hostname = null; }
        if (port === void 0) { port = null; }
        if (useSSL === void 0) { useSSL = false; }
        if (subscribe === void 0) { subscribe = null; }
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
        if (context === void 0) { context = 'self'; }
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
        if (context === void 0) { context = '*'; }
        if (path === void 0) { path = '*'; }
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
        if (context === void 0) { context = '*'; }
        if (path === void 0) { path = '*'; }
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
         */
        function () { return this._filter; },
        // ** set filter= null to remove message filtering
        set: /**
         * @param {?} id
         * @return {?}
         */
        function (id) {
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
        if (context === void 0) { context = 'self'; }
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
        if (context === void 0) { context = 'self'; }
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    SignalKClient.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ SignalKClient.ngInjectableDef = defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(inject(HttpClient)); }, token: SignalKClient, providedIn: "root" });
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
var Alarm = /** @class */ (function () {
    function Alarm(message) {
        if (message === void 0) { message = null; }
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

export { SignalKClient, AlarmState, AlarmMethod, Alarm };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG5cblx0cHJpdmF0ZSBfY29ubmVjdDsgXHRcdFx0XG4gICAgcHVibGljIG9uQ29ubmVjdDtcdCBcdFx0XG5cdHByaXZhdGUgX2Nsb3NlOyBcdFx0XHRcbiAgICBwdWJsaWMgb25DbG9zZTtcdCBcdFx0ICAgIFxuXHRwcml2YXRlIF9lcnJvcjsgXHRcdFx0XG4gICAgcHVibGljIG9uRXJyb3I7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfbWVzc2FnZTsgXHRcdFx0XG4gICAgcHVibGljIG9uTWVzc2FnZTtcdCBcdFx0ICBcbiAgICBwcml2YXRlIHdzOyAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSB3c1Byb3RvY29sOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF92ZXJzaW9uOiBzdHJpbmc9ICd2MSc7ICAgICAgLy8gKiogZGVmYXVsdCBTaWduYWwgSyBhcGkgdmVyc2lvblxuICAgIHByaXZhdGUgX2ZpbHRlcj0gbnVsbDsgICAgICAgICAgICAgICAvLyAqKiBpZCBvZiB2ZXNzZWwgdG8gZmlsdGVyIGRlbHRhIG1lc3NhZ2VzXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXRcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHByaXZhdGUgc2VydmVyPSB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW10sXG4gICAgICAgIHdzOiB7IHNlbGY6IG51bGwsIHJvbGVzOiB7fSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG5cbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyBcbiAgICAgICAgdGhpcy5fY29ubmVjdD0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uQ29ubmVjdD0gdGhpcy5fY29ubmVjdC5hc09ic2VydmFibGUoKTsgICBcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNsb3NlPSB0aGlzLl9jbG9zZS5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBTaWduYWwgSyBBUEkgVkVSU0lPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG5cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogZ2V0IGxpc3Qgb2YgYXBpIHZlcnNpb25zIHN1cHBvcnRlZCBieSBzZXJ2ZXJcbiAgICBnZXQgYXBpVmVyc2lvbnMoKSB7IHJldHVybiB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucyB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIENPTk5FQ1RJT04gICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogaXMgQXV0aCByZXF1aXJlZCBmb3IgdGhpcyBzZXJ2ZXIgKipcbiAgICBnZXQgYXV0aFJlcXVpcmVkKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkIH1cblxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfVxuXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsIGBhcHBsaWNhdGlvbi9qc29uYCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vbG9naW5gLFxuICAgICAgICAgICAgeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICB7IGhlYWRlcnMgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XG5cbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGluaXRpYWxpc2UgY2xpZW50IGNvbm5lY3Rpb24gc2V0dGluZ3NcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIGlmKGlzRGV2TW9kZSgpKSB7IFxuICAgICAgICAgICAgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICcxOTIuMTY4Ljk5LjEwMCc7XG4gICAgICAgICAgICBwb3J0PSBwb3J0IHx8IDMwMDA7ICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICdsb2NhbGhvc3QnIH1cblxuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3NzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICB0aGlzLmdldCgnL2xvZ2luU3RhdHVzJykuc3Vic2NyaWJlKCByPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkPShyWydhdXRoZW50aWNhdGlvblJlcXVpcmVkJ10pID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlclxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgIHJlc3BvbnNlPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2VbJ3NlcnZlciddKSA/IHJlc3BvbnNlWydzZXJ2ZXInXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKHRoaXMuc2VydmVyLmVuZHBvaW50cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQoIG5ldyBFcnJvcignTm8gU2lnbmFsIEsgZW5kcG9pbnRzIGZvdW5kIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgICAgICAgICAgaWYoc3Vic2NyaWJlICYmIFsnc2VsZicsJ2FsbCcsJ25vbmUnXS5pbmRleE9mKHN1YnNjcmliZSkhPS0xKSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWA7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byAke3VybH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvci5uZXh0KCBlcnJvciApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCBubyBlbmRwb2ludCBkaXNjb3ZlcnlcbiAgICBjb25uZWN0RGVsdGEoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29ubmVjdERlbHRhLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy53c1Byb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9zdHJlYW1gO1xuICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgaWYoc3Vic2NyaWJlICYmIFsnc2VsZicsJ2FsbCcsJ25vbmUnXS5pbmRleE9mKHN1YnNjcmliZSkhPS0xKSB7IFxuICAgICAgICAgICAgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gO1xuICAgICAgICB9IFxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9XG4gICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gZGVsdGEgc3RyZWFtIGF0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgfSAgXG5cblx0Ly8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gYXQgcHJvdmlkZWQgdXJsXG5cdHByaXZhdGUgY29ubmVjdERlbHRhQnlVcmwodXJsKSB7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCAmJiAhdGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMud3MpIHsgdGhpcy5kaXNjb25uZWN0KCkgfVxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICAvLyAqKiBzdGFydCBjb25uZWN0aW9uIHdhdGNoZG9nICoqXG4gICAgICAgIHNldFRpbWVvdXQoIFxuICAgICAgICAgICAgKCk9PntcbiAgICAgICAgICAgICAgICBpZih0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gd2F0Y2hkb2cgZXhwaXJlZCAoJHt0aGlzLl93c1RpbWVvdXQvMTAwMH0gc2VjKTogJHt0aGlzLndzLnJlYWR5U3RhdGV9Li4uIGFib3J0aW5nIGNvbm5lY3Rpb24uLi5gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxuICAgICAgICApO1xuXHRcdFxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5vcGVuYCk7IHRoaXMuX2Nvbm5lY3QubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5jbG9zZWApOyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9uZXJyb3I9IGU9PiB7IHRoaXMuZGVidWcoYHdzLmVycm9yYCk7IHRoaXMuX2Vycm9yLm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25tZXNzYWdlPSBlPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBpZih0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XG4gICAgICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Mucm9sZXM9IGRhdGEucm9sZXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Muc2VsZj0gZGF0YS5zZWxmO1xuICAgICAgICAgICAgfSAgICAgICAgICBcblx0XHRcdGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH1cblx0XHR9XG4gICAgfSAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gU2lnbmFsIEsgc3RyZWFtXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xuICAgICAgICB0aGlzLndzPSBudWxsO1xuICAgICAgICB0aGlzLnNlcnZlci53cz0geyBzZWxmOiBudWxsLCByb2xlczoge30gfTtcbiAgICB9XG5cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU1RSRUFNIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cbiAgICBzZW5kKGRhdGE6YW55KSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKiBzZW5kIHZhbHVlIHZpYSBkZWx0YSBzdHJlYW0gdXBkYXRlICoqXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgbGV0IHZhbD0geyBcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxuICAgICAgICAgICAgdXBkYXRlczogWyB7XG4gICAgICAgICAgICAgICAgdmFsdWVzOiBbeyBwYXRoOiBwYXRoLCB2YWx1ZTogdmFsdWUgfV0gXG4gICAgICAgICAgICB9IF0gXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWJ1Zyhgc2VuZGluZyB1cGRhdGU6ICR7SlNPTi5zdHJpbmdpZnkodmFsKX1gKTtcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7XG4gICAgfVxuXG4gICAgLy8gKiogU3Vic2NyaWJlIHRvIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nPScqJywgLi4ub3B0aW9ucykge1xuICAgICAgICBsZXQgZGF0YT0ge1xuICAgICAgICAgICAgY29udGV4dDogKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQsXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbj0ge307XG4gICAgICAgIHN1YnNjcmlwdGlvblsncGF0aCddPSBwYXRoO1xuICAgICAgICBmb3IobGV0IGkgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgc3dpdGNoKGkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcwJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCAhaXNOYU4ob3B0aW9uc1tpXSkgKSB7IHN1YnNjcmlwdGlvblsncGVyaW9kJ109IHBhcnNlSW50KG9wdGlvbnNbaV0pIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMSc6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2RlbHRhJyB8fCBvcHRpb25zW2ldPT0nZnVsbCcpIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25bJ2Zvcm1hdCddPSBvcHRpb25zW2ldIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzInOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdGlvbnNbaV09PSdpbnN0YW50JyB8fCBvcHRpb25zW2ldPT0naWRlYWwnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdGlvbnNbaV09PSAnZml4ZWQnICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25bJ3BvbGljeSddPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICAgXG4gICAgICAgICAgICAgICAgY2FzZSAnMyc6IFxuICAgICAgICAgICAgICAgICAgICBpZihzdWJzY3JpcHRpb25bJ3BvbGljeSddPT0naW5zdGFudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhaXNOYU4ob3B0aW9uc1tpXSkgKSB7IHN1YnNjcmlwdGlvblsnbWluUGVyaW9kJ109IHBhcnNlSW50KG9wdGlvbnNbaV0pIH0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5zdWJzY3JpYmUucHVzaChzdWJzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLnNlbmQoZGF0YSk7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKiBVbnN1YnNjcmliZSBmcm9tIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonKSB7XG4gICAgICAgIGNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xuICAgICAgICB0aGlzLnNlbmQoe1xuICAgICAgICAgICAgXCJjb250ZXh0XCI6IGNvbnRleHQsXG4gICAgICAgICAgICBcInVuc3Vic2NyaWJlXCI6IFsge1wicGF0aFwiOiBwYXRofSBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiByZWNpZXZlZCBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxuICAgIGlzRGVsdGEobXNnKSB7IHJldHVybiB0eXBlb2YgbXNnLmNvbnRleHQhPSAndW5kZWZpbmVkJyB9XG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBIZWxsbyBtZXNzYWdlXG4gICAgaXNIZWxsbyhtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cudmVyc2lvbiE9ICd1bmRlZmluZWQnIH1cblxuXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXG4gICAgZ2V0IGZpbHRlcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmlsdGVyIH1cbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xuICAgIHNldCBmaWx0ZXIoaWQ6c3RyaW5nKSB7IFxuICAgICAgICBpZighaWQpIHsgICAvLyAqKiBjbGVhciBmaWx0ZXJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj1udWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKCBpZC5pbmRleE9mKCdzZWxmJykhPS0xICkgeyAgLy8gKiogc2VsZlxuICAgICAgICAgICAgaWYoIXRoaXMuc2VydmVyLndzLnNlbGYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlbGZJZCgpLnN1YnNjcmliZSggaWQ9PiB7IHRoaXMuX2ZpbHRlcj0gaWQgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gdGhpcy5zZXJ2ZXIud3Muc2VsZiB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7ICAvLyAqKiB1dWlkXG4gICAgICAgICAgICBsZXQgdXVpZD0gUmVnRXhwKFwiXnVybjptcm46c2lnbmFsazp1dWlkOlswLTlBLUZhLWZdezh9LVswLTlBLUZhLWZdezR9LTRbMC05QS1GYS1mXXszfS1bODlBQmFiXVswLTlBLUZhLWZdezN9LVswLTlBLUZhLWZdezEyfSRcIilcbiAgICAgICAgICAgIGlmKGlkLmluZGV4T2YoJ3Zlc3NlbHMuJykhPS0xKSB7IGlkPSBpZC5zbGljZShpZC5pbmRleE9mKCcuJykrMSkgfVxuICAgICAgICAgICAgaWYodXVpZC50ZXN0KGlkKSkgeyB0aGlzLl9maWx0ZXI9IGB2ZXNzZWxzLiR7aWR9YCB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKiBSYWlzZSBhbiBhbGFybSBtZXNzYWdlICoqXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZz0nc2VsZicsIGFsYXJtUGF0aDpzdHJpbmcsIGFsYXJtOkFsYXJtKSB7XG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBgbm90aWZpY2F0aW9ucy4ke2FsYXJtUGF0aH1gLCBhbGFybSk7XG4gICAgfVxuXG4gICAgLy8gKiogQ2xlYXIgYWxhcm0gKipcbiAgICBjbGVhckFsYXJtKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgYWxhcm1QYXRoOnN0cmluZykge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgYG5vdGlmaWNhdGlvbnMuJHthbGFybVBhdGh9YCwgbnVsbCk7XG4gICAgfSBcbiAgICAgICAgICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBIVFRQIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBcbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGZcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHZlc3NlbHMvc2VsZmApIH1cblxuICAgIC8vICoqIFJldHVybnMgdGhlIHNlbGYgaWRlbnRpdHlcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmFwaUdldChgc2VsZmApIH1cblxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpR2V0KGAke3RoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9L21ldGFgKTtcbiAgICB9ICAgIFxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgYXBpIHBhdGhcbiAgICBhcGlHZXQocGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgdXJsKz0gdGhpcy5kb3RUb1NsYXNoKHBhdGgpO1xuICAgICAgICB0aGlzLmRlYnVnKGBhcGlHZXQgJHt1cmx9YCk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyoqIFNlbmQgdmFsdWUgdG8gaHR0cCBhcGkgcGF0aFxuICAgIGFwaVB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxuICAgICAgICB1cmwrPSB0aGlzLmNvbnRleHRUb1BhdGgoY29udGV4dCkgKyAnLycgKyB0aGlzLmRvdFRvU2xhc2gocGF0aCk7XG5cbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXG4gICAgICAgIG1zZy52YWx1ZVtrZXldPSB2YWx1ZTtcblxuICAgICAgICB0aGlzLmRlYnVnKGBhcGlQdXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuZGVidWcoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKTsgXG4gICAgICAgIH1cbiAgICB9ICAgIFxuICAgIFxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIHBhdGhcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke3RoaXMuZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBnZXQgJHt1cmx9YCk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vICoqIHJldHVybiB1cmwgZm9yIGNvbm5lY3RlZCBzaWduYWxrLWh0dHAgZW5kcG9pbnRcbiAgICBwcml2YXRlIHJlc29sdmVIdHRwRW5kcG9pbnQoKSB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSkgeyAvLyAqKiBjb25uZWN0aW9uIG1hZGVcbiAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gaHR0cCBlbmRwb2ludCBhdCBwcmVzY3JpYmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddKSB7XG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstaHR0cCddfWAgfSAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtc2c9ICdObyBjdXJyZW50IGNvbm5lY3Rpb24gaHR0cCBlbmRwb2ludCBzZXJ2aWNlISBVc2UgY29ubmVjdCgpIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uJ1xuICAgICAgICAgICAgdGhpcy5kZWJ1Zyhtc2cpO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IobXNnKSApO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdXJsOyAgIFxuICAgIH1cblxuICAgIC8vICoqIHBhcnNlIGNvbnRleHQgdG8gdmFsaWQgU2lnbmFsIEsgcGF0aFxuICAgIHByaXZhdGUgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZykge1xuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcbiAgICAgICAgcmV0dXJuIHJlcy5zcGxpdCgnLicpLmpvaW4oJy8nKTtcbiAgICB9XG5cbiAgICAvLyAqKiB0cmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIHNsYXNoXG4gICAgcHJpdmF0ZSBkb3RUb1NsYXNoKHBhdGg6c3RyaW5nKSB7XG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLicpIT0tMSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5qb2luKCcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cbiAgICB9XG5cbiAgICAvLyAqKiB0cmFuc2Zvcm0gc2xhc2ggbm90YXRpb24gdG8gZG90XG4gICAgcHJpdmF0ZSBzbGFzaFRvRG90KHBhdGg6c3RyaW5nKSB7XG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLycpIT0tMSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKS5qb2luKCcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cbiAgICB9ICAgIFxuXG59XG5cbi8vICoqIEFsYXJtIHN0YXRlICoqXG5leHBvcnQgZW51bSAgQWxhcm1TdGF0ZSB7XG4gICAgbm9ybWFsPSdub3JtYWwnLFxuICAgIGFsZXJ0PSdhbGVydCcsXG4gICAgd2Fybj0nd2FybicsXG4gICAgYWxhcm09J2FsYXJtJyxcbiAgICBlbWVyZ2VuY3k9J2VtZXJnZW5jeSdcbn1cblxuLy8gKiogQWxhcm0gTWV0aG9kICoqXG5leHBvcnQgZW51bSAgQWxhcm1NZXRob2Qge1xuICAgIHZpc3VhbD0ndmlzdWFsJyxcbiAgICBzb3VuZD0nc291bmQnXG59XG5cbi8vICoqIEFsYXJtIGNsYXNzXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xuICAgIHN0YXRlOiBBbGFybVN0YXRlPSBBbGFybVN0YXRlLm5vcm1hbDtcbiAgICBtZXRob2Q6IEFycmF5PEFsYXJtTWV0aG9kPj0gW0FsYXJtTWV0aG9kLnZpc3VhbCwgQWxhcm1NZXRob2Quc291bmRdO1xuICAgIG1lc3NhZ2U6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nPW51bGwpIHsgdGhpcy5tZXNzYWdlPSBtZXNzYWdlIH1cbn1cblxuXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtJQXdDSSx1QkFBcUIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTt3QkFoQlgsSUFBSTt1QkFDYixJQUFJOzBCQUNELEtBQUs7c0JBSVQ7WUFDWixZQUFZLEVBQUUsS0FBSztZQUNuQixTQUFTLEVBQUUsRUFBRTtZQUNiLElBQUksRUFBRSxFQUFFO1lBQ1IsV0FBVyxFQUFFLEVBQUU7WUFDZixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7U0FDaEM7UUFLRyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNmOzs7OztJQVpPLDZCQUFLOzs7O2NBQUMsR0FBUSxJQUFJLElBQUcsU0FBUyxFQUFFLEVBQUM7UUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxD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