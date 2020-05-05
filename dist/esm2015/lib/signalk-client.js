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
const APPDATA_CONTEXT = {
    USER: 'user',
    GLOBAL: 'global',
};
export { APPDATA_CONTEXT };
export class SignalKClient {
    // *******************************************************
    /**
     * @param {?} http
     * @param {?} apps
     * @param {?} api
     * @param {?} stream
     */
    constructor(http, apps, api, stream) {
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
    debug(val) { if (isDevMode()) {
        console.log(val);
    } }
    // ** get / set Signal K preferred api version to use **
    /**
     * @return {?}
     */
    get version() { return parseInt(this._version.slice(1)); }
    /**
     * @param {?} val
     * @return {?}
     */
    set version(val) {
        /** @type {?} */
        let v = 'v' + val;
        if (this.server.apiVersions.length == 0) {
            this._version = v;
            this.debug(`Signal K api version set to: ${v}`);
        }
        else {
            this._version = (this.server.apiVersions.indexOf(v) != -1) ? v : this._version;
            this.debug(`Signal K api version set request: ${v}, result: ${this._version}`);
        }
    }
    // ** set auth token value **
    /**
     * @param {?} val
     * @return {?}
     */
    set authToken(val) {
        this._token = val;
        this.api.authToken = val;
        this.stream.authToken = val;
    }
    // ** Message Object
    /**
     * @return {?}
     */
    get message() { return Message; }
    // ** generate and return a UUID object
    /**
     * @return {?}
     */
    get uuid() { return new UUID(); }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.stream.close(); }
    // ** initialise protocol, hostname, port values
    /**
     * @private
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @return {?}
     */
    init(hostname = 'localhost', port = null, useSSL = false) {
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
        let url = `${this.protocol}://${this.hostname}:${this.port}`;
        this.fallbackEndpoints.endpoints.v1['signalk-http'] = `${url}/signalk/v1/api/`;
        this.fallbackEndpoints.endpoints.v1['signalk-ws'] = `${url}/signalk/v1/stream`;
    }
    // **************** CONNECTION AND DISCOVERY  ********************
    // ** Signal K server endpoint discovery request (/signalk).  
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @return {?}
     */
    hello(hostname = null, port = null, useSSL = false) {
        this.init(hostname, port, useSSL);
        return this.get('/signalk');
    }
    // ** connect to server (endpoint discovery) and DO NOT open Stream
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @return {?}
     */
    connectAsPromise(hostname = null, port = null, useSSL = false) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.debug('Contacting Signal K server.........');
            this.hello(hostname, port, useSSL).subscribe((
            // ** discover endpoints **
            /**
             * @param {?} response
             * @return {?}
             */
            // ** discover endpoints **
            response => {
                this.getLoginStatus().subscribe((/**
                 * @param {?} r
                 * @return {?}
                 */
                r => { }));
                if (this.stream) {
                    this.stream.close();
                }
                this.processHello(response);
                this.api.endpoint = this.resolveHttpEndpoint();
                this.stream.endpoint = this.resolveStreamEndpoint();
                resolve(true);
            }), (/**
             * @param {?} error
             * @return {?}
             */
            error => {
                if (this.fallback) { // fallback if no hello response
                    if (this.stream) {
                        this.stream.close();
                    }
                    this.processHello(null);
                    this.api.endpoint = this.resolveHttpEndpoint();
                    this.stream.endpoint = this.resolveStreamEndpoint();
                    resolve(true);
                }
                else {
                    this.disconnectedFromServer();
                    reject(error);
                }
            }));
        }));
    }
    // ** connect to server (endpoint discovery) and DO NOT open Stream
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @return {?}
     */
    connect(hostname = null, port = null, useSSL = false) {
        /** @type {?} */
        let sub = new Subject();
        this.debug('Contacting Signal K server.........');
        this.hello(hostname, port, useSSL).subscribe((
        // ** discover endpoints **
        /**
         * @param {?} response
         * @return {?}
         */
        // ** discover endpoints **
        response => {
            this.getLoginStatus().subscribe((/**
             * @param {?} r
             * @return {?}
             */
            r => { }));
            if (this.stream) {
                this.stream.close();
            }
            this.processHello(response);
            this.api.endpoint = this.resolveHttpEndpoint();
            this.stream.endpoint = this.resolveStreamEndpoint();
            sub.next(true);
        }), (/**
         * @param {?} error
         * @return {?}
         */
        error => {
            if (this.fallback) { // fallback if no hello response
                if (this.stream) {
                    this.stream.close();
                }
                this.processHello(null);
                this.api.endpoint = this.resolveHttpEndpoint();
                this.stream.endpoint = this.resolveStreamEndpoint();
                sub.next(true);
            }
            else {
                this.disconnectedFromServer();
                sub.error(error);
            }
        }));
        return sub.asObservable();
    }
    // ** disconnect from server
    /**
     * @return {?}
     */
    disconnect() { this.stream.close(); }
    // ** Connect + open Delta Stream (endpoint discovery)
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    connectStreamAsPromise(hostname = null, port = null, useSSL = false, subscribe = null) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.connectAsPromise(hostname, port, useSSL)
                .then((/**
             * @return {?}
             */
            () => {
                // ** connect to stream api at preferred version else fall back to default version
                /** @type {?} */
                let url = this.resolveStreamEndpoint();
                if (!url) {
                    reject(new Error('Server has no advertised Stream endpoints!'));
                    return;
                }
                this.stream.open(url, subscribe);
                resolve(true);
            }))
                .catch((/**
             * @param {?} e
             * @return {?}
             */
            e => { reject(e); }));
        }));
    }
    // ** Connect + open Delta Stream (endpoint discovery)
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    connectStream(hostname = null, port = null, useSSL = false, subscribe = null) {
        /** @type {?} */
        let sub = new Subject();
        this.connect(hostname, port, useSSL).subscribe((/**
         * @return {?}
         */
        () => {
            // ** connect to stream api at preferred version else fall back to default version
            /** @type {?} */
            let url = this.resolveStreamEndpoint();
            if (!url) {
                sub.error(new Error('Server has no advertised Stream endpoints!'));
                return;
            }
            this.stream.open(url, subscribe);
            sub.next(true);
        }), (/**
         * @param {?} e
         * @return {?}
         */
        e => { sub.error(e); }));
        return sub.asObservable();
    }
    // ** connect to playback stream (endpoint discovery)
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} options
     * @return {?}
     */
    connectPlaybackAsPromise(hostname = null, port = null, useSSL = false, options) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.connectAsPromise(hostname, port, useSSL)
                .then((/**
             * @return {?}
             */
            () => {
                // ** connect to playback api at preferred version else fall back to default version
                this.openPlayback(null, options, this._token);
                resolve(true);
            }))
                .catch((/**
             * @param {?} e
             * @return {?}
             */
            e => { reject(e); }));
        }));
    }
    // ** connect to playback stream (endpoint discovery)
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} options
     * @return {?}
     */
    connectPlayback(hostname = null, port = null, useSSL = false, options) {
        /** @type {?} */
        let sub = new Subject();
        this.connect(hostname, port, useSSL).subscribe((/**
         * @return {?}
         */
        () => {
            // ** connect to playback api at preferred version else fall back to default version
            this.openPlayback(null, options, this._token);
            sub.next(true);
        }), (/**
         * @param {?} e
         * @return {?}
         */
        e => { sub.error(e); }));
        return sub.asObservable();
    }
    // ** connect to delta stream with (NO endpoint discovery)
    /**
     * @param {?=} url
     * @param {?=} subscribe
     * @param {?=} token
     * @return {?}
     */
    openStream(url = null, subscribe, token) {
        this.debug('openStream.........');
        if (!url) { // connect to stream api at discovered endpoint
            url = this.resolveStreamEndpoint();
            if (!url) {
                return (new Error('Server has no advertised Stream endpoints!'));
            }
        }
        this.stream.open(url, subscribe, token);
        return true;
    }
    // ** connect to playback stream (NO endpoint discovery)
    /**
     * @param {?=} url
     * @param {?=} options
     * @param {?=} token
     * @return {?}
     */
    openPlayback(url = null, options, token) {
        this.debug('openPlayback.........');
        if (!url) { // connect to stream api at discovered endpoint
            url = this.resolveStreamEndpoint();
            if (!url) {
                return (new Error('Server has no advertised Stream endpoints!'));
            }
            url = url.replace('stream', 'playback');
        }
        /** @type {?} */
        let pb = '';
        /** @type {?} */
        let subscribe;
        if (options && typeof options === 'object') {
            pb += (options.startTime) ? '?startTime=' + options.startTime.slice(0, options.startTime.indexOf('.')) + 'Z' : '';
            pb += (options.playbackRate) ? `&playbackRate=${options.playbackRate}` : '';
            subscribe = (options.subscribe) ? options.subscribe : null;
        }
        this.stream.open(url + pb, subscribe, token);
        return true;
    }
    // ** process Hello response 
    /**
     * @private
     * @param {?} response
     * @return {?}
     */
    processHello(response) {
        this.server.endpoints = (response && response['endpoints']) ?
            response['endpoints'] : this.fallbackEndpoints.endpoints;
        this.server.info = (response && response['server']) ?
            response['server'] : this.fallbackEndpoints.server;
        this.server.apiVersions = (this.server.endpoints) ? Object.keys(this.server.endpoints) : [];
        this.debug(this.server.endpoints);
        this.api.server = this.server.info;
        this.apps.endpoint = this.resolveAppsEndpoint();
    }
    // ** return signalk apps api url
    /**
     * @private
     * @return {?}
     */
    resolveAppsEndpoint() {
        /** @type {?} */
        let url = this.resolveHttpEndpoint().replace('api', 'apps');
        if (this.server && this.server.info.id == 'signalk-server-node') {
            /** @type {?} */
            let ver = this.server.info['version'].split('.');
            if (ver[1] < 26) { //use legacy link for older versions
                url = `${this.protocol}://${this.hostname}:${this.port}/webapps`;
            }
        }
        return url;
    }
    // ** return preferred WS stream url
    /**
     * @return {?}
     */
    resolveStreamEndpoint() {
        if (this.server.endpoints[this._version] && this.server.endpoints[this._version]['signalk-ws']) {
            this.debug(`Connecting endpoint version: ${this._version}`);
            return `${this.server.endpoints[this._version]['signalk-ws']}`;
        }
        else if (this.server.endpoints['v1'] && this.server.endpoints['v1']['signalk-ws']) {
            this.debug(`Connection falling back to: v1`);
            return `${this.server.endpoints['v1']['signalk-ws']}`;
        }
        else {
            return null;
        }
    }
    // ** return signalk-http endpoint url
    /**
     * @private
     * @return {?}
     */
    resolveHttpEndpoint() {
        /** @type {?} */
        let url;
        if (this.server.endpoints[this._version]) { // ** connection made
            // ** connect to http endpoint at prescribed version else fall back to default version
            if (this.server.endpoints[this._version]['signalk-http']) {
                url = `${this.server.endpoints[this._version]['signalk-http']}`;
            }
            else {
                url = `${this.server.endpoints['v1']['signalk-http']}`;
            }
        }
        else {
            /** @type {?} */
            let msg = 'No current connection http endpoint service! Use connect() to establish a connection.';
            this.debug(msg);
        }
        return url;
    }
    // ** cleanup on server disconnection
    /**
     * @private
     * @return {?}
     */
    disconnectedFromServer() {
        this.server.endpoints = {};
        this.server.info = {};
        this.server.apiVersions = [];
    }
    //** return observable response from http path
    /**
     * @param {?} path
     * @return {?}
     */
    get(path) {
        if (path && path.length > 0 && path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}/${Path.dotToSlash(path)}`;
        this.debug(`get ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    }
    ;
    //** return observable response for put to http path
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    put(path, value) {
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}/${Path.dotToSlash(path)}`;
        this.debug(`put ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.put(url, value, { headers: headers });
        }
        else {
            return this.http.put(url, value);
        }
    }
    ;
    //** return observable response for post to http path
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    post(path, value) {
        if (path && path.length > 0 && path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}/${Path.dotToSlash(path)}`;
        this.debug(`post ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.post(url, value, { headers: headers });
        }
        else {
            return this.http.post(url, value);
        }
    }
    ;
    // ** get auth token for supplied user details **
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    login(username, password) {
        /** @type {?} */
        let headers = new HttpHeaders().set('Content-Type', `application/json`);
        return this.http.post(`${this.protocol}://${this.hostname}:${this.port}/signalk/${this._version}/auth/login`, { "username": username, "password": password }, { headers });
    }
    // ** logout from server **
    /**
     * @return {?}
     */
    logout() {
        /** @type {?} */
        let sub = new Subject();
        ;
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}/signalk/${this._version}/auth/logout`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            this.http.put(url, null, { headers: headers, responseType: 'text' }).subscribe((/**
             * @return {?}
             */
            () => { sub.next(true); }), (/**
             * @return {?}
             */
            () => { sub.next(false); }));
        }
        else {
            this.http.put(url, null, { responseType: 'text' }).subscribe((/**
             * @return {?}
             */
            () => { sub.next(true); }), (/**
             * @return {?}
             */
            () => { sub.next(false); }));
        }
        return sub.asObservable();
    }
    // ** is a user authenticated to the server **
    /**
     * @return {?}
     */
    isLoggedIn() {
        /** @type {?} */
        let sub = new Subject();
        this.getLoginStatus().subscribe((/**
         * @param {?} r
         * @return {?}
         */
        r => { sub.next(r.status == 'loggedIn' ? true : false); }), (/**
         * @return {?}
         */
        () => { sub.next(false); }));
        return sub.asObservable();
    }
    // ** fetch login status from server **
    /**
     * @return {?}
     */
    getLoginStatus() { return this.get('/loginstatus'); }
    //** get data via the snapshot http api path for supplied time
    /**
     * @param {?} context
     * @param {?} time
     * @return {?}
     */
    snapshot(context, time) {
        if (!time) {
            return;
        }
        time = time.slice(0, time.indexOf('.')) + 'Z';
        /** @type {?} */
        let url = this.resolveHttpEndpoint();
        if (!url) {
            return;
        }
        url = `${url.replace('api', 'snapshot')}${Path.contextToPath(context)}?time=${time}`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    }
    /**
     * @private
     * @param {?} context
     * @param {?} appId
     * @return {?}
     */
    resolveAppDataEndpoint(context, appId) {
        if (!context || !appId) {
            return null;
        }
        /** @type {?} */
        let url = this.resolveHttpEndpoint().replace('api', 'applicationData');
        return `${url}${context}/${appId}/`;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setAppId(value) { this._appId = value; }
    /**
     * @param {?} value
     * @return {?}
     */
    setAppVersion(value) { this._appVersion = value; }
    // ** get list of available versions of data stored **
    /**
     * @param {?=} context
     * @param {?=} appId
     * @return {?}
     */
    appDataVersions(context = APPDATA_CONTEXT.USER, appId = this._appId) {
        /** @type {?} */
        let url = this.resolveAppDataEndpoint(context, appId);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    }
    // ** get list of available keys for a stored path **
    /**
     * @param {?=} path
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    appDataKeys(path = '', context = APPDATA_CONTEXT.USER, appId = this._appId, version = this._appVersion) {
        path = (path.length != 0 && path[0] == '/') ? path.slice(1) : path;
        /** @type {?} */
        let url = this.resolveAppDataEndpoint(context, appId);
        url += `${version}/${path}?keys=true`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    }
    // ** get stored value at provided path **
    /**
     * @param {?=} path
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    appDataGet(path = '', context = APPDATA_CONTEXT.USER, appId = this._appId, version = this._appVersion) {
        path = (path.length != 0 && path[0] == '/') ? path.slice(1) : path;
        /** @type {?} */
        let url = this.resolveAppDataEndpoint(context, appId);
        url += `${version}/${path}`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    }
    // ** set stored value at provided path **
    /**
     * @param {?} path
     * @param {?} value
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    appDataSet(path, value, context = APPDATA_CONTEXT.USER, appId = this._appId, version = this._appVersion) {
        if (!path) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        let ep = this.resolveAppDataEndpoint(context, appId);
        if (!ep) {
            return;
        }
        /** @type {?} */
        let url = `${ep}${version}/${Path.dotToSlash(path)}`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.post(url, value, { headers: headers });
        }
        else {
            return this.http.post(url, value);
        }
    }
    // ** update / patch stored values using Array of JSON patch objects **
    /**
     * @param {?} value
     * @param {?=} context
     * @param {?=} appId
     * @param {?=} version
     * @return {?}
     */
    appDataPatch(value, context = APPDATA_CONTEXT.USER, appId = this._appId, version = this._appVersion) {
        /** @type {?} */
        let ep = this.resolveAppDataEndpoint(context, appId);
        if (!ep || !version) {
            return;
        }
        /** @type {?} */
        let url = `${ep}${version}`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.post(url, value, { headers: headers });
        }
        else {
            return this.http.post(url, value);
        }
    }
}
SignalKClient.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
SignalKClient.ctorParameters = () => [
    { type: HttpClient },
    { type: SignalKApps },
    { type: SignalKHttp },
    { type: SignalKStream }
];
/** @nocollapse */ SignalKClient.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.SignalKApps), i0.ɵɵinject(i3.SignalKHttp), i0.ɵɵinject(i4.SignalKStream)); }, token: SignalKClient, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQWtCLE1BQU0sTUFBTSxDQUFDO0FBRS9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM3QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7OztBQUU5QiwwQkFJQzs7O0lBSEcsZ0NBQWU7O0lBQ2YsMkJBQVU7O0lBQ1Ysa0NBQXdCOzs7OztBQUc1Qix5QkFJQzs7O0lBSEcsd0JBQTREOztJQUM1RCwwQkFBYTs7SUFDYiwyQkFBVzs7OztJQUlYLE1BQU0sTUFBTTtJQUNaLFFBQVEsUUFBUTs7O0FBSXBCLE1BQU0sT0FBTyxhQUFhOzs7Ozs7OztJQXVEdEIsWUFBcUIsSUFBZ0IsRUFDbEIsSUFBaUIsRUFDakIsR0FBZ0IsRUFDaEIsTUFBcUI7UUFIbkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNsQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pCLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFDaEIsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQXBEaEMsYUFBUSxHQUFVLElBQUksQ0FBQyxDQUFNLGtDQUFrQzs7UUFNL0Qsc0JBQWlCLEdBQUU7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QUksQ0FBQyxXQUFXOztZQUN4SSxFQUFFLEdBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7UUFDbkQsSUFBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRztZQUFFLE9BQU07U0FBRTs7WUFDM0IsR0FBRyxHQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sRUFBRTtRQUMxQixJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7O2dCQUNSLE9BQU8sR0FBRSxJQUFJLFdBQVcsQ0FBRSxFQUFFLGVBQWUsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFFO1lBQ3pFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO1NBQzVEO2FBQ0k7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUFFO0lBQzlDLENBQUM7OztZQTdkSixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O1lBMUJ6QixVQUFVO1lBS1YsV0FBVztZQUZYLFdBQVc7WUFDWCxhQUFhOzs7Ozs7OztJQXlCbEIsaUNBQXlCOzs7OztJQUN6Qiw2QkFBcUI7Ozs7O0lBQ3JCLGlDQUF5Qjs7Ozs7SUFFekIsaUNBQStCOzs7OztJQUMvQiwrQkFBdUI7Ozs7O0lBS3ZCLDBDQUdFOztJQUtGLCtCQUlDOztJQUdELGlDQUErQjs7Ozs7Ozs7OztJQTRYL0IsK0JBQXNCOzs7OztJQUN0QixvQ0FBMkI7Ozs7O0lBaldkLDZCQUF3Qjs7SUFDekIsNkJBQXdCOztJQUN4Qiw0QkFBdUI7O0lBQ3ZCLCtCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBTaWduYWxLSHR0cCB9IGZyb20gJy4vaHR0cC1hcGknO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbSB9IGZyb20gJy4vc3RyZWFtLWFwaSc7XG5pbXBvcnQgeyBTaWduYWxLQXBwcyB9IGZyb20gJy4vYXBwcy1hcGknO1xuaW1wb3J0IHsgUGF0aCwgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XG5cbmludGVyZmFjZSBTZXJ2ZXJfSW5mbyB7XG4gICAgZW5kcG9pbnRzOiBhbnk7XG4gICAgaW5mbzogYW55LFxuICAgIGFwaVZlcnNpb25zOiBBcnJheTxhbnk+O1xufVxuXG5pbnRlcmZhY2UgSlNPTl9QYXRjaCB7XG4gICAgb3A6ICdhZGQnIHwgJ3JlcGxhY2UnIHwgJ3JlbW92ZScgfCAnY29weScgfCAnbW92ZScgfCAndGVzdCc7XG4gICAgcGF0aDogc3RyaW5nO1xuICAgIHZhbHVlOiBhbnk7XG59XG5cbmV4cG9ydCBlbnVtIEFQUERBVEFfQ09OVEVYVCB7XG4gICAgVVNFUj0gJ3VzZXInLFxuICAgIEdMT0JBTD0gJ2dsb2JhbCdcbn1cblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBTaWduYWxLQ2xpZW50IHtcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICBcbiAgICBwcml2YXRlIF92ZXJzaW9uOiBzdHJpbmc9ICd2MSc7ICAgICAgLy8gKiogZGVmYXVsdCBTaWduYWwgSyBhcGkgdmVyc2lvblxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHRva2VuIGZvciB3aGVuIHNlY3VyaXR5IGlzIGVuYWJsZWQgb24gdGhlIHNlcnZlclxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG5cbiAgICAvLyAqKiBlbmRwb2ludHMgdG8gZmFsbGJhY2sgdG8gaWYgaGVsbG8gcmVzcG9uc2UgaXMgbm90IHJlY2VpdmVkLlxuICAgIHByaXZhdGUgZmFsbGJhY2tFbmRwb2ludHM9IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7IHYxOiB7IH0gfSxcbiAgICAgICAgc2VydmVyOiB7IGlkIDogXCJmYWxsYmFja1wiIH1cbiAgICB9OyAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogIFxuXG4gICAgLy8gKiogc2VydmVyIGluZm9ybWF0aW9uIGJsb2NrICoqXG4gICAgcHVibGljIHNlcnZlcjogU2VydmVyX0luZm89IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXVxuICAgIH0gIFxuXG4gICAgLy8gKiogZW5kcG9pbnRzIGZhbGxiYWNrIHRvIGhvc3QgYWRkcmVzcyB3aGVuIG5vIGhlbGxvIHJlc3BvbnNlXG4gICAgcHVibGljIGZhbGxiYWNrOmJvb2xlYW49IGZhbHNlO1xuXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgXG4gICAgICAgIHRoaXMuX3Rva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuYXBpLmF1dGhUb2tlbj0gdmFsO1xuICAgICAgICB0aGlzLnN0cmVhbS5hdXRoVG9rZW49IHZhbDtcbiAgICB9ICAgIFxuICAgIC8vICoqIE1lc3NhZ2UgT2JqZWN0XG4gICAgZ2V0IG1lc3NhZ2UoKSB7IHJldHVybiBNZXNzYWdlIH1cblxuICAgIC8vICoqIGdlbmVyYXRlIGFuZCByZXR1cm4gYSBVVUlEIG9iamVjdFxuICAgIGdldCB1dWlkKCk6VVVJRCB7IHJldHVybiBuZXcgVVVJRCgpIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBcbiAgICAgICAgICAgICAgICBwdWJsaWMgYXBwczogU2lnbmFsS0FwcHMsXG4gICAgICAgICAgICAgICAgcHVibGljIGFwaTogU2lnbmFsS0h0dHAsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzdHJlYW06IFNpZ25hbEtTdHJlYW0gKSB7IFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH0gICBcbiAgICBcbiAgICAvLyAqKiBpbml0aWFsaXNlIHByb3RvY29sLCBob3N0bmFtZSwgcG9ydCB2YWx1ZXNcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPSdsb2NhbGhvc3QnLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDQ0MztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgIFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9YDsgIFxuICAgICAgICB0aGlzLmZhbGxiYWNrRW5kcG9pbnRzLmVuZHBvaW50cy52MVsnc2lnbmFsay1odHRwJ109IGAke3VybH0vc2lnbmFsay92MS9hcGkvYDtcbiAgICAgICAgdGhpcy5mYWxsYmFja0VuZHBvaW50cy5lbmRwb2ludHMudjFbJ3NpZ25hbGstd3MnXT0gYCR7dXJsfS9zaWduYWxrL3YxL3N0cmVhbWA7XG4gICAgfSAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogQ09OTkVDVElPTiBBTkQgRElTQ09WRVJZICAqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGVuZHBvaW50IGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcblxuXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXIgKGVuZHBvaW50IGRpc2NvdmVyeSkgYW5kIERPIE5PVCBvcGVuIFN0cmVhbVxuICAgIGNvbm5lY3RBc1Byb21pc2UoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKTpQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgICAgICByZXNwb25zZT0+IHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TG9naW5TdGF0dXMoKS5zdWJzY3JpYmUoIHI9Pnt9ICk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0uZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZmFsbGJhY2spIHsgLy8gZmFsbGJhY2sgaWYgbm8gaGVsbG8gcmVzcG9uc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8obnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7ICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlciAoZW5kcG9pbnQgZGlzY292ZXJ5KSBhbmQgRE8gTk9UIG9wZW4gU3RyZWFtXG4gICAgY29ubmVjdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpOk9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGxldCBzdWI6IFN1YmplY3Q8YW55Pj0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgcmVzcG9uc2U9PiB7IFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TG9naW5TdGF0dXMoKS5zdWJzY3JpYmUoIHI9Pnt9ICk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICBzdWIubmV4dCh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgaWYodGhpcy5mYWxsYmFjaykgeyAvLyBmYWxsYmFjayBpZiBubyBoZWxsbyByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnN0cmVhbSkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8obnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0uZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHN1Yi5uZXh0KHRydWUpOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKTsgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHN1Yi5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gc3ViLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH0gIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIHNlcnZlclxuICAgIGRpc2Nvbm5lY3QoKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCl9IFxuICAgIFxuICAgIC8vICoqIENvbm5lY3QgKyBvcGVuIERlbHRhIFN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RTdHJlYW1Bc1Byb21pc2UoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpOlByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RBc1Byb21pc2UoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKTpPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBsZXQgc3ViOiBTdWJqZWN0PGFueT49IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgIHRoaXMuY29ubmVjdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoIFxuICAgICAgICAgICAgKCk9PiB7IFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgICAgIHN1Yi5lcnJvciggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUpO1xuICAgICAgICAgICAgICAgIHN1Yi5uZXh0KCB0cnVlICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZT0+IHsgc3ViLmVycm9yKCBlICkgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gc3ViLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFBsYXliYWNrQXNQcm9taXNlKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgb3B0aW9uczphbnkpOlByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RBc1Byb21pc2UoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFBsYXliYWNrKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgb3B0aW9uczphbnkpOk9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGxldCBzdWI6IFN1YmplY3Q8YW55Pj0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpLnN1YnNjcmliZSggXG4gICAgICAgICAgICAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHN1Yi5uZXh0KCB0cnVlICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZT0+IHsgc3ViLmVycm9yKCBlICkgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gc3ViLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZSAmJiByZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gXG4gICAgICAgICAgICByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB0aGlzLmZhbGxiYWNrRW5kcG9pbnRzLmVuZHBvaW50cztcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0gKHJlc3BvbnNlICYmIHJlc3BvbnNlWydzZXJ2ZXInXSkgPyBcbiAgICAgICAgICAgIHJlc3BvbnNlWydzZXJ2ZXInXSA6IHRoaXMuZmFsbGJhY2tFbmRwb2ludHMuc2VydmVyO1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gKHRoaXMuc2VydmVyLmVuZHBvaW50cykgPyBPYmplY3Qua2V5cyh0aGlzLnNlcnZlci5lbmRwb2ludHMpIDogW107XG4gICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICAgICAgdGhpcy5hcGkuc2VydmVyPSB0aGlzLnNlcnZlci5pbmZvO1xuICAgICAgICB0aGlzLmFwcHMuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUFwcHNFbmRwb2ludCgpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBzaWduYWxrIGFwcHMgYXBpIHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUFwcHNFbmRwb2ludCgpOnN0cmluZyB7ICAgICAgXG4gICAgICAgIGxldCB1cmw6c3RyaW5nPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKS5yZXBsYWNlKCdhcGknLCdhcHBzJyk7ICBcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXIuaW5mby5pZD09J3NpZ25hbGstc2VydmVyLW5vZGUnKSB7IFxuICAgICAgICAgICAgbGV0IHZlcj0gdGhpcy5zZXJ2ZXIuaW5mb1sndmVyc2lvbiddLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZih2ZXJbMV08MjYpIHsgLy91c2UgbGVnYWN5IGxpbmsgZm9yIG9sZGVyIHZlcnNpb25zXG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3dlYmFwcHNgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSBcblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgaWYocGF0aCAmJiBwYXRoLmxlbmd0aD4wICYmIHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBnZXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwdXQgdG8gaHR0cCBwYXRoXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcHV0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIHZhbHVlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGlmKHBhdGggJiYgcGF0aC5sZW5ndGg+MCAmJiBwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcG9zdCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoIHVybCwgdmFsdWUsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9OyAgIFxuXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsIGBhcHBsaWNhdGlvbi9qc29uYCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9naW5gLFxuICAgICAgICAgICAgeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICB7IGhlYWRlcnMgfVxuICAgICAgICApO1xuICAgIH1cblx0XG4gICAgLy8gKiogbG9nb3V0IGZyb20gc2VydmVyICoqXG4gICAgbG9nb3V0KCk6T2JzZXJ2YWJsZTxib29sZWFuPiB7IFxuICAgICAgICBsZXQgc3ViOiBTdWJqZWN0PGJvb2xlYW4+PSBuZXcgU3ViamVjdCgpOztcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YH0gKTtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCwgeyBoZWFkZXJzOiBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9ICkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICgpPT4geyBzdWIubmV4dCh0cnVlKSB9LFxuICAgICAgICAgICAgICAgICgpPT4geyBzdWIubmV4dChmYWxzZSkgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCwge3Jlc3BvbnNlVHlwZTogJ3RleHQnfSApLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAoKT0+IHsgc3ViLm5leHQodHJ1ZSkgfSxcbiAgICAgICAgICAgICAgICAoKT0+IHsgc3ViLm5leHQoZmFsc2UpIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1Yi5hc09ic2VydmFibGUoKTtcbiAgICB9XHQgIFxuICAgIFxuICAgIC8vICoqIGlzIGEgdXNlciBhdXRoZW50aWNhdGVkIHRvIHRoZSBzZXJ2ZXIgKipcbiAgICBpc0xvZ2dlZEluKCk6T2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgICAgIGxldCBzdWI6IFN1YmplY3Q8Ym9vbGVhbj49IG5ldyBTdWJqZWN0KCk7ICAgIFxuICAgICAgICB0aGlzLmdldExvZ2luU3RhdHVzKCkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgcj0+IHsgc3ViLm5leHQoIHIuc3RhdHVzPT0nbG9nZ2VkSW4nID8gdHJ1ZSA6IGZhbHNlICkgfSxcbiAgICAgICAgICAgICgpPT4geyBzdWIubmV4dChmYWxzZSkgfSBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHN1Yi5hc09ic2VydmFibGUoKTtcbiAgICB9XG4gICAgLy8gKiogZmV0Y2ggbG9naW4gc3RhdHVzIGZyb20gc2VydmVyICoqXG4gICAgZ2V0TG9naW5TdGF0dXMoKTpPYnNlcnZhYmxlPGFueT4geyByZXR1cm4gdGhpcy5nZXQoJy9sb2dpbnN0YXR1cycpIH0gICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuICAgIFxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogIGFwcGxpY2F0aW9uRGF0YSBhcGkgbWV0aG9kcyBcbiAgICAgKiBjb250ZXh0OiAndXNlcicgb3IgJ2dsb2JhbCdcbiAgICAgKiBhcHBJZDogYXBwbGljYXRpb24gaWQgc3RyaW5nXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgcHJpdmF0ZSBfYXBwSWQ6c3RyaW5nO1xuICAgIHByaXZhdGUgX2FwcFZlcnNpb246c3RyaW5nO1xuXG4gICAgcHJpdmF0ZSByZXNvbHZlQXBwRGF0YUVuZHBvaW50KGNvbnRleHQ6QVBQREFUQV9DT05URVhULCBhcHBJZDpzdHJpbmcpIHtcbiAgICAgICAgaWYoIWNvbnRleHQgfHwgIWFwcElkKSB7IHJldHVybiBudWxsIH1cbiAgICAgICAgbGV0IHVybDpzdHJpbmc9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpLnJlcGxhY2UoJ2FwaScsJ2FwcGxpY2F0aW9uRGF0YScpO1xuICAgICAgICByZXR1cm4gYCR7dXJsfSR7Y29udGV4dH0vJHthcHBJZH0vYDtcbiAgICB9XG5cbiAgICBzZXRBcHBJZCh2YWx1ZTpzdHJpbmcpIHsgdGhpcy5fYXBwSWQ9IHZhbHVlIH1cbiAgICBzZXRBcHBWZXJzaW9uKHZhbHVlOnN0cmluZykgeyB0aGlzLl9hcHBWZXJzaW9uPSB2YWx1ZSB9XG5cbiAgICAvLyAqKiBnZXQgbGlzdCBvZiBhdmFpbGFibGUgdmVyc2lvbnMgb2YgZGF0YSBzdG9yZWQgKipcbiAgICBhcHBEYXRhVmVyc2lvbnMoY29udGV4dDpBUFBEQVRBX0NPTlRFWFQ9IEFQUERBVEFfQ09OVEVYVC5VU0VSLCBhcHBJZDpzdHJpbmc9IHRoaXMuX2FwcElkKSB7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUFwcERhdGFFbmRwb2ludChjb250ZXh0LCBhcHBJZCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9ICAgICBcbiAgICB9XG4gICAgLy8gKiogZ2V0IGxpc3Qgb2YgYXZhaWxhYmxlIGtleXMgZm9yIGEgc3RvcmVkIHBhdGggKipcbiAgICBhcHBEYXRhS2V5cyhwYXRoOnN0cmluZz0nJywgY29udGV4dDpBUFBEQVRBX0NPTlRFWFQ9IEFQUERBVEFfQ09OVEVYVC5VU0VSLCBhcHBJZDpzdHJpbmc9IHRoaXMuX2FwcElkLCB2ZXJzaW9uOnN0cmluZz0gdGhpcy5fYXBwVmVyc2lvbikge1xuICAgICAgICBwYXRoPSAocGF0aC5sZW5ndGghPTAgJiYgcGF0aFswXT09Jy8nKSA/IHBhdGguc2xpY2UoMSkgOiBwYXRoO1xuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVBcHBEYXRhRW5kcG9pbnQoY29udGV4dCwgYXBwSWQpO1xuICAgICAgICB1cmwrPSBgJHt2ZXJzaW9ufS8ke3BhdGh9P2tleXM9dHJ1ZWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9ICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gKiogZ2V0IHN0b3JlZCB2YWx1ZSBhdCBwcm92aWRlZCBwYXRoICoqXG4gICAgYXBwRGF0YUdldChwYXRoOnN0cmluZz0nJywgY29udGV4dDpBUFBEQVRBX0NPTlRFWFQ9IEFQUERBVEFfQ09OVEVYVC5VU0VSLCBhcHBJZDpzdHJpbmc9IHRoaXMuX2FwcElkLCB2ZXJzaW9uOnN0cmluZz0gdGhpcy5fYXBwVmVyc2lvbikge1xuICAgICAgICBwYXRoPSAocGF0aC5sZW5ndGghPTAgJiYgcGF0aFswXT09Jy8nKSA/IHBhdGguc2xpY2UoMSkgOiBwYXRoO1xuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVBcHBEYXRhRW5kcG9pbnQoY29udGV4dCwgYXBwSWQpO1xuICAgICAgICB1cmwrPSBgJHt2ZXJzaW9ufS8ke3BhdGh9YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgIFxuICAgIH1cblxuICAgIC8vICoqIHNldCBzdG9yZWQgdmFsdWUgYXQgcHJvdmlkZWQgcGF0aCAqKlxuICAgIGFwcERhdGFTZXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSwgY29udGV4dDpBUFBEQVRBX0NPTlRFWFQ9IEFQUERBVEFfQ09OVEVYVC5VU0VSLCBhcHBJZDpzdHJpbmc9IHRoaXMuX2FwcElkLCB2ZXJzaW9uOnN0cmluZz0gdGhpcy5fYXBwVmVyc2lvbikge1xuICAgICAgICBpZighcGF0aCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIGxldCBlcD0gdGhpcy5yZXNvbHZlQXBwRGF0YUVuZHBvaW50KGNvbnRleHQsIGFwcElkKTtcbiAgICAgICAgaWYoIWVwKSB7IHJldHVybiB9XG4gICAgICAgIGxldCB1cmw9IGAke2VwfSR7dmVyc2lvbn0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfVxuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogdXBkYXRlIC8gcGF0Y2ggc3RvcmVkIHZhbHVlcyB1c2luZyBBcnJheSBvZiBKU09OIHBhdGNoIG9iamVjdHMgKipcbiAgICBhcHBEYXRhUGF0Y2godmFsdWU6QXJyYXk8SlNPTl9QYXRjaD4sIGNvbnRleHQ6QVBQREFUQV9DT05URVhUPSBBUFBEQVRBX0NPTlRFWFQuVVNFUiwgYXBwSWQ6c3RyaW5nPSB0aGlzLl9hcHBJZCwgdmVyc2lvbjpzdHJpbmc9IHRoaXMuX2FwcFZlcnNpb24pIHtcbiAgICAgICAgbGV0IGVwPSB0aGlzLnJlc29sdmVBcHBEYXRhRW5kcG9pbnQoY29udGV4dCwgYXBwSWQpO1xuICAgICAgICBpZighZXAgfHwgIXZlcnNpb24gKSB7IHJldHVybiB9XG4gICAgICAgIGxldCB1cmw9IGAke2VwfSR7dmVyc2lvbn1gO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKSB9XG4gICAgfSAgICBcblxufVxuIl19