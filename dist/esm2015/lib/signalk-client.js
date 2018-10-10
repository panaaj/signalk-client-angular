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
        return this.http.post(`${this.protocol}://${this.hostname}:${this.port}/auth/login`, { "username": username, "password": password }, { headers });
    }
    /**
     * @return {?}
     */
    logout() {
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}/auth/logout`;
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
     * @param {?=} hostname
     * @param {?=} port
     * @param {?=} useSSL
     * @return {?}
     */
    hello(hostname = null, port = null, useSSL = false) {
        this.init(hostname, port, useSSL);
        /*this.get('/loginStatus').subscribe( r=> {
                    this.server.authRequired=(r['authenticationRequired']) ? true : false;
                })*/
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
            this.server.endpoints = (response['endpoints']) ? response['endpoints'] : {};
            this.server.info = (response['server']) ? response['server'] : {};
            this.server.apiVersions = (this.server.endpoints) ? Object.keys(this.server.endpoints) : [];
            this.debug(this.server.endpoints);
            /** @type {?} */
            let url;
            if (this.server.endpoints[this._version] && this.server.endpoints[this._version]['signalk-ws']) {
                this.debug(`Connecting endpoint version: ${this._version}`);
                url = `${this.server.endpoints[this._version]['signalk-ws']}`;
            }
            else if (this.server.endpoints['v1'] && this.server.endpoints['v1']['signalk-ws']) {
                this.debug(`Connection falling back to: v1`);
                url = `${this.server.endpoints['v1']['signalk-ws']}`;
            }
            else {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7OztBQUszQyxNQUFNOzs7O0lBaUNGLFlBQXFCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7d0JBaEJYLElBQUk7dUJBQ2IsSUFBSTswQkFDRCxLQUFLO3NCQUlUO1lBQ1osWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLEVBQUU7WUFDYixJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxFQUFFO1lBQ2YsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1NBQ2hDO1FBS0csSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxD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YixNQUFLLE1BQU07SUFDWCxPQUFNLE9BQU87SUFDYixXQUFVLFdBQVc7Ozs7O0lBS3JCLFFBQU8sUUFBUTtJQUNmLE9BQU0sT0FBTzs7O0FBSWpCLE1BQU07Ozs7SUFLRixZQUFZLFVBQWUsSUFBSTtxQkFKWixVQUFVLENBQUMsTUFBTTtzQkFDUixDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUdoQyxJQUFJLENBQUMsT0FBTyxHQUFFLE9BQU8sQ0FBQTtLQUFFO0NBQzdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG5cblx0cHJpdmF0ZSBfY29ubmVjdDsgXHRcdFx0XG4gICAgcHVibGljIG9uQ29ubmVjdDtcdCBcdFx0XG5cdHByaXZhdGUgX2Nsb3NlOyBcdFx0XHRcbiAgICBwdWJsaWMgb25DbG9zZTtcdCBcdFx0ICAgIFxuXHRwcml2YXRlIF9lcnJvcjsgXHRcdFx0XG4gICAgcHVibGljIG9uRXJyb3I7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfbWVzc2FnZTsgXHRcdFx0XG4gICAgcHVibGljIG9uTWVzc2FnZTtcdCBcdFx0ICBcbiAgICBwcml2YXRlIHdzOyAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIFxuICAgIHByaXZhdGUgaG9zdG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHByb3RvY29sOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSB3c1Byb3RvY29sOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF92ZXJzaW9uOiBzdHJpbmc9ICd2MSc7ICAgICAgLy8gKiogZGVmYXVsdCBTaWduYWwgSyBhcGkgdmVyc2lvblxuICAgIHByaXZhdGUgX2ZpbHRlcj0gbnVsbDsgICAgICAgICAgICAgICAvLyAqKiBpZCBvZiB2ZXNzZWwgdG8gZmlsdGVyIGRlbHRhIG1lc3NhZ2VzXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXRcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHByaXZhdGUgc2VydmVyPSB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgIGluZm86IHt9LFxuICAgICAgICBhcGlWZXJzaW9uczogW10sXG4gICAgICAgIHdzOiB7IHNlbGY6IG51bGwsIHJvbGVzOiB7fSB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG5cbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyBcbiAgICAgICAgdGhpcy5fY29ubmVjdD0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uQ29ubmVjdD0gdGhpcy5fY29ubmVjdC5hc09ic2VydmFibGUoKTsgICBcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNsb3NlPSB0aGlzLl9jbG9zZS5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBTaWduYWwgSyBBUEkgVkVSU0lPTiAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIGdldCAvIHNldCBTaWduYWwgSyBwcmVmZXJyZWQgYXBpIHZlcnNpb24gdG8gdXNlICoqXG4gICAgZ2V0IHZlcnNpb24oKTpudW1iZXIgeyByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3ZlcnNpb24uc2xpY2UoMSkgKSB9XG5cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogZ2V0IGxpc3Qgb2YgYXBpIHZlcnNpb25zIHN1cHBvcnRlZCBieSBzZXJ2ZXJcbiAgICBnZXQgYXBpVmVyc2lvbnMoKSB7IHJldHVybiB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucyB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIENPTk5FQ1RJT04gICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogaXMgQXV0aCByZXF1aXJlZCBmb3IgdGhpcyBzZXJ2ZXIgKipcbiAgICBnZXQgYXV0aFJlcXVpcmVkKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkIH1cblxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfVxuXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsIGBhcHBsaWNhdGlvbi9qc29uYCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vYXV0aC9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXHRcbiAgICAvLyAqKiBsb2dvdXQgZnJvbSBzZXJ2ZXIgKipcbiAgICBsb2dvdXQoKSB7XG5cdFx0bGV0IHVybD1gJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L2F1dGgvbG9nb3V0YDtcblx0XHRpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9ICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoXG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICB7fVxuICAgICAgICApO1xuICAgIH1cdFxuXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcbiAgICBnZXQgY29ubmVjdGlvblRpbWVvdXQoKTpudW1iZXIgeyByZXR1cm4gdGhpcy5fd3NUaW1lb3V0IH1cblxuICAgIHNldCBjb25uZWN0aW9uVGltZW91dCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcbiAgICB9ICAgIFxuXG4gICAgLy8gKiogaW5pdGlhbGlzZSBjbGllbnQgY29ubmVjdGlvbiBzZXR0aW5nc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgaWYoaXNEZXZNb2RlKCkpIHsgXG4gICAgICAgICAgICBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJzE5Mi4xNjguOTkuMTAwJztcbiAgICAgICAgICAgIHBvcnQ9IHBvcnQgfHwgMzAwMDsgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJ2xvY2FsaG9zdCcgfVxuXG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3c3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA0NDM7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3cyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIC8qdGhpcy5nZXQoJy9sb2dpblN0YXR1cycpLnN1YnNjcmliZSggcj0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZD0oclsnYXV0aGVudGljYXRpb25SZXF1aXJlZCddKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfSkqL1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlclxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgcmVzcG9uc2U9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSAocmVzcG9uc2VbJ2VuZHBvaW50cyddKSA/IHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9ICh0aGlzLnNlcnZlci5lbmRwb2ludHMpID8gT2JqZWN0LmtleXModGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA6IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybDtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyBlbmRwb2ludCB2ZXJzaW9uOiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ119YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gZmFsbGluZyBiYWNrIHRvOiB2MWApO1xuICAgICAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddfWAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dCggbmV3IEVycm9yKCdObyBTaWduYWwgSyBlbmRwb2ludHMgZm91bmQhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfSAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gJHt1cmx9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmluZm89IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSBbXTsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3IubmV4dCggZXJyb3IgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9ICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggbm8gZW5kcG9pbnQgZGlzY292ZXJ5XG4gICAgY29ubmVjdERlbHRhKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ0Nvbm5lY3REZWx0YS4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMud3NQcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vc3RyZWFtYDtcbiAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgIGlmKHN1YnNjcmliZSkgeyB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWAgfSBcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdXJsKz0gYCZ0b2tlbj0ke3RoaXMuX3Rva2VufWAgfVxuICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvIGRlbHRhIHN0cmVhbSBhdCAke3VybH1gKTtcbiAgICAgICAgdGhpcy5jb25uZWN0RGVsdGFCeVVybCh1cmwpO1xuICAgIH0gIFxuXG5cdC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIGF0IHByb3ZpZGVkIHVybFxuXHRwcml2YXRlIGNvbm5lY3REZWx0YUJ5VXJsKHVybCkge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQgJiYgIXRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLndzKSB7IHRoaXMuZGlzY29ubmVjdCgpIH1cbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxuICAgICAgICBzZXRUaW1lb3V0KCBcbiAgICAgICAgICAgICgpPT57XG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIHdhdGNoZG9nIGV4cGlyZWQgKCR7dGhpcy5fd3NUaW1lb3V0LzEwMDB9IHNlYyk6ICR7dGhpcy53cy5yZWFkeVN0YXRlfS4uLiBhYm9ydGluZyBjb25uZWN0aW9uLi4uYCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl93c1RpbWVvdXRcbiAgICAgICAgKTtcblx0XHRcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3Mub3BlbmApOyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3MuY2xvc2VgKTsgdGhpcy5fY2xvc2UubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5lcnJvcmApOyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnJvbGVzPSBkYXRhLnJvbGVzO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLndzLnNlbGY9IGRhdGEuc2VsZjtcbiAgICAgICAgICAgIH0gICAgICAgICAgXG5cdFx0XHRpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9XG5cdFx0fVxuICAgIH0gIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIFNpZ25hbCBLIHN0cmVhbVxuICAgIGRpc2Nvbm5lY3QoKSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHtcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgICAgIHRoaXMud3M9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci53cz0geyBzZWxmOiBudWxsLCByb2xlczoge30gfTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBTVFJFQU0gQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogc2VuZCBkYXRhIHRvIFNpZ25hbCBLIHN0cmVhbVxuICAgIHNlbmQoZGF0YTphbnkpIHtcbiAgICAgICAgaWYodGhpcy53cykge1xuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7IGRhdGE9IEpTT04uc3RyaW5naWZ5KGRhdGEpIH1cbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIHNlbmQgdmFsdWUgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICBsZXQgdmFsPSB7IFxuICAgICAgICAgICAgY29udGV4dDogKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQsXG4gICAgICAgICAgICB1cGRhdGVzOiBbIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IFt7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9XSBcbiAgICAgICAgICAgIH0gXSBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlYnVnKGBzZW5kaW5nIHVwZGF0ZTogJHtKU09OLnN0cmluZ2lmeSh2YWwpfWApO1xuICAgICAgICB0aGlzLnNlbmQodmFsKTtcbiAgICB9XG5cbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonLCAuLi5vcHRpb25zKSB7XG4gICAgICAgIGxldCBkYXRhPSB7XG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHN1YnNjcmliZTogW11cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uPSB7fTtcbiAgICAgICAgc3Vic2NyaXB0aW9uWydwYXRoJ109IHBhdGg7XG4gICAgICAgIGZvcihsZXQgaSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBzd2l0Y2goaSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJzAnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydwZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcxJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0nZGVsdGEnIHx8IG9wdGlvbnNbaV09PSdmdWxsJykgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsnZm9ybWF0J109IG9wdGlvbnNbaV0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMic6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbaV09PSdpZGVhbCcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1tpXT09ICdmaXhlZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsncG9saWN5J109IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgICBcbiAgICAgICAgICAgICAgICBjYXNlICczJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblsncG9saWN5J109PSdpbnN0YW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydtaW5QZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhLnN1YnNjcmliZS5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuc2VuZChkYXRhKTsgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicpIHtcbiAgICAgICAgY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuc2VuZCh7XG4gICAgICAgICAgICBcImNvbnRleHRcIjogY29udGV4dCxcbiAgICAgICAgICAgIFwidW5zdWJzY3JpYmVcIjogWyB7XCJwYXRoXCI6IHBhdGh9IF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXG4gICAgaXNEZWx0YShtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcbiAgICBpc0hlbGxvKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgfVxuXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcbiAgICBnZXQgZmlsdGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCFpZCkgeyAgIC8vICoqIGNsZWFyIGZpbHRlclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPW51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXG4gICAgICAgICAgICBpZighdGhpcy5zZXJ2ZXIud3Muc2VsZikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VsZklkKCkuc3Vic2NyaWJlKCBpZD0+IHsgdGhpcy5fZmlsdGVyPSBpZCB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSB0aGlzLnNlcnZlci53cy5zZWxmIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgIC8vICoqIHV1aWRcbiAgICAgICAgICAgIGxldCB1dWlkPSBSZWdFeHAoXCJedXJuOm1ybjpzaWduYWxrOnV1aWQ6WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVs4OUFCYWJdWzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17MTJ9JFwiKVxuICAgICAgICAgICAgaWYoaWQuaW5kZXhPZigndmVzc2Vscy4nKSE9LTEpIHsgaWQ9IGlkLnNsaWNlKGlkLmluZGV4T2YoJy4nKSsxKSB9XG4gICAgICAgICAgICBpZih1dWlkLnRlc3QoaWQpKSB7IHRoaXMuX2ZpbHRlcj0gYHZlc3NlbHMuJHtpZH1gIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIFJhaXNlIGFuIGFsYXJtIG1lc3NhZ2UgKipcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgYWxhcm1QYXRoOnN0cmluZywgYWxhcm06QWxhcm0pIHtcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIGBub3RpZmljYXRpb25zLiR7YWxhcm1QYXRofWAsIGFsYXJtKTtcbiAgICB9XG5cbiAgICAvLyAqKiBDbGVhciBhbGFybSAqKlxuICAgIGNsZWFyQWxhcm0oY29udGV4dDpzdHJpbmc9J3NlbGYnLCBhbGFybVBhdGg6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBgbm90aWZpY2F0aW9ucy4ke2FsYXJtUGF0aH1gLCBudWxsKTtcbiAgICB9IFxuICAgICAgICAgICAgXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIEhUVFAgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIFxuICAgIC8vICoqIFJldHVybnMgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZlxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmFwaUdldChgdmVzc2Vscy9zZWxmYCkgfVxuXG4gICAgLy8gKiogUmV0dXJucyB0aGUgc2VsZiBpZGVudGl0eVxuICAgIGdldFNlbGZJZCgpIHsgcmV0dXJuIHRoaXMuYXBpR2V0KGBzZWxmYCkgfVxuXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxuICAgIGdldE1ldGEoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICByZXR1cm4gdGhpcy5hcGlHZXQoYCR7dGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke3RoaXMuZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xuICAgIH0gICAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBhcGkgcGF0aFxuICAgIGFwaUdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxuICAgICAgICB1cmwrPSB0aGlzLmRvdFRvU2xhc2gocGF0aCk7XG4gICAgICAgIHRoaXMuZGVidWcoYGFwaUdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vKiogU2VuZCB2YWx1ZSB0byBodHRwIGFwaSBwYXRoXG5cdGFwaVB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XG5cdGFwaVB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XG5cdFxuICAgIGFwaVB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleT86YW55LCB2YWx1ZT86YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KSArICcvJyArIHRoaXMuZG90VG9TbGFzaChwYXRoKTtcblxuICAgICAgICBsZXQgbXNnID0geyB2YWx1ZToge30gfSBcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlPT0ndW5kZWZpbmVkJykgeyBtc2cudmFsdWU9IGtleSB9XG5cdFx0ZWxzZSB7IG1zZy52YWx1ZVtrZXldPSB2YWx1ZSB9XG5cbiAgICAgICAgdGhpcy5kZWJ1ZyhgYXBpUHV0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmRlYnVnKEpTT04uc3RyaW5naWZ5KG1zZykpO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZyk7IFxuICAgICAgICB9XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBwYXRoXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHt0aGlzLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgZ2V0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7IFxuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9OyAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwdXQgdG8gaHR0cCBwYXRoXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke3RoaXMuZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwdXQgJHt1cmx9YCk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmF1dGhSZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcignQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpKTsgXG4gICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgdmFsdWUpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke3RoaXMuZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9OyAgICBcblxuICAgIC8vICoqIHJldHVybiB1cmwgZm9yIGNvbm5lY3RlZCBzaWduYWxrLWh0dHAgZW5kcG9pbnRcbiAgICBwcml2YXRlIHJlc29sdmVIdHRwRW5kcG9pbnQoKSB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSkgeyAvLyAqKiBjb25uZWN0aW9uIG1hZGVcbiAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gaHR0cCBlbmRwb2ludCBhdCBwcmVzY3JpYmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddKSB7XG4gICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstaHR0cCddfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstaHR0cCddfWAgfSAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtc2c9ICdObyBjdXJyZW50IGNvbm5lY3Rpb24gaHR0cCBlbmRwb2ludCBzZXJ2aWNlISBVc2UgY29ubmVjdCgpIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uJ1xuICAgICAgICAgICAgdGhpcy5kZWJ1Zyhtc2cpO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IobXNnKSApO1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdXJsOyAgIFxuICAgIH1cblxuICAgIC8vICoqIHBhcnNlIGNvbnRleHQgdG8gdmFsaWQgU2lnbmFsIEsgcGF0aFxuICAgIHByaXZhdGUgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZykge1xuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcbiAgICAgICAgcmV0dXJuIHJlcy5zcGxpdCgnLicpLmpvaW4oJy8nKTtcbiAgICB9XG5cbiAgICAvLyAqKiB0cmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIHNsYXNoXG4gICAgcHJpdmF0ZSBkb3RUb1NsYXNoKHBhdGg6c3RyaW5nKSB7XG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLicpIT0tMSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5qb2luKCcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cbiAgICB9XG5cbiAgICAvLyAqKiB0cmFuc2Zvcm0gc2xhc2ggbm90YXRpb24gdG8gZG90XG4gICAgcHJpdmF0ZSBzbGFzaFRvRG90KHBhdGg6c3RyaW5nKSB7XG4gICAgICAgIGlmKHBhdGguaW5kZXhPZignLycpIT0tMSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKS5qb2luKCcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBwYXRoIH1cbiAgICB9ICAgIFxuXG59XG5cbi8vICoqIEFsYXJtIHN0YXRlICoqXG5leHBvcnQgZW51bSAgQWxhcm1TdGF0ZSB7XG4gICAgbm9ybWFsPSdub3JtYWwnLFxuICAgIGFsZXJ0PSdhbGVydCcsXG4gICAgd2Fybj0nd2FybicsXG4gICAgYWxhcm09J2FsYXJtJyxcbiAgICBlbWVyZ2VuY3k9J2VtZXJnZW5jeSdcbn1cblxuLy8gKiogQWxhcm0gTWV0aG9kICoqXG5leHBvcnQgZW51bSAgQWxhcm1NZXRob2Qge1xuICAgIHZpc3VhbD0ndmlzdWFsJyxcbiAgICBzb3VuZD0nc291bmQnXG59XG5cbi8vICoqIEFsYXJtIGNsYXNzXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xuICAgIHN0YXRlOiBBbGFybVN0YXRlPSBBbGFybVN0YXRlLm5vcm1hbDtcbiAgICBtZXRob2Q6IEFycmF5PEFsYXJtTWV0aG9kPj0gW0FsYXJtTWV0aG9kLnZpc3VhbCwgQWxhcm1NZXRob2Quc291bmRdO1xuICAgIG1lc3NhZ2U6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nPW51bGwpIHsgdGhpcy5tZXNzYWdlPSBtZXNzYWdlIH1cbn1cblxuXG4iXX0=