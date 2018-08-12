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
        this.ws.onopen = e => {
            this.debug(`ws.open`);
            this._connect.next(e);
        };
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
        this.debug(`sending update: ${path}= ${value})`);
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
        return this.apiGet(`${this.contextToPath(context)}/${path.split('.').join('/')}/meta`);
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
        url += path;
        this.debug(`apiGet ${url}`);
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
        url += this.contextToPath(context) + '/' + path;
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
            return this.http.put(url, msg);
        }
    }
    /**
     * @param {?} path
     * @return {?}
     */
    get(path) {
        /** @type {?} */
        let url = `${this.protocol}://${this.hostname}:${this.port}${path}`;
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
export class Alarm {
    constructor() {
        this.upper = null;
        this.lower = null;
        this.state = null;
        this.message = null;
    }
}
if (false) {
    /** @type {?} */
    Alarm.prototype.upper;
    /** @type {?} */
    Alarm.prototype.lower;
    /** @type {?} */
    Alarm.prototype.state;
    /** @type {?} */
    Alarm.prototype.message;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3NpZ25hbGstY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7OztBQUszQyxNQUFNOzs7O0lBZ0NGLFlBQXFCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7d0JBZlgsSUFBSTt1QkFDYixJQUFJOzBCQUNELEtBQUs7c0JBSVQ7WUFDWixTQUFTLEVBQUUsRUFBRTtZQUNiLElBQUksRUFBRSxFQUFFO1lBQ1IsV0FBVyxFQUFFLEVBQUU7WUFDZixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7U0FDaEM7UUFLRyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNmOzs7OztJQVpPLEtBQUssQ0FBQyxHQUFRLElBQUksRUFBRSxDQUFBLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQSxDQUFDO1FBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUFFOzs7O0lBaUI3RCxJQUFJLE9BQU8sS0FBWSxNQUFNLENBQUMsUUFBUSxDQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUEsRUFBRTs7Ozs7SUFFbEUsSUFBSSxPQUFPLENBQUMsR0FBVzs7UUFDbkIsSUFBSSxDQUFDLEdBQVMsR0FBRyxHQUFFLEdBQUcsQ0FBQztRQUN2QixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFFLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsUUFBUSxHQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM1RSxJQUFJLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLGFBQWEsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDbEY7S0FDSjs7Ozs7SUFLRCxJQUFJLFNBQVMsQ0FBQyxHQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRSxHQUFHLENBQUEsRUFBRTs7Ozs7O0lBRzlDLEtBQUssQ0FBQyxRQUFlLEVBQUUsUUFBZTs7UUFDbEMsSUFBSSxPQUFPLEdBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNqQixHQUFHLElBQUksQ0FBQyxRQUFRLE1BQU0sSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxRQUFRLEVBQ3hELEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEVBQzlDLEVBQUUsT0FBTyxFQUFFLENBQ2QsQ0FBQztLQUNMOzs7O0lBR0QsSUFBSSxpQkFBaUIsS0FBWSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQSxFQUFFOzs7OztJQUV6RCxJQUFJLGlCQUFpQixDQUFDLEdBQVc7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRSxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7S0FDbEU7Ozs7Ozs7SUFHTyxJQUFJLENBQUMsV0FBZ0IsSUFBSSxFQUFFLE9BQVksSUFBSSxFQUFFLFNBQWUsS0FBSztRQUNyRSxFQUFFLENBQUEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDYixRQUFRLEdBQUUsUUFBUSxJQUFJLGdCQUFnQixDQUFDO1lBQ3ZDLElBQUksR0FBRSxJQUFJLElBQUksSUFBSSxDQUFDO1NBQ3RCO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFBQyxRQUFRLEdBQUUsUUFBUSxJQUFJLFdBQVcsQ0FBQTtTQUFFO1FBRTFDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxHQUFHLENBQUM7U0FDM0I7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztTQUMxQjs7Ozs7Ozs7SUFJTCxLQUFLLENBQUMsV0FBZ0IsSUFBSSxFQUFFLE9BQVksSUFBSSxFQUFFLFNBQWUsS0FBSztRQUM5RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDL0I7Ozs7Ozs7O0lBR0QsT0FBTyxDQUFDLFdBQWdCLElBQUksRUFBRSxPQUFZLElBQUksRUFBRSxTQUFlLEtBQUssRUFBRSxZQUFpQixJQUFJO1FBQ3ZGLElBQUksQ0FBQyxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUssMkJBQTJCOztRQUNoRSxBQURxQywyQkFBMkI7UUFDaEUsUUFBUSxDQUFBLEVBQUU7WUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNqRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzNGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7WUFHbEMsSUFBSSxHQUFHLENBQUM7WUFDUixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQzVELEdBQUcsR0FBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hFO1lBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO2dCQUM3QyxHQUFHLEdBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFBO2FBQ3REO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSxL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QUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOFpuQixNQUFNOztxQkFDYSxJQUFJO3FCQUNKLElBQUk7cUJBQ0osSUFBSTt1QkFDRixJQUFJOztDQUN4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnQge1xuXG5cdHByaXZhdGUgX2Nvbm5lY3Q7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkNvbm5lY3Q7XHQgXHRcdFxuXHRwcml2YXRlIF9jbG9zZTsgXHRcdFx0XG4gICAgcHVibGljIG9uQ2xvc2U7XHQgXHRcdCAgICBcblx0cHJpdmF0ZSBfZXJyb3I7IFx0XHRcdFxuICAgIHB1YmxpYyBvbkVycm9yO1x0IFx0XHQgICAgXG5cdHByaXZhdGUgX21lc3NhZ2U7IFx0XHRcdFxuICAgIHB1YmxpYyBvbk1lc3NhZ2U7XHQgXHRcdCAgXG4gICAgcHJpdmF0ZSB3czsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICAgIHByaXZhdGUgd3NQcm90b2NvbDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0XG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgICAgICAgICAgICAgLy8gdG9rZW4gZm9yIHdoZW4gc2VjdXJpdHkgaXMgZW5hYmxlZCBvbiB0aGUgc2VydmVyXG5cbiAgICAvLyAqKiBzZXJ2ZXIgaW5mb3JtYXRpb24gYmxvY2sgKipcbiAgICBwcml2YXRlIHNlcnZlcj0ge1xuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdLFxuICAgICAgICB3czogeyBzZWxmOiBudWxsLCByb2xlczoge30gfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU2lnbmFsIEsgQVBJIFZFUlNJT04gKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuXG4gICAgc2V0IHZlcnNpb24odmFsOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHY6c3RyaW5nPSAndicrIHZhbDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMubGVuZ3RoPT0wKSB7IFxuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gdjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCB0bzogJHt2fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdmVyc2lvbj0gKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmluZGV4T2YodikhPS0xKSA/IHYgOiB0aGlzLl92ZXJzaW9uO1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHJlcXVlc3Q6ICR7dn0sIHJlc3VsdDogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OICAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfVxuXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsIGBhcHBsaWNhdGlvbi9qc29uYCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vbG9naW5gLFxuICAgICAgICAgICAgeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICB7IGhlYWRlcnMgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XG5cbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGluaXRpYWxpc2UgY2xpZW50IGNvbm5lY3Rpb24gc2V0dGluZ3NcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIGlmKGlzRGV2TW9kZSgpKSB7IFxuICAgICAgICAgICAgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICcxOTIuMTY4Ljk5LjEwMCc7XG4gICAgICAgICAgICBwb3J0PSBwb3J0IHx8IDMwMDA7ICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgaG9zdG5hbWU9IGhvc3RuYW1lIHx8ICdsb2NhbGhvc3QnIH1cblxuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3NzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLndzUHJvdG9jb2wgPSAnd3MnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlclxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgIHJlc3BvbnNlPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2VbJ3NlcnZlciddKSA/IHJlc3BvbnNlWydzZXJ2ZXInXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKHRoaXMuc2VydmVyLmVuZHBvaW50cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddICYmIHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsPSBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLm5leHQoIG5ldyBFcnJvcignTm8gU2lnbmFsIEsgZW5kcG9pbnRzIGZvdW5kIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gKiogc3Vic2NyaWJlICoqXG4gICAgICAgICAgICAgICAgaWYoc3Vic2NyaWJlICYmIFsnc2VsZicsJ2FsbCcsJ25vbmUnXS5pbmRleE9mKHN1YnNjcmliZSkhPS0xKSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmwrPWA/c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWA7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9ICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyB0byAke3VybH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvci5uZXh0KCBlcnJvciApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCBubyBlbmRwb2ludCBkaXNjb3ZlcnlcbiAgICBjb25uZWN0RGVsdGEoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZygnQ29ubmVjdERlbHRhLi4uLi4uLi4uJyk7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy53c1Byb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9zdHJlYW1gO1xuICAgICAgICAvLyAqKiBzdWJzY3JpYmUgKipcbiAgICAgICAgaWYoc3Vic2NyaWJlICYmIFsnc2VsZicsJ2FsbCcsJ25vbmUnXS5pbmRleE9mKHN1YnNjcmliZSkhPS0xKSB7IFxuICAgICAgICAgICAgdXJsKz1gP3N1YnNjcmliZT0ke3N1YnNjcmliZX1gO1xuICAgICAgICB9IFxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB1cmwrPSBgJnRva2VuPSR7dGhpcy5fdG9rZW59YCB9XG4gICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gZGVsdGEgc3RyZWFtIGF0ICR7dXJsfWApO1xuICAgICAgICB0aGlzLmNvbm5lY3REZWx0YUJ5VXJsKHVybCk7XG4gICAgfSAgXG5cblx0Ly8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gYXQgcHJvdmlkZWQgdXJsXG5cdHByaXZhdGUgY29ubmVjdERlbHRhQnlVcmwodXJsKSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHsgdGhpcy5kaXNjb25uZWN0KCkgfVxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICAvLyAqKiBzdGFydCBjb25uZWN0aW9uIHdhdGNoZG9nICoqXG4gICAgICAgIHNldFRpbWVvdXQoIFxuICAgICAgICAgICAgKCk9PntcbiAgICAgICAgICAgICAgICBpZih0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApIHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gd2F0Y2hkb2cgZXhwaXJlZCAoJHt0aGlzLl93c1RpbWVvdXQvMTAwMH0gc2VjKTogJHt0aGlzLndzLnJlYWR5U3RhdGV9Li4uIGFib3J0aW5nIGNvbm5lY3Rpb24uLi5gKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxuICAgICAgICApO1xuXHRcdFxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyBcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYHdzLm9wZW5gKTtcblx0XHRcdHRoaXMuX2Nvbm5lY3QubmV4dChlKTtcblx0XHR9XG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLmRlYnVnKGB3cy5jbG9zZWApOyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cblx0XHR0aGlzLndzLm9uZXJyb3I9IGU9PiB7IHRoaXMuZGVidWcoYHdzLmVycm9yYCk7IHRoaXMuX2Vycm9yLm5leHQoZSkgfVxuXHRcdHRoaXMud3Mub25tZXNzYWdlPSBlPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBpZih0eXBlb2YgZS5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XG4gICAgICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Mucm9sZXM9IGRhdGEucm9sZXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXIud3Muc2VsZj0gZGF0YS5zZWxmO1xuICAgICAgICAgICAgfSAgICAgICAgICBcblx0XHRcdGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH1cblx0XHR9XG4gICAgfSAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gU2lnbmFsIEsgc3RyZWFtXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xuICAgICAgICB0aGlzLndzPSBudWxsO1xuICAgICAgICB0aGlzLnNlcnZlci53cz0geyBzZWxmOiBudWxsLCByb2xlczoge30gfTtcbiAgICB9XG5cblxuICAgIC8vICoqKioqKioqKioqKioqKiogU1RSRUFNIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cbiAgICBzZW5kKGRhdGE6YW55KSB7XG4gICAgICAgIGlmKHRoaXMud3MpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKiBzZW5kIHZhbHVlIHZpYSBkZWx0YSBzdHJlYW0gdXBkYXRlICoqXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHtcbiAgICAgICAgbGV0IHZhbD0geyBcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxuICAgICAgICAgICAgdXBkYXRlczogWyB7XG4gICAgICAgICAgICAgICAgdmFsdWVzOiBbeyBwYXRoOiBwYXRoLCB2YWx1ZTogdmFsdWUgfV0gXG4gICAgICAgICAgICB9IF0gXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWJ1Zyhgc2VuZGluZyB1cGRhdGU6ICR7cGF0aH09ICR7dmFsdWV9KWApO1xuICAgICAgICB0aGlzLnNlbmQodmFsKTtcbiAgICB9XG5cbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmc9JyonLCAuLi5vcHRpb25zKSB7XG4gICAgICAgIGxldCBkYXRhPSB7XG4gICAgICAgICAgICBjb250ZXh0OiAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dCxcbiAgICAgICAgICAgIHN1YnNjcmliZTogW11cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uPSB7fTtcbiAgICAgICAgc3Vic2NyaXB0aW9uWydwYXRoJ109IHBhdGg7XG4gICAgICAgIGZvcihsZXQgaSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBzd2l0Y2goaSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJzAnOiBcbiAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydwZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcxJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKCBvcHRpb25zW2ldPT0nZGVsdGEnIHx8IG9wdGlvbnNbaV09PSdmdWxsJykgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsnZm9ybWF0J109IG9wdGlvbnNbaV0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnMic6IFxuICAgICAgICAgICAgICAgICAgICBpZiggb3B0aW9uc1tpXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbaV09PSdpZGVhbCcgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1tpXT09ICdmaXhlZCcgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvblsncG9saWN5J109IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgICBcbiAgICAgICAgICAgICAgICBjYXNlICczJzogXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblsncG9saWN5J109PSdpbnN0YW50Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoICFpc05hTihvcHRpb25zW2ldKSApIHsgc3Vic2NyaXB0aW9uWydtaW5QZXJpb2QnXT0gcGFyc2VJbnQob3B0aW9uc1tpXSkgfSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkYXRhLnN1YnNjcmliZS5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuc2VuZChkYXRhKTsgICAgICAgIFxuICAgIH1cblxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZz0nKicpIHtcbiAgICAgICAgY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuc2VuZCh7XG4gICAgICAgICAgICBcImNvbnRleHRcIjogY29udGV4dCxcbiAgICAgICAgICAgIFwidW5zdWJzY3JpYmVcIjogWyB7XCJwYXRoXCI6IHBhdGh9IF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIHJlY2lldmVkIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXG4gICAgaXNEZWx0YShtc2cpIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgcmVjaWV2ZWQgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcbiAgICBpc0hlbGxvKG1zZykgeyByZXR1cm4gdHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgfVxuXG5cbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcbiAgICBnZXQgZmlsdGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCFpZCkgeyAgIC8vICoqIGNsZWFyIGZpbHRlclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPW51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXG4gICAgICAgICAgICBpZighdGhpcy5zZXJ2ZXIud3Muc2VsZikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VsZklkKCkuc3Vic2NyaWJlKCBpZD0+IHsgdGhpcy5fZmlsdGVyPSBpZCB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSB0aGlzLnNlcnZlci53cy5zZWxmIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgIC8vICoqIHV1aWRcbiAgICAgICAgICAgIGxldCB1dWlkPSBSZWdFeHAoXCJedXJuOm1ybjpzaWduYWxrOnV1aWQ6WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVs4OUFCYWJdWzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17MTJ9JFwiKVxuICAgICAgICAgICAgaWYoaWQuaW5kZXhPZigndmVzc2Vscy4nKSE9LTEpIHsgaWQ9IGlkLnNsaWNlKGlkLmluZGV4T2YoJy4nKSsxKSB9XG4gICAgICAgICAgICBpZih1dWlkLnRlc3QoaWQpKSB7IHRoaXMuX2ZpbHRlcj0gYHZlc3NlbHMuJHtpZH1gIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vICoqIENsZWFyIG5vdGlmaWNhdGlvbiAvIGFsYXJtICoqXG4gICAgLypjbGVhckFsYXJtKGNvbnRleHQ6c3RyaW5nPSdzZWxmJywgYWxhcm1QYXRoOnN0cmluZykge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgYG5vdGlmaWNhdGlvbnMuJHthbGFybVBhdGh9YCwgbnVsbCk7XG4gICAgfSBcbiAgICBcbiAgICAvLyAqKiBTZXQgbm90aWZpY2F0aW9uIC8gYWxhcm0gKipcbiAgICBzZXRBbGFybShjb250ZXh0OnN0cmluZz0nc2VsZicsIGFsYXJtUGF0aDpzdHJpbmcsIHZhbHVlOkFsYXJtKSB7XG4gICAgbGV0IG1ldGEuem9uZXM9IFtcbiAgICAgICAgICAgIHtcInVwcGVyXCI6IDQsIFwic3RhdGVcIjogXCJhbGFybVwiLCBcIm1lc3NhZ2VcIjogXCJTdG9wcGVkIG9yIHZlcnkgc2xvd1wifSxcbiAgICAgICAgICAgIHtcImxvd2VyXCI6IDQsIFwidXBwZXJcIjogNjAsIFwic3RhdGVcIjogXCJub3JtYWxcIn0sXG4gICAgICAgICAgICB7XCJsb3dlclwiOiA2MCwgXCJ1cHBlclwiOiA2NSwgXCJzdGF0ZVwiOiBcIndhcm5cIiwgXCJtZXNzYWdlXCI6IFwiQXBwcm9hY2hpbmcgbWF4aW11bVwifSxcbiAgICAgICAgICAgIHtcImxvd2VyXCI6IDY1LCBcInN0YXRlXCI6IFwiYWxhcm1cIiwgXCJtZXNzYWdlXCI6IFwiRXhjZWVkaW5nIG1heGltdW1cIn1cbiAgICAgICAgICBdXG4gICAgfSovXG4gICAgICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBIVFRQIEFQSSAqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBcbiAgICAvLyAqKiBSZXR1cm5zIHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGZcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5hcGlHZXQoYHZlc3NlbHMvc2VsZmApIH1cblxuICAgIC8vICoqIFJldHVybnMgdGhlIHNlbGYgaWRlbnRpdHlcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmFwaUdldChgc2VsZmApIH1cblxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpR2V0KGAke3RoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHtwYXRoLnNwbGl0KCcuJykuam9pbignLycpfS9tZXRhYCk7XG4gICAgfSAgICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZnJvbSBodHRwIGFwaSBwYXRoXG4gICAgYXBpR2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHBhdGg7XG4gICAgICAgIHRoaXMuZGVidWcoYGFwaUdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxuICAgIH1cblxuICAgIC8vKiogU2VuZCB2YWx1ZSB0byBodHRwIGFwaSBwYXRoXG4gICAgYXBpUHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XG4gICAgICAgIHVybCs9IHRoaXMuY29udGV4dFRvUGF0aChjb250ZXh0KSArICcvJyArIHBhdGg7XG5cbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXG4gICAgICAgIG1zZy52YWx1ZVtrZXldPSB2YWx1ZTtcblxuICAgICAgICB0aGlzLmRlYnVnKGBhcGlQdXQgJHt1cmx9YCk7XG4gICAgICAgIHRoaXMuZGVidWcoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG5cbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZykgfVxuICAgIH0gICAgXG4gICAgXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIHByaXZhdGUgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtwYXRofWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcblxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfSAgICAgICAgXG4gICAgfTsgIFxuXG4gICAgLy8gKiogcmV0dXJuIHVybCBmb3IgY29ubmVjdGVkIHNpZ25hbGstaHR0cCBlbmRwb2ludFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpIHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgICAgICB0aGlzLl9lcnJvci5uZXh0KG5ldyBFcnJvcihtc2cpICk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfVxuXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXG4gICAgcHJpdmF0ZSBjb250ZXh0VG9QYXRoKGNvbnRleHQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCByZXM9IChjb250ZXh0PT0nc2VsZicgKSA/ICd2ZXNzZWxzLnNlbGYnOiBjb250ZXh0O1xuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xuICAgIH1cblxufVxuXG5cbi8vICoqIFNpZ25hbCBLIEFsYXJtIGNsYXNzXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xuICAgIHVwcGVyOiBudW1iZXI9IG51bGw7ICAgIC8vICoqIHVwcGVyIGxpbWl0IHZhbHVlXG4gICAgbG93ZXI6IG51bWJlcj0gbnVsbDsgICAgLy8gKiogbG93ZXIgbGltaXQgdmFsdWVcbiAgICBzdGF0ZTogc3RyaW5nPSBudWxsOyAgICAgIC8vICoqIFsnd2FybicsICdhbGFybSddXG4gICAgbWVzc2FnZTogc3RyaW5nPSBudWxsOyAgLy8gKiogbWVzc2FnZSB0ZXh0XG59XG5cblxuIl19