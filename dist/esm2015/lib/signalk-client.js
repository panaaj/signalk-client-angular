/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class SignalKClient {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        this._version = 'v1';
        this._filter = null;
        this._wsTimeout = 20000;
        this._authType = { never: 0, forwrite: 1, always: 2 };
        this.server = {
            authRequired: 0,
            // depricated: 0= 'never', 1= 'forwrite
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
    debug(val) { if (isDevMode()) {
        console.log(val);
    } }
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
    /**
     * @return {?}
     */
    get apiVersions() { return this.server.apiVersions; }
    /**
     * @return {?}
     */
    get isConnected() { return (this.ws) ? true : false; }
    /**
     * @return {?}
     */
    get authRequired() { return this.server.authRequired; }
    /**
     * @param {?} val
     * @return {?}
     */
    set authToken(val) { this._token = val; }
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
    /**
     * @return {?}
     */
    logout() {
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}/signalk/${this._version}/auth/logout`;
        if (this._token) {
            url += `&token=${this._token}`;
        }
        return this.http.put(url, {});
    }
    /**
     * @return {?}
     */
    get connectionTimeout() { return this._wsTimeout; }
    /**
     * @param {?} val
     * @return {?}
     */
    set connectionTimeout(val) {
        this._wsTimeout = (val < 3000) ? 3000 : (val > 60000) ? 60000 : val;
    }
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @return {?}
     */
    init(hostname = null, port = null, useSSL = false) {
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
    }
    /**
     * @param {?} response
     * @return {?}
     */
    processHello(response) {
        this.server.endpoints = (response['endpoints']) ? response['endpoints'] : {};
        this.server.info = (response['server']) ? response['server'] : {};
        this.server.apiVersions = (this.server.endpoints) ? Object.keys(this.server.endpoints) : [];
        this.server.authRequired = (response['authenticationRequired']) ?
            this._authType[response['authenticationRequired']] : 0;
        this.debug(this.server.endpoints);
    }
    /**
     * @return {?}
     */
    getStreamUrl() {
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
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    connect(hostname = null, port = null, useSSL = false, subscribe = null) {
        this.debug('Contacting Signal K server.........');
        this.hello(hostname, port, useSSL).subscribe(// ** discover endpoints **
        // ** discover endpoints **
        // ** discover endpoints **
        response => {
            this.processHello(response);
            /** @type {?} */
            let url = this.getStreamUrl();
            if (!url) {
                this._error.next(new Error('No Signal K endpoints found!'));
                return;
            }
            // ** subscribe **
            if (subscribe) {
                url += `?subscribe=${subscribe}`;
            }
            if (this._token) {
                url += `&token=${this._token}`;
            }
            this.debug(`Connecting to ${url}`);
            this.connectDeltaByUrl(url);
        }, error => {
            this.server.endpoints = {};
            this.server.info = {};
            this.server.apiVersions = [];
            return this._error.next(error);
        });
    }
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    connectDelta(hostname = null, port = null, useSSL = false, subscribe = null) {
        this.debug('ConnectDelta.........');
        this.init(hostname, port, useSSL);
        /** @type {?} */
        let url = `${this.wsProtocol}://${this.hostname}:${this.port}/signalk/${this._version}/stream`;
        // ** subscribe **
        if (subscribe) {
            url += `?subscribe=${subscribe}`;
        }
        if (this._token) {
            url += `&token=${this._token}`;
        }
        this.debug(`Connecting to delta stream at ${url}`);
        this.connectDeltaByUrl(url);
    }
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    playback(hostname = null, port = null, useSSL = false, subscribe) {
        this.debug('Contacting Signal K server.........');
        this.hello(hostname, port, useSSL).subscribe(// ** discover endpoints **
        // ** discover endpoints **
        // ** discover endpoints **
        response => {
            this.processHello(response);
            /** @type {?} */
            let url = this.getStreamUrl();
            if (!url) {
                this._error.next(new Error('No Signal K endpoints found!'));
                return;
            }
            url = url.replace('stream', 'playback');
            // ** subscribe **
            if (typeof subscribe === 'string') {
                url += `?subscribe=${subscribe}`;
            }
            if (typeof subscribe === 'object') {
                url += `?subscribe=${this.parsePlaybackOptions(subscribe)}`;
            }
            if (this._token) {
                url += `&token=${this._token}`;
            }
            this.debug(`Connecting to ${url}`);
            this.connectDeltaByUrl(url);
        }, error => {
            this.server.endpoints = {};
            this.server.info = {};
            this.server.apiVersions = [];
            return this._error.next(error);
        });
    }
    /**
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @param {?=} subscribe
     * @return {?}
     */
    connectPlayback(hostname = null, port = null, useSSL = false, subscribe) {
        this.debug('Playback.........');
        this.init(hostname, port, useSSL);
        /** @type {?} */
        let url = `${this.wsProtocol}://${this.hostname}:${this.port}/signalk/${this._version}/playback`;
        // ** subscribe **
        if (typeof subscribe === 'string') {
            url += `?subscribe=${subscribe}`;
        }
        if (typeof subscribe === 'object') {
            url += `?subscribe=${this.parsePlaybackOptions(subscribe)}`;
        }
        if (this._token) {
            url += `&token=${this._token}`;
        }
        this.debug(`Connecting to playback stream at ${url}`);
        this.connectDeltaByUrl(url);
    }
    /**
     * @param {?} opt
     * @return {?}
     */
    parsePlaybackOptions(opt) {
        /** @type {?} */
        let s = '';
        if (opt.context) {
            s += opt.context;
        }
        if (opt.startTime) {
            /** @type {?} */
            let t = opt.startTime.slice(0, opt.startTime.indexOf('.')) + 'Z';
            s += `&startTime=${t}`;
        }
        if (opt.playbackRate) {
            s += `&playbackRate=${opt.playbackRate}`;
        }
        return s;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    connectDeltaByUrl(url) {
        if (this.server.authRequired && !this._token) {
            this.debug('Auth Required and NO token available!');
            this._error.next(new Error('Auth Required and NO token available!'));
        }
        if (this.ws) {
            this.disconnect();
        }
        this.ws = new WebSocket(url);
        // ** start connection watchdog **
        setTimeout(() => {
            if (this.ws && (this.ws.readyState != 1 && this.ws.readyState != 3)) {
                this.debug(`Connection watchdog expired (${this._wsTimeout / 1000} sec): ${this.ws.readyState}... aborting connection...`);
                this.disconnect();
            }
        }, this._wsTimeout);
        this.ws.onopen = e => { this.debug(`ws.open`); this._connect.next(e); };
        this.ws.onclose = e => { this.debug(`ws.close`); this._close.next(e); };
        this.ws.onerror = e => { this.debug(`ws.error`); this._error.next(e); };
        this.ws.onmessage = e => {
            /** @type {?} */
            let data;
            if (typeof e.data === 'string') {
                try {
                    data = JSON.parse(e.data);
                }
                catch (e) {
                    return;
                }
            }
            if (this.isHello(data)) {
                this.server.ws.roles = data.roles;
                this.server.ws.self = data.self;
            }
            if (this._filter && this.isDelta(data)) {
                if (data.context == this._filter) {
                    this._message.next(data);
                }
            }
            else {
                this._message.next(data);
            }
        };
    }
    /**
     * @return {?}
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.server.ws = { self: null, roles: {} };
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    send(data) {
        if (this.ws) {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            this.ws.send(data);
        }
    }
    /**
     * @param {?=} context
     * @param {?=} path
     * @param {?=} value
     * @return {?}
     */
    sendUpdate(context = 'self', path, value) {
        /** @type {?} */
        let val = {
            context: (context == 'self') ? 'vessels.self' : context,
            updates: [{
                    values: [{ path: path, value: value }]
                }]
        };
        this.debug(`sending update: ${JSON.stringify(val)}`);
        this.send(val);
    }
    /**
     * @param {?=} context
     * @param {?=} path
     * @param {...?} options
     * @return {?}
     */
    subscribe(context = '*', path = '*', ...options) {
        /** @type {?} */
        let data = {
            context: (context == 'self') ? 'vessels.self' : context,
            subscribe: []
        };
        /** @type {?} */
        let subscription = {};
        subscription['path'] = path;
        for (let i in options) {
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
    }
    /**
     * @param {?=} context
     * @param {?=} path
     * @return {?}
     */
    unsubscribe(context = '*', path = '*') {
        context = (context == 'self') ? 'vessels.self' : context;
        this.send({
            "context": context,
            "unsubscribe": [{ "path": path }]
        });
    }
    /**
     * @param {?} msg
     * @return {?}
     */
    isDelta(msg) { return typeof msg.context != 'undefined'; }
    /**
     * @param {?} msg
     * @return {?}
     */
    isHello(msg) { return typeof msg.version != 'undefined'; }
    /**
     * @return {?}
     */
    get filter() { return this._filter; }
    /**
     * @param {?} id
     * @return {?}
     */
    set filter(id) {
        if (!id) {
            // ** clear filter
            this._filter = null;
            return;
        }
        if (id.indexOf('self') != -1) {
            // ** self
            if (!this.server.ws.self) {
                this.getSelfId().subscribe(id => { this._filter = id; });
            }
            else {
                this._filter = this.server.ws.self;
            }
        }
        else {
            /** @type {?} */
            let uuid = RegExp("^urn:mrn:signalk:uuid:[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$");
            if (id.indexOf('vessels.') != -1) {
                id = id.slice(id.indexOf('.') + 1);
            }
            if (uuid.test(id)) {
                this._filter = `vessels.${id}`;
            }
        }
    }
    /**
     * @param {?=} context
     * @param {?=} alarmPath
     * @param {?=} alarm
     * @return {?}
     */
    raiseAlarm(context = 'self', alarmPath, alarm) {
        this.sendUpdate(context, `notifications.${alarmPath}`, alarm);
    }
    /**
     * @param {?=} context
     * @param {?=} alarmPath
     * @return {?}
     */
    clearAlarm(context = 'self', alarmPath) {
        this.sendUpdate(context, `notifications.${alarmPath}`, null);
    }
    /**
     * @return {?}
     */
    getSelf() { return this.apiGet(`vessels/self`); }
    /**
     * @return {?}
     */
    getSelfId() { return this.apiGet(`self`); }
    /**
     * @param {?} context
     * @param {?} path
     * @return {?}
     */
    getMeta(context, path) {
        return this.apiGet(`${this.contextToPath(context)}/${this.dotToSlash(path)}/meta`);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    apiGet(path) {
        /** @type {?} */
        let url = this.resolveHttpEndpoint();
        if (!url) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        url += this.dotToSlash(path);
        this.debug(`apiGet ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            if (this.server.authRequired) {
                this.debug('Auth Required and NO token available!');
                this._error.next(new Error('Auth Required and NO token available!'));
            }
            return this.http.get(url);
        }
    }
    /**
     * @param {?} context
     * @param {?} path
     * @param {?=} key
     * @param {?=} value
     * @return {?}
     */
    apiPut(context, path, key, value) {
        /** @type {?} */
        let url = this.resolveHttpEndpoint();
        if (!url) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        url += this.contextToPath(context) + '/' + this.dotToSlash(path);
        /** @type {?} */
        let msg = { value: {} };
        if (typeof value == 'undefined') {
            msg.value = key;
        }
        else {
            msg.value[key] = value;
        }
        this.debug(`apiPut ${url}`);
        this.debug(JSON.stringify(msg));
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.put(url, msg, { headers: headers });
        }
        else {
            if (this.server.authRequired) {
                this.debug('Auth Required and NO token available!');
                this._error.next(new Error('Auth Required and NO token available!'));
            }
            return this.http.put(url, msg);
        }
    }
    /**
     * @param {?} context
     * @param {?} time
     * @return {?}
     */
    snapshot(context, time) {
        /** @type {?} */
        let url = this.resolveHttpEndpoint();
        if (!url) {
            return;
        }
        if (!time) {
            return;
        }
        time = time.slice(0, time.indexOf('.')) + 'Z';
        url = `/signalk/${this._version}/snapshot/${this.contextToPath(context)}?time=${time}`;
        this.debug(`snapshot ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            if (this.server.authRequired) {
                this.debug('Auth Required and NO token available!');
                this._error.next(new Error('Auth Required and NO token available!'));
            }
            return this.http.get(url);
        }
    }
    /**
     * @param {?} path
     * @return {?}
     */
    get(path) {
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}${this.dotToSlash(path)}`;
        this.debug(`get ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.get(url, { headers: headers });
        }
        else {
            if (this.server.authRequired) {
                this.debug('Auth Required and NO token available!');
                this._error.next(new Error('Auth Required and NO token available!'));
            }
            return this.http.get(url);
        }
    }
    ;
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    put(path, value) {
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}${this.dotToSlash(path)}`;
        this.debug(`put ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.put(url, { headers: headers });
        }
        else {
            if (this.server.authRequired) {
                this.debug('Auth Required and NO token available!');
                this._error.next(new Error('Auth Required and NO token available!'));
            }
            return this.http.put(url, value);
        }
    }
    ;
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    post(path, value) {
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}${this.dotToSlash(path)}`;
        this.debug(`post ${url}`);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.post(url, { headers: headers });
        }
        else {
            if (this.server.authRequired) {
                this.debug('Auth Required and NO token available!');
                this._error.next(new Error('Auth Required and NO token available!'));
            }
            return this.http.post(url, value);
        }
    }
    ;
    /**
     * @return {?}
     */
    resolveHttpEndpoint() {
        /** @type {?} */
        let url;
        if (this.server.endpoints[this._version]) {
            // ** connection made
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
            this._error.next(new Error(msg));
        }
        return url;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    contextToPath(context) {
        /** @type {?} */
        let res = (context == 'self') ? 'vessels.self' : context;
        return res.split('.').join('/');
    }
    /**
     * @param {?} path
     * @return {?}
     */
    dotToSlash(path) {
        if (path.indexOf('.') != -1) {
            return path.split('.').join('/');
        }
        else {
            return path;
        }
    }
    /**
     * @param {?} path
     * @return {?}
     */
    slashToDot(path) {
        if (path.indexOf('/') != -1) {
            return path.split('/').join('.');
        }
        else {
            return path;
        }
    }
}
SignalKClient.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
SignalKClient.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ SignalKClient.ngInjectableDef = i0.defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(i0.inject(i1.HttpClient)); }, token: SignalKClient, providedIn: "root" });
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
    SignalKClient.prototype._authType;
    /** @type {?} */
    SignalKClient.prototype.server;
    /** @type {?} */
    SignalKClient.prototype.http;
}
/** @enum {string} */
const AlarmState = {
    normal: 'normal',
    alert: 'alert',
    warn: 'warn',
    alarm: 'alarm',
    emergency: 'emergency',
};
export { AlarmState };
/** @enum {string} */
const AlarmMethod = {
    visual: 'visual',
    sound: 'sound',
};
export { AlarmMethod };
export class Alarm {
    /**
     * @param {?=} message
     */
    constructor(message = null) {
        this.state = AlarmState.normal;
        this.method = [AlarmMethod.visual, AlarmMethod.sound];
        this.message = message;
    }
}
if (false) {
    /** @type {?} */
    Alarm.prototype.state;
    /** @type {?} */
    Alarm.prototype.method;
    /** @type {?} */
    Alarm.prototype.message;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7OztBQUszQyxNQUFNOzs7O0lBa0NGLFlBQXFCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7d0JBakJYLElBQUk7dUJBQ2IsSUFBSTswQkFDRCxLQUFLO3lCQUdULEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7c0JBRW5DO1lBQ1gsWUFBWSxFQUFFLENBQUM7O1lBQ2YsU0FBUyxFQUFFLEVBQUU7WUFDYixJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxFQUFFO1lBQ2YsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1NBQ2hDO1FBS0csSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUks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WUFBWSxDQUFDLFFBQVE7UUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBQyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsU0FBUyxDQUFFLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7Ozs7O0lBSTlCLFlBQVk7UUFDaEIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDNUQsTUFBTSxDQUFDLEdBQUcs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Q0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFBO1NBQUU7Ozs7WUF0a0IzQixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFMUSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdsQmYsUUFBTyxRQUFRO0lBQ2YsT0FBTSxPQUFPO0lBQ2IsTUFBSyxNQUFNO0lBQ1gsT0FBTSxPQUFPO0lBQ2IsV0FBVSxXQUFXOzs7OztJQUtyQixRQUFPLFFBQVE7SUFDZixPQUFNLE9BQU87OztBQUlqQixNQUFNOzs7O0lBS0YsWUFBWSxVQUFlLElBQUk7cUJBSlosVUFBVSxDQUFDLE1BQU07c0JBQ1IsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUM7UUFHaEMsSUFBSSxDQUFDLE9BQU8sR0FBRSxPQUFPLENBQUE7S0FBRTtDQUM3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuXG5cdHByaXZhdGUgX2Nvbm5lY3Q7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNvbm5lY3Q7XHQgXHRcdFxuXHRwcml2YXRlIF9jbG9zZTsgXHRcdFx0XG4gICAgcHVibGljIG9uQ2xvc2U7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfZXJyb3I7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkVycm9yO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX21lc3NhZ2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbk1lc3NhZ2U7XHQgXHRcdCAgXG4gICAgcHJpdmF0ZSB3czsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgd3NQcm90b2NvbDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0XG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cblx0cHJpdmF0ZSBfYXV0aFR5cGU9IHtuZXZlcjogMCwgZm9yd3JpdGU6IDEsIGFsd2F5czogMn07XG4gICAgLy8gKiogc2VydmVyIGluZm9ybWF0aW9uIGJsb2NrICoqXG4gICAgcHVibGljIHNlcnZlcj0ge1xuICAgICAgICBhdXRoUmVxdWlyZWQ6IDAsXHRcdFx0Ly8gZGVwcmljYXRlZDogMD0gJ25ldmVyJywgMT0gJ2ZvcndyaXRlXG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW10sXG4gICAgICAgIHdzOiB7IHNlbGY6IG51bGwsIHJvbGVzOiB7fSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG5cbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyBcbiAgICAgICAgdGhpcy5fY29ubmVjdD0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uQ29ubmVjdD0gdGhpcy5fY29ubmVjdC5hc09ic2VydmFibGUoKTsgICBcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNsb3NlPSB0aGlzLl9jbG9zZS5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBTaWduYWwgSyBBUEkgVkVSU0lPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG5cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogZ2V0IGxpc3Qgb2YgYXBpIHZlcnNpb25zIHN1cHBvcnRlZCBieSBzZXJ2ZXJcbiAgICBnZXQgYXBpVmVyc2lvbnMoKSB7IHJldHVybiB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucyB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIENPTk5FQ1RJT04gICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogaXMgV1MgU3RyZWFtIGNvbm5lY3RlZFxuICAgIGdldCBpc0Nvbm5lY3RlZCgpIHsgcmV0dXJuICh0aGlzLndzKSA/IHRydWUgOiBmYWxzZSB9XG5cbiAgICAvLyAqKiBpcyBBdXRoIHJlcXVpcmVkIGZvciB0aGlzIHNlcnZlciAqKlxuICAgIGdldCBhdXRoUmVxdWlyZWQoKSB7IHJldHVybiB0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQgfVxuXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9XG5cbiAgICAvLyAqKiBnZXQgYXV0aCB0b2tlbiBmb3Igc3VwcGxpZWQgdXNlciBkZXRhaWxzICoqXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgYGFwcGxpY2F0aW9uL2pzb25gKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXHRcbiAgICAvLyAqKiBsb2dvdXQgZnJvbSBzZXJ2ZXIgKipcbiAgICBsb2dvdXQoKSB7XG5cdFx0bGV0IHVybD1gJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ291dGA7XG5cdFx0aWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfSAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KFxuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAge31cbiAgICAgICAgKTtcbiAgICB9XHRcblxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XG5cbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGluaXRpYWxpc2UgY2xpZW50IGNvbm5lY3Rpb24gc2V0dGluZ3NcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIGlmKGlzRGV2TW9kZSgpKSB7IFxuICAgICAgICAgICAgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICcxOTIuMTY4Ljk5LjEwMCc7XG4gICAgICAgICAgICBwb3J0PSBwb3J0IHx8IDMwMDA7ICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICdsb2NhbGhvc3QnIH1cblxuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3NzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogcHJvY2VzcyBIZWxsbyByZXNwb25zZSBcbiAgICBwcml2YXRlIHByb2Nlc3NIZWxsbyhyZXNwb25zZSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkPShyZXNwb25zZVsnYXV0aGVudGljYXRpb25SZXF1aXJlZCddKSA/IFxuICAgICAgICAgICAgdGhpcy5fYXV0aFR5cGVbIHJlc3BvbnNlWydhdXRoZW50aWNhdGlvblJlcXVpcmVkJ10gXSA6IDA7XG4gICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICB9XG5cbiAgICAvLyAqKiByZXR1cm4gcHJlZmVycmVkIFdTIHN0cmVhbSB1cmxcbiAgICBwcml2YXRlIGdldFN0cmVhbVVybCgpIHtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIGVuZHBvaW50IHZlcnNpb246ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBmYWxsaW5nIGJhY2sgdG86IHYxYCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ119YCBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIG51bGwgfVxuICAgIH1cblxuICAgIC8vICoqIFNpZ25hbCBLIHNlcnZlciBkaXNjb3ZlcnkgcmVxdWVzdCAoL3NpZ25hbGspLiAgXG4gICAgaGVsbG8oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCcvc2lnbmFsaycpO1xuICAgIH0gICAgXG4gICAgXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXJcbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgIHJlc3BvbnNlPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybD0gdGhpcy5nZXRTdHJlYW1VcmwoKTtcbiAgICAgICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KCBuZXcgRXJyb3IoJ05vIFNpZ25hbCBLIGVuZHBvaW50cyBmb3VuZCEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICoqIHN1YnNjcmliZSAqKlxuICAgICAgICAgICAgICAgIGlmKHN1YnNjcmliZSkgeyB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWAgfSBcbiAgICAgICAgICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byAke3VybH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvci5uZXh0KCBlcnJvciApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCBubyBlbmRwb2ludCBkaXNjb3ZlcnlcbiAgICBjb25uZWN0RGVsdGEoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29ubmVjdERlbHRhLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy53c1Byb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9zdHJlYW1gO1xuICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgaWYoc3Vic2NyaWJlKSB7IHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9XG4gICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gZGVsdGEgc3RyZWFtIGF0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgfSAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlclxuICAgIHBsYXliYWNrKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOmFueSkge1xuICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmhlbGxvKGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpLnN1YnNjcmliZSggICAgLy8gKiogZGlzY292ZXIgZW5kcG9pbnRzICoqXG4gICAgICAgICAgICByZXNwb25zZT0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMuZ2V0U3RyZWFtVXJsKCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dCggbmV3IEVycm9yKCdObyBTaWduYWwgSyBlbmRwb2ludHMgZm91bmQhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgdXJsPSB1cmwucmVwbGFjZSgnc3RyZWFtJywncGxheWJhY2snKTsgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHN1YnNjcmliZSA9PT0nc3RyaW5nJykgeyB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWAgfSBcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygc3Vic2NyaWJlID09PSdvYmplY3QnKSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmwrPWA/c3Vic2NyaWJlPSR7dGhpcy5wYXJzZVBsYXliYWNrT3B0aW9ucyhzdWJzY3JpYmUpfWA7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byAke3VybH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvci5uZXh0KCBlcnJvciApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gXG4gICAgY29ubmVjdFBsYXliYWNrKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOmFueSkge1xuICAgICAgICB0aGlzLmRlYnVnKCdQbGF5YmFjay4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMud3NQcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vcGxheWJhY2tgO1xuICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgaWYodHlwZW9mIHN1YnNjcmliZSA9PT0nc3RyaW5nJykgeyB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWAgfSBcbiAgICAgICAgaWYodHlwZW9mIHN1YnNjcmliZSA9PT0nb2JqZWN0JykgeyBcbiAgICAgICAgICAgIHVybCs9YD9zdWJzY3JpYmU9JHt0aGlzLnBhcnNlUGxheWJhY2tPcHRpb25zKHN1YnNjcmliZSl9YDtcbiAgICAgICAgfSBcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfVxuICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvIHBsYXliYWNrIHN0cmVhbSBhdCAke3VybH1gKTtcbiAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHBhcnNlIHBsYXliYWNrIG9wdGlvbnMgaW50byBxdWVyeSBzdHJpbmdcbiAgICBwcml2YXRlIHBhcnNlUGxheWJhY2tPcHRpb25zKG9wdCkge1xuICAgICAgICBsZXQgcz0nJztcbiAgICAgICAgaWYob3B0LmNvbnRleHQpIHsgcys9IG9wdC5jb250ZXh0IH1cbiAgICAgICAgaWYob3B0LnN0YXJ0VGltZSkgeyBcbiAgICAgICAgICAgIGxldCB0PSBvcHQuc3RhcnRUaW1lLnNsaWNlKDAsb3B0LnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onO1xuICAgICAgICAgICAgcys9IGAmc3RhcnRUaW1lPSR7dH1gIFxuICAgICAgICB9XG4gICAgICAgIGlmKG9wdC5wbGF5YmFja1JhdGUpIHsgcys9IGAmcGxheWJhY2tSYXRlPSR7b3B0LnBsYXliYWNrUmF0ZX1gIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG5cdC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIGF0IHByb3ZpZGVkIHVybFxuXHRwcml2YXRlIGNvbm5lY3REZWx0YUJ5VXJsKHVybCkge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQgJiYgIXRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLndzKSB7IHRoaXMuZGlzY29ubmVjdCgpIH1cbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxuICAgICAgICBzZXRUaW1lb3V0KCBcbiAgICAgICAgICAgICgpPT57XG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIHdhdGNoZG9nIGV4cGlyZWQgKCR7dGhpcy5fd3NUaW1lb3V0LzEwMDB9IHNlYyk6ICR7dGhpcy53cy5yZWFkeVN0YXRlfS4uLiBhYm9ydGluZyBjb25uZWN0aW9uLi4uYCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl93c1RpbWVvdXRcbiAgICAgICAgKTtcblx0XHRcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3Mub3BlbmApOyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3MuY2xvc2VgKTsgdGhpcy5fY2xvc2UubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5lcnJvcmApOyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnJvbGVzPSBkYXRhLnJvbGVzO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnNlbGY9IGRhdGEuc2VsZjtcbiAgICAgICAgICAgIH0gICAgICAgICAgXG5cdFx0XHRpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9XG5cdFx0fVxuICAgIH0gIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIFNpZ25hbCBLIHN0cmVhbVxuICAgIGRpc2Nvbm5lY3QoKSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHtcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMud3M9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci53cz0geyBzZWxmOiBudWxsLCByb2xlczoge30gfTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBTVFJFQU0gQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogc2VuZCBkYXRhIHRvIFNpZ25hbCBLIHN0cmVhbVxuICAgIHNlbmQoZGF0YTphbnkpIHtcbiAgICAgICAgaWYodGhpcy53cykge1xuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7IGRhdGE9IEpTT04uc3RyaW5naWZ5KGRhdGEpIH1cbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIHNlbmQgdmFsdWUgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICBsZXQgdmFsPSB7IFxuICAgICAgICAgICAgY29udGV4dDogKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQsXG4gICAgICAgICAgICB1cGRhdGVzOiBbIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IFt7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9XSBcbiAgICAgICAgICAgIH0gXSBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlYnVnKGBzZW5kaW5nIHVwZGF0ZTogJHtKU09OLnN0cmluZ2lmeSh2YWwpfWApO1xuICAgICAgICB0aGlzLnNlbmQodmFsKTtcbiAgICB9XG5cbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonLCAuLi5vcHRpb25zKSB7XG4gICAgICAgIGxldCBkYXRhPSB7XG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHN1YnNjcmliZTogW11cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uPSB7fTtcbiAgICAgICAgc3Vic2NyaXB0aW9uWydwYXRoJ109IHBhdGg7XG4gICAgICAgIGZvcihsZXQgaSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBzd2l0Y2goaSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJzAnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydwZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcxJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0nZGVsdGEnIHx8IG9wdGlvbnNbaV09PSdmdWxsJykgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsnZm9ybWF0J109IG9wdGlvbnNbaV0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMic6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbaV09PSdpZGVhbCcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1tpXT09ICdmaXhlZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsncG9saWN5J109IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgICBcbiAgICAgICAgICAgICAgICBjYXNlICczJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblsncG9saWN5J109PSdpbnN0YW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydtaW5QZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhLnN1YnNjcmliZS5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuc2VuZChkYXRhKTsgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicpIHtcbiAgICAgICAgY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuc2VuZCh7XG4gICAgICAgICAgICBcImNvbnRleHRcIjogY29udGV4dCxcbiAgICAgICAgICAgIFwidW5zdWJzY3JpYmVcIjogWyB7XCJwYXRoXCI6IHBhdGh9IF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXG4gICAgaXNEZWx0YShtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcbiAgICBpc0hlbGxvKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgfVxuXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcbiAgICBnZXQgZmlsdGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCFpZCkgeyAgIC8vICoqIGNsZWFyIGZpbHRlclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPW51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXG4gICAgICAgICAgICBpZighdGhpcy5zZXJ2ZXIud3Muc2VsZikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VsZklkKCkuc3Vic2NyaWJlKCBpZD0+IHsgdGhpcy5fZmlsdGVyPSBpZCB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSB0aGlzLnNlcnZlci53cy5zZWxmIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgIC8vICoqIHV1aWRcbiAgICAgICAgICAgIGxldCB1dWlkPSBSZWdFeHAoXCJedXJuOm1ybjpzaWduYWxrOnV1aWQ6WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVs4OUFCYWJdWzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17MTJ9JFwiKVxuICAgICAgICAgICAgaWYoaWQuaW5kZXhPZigndmVzc2Vscy4nKSE9LTEpIHsgaWQ9IGlkLnNsaWNlKGlkLmluZGV4T2YoJy4nKSsxKSB9XG4gICAgICAgICAgICBpZih1dWlkLnRlc3QoaWQpKSB7IHRoaXMuX2ZpbHRlcj0gYHZlc3NlbHMuJHtpZH1gIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIFJhaXNlIGFuIGFsYXJtIG1lc3NhZ2UgKipcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgYWxhcm1QYXRoOnN0cmluZywgYWxhcm06QWxhcm0pIHtcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIGBub3RpZmljYXRpb25zLiR7YWxhcm1QYXRofWAsIGFsYXJtKTtcbiAgICB9XG5cbiAgICAvLyAqKiBDbGVhciBhbGFybSAqKlxuICAgIGNsZWFyQWxhcm0oY29udGV4dDpzdHJpbmc9J3NlbGYnLCBhbGFybVBhdGg6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBgbm90aWZpY2F0aW9ucy4ke2FsYXJtUGF0aH1gLCBudWxsKTtcbiAgICB9IFxuICAgICAgICAgICAgXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIEhUVFAgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIFxuICAgIC8vICoqIFJldHVybnMgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZlxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmFwaUdldChgdmVzc2Vscy9zZWxmYCkgfVxuXG4gICAgLy8gKiogUmV0dXJucyB0aGUgc2VsZiBpZGVudGl0eVxuICAgIGdldFNlbGZJZCgpIHsgcmV0dXJuIHRoaXMuYXBpR2V0KGBzZWxmYCkgfVxuXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxuICAgIGdldE1ldGEoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICByZXR1cm4gdGhpcy5hcGlHZXQoYCR7dGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke3RoaXMuZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xuICAgIH0gICAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBhcGkgcGF0aFxuICAgIGFwaUdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxuICAgICAgICB1cmwrPSB0aGlzLmRvdFRvU2xhc2gocGF0aCk7XG4gICAgICAgIHRoaXMuZGVidWcoYGFwaUdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vKiogU2VuZCB2YWx1ZSB0byBodHRwIGFwaSBwYXRoXG5cdGFwaVB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XG5cdGFwaVB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XG5cdFxuICAgIGFwaVB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleT86YW55LCB2YWx1ZT86YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KSArICcvJyArIHRoaXMuZG90VG9TbGFzaChwYXRoKTtcblxuICAgICAgICBsZXQgbXNnID0geyB2YWx1ZToge30gfSBcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlPT0ndW5kZWZpbmVkJykgeyBtc2cudmFsdWU9IGtleSB9XG5cdFx0ZWxzZSB7IG1zZy52YWx1ZVtrZXldPSB2YWx1ZSB9XG5cbiAgICAgICAgdGhpcy5kZWJ1ZyhgYXBpUHV0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmRlYnVnKEpTT04uc3RyaW5naWZ5KG1zZykpO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZyk7IFxuICAgICAgICB9XG4gICAgfSAgICBcblxuICAgIC8vKiogZ2V0IGRhdGEgdmlhIHRoZSBzbmFwc2hvdCBodHRwIGFwaSBwYXRoIGZvciBzdXBwbGllZCB0aW1lXG4gICAgc25hcHNob3QoY29udGV4dDpzdHJpbmcsIHRpbWU6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZighdGltZSkgeyByZXR1cm4gfVxuICAgICAgICB0aW1lPSB0aW1lLnNsaWNlKDAsdGltZS5pbmRleE9mKCcuJykpICsgJ1onO1xuICAgICAgICB1cmw9IGAvc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L3NuYXBzaG90LyR7dGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpfT90aW1lPSR7dGltZX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBzbmFwc2hvdCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7dGhpcy5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfTsgIFxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcHV0IHRvIGh0dHAgcGF0aFxuICAgIHB1dChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcHV0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfTtcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHBvc3QgdG8gaHR0cCBwYXRoXG4gICAgcG9zdChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcG9zdCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfTsgICAgXG5cbiAgICAvLyAqKiByZXR1cm4gdXJsIGZvciBjb25uZWN0ZWQgc2lnbmFsay1odHRwIGVuZHBvaW50XG4gICAgcHJpdmF0ZSByZXNvbHZlSHR0cEVuZHBvaW50KCkge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0pIHsgLy8gKiogY29ubmVjdGlvbiBtYWRlXG4gICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIGh0dHAgZW5kcG9pbnQgYXQgcHJlc2NyaWJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXSkge1xuICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLWh0dHAnXX1gIH0gICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbXNnPSAnTm8gY3VycmVudCBjb25uZWN0aW9uIGh0dHAgZW5kcG9pbnQgc2VydmljZSEgVXNlIGNvbm5lY3QoKSB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uLidcbiAgICAgICAgICAgIHRoaXMuZGVidWcobXNnKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKG1zZykgKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHVybDsgICBcbiAgICB9XG5cbiAgICAvLyAqKiBwYXJzZSBjb250ZXh0IHRvIHZhbGlkIFNpZ25hbCBLIHBhdGhcbiAgICBwcml2YXRlIGNvbnRleHRUb1BhdGgoY29udGV4dDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IHJlcz0gKGNvbnRleHQ9PSdzZWxmJyApID8gJ3Zlc3NlbHMuc2VsZic6IGNvbnRleHQ7XG4gICAgICAgIHJldHVybiByZXMuc3BsaXQoJy4nKS5qb2luKCcvJyk7XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxuICAgIHByaXZhdGUgZG90VG9TbGFzaChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfVxuXG4gICAgLy8gKiogdHJhbnNmb3JtIHNsYXNoIG5vdGF0aW9uIHRvIGRvdFxuICAgIHByaXZhdGUgc2xhc2hUb0RvdChwYXRoOnN0cmluZykge1xuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy8nKSE9LTEpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnNwbGl0KCcvJykuam9pbignLicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XG4gICAgfSAgICBcblxufVxuXG4vLyAqKiBBbGFybSBzdGF0ZSAqKlxuZXhwb3J0IGVudW0gIEFsYXJtU3RhdGUge1xuICAgIG5vcm1hbD0nbm9ybWFsJyxcbiAgICBhbGVydD0nYWxlcnQnLFxuICAgIHdhcm49J3dhcm4nLFxuICAgIGFsYXJtPSdhbGFybScsXG4gICAgZW1lcmdlbmN5PSdlbWVyZ2VuY3knXG59XG5cbi8vICoqIEFsYXJtIE1ldGhvZCAqKlxuZXhwb3J0IGVudW0gIEFsYXJtTWV0aG9kIHtcbiAgICB2aXN1YWw9J3Zpc3VhbCcsXG4gICAgc291bmQ9J3NvdW5kJ1xufVxuXG4vLyAqKiBBbGFybSBjbGFzc1xuZXhwb3J0IGNsYXNzIEFsYXJtIHtcbiAgICBzdGF0ZTogQWxhcm1TdGF0ZT0gQWxhcm1TdGF0ZS5ub3JtYWw7XG4gICAgbWV0aG9kOiBBcnJheTxBbGFybU1ldGhvZD49IFtBbGFybU1ldGhvZC52aXN1YWwsIEFsYXJtTWV0aG9kLnNvdW5kXTtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOnN0cmluZz1udWxsKSB7IHRoaXMubWVzc2FnZT0gbWVzc2FnZSB9XG59XG5cblxuIl19