/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
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
    ;
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
    /** @nocollapse */ SignalKClient.ngInjectableDef = i0.defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.inject(i1.HttpClient)); }, token: SignalKClient, providedIn: "root" });
    return SignalKClient;
}());
export { SignalKClient };
if (false) {
    /** @type {?} */
    SignalKClient.prototype._connect;
    /** @type {?} */
    SignalKClient.prototype.onConnect;
    /** @type {?} */
    SignalKClient.prototype._close;
    /** @type {?} */
    SignalKClient.prototype.onClose;
    /** @type {?} */
    SignalKClient.prototype._error;
    /** @type {?} */
    SignalKClient.prototype.onError;
    /** @type {?} */
    SignalKClient.prototype._message;
    /** @type {?} */
    SignalKClient.prototype.onMessage;
    /** @type {?} */
    SignalKClient.prototype.ws;
    /** @type {?} */
    SignalKClient.prototype.hostname;
    /** @type {?} */
    SignalKClient.prototype.port;
    /** @type {?} */
    SignalKClient.prototype.protocol;
    /** @type {?} */
    SignalKClient.prototype.wsProtocol;
    /** @type {?} */
    SignalKClient.prototype._version;
    /** @type {?} */
    SignalKClient.prototype._filter;
    /** @type {?} */
    SignalKClient.prototype._wsTimeout;
    /** @type {?} */
    SignalKClient.prototype._token;
    /** @type {?} */
    SignalKClient.prototype.server;
    /** @type {?} */
    SignalKClient.prototype.http;
}
/** @enum {string} */
var AlarmState = {
    normal: 'normal',
    alert: 'alert',
    warn: 'warn',
    alarm: 'alarm',
    emergency: 'emergency',
};
export { AlarmState };
/** @enum {string} */
var AlarmMethod = {
    visual: 'visual',
    sound: 'sound',
};
export { AlarmMethod };
var Alarm = /** @class */ (function () {
    function Alarm(message) {
        if (message === void 0) { message = null; }
        this.state = AlarmState.normal;
        this.method = [AlarmMethod.visual, AlarmMethod.sound];
        this.message = message;
    }
    return Alarm;
}());
export { Alarm };
if (false) {
    /** @type {?} */
    Alarm.prototype.state;
    /** @type {?} */
    Alarm.prototype.method;
    /** @type {?} */
    Alarm.prototype.message;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7Ozs7SUFzQ3ZDLHVCQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO3dCQWhCWCxJQUFJO3VCQUNiLElBQUk7MEJBQ0QsS0FBSztzQkFJVDtZQUNaLFlBQVksRUFBRSxLQUFLO1lBQ25CLFNBQVMsRUFBRSxFQUFFO1lBQ2IsSUFBSSxFQUFFLEVBQUU7WUFDUixXQUFXLEVBQUUsRUFBRTtZQUNmLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtTQUNoQztRQUtHLElBQUksQ0FBQyxRQUFRLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2Y7Ozs7O0lBWk8sNkJBQUs7Ozs7Y0FBQyxHQUFRLElBQUksRUFBRSxDQUFBLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQSxDQUFDO1FBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUFFO0lBaUI3RCxzQkFBSSxrQ0FBTztRQUhYLG9FQUFvRTtRQUVwRSx3REFBd0Q7Ozs7UUFDeEQsY0FBdUIsTUFBTSxDQUFDLFFBQVEsQ0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFBLEVBQUU7Ozs7O1FBRWxFLFVBQVksR0FBVzs7WUFDbkIsSUFBSSxDQUFDLEdBQVMsR0FBRyxHQUFFLEdBQUcsQ0FBQztZQUN2QixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRSxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsa0NBQWdDLENBQUcsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxLQUFLLENBQUMsdUNBQXFDLENBQUMsa0JBQWEsSUFBSSxDQUFDLFFBQVUsQ0FBQyxDQUFDO2FBQ2xGO1NBQ0o7OztPQVppRTtJQWNsRSxzQkFBSSxzQ0FBVztRQURmLGtEQUFrRDs7OztRQUNsRCxjQUFvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUEsRUFBRTs7O09BQUE7SUFLcEQsc0JBQUksdUNBQVk7UUFIaEIsMkRBQTJEO1FBRTNELHlDQUF5Qzs7OztRQUN6QyxjQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUEsRUFBRTs7O09BQUE7SUFHdEQsc0JBQUksb0NBQVM7UUFEYiw2QkFBNkI7Ozs7O1FBQzdCLFVBQWMsR0FBVSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUUsR0FBRyxDQUFBLEVBQUU7OztPQUFBO0lBRTlDLGlEQUFpRDs7Ozs7O0lBQ2pELDZCQUFLOzs7OztJQUFMLFVBQU0sUUFBZSxFQUFFLFFBQWU7O1FBQ2xDLElBQUksT0FBTyxHQUFFLElBQUksV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDZCxJQUFJLENBQUMsUUFBUSxXQUFNLElBQUksQ0FBQyxRQUFRLFNBQUksSUFBSSxDQUFDLElBQUksV0FBUSxFQUN4RCxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUM5QyxFQUFFLE9BQU8sU0FBQSxFQUFFLENBQ2QsQ0FBQztLQUNMO0lBR0Qsc0JBQUksNENBQWlCO1FBRHJCLG9FQUFvRTs7OztRQUNwRSxjQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQSxFQUFFOzs7OztRQUV6RCxVQUFzQixHQUFXO1lBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUUsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1NBQ2xFOzs7T0FKd0Q7Ozs7Ozs7SUFPakQsNEJBQUk7Ozs7OztjQUFDLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQjtRQUE1RCx5QkFBQSxFQUFBLGVBQW9CO1FBQUUscUJBQUEsRUFBQSxXQUFnQjtRQUFFLHVCQUFBLEVBQUEsY0FBb0I7UUFDckUsRUFBRSxDQUFBLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2IsUUFBUSxHQUFFLFFBQVEsSUFBSSxnQkFBZ0IsQ0FBQztZQUN2QyxJQUFJLEdBQUUsSUFBSSxJQUFJLElBQUksQ0FBQztTQUN0QjtRQUNELElBQUksQ0FBQyxDQUFDO1lBQUMsUUFBUSxHQUFFLFFBQVEsSUFBSSxXQUFXLENBQUE7U0FBRTtRQUUxQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztZQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7U0FDMUI7O0lBR0wscURBQXFEOzs7Ozs7O0lBQ3JELDZCQUFLOzs7Ozs7SUFBTCxVQUFNLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQjtRQUFsRSxpQkFNQztRQU5LLHlCQUFBLEVBQUEsZUFBb0I7UUFBRSxxQkFBQSxFQUFBLFdBQWdCO1FBQUUsdUJBQUEsRUFBQSxjQUFvQjtRQUM5RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLENBQUUsVUFBQSxDQUFDO1lBQ2pDLEtBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDekUsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDL0I7SUFFRCx1QkFBdUI7Ozs7Ozs7O0lBQ3ZCLCtCQUFPOzs7Ozs7O0lBQVAsVUFBUSxRQUFvQixFQUFFLElBQWdCLEVBQUUsTUFBb0IsRUFBRSxTQUFxQjtRQUEzRixpQkFzQ0M7UUF0Q08seUJBQUEsRUFBQSxlQUFvQjtRQUFFLHFCQUFBLEVBQUEsV0FBZ0I7UUFBRSx1QkFBQSxFQUFBLGNBQW9CO1FBQUUsMEJBQUEsRUFBQSxnQkFBcUI7UUFDdkYsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBSywyQkFBMkI7O1FBQ2hFLFVBRHFDLDJCQUEyQjtRQUNoRSxRQUFRO1lBQ0osS0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDakUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUUsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMzRixLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7O1lBR2xDLElBQUksR0FBRyxDQUFDO1lBQ1IsRUFBRSxDQUFBLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVGLEtBQUksQ0FBQyxLQUFLLENBQUMsa0NBQWdDLEtBQUksQ0FBQyxRQUFVLENBQUMsQ0FBQztnQkFDNUQsR0FBRyxHQUFFLEtBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBRyxDQUFDO2FBQ2hFO1lBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0UsS0FBSSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO2dCQUM3QyxHQUFHLEdBQUUsS0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUcsQ0FBQTthQUN0RDtZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUUsQ0FBQztnQkFDOUQsTUFBTSxDQUFDO2FBQ1Y7O1lBRUQsRUFBRSxDQUFBLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLElBQUUsZ0JBQWMsU0FBVyxDQUFDO2FBQ2xDO1lBQ0QsRUFBRSxDQUFBLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQUMsR0FBRyxJQUFHLFlBQVUsS0FBSSxDQUFDLE1BQVEsQ0FBQTthQUFFO1lBQ2pELEtBQUksQ0FBQyxLQUFLLENBQUMsbUJBQWlCLEdBQUssQ0FBQyxDQUFDO1lBQ25DLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMvQixFQUNELFVBQUEsS0FBSztZQUNELEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFFLEVBQUUsQ0FBQztZQUMxQixLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRSxFQUFFLENBQUM7WUFDckIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUUsRUFBRSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUUsQ0FBQztTQUNwQyxDQUNKLENBQUM7S0FDTDtJQUVELHdEQUF3RDs7Ozs7Ozs7SUFDeEQsb0NBQVk7Ozs7Ozs7SUFBWixVQUFhLFFBQW9CLEVBQUUsSUFBZ0IsRUFBRSxNQUFvQixFQUFFLFNBQXFCO1FBQW5GLHlCQUFBLEVBQUEsZUFBb0I7UUFBRSxxQkFBQSxFQUFBLFdBQWdCO1FBQUUsdUJBQUEsRUFBQSxjQUFvQjtRQUFFLDBCQUFBLEVBQUEsZ0JBQXFCO1FBQzVGLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7O1FBQ2xDLElBQUksR0FBRyxHQUFLLElBQUksQ0FBQyxVQUFVLFdBQU0sSUFBSSxDQUFDLFFBQVEsU0FBSSxJQUFJLENBQUMsSUFBSSxpQkFBWSxJQUFJLENBQUMsUUFBUSxZQUFTLENBQUM7O1FBRTlGLEVBQUUsQ0FBQSxDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxHQUFHLElBQUUsZ0JBQWMsU0FBVyxDQUFDO1NBQ2xDO1FBQ0QsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFBQyxHQUFHLElBQUcsWUFBVSxJQUFJLENBQUMsTUFBUSxDQUFBO1NBQUU7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQ0FBaUMsR0FBSyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQy9COzs7OztJQUdJLHlDQUFpQjs7OztjQUFDLEdBQUc7O1FBQ3RCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQztTQUN4RTtRQUNELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1NBQUU7UUFDakMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFN0IsVUFBVSxDQUNOO1lBQ0ksRUFBRSxDQUFBLENBQUMsS0FBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxJQUFFLENBQUMsSUFBSSxLQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsSUFBRSxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELEtBQUksQ0FBQyxLQUFLLENBQUMsa0NBQWdDLEtBQUksQ0FBQyxVQUFVLEdBQUMsSUFBSSxlQUFVLEtBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSwrQkFBNEIsQ0FBQyxDQUFDO2dCQUN6SCxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDckI7U0FDSixFQUFFLElBQUksQ0FBQyxVQUFVLENBQ3JCLENBQUM7UUFFUixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRSxVQUFBLENBQUMsSUFBSyxLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRSxDQUFBO1FBQ3BFLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFFLFVBQUEsQ0FBQyxJQUFLLEtBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFLENBQUE7UUFDcEUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUUsVUFBQSxDQUFDLElBQUssS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUUsQ0FBQTtRQUNwRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRSxVQUFBLENBQUM7O1lBQ1YsSUFBSSxJQUFJLENBQUM7WUFDVCxFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDO29CQUFDLElBQUksR0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFBRTtnQkFDaEMsS0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQUMsTUFBTSxDQUFBO2lCQUFFO2FBQ3RCO1lBQ0QsRUFBRSxDQUFBLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNqQyxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUUsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNsQztZQUNWLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxPQUFPLElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQUU7YUFDL0Q7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFBQyxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUFFO1NBQzFDLENBQUE7O0lBR0MscUNBQXFDOzs7O0lBQ3JDLGtDQUFVOzs7SUFBVjtRQUNJLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRSxJQUFJLENBQUM7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDO0tBQzdDO0lBR0QsMERBQTBEO0lBRTFELGtDQUFrQzs7Ozs7SUFDbEMsNEJBQUk7Ozs7SUFBSixVQUFLLElBQVE7UUFDVCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNULEVBQUUsQ0FBQSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsSUFBSSxHQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7YUFBRTtZQUMzRCxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjtLQUNKO0lBRUQsMkNBQTJDOzs7Ozs7O0lBQzNDLGtDQUFVOzs7Ozs7SUFBVixVQUFXLE9BQXFCLEVBQUUsSUFBVyxFQUFFLEtBQVM7UUFBN0Msd0JBQUEsRUFBQSxnQkFBcUI7O1FBQzVCLElBQUksR0FBRyxHQUFFO1lBQ0wsT0FBTyxFQUFFLENBQUMsT0FBTyxJQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU87WUFDckQsT0FBTyxFQUFFLENBQUU7b0JBQ1AsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztpQkFDekMsQ0FBRTtTQUNOLENBQUE7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBRyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsQjtJQUVELDJDQUEyQzs7Ozs7OztJQUMzQyxpQ0FBUzs7Ozs7O0lBQVQsVUFBVSxPQUFrQixFQUFFLElBQWU7UUFBbkMsd0JBQUEsRUFBQSxhQUFrQjtRQUFFLHFCQUFBLEVBQUEsVUFBZTtRQUFFLGlCQUFVO2FBQVYsVUFBVSxFQUFWLHFCQUFVLEVBQVYsSUFBVTtZQUFWLGdDQUFVOzs7UUFDckQsSUFBSSxJQUFJLEdBQUU7WUFDTixPQUFPLEVBQUUsQ0FBQyxPQUFPLElBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUNyRCxTQUFTLEVBQUUsRUFBRTtTQUNoQixDQUFDOztRQUVGLElBQUksWUFBWSxHQUFFLEVBQUUsQ0FBQztRQUNyQixZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUUsSUFBSSxDQUFDO1FBQzNCLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxLQUFLLEdBQUc7b0JBQ0osRUFBRSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQUU7b0JBQ3pFLEtBQUssQ0FBQztnQkFDVixLQUFLLEdBQUc7b0JBQ0osRUFBRSxDQUFBLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtxQkFDckM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNWLEtBQUssR0FBRztvQkFDSixFQUFFLENBQUEsQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUUsU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBRSxPQUFPOzJCQUNyQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUcsT0FBUSxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDOUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNWLEtBQUssR0FBRztvQkFDSixFQUFFLENBQUEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsRUFBRSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7eUJBQUU7cUJBQy9FO29CQUNELEtBQUssQ0FBQzthQUNiO1NBQ0o7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0lBRUQsK0NBQStDOzs7Ozs7SUFDL0MsbUNBQVc7Ozs7O0lBQVgsVUFBWSxPQUFrQixFQUFFLElBQWU7UUFBbkMsd0JBQUEsRUFBQSxhQUFrQjtRQUFFLHFCQUFBLEVBQUEsVUFBZTtRQUMzQyxPQUFPLEdBQUUsQ0FBQyxPQUFPLElBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUM7WUFDTixTQUFTLEVBQUUsT0FBTztZQUNsQixhQUFhLEVBQUUsQ0FBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBRTtTQUNwQyxDQUFDLENBQUM7S0FDTjtJQUVELHlEQUF5RDs7Ozs7SUFDekQsK0JBQU87Ozs7SUFBUCxVQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxJQUFHLFdBQVcsQ0FBQSxFQUFFO0lBQ3hELHlEQUF5RDs7Ozs7SUFDekQsK0JBQU87Ozs7SUFBUCxVQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxJQUFHLFdBQVcsQ0FBQSxFQUFFO0lBSXhELHNCQUFJLGlDQUFNO1FBRFYsOEVBQThFOzs7O1FBQzlFLGNBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBLEVBQUU7UUFDNUMsa0RBQWtEOzs7OztRQUNsRCxVQUFXLEVBQVM7WUFBcEIsaUJBZ0JDO1lBZkcsRUFBRSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztnQkFDTCxJQUFJLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQztnQkFDbEIsTUFBTSxDQUFDO2FBQ1Y7WUFDRCxFQUFFLENBQUEsQ0FBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFFLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBQzFCLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBRSxVQUFBLEVBQUUsSUFBSyxLQUFJLENBQUMsT0FBTyxHQUFFLEVBQUUsQ0FBQSxFQUFFLENBQUUsQ0FBQztpQkFDM0Q7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7aUJBQUU7YUFDN0M7WUFDRCxJQUFJLENBQUMsQ0FBQzs7Z0JBQ0YsSUFBSSxJQUFJLEdBQUUsTUFBTSxDQUFDLDZHQUE2RyxDQUFDLENBQUE7Z0JBQy9ILEVBQUUsQ0FBQSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLEVBQUUsR0FBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQUU7Z0JBQ2xFLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLElBQUksQ0FBQyxPQUFPLEdBQUUsYUFBVyxFQUFJLENBQUE7aUJBQUU7YUFDdEQ7U0FDSjs7O09BbEIyQztJQW9CNUMsK0JBQStCOzs7Ozs7O0lBQy9CLGtDQUFVOzs7Ozs7SUFBVixVQUFXLE9BQXFCLEVBQUUsU0FBZ0IsRUFBRSxLQUFXO1FBQXBELHdCQUFBLEVBQUEsZ0JBQXFCO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLG1CQUFpQixTQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDakU7SUFFRCxvQkFBb0I7Ozs7OztJQUNwQixrQ0FBVTs7Ozs7SUFBVixVQUFXLE9BQXFCLEVBQUUsU0FBZ0I7UUFBdkMsd0JBQUEsRUFBQSxnQkFBcUI7UUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsbUJBQWlCLFNBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNoRTtJQUdELHdEQUF3RDtJQUV4RCxrRUFBa0U7Ozs7SUFDbEUsK0JBQU87OztJQUFQLGNBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUEsRUFBRTtJQUVoRCwrQkFBK0I7Ozs7SUFDL0IsaUNBQVM7OztJQUFULGNBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUEsRUFBRTtJQUUxQyxrRkFBa0Y7Ozs7OztJQUNsRiwrQkFBTzs7Ozs7SUFBUCxVQUFRLE9BQWMsRUFBRSxJQUFXO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBTyxDQUFDLENBQUM7S0FDdEY7SUFFRCxrREFBa0Q7Ozs7O0lBQ2xELDhCQUFNOzs7O0lBQU4sVUFBTyxJQUFXOztRQUNkLElBQUksR0FBRyxHQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ3BDLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQTtTQUFFO1FBQ25CLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxHQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FBRTtRQUN4QyxHQUFHLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVUsR0FBSyxDQUFDLENBQUM7UUFFNUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O1lBQ2IsSUFBSSxPQUFPLEdBQUUsSUFBSSxXQUFXLENBQUUsRUFBRSxlQUFlLEVBQUUsU0FBTyxJQUFJLENBQUMsTUFBUSxFQUFFLENBQUUsQ0FBQztZQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFFLENBQUM7U0FDckQ7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLENBQUM7YUFDeEU7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7S0FDSjtJQUVELGdDQUFnQzs7Ozs7Ozs7SUFDaEMsOEJBQU07Ozs7Ozs7SUFBTixVQUFPLE9BQWMsRUFBRSxJQUFXLEVBQUUsR0FBTyxFQUFFLEtBQVM7O1FBQ2xELElBQUksR0FBRyxHQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ3BDLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQTtTQUFFO1FBQ25CLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxHQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FBRTtRQUN4QyxHQUFHLElBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7UUFFaEUsSUFBSSxHQUFHLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUE7UUFDdkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRSxLQUFLLENBQUM7UUFFdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFVLEdBQUssQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWhDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztZQUNiLElBQUksT0FBTyxHQUFFLElBQUksV0FBVyxDQUFFLEVBQUUsZUFBZSxFQUFFLFNBQU8sSUFBSSxDQUFDLE1BQVEsRUFBRSxDQUFFLENBQUM7WUFDMUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztTQUN6RDtRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0YsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQzthQUN4RTtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDbEM7S0FDSjtJQUVELDhDQUE4Qzs7Ozs7SUFDOUMsMkJBQUc7Ozs7SUFBSCxVQUFJLElBQVc7O1FBQ1gsSUFBSSxHQUFHLEdBQUssSUFBSSxDQUFDLFFBQVEsV0FBTSxJQUFJLENBQUMsUUFBUSxTQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUcsQ0FBQztRQUNwRixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQU8sR0FBSyxDQUFDLENBQUM7UUFFekIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O1lBQ2IsSUFBSSxPQUFPLEdBQUUsSUFBSSxXQUFXLENBQUUsRUFBRSxlQUFlLEVBQUUsU0FBTyxJQUFJLENBQUMsTUFBUSxFQUFFLENBQUUsQ0FBQztZQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFFLENBQUM7U0FDckQ7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLENBQUM7YUFDeEU7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7S0FDSjtJQUFBLENBQUM7Ozs7SUFHTSwyQ0FBbUI7Ozs7O1FBQ3ZCLElBQUksR0FBRyxDQUFDO1FBQ1IsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1lBRXRDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELEdBQUcsR0FBRSxLQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUcsQ0FBQzthQUNsRTtZQUNELElBQUksQ0FBQyxDQUFDO2dCQUFDLEdBQUcsR0FBRSxLQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBRyxDQUFBO2FBQUU7U0FDakU7UUFDRCxJQUFJLENBQUMsQ0FBQzs7WUFDRixJQUFJLEdBQUcsR0FBRSx1RkFBdUYsQ0FBQTtZQUNoRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7U0FDckM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDOzs7Ozs7SUFJUCxxQ0FBYTs7OztjQUFDLE9BQWM7O1FBQ2hDLElBQUksR0FBRyxHQUFFLENBQUMsT0FBTyxJQUFFLE1BQU0sQ0FBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN0RCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7OztJQUk1QixrQ0FBVTs7OztjQUFDLElBQVc7UUFDMUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFBO1NBQUU7Ozs7OztJQUloQixrQ0FBVTs7OztjQUFDLElBQVc7UUFDMUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFBO1NBQUU7OztnQkEzYjNCLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7Z0JBTFEsVUFBVTs7O3dCQURuQjs7U0FPYSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK2J0QixRQUFPLFFBQVE7SUFDZixPQUFNLE9BQU87SUFDYixNQUFLLE1BQU07SUFDWCxPQUFNLE9BQU87SUFDYixXQUFVLFdBQVc7Ozs7O0lBS3JCLFFBQU8sUUFBUTtJQUNmLE9BQU0sT0FBTzs7O0FBSWpCLElBQUE7SUFLSSxlQUFZLE9BQW1CO1FBQW5CLHdCQUFBLEVBQUEsY0FBbUI7cUJBSlosVUFBVSxDQUFDLE1BQU07c0JBQ1IsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUM7UUFHaEMsSUFBSSxDQUFDLE9BQU8sR0FBRSxPQUFPLENBQUE7S0FBRTtnQkF6ZDlEO0lBMGRDLENBQUE7QUFORCxpQkFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuXG5cdHByaXZhdGUgX2Nvbm5lY3Q7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNvbm5lY3Q7XHQgXHRcdFxuXHRwcml2YXRlIF9jbG9zZTsgXHRcdFx0XG4gICAgcHVibGljIG9uQ2xvc2U7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfZXJyb3I7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkVycm9yO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX21lc3NhZ2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbk1lc3NhZ2U7XHQgXHRcdCAgXG4gICAgcHJpdmF0ZSB3czsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgd3NQcm90b2NvbDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0XG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwcml2YXRlIHNlcnZlcj0ge1xuICAgICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdLFxuICAgICAgICB3czogeyBzZWxmOiBudWxsLCByb2xlczoge30gfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU2lnbmFsIEsgQVBJIFZFUlNJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuXG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIGdldCBsaXN0IG9mIGFwaSB2ZXJzaW9ucyBzdXBwb3J0ZWQgYnkgc2VydmVyXG4gICAgZ2V0IGFwaVZlcnNpb25zKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OICAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIGlzIEF1dGggcmVxdWlyZWQgZm9yIHRoaXMgc2VydmVyICoqXG4gICAgZ2V0IGF1dGhSZXF1aXJlZCgpIHsgcmV0dXJuIHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCB9XG5cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH1cblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAzMDAwPD10aW1lb3V0PD02MDAwMCAqKlxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxuXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3dzVGltZW91dD0gKHZhbDwzMDAwKSA/IDMwMDAgOiAodmFsPjYwMDAwKSA/IDYwMDAwIDogdmFsO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBpbml0aWFsaXNlIGNsaWVudCBjb25uZWN0aW9uIHNldHRpbmdzXG4gICAgcHJpdmF0ZSBpbml0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICBpZihpc0Rldk1vZGUoKSkgeyBcbiAgICAgICAgICAgIGhvc3RuYW1lPSBob3N0bmFtZSB8fCAnMTkyLjE2OC45OS4xMDAnO1xuICAgICAgICAgICAgcG9ydD0gcG9ydCB8fCAzMDAwOyAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IGhvc3RuYW1lPSBob3N0bmFtZSB8fCAnbG9jYWxob3N0JyB9XG5cbiAgICAgICAgdGhpcy5ob3N0bmFtZSA9IGhvc3RuYW1lO1xuICAgICAgICBpZih1c2VTU0wpIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cHMnO1xuICAgICAgICAgICAgdGhpcy53c1Byb3RvY29sID0gJ3dzcyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDQ0MztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy53c1Byb3RvY29sID0gJ3dzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgODA7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqIFNpZ25hbCBLIHNlcnZlciBkaXNjb3ZlcnkgcmVxdWVzdCAoL3NpZ25hbGspLiAgXG4gICAgaGVsbG8oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgdGhpcy5nZXQoJy9sb2dpblN0YXR1cycpLnN1YnNjcmliZSggcj0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZD0oclsnYXV0aGVudGljYXRpb25SZXF1aXJlZCddKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCcvc2lnbmFsaycpO1xuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXJcbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQpLnN1YnNjcmliZSggICAgLy8gKiogZGlzY292ZXIgZW5kcG9pbnRzICoqXG4gICAgICAgICAgICByZXNwb25zZT0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0gKHJlc3BvbnNlWydzZXJ2ZXInXSkgPyByZXNwb25zZVsnc2VydmVyJ10gOiB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gKHRoaXMuc2VydmVyLmVuZHBvaW50cykgPyBPYmplY3Qua2V5cyh0aGlzLnNlcnZlci5lbmRwb2ludHMpIDogW107XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICBsZXQgdXJsO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIGVuZHBvaW50IHZlcnNpb246ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXSkgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBmYWxsaW5nIGJhY2sgdG86IHYxYCk7XG4gICAgICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ119YCBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KCBuZXcgRXJyb3IoJ05vIFNpZ25hbCBLIGVuZHBvaW50cyBmb3VuZCEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICoqIHN1YnNjcmliZSAqKlxuICAgICAgICAgICAgICAgIGlmKHN1YnNjcmliZSAmJiBbJ3NlbGYnLCdhbGwnLCdub25lJ10uaW5kZXhPZihzdWJzY3JpYmUpIT0tMSkgeyBcbiAgICAgICAgICAgICAgICAgICAgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfSAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gJHt1cmx9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmluZm89IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3IubmV4dCggZXJyb3IgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9ICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggbm8gZW5kcG9pbnQgZGlzY292ZXJ5XG4gICAgY29ubmVjdERlbHRhKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0Nvbm5lY3REZWx0YS4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMud3NQcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vc3RyZWFtYDtcbiAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgIGlmKHN1YnNjcmliZSAmJiBbJ3NlbGYnLCdhbGwnLCdub25lJ10uaW5kZXhPZihzdWJzY3JpYmUpIT0tMSkgeyBcbiAgICAgICAgICAgIHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YDtcbiAgICAgICAgfSBcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfVxuICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvIGRlbHRhIHN0cmVhbSBhdCAke3VybH1gKTtcbiAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgIH0gIFxuXG5cdC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIGF0IHByb3ZpZGVkIHVybFxuXHRwcml2YXRlIGNvbm5lY3REZWx0YUJ5VXJsKHVybCkge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQgJiYgIXRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLndzKSB7IHRoaXMuZGlzY29ubmVjdCgpIH1cbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxuICAgICAgICBzZXRUaW1lb3V0KCBcbiAgICAgICAgICAgICgpPT57XG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIHdhdGNoZG9nIGV4cGlyZWQgKCR7dGhpcy5fd3NUaW1lb3V0LzEwMDB9IHNlYyk6ICR7dGhpcy53cy5yZWFkeVN0YXRlfS4uLiBhYm9ydGluZyBjb25uZWN0aW9uLi4uYCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl93c1RpbWVvdXRcbiAgICAgICAgKTtcblx0XHRcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3Mub3BlbmApOyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3MuY2xvc2VgKTsgdGhpcy5fY2xvc2UubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5lcnJvcmApOyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnJvbGVzPSBkYXRhLnJvbGVzO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnNlbGY9IGRhdGEuc2VsZjtcbiAgICAgICAgICAgIH0gICAgICAgICAgXG5cdFx0XHRpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9XG5cdFx0fVxuICAgIH0gIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIFNpZ25hbCBLIHN0cmVhbVxuICAgIGRpc2Nvbm5lY3QoKSB7XG4gICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgdGhpcy53cz0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXJ2ZXIud3M9IHsgc2VsZjogbnVsbCwgcm9sZXM6IHt9IH07XG4gICAgfVxuXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIFNUUkVBTSBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXG4gICAgc2VuZChkYXRhOmFueSkge1xuICAgICAgICBpZih0aGlzLndzKSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKiogc2VuZCB2YWx1ZSB2aWEgZGVsdGEgc3RyZWFtIHVwZGF0ZSAqKlxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7XG4gICAgICAgIGxldCB2YWw9IHsgXG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHVwZGF0ZXM6IFsge1xuICAgICAgICAgICAgICAgIHZhbHVlczogW3sgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH1dIFxuICAgICAgICAgICAgfSBdIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVidWcoYHNlbmRpbmcgdXBkYXRlOiAke0pTT04uc3RyaW5naWZ5KHZhbCl9YCk7XG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xuICAgIH1cblxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicsIC4uLm9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGRhdGE9IHtcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxuICAgICAgICAgICAgc3Vic2NyaWJlOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb249IHt9O1xuICAgICAgICBzdWJzY3JpcHRpb25bJ3BhdGgnXT0gcGF0aDtcbiAgICAgICAgZm9yKGxldCBpIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHN3aXRjaChpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnMCc6IFxuICAgICAgICAgICAgICAgICAgICBpZiggIWlzTmFOKG9wdGlvbnNbaV0pICkgeyBzdWJzY3JpcHRpb25bJ3BlcmlvZCddPSBwYXJzZUludChvcHRpb25zW2ldKSB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzEnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdGlvbnNbaV09PSdkZWx0YScgfHwgb3B0aW9uc1tpXT09J2Z1bGwnKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uWydmb3JtYXQnXT0gb3B0aW9uc1tpXSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcyJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0naW5zdGFudCcgfHwgb3B0aW9uc1tpXT09J2lkZWFsJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvcHRpb25zW2ldPT0gJ2ZpeGVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uWydwb2xpY3knXT0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhazsgICAgIFxuICAgICAgICAgICAgICAgIGNhc2UgJzMnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uWydwb2xpY3knXT09J2luc3RhbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggIWlzTmFOKG9wdGlvbnNbaV0pICkgeyBzdWJzY3JpcHRpb25bJ21pblBlcmlvZCddPSBwYXJzZUludChvcHRpb25zW2ldKSB9IFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRhdGEuc3Vic2NyaWJlLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5zZW5kKGRhdGEpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcbiAgICB1bnN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nPScqJykge1xuICAgICAgICBjb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcbiAgICAgICAgdGhpcy5zZW5kKHtcbiAgICAgICAgICAgIFwiY29udGV4dFwiOiBjb250ZXh0LFxuICAgICAgICAgICAgXCJ1bnN1YnNjcmliZVwiOiBbIHtcInBhdGhcIjogcGF0aH0gXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIERlbHRhIG1lc3NhZ2VcbiAgICBpc0RlbHRhKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy5jb250ZXh0IT0gJ3VuZGVmaW5lZCcgfVxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiByZWNpZXZlZCBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxuICAgIGlzSGVsbG8obXNnKSB7IHJldHVybiB0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyB9XG5cblxuICAgIC8vICoqIGdldCAvIHNldCBmaWx0ZXIgdG8gc2VsZWN0IGRlbHRhIG1lc3NhZ2VzIGp1c3QgZm9yIHN1cHBsaWVkIHZlc3NlbCBpZCAgIFxuICAgIGdldCBmaWx0ZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XG4gICAgLy8gKiogc2V0IGZpbHRlcj0gbnVsbCB0byByZW1vdmUgbWVzc2FnZSBmaWx0ZXJpbmdcbiAgICBzZXQgZmlsdGVyKGlkOnN0cmluZykgeyBcbiAgICAgICAgaWYoIWlkKSB7ICAgLy8gKiogY2xlYXIgZmlsdGVyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXI9bnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiggaWQuaW5kZXhPZignc2VsZicpIT0tMSApIHsgIC8vICoqIHNlbGZcbiAgICAgICAgICAgIGlmKCF0aGlzLnNlcnZlci53cy5zZWxmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTZWxmSWQoKS5zdWJzY3JpYmUoIGlkPT4geyB0aGlzLl9maWx0ZXI9IGlkIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9maWx0ZXI9IHRoaXMuc2VydmVyLndzLnNlbGYgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAgLy8gKiogdXVpZFxuICAgICAgICAgICAgbGV0IHV1aWQ9IFJlZ0V4cChcIl51cm46bXJuOnNpZ25hbGs6dXVpZDpbMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzg5QUJhYl1bMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXsxMn0kXCIpXG4gICAgICAgICAgICBpZihpZC5pbmRleE9mKCd2ZXNzZWxzLicpIT0tMSkgeyBpZD0gaWQuc2xpY2UoaWQuaW5kZXhPZignLicpKzEpIH1cbiAgICAgICAgICAgIGlmKHV1aWQudGVzdChpZCkpIHsgdGhpcy5fZmlsdGVyPSBgdmVzc2Vscy4ke2lkfWAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKiogUmFpc2UgYW4gYWxhcm0gbWVzc2FnZSAqKlxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmc9J3NlbGYnLCBhbGFybVBhdGg6c3RyaW5nLCBhbGFybTpBbGFybSkge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgYG5vdGlmaWNhdGlvbnMuJHthbGFybVBhdGh9YCwgYWxhcm0pO1xuICAgIH1cblxuICAgIC8vICoqIENsZWFyIGFsYXJtICoqXG4gICAgY2xlYXJBbGFybShjb250ZXh0OnN0cmluZz0nc2VsZicsIGFsYXJtUGF0aDpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIGBub3RpZmljYXRpb25zLiR7YWxhcm1QYXRofWAsIG51bGwpO1xuICAgIH0gXG4gICAgICAgICAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogSFRUUCBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgXG4gICAgLy8gKiogUmV0dXJucyB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuYXBpR2V0KGB2ZXNzZWxzL3NlbGZgKSB9XG5cbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBzZWxmIGlkZW50aXR5XG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHNlbGZgKSB9XG5cbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIHJldHVybiB0aGlzLmFwaUdldChgJHt0aGlzLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7dGhpcy5kb3RUb1NsYXNoKHBhdGgpfS9tZXRhYCk7XG4gICAgfSAgICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIGFwaSBwYXRoXG4gICAgYXBpR2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuZG90VG9TbGFzaChwYXRoKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgYXBpR2V0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8qKiBTZW5kIHZhbHVlIHRvIGh0dHAgYXBpIHBhdGhcbiAgICBhcGlQdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk6YW55LCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgdXJsKz0gdGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpICsgJy8nICsgdGhpcy5kb3RUb1NsYXNoKHBhdGgpO1xuXG4gICAgICAgIGxldCBtc2cgPSB7IHZhbHVlOiB7fSB9IFxuICAgICAgICBtc2cudmFsdWVba2V5XT0gdmFsdWU7XG5cbiAgICAgICAgdGhpcy5kZWJ1ZyhgYXBpUHV0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmRlYnVnKEpTT04uc3RyaW5naWZ5KG1zZykpO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZyk7IFxuICAgICAgICB9XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBwYXRoXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgZ2V0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyAqKiByZXR1cm4gdXJsIGZvciBjb25uZWN0ZWQgc2lnbmFsay1odHRwIGVuZHBvaW50XG4gICAgcHJpdmF0ZSByZXNvbHZlSHR0cEVuZHBvaW50KCkge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0pIHsgLy8gKiogY29ubmVjdGlvbiBtYWRlXG4gICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIGh0dHAgZW5kcG9pbnQgYXQgcHJlc2NyaWJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXSkge1xuICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLWh0dHAnXX1gIH0gICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbXNnPSAnTm8gY3VycmVudCBjb25uZWN0aW9uIGh0dHAgZW5kcG9pbnQgc2VydmljZSEgVXNlIGNvbm5lY3QoKSB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uLidcbiAgICAgICAgICAgIHRoaXMuZGVidWcobXNnKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKG1zZykgKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHVybDsgICBcbiAgICB9XG5cbiAgICAvLyAqKiBwYXJzZSBjb250ZXh0IHRvIHZhbGlkIFNpZ25hbCBLIHBhdGhcbiAgICBwcml2YXRlIGNvbnRleHRUb1BhdGgoY29udGV4dDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IHJlcz0gKGNvbnRleHQ9PSdzZWxmJyApID8gJ3Zlc3NlbHMuc2VsZic6IGNvbnRleHQ7XG4gICAgICAgIHJldHVybiByZXMuc3BsaXQoJy4nKS5qb2luKCcvJyk7XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxuICAgIHByaXZhdGUgZG90VG9TbGFzaChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIHNsYXNoIG5vdGF0aW9uIHRvIGRvdFxuICAgIHByaXZhdGUgc2xhc2hUb0RvdChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy8nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJykuam9pbignLicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfSAgICBcblxufVxuXG4vLyAqKiBBbGFybSBzdGF0ZSAqKlxuZXhwb3J0IGVudW0gIEFsYXJtU3RhdGUge1xuICAgIG5vcm1hbD0nbm9ybWFsJyxcbiAgICBhbGVydD0nYWxlcnQnLFxuICAgIHdhcm49J3dhcm4nLFxuICAgIGFsYXJtPSdhbGFybScsXG4gICAgZW1lcmdlbmN5PSdlbWVyZ2VuY3knXG59XG5cbi8vICoqIEFsYXJtIE1ldGhvZCAqKlxuZXhwb3J0IGVudW0gIEFsYXJtTWV0aG9kIHtcbiAgICB2aXN1YWw9J3Zpc3VhbCcsXG4gICAgc291bmQ9J3NvdW5kJ1xufVxuXG4vLyAqKiBBbGFybSBjbGFzc1xuZXhwb3J0IGNsYXNzIEFsYXJtIHtcbiAgICBzdGF0ZTogQWxhcm1TdGF0ZT0gQWxhcm1TdGF0ZS5ub3JtYWw7XG4gICAgbWV0aG9kOiBBcnJheTxBbGFybU1ldGhvZD49IFtBbGFybU1ldGhvZC52aXN1YWwsIEFsYXJtTWV0aG9kLnNvdW5kXTtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOnN0cmluZz1udWxsKSB7IHRoaXMubWVzc2FnZT0gbWVzc2FnZSB9XG59XG5cblxuIl19