/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var SignalKClient = /** @class */ (function () {
    function SignalKClient(http) {
        this.http = http;
        this._version = 'v1';
        this._filter = null;
        this.server = {
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
        if (hostname === void 0) { hostname = null; }
        if (port === void 0) { port = null; }
        if (useSSL === void 0) { useSSL = false; }
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
        return this.http.get(url);
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
        return this.http.put(url, msg);
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
        return this.http.get(url);
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
    SignalKClient.prototype.server;
    /** @type {?} */
    SignalKClient.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBYyxNQUFNLE1BQU0sQ0FBQzs7OztJQW1DdkMsdUJBQXFCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7d0JBYlgsSUFBSTt1QkFDYixJQUFJO3NCQUdMO1lBQ1osU0FBUyxFQUFFLEVBQUU7WUFDYixJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxFQUFFO1lBQ2YsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1NBQ2hDO1FBS0csSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZ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R0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7OztnQkF4VXZDLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7Z0JBTFEsVUFBVTs7O3dCQURuQjs7U0FPYSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTaWduYWxLQ2xpZW50IHtcblxuXHRwcml2YXRlIF9jb25uZWN0OyBcdFx0XHRcbiAgICBwdWJsaWMgb25Db25uZWN0O1x0IFx0XHRcblx0cHJpdmF0ZSBfY2xvc2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNsb3NlO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX2Vycm9yOyBcdFx0XHRcbiAgICBwdWJsaWMgb25FcnJvcjtcdCBcdFx0ICAgIFxuXHRwcml2YXRlIF9tZXNzYWdlOyBcdFx0XHRcbiAgICBwdWJsaWMgb25NZXNzYWdlO1x0IFx0XHQgIFxuICAgIHByaXZhdGUgd3M7ICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgICBwcml2YXRlIHdzUHJvdG9jb2w6IHN0cmluZztcblxuICAgIHByaXZhdGUgX3ZlcnNpb246IHN0cmluZz0gJ3YxJzsgICAgICAvLyAqKiBkZWZhdWx0IFNpZ25hbCBLIGFwaSB2ZXJzaW9uXG4gICAgcHJpdmF0ZSBfZmlsdGVyPSBudWxsOyAgICAgICAgICAgICAgIC8vICoqIGlkIG9mIHZlc3NlbCB0byBmaWx0ZXIgZGVsdGEgbWVzc2FnZXNcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHByaXZhdGUgc2VydmVyPSB7XG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW10sXG4gICAgICAgIHdzOiB7IHNlbGY6IG51bGwsIHJvbGVzOiB7fSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG5cbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyBcbiAgICAgICAgdGhpcy5fY29ubmVjdD0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uQ29ubmVjdD0gdGhpcy5fY29ubmVjdC5hc09ic2VydmFibGUoKTsgICBcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNsb3NlPSB0aGlzLl9jbG9zZS5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBTaWduYWwgSyBBUEkgVkVSU0lPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG5cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIENPTk5FQ1RJT04gICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogaW5pdGlhbGlzZSBjbGllbnQgY29ubmVjdGlvbiBzZXR0aW5nc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgaWYoaXNEZXZNb2RlKCkpIHsgXG4gICAgICAgICAgICBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJzE5Mi4xNjguOTkuMTAwJztcbiAgICAgICAgICAgIHBvcnQ9IHBvcnQgfHwgMzAwMDsgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJ2xvY2FsaG9zdCcgfVxuXG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3c3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA0NDM7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3cyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyXG4gICAgY29ubmVjdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmhlbGxvKGhvc3RuYW1lLCBwb3J0KS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgcmVzcG9uc2U9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSAocmVzcG9uc2VbJ2VuZHBvaW50cyddKSA/IHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9ICh0aGlzLnNlcnZlci5lbmRwb2ludHMpID8gT2JqZWN0LmtleXModGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA6IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybDtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyBlbmRwb2ludCB2ZXJzaW9uOiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ119YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gZmFsbGluZyBiYWNrIHRvOiB2MWApO1xuICAgICAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddfWAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dCggbmV3IEVycm9yKCdObyBTaWduYWwgSyBlbmRwb2ludHMgZm91bmQhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgICAgICAgICBpZihzdWJzY3JpYmUgJiYgWydzZWxmJywnYWxsJywnbm9uZSddLmluZGV4T2Yoc3Vic2NyaWJlKSE9LTEpIHsgXG4gICAgICAgICAgICAgICAgICAgIHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YDtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gJHt1cmx9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmluZm89IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3IubmV4dCggZXJyb3IgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9ICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggbm8gZW5kcG9pbnQgZGlzY292ZXJ5XG4gICAgY29ubmVjdERlbHRhKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0Nvbm5lY3REZWx0YS4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMud3NQcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vc3RyZWFtYDtcbiAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgIGlmKHN1YnNjcmliZSAmJiBbJ3NlbGYnLCdhbGwnLCdub25lJ10uaW5kZXhPZihzdWJzY3JpYmUpIT0tMSkgeyBcbiAgICAgICAgICAgIHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YDtcbiAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byBkZWx0YSBzdHJlYW0gYXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICB9ICBcblxuXHQvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSBhdCBwcm92aWRlZCB1cmxcblx0cHJpdmF0ZSBjb25uZWN0RGVsdGFCeVVybCh1cmwpIHtcbiAgICAgICAgaWYodGhpcy53cykgeyB0aGlzLmRpc2Nvbm5lY3QoKSB9XG5cdFx0dGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcblx0XHRcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGB3cy5vcGVuYCk7XG5cdFx0XHR0aGlzLl9jb25uZWN0Lm5leHQoZSk7XG5cdFx0fVxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3MuY2xvc2VgKTsgdGhpcy5fY2xvc2UubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5lcnJvcmApOyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnJvbGVzPSBkYXRhLnJvbGVzO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnNlbGY9IGRhdGEuc2VsZjtcbiAgICAgICAgICAgIH0gICAgICAgICAgXG5cdFx0XHRpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9XG5cdFx0fVxuICAgIH0gIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIFNpZ25hbCBLIHN0cmVhbVxuICAgIGRpc2Nvbm5lY3QoKSB7XG4gICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgdGhpcy53cz0gbnVsbDtcbiAgICAgICAgdGhpcy5zZXJ2ZXIud3M9IHsgc2VsZjogbnVsbCwgcm9sZXM6IHt9IH07XG4gICAgfVxuXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIFNUUkVBTSBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXG4gICAgc2VuZChkYXRhOmFueSkge1xuICAgICAgICBpZih0aGlzLndzKSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKiogU3Vic2NyaWJlIHRvIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nPScqJywgLi4ub3B0aW9ucykge1xuICAgICAgICBsZXQgZGF0YT0ge1xuICAgICAgICAgICAgY29udGV4dDogKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQsXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbj0ge307XG4gICAgICAgIHN1YnNjcmlwdGlvblsncGF0aCddPSBwYXRoO1xuICAgICAgICBmb3IobGV0IGkgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgc3dpdGNoKGkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcwJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCAhaXNOYU4ob3B0aW9uc1tpXSkgKSB7IHN1YnNjcmlwdGlvblsncGVyaW9kJ109IHBhcnNlSW50KG9wdGlvbnNbaV0pIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMSc6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2RlbHRhJyB8fCBvcHRpb25zW2ldPT0nZnVsbCcpIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25bJ2Zvcm1hdCddPSBvcHRpb25zW2ldIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzInOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdGlvbnNbaV09PSdpbnN0YW50JyB8fCBvcHRpb25zW2ldPT0naWRlYWwnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IG9wdGlvbnNbaV09PSAnZml4ZWQnICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25bJ3BvbGljeSddPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICAgXG4gICAgICAgICAgICAgICAgY2FzZSAnMyc6IFxuICAgICAgICAgICAgICAgICAgICBpZihzdWJzY3JpcHRpb25bJ3BvbGljeSddPT0naW5zdGFudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhaXNOYU4ob3B0aW9uc1tpXSkgKSB7IHN1YnNjcmlwdGlvblsnbWluUGVyaW9kJ109IHBhcnNlSW50KG9wdGlvbnNbaV0pIH0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5zdWJzY3JpYmUucHVzaChzdWJzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLnNlbmQoZGF0YSk7ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKiBVbnN1YnNjcmliZSBmcm9tIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonKSB7XG4gICAgICAgIGNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xuICAgICAgICB0aGlzLnNlbmQoe1xuICAgICAgICAgICAgXCJjb250ZXh0XCI6IGNvbnRleHQsXG4gICAgICAgICAgICBcInVuc3Vic2NyaWJlXCI6IFsge1wicGF0aFwiOiBwYXRofSBdXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiByZWNpZXZlZCBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxuICAgIGlzRGVsdGEobXNnKSB7IHJldHVybiB0eXBlb2YgbXNnLmNvbnRleHQhPSAndW5kZWZpbmVkJyB9XG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBIZWxsbyBtZXNzYWdlXG4gICAgaXNIZWxsbyhtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cudmVyc2lvbiE9ICd1bmRlZmluZWQnIH1cblxuICAgIC8vICoqIGdldCAvIHNldCBmaWx0ZXIgdG8gc2VsZWN0IGRlbHRhIG1lc3NhZ2VzIGp1c3QgZm9yIHN1cHBsaWVkIHZlc3NlbCBpZCAgIFxuICAgIGdldCBmaWx0ZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XG4gICAgLy8gKiogc2V0IGZpbHRlcj0gbnVsbCB0byByZW1vdmUgbWVzc2FnZSBmaWx0ZXJpbmdcbiAgICBzZXQgZmlsdGVyKGlkOnN0cmluZykgeyBcbiAgICAgICAgaWYoIWlkKSB7ICAgLy8gKiogY2xlYXIgZmlsdGVyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXI9bnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiggaWQuaW5kZXhPZignc2VsZicpIT0tMSApIHsgIC8vICoqIHNlbGZcbiAgICAgICAgICAgIGlmKCF0aGlzLnNlcnZlci53cy5zZWxmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTZWxmSWQoKS5zdWJzY3JpYmUoIGlkPT4geyB0aGlzLl9maWx0ZXI9IGlkIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9maWx0ZXI9IHRoaXMuc2VydmVyLndzLnNlbGYgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAgLy8gKiogdXVpZFxuICAgICAgICAgICAgbGV0IHV1aWQ9IFJlZ0V4cChcIl51cm46bXJuOnNpZ25hbGs6dXVpZDpbMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzg5QUJhYl1bMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXsxMn0kXCIpXG4gICAgICAgICAgICBpZihpZC5pbmRleE9mKCd2ZXNzZWxzLicpIT0tMSkgeyBpZD0gaWQuc2xpY2UoaWQuaW5kZXhPZignLicpKzEpIH1cbiAgICAgICAgICAgIGlmKHV1aWQudGVzdChpZCkpIHsgdGhpcy5fZmlsdGVyPSBgdmVzc2Vscy4ke2lkfWAgfVxuICAgICAgICB9XG4gICAgfVxuICAgICAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogSFRUUCBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgXG4gICAgLy8gKiogUmV0dXJucyB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuYXBpR2V0KGB2ZXNzZWxzL3NlbGZgKSB9XG5cbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBzZWxmIGlkZW50aXR5XG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHNlbGZgKSB9XG5cbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIHJldHVybiB0aGlzLmFwaUdldChgJHt0aGlzLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7cGF0aC5zcGxpdCgnLicpLmpvaW4oJy8nKX0vbWV0YWApO1xuICAgIH0gICAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBhcGkgcGF0aFxuICAgIGFwaUdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxuICAgICAgICB1cmwrPSBwYXRoO1xuICAgICAgICB0aGlzLmRlYnVnKGBhcGlHZXQgJHt1cmx9YCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCk7XG4gICAgfVxuXG4gICAgLy8qKiBTZW5kIHZhbHVlIHRvIGh0dHAgYXBpIHBhdGhcbiAgICBhcGlQdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk6YW55LCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgdXJsKz0gdGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpICsgJy8nICsgcGF0aDtcblxuICAgICAgICBsZXQgbXNnID0geyB2YWx1ZToge30gfSBcbiAgICAgICAgbXNnLnZhbHVlW2tleV09IHZhbHVlO1xuICAgIFxuICAgICAgICB0aGlzLmRlYnVnKGBhcGlQdXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuZGVidWcoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKTtcbiAgICB9ICAgIFxuICAgIFxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIHBhdGhcbiAgICBwcml2YXRlIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7cGF0aH1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBnZXQgJHt1cmx9YCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCk7XG4gICAgfTsgIFxuXG4gICAgLy8gKiogcmV0dXJuIHVybCBmb3IgY29ubmVjdGVkIHNpZ25hbGstaHR0cCBlbmRwb2ludFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpIHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcihtc2cpICk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfVxuXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXG4gICAgcHJpdmF0ZSBjb250ZXh0VG9QYXRoKGNvbnRleHQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCByZXM9IChjb250ZXh0PT0nc2VsZicgKSA/ICd2ZXNzZWxzLnNlbGYnOiBjb250ZXh0O1xuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgIH1cblxufVxuIl19