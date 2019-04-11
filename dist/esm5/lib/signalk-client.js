/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignalKHttp } from './http-api';
import { SignalKStream } from './stream-api';
import { Path, Message } from './utils';
import { SignalKStreamWorker } from './stream-worker';
import { UUID } from './uuid';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./http-api";
import * as i3 from "./stream-api";
import * as i4 from "./stream-worker";
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
        this.api.server = this.server.info;
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
    ;
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
    ;
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
    ;
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
    /** @nocollapse */ SignalKClient.ngInjectableDef = i0.defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.inject(i1.HttpClient), i0.inject(i2.SignalKHttp), i0.inject(i3.SignalKStream), i0.inject(i4.SignalKStreamWorker)); }, token: SignalKClient, providedIn: "root" });
    return SignalKClient;
}());
export { SignalKClient };
if (false) {
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype.hostname;
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype.port;
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype.protocol;
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype._version;
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype._token;
    /** @type {?} */
    SignalKClient.prototype.server;
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype.http;
    /** @type {?} */
    SignalKClient.prototype.api;
    /** @type {?} */
    SignalKClient.prototype.stream;
    /** @type {?} */
    SignalKClient.prototype.worker;
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUN4QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDOzs7Ozs7QUFFOUI7SUE2Q0ksMERBQTBEO0lBQzFELHVCQUFxQixJQUFnQixFQUNsQixHQUFnQixFQUNoQixNQUFxQixFQUNyQixNQUEyQjtRQUh6QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2xCLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFDaEIsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFxQjtRQTFDdEMsYUFBUSxHQUFVLElBQUksQ0FBQyxDQUFNLGtDQUFrQzs7O1FBUWhFLFdBQU0sR0FBRTtZQUNYLFNBQVMsRUFBRSxFQUFFO1lBQ2IsSUFBSSxFQUFFLEVBQUU7WUFDUixXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFBO1FBK0JHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDOzs7Ozs7O0lBekNPLDZCQUFLOzs7Ozs7O0lBQWIsVUFBYyxHQUFRLElBQUksSUFBRyxTQUFTLEVBQUUsRUFBQztRQUFFLE9BQU8sQ0FB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TyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztTQUNyRDthQUNJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFO0lBQ3RDLENBQUM7O2dCQWxSSixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O2dCQVJ6QixVQUFVO2dCQUVWLFdBQVc7Z0JBQ1gsYUFBYTtnQkFFYixtQkFBbUI7Ozt3QkFONUI7Q0E2UkMsQUFwUkQsSUFvUkM7U0FuUlksYUFBYTs7Ozs7O0lBRXRCLGlDQUF5Qjs7Ozs7SUFDekIsNkJBQXFCOzs7OztJQUNyQixpQ0FBeUI7Ozs7O0lBRXpCLGlDQUErQjs7Ozs7SUFDL0IsK0JBQXVCOztJQU92QiwrQkFJQzs7Ozs7SUEyQlksNkJBQXdCOztJQUN6Qiw0QkFBdUI7O0lBQ3ZCLCtCQUE0Qjs7SUFDNUIsK0JBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgU2lnbmFsS0h0dHAgfSBmcm9tICcuL2h0dHAtYXBpJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW0gfSBmcm9tICcuL3N0cmVhbS1hcGknO1xuaW1wb3J0IHsgUGF0aCwgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbVdvcmtlcn0gZnJvbSAnLi9zdHJlYW0td29ya2VyJztcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gIFxuICAgIHByaXZhdGUgX3ZlcnNpb246IHN0cmluZz0gJ3YxJzsgICAgICAvLyAqKiBkZWZhdWx0IFNpZ25hbCBLIGFwaSB2ZXJzaW9uXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICBwcml2YXRlIGRlYnVnKHZhbDogYW55KSB7IGlmKGlzRGV2TW9kZSgpKXsgY29uc29sZS5sb2codmFsKSB9IH1cbiAgICBcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwdWJsaWMgc2VydmVyPSB7XG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW11cbiAgICB9ICAgIFxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IFxuICAgICAgICB0aGlzLl90b2tlbj0gdmFsO1xuICAgICAgICB0aGlzLmFwaS5hdXRoVG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5zdHJlYW0uYXV0aFRva2VuPSB2YWw7XG4gICAgfSAgICBcbiAgICAvLyAqKiBNZXNzYWdlIE9iamVjdFxuICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gTWVzc2FnZSB9XG5cbiAgICAvLyAqKiBnZW5lcmF0ZSBhbmQgcmV0dXJuIGEgVVVJRCBvYmplY3RcbiAgICBnZXQgdXVpZCgpOlVVSUQgeyByZXR1cm4gbmV3IFVVSUQoKSB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgXG4gICAgICAgICAgICAgICAgcHVibGljIGFwaTogU2lnbmFsS0h0dHAsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzdHJlYW06IFNpZ25hbEtTdHJlYW0sXG4gICAgICAgICAgICAgICAgcHVibGljIHdvcmtlcjogU2lnbmFsS1N0cmVhbVdvcmtlciApIHsgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfSAgIFxuICAgIFxuICAgIC8vICoqIGluaXRpYWxpc2UgcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0IHZhbHVlc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9J2xvY2FsaG9zdCcsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OIEFORCBESVNDT1ZFUlkgICoqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZW5kcG9pbnQgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyIChlbmRwb2ludCBkaXNjb3ZlcnkpIGFuZCBETyBOT1Qgb3BlbiBTdHJlYW1cbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlPT4geyBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKTsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IH1cbiAgICBcbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RQbGF5YmFjayhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIG9wdGlvbnM6YW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgICAgICB0aGlzLmFwaS5zZXJ2ZXI9IHRoaXMuc2VydmVyLmluZm87XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJuIHByZWZlcnJlZCBXUyBzdHJlYW0gdXJsXG4gICAgcHVibGljIHJlc29sdmVTdHJlYW1FbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXSkge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyBlbmRwb2ludCB2ZXJzaW9uOiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ119YDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXSkgeyBcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gZmFsbGluZyBiYWNrIHRvOiB2MWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddfWAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBudWxsIH1cbiAgICB9ICBcblxuICAgIC8vICoqIHJldHVybiBzaWduYWxrLWh0dHAgZW5kcG9pbnQgdXJsXG4gICAgcHJpdmF0ZSByZXNvbHZlSHR0cEVuZHBvaW50KCk6c3RyaW5nIHtcbiAgICAgICAgbGV0IHVybDogc3RyaW5nO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0pIHsgLy8gKiogY29ubmVjdGlvbiBtYWRlXG4gICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIGh0dHAgZW5kcG9pbnQgYXQgcHJlc2NyaWJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXSkge1xuICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLWh0dHAnXX1gIH0gICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbXNnPSAnTm8gY3VycmVudCBjb25uZWN0aW9uIGh0dHAgZW5kcG9pbnQgc2VydmljZSEgVXNlIGNvbm5lY3QoKSB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uLidcbiAgICAgICAgICAgIHRoaXMuZGVidWcobXNnKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHVybDsgICBcbiAgICB9ICAgIFxuICAgIFxuICAgIC8vICoqIGNsZWFudXAgb24gc2VydmVyIGRpc2Nvbm5lY3Rpb25cbiAgICBwcml2YXRlIGRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gW107ICBcbiAgICB9XG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBwYXRoXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgZ2V0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfSAgICAgICAgXG4gICAgfTsgIFxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcHV0IHRvIGh0dHAgcGF0aFxuICAgIHB1dChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcHV0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07XG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwb3N0IHRvIGh0dHAgcGF0aFxuICAgIHBvc3QocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHBvc3QgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9OyAgIFxuXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsIGBhcHBsaWNhdGlvbi9qc29uYCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9naW5gLFxuICAgICAgICAgICAgeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICB7IGhlYWRlcnMgfVxuICAgICAgICApO1xuICAgIH1cblx0XG4gICAgLy8gKiogbG9nb3V0IGZyb20gc2VydmVyICoqXG4gICAgbG9nb3V0KCkge1xuXHRcdGxldCB1cmw9YCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dvdXRgO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwsIHsgaGVhZGVycyB9ICk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCApIH1cbiAgICB9XHQgICBcbiAgICBcbiAgICAvLyoqIGdldCBkYXRhIHZpYSB0aGUgc25hcHNob3QgaHR0cCBhcGkgcGF0aCBmb3Igc3VwcGxpZWQgdGltZVxuICAgIHNuYXBzaG90KGNvbnRleHQ6c3RyaW5nLCB0aW1lOnN0cmluZykgeyBcbiAgICAgICAgaWYoIXRpbWUpIHsgcmV0dXJuIH1cbiAgICAgICAgdGltZT0gdGltZS5zbGljZSgwLHRpbWUuaW5kZXhPZignLicpKSArICdaJztcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgdXJsPSBgJHt1cmwucmVwbGFjZSgnYXBpJywnc25hcHNob3QnKX0ke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0/dGltZT0ke3RpbWV9YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cbiAgICB9XG5cbn1cbiJdfQ==