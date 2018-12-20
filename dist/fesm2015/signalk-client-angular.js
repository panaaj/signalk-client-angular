import { Injectable, isDevMode, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class SignalKClient {
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
/** @nocollapse */ SignalKClient.ngInjectableDef = defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(inject(HttpClient)); }, token: SignalKClient, providedIn: "root" });
/** @enum {string} */
const AlarmState = {
    normal: 'normal',
    alert: 'alert',
    warn: 'warn',
    alarm: 'alarm',
    emergency: 'emergency',
};
/** @enum {string} */
const AlarmMethod = {
    visual: 'visual',
    sound: 'sound',
};
class Alarm {
    /**
     * @param {?=} message
     */
    constructor(message = null) {
        this.state = AlarmState.normal;
        this.method = [AlarmMethod.visual, AlarmMethod.sound];
        this.message = message;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { SignalKClient, AlarmState, AlarmMethod, Alarm };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG5cblx0cHJpdmF0ZSBfY29ubmVjdDsgXHRcdFx0XG4gICAgcHVibGljIG9uQ29ubmVjdDtcdCBcdFx0XG5cdHByaXZhdGUgX2Nsb3NlOyBcdFx0XHRcbiAgICBwdWJsaWMgb25DbG9zZTtcdCBcdFx0ICAgIFxuXHRwcml2YXRlIF9lcnJvcjsgXHRcdFx0XG4gICAgcHVibGljIG9uRXJyb3I7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfbWVzc2FnZTsgXHRcdFx0XG4gICAgcHVibGljIG9uTWVzc2FnZTtcdCBcdFx0ICBcbiAgICBwcml2YXRlIHdzOyAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSB3c1Byb3RvY29sOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF92ZXJzaW9uOiBzdHJpbmc9ICd2MSc7ICAgICAgLy8gKiogZGVmYXVsdCBTaWduYWwgSyBhcGkgdmVyc2lvblxuICAgIHByaXZhdGUgX2ZpbHRlcj0gbnVsbDsgICAgICAgICAgICAgICAvLyAqKiBpZCBvZiB2ZXNzZWwgdG8gZmlsdGVyIGRlbHRhIG1lc3NhZ2VzXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXRcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuXHRwcml2YXRlIF9hdXRoVHlwZT0ge25ldmVyOiAwLCBmb3J3cml0ZTogMSwgYWx3YXlzOiAyfTtcbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwdWJsaWMgc2VydmVyPSB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogMCxcdFx0XHQvLyBkZXByaWNhdGVkOiAwPSAnbmV2ZXInLCAxPSAnZm9yd3JpdGVcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXSxcbiAgICAgICAgd3M6IHsgc2VsZjogbnVsbCwgcm9sZXM6IHt9IH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlYnVnKHZhbDogYW55KSB7IGlmKGlzRGV2TW9kZSgpKXsgY29uc29sZS5sb2codmFsKSB9IH1cblxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7IFxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25Db25uZWN0PSB0aGlzLl9jb25uZWN0LmFzT2JzZXJ2YWJsZSgpOyAgIFxuICAgICAgICB0aGlzLl9jbG9zZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICBcbiAgICAgICAgdGhpcy5pbml0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIFNpZ25hbCBLIEFQSSBWRVJTSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cblxuICAgIHNldCB2ZXJzaW9uKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGxldCB2OnN0cmluZz0gJ3YnKyB2YWw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmxlbmd0aD09MCkgeyBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249IHY7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgdG86ICR7dn1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249ICh0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5pbmRleE9mKHYpIT0tMSkgPyB2IDogdGhpcy5fdmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCByZXF1ZXN0OiAke3Z9LCByZXN1bHQ6ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAqKiBnZXQgbGlzdCBvZiBhcGkgdmVyc2lvbnMgc3VwcG9ydGVkIGJ5IHNlcnZlclxuICAgIGdldCBhcGlWZXJzaW9ucygpIHsgcmV0dXJuIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKiogQ09OTkVDVElPTiAgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBpcyBXUyBTdHJlYW0gY29ubmVjdGVkXG4gICAgZ2V0IGlzQ29ubmVjdGVkKCkgeyByZXR1cm4gKHRoaXMud3MpID8gdHJ1ZSA6IGZhbHNlIH1cblxuICAgIC8vICoqIGlzIEF1dGggcmVxdWlyZWQgZm9yIHRoaXMgc2VydmVyICoqXG4gICAgZ2V0IGF1dGhSZXF1aXJlZCgpIHsgcmV0dXJuIHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCB9XG5cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH1cblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcblx0XHRpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9ICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoXG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICB7fVxuICAgICAgICApO1xuICAgIH1cdFxuXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcbiAgICBnZXQgY29ubmVjdGlvblRpbWVvdXQoKTpudW1iZXIgeyByZXR1cm4gdGhpcy5fd3NUaW1lb3V0IH1cblxuICAgIHNldCBjb25uZWN0aW9uVGltZW91dCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcbiAgICB9ICAgIFxuXG4gICAgLy8gKiogaW5pdGlhbGlzZSBjbGllbnQgY29ubmVjdGlvbiBzZXR0aW5nc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgaWYoaXNEZXZNb2RlKCkpIHsgXG4gICAgICAgICAgICBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJzE5Mi4xNjguOTkuMTAwJztcbiAgICAgICAgICAgIHBvcnQ9IHBvcnQgfHwgMzAwMDsgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJ2xvY2FsaG9zdCcgfVxuXG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3c3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA0NDM7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3cyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKiBwcm9jZXNzIEhlbGxvIHJlc3BvbnNlIFxuICAgIHByaXZhdGUgcHJvY2Vzc0hlbGxvKHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0gKHJlc3BvbnNlWydzZXJ2ZXInXSkgPyByZXNwb25zZVsnc2VydmVyJ10gOiB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9ICh0aGlzLnNlcnZlci5lbmRwb2ludHMpID8gT2JqZWN0LmtleXModGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA6IFtdO1xuICAgICAgICB0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQ9KHJlc3BvbnNlWydhdXRoZW50aWNhdGlvblJlcXVpcmVkJ10pID8gXG4gICAgICAgICAgICB0aGlzLl9hdXRoVHlwZVsgcmVzcG9uc2VbJ2F1dGhlbnRpY2F0aW9uUmVxdWlyZWQnXSBdIDogMDtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHByaXZhdGUgZ2V0U3RyZWFtVXJsKCkge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfVxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlclxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgcmVzcG9uc2U9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICBsZXQgdXJsPSB0aGlzLmdldFN0cmVhbVVybCgpO1xuICAgICAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQoIG5ldyBFcnJvcignTm8gU2lnbmFsIEsgZW5kcG9pbnRzIGZvdW5kIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgICAgICAgICAgaWYoc3Vic2NyaWJlKSB7IHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHVybCs9IGAmdG9rZW49JHt0aGlzLl90b2tlbn1gIH0gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvICR7dXJsfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gW107ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yLm5leHQoIGVycm9yICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSB3aXRoIG5vIGVuZHBvaW50IGRpc2NvdmVyeVxuICAgIGNvbm5lY3REZWx0YShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICB0aGlzLmRlYnVnKCdDb25uZWN0RGVsdGEuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLndzUHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L3N0cmVhbWA7XG4gICAgICAgIC8vICoqIHN1YnNjcmliZSAqKlxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHVybCs9IGAmdG9rZW49JHt0aGlzLl90b2tlbn1gIH1cbiAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byBkZWx0YSBzdHJlYW0gYXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICB9ICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyXG4gICAgcGxheWJhY2soaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6YW55KSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgIHJlc3BvbnNlPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybD0gdGhpcy5nZXRTdHJlYW1VcmwoKTtcbiAgICAgICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KCBuZXcgRXJyb3IoJ05vIFNpZ25hbCBLIGVuZHBvaW50cyBmb3VuZCEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCdwbGF5YmFjaycpOyAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygc3Vic2NyaWJlID09PSdzdHJpbmcnKSB7IHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBzdWJzY3JpYmUgPT09J29iamVjdCcpIHsgXG4gICAgICAgICAgICAgICAgICAgIHVybCs9YD9zdWJzY3JpYmU9JHt0aGlzLnBhcnNlUGxheWJhY2tPcHRpb25zKHN1YnNjcmliZSl9YDtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHVybCs9IGAmdG9rZW49JHt0aGlzLl90b2tlbn1gIH0gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvICR7dXJsfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gW107ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yLm5leHQoIGVycm9yICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSBcbiAgICBjb25uZWN0UGxheWJhY2soaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6YW55KSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ1BsYXliYWNrLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy53c1Byb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9wbGF5YmFja2A7XG4gICAgICAgIC8vICoqIHN1YnNjcmliZSAqKlxuICAgICAgICBpZih0eXBlb2Ygc3Vic2NyaWJlID09PSdzdHJpbmcnKSB7IHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxuICAgICAgICBpZih0eXBlb2Ygc3Vic2NyaWJlID09PSdvYmplY3QnKSB7IFxuICAgICAgICAgICAgdXJsKz1gP3N1YnNjcmliZT0ke3RoaXMucGFyc2VQbGF5YmFja09wdGlvbnMoc3Vic2NyaWJlKX1gO1xuICAgICAgICB9IFxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9XG4gICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gcGxheWJhY2sgc3RyZWFtIGF0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogcGFyc2UgcGxheWJhY2sgb3B0aW9ucyBpbnRvIHF1ZXJ5IHN0cmluZ1xuICAgIHByaXZhdGUgcGFyc2VQbGF5YmFja09wdGlvbnMob3B0KSB7XG4gICAgICAgIGxldCBzPScnO1xuICAgICAgICBpZihvcHQuY29udGV4dCkgeyBzKz0gb3B0LmNvbnRleHQgfVxuICAgICAgICBpZihvcHQuc3RhcnRUaW1lKSB7IFxuICAgICAgICAgICAgbGV0IHQ9IG9wdC5zdGFydFRpbWUuc2xpY2UoMCxvcHQuc3RhcnRUaW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgICAgICBzKz0gYCZzdGFydFRpbWU9JHt0fWAgXG4gICAgICAgIH1cbiAgICAgICAgaWYob3B0LnBsYXliYWNrUmF0ZSkgeyBzKz0gYCZwbGF5YmFja1JhdGU9JHtvcHQucGxheWJhY2tSYXRlfWAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG5cblx0Ly8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gYXQgcHJvdmlkZWQgdXJsXG5cdHByaXZhdGUgY29ubmVjdERlbHRhQnlVcmwodXJsKSB7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCAmJiAhdGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMud3MpIHsgdGhpcy5kaXNjb25uZWN0KCkgfVxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICAvLyAqKiBzdGFydCBjb25uZWN0aW9uIHdhdGNoZG9nICoqXG4gICAgICAgIHNldFRpbWVvdXQoIFxuICAgICAgICAgICAgKCk9PntcbiAgICAgICAgICAgICAgICBpZih0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gd2F0Y2hkb2cgZXhwaXJlZCAoJHt0aGlzLl93c1RpbWVvdXQvMTAwMH0gc2VjKTogJHt0aGlzLndzLnJlYWR5U3RhdGV9Li4uIGFib3J0aW5nIGNvbm5lY3Rpb24uLi5gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxuICAgICAgICApO1xuXHRcdFxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5vcGVuYCk7IHRoaXMuX2Nvbm5lY3QubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5jbG9zZWApOyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9uZXJyb3I9IGU9PiB7IHRoaXMuZGVidWcoYHdzLmVycm9yYCk7IHRoaXMuX2Vycm9yLm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25tZXNzYWdlPSBlPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBpZih0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XG4gICAgICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Mucm9sZXM9IGRhdGEucm9sZXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Muc2VsZj0gZGF0YS5zZWxmO1xuICAgICAgICAgICAgfSAgICAgICAgICBcblx0XHRcdGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH1cblx0XHR9XG4gICAgfSAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gU2lnbmFsIEsgc3RyZWFtXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgaWYodGhpcy53cykge1xuICAgICAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xuICAgICAgICAgICAgdGhpcy53cz0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLndzPSB7IHNlbGY6IG51bGwsIHJvbGVzOiB7fSB9O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIFNUUkVBTSBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXG4gICAgc2VuZChkYXRhOmFueSkge1xuICAgICAgICBpZih0aGlzLndzKSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKiogc2VuZCB2YWx1ZSB2aWEgZGVsdGEgc3RyZWFtIHVwZGF0ZSAqKlxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7XG4gICAgICAgIGxldCB2YWw9IHsgXG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHVwZGF0ZXM6IFsge1xuICAgICAgICAgICAgICAgIHZhbHVlczogW3sgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH1dIFxuICAgICAgICAgICAgfSBdIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVidWcoYHNlbmRpbmcgdXBkYXRlOiAke0pTT04uc3RyaW5naWZ5KHZhbCl9YCk7XG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xuICAgIH1cblxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicsIC4uLm9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGRhdGE9IHtcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxuICAgICAgICAgICAgc3Vic2NyaWJlOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb249IHt9O1xuICAgICAgICBzdWJzY3JpcHRpb25bJ3BhdGgnXT0gcGF0aDtcbiAgICAgICAgZm9yKGxldCBpIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHN3aXRjaChpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnMCc6IFxuICAgICAgICAgICAgICAgICAgICBpZiggIWlzTmFOKG9wdGlvbnNbaV0pICkgeyBzdWJzY3JpcHRpb25bJ3BlcmlvZCddPSBwYXJzZUludChvcHRpb25zW2ldKSB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzEnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9wdGlvbnNbaV09PSdkZWx0YScgfHwgb3B0aW9uc1tpXT09J2Z1bGwnKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uWydmb3JtYXQnXT0gb3B0aW9uc1tpXSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcyJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0naW5zdGFudCcgfHwgb3B0aW9uc1tpXT09J2lkZWFsJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvcHRpb25zW2ldPT0gJ2ZpeGVkJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uWydwb2xpY3knXT0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhazsgICAgIFxuICAgICAgICAgICAgICAgIGNhc2UgJzMnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uWydwb2xpY3knXT09J2luc3RhbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggIWlzTmFOKG9wdGlvbnNbaV0pICkgeyBzdWJzY3JpcHRpb25bJ21pblBlcmlvZCddPSBwYXJzZUludChvcHRpb25zW2ldKSB9IFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRhdGEuc3Vic2NyaWJlLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5zZW5kKGRhdGEpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcbiAgICB1bnN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nPScqJykge1xuICAgICAgICBjb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcbiAgICAgICAgdGhpcy5zZW5kKHtcbiAgICAgICAgICAgIFwiY29udGV4dFwiOiBjb250ZXh0LFxuICAgICAgICAgICAgXCJ1bnN1YnNjcmliZVwiOiBbIHtcInBhdGhcIjogcGF0aH0gXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIERlbHRhIG1lc3NhZ2VcbiAgICBpc0RlbHRhKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy5jb250ZXh0IT0gJ3VuZGVmaW5lZCcgfVxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiByZWNpZXZlZCBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxuICAgIGlzSGVsbG8obXNnKSB7IHJldHVybiB0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyB9XG5cblxuICAgIC8vICoqIGdldCAvIHNldCBmaWx0ZXIgdG8gc2VsZWN0IGRlbHRhIG1lc3NhZ2VzIGp1c3QgZm9yIHN1cHBsaWVkIHZlc3NlbCBpZCAgIFxuICAgIGdldCBmaWx0ZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XG4gICAgLy8gKiogc2V0IGZpbHRlcj0gbnVsbCB0byByZW1vdmUgbWVzc2FnZSBmaWx0ZXJpbmdcbiAgICBzZXQgZmlsdGVyKGlkOnN0cmluZykgeyBcbiAgICAgICAgaWYoIWlkKSB7ICAgLy8gKiogY2xlYXIgZmlsdGVyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXI9bnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiggaWQuaW5kZXhPZignc2VsZicpIT0tMSApIHsgIC8vICoqIHNlbGZcbiAgICAgICAgICAgIGlmKCF0aGlzLnNlcnZlci53cy5zZWxmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTZWxmSWQoKS5zdWJzY3JpYmUoIGlkPT4geyB0aGlzLl9maWx0ZXI9IGlkIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9maWx0ZXI9IHRoaXMuc2VydmVyLndzLnNlbGYgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAgLy8gKiogdXVpZFxuICAgICAgICAgICAgbGV0IHV1aWQ9IFJlZ0V4cChcIl51cm46bXJuOnNpZ25hbGs6dXVpZDpbMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzg5QUJhYl1bMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXsxMn0kXCIpXG4gICAgICAgICAgICBpZihpZC5pbmRleE9mKCd2ZXNzZWxzLicpIT0tMSkgeyBpZD0gaWQuc2xpY2UoaWQuaW5kZXhPZignLicpKzEpIH1cbiAgICAgICAgICAgIGlmKHV1aWQudGVzdChpZCkpIHsgdGhpcy5fZmlsdGVyPSBgdmVzc2Vscy4ke2lkfWAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKiogUmFpc2UgYW4gYWxhcm0gbWVzc2FnZSAqKlxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmc9J3NlbGYnLCBhbGFybVBhdGg6c3RyaW5nLCBhbGFybTpBbGFybSkge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgYG5vdGlmaWNhdGlvbnMuJHthbGFybVBhdGh9YCwgYWxhcm0pO1xuICAgIH1cblxuICAgIC8vICoqIENsZWFyIGFsYXJtICoqXG4gICAgY2xlYXJBbGFybShjb250ZXh0OnN0cmluZz0nc2VsZicsIGFsYXJtUGF0aDpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIGBub3RpZmljYXRpb25zLiR7YWxhcm1QYXRofWAsIG51bGwpO1xuICAgIH0gXG4gICAgICAgICAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogSFRUUCBBUEkgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgXG4gICAgLy8gKiogUmV0dXJucyB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuYXBpR2V0KGB2ZXNzZWxzL3NlbGZgKSB9XG5cbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBzZWxmIGlkZW50aXR5XG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHNlbGZgKSB9XG5cbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXG4gICAgICAgIHJldHVybiB0aGlzLmFwaUdldChgJHt0aGlzLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7dGhpcy5kb3RUb1NsYXNoKHBhdGgpfS9tZXRhYCk7XG4gICAgfSAgICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIGFwaSBwYXRoXG4gICAgYXBpR2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuZG90VG9TbGFzaChwYXRoKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgYXBpR2V0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8qKiBTZW5kIHZhbHVlIHRvIGh0dHAgYXBpIHBhdGhcblx0YXBpUHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcblx0YXBpUHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KTtcblx0XG4gICAgYXBpUHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5PzphbnksIHZhbHVlPzphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cbiAgICAgICAgdXJsKz0gdGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpICsgJy8nICsgdGhpcy5kb3RUb1NsYXNoKHBhdGgpO1xuXG4gICAgICAgIGxldCBtc2cgPSB7IHZhbHVlOiB7fSB9IFxuICAgICAgICBpZih0eXBlb2YgdmFsdWU9PSd1bmRlZmluZWQnKSB7IG1zZy52YWx1ZT0ga2V5IH1cblx0XHRlbHNlIHsgbXNnLnZhbHVlW2tleV09IHZhbHVlIH1cblxuICAgICAgICB0aGlzLmRlYnVnKGBhcGlQdXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuZGVidWcoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKTsgXG4gICAgICAgIH1cbiAgICB9ICAgIFxuXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIHVybD0gYC9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vc25hcHNob3QvJHt0aGlzLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHNuYXBzaG90ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBwYXRoXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgZ2V0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwdXQgdG8gaHR0cCBwYXRoXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke3RoaXMuZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwdXQgJHt1cmx9YCk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgdmFsdWUpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke3RoaXMuZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9OyAgICBcblxuICAgIC8vICoqIHJldHVybiB1cmwgZm9yIGNvbm5lY3RlZCBzaWduYWxrLWh0dHAgZW5kcG9pbnRcbiAgICBwcml2YXRlIHJlc29sdmVIdHRwRW5kcG9pbnQoKSB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSkgeyAvLyAqKiBjb25uZWN0aW9uIG1hZGVcbiAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gaHR0cCBlbmRwb2ludCBhdCBwcmVzY3JpYmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddKSB7XG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstaHR0cCddfWAgfSAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtc2c9ICdObyBjdXJyZW50IGNvbm5lY3Rpb24gaHR0cCBlbmRwb2ludCBzZXJ2aWNlISBVc2UgY29ubmVjdCgpIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uJ1xuICAgICAgICAgICAgdGhpcy5kZWJ1Zyhtc2cpO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IobXNnKSApO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdXJsOyAgIFxuICAgIH1cblxuICAgIC8vICoqIHBhcnNlIGNvbnRleHQgdG8gdmFsaWQgU2lnbmFsIEsgcGF0aFxuICAgIHByaXZhdGUgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZykge1xuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcbiAgICAgICAgcmV0dXJuIHJlcy5zcGxpdCgnLicpLmpvaW4oJy8nKTtcbiAgICB9XG5cbiAgICAvLyAqKiB0cmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIHNsYXNoXG4gICAgcHJpdmF0ZSBkb3RUb1NsYXNoKHBhdGg6c3RyaW5nKSB7XG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLicpIT0tMSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5qb2luKCcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cbiAgICB9XG5cbiAgICAvLyAqKiB0cmFuc2Zvcm0gc2xhc2ggbm90YXRpb24gdG8gZG90XG4gICAgcHJpdmF0ZSBzbGFzaFRvRG90KHBhdGg6c3RyaW5nKSB7XG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLycpIT0tMSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKS5qb2luKCcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cbiAgICB9ICAgIFxuXG59XG5cbi8vICoqIEFsYXJtIHN0YXRlICoqXG5leHBvcnQgZW51bSAgQWxhcm1TdGF0ZSB7XG4gICAgbm9ybWFsPSdub3JtYWwnLFxuICAgIGFsZXJ0PSdhbGVydCcsXG4gICAgd2Fybj0nd2FybicsXG4gICAgYWxhcm09J2FsYXJtJyxcbiAgICBlbWVyZ2VuY3k9J2VtZXJnZW5jeSdcbn1cblxuLy8gKiogQWxhcm0gTWV0aG9kICoqXG5leHBvcnQgZW51bSAgQWxhcm1NZXRob2Qge1xuICAgIHZpc3VhbD0ndmlzdWFsJyxcbiAgICBzb3VuZD0nc291bmQnXG59XG5cbi8vICoqIEFsYXJtIGNsYXNzXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xuICAgIHN0YXRlOiBBbGFybVN0YXRlPSBBbGFybVN0YXRlLm5vcm1hbDtcbiAgICBtZXRob2Q6IEFycmF5PEFsYXJtTWV0aG9kPj0gW0FsYXJtTWV0aG9kLnZpc3VhbCwgQWxhcm1NZXRob2Quc291bmRdO1xuICAgIG1lc3NhZ2U6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nPW51bGwpIHsgdGhpcy5tZXNzYWdlPSBtZXNzYWdlIH1cbn1cblxuXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztJQXlDSSxZQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO3dCQWpCWCxJQUFJO3VCQUNiLElBQUk7MEJBQ0QsS0FBSzt5QkFHVCxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO3NCQUVuQztZQUNYLFlBQVksRUFBRSxDQUFDOztZQUNmLFNBQVMsRUFBRSxFQUFFO1lBQ2IsSUFBSSxFQUFFLEVBQUU7WUFDUixXQUFXLEVBQUUsRUFBRTtZQUNmLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtTQUNoQztRQUtHLElBQUksQ0FBQyxRQUFRLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFB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