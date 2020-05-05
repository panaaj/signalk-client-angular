/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { SignalKHttp } from './http-api';
import { SignalKStream } from './stream-api';
import { SignalKApps } from './apps-api';
import { Path, Message } from './utils';
import { UUID } from './uuid';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./apps-api";
import * as i3 from "./http-api";
import * as i4 from "./stream-api";
/**
 * @record
 */
function Server_Info() { }
if (false) {
    /** @type {?} */
    Server_Info.prototype.endpoints;
    /** @type {?} */
    Server_Info.prototype.info;
    /** @type {?} */
    Server_Info.prototype.apiVersions;
}
/**
 * @record
 */
function JSON_Patch() { }
if (false) {
    /** @type {?} */
    JSON_Patch.prototype.op;
    /** @type {?} */
    JSON_Patch.prototype.path;
    /** @type {?} */
    JSON_Patch.prototype.value;
}
/** @enum {string} */
var APPDATA_CONTEXT = {
    USER: 'user',
    GLOBAL: 'global',
};
export { APPDATA_CONTEXT };
var SignalKClient = /** @class */ (function () {
    // *******************************************************
    function SignalKClient(http, apps, api, stream) {
        this.http = http;
        this.apps = apps;
        this.api = api;
        this.stream = stream;
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
    SignalKClient.prototype.connectAsPromise = 
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
                _this.getLoginStatus().subscribe((/**
                 * @param {?} r
                 * @return {?}
                 */
                function (r) { }));
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
        /** @type {?} */
        var sub = new Subject();
        this.debug('Contacting Signal K server.........');
        this.hello(hostname, port, useSSL).subscribe((
        // ** discover endpoints **
        /**
         * @param {?} response
         * @return {?}
         */
        function (// ** discover endpoints **
        response) {
            _this.getLoginStatus().subscribe((/**
             * @param {?} r
             * @return {?}
             */
            function (r) { }));
            if (_this.stream) {
                _this.stream.close();
            }
            _this.processHello(response);
            _this.api.endpoint = _this.resolveHttpEndpoint();
            _this.stream.endpoint = _this.resolveStreamEndpoint();
            sub.next(true);
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
                sub.next(true);
            }
            else {
                _this.disconnectedFromServer();
                sub.error(error);
            }
        }));
        return sub.asObservable();
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
    function () { this.stream.close(); };
    // ** Connect + open Delta Stream (endpoint discovery)
    // ** Connect + open Delta Stream (endpoint discovery)
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    SignalKClient.prototype.connectStreamAsPromise = 
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
            _this.connectAsPromise(hostname, port, useSSL)
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
        /** @type {?} */
        var sub = new Subject();
        this.connect(hostname, port, useSSL).subscribe((/**
         * @return {?}
         */
        function () {
            // ** connect to stream api at preferred version else fall back to default version
            /** @type {?} */
            var url = _this.resolveStreamEndpoint();
            if (!url) {
                sub.error(new Error('Server has no advertised Stream endpoints!'));
                return;
            }
            _this.stream.open(url, subscribe);
            sub.next(true);
        }), (/**
         * @param {?} e
         * @return {?}
         */
        function (e) { sub.error(e); }));
        return sub.asObservable();
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
    SignalKClient.prototype.connectPlaybackAsPromise = 
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
            _this.connectAsPromise(hostname, port, useSSL)
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
        /** @type {?} */
        var sub = new Subject();
        this.connect(hostname, port, useSSL).subscribe((/**
         * @return {?}
         */
        function () {
            // ** connect to playback api at preferred version else fall back to default version
            _this.openPlayback(null, options, _this._token);
            sub.next(true);
        }), (/**
         * @param {?} e
         * @return {?}
         */
        function (e) { sub.error(e); }));
        return sub.asObservable();
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
        /** @type {?} */
        var url = this.resolveHttpEndpoint().replace('api', 'apps');
        if (this.server && this.server.info.id == 'signalk-server-node') {
            /** @type {?} */
            var ver = this.server.info['version'].split('.');
            if (ver[1] < 26) { //use legacy link for older versions
                url = this.protocol + "://" + this.hostname + ":" + this.port + "/webapps";
            }
        }
        return url;
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
        if (path && path.length > 0 && path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        var url = this.protocol + "://" + this.hostname + ":" + this.port + "/" + Path.dotToSlash(path);
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
        var url = this.protocol + "://" + this.hostname + ":" + this.port + "/" + Path.dotToSlash(path);
        this.debug("put " + url);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.put(url, value, { headers: headers });
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
        if (path && path.length > 0 && path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        var url = this.protocol + "://" + this.hostname + ":" + this.port + "/" + Path.dotToSlash(path);
        this.debug("post " + url);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.post(url, value, { headers: headers });
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
        var sub = new Subject();
        ;
        /** @type {?} */
        var url = this.protocol + "://" + this.hostname + ":" + this.port + "/signalk/" + this._version + "/auth/logout";
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            this.http.put(url, null, { headers: headers, responseType: 'text' }).subscribe((/**
             * @return {?}
             */
            function () { sub.next(true); }), (/**
             * @return {?}
             */
            function () { sub.next(false); }));
        }
        else {
            this.http.put(url, null, { responseType: 'text' }).subscribe((/**
             * @return {?}
             */
            function () { sub.next(true); }), (/**
             * @return {?}
             */
            function () { sub.next(false); }));
        }
        return sub.asObservable();
    };
    // ** is a user authenticated to the server **
    // ** is a user authenticated to the server **
    /**
     * @return {?}
     */
    SignalKClient.prototype.isLoggedIn = 
    // ** is a user authenticated to the server **
    /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var sub = new Subject();
        this.getLoginStatus().subscribe((/**
         * @param {?} r
         * @return {?}
         */
        function (r) { sub.next(r.status == 'loggedIn' ? true : false); }), (/**
         * @return {?}
         */
        function () { sub.next(false); }));
        return sub.asObservable();
    };
    // ** fetch login status from server **
    // ** fetch login status from server **
    /**
     * @return {?}
     */
    SignalKClient.prototype.getLoginStatus = 
    // ** fetch login status from server **
    /**
     * @return {?}
     */
    function () { return this.get('/loginstatus'); };
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
    /**
     * @private
     * @param {?} context
     * @param {?} appId
     * @return {?}
     */
    SignalKClient.prototype.resolveAppDataEndpoint = /**
     * @private
     * @param {?} context
     * @param {?} appId
     * @return {?}
     */
    function (context, appId) {
        if (!context || !appId) {
            return null;
        }
        /** @type {?} */
        var url = this.resolveHttpEndpoint().replace('api', 'applicationData');
        return "" + url + context + "/" + appId + "/";
    };
    /**
     * @param {?} value
     * @return {?}
     */
    SignalKClient.prototype.setAppId = /**
     * @param {?} value
     * @return {?}
     */
    function (value) { this._appId = value; };
    /**
     * @param {?} value
     * @return {?}
     */
    SignalKClient.prototype.setAppVersion = /**
     * @param {?} value
     * @return {?}
     */
    function (value) { this._appVersion = value; };
    // ** get list of available versions of data stored **
    // ** get list of available versions of data stored **
    /**
     * @param {?=} context
     * @param {?=} appId
     * @return {?}
     */
    SignalKClient.prototype.appDataVersions = 
    // ** get list of available versions of data stored **
    /**
     * @param {?=} context
     * @param {?=} appId
     * @return {?}
     */
    function (context, appId) {
        if (context === void 0) { context = APPDATA_CONTEXT.USER; }
        if (appId === void 0) { appId = this._appId; }
        /** @type {?} */
        var url = this.resolveAppDataEndpoint(context, appId);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    };
    // ** get list of available keys for a stored path **
    // ** get list of available keys for a stored path **
    /**
     * @param {?=} path
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    SignalKClient.prototype.appDataKeys = 
    // ** get list of available keys for a stored path **
    /**
     * @param {?=} path
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    function (path, context, appId, version) {
        if (path === void 0) { path = ''; }
        if (context === void 0) { context = APPDATA_CONTEXT.USER; }
        if (appId === void 0) { appId = this._appId; }
        if (version === void 0) { version = this._appVersion; }
        path = (path.length != 0 && path[0] == '/') ? path.slice(1) : path;
        /** @type {?} */
        var url = this.resolveAppDataEndpoint(context, appId);
        url += version + "/" + path + "?keys=true";
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    };
    // ** get stored value at provided path **
    // ** get stored value at provided path **
    /**
     * @param {?=} path
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    SignalKClient.prototype.appDataGet = 
    // ** get stored value at provided path **
    /**
     * @param {?=} path
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    function (path, context, appId, version) {
        if (path === void 0) { path = ''; }
        if (context === void 0) { context = APPDATA_CONTEXT.USER; }
        if (appId === void 0) { appId = this._appId; }
        if (version === void 0) { version = this._appVersion; }
        path = (path.length != 0 && path[0] == '/') ? path.slice(1) : path;
        /** @type {?} */
        var url = this.resolveAppDataEndpoint(context, appId);
        url += version + "/" + path;
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    };
    // ** set stored value at provided path **
    // ** set stored value at provided path **
    /**
     * @param {?} path
     * @param {?} value
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    SignalKClient.prototype.appDataSet = 
    // ** set stored value at provided path **
    /**
     * @param {?} path
     * @param {?} value
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    function (path, value, context, appId, version) {
        if (context === void 0) { context = APPDATA_CONTEXT.USER; }
        if (appId === void 0) { appId = this._appId; }
        if (version === void 0) { version = this._appVersion; }
        if (!path) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        var ep = this.resolveAppDataEndpoint(context, appId);
        if (!ep) {
            return;
        }
        /** @type {?} */
        var url = "" + ep + version + "/" + Path.dotToSlash(path);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.post(url, value, { headers: headers });
        }
        else {
            return this.http.post(url, value);
        }
    };
    // ** update / patch stored values using Array of JSON patch objects **
    // ** update / patch stored values using Array of JSON patch objects **
    /**
     * @param {?} value
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    SignalKClient.prototype.appDataPatch = 
    // ** update / patch stored values using Array of JSON patch objects **
    /**
     * @param {?} value
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    function (value, context, appId, version) {
        if (context === void 0) { context = APPDATA_CONTEXT.USER; }
        if (appId === void 0) { appId = this._appId; }
        if (version === void 0) { version = this._appVersion; }
        /** @type {?} */
        var ep = this.resolveAppDataEndpoint(context, appId);
        if (!ep || !version) {
            return;
        }
        /** @type {?} */
        var url = "" + ep + version;
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.post(url, value, { headers: headers });
        }
        else {
            return this.http.post(url, value);
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
        { type: SignalKStream }
    ]; };
    /** @nocollapse */ SignalKClient.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.SignalKApps), i0.ɵɵinject(i3.SignalKHttp), i0.ɵɵinject(i4.SignalKStream)); }, token: SignalKClient, providedIn: "root" });
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
     * ****************************
     *  applicationData api methods
     * context: 'user' or 'global'
     * appId: application id string
     * *****************************
     * @type {?}
     * @private
     */
    SignalKClient.prototype._appId;
    /**
     * @type {?}
     * @private
     */
    SignalKClient.prototype._appVersion;
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
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQWtCLE1BQU0sTUFBTSxDQUFDO0FBRS9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM3QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7OztBQUU5QiwwQkFJQzs7O0lBSEcsZ0NBQWU7O0lBQ2YsMkJBQVU7O0lBQ1Ysa0NBQXdCOzs7OztBQUc1Qix5QkFJQzs7O0lBSEcsd0JBQTREOztJQUM1RCwwQkFBYTs7SUFDYiwyQkFBVzs7OztJQUlYLE1BQU0sTUFBTTtJQUNaLFFBQVEsUUFBUTs7O0FBR3BCO0lBdURJLDBEQUEwRDtJQUMxRCx1QkFBcUIsSUFBZ0IsRUFDbEIsSUFBaUIsRUFDakIsR0FBZ0IsRUFDaEIsTUFBcUI7UUFIbkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNsQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pCLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFDaEIsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQXBEaEMsYUFBUSxHQUFVLElBQUksQ0FBQyxDQUFNLGtDQUFrQzs7UUFNL0Qsc0JBQWlCLEdBQUU7WUFDdkIsU0FB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QUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFFLENBQUM7U0FDNUQ7YUFDSTtZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQUU7SUFDOUMsQ0FBQzs7Z0JBN2RKLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Ozs7Z0JBMUJ6QixVQUFVO2dCQUtWLFdBQVc7Z0JBRlgsV0FBVztnQkFDWCxhQUFhOzs7d0JBTHRCO0NBMGZDLEFBL2RELElBK2RDO1NBOWRZLGFBQWE7Ozs7OztJQUV0QixpQ0FBeUI7Ozs7O0lBQ3pCLDZCQUFxQjs7Ozs7SUFDckIsaUNBQXlCOzs7OztJQUV6QixpQ0FBK0I7Ozs7O0lBQy9CLCtCQUF1Qjs7Ozs7SUFLdkIsMENBR0U7O0lBS0YsK0JBSUM7O0lBR0QsaUNBQStCOzs7Ozs7Ozs7O0lBNFgvQiwrQkFBc0I7Ozs7O0lBQ3RCLG9DQUEyQjs7Ozs7SUFqV2QsNkJBQXdCOztJQUN6Qiw2QkFBd0I7O0lBQ3hCLDRCQUF1Qjs7SUFDdkIsK0JBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFNpZ25hbEtIdHRwIH0gZnJvbSAnLi9odHRwLWFwaSc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtIH0gZnJvbSAnLi9zdHJlYW0tYXBpJztcbmltcG9ydCB7IFNpZ25hbEtBcHBzIH0gZnJvbSAnLi9hcHBzLWFwaSc7XG5pbXBvcnQgeyBQYXRoLCBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi91dWlkJztcblxuaW50ZXJmYWNlIFNlcnZlcl9JbmZvIHtcbiAgICBlbmRwb2ludHM6IGFueTtcbiAgICBpbmZvOiBhbnksXG4gICAgYXBpVmVyc2lvbnM6IEFycmF5PGFueT47XG59XG5cbmludGVyZmFjZSBKU09OX1BhdGNoIHtcbiAgICBvcDogJ2FkZCcgfCAncmVwbGFjZScgfCAncmVtb3ZlJyB8ICdjb3B5JyB8ICdtb3ZlJyB8ICd0ZXN0JztcbiAgICBwYXRoOiBzdHJpbmc7XG4gICAgdmFsdWU6IGFueTtcbn1cblxuZXhwb3J0IGVudW0gQVBQREFUQV9DT05URVhUIHtcbiAgICBVU0VSPSAndXNlcicsXG4gICAgR0xPQkFMPSAnZ2xvYmFsJ1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gIFxuICAgIHByaXZhdGUgX3ZlcnNpb246IHN0cmluZz0gJ3YxJzsgICAgICAvLyAqKiBkZWZhdWx0IFNpZ25hbCBLIGFwaSB2ZXJzaW9uXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICBwcml2YXRlIGRlYnVnKHZhbDogYW55KSB7IGlmKGlzRGV2TW9kZSgpKXsgY29uc29sZS5sb2codmFsKSB9IH1cblxuICAgIC8vICoqIGVuZHBvaW50cyB0byBmYWxsYmFjayB0byBpZiBoZWxsbyByZXNwb25zZSBpcyBub3QgcmVjZWl2ZWQuXG4gICAgcHJpdmF0ZSBmYWxsYmFja0VuZHBvaW50cz0ge1xuICAgICAgICBlbmRwb2ludHM6IHsgdjE6IHsgfSB9LFxuICAgICAgICBzZXJ2ZXI6IHsgaWQgOiBcImZhbGxiYWNrXCIgfVxuICAgIH07ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKiAgXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwdWJsaWMgc2VydmVyOiBTZXJ2ZXJfSW5mbz0ge1xuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdXG4gICAgfSAgXG5cbiAgICAvLyAqKiBlbmRwb2ludHMgZmFsbGJhY2sgdG8gaG9zdCBhZGRyZXNzIHdoZW4gbm8gaGVsbG8gcmVzcG9uc2VcbiAgICBwdWJsaWMgZmFsbGJhY2s6Ym9vbGVhbj0gZmFsc2U7XG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuICAgIHNldCB2ZXJzaW9uKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGxldCB2OnN0cmluZz0gJ3YnKyB2YWw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmxlbmd0aD09MCkgeyBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249IHY7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgdG86ICR7dn1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249ICh0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5pbmRleE9mKHYpIT0tMSkgPyB2IDogdGhpcy5fdmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCByZXF1ZXN0OiAke3Z9LCByZXN1bHQ6ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyBcbiAgICAgICAgdGhpcy5fdG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5hcGkuYXV0aFRva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuc3RyZWFtLmF1dGhUb2tlbj0gdmFsO1xuICAgIH0gICAgXG4gICAgLy8gKiogTWVzc2FnZSBPYmplY3RcbiAgICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuIE1lc3NhZ2UgfVxuXG4gICAgLy8gKiogZ2VuZXJhdGUgYW5kIHJldHVybiBhIFVVSUQgb2JqZWN0XG4gICAgZ2V0IHV1aWQoKTpVVUlEIHsgcmV0dXJuIG5ldyBVVUlEKCkgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhcHBzOiBTaWduYWxLQXBwcyxcbiAgICAgICAgICAgICAgICBwdWJsaWMgYXBpOiBTaWduYWxLSHR0cCwgXG4gICAgICAgICAgICAgICAgcHVibGljIHN0cmVhbTogU2lnbmFsS1N0cmVhbSApIHsgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfSAgIFxuICAgIFxuICAgIC8vICoqIGluaXRpYWxpc2UgcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0IHZhbHVlc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9J2xvY2FsaG9zdCcsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH1gOyAgXG4gICAgICAgIHRoaXMuZmFsbGJhY2tFbmRwb2ludHMuZW5kcG9pbnRzLnYxWydzaWduYWxrLWh0dHAnXT0gYCR7dXJsfS9zaWduYWxrL3YxL2FwaS9gO1xuICAgICAgICB0aGlzLmZhbGxiYWNrRW5kcG9pbnRzLmVuZHBvaW50cy52MVsnc2lnbmFsay13cyddPSBgJHt1cmx9L3NpZ25hbGsvdjEvc3RyZWFtYDtcbiAgICB9ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OIEFORCBESVNDT1ZFUlkgICoqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZW5kcG9pbnQgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlciAoZW5kcG9pbnQgZGlzY292ZXJ5KSBhbmQgRE8gTk9UIG9wZW4gU3RyZWFtXG4gICAgY29ubmVjdEFzUHJvbWlzZShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpOlByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRMb2dpblN0YXR1cygpLnN1YnNjcmliZSggcj0+e30gKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5mYWxsYmFjaykgeyAvLyBmYWxsYmFjayBpZiBubyBoZWxsbyByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLmVuZHBvaW50PSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTsgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKTsgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyIChlbmRwb2ludCBkaXNjb3ZlcnkpIGFuZCBETyBOT1Qgb3BlbiBTdHJlYW1cbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSk6T2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbGV0IHN1YjogU3ViamVjdDxhbnk+PSBuZXcgU3ViamVjdCgpO1xuICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmhlbGxvKGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpLnN1YnNjcmliZSggICAgLy8gKiogZGlzY292ZXIgZW5kcG9pbnRzICoqXG4gICAgICAgICAgICByZXNwb25zZT0+IHsgXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRMb2dpblN0YXR1cygpLnN1YnNjcmliZSggcj0+e30gKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0cmVhbSkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLmVuZHBvaW50PSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgIHN1Yi5uZXh0KHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICBpZih0aGlzLmZhbGxiYWNrKSB7IC8vIGZhbGxiYWNrIGlmIG5vIGhlbGxvIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgc3ViLm5leHQodHJ1ZSk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpOyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc3ViLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBzdWIuYXNPYnNlcnZhYmxlKCk7XG4gICAgfSAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKX0gXG4gICAgXG4gICAgLy8gKiogQ29ubmVjdCArIG9wZW4gRGVsdGEgU3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFN0cmVhbUFzUHJvbWlzZShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCk6UHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdEFzUHJvbWlzZShob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCwgc3Vic2NyaWJlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCBlPT4geyByZWplY3QoIGUgKSB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBcblxuICAgIC8vICoqIENvbm5lY3QgKyBvcGVuIERlbHRhIFN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RTdHJlYW0oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpOk9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGxldCBzdWI6IFN1YmplY3Q8YW55Pj0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpLnN1YnNjcmliZSggXG4gICAgICAgICAgICAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgc3ViLmVycm9yKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgc3ViLm5leHQoIHRydWUgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlPT4geyBzdWIuZXJyb3IoIGUgKSB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBzdWIuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0UGxheWJhY2tBc1Byb21pc2UoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBvcHRpb25zOmFueSk6UHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdEFzUHJvbWlzZShob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5QbGF5YmFjayhudWxsLCBvcHRpb25zLCB0aGlzLl90b2tlbik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0UGxheWJhY2soaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBvcHRpb25zOmFueSk6T2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbGV0IHN1YjogU3ViamVjdDxhbnk+PSBuZXcgU3ViamVjdCgpO1xuICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCBcbiAgICAgICAgICAgICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5QbGF5YmFjayhudWxsLCBvcHRpb25zLCB0aGlzLl90b2tlbik7XG4gICAgICAgICAgICAgICAgc3ViLm5leHQoIHRydWUgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlPT4geyBzdWIuZXJyb3IoIGUgKSB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBzdWIuYXNPYnNlcnZhYmxlKCk7XG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5TdHJlYW0odXJsOnN0cmluZz1udWxsLCBzdWJzY3JpYmU/OnN0cmluZywgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuU3RyZWFtLi4uLi4uLi4uJyk7ICBcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSwgdG9rZW4pOyAgXG4gICAgICAgIHJldHVybiB0cnVlOyAgICAgIFxuICAgIH0gICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChOTyBlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgb3BlblBsYXliYWNrKHVybDpzdHJpbmc9bnVsbCwgb3B0aW9ucz86YW55LCB0b2tlbj86c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ29wZW5QbGF5YmFjay4uLi4uLi4uLicpO1xuICAgICAgICBpZighdXJsKSB7ICAgICAvLyBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgZGlzY292ZXJlZCBlbmRwb2ludFxuICAgICAgICAgICAgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4oIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVybD0gdXJsLnJlcGxhY2UoJ3N0cmVhbScsICdwbGF5YmFjaycpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgbGV0IHBiPSAnJztcbiAgICAgICAgbGV0IHN1YnNjcmliZTogc3RyaW5nO1xuICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSdvYmplY3QnKXtcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMuc3RhcnRUaW1lKSA/ICc/c3RhcnRUaW1lPScgKyBvcHRpb25zLnN0YXJ0VGltZS5zbGljZSgwLG9wdGlvbnMuc3RhcnRUaW1lLmluZGV4T2YoJy4nKSkgKyAnWicgOiAnJztcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMucGxheWJhY2tSYXRlKSA/IGAmcGxheWJhY2tSYXRlPSR7b3B0aW9ucy5wbGF5YmFja1JhdGV9YCA6ICcnO1xuICAgICAgICAgICAgc3Vic2NyaWJlPSAob3B0aW9ucy5zdWJzY3JpYmUpID8gb3B0aW9ucy5zdWJzY3JpYmUgOiBudWxsOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsICsgcGIsIHN1YnNjcmliZSwgdG9rZW4pOyBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogcHJvY2VzcyBIZWxsbyByZXNwb25zZSBcbiAgICBwcml2YXRlIHByb2Nlc3NIZWxsbyhyZXNwb25zZTogYW55KSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlICYmIHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyBcbiAgICAgICAgICAgIHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHRoaXMuZmFsbGJhY2tFbmRwb2ludHMuZW5kcG9pbnRzO1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2UgJiYgcmVzcG9uc2VbJ3NlcnZlciddKSA/IFxuICAgICAgICAgICAgcmVzcG9uc2VbJ3NlcnZlciddIDogdGhpcy5mYWxsYmFja0VuZHBvaW50cy5zZXJ2ZXI7XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgICAgICB0aGlzLmFwaS5zZXJ2ZXI9IHRoaXMuc2VydmVyLmluZm87XG4gICAgICAgIHRoaXMuYXBwcy5lbmRwb2ludD0gdGhpcy5yZXNvbHZlQXBwc0VuZHBvaW50KCk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJuIHNpZ25hbGsgYXBwcyBhcGkgdXJsXG4gICAgcHJpdmF0ZSByZXNvbHZlQXBwc0VuZHBvaW50KCk6c3RyaW5nIHsgICAgICBcbiAgICAgICAgbGV0IHVybDpzdHJpbmc9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpLnJlcGxhY2UoJ2FwaScsJ2FwcHMnKTsgIFxuICAgICAgICBpZih0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5pbmZvLmlkPT0nc2lnbmFsay1zZXJ2ZXItbm9kZScpIHsgXG4gICAgICAgICAgICBsZXQgdmVyPSB0aGlzLnNlcnZlci5pbmZvWyd2ZXJzaW9uJ10uc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmKHZlclsxXTwyNikgeyAvL3VzZSBsZWdhY3kgbGluayBmb3Igb2xkZXIgdmVyc2lvbnNcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vd2ViYXBwc2A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9IFxuXG4gICAgLy8gKiogcmV0dXJuIHByZWZlcnJlZCBXUyBzdHJlYW0gdXJsXG4gICAgcHVibGljIHJlc29sdmVTdHJlYW1FbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXSkge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyBlbmRwb2ludCB2ZXJzaW9uOiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ119YDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXSkgeyBcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gZmFsbGluZyBiYWNrIHRvOiB2MWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddfWAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBudWxsIH1cbiAgICB9ICBcblxuICAgIC8vICoqIHJldHVybiBzaWduYWxrLWh0dHAgZW5kcG9pbnQgdXJsXG4gICAgcHJpdmF0ZSByZXNvbHZlSHR0cEVuZHBvaW50KCk6c3RyaW5nIHtcbiAgICAgICAgbGV0IHVybDogc3RyaW5nO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0pIHsgLy8gKiogY29ubmVjdGlvbiBtYWRlXG4gICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIGh0dHAgZW5kcG9pbnQgYXQgcHJlc2NyaWJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXSkge1xuICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLWh0dHAnXX1gIH0gICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbXNnPSAnTm8gY3VycmVudCBjb25uZWN0aW9uIGh0dHAgZW5kcG9pbnQgc2VydmljZSEgVXNlIGNvbm5lY3QoKSB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uLidcbiAgICAgICAgICAgIHRoaXMuZGVidWcobXNnKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHVybDsgICBcbiAgICB9ICAgIFxuICAgIFxuICAgIC8vICoqIGNsZWFudXAgb24gc2VydmVyIGRpc2Nvbm5lY3Rpb25cbiAgICBwcml2YXRlIGRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gW107ICBcbiAgICB9XG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBwYXRoXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBpZihwYXRoICYmIHBhdGgubGVuZ3RoPjAgJiYgcGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9LyR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwdXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgdmFsdWUsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07XG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwb3N0IHRvIGh0dHAgcGF0aFxuICAgIHBvc3QocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgaWYocGF0aCAmJiBwYXRoLmxlbmd0aD4wICYmIHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB2YWx1ZSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07ICAgXG5cbiAgICAvLyAqKiBnZXQgYXV0aCB0b2tlbiBmb3Igc3VwcGxpZWQgdXNlciBkZXRhaWxzICoqXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgYGFwcGxpY2F0aW9uL2pzb25gKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXHRcbiAgICAvLyAqKiBsb2dvdXQgZnJvbSBzZXJ2ZXIgKipcbiAgICBsb2dvdXQoKTpPYnNlcnZhYmxlPGJvb2xlYW4+IHsgXG4gICAgICAgIGxldCBzdWI6IFN1YmplY3Q8Ym9vbGVhbj49IG5ldyBTdWJqZWN0KCk7O1xuXHRcdGxldCB1cmw9YCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dvdXRgO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gfSApO1xuICAgICAgICAgICAgdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnM6IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0gKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKCk9PiB7IHN1Yi5uZXh0KHRydWUpIH0sXG4gICAgICAgICAgICAgICAgKCk9PiB7IHN1Yi5uZXh0KGZhbHNlKSB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7cmVzcG9uc2VUeXBlOiAndGV4dCd9ICkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICgpPT4geyBzdWIubmV4dCh0cnVlKSB9LFxuICAgICAgICAgICAgICAgICgpPT4geyBzdWIubmV4dChmYWxzZSkgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cdCAgXG4gICAgXG4gICAgLy8gKiogaXMgYSB1c2VyIGF1dGhlbnRpY2F0ZWQgdG8gdGhlIHNlcnZlciAqKlxuICAgIGlzTG9nZ2VkSW4oKTpPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgbGV0IHN1YjogU3ViamVjdDxib29sZWFuPj0gbmV3IFN1YmplY3QoKTsgICAgXG4gICAgICAgIHRoaXMuZ2V0TG9naW5TdGF0dXMoKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICByPT4geyBzdWIubmV4dCggci5zdGF0dXM9PSdsb2dnZWRJbicgPyB0cnVlIDogZmFsc2UgKSB9LFxuICAgICAgICAgICAgKCk9PiB7IHN1Yi5uZXh0KGZhbHNlKSB9IFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gc3ViLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cbiAgICAvLyAqKiBmZXRjaCBsb2dpbiBzdGF0dXMgZnJvbSBzZXJ2ZXIgKipcbiAgICBnZXRMb2dpblN0YXR1cygpOk9ic2VydmFibGU8YW55PiB7IHJldHVybiB0aGlzLmdldCgnL2xvZ2luc3RhdHVzJykgfSAgICBcbiAgICBcbiAgICAvLyoqIGdldCBkYXRhIHZpYSB0aGUgc25hcHNob3QgaHR0cCBhcGkgcGF0aCBmb3Igc3VwcGxpZWQgdGltZVxuICAgIHNuYXBzaG90KGNvbnRleHQ6c3RyaW5nLCB0aW1lOnN0cmluZykgeyBcbiAgICAgICAgaWYoIXRpbWUpIHsgcmV0dXJuIH1cbiAgICAgICAgdGltZT0gdGltZS5zbGljZSgwLHRpbWUuaW5kZXhPZignLicpKSArICdaJztcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgdXJsPSBgJHt1cmwucmVwbGFjZSgnYXBpJywnc25hcHNob3QnKX0ke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0/dGltZT0ke3RpbWV9YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cbiAgICB9XG4gICAgXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiAgYXBwbGljYXRpb25EYXRhIGFwaSBtZXRob2RzIFxuICAgICAqIGNvbnRleHQ6ICd1c2VyJyBvciAnZ2xvYmFsJ1xuICAgICAqIGFwcElkOiBhcHBsaWNhdGlvbiBpZCBzdHJpbmdcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBwcml2YXRlIF9hcHBJZDpzdHJpbmc7XG4gICAgcHJpdmF0ZSBfYXBwVmVyc2lvbjpzdHJpbmc7XG5cbiAgICBwcml2YXRlIHJlc29sdmVBcHBEYXRhRW5kcG9pbnQoY29udGV4dDpBUFBEQVRBX0NPTlRFWFQsIGFwcElkOnN0cmluZykge1xuICAgICAgICBpZighY29udGV4dCB8fCAhYXBwSWQpIHsgcmV0dXJuIG51bGwgfVxuICAgICAgICBsZXQgdXJsOnN0cmluZz0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCkucmVwbGFjZSgnYXBpJywnYXBwbGljYXRpb25EYXRhJyk7XG4gICAgICAgIHJldHVybiBgJHt1cmx9JHtjb250ZXh0fS8ke2FwcElkfS9gO1xuICAgIH1cblxuICAgIHNldEFwcElkKHZhbHVlOnN0cmluZykgeyB0aGlzLl9hcHBJZD0gdmFsdWUgfVxuICAgIHNldEFwcFZlcnNpb24odmFsdWU6c3RyaW5nKSB7IHRoaXMuX2FwcFZlcnNpb249IHZhbHVlIH1cblxuICAgIC8vICoqIGdldCBsaXN0IG9mIGF2YWlsYWJsZSB2ZXJzaW9ucyBvZiBkYXRhIHN0b3JlZCAqKlxuICAgIGFwcERhdGFWZXJzaW9ucyhjb250ZXh0OkFQUERBVEFfQ09OVEVYVD0gQVBQREFUQV9DT05URVhULlVTRVIsIGFwcElkOnN0cmluZz0gdGhpcy5fYXBwSWQpIHtcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlQXBwRGF0YUVuZHBvaW50KGNvbnRleHQsIGFwcElkKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgIFxuICAgIH1cbiAgICAvLyAqKiBnZXQgbGlzdCBvZiBhdmFpbGFibGUga2V5cyBmb3IgYSBzdG9yZWQgcGF0aCAqKlxuICAgIGFwcERhdGFLZXlzKHBhdGg6c3RyaW5nPScnLCBjb250ZXh0OkFQUERBVEFfQ09OVEVYVD0gQVBQREFUQV9DT05URVhULlVTRVIsIGFwcElkOnN0cmluZz0gdGhpcy5fYXBwSWQsIHZlcnNpb246c3RyaW5nPSB0aGlzLl9hcHBWZXJzaW9uKSB7XG4gICAgICAgIHBhdGg9IChwYXRoLmxlbmd0aCE9MCAmJiBwYXRoWzBdPT0nLycpID8gcGF0aC5zbGljZSgxKSA6IHBhdGg7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUFwcERhdGFFbmRwb2ludChjb250ZXh0LCBhcHBJZCk7XG4gICAgICAgIHVybCs9IGAke3ZlcnNpb259LyR7cGF0aH0/a2V5cz10cnVlYDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgIFxuICAgIH0gICAgXG5cbiAgICAvLyAqKiBnZXQgc3RvcmVkIHZhbHVlIGF0IHByb3ZpZGVkIHBhdGggKipcbiAgICBhcHBEYXRhR2V0KHBhdGg6c3RyaW5nPScnLCBjb250ZXh0OkFQUERBVEFfQ09OVEVYVD0gQVBQREFUQV9DT05URVhULlVTRVIsIGFwcElkOnN0cmluZz0gdGhpcy5fYXBwSWQsIHZlcnNpb246c3RyaW5nPSB0aGlzLl9hcHBWZXJzaW9uKSB7XG4gICAgICAgIHBhdGg9IChwYXRoLmxlbmd0aCE9MCAmJiBwYXRoWzBdPT0nLycpID8gcGF0aC5zbGljZSgxKSA6IHBhdGg7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUFwcERhdGFFbmRwb2ludChjb250ZXh0LCBhcHBJZCk7XG4gICAgICAgIHVybCs9IGAke3ZlcnNpb259LyR7cGF0aH1gO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfSAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogc2V0IHN0b3JlZCB2YWx1ZSBhdCBwcm92aWRlZCBwYXRoICoqXG4gICAgYXBwRGF0YVNldChwYXRoOnN0cmluZywgdmFsdWU6YW55LCBjb250ZXh0OkFQUERBVEFfQ09OVEVYVD0gQVBQREFUQV9DT05URVhULlVTRVIsIGFwcElkOnN0cmluZz0gdGhpcy5fYXBwSWQsIHZlcnNpb246c3RyaW5nPSB0aGlzLl9hcHBWZXJzaW9uKSB7XG4gICAgICAgIGlmKCFwYXRoKSB7IHJldHVybiB9XG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgbGV0IGVwPSB0aGlzLnJlc29sdmVBcHBEYXRhRW5kcG9pbnQoY29udGV4dCwgYXBwSWQpO1xuICAgICAgICBpZighZXApIHsgcmV0dXJuIH1cbiAgICAgICAgbGV0IHVybD0gYCR7ZXB9JHt2ZXJzaW9ufS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKSB9XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiB1cGRhdGUgLyBwYXRjaCBzdG9yZWQgdmFsdWVzIHVzaW5nIEFycmF5IG9mIEpTT04gcGF0Y2ggb2JqZWN0cyAqKlxuICAgIGFwcERhdGFQYXRjaCh2YWx1ZTpBcnJheTxKU09OX1BhdGNoPiwgY29udGV4dDpBUFBEQVRBX0NPTlRFWFQ9IEFQUERBVEFfQ09OVEVYVC5VU0VSLCBhcHBJZDpzdHJpbmc9IHRoaXMuX2FwcElkLCB2ZXJzaW9uOnN0cmluZz0gdGhpcy5fYXBwVmVyc2lvbikge1xuICAgICAgICBsZXQgZXA9IHRoaXMucmVzb2x2ZUFwcERhdGFFbmRwb2ludChjb250ZXh0LCBhcHBJZCk7XG4gICAgICAgIGlmKCFlcCB8fCAhdmVyc2lvbiApIHsgcmV0dXJuIH1cbiAgICAgICAgbGV0IHVybD0gYCR7ZXB9JHt2ZXJzaW9ufWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpIH1cbiAgICB9ICAgIFxuXG59XG4iXX0=