/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignalKHttp } from './http-api';
import { SignalKStream } from './stream-api';
import { SignalKApps } from './apps-api';
import { Path, Message } from './utils';
import { SignalKStreamWorker } from './stream-worker';
import { UUID } from './uuid';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./apps-api";
import * as i3 from "./http-api";
import * as i4 from "./stream-api";
import * as i5 from "./stream-worker";
var SignalKClient = /** @class */ (function () {
    // *******************************************************
    function SignalKClient(http, apps, api, stream, worker) {
        this.http = http;
        this.apps = apps;
        this.api = api;
        this.stream = stream;
        this.worker = worker;
        this._version = 'v1'; // ** default Signal K api version
        // ** endpoints to fallback to if hello response is not received.
        this.fallbackEndpoints = {
            endpoints: { v1: {} },
            server: { id: "fallback" }
        };
        // **************** ATTRIBUTES ***************************
        // ** server information block **
        this.server = {
            endpoints: {},
            info: {},
            apiVersions: []
        };
        // ** endpoints fallback to host address when no hello response
        this.fallback = false;
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
        /** @type {?} */
        var url = this.protocol + "://" + this.hostname + ":" + this.port;
        this.fallbackEndpoints.endpoints.v1['signalk-http'] = url + "/signalk/v1/api/";
        this.fallbackEndpoints.endpoints.v1['signalk-ws'] = url + "/signalk/v1/stream";
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
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.debug('Contacting Signal K server.........');
            _this.hello(hostname, port, useSSL).subscribe((
            // ** discover endpoints **
            /**
             * @param {?} response
             * @return {?}
             */
            function (// ** discover endpoints **
            response) {
                if (_this.stream) {
                    _this.stream.close();
                }
                _this.processHello(response);
                _this.api.endpoint = _this.resolveHttpEndpoint();
                _this.stream.endpoint = _this.resolveStreamEndpoint();
                resolve(true);
            }), (/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                if (_this.fallback) { // fallback if no hello response
                    if (_this.stream) {
                        _this.stream.close();
                    }
                    _this.processHello(null);
                    _this.api.endpoint = _this.resolveHttpEndpoint();
                    _this.stream.endpoint = _this.resolveStreamEndpoint();
                    resolve(true);
                }
                else {
                    _this.disconnectedFromServer();
                    reject(error);
                }
            }));
        }));
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
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.connect(hostname, port, useSSL)
                .then((/**
             * @return {?}
             */
            function () {
                // ** connect to stream api at preferred version else fall back to default version
                /** @type {?} */
                var url = _this.resolveStreamEndpoint();
                if (!url) {
                    reject(new Error('Server has no advertised Stream endpoints!'));
                    return;
                }
                _this.stream.open(url, subscribe);
                resolve(true);
            }))
                .catch((/**
             * @param {?} e
             * @return {?}
             */
            function (e) { reject(e); }));
        }));
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
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.connect(hostname, port, useSSL)
                .then((/**
             * @return {?}
             */
            function () {
                // ** connect to playback api at preferred version else fall back to default version
                _this.openPlayback(null, options, _this._token);
                resolve(true);
            }))
                .catch((/**
             * @param {?} e
             * @return {?}
             */
            function (e) { reject(e); }));
        }));
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
        this.server.endpoints = (response && response['endpoints']) ?
            response['endpoints'] : this.fallbackEndpoints.endpoints;
        this.server.info = (response && response['server']) ?
            response['server'] : this.fallbackEndpoints.server;
        this.server.apiVersions = (this.server.endpoints) ? Object.keys(this.server.endpoints) : [];
        this.debug(this.server.endpoints);
        this.api.server = this.server.info;
        this.apps.endpoint = this.resolveAppsEndpoint();
    };
    // ** return signalk apps api url
    // ** return signalk apps api url
    /**
     * @private
     * @return {?}
     */
    SignalKClient.prototype.resolveAppsEndpoint = 
    // ** return signalk apps api url
    /**
     * @private
     * @return {?}
     */
    function () {
        if (this.server.info['id'] == 'signalk-server-node') {
            return this.protocol + "://" + this.hostname + ":" + this.port + "/webapps";
        }
        else {
            return this.resolveHttpEndpoint().replace('api', 'apps');
        }
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
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    SignalKClient.ctorParameters = function () { return [
        { type: HttpClient },
        { type: SignalKApps },
        { type: SignalKHttp },
        { type: SignalKStream },
        { type: SignalKStreamWorker }
    ]; };
    /** @nocollapse */ SignalKClient.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.SignalKApps), i0.ɵɵinject(i3.SignalKHttp), i0.ɵɵinject(i4.SignalKStream), i0.ɵɵinject(i5.SignalKStreamWorker)); }, token: SignalKClient, providedIn: "root" });
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
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype.fallbackEndpoints;
    /** @type {?} */
    SignalKClient.prototype.server;
    /** @type {?} */
    SignalKClient.prototype.fallback;
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype.http;
    /** @type {?} */
    SignalKClient.prototype.apps;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM3QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7QUFFOUI7SUF1REksMERBQTBEO0lBQzFELHVCQUFxQixJQUFnQixFQUNsQixJQUFpQixFQUNqQixHQUFnQixFQUNoQixNQUFxQixFQUNyQixNQUEyQjtRQUp6QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2xCLFNBQUksR0FBSixJQUFJLENBQWE7UUFDakIsUUFBRyxHQUFILEdBQUcsQ0FBYTtRQUNoQixXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQXFCO1FBckR0QyxhQUFRLEdBQVUsSUFBSSxDQUFDLENBQU0sa0NBQWtDOztRQU0vRCxzQkFBaUIsR0FBRTtZQUN2QixTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRyxFQUFFO1lBQ3RCLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRyxVQUFVLEVBQUU7U0FDOUIsQ0FBQzs7O1FBS0ssV0FBTSxHQUFF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LEdBQUcsR0FBRyxDQUFDOztZQUN4QyxHQUFHLEdBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1FBQ25DLElBQUcsQ0FBQyxHQUFHLEVBQUU7WUFBRSxPQUFNO1NBQUU7UUFDbkIsR0FBRyxHQUFFLEtBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsY0FBUyxJQUFNLENBQUM7UUFDbkYsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFOztnQkFDUixPQUFPLEdBQUUsSUFBSSxXQUFXLENBQUUsRUFBRSxlQUFlLEVBQUUsU0FBTyxJQUFJLENBQUMsTUFBUSxFQUFFLENBQUU7WUFDekUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztTQUNyRDthQUNJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFO0lBQ3RDLENBQUM7O2dCQXRUSixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O2dCQVR6QixVQUFVO2dCQUlWLFdBQVc7Z0JBRlgsV0FBVztnQkFDWCxhQUFhO2dCQUdiLG1CQUFtQjs7O3dCQVA1QjtDQWtVQyxBQXhURCxJQXdUQztTQXZUWSxhQUFhOzs7Ozs7SUFFdEIsaUNBQXlCOzs7OztJQUN6Qiw2QkFBcUI7Ozs7O0lBQ3JCLGlDQUF5Qjs7Ozs7SUFFekIsaUNBQStCOzs7OztJQUMvQiwrQkFBdUI7Ozs7O0lBS3ZCLDBDQUdFOztJQUtGLCtCQUlDOztJQUdELGlDQUErQjs7Ozs7SUE0QmxCLDZCQUF3Qjs7SUFDekIsNkJBQXdCOztJQUN4Qiw0QkFBdUI7O0lBQ3ZCLCtCQUE0Qjs7SUFDNUIsK0JBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgU2lnbmFsS0h0dHAgfSBmcm9tICcuL2h0dHAtYXBpJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW0gfSBmcm9tICcuL3N0cmVhbS1hcGknO1xuaW1wb3J0IHsgU2lnbmFsS0FwcHMgfSBmcm9tICcuL2FwcHMtYXBpJztcbmltcG9ydCB7IFBhdGgsIE1lc3NhZ2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW1Xb3JrZXJ9IGZyb20gJy4vc3RyZWFtLXdvcmtlcic7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi91dWlkJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBTaWduYWxLQ2xpZW50IHtcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICBcbiAgICBwcml2YXRlIF92ZXJzaW9uOiBzdHJpbmc9ICd2MSc7ICAgICAgLy8gKiogZGVmYXVsdCBTaWduYWwgSyBhcGkgdmVyc2lvblxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHRva2VuIGZvciB3aGVuIHNlY3VyaXR5IGlzIGVuYWJsZWQgb24gdGhlIHNlcnZlclxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG5cbiAgICAvLyAqKiBlbmRwb2ludHMgdG8gZmFsbGJhY2sgdG8gaWYgaGVsbG8gcmVzcG9uc2UgaXMgbm90IHJlY2VpdmVkLlxuICAgIHByaXZhdGUgZmFsbGJhY2tFbmRwb2ludHM9IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7IHYxOiB7IH0gfSxcbiAgICAgICAgc2VydmVyOiB7IGlkIDogXCJmYWxsYmFja1wiIH1cbiAgICB9OyAgICBcbiAgICBcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwdWJsaWMgc2VydmVyPSB7XG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW11cbiAgICB9ICBcblxuICAgIC8vICoqIGVuZHBvaW50cyBmYWxsYmFjayB0byBob3N0IGFkZHJlc3Mgd2hlbiBubyBoZWxsbyByZXNwb25zZVxuICAgIHB1YmxpYyBmYWxsYmFjazpib29sZWFuPSBmYWxzZTtcblxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IFxuICAgICAgICB0aGlzLl90b2tlbj0gdmFsO1xuICAgICAgICB0aGlzLmFwaS5hdXRoVG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5zdHJlYW0uYXV0aFRva2VuPSB2YWw7XG4gICAgfSAgICBcbiAgICAvLyAqKiBNZXNzYWdlIE9iamVjdFxuICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gTWVzc2FnZSB9XG5cbiAgICAvLyAqKiBnZW5lcmF0ZSBhbmQgcmV0dXJuIGEgVVVJRCBvYmplY3RcbiAgICBnZXQgdXVpZCgpOlVVSUQgeyByZXR1cm4gbmV3IFVVSUQoKSB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgXG4gICAgICAgICAgICAgICAgcHVibGljIGFwcHM6IFNpZ25hbEtBcHBzLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhcGk6IFNpZ25hbEtIdHRwLCBcbiAgICAgICAgICAgICAgICBwdWJsaWMgc3RyZWFtOiBTaWduYWxLU3RyZWFtLFxuICAgICAgICAgICAgICAgIHB1YmxpYyB3b3JrZXI6IFNpZ25hbEtTdHJlYW1Xb3JrZXIgKSB7IFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH0gICBcbiAgICBcbiAgICAvLyAqKiBpbml0aWFsaXNlIHByb3RvY29sLCBob3N0bmFtZSwgcG9ydCB2YWx1ZXNcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPSdsb2NhbGhvc3QnLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDQ0MztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgIFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9YDsgIFxuICAgICAgICB0aGlzLmZhbGxiYWNrRW5kcG9pbnRzLmVuZHBvaW50cy52MVsnc2lnbmFsay1odHRwJ109IGAke3VybH0vc2lnbmFsay92MS9hcGkvYDtcbiAgICAgICAgdGhpcy5mYWxsYmFja0VuZHBvaW50cy5lbmRwb2ludHMudjFbJ3NpZ25hbGstd3MnXT0gYCR7dXJsfS9zaWduYWxrL3YxL3N0cmVhbWA7XG4gICAgfSAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogQ09OTkVDVElPTiBBTkQgRElTQ09WRVJZICAqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGVuZHBvaW50IGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlciAoZW5kcG9pbnQgZGlzY292ZXJ5KSBhbmQgRE8gTk9UIG9wZW4gU3RyZWFtXG4gICAgY29ubmVjdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgICAgICByZXNwb25zZT0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0uZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZmFsbGJhY2spIHsgLy8gZmFsbGJhY2sgaWYgbm8gaGVsbG8gcmVzcG9uc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8obnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKTsgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGRpc2Nvbm5lY3QgZnJvbSBzZXJ2ZXJcbiAgICBkaXNjb25uZWN0KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpOyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTsgfVxuICAgIFxuICAgIC8vICoqIENvbm5lY3QgKyBvcGVuIERlbHRhIFN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RTdHJlYW0oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCwgc3Vic2NyaWJlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCBlPT4geyByZWplY3QoIGUgKSB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFBsYXliYWNrKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgb3B0aW9uczphbnkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5QbGF5YmFjayhudWxsLCBvcHRpb25zLCB0aGlzLl90b2tlbik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pXG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5TdHJlYW0odXJsOnN0cmluZz1udWxsLCBzdWJzY3JpYmU/OnN0cmluZywgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuU3RyZWFtLi4uLi4uLi4uJyk7ICBcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSwgdG9rZW4pOyAgXG4gICAgICAgIHJldHVybiB0cnVlOyAgICAgIFxuICAgIH0gICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChOTyBlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgb3BlblBsYXliYWNrKHVybDpzdHJpbmc9bnVsbCwgb3B0aW9ucz86YW55LCB0b2tlbj86c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ29wZW5QbGF5YmFjay4uLi4uLi4uLicpO1xuICAgICAgICBpZighdXJsKSB7ICAgICAvLyBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgZGlzY292ZXJlZCBlbmRwb2ludFxuICAgICAgICAgICAgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4oIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVybD0gdXJsLnJlcGxhY2UoJ3N0cmVhbScsICdwbGF5YmFjaycpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgbGV0IHBiPSAnJztcbiAgICAgICAgbGV0IHN1YnNjcmliZTogc3RyaW5nO1xuICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSdvYmplY3QnKXtcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMuc3RhcnRUaW1lKSA/ICc/c3RhcnRUaW1lPScgKyBvcHRpb25zLnN0YXJ0VGltZS5zbGljZSgwLG9wdGlvbnMuc3RhcnRUaW1lLmluZGV4T2YoJy4nKSkgKyAnWicgOiAnJztcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMucGxheWJhY2tSYXRlKSA/IGAmcGxheWJhY2tSYXRlPSR7b3B0aW9ucy5wbGF5YmFja1JhdGV9YCA6ICcnO1xuICAgICAgICAgICAgc3Vic2NyaWJlPSAob3B0aW9ucy5zdWJzY3JpYmUpID8gb3B0aW9ucy5zdWJzY3JpYmUgOiBudWxsOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsICsgcGIsIHN1YnNjcmliZSwgdG9rZW4pOyBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogcHJvY2VzcyBIZWxsbyByZXNwb25zZSBcbiAgICBwcml2YXRlIHByb2Nlc3NIZWxsbyhyZXNwb25zZTogYW55KSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlICYmIHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyBcbiAgICAgICAgICAgIHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHRoaXMuZmFsbGJhY2tFbmRwb2ludHMuZW5kcG9pbnRzO1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2UgJiYgcmVzcG9uc2VbJ3NlcnZlciddKSA/IFxuICAgICAgICAgICAgcmVzcG9uc2VbJ3NlcnZlciddIDogdGhpcy5mYWxsYmFja0VuZHBvaW50cy5zZXJ2ZXI7XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgICAgICB0aGlzLmFwaS5zZXJ2ZXI9IHRoaXMuc2VydmVyLmluZm87XG4gICAgICAgIHRoaXMuYXBwcy5lbmRwb2ludD0gdGhpcy5yZXNvbHZlQXBwc0VuZHBvaW50KCk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJuIHNpZ25hbGsgYXBwcyBhcGkgdXJsXG4gICAgcHJpdmF0ZSByZXNvbHZlQXBwc0VuZHBvaW50KCk6c3RyaW5nIHsgICAgICBcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuaW5mb1snaWQnXT09J3NpZ25hbGstc2VydmVyLW5vZGUnKSB7IFxuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vd2ViYXBwc2A7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCkucmVwbGFjZSgnYXBpJywnYXBwcycpO1xuICAgICAgICB9XG4gICAgfSBcblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHB1dCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTsgICBcblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwgKSB9XG4gICAgfVx0ICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuXG59XG4iXX0=