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
export class SignalKClient {
    // *******************************************************
    /**
     * @param {?} http
     * @param {?} apps
     * @param {?} api
     * @param {?} stream
     * @param {?} worker
     */
    constructor(http, apps, api, stream, worker) {
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
    connect(hostname = null, port = null, useSSL = false) {
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
    // ** disconnect from server
    /**
     * @return {?}
     */
    disconnect() { this.stream.close(); this.worker.terminate(); }
    // ** Connect + open Delta Stream (endpoint discovery)
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    connectStream(hostname = null, port = null, useSSL = false, subscribe = null) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.connect(hostname, port, useSSL)
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
    // ** connect to playback stream (endpoint discovery)
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} options
     * @return {?}
     */
    connectPlayback(hostname = null, port = null, useSSL = false, options) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.connect(hostname, port, useSSL)
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
        if (this.server.info['id'] == 'signalk-server-node') {
            return `${this.protocol}://${this.hostname}:${this.port}/webapps`;
        }
        else {
            return this.resolveHttpEndpoint().replace('api', 'apps');
        }
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
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}${Path.dotToSlash(path)}`;
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
        let url = `${this.protocol}://${this.hostname}:${this.port}${Path.dotToSlash(path)}`;
        this.debug(`put ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.put(url, { headers: headers });
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
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}${Path.dotToSlash(path)}`;
        this.debug(`post ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.post(url, { headers: headers });
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
        let url = `${this.protocol}://${this.hostname}:${this.port}/signalk/${this._version}/auth/logout`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.put(url, null, { headers });
        }
        else {
            return this.http.put(url, null);
        }
    }
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
}
SignalKClient.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
SignalKClient.ctorParameters = () => [
    { type: HttpClient },
    { type: SignalKApps },
    { type: SignalKHttp },
    { type: SignalKStream },
    { type: SignalKStreamWorker }
];
/** @nocollapse */ SignalKClient.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.SignalKApps), i0.ɵɵinject(i3.SignalKHttp), i0.ɵɵinject(i4.SignalKStream), i0.ɵɵinject(i5.SignalKStreamWorker)); }, token: SignalKClient, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM3QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7QUFHOUIsTUFBTSxPQUFPLGFBQWE7Ozs7Ozs7OztJQXVEdEIsWUFBcUIsSUFBZ0IsRUFDbEIsSUFBaUIsRUFDakIsR0FBZ0IsRUFDaEIsTUFBcUIsRUFDckIsTUFBMkI7UUFKekIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNsQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pCLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFDaEIsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFxQjtRQXJEdEMsYUFBUSxHQUFVLElBQUksQ0FBQyxDQUFNLGtDQUFrQzs7UUFNL0Qsc0JBQWlCLEdBQUU7WUFDdkIsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUcsRUFBRTtZQUN0QixNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUcsVUFBVSxFQUFFO1NBQzlCLENBQUM7OztRQUtL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QUN2QiwrQkFBNEI7O0lBQzVCLCtCQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IFNpZ25hbEtIdHRwIH0gZnJvbSAnLi9odHRwLWFwaSc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtIH0gZnJvbSAnLi9zdHJlYW0tYXBpJztcbmltcG9ydCB7IFNpZ25hbEtBcHBzIH0gZnJvbSAnLi9hcHBzLWFwaSc7XG5pbXBvcnQgeyBQYXRoLCBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtV29ya2VyfSBmcm9tICcuL3N0cmVhbS13b3JrZXInO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuXG4gICAgLy8gKiogZW5kcG9pbnRzIHRvIGZhbGxiYWNrIHRvIGlmIGhlbGxvIHJlc3BvbnNlIGlzIG5vdCByZWNlaXZlZC5cbiAgICBwcml2YXRlIGZhbGxiYWNrRW5kcG9pbnRzPSB7XG4gICAgICAgIGVuZHBvaW50czogeyB2MTogeyB9IH0sXG4gICAgICAgIHNlcnZlcjogeyBpZCA6IFwiZmFsbGJhY2tcIiB9XG4gICAgfTsgICAgXG4gICAgXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogc2VydmVyIGluZm9ybWF0aW9uIGJsb2NrICoqXG4gICAgcHVibGljIHNlcnZlcj0ge1xuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdXG4gICAgfSAgXG5cbiAgICAvLyAqKiBlbmRwb2ludHMgZmFsbGJhY2sgdG8gaG9zdCBhZGRyZXNzIHdoZW4gbm8gaGVsbG8gcmVzcG9uc2VcbiAgICBwdWJsaWMgZmFsbGJhY2s6Ym9vbGVhbj0gZmFsc2U7XG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuICAgIHNldCB2ZXJzaW9uKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGxldCB2OnN0cmluZz0gJ3YnKyB2YWw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmxlbmd0aD09MCkgeyBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249IHY7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgdG86ICR7dn1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249ICh0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5pbmRleE9mKHYpIT0tMSkgPyB2IDogdGhpcy5fdmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCByZXF1ZXN0OiAke3Z9LCByZXN1bHQ6ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyBcbiAgICAgICAgdGhpcy5fdG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5hcGkuYXV0aFRva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuc3RyZWFtLmF1dGhUb2tlbj0gdmFsO1xuICAgIH0gICAgXG4gICAgLy8gKiogTWVzc2FnZSBPYmplY3RcbiAgICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuIE1lc3NhZ2UgfVxuXG4gICAgLy8gKiogZ2VuZXJhdGUgYW5kIHJldHVybiBhIFVVSUQgb2JqZWN0XG4gICAgZ2V0IHV1aWQoKTpVVUlEIHsgcmV0dXJuIG5ldyBVVUlEKCkgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhcHBzOiBTaWduYWxLQXBwcyxcbiAgICAgICAgICAgICAgICBwdWJsaWMgYXBpOiBTaWduYWxLSHR0cCwgXG4gICAgICAgICAgICAgICAgcHVibGljIHN0cmVhbTogU2lnbmFsS1N0cmVhbSxcbiAgICAgICAgICAgICAgICBwdWJsaWMgd29ya2VyOiBTaWduYWxLU3RyZWFtV29ya2VyICkgeyBcbiAgICAgICAgdGhpcy5pbml0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9ICAgXG4gICAgXG4gICAgLy8gKiogaW5pdGlhbGlzZSBwcm90b2NvbCwgaG9zdG5hbWUsIHBvcnQgdmFsdWVzXG4gICAgcHJpdmF0ZSBpbml0KGhvc3RuYW1lOnN0cmluZz0nbG9jYWxob3N0JywgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5ob3N0bmFtZSA9IGhvc3RuYW1lO1xuICAgICAgICBpZih1c2VTU0wpIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cHMnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA0NDM7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgODA7XG4gICAgICAgIH0gICBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fWA7ICBcbiAgICAgICAgdGhpcy5mYWxsYmFja0VuZHBvaW50cy5lbmRwb2ludHMudjFbJ3NpZ25hbGstaHR0cCddPSBgJHt1cmx9L3NpZ25hbGsvdjEvYXBpL2A7XG4gICAgICAgIHRoaXMuZmFsbGJhY2tFbmRwb2ludHMuZW5kcG9pbnRzLnYxWydzaWduYWxrLXdzJ109IGAke3VybH0vc2lnbmFsay92MS9zdHJlYW1gO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIENPTk5FQ1RJT04gQU5EIERJU0NPVkVSWSAgKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIFNpZ25hbCBLIHNlcnZlciBlbmRwb2ludCBkaXNjb3ZlcnkgcmVxdWVzdCAoL3NpZ25hbGspLiAgXG4gICAgaGVsbG8oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCcvc2lnbmFsaycpO1xuICAgIH0gICAgXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXIgKGVuZHBvaW50IGRpc2NvdmVyeSkgYW5kIERPIE5PVCBvcGVuIFN0cmVhbVxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgICAgICB0aGlzLmhlbGxvKGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpLnN1YnNjcmliZSggICAgLy8gKiogZGlzY292ZXIgZW5kcG9pbnRzICoqXG4gICAgICAgICAgICAgICAgcmVzcG9uc2U9PiB7IFxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnN0cmVhbSkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLmVuZHBvaW50PSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZhbGxiYWNrKSB7IC8vIGZhbGxiYWNrIGlmIG5vIGhlbGxvIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnN0cmVhbSkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0uZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpOyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKTsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IH1cbiAgICBcbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RQbGF5YmFjayhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIG9wdGlvbnM6YW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZSAmJiByZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gXG4gICAgICAgICAgICByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB0aGlzLmZhbGxiYWNrRW5kcG9pbnRzLmVuZHBvaW50cztcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0gKHJlc3BvbnNlICYmIHJlc3BvbnNlWydzZXJ2ZXInXSkgPyBcbiAgICAgICAgICAgIHJlc3BvbnNlWydzZXJ2ZXInXSA6IHRoaXMuZmFsbGJhY2tFbmRwb2ludHMuc2VydmVyO1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gKHRoaXMuc2VydmVyLmVuZHBvaW50cykgPyBPYmplY3Qua2V5cyh0aGlzLnNlcnZlci5lbmRwb2ludHMpIDogW107XG4gICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICAgICAgdGhpcy5hcGkuc2VydmVyPSB0aGlzLnNlcnZlci5pbmZvO1xuICAgICAgICB0aGlzLmFwcHMuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUFwcHNFbmRwb2ludCgpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBzaWduYWxrIGFwcHMgYXBpIHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUFwcHNFbmRwb2ludCgpOnN0cmluZyB7ICAgICAgXG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmluZm9bJ2lkJ109PSdzaWduYWxrLXNlcnZlci1ub2RlJykgeyBcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3dlYmFwcHNgO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpLnJlcGxhY2UoJ2FwaScsJ2FwcHMnKTtcbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICAvLyAqKiByZXR1cm4gcHJlZmVycmVkIFdTIHN0cmVhbSB1cmxcbiAgICBwdWJsaWMgcmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk6c3RyaW5nIHtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIGVuZHBvaW50IHZlcnNpb246ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBmYWxsaW5nIGJhY2sgdG86IHYxYCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ119YCBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIG51bGwgfVxuICAgIH0gIFxuXG4gICAgLy8gKiogcmV0dXJuIHNpZ25hbGstaHR0cCBlbmRwb2ludCB1cmxcbiAgICBwcml2YXRlIHJlc29sdmVIdHRwRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSkgeyAvLyAqKiBjb25uZWN0aW9uIG1hZGVcbiAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gaHR0cCBlbmRwb2ludCBhdCBwcmVzY3JpYmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddKSB7XG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstaHR0cCddfWAgfSAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtc2c9ICdObyBjdXJyZW50IGNvbm5lY3Rpb24gaHR0cCBlbmRwb2ludCBzZXJ2aWNlISBVc2UgY29ubmVjdCgpIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uJ1xuICAgICAgICAgICAgdGhpcy5kZWJ1Zyhtc2cpO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdXJsOyAgIFxuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY2xlYW51cCBvbiBzZXJ2ZXIgZGlzY29ubmVjdGlvblxuICAgIHByaXZhdGUgZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgIFxuICAgIH1cblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIHBhdGhcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBnZXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwdXQgdG8gaHR0cCBwYXRoXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwdXQgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTtcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHBvc3QgdG8gaHR0cCBwYXRoXG4gICAgcG9zdChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcG9zdCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07ICAgXG5cbiAgICAvLyAqKiBnZXQgYXV0aCB0b2tlbiBmb3Igc3VwcGxpZWQgdXNlciBkZXRhaWxzICoqXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgYGFwcGxpY2F0aW9uL2pzb25gKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXHRcbiAgICAvLyAqKiBsb2dvdXQgZnJvbSBzZXJ2ZXIgKipcbiAgICBsb2dvdXQoKSB7XG5cdFx0bGV0IHVybD1gJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ291dGA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCwgeyBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsICkgfVxuICAgIH1cdCAgIFxuICAgIFxuICAgIC8vKiogZ2V0IGRhdGEgdmlhIHRoZSBzbmFwc2hvdCBodHRwIGFwaSBwYXRoIGZvciBzdXBwbGllZCB0aW1lXG4gICAgc25hcHNob3QoY29udGV4dDpzdHJpbmcsIHRpbWU6c3RyaW5nKSB7IFxuICAgICAgICBpZighdGltZSkgeyByZXR1cm4gfVxuICAgICAgICB0aW1lPSB0aW1lLnNsaWNlKDAsdGltZS5pbmRleE9mKCcuJykpICsgJ1onO1xuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICB1cmw9IGAke3VybC5yZXBsYWNlKCdhcGknLCdzbmFwc2hvdCcpfSR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfT90aW1lPSR7dGltZX1gO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxuICAgIH1cblxufVxuIl19