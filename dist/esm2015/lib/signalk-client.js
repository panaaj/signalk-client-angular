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
        return this.http.post(`${this.protocol}://${this.hostname}:${this.port}/login`, { "username": username, "password": password }, { headers });
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
        this.get('/loginStatus').subscribe(r => {
            this.server.authRequired = (r['authenticationRequired']) ? true : false;
        });
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
        this.hello(hostname, port).subscribe(// ** discover endpoints **
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
            if (subscribe && ['self', 'all', 'none'].indexOf(subscribe) != -1) {
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
        if (subscribe && ['self', 'all', 'none'].indexOf(subscribe) != -1) {
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
        this.ws.close();
        this.ws = null;
        this.server.ws = { self: null, roles: {} };
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
     * @param {?} key
     * @param {?} value
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
        msg.value[key] = value;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7OztBQUszQyxNQUFNOzs7O0lBaUNGLFlBQXFCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7d0JBaEJYLElBQUk7dUJBQ2IsSUFBSTswQkFDRCxLQUFLO3NCQUlUO1lBQ1osWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLEVBQUU7WUFDYixJQUFJLEVBQUUsRUFBRTtZQUNSLFdBQVcsRUFBRSxFQUFFO1lBQ2YsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1NBQ2hDO1FBS0csSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxD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cEM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7U0FBRTs7OztZQTNiM0IsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7O1lBTFEsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcWNmLFFBQU8sUUFBUTtJQUNmLE9BQU0sT0FBTztJQUNiLE1BQUssTUFBTTtJQUNYLE9BQU0sT0FBTztJQUNiLFdBQVUsV0FBVzs7Ozs7SUFLckIsUUFBTyxRQUFRO0lBQ2YsT0FBTSxPQUFPOzs7QUFJakIsTUFBTTs7OztJQUtGLFlBQVksVUFBZSxJQUFJO3FCQUpaLFVBQVUsQ0FBQyxNQUFNO3NCQUNSLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDO1FBR2hDLElBQUksQ0FBQyxPQUFPLEdBQUUsT0FBTyxDQUFBO0tBQUU7Q0FDN0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTaWduYWxLQ2xpZW50IHtcblxuXHRwcml2YXRlIF9jb25uZWN0OyBcdFx0XHRcbiAgICBwdWJsaWMgb25Db25uZWN0O1x0IFx0XHRcblx0cHJpdmF0ZSBfY2xvc2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNsb3NlO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX2Vycm9yOyBcdFx0XHRcbiAgICBwdWJsaWMgb25FcnJvcjtcdCBcdFx0ICAgIFxuXHRwcml2YXRlIF9tZXNzYWdlOyBcdFx0XHRcbiAgICBwdWJsaWMgb25NZXNzYWdlO1x0IFx0XHQgIFxuICAgIHByaXZhdGUgd3M7ICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgICBwcml2YXRlIHdzUHJvdG9jb2w6IHN0cmluZztcblxuICAgIHByaXZhdGUgX3ZlcnNpb246IHN0cmluZz0gJ3YxJzsgICAgICAvLyAqKiBkZWZhdWx0IFNpZ25hbCBLIGFwaSB2ZXJzaW9uXG4gICAgcHJpdmF0ZSBfZmlsdGVyPSBudWxsOyAgICAgICAgICAgICAgIC8vICoqIGlkIG9mIHZlc3NlbCB0byBmaWx0ZXIgZGVsdGEgbWVzc2FnZXNcbiAgICBwcml2YXRlIF93c1RpbWVvdXQ9IDIwMDAwOyAgICAgICAgICAgLy8gKiogd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dFxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHRva2VuIGZvciB3aGVuIHNlY3VyaXR5IGlzIGVuYWJsZWQgb24gdGhlIHNlcnZlclxuXG4gICAgLy8gKiogc2VydmVyIGluZm9ybWF0aW9uIGJsb2NrICoqXG4gICAgcHJpdmF0ZSBzZXJ2ZXI9IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXSxcbiAgICAgICAgd3M6IHsgc2VsZjogbnVsbCwgcm9sZXM6IHt9IH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlYnVnKHZhbDogYW55KSB7IGlmKGlzRGV2TW9kZSgpKXsgY29uc29sZS5sb2codmFsKSB9IH1cblxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7IFxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25Db25uZWN0PSB0aGlzLl9jb25uZWN0LmFzT2JzZXJ2YWJsZSgpOyAgIFxuICAgICAgICB0aGlzLl9jbG9zZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICBcbiAgICAgICAgdGhpcy5pbml0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIFNpZ25hbCBLIEFQSSBWRVJTSU9OICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cblxuICAgIHNldCB2ZXJzaW9uKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGxldCB2OnN0cmluZz0gJ3YnKyB2YWw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmxlbmd0aD09MCkgeyBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249IHY7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgdG86ICR7dn1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249ICh0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5pbmRleE9mKHYpIT0tMSkgPyB2IDogdGhpcy5fdmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCByZXF1ZXN0OiAke3Z9LCByZXN1bHQ6ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAqKiBnZXQgbGlzdCBvZiBhcGkgdmVyc2lvbnMgc3VwcG9ydGVkIGJ5IHNlcnZlclxuICAgIGdldCBhcGlWZXJzaW9ucygpIHsgcmV0dXJuIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKiogQ09OTkVDVElPTiAgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBpcyBBdXRoIHJlcXVpcmVkIGZvciB0aGlzIHNlcnZlciAqKlxuICAgIGdldCBhdXRoUmVxdWlyZWQoKSB7IHJldHVybiB0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQgfVxuXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9XG5cbiAgICAvLyAqKiBnZXQgYXV0aCB0b2tlbiBmb3Igc3VwcGxpZWQgdXNlciBkZXRhaWxzICoqXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcbiAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgYGFwcGxpY2F0aW9uL2pzb25gKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9sb2dpbmAsXG4gICAgICAgICAgICB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHsgaGVhZGVycyB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcbiAgICBnZXQgY29ubmVjdGlvblRpbWVvdXQoKTpudW1iZXIgeyByZXR1cm4gdGhpcy5fd3NUaW1lb3V0IH1cblxuICAgIHNldCBjb25uZWN0aW9uVGltZW91dCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcbiAgICB9ICAgIFxuXG4gICAgLy8gKiogaW5pdGlhbGlzZSBjbGllbnQgY29ubmVjdGlvbiBzZXR0aW5nc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgaWYoaXNEZXZNb2RlKCkpIHsgXG4gICAgICAgICAgICBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJzE5Mi4xNjguOTkuMTAwJztcbiAgICAgICAgICAgIHBvcnQ9IHBvcnQgfHwgMzAwMDsgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyBob3N0bmFtZT0gaG9zdG5hbWUgfHwgJ2xvY2FsaG9zdCcgfVxuXG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3c3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA0NDM7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwJztcbiAgICAgICAgICAgIHRoaXMud3NQcm90b2NvbCA9ICd3cyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHRoaXMuZ2V0KCcvbG9naW5TdGF0dXMnKS5zdWJzY3JpYmUoIHI9PiB7XG4gICAgICAgICAgICB0aGlzLnNlcnZlci5hdXRoUmVxdWlyZWQ9KHJbJ2F1dGhlbnRpY2F0aW9uUmVxdWlyZWQnXSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyXG4gICAgY29ubmVjdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICB0aGlzLmhlbGxvKGhvc3RuYW1lLCBwb3J0KS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgcmVzcG9uc2U9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSAocmVzcG9uc2VbJ2VuZHBvaW50cyddKSA/IHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9ICh0aGlzLnNlcnZlci5lbmRwb2ludHMpID8gT2JqZWN0LmtleXModGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA6IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybDtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyBlbmRwb2ludCB2ZXJzaW9uOiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ119YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gZmFsbGluZyBiYWNrIHRvOiB2MWApO1xuICAgICAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddfWAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dCggbmV3IEVycm9yKCdObyBTaWduYWwgSyBlbmRwb2ludHMgZm91bmQhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgICAgICAgICBpZihzdWJzY3JpYmUgJiYgWydzZWxmJywnYWxsJywnbm9uZSddLmluZGV4T2Yoc3Vic2NyaWJlKSE9LTEpIHsgXG4gICAgICAgICAgICAgICAgICAgIHVybCs9YD9zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YDtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHVybCs9IGAmdG9rZW49JHt0aGlzLl90b2tlbn1gIH0gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW5nIHRvICR7dXJsfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gW107ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yLm5leHQoIGVycm9yICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSB3aXRoIG5vIGVuZHBvaW50IGRpc2NvdmVyeVxuICAgIGNvbm5lY3REZWx0YShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICB0aGlzLmRlYnVnKCdDb25uZWN0RGVsdGEuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLndzUHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L3N0cmVhbWA7XG4gICAgICAgIC8vICoqIHN1YnNjcmliZSAqKlxuICAgICAgICBpZihzdWJzY3JpYmUgJiYgWydzZWxmJywnYWxsJywnbm9uZSddLmluZGV4T2Yoc3Vic2NyaWJlKSE9LTEpIHsgXG4gICAgICAgICAgICB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWA7XG4gICAgICAgIH0gXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHVybCs9IGAmdG9rZW49JHt0aGlzLl90b2tlbn1gIH1cbiAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byBkZWx0YSBzdHJlYW0gYXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuY29ubmVjdERlbHRhQnlVcmwodXJsKTtcbiAgICB9ICBcblxuXHQvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSBhdCBwcm92aWRlZCB1cmxcblx0cHJpdmF0ZSBjb25uZWN0RGVsdGFCeVVybCh1cmwpIHtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkICYmICF0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3IubmV4dChuZXcgRXJyb3IoJ0F1dGggUmVxdWlyZWQgYW5kIE5PIHRva2VuIGF2YWlsYWJsZSEnKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy53cykgeyB0aGlzLmRpc2Nvbm5lY3QoKSB9XG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgICAgIC8vICoqIHN0YXJ0IGNvbm5lY3Rpb24gd2F0Y2hkb2cgKipcbiAgICAgICAgc2V0VGltZW91dCggXG4gICAgICAgICAgICAoKT0+e1xuICAgICAgICAgICAgICAgIGlmKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgeyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTsgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcy5fd3NUaW1lb3V0XG4gICAgICAgICk7XG5cdFx0XG5cdFx0dGhpcy53cy5vbm9wZW49IGU9PiB7IHRoaXMuZGVidWcoYHdzLm9wZW5gKTsgdGhpcy5fY29ubmVjdC5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9uY2xvc2U9IGU9PiB7IHRoaXMuZGVidWcoYHdzLmNsb3NlYCk7IHRoaXMuX2Nsb3NlLm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5kZWJ1Zyhgd3MuZXJyb3JgKTsgdGhpcy5fZXJyb3IubmV4dChlKSB9XG5cdFx0dGhpcy53cy5vbm1lc3NhZ2U9IGU9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHsgZGF0YT0gSlNPTi5wYXJzZShlLmRhdGEpIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7IHJldHVybiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLmlzSGVsbG8oZGF0YSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci53cy5yb2xlcz0gZGF0YS5yb2xlcztcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci53cy5zZWxmPSBkYXRhLnNlbGY7XG4gICAgICAgICAgICB9ICAgICAgICAgIFxuXHRcdFx0aWYodGhpcy5fZmlsdGVyICYmIHRoaXMuaXNEZWx0YShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGlmKGRhdGEuY29udGV4dD09IHRoaXMuX2ZpbHRlcikgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfVxuXHRcdH1cbiAgICB9ICBcblxuICAgIC8vICoqIGRpc2Nvbm5lY3QgZnJvbSBTaWduYWwgSyBzdHJlYW1cbiAgICBkaXNjb25uZWN0KCkge1xuICAgICAgICB0aGlzLndzLmNsb3NlKCk7XG4gICAgICAgIHRoaXMud3M9IG51bGw7XG4gICAgICAgIHRoaXMuc2VydmVyLndzPSB7IHNlbGY6IG51bGwsIHJvbGVzOiB7fSB9O1xuICAgIH1cblxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBTVFJFQU0gQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogc2VuZCBkYXRhIHRvIFNpZ25hbCBLIHN0cmVhbVxuICAgIHNlbmQoZGF0YTphbnkpIHtcbiAgICAgICAgaWYodGhpcy53cykge1xuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7IGRhdGE9IEpTT04uc3RyaW5naWZ5KGRhdGEpIH1cbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIHNlbmQgdmFsdWUgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSkge1xuICAgICAgICBsZXQgdmFsPSB7IFxuICAgICAgICAgICAgY29udGV4dDogKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQsXG4gICAgICAgICAgICB1cGRhdGVzOiBbIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IFt7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9XSBcbiAgICAgICAgICAgIH0gXSBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlYnVnKGBzZW5kaW5nIHVwZGF0ZTogJHtKU09OLnN0cmluZ2lmeSh2YWwpfWApO1xuICAgICAgICB0aGlzLnNlbmQodmFsKTtcbiAgICB9XG5cbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonLCAuLi5vcHRpb25zKSB7XG4gICAgICAgIGxldCBkYXRhPSB7XG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHN1YnNjcmliZTogW11cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uPSB7fTtcbiAgICAgICAgc3Vic2NyaXB0aW9uWydwYXRoJ109IHBhdGg7XG4gICAgICAgIGZvcihsZXQgaSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBzd2l0Y2goaSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJzAnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydwZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcxJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0nZGVsdGEnIHx8IG9wdGlvbnNbaV09PSdmdWxsJykgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsnZm9ybWF0J109IG9wdGlvbnNbaV0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMic6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbaV09PSdpZGVhbCcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1tpXT09ICdmaXhlZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsncG9saWN5J109IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgICBcbiAgICAgICAgICAgICAgICBjYXNlICczJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblsncG9saWN5J109PSdpbnN0YW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydtaW5QZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhLnN1YnNjcmliZS5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuc2VuZChkYXRhKTsgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicpIHtcbiAgICAgICAgY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuc2VuZCh7XG4gICAgICAgICAgICBcImNvbnRleHRcIjogY29udGV4dCxcbiAgICAgICAgICAgIFwidW5zdWJzY3JpYmVcIjogWyB7XCJwYXRoXCI6IHBhdGh9IF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXG4gICAgaXNEZWx0YShtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcbiAgICBpc0hlbGxvKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgfVxuXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcbiAgICBnZXQgZmlsdGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCFpZCkgeyAgIC8vICoqIGNsZWFyIGZpbHRlclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPW51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXG4gICAgICAgICAgICBpZighdGhpcy5zZXJ2ZXIud3Muc2VsZikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VsZklkKCkuc3Vic2NyaWJlKCBpZD0+IHsgdGhpcy5fZmlsdGVyPSBpZCB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSB0aGlzLnNlcnZlci53cy5zZWxmIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgIC8vICoqIHV1aWRcbiAgICAgICAgICAgIGxldCB1dWlkPSBSZWdFeHAoXCJedXJuOm1ybjpzaWduYWxrOnV1aWQ6WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVs4OUFCYWJdWzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17MTJ9JFwiKVxuICAgICAgICAgICAgaWYoaWQuaW5kZXhPZigndmVzc2Vscy4nKSE9LTEpIHsgaWQ9IGlkLnNsaWNlKGlkLmluZGV4T2YoJy4nKSsxKSB9XG4gICAgICAgICAgICBpZih1dWlkLnRlc3QoaWQpKSB7IHRoaXMuX2ZpbHRlcj0gYHZlc3NlbHMuJHtpZH1gIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIFJhaXNlIGFuIGFsYXJtIG1lc3NhZ2UgKipcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgYWxhcm1QYXRoOnN0cmluZywgYWxhcm06QWxhcm0pIHtcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIGBub3RpZmljYXRpb25zLiR7YWxhcm1QYXRofWAsIGFsYXJtKTtcbiAgICB9XG5cbiAgICAvLyAqKiBDbGVhciBhbGFybSAqKlxuICAgIGNsZWFyQWxhcm0oY29udGV4dDpzdHJpbmc9J3NlbGYnLCBhbGFybVBhdGg6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBgbm90aWZpY2F0aW9ucy4ke2FsYXJtUGF0aH1gLCBudWxsKTtcbiAgICB9IFxuICAgICAgICAgICAgXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIEhUVFAgQVBJICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIFxuICAgIC8vICoqIFJldHVybnMgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZlxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmFwaUdldChgdmVzc2Vscy9zZWxmYCkgfVxuXG4gICAgLy8gKiogUmV0dXJucyB0aGUgc2VsZiBpZGVudGl0eVxuICAgIGdldFNlbGZJZCgpIHsgcmV0dXJuIHRoaXMuYXBpR2V0KGBzZWxmYCkgfVxuXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxuICAgIGdldE1ldGEoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICByZXR1cm4gdGhpcy5hcGlHZXQoYCR7dGhpcy5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke3RoaXMuZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xuICAgIH0gICAgXG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBhcGkgcGF0aFxuICAgIGFwaUdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxuICAgICAgICB1cmwrPSB0aGlzLmRvdFRvU2xhc2gocGF0aCk7XG4gICAgICAgIHRoaXMuZGVidWcoYGFwaUdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vKiogU2VuZCB2YWx1ZSB0byBodHRwIGFwaSBwYXRoXG4gICAgYXBpUHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KSArICcvJyArIHRoaXMuZG90VG9TbGFzaChwYXRoKTtcblxuICAgICAgICBsZXQgbXNnID0geyB2YWx1ZToge30gfSBcbiAgICAgICAgbXNnLnZhbHVlW2tleV09IHZhbHVlO1xuXG4gICAgICAgIHRoaXMuZGVidWcoYGFwaVB1dCAke3VybH1gKTtcbiAgICAgICAgdGhpcy5kZWJ1ZyhKU09OLnN0cmluZ2lmeShtc2cpKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2cpOyBcbiAgICAgICAgfVxuICAgIH0gICAgXG4gICAgXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7dGhpcy5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IFxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQXV0aCBSZXF1aXJlZCBhbmQgTk8gdG9rZW4gYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQobmV3IEVycm9yKCdBdXRoIFJlcXVpcmVkIGFuZCBOTyB0b2tlbiBhdmFpbGFibGUhJykpOyBcbiAgICAgICAgICAgIH0gICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfTsgIFxuXG4gICAgLy8gKiogcmV0dXJuIHVybCBmb3IgY29ubmVjdGVkIHNpZ25hbGstaHR0cCBlbmRwb2ludFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpIHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcihtc2cpICk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfVxuXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXG4gICAgcHJpdmF0ZSBjb250ZXh0VG9QYXRoKGNvbnRleHQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCByZXM9IChjb250ZXh0PT0nc2VsZicgKSA/ICd2ZXNzZWxzLnNlbGYnOiBjb250ZXh0O1xuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgIH1cblxuICAgIC8vICoqIHRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gc2xhc2hcbiAgICBwcml2YXRlIGRvdFRvU2xhc2gocGF0aDpzdHJpbmcpIHtcbiAgICAgICAgaWYocGF0aC5pbmRleE9mKCcuJykhPS0xKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpLmpvaW4oJy8nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHBhdGggfVxuICAgIH1cblxuICAgIC8vICoqIHRyYW5zZm9ybSBzbGFzaCBub3RhdGlvbiB0byBkb3RcbiAgICBwcml2YXRlIHNsYXNoVG9Eb3QocGF0aDpzdHJpbmcpIHtcbiAgICAgICAgaWYocGF0aC5pbmRleE9mKCcvJykhPS0xKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpLmpvaW4oJy4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHBhdGggfVxuICAgIH0gICAgXG5cbn1cblxuLy8gKiogQWxhcm0gc3RhdGUgKipcbmV4cG9ydCBlbnVtICBBbGFybVN0YXRlIHtcbiAgICBub3JtYWw9J25vcm1hbCcsXG4gICAgYWxlcnQ9J2FsZXJ0JyxcbiAgICB3YXJuPSd3YXJuJyxcbiAgICBhbGFybT0nYWxhcm0nLFxuICAgIGVtZXJnZW5jeT0nZW1lcmdlbmN5J1xufVxuXG4vLyAqKiBBbGFybSBNZXRob2QgKipcbmV4cG9ydCBlbnVtICBBbGFybU1ldGhvZCB7XG4gICAgdmlzdWFsPSd2aXN1YWwnLFxuICAgIHNvdW5kPSdzb3VuZCdcbn1cblxuLy8gKiogQWxhcm0gY2xhc3NcbmV4cG9ydCBjbGFzcyBBbGFybSB7XG4gICAgc3RhdGU6IEFsYXJtU3RhdGU9IEFsYXJtU3RhdGUubm9ybWFsO1xuICAgIG1ldGhvZDogQXJyYXk8QWxhcm1NZXRob2Q+PSBbQWxhcm1NZXRob2QudmlzdWFsLCBBbGFybU1ldGhvZC5zb3VuZF07XG4gICAgbWVzc2FnZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmc9bnVsbCkgeyB0aGlzLm1lc3NhZ2U9IG1lc3NhZ2UgfVxufVxuXG5cbiJdfQ==