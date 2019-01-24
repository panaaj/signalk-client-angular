import { Injectable, NgModule, isDevMode, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// ** Path utilities
class Path {
    // ** transform dot notation to slash
    /**
     * @param {?} path
     * @return {?}
     */
    static dotToSlash(path) {
        if (path.indexOf('.') != -1) {
            return path.split('.').join('/');
        }
        else {
            return path;
        }
    }
    // ** parse context to valid Signal K path
    /**
     * @param {?} context
     * @return {?}
     */
    static contextToPath(context) {
        /** @type {?} */
        let res = (context == 'self') ? 'vessels.self' : context;
        return res.split('.').join('/');
    }
}
// ** Message templates **
class Message {
    // ** return UPDATES message object
    /**
     * @return {?}
     */
    static updates() {
        // array values= { values: [ {path: xx, value: xx } ] }
        return {
            context: null,
            updates: []
        };
    }
    // ** return SUBSCRIBE message object
    /**
     * @return {?}
     */
    static subscribe() {
        /* array values= {
            "path": "path.to.key",
            "period": 1000,
            "format": "delta",
            "policy": "ideal",
            "minPeriod": 200
            } */
        return {
            context: null,
            subscribe: []
        };
    }
    // ** return UNSUBSCRIBE message object
    /**
     * @return {?}
     */
    static unsubscribe() {
        // array values= { "path": "path.to.key" }
        return {
            context: null,
            unsubscribe: []
        };
    }
    // ** return REQUEST message object
    /**
     * @return {?}
     */
    static request() {
        return {
            requestId: null
        };
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SignalKHttp {
    // *******************************************************
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    // ** set auth token value **
    /**
     * @param {?} val
     * @return {?}
     */
    set token(val) { this._token = val; }
    // ** get the contents of the Signal K tree pointed to by self. returns: Observable 
    /**
     * @return {?}
     */
    getSelf() { return this.get(`vessels/self`); }
    //** get ID of vessel self via http. returns: Observable 
    /**
     * @return {?}
     */
    getSelfId() { return this.get(`self`); }
    // ** return observable response for meta object at the specified context and path
    /**
     * @param {?} context
     * @param {?} path
     * @return {?}
     */
    getMeta(context, path) {
        return this.get(`${Path.contextToPath(context)}/${Path.dotToSlash(path)}/meta`);
    }
    //** get API path value via http. returns: Observable 
    /**
     * @param {?} path
     * @return {?}
     */
    get(path) {
        if (!this.endpoint) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        let url = this.endpoint + Path.dotToSlash(path);
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
     * @param {?=} key
     * @param {?=} value
     * @return {?}
     */
    put(context, path, key, value) {
        if (!this.endpoint) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        let url = this.endpoint + Path.contextToPath(context) + '/' + Path.dotToSlash(path);
        /** @type {?} */
        let msg = { value: {} };
        if (typeof value == 'undefined') {
            msg.value = key;
        }
        else {
            msg.value[key] = value;
        }
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.put(url, msg, { headers: headers });
        }
        else {
            return this.http.put(url, msg);
        }
    }
}
SignalKHttp.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
SignalKHttp.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ SignalKHttp.ngInjectableDef = defineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(inject(HttpClient)); }, token: SignalKHttp, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SignalKStream {
    // ******************************************************
    constructor() {
        this._filter = null; // ** id of vessel to filter delta messages
        // ** id of vessel to filter delta messages
        this._wsTimeout = 20000; // ** websocket connection timeout  
        this._playbackMode = false;
        this._connect = new Subject();
        this.onConnect = this._connect.asObservable();
        this._close = new Subject();
        this.onClose = this._close.asObservable();
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
        this.onMessage = this._message.asObservable();
    }
    // ** set auth token value **
    /**
     * @param {?} val
     * @return {?}
     */
    set token(val) { this._token = val; }
    // ** get / set websocket connection timeout 3000<=timeout<=60000 **
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
    // ** is WS Stream connected?
    /**
     * @return {?}
     */
    get isOpen() {
        return (this.ws && (this.ws.readyState != 1 && this.ws.readyState != 3)) ? true : false;
    }
    // ** get / set filter to select delta messages just for supplied vessel id   
    /**
     * @return {?}
     */
    get filter() { return this._filter; }
    // ** set filter= null to remove message filtering
    /**
     * @param {?} id
     * @return {?}
     */
    set filter(id) {
        if (id && id.indexOf('self') != -1) { // ** self
            this._filter = (this.selfId) ? this.selfId : null;
        }
        else {
            this._filter = id;
        }
    }
    // ** returns true if Playback Hello message
    /**
     * @return {?}
     */
    get playbackMode() { return this._playbackMode; }
    // ** Close WebSocket connection
    /**
     * @return {?}
     */
    close() { if (this.ws) {
        this.ws.close();
        this.ws = null;
    } }
    // ** Open a WebSocket at provided url
    /**
     * @param {?} url
     * @param {?=} subscribe
     * @param {?=} token
     * @return {?}
     */
    open(url, subscribe, token) {
        url = (url) ? url : this.endpoint;
        if (!url) {
            return;
        }
        /** @type {?} */
        let q = (url.indexOf('?') == -1) ? '?' : '&';
        if (subscribe) {
            url += `${q}subscribe=${subscribe}`;
        }
        if (this._token || token) {
            url += `${(subscribe) ? '&' : '?'}token=${this._token || token}`;
        }
        this.close();
        this.ws = new WebSocket(url);
        // ** start connection watchdog **
        setTimeout(() => {
            if (this.ws && (this.ws.readyState != 1 && this.ws.readyState != 3)) {
                console.warn(`Connection watchdog expired (${this._wsTimeout / 1000} sec): ${this.ws.readyState}... aborting connection...`);
                this.close();
            }
        }, this._wsTimeout);
        this.ws.onopen = e => { this._connect.next(e); };
        this.ws.onclose = e => { this._close.next(e); };
        this.ws.onerror = e => { this._error.next(e); };
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
                this.selfId = data.self;
                this._playbackMode = (typeof data.startTime != 'undefined') ? true : false;
                this._message.next(data);
            }
            else if (this._filter && this.isDelta(data)) {
                if (data.context == this._filter) {
                    this._message.next(data);
                }
            }
            else {
                this._message.next(data);
            }
        };
    }
    // ** send data to Signal K stream
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
        let val = Message.updates();
        val.context = (context == 'self') ? 'vessels.self' : context;
        if (this._token) {
            val['token'] = this._token;
        }
        /** @type {?} */
        let uValues = [];
        if (typeof path === 'string') {
            uValues.push({ path: path, value: value });
        }
        if (typeof path === 'object' && Array.isArray(path)) {
            uValues = path;
        }
        val.updates.push({ values: uValues });
        this.send(val);
    }
    /**
     * @param {?=} context
     * @param {?=} path
     * @param {?=} options
     * @return {?}
     */
    subscribe(context = '*', path = '*', options) {
        /** @type {?} */
        let val = Message.subscribe();
        val.context = (context == 'self') ? 'vessels.self' : context;
        if (this._token) {
            val['token'] = this._token;
        }
        if (typeof path === 'object' && Array.isArray(path)) {
            val.subscribe = path;
        }
        if (typeof path === 'string') {
            /** @type {?} */
            let sValue = {};
            sValue['path'] = path;
            if (options && typeof options === 'object') {
                if (options['period']) {
                    sValue['period'] = options['period'];
                }
                if (options['minPeriod']) {
                    sValue['minPeriod'] = options['period'];
                }
                if (options['format'] &&
                    (options['format'] == 'delta' || options['format'] == 'full')) {
                    sValue['format'] = options['format'];
                }
                if (options['policy'] &&
                    (options['policy'] == 'instant' || options['policy'] == 'ideal'
                        || options['policy'] == 'fixed')) {
                    sValue['policy'] = options['policy'];
                }
            }
            val.subscribe.push(sValue);
        }
        this.send(val);
    }
    // ** Unsubscribe from Delta stream messages **
    /**
     * @param {?=} context
     * @param {?=} path
     * @return {?}
     */
    unsubscribe(context = '*', path = '*') {
        /** @type {?} */
        let val = Message.unsubscribe();
        val.context = (context == 'self') ? 'vessels.self' : context;
        if (this._token) {
            val['token'] = this._token;
        }
        if (typeof path === 'object' && Array.isArray(path)) {
            val.unsubscribe = path;
        }
        if (typeof path === 'string') {
            val.unsubscribe.push({ path: path });
        }
        this.send(val);
    }
    // *************** MESSAGE PARSING ******************************
    // ** returns true if message context is 'self'
    /**
     * @param {?} msg
     * @return {?}
     */
    isSelf(msg) { return (msg.context == this.selfId); }
    // ** returns true if message is a Delta message
    /**
     * @param {?} msg
     * @return {?}
     */
    isDelta(msg) { return typeof msg.context != 'undefined'; }
    // ** returns true if message is a Hello message
    /**
     * @param {?} msg
     * @return {?}
     */
    isHello(msg) {
        return (typeof msg.version != 'undefined' && typeof msg.self != 'undefined');
    }
    // ** returns true if message is a request Response message
    /**
     * @param {?} msg
     * @return {?}
     */
    isResponse(msg) { return typeof msg.requestId != 'undefined'; }
}
SignalKStream.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
SignalKStream.ctorParameters = () => [];
/** @nocollapse */ SignalKStream.ngInjectableDef = defineInjectable({ factory: function SignalKStream_Factory() { return new SignalKStream(); }, token: SignalKStream, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SignalKStreamWorker {
    // *******************************************************    
    constructor() {
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
        this.onMessage = this._message.asObservable();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.worker.terminate(); this.worker = undefined; }
    // ** Initialise worker
    /**
     * @param {?} pathToFile
     * @return {?}
     */
    init(pathToFile) {
        if (typeof (Worker) == "undefined") {
            return false;
        }
        if (this.worker) {
            this.worker.terminate();
        } // ** terminate an open worker
        this.worker = new Worker(pathToFile);
        this.worker.onmessage = event => { this._message.next(event); };
        this.worker.onerror = event => { this._error.next(event); };
        // ** worker ready for postMessage()
    }
    // ** Send message to worker
    /**
     * @param {?} msg
     * @return {?}
     */
    postMessage(msg) { if (this.worker) {
        this.worker.postMessage(msg);
    } }
    // ** terminate worker
    /**
     * @return {?}
     */
    terminate() { if (this.worker) {
        this.worker.terminate();
    } }
}
SignalKStreamWorker.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
SignalKStreamWorker.ctorParameters = () => [];
/** @nocollapse */ SignalKStreamWorker.ngInjectableDef = defineInjectable({ factory: function SignalKStreamWorker_Factory() { return new SignalKStreamWorker(); }, token: SignalKStreamWorker, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SignalKClient {
    // *******************************************************
    /**
     * @param {?} http
     * @param {?} api
     * @param {?} stream
     * @param {?} worker
     */
    constructor(http, api, stream, worker) {
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
        this.api.token = val;
        this.stream.token = val;
    }
    // ** Message Object
    /**
     * @return {?}
     */
    get message() { return Message; }
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
        return new Promise((resolve, reject) => {
            this.debug('Contacting Signal K server.........');
            this.hello(hostname, port, useSSL).subscribe(// ** discover endpoints **
            // ** discover endpoints **
            response => {
                if (this.stream) {
                    this.stream.close();
                }
                this.processHello(response);
                this.api.endpoint = this.resolveHttpEndpoint();
                this.stream.endpoint = this.resolveStreamEndpoint();
                resolve(true);
            }, error => {
                this.disconnectedFromServer();
                reject(error);
            });
        });
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
        return new Promise((resolve, reject) => {
            this.connect(hostname, port, useSSL)
                .then(() => {
                // ** connect to stream api at preferred version else fall back to default version
                /** @type {?} */
                let url = this.resolveStreamEndpoint();
                if (!url) {
                    reject(new Error('Server has no advertised Stream endpoints!'));
                    return;
                }
                this.stream.open(url, subscribe);
                resolve(true);
            })
                .catch(e => { reject(e); });
        });
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
        return new Promise((resolve, reject) => {
            this.connect(hostname, port, useSSL)
                .then(() => {
                // ** connect to playback api at preferred version else fall back to default version
                this.openPlayback(null, options, this._token);
                resolve(true);
            })
                .catch(e => { reject(e); });
        });
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
        this.server.endpoints = (response['endpoints']) ? response['endpoints'] : {};
        this.server.info = (response['server']) ? response['server'] : {};
        this.server.apiVersions = (this.server.endpoints) ? Object.keys(this.server.endpoints) : [];
        this.debug(this.server.endpoints);
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
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
SignalKClient.ctorParameters = () => [
    { type: HttpClient },
    { type: SignalKHttp },
    { type: SignalKStream },
    { type: SignalKStreamWorker }
];
/** @nocollapse */ SignalKClient.ngInjectableDef = defineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(inject(HttpClient), inject(SignalKHttp), inject(SignalKStream), inject(SignalKStreamWorker)); }, token: SignalKClient, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SignalKClientModule {
}
SignalKClientModule.decorators = [
    { type: NgModule, args: [{
                imports: [HttpClientModule],
                declarations: [],
                exports: [],
                entryComponents: [],
                providers: []
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { SignalKClientModule, SignalKClient, SignalKHttp as ɵa, SignalKStream as ɵb, SignalKStreamWorker as ɵc };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXRpbHMudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL2h0dHAtYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0tYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0td29ya2VyLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zaWduYWxrLWNsaWVudC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vICoqIFBhdGggdXRpbGl0aWVzXHJcbmV4cG9ydCBjbGFzcyBQYXRoIHtcclxuXHJcbiAgICAvLyAqKiB0cmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIHNsYXNoXHJcbiAgICBzdGF0aWMgZG90VG9TbGFzaChwYXRoOnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHsgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5qb2luKCcvJykgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXHJcbiAgICBzdGF0aWMgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcclxuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgfSAgICBcclxuXHJcbn1cclxuXHJcbi8vICoqIE1lc3NhZ2UgdGVtcGxhdGVzICoqXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcclxuICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVVBEQVRFUyBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVwZGF0ZXMoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyB2YWx1ZXM6IFsge3BhdGg6IHh4LCB2YWx1ZTogeHggfSBdIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdXBkYXRlczogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gKiogcmV0dXJuIFNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLyogYXJyYXkgdmFsdWVzPSB7XHJcbiAgICAgICAgICAgIFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kXCI6IDEwMDAsXHJcbiAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwiZGVsdGFcIixcclxuICAgICAgICAgICAgXCJwb2xpY3lcIjogXCJpZGVhbFwiLFxyXG4gICAgICAgICAgICBcIm1pblBlcmlvZFwiOiAyMDBcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVU5TVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1bnN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIgfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1bnN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbiAgICAvLyAqKiByZXR1cm4gUkVRVUVTVCBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHJlcXVlc3QoKSB7IFxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICByZXF1ZXN0SWQ6IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9ICAgICAgICAgICBcclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFBhdGggfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLSHR0cCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZztcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyB9ICAgXHJcbiAgICBcclxuICAgIC8vICoqIGdldCB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuZ2V0KGB2ZXNzZWxzL3NlbGZgKSB9XHJcblxyXG4gICAgLy8qKiBnZXQgSUQgb2YgdmVzc2VsIHNlbGYgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmdldChgc2VsZmApIH1cclxuXHJcbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXHJcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoYCR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICAvLyoqIGdldCBBUEkgcGF0aCB2YWx1ZSB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldChwYXRoOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyoqIHNlbmQgdmFsdWUgdG8gQVBJIHBhdGggdmlhIGh0dHAgcHV0LiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KTtcclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleT86YW55LCB2YWx1ZT86YW55KSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCkgKyAnLycgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlPT0ndW5kZWZpbmVkJykgeyBtc2cudmFsdWU9IGtleSB9XHJcblx0XHRlbHNlIHsgbXNnLnZhbHVlW2tleV09IHZhbHVlIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKSB9XHJcbiAgICB9IFxyXG5cclxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbSB7XHJcblxyXG5cdHByaXZhdGUgX2Nvbm5lY3Q6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX2Nsb3NlOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcblxyXG4gICAgcHJpdmF0ZSB3czogYW55OyAgICBcclxuICAgIHByaXZhdGUgX2ZpbHRlcj0gbnVsbDsgICAgICAgICAgICAgICAvLyAqKiBpZCBvZiB2ZXNzZWwgdG8gZmlsdGVyIGRlbHRhIG1lc3NhZ2VzXHJcbiAgICBwcml2YXRlIF93c1RpbWVvdXQ9IDIwMDAwOyAgICAgICAgICAgLy8gKiogd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAgXHJcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgXHJcbiAgICBwcml2YXRlIF9wbGF5YmFja01vZGU6IGJvb2xlYW49IGZhbHNlO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBwdWJsaWMgb25Db25uZWN0OiBPYnNlcnZhYmxlPGFueT47XHRcdFxyXG4gICAgcHVibGljIG9uQ2xvc2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgICBwdWJsaWMgZW5kcG9pbnQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBzZWxmSWQ6IHN0cmluZztcclxuXHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcclxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxyXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcclxuICAgIH0gICBcclxuICAgIC8vICoqIGlzIFdTIFN0cmVhbSBjb25uZWN0ZWQ/XHJcbiAgICBnZXQgaXNPcGVuKCk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXHJcbiAgICBnZXQgZmlsdGVyKCk6c3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XHJcbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xyXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIGlkICYmIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj0gKHRoaXMuc2VsZklkKSA/IHRoaXMuc2VsZklkIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gaWQgfVxyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIFBsYXliYWNrIEhlbGxvIG1lc3NhZ2VcclxuICAgIGdldCBwbGF5YmFja01vZGUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuX3BsYXliYWNrTW9kZSB9XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoICkgeyBcclxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgICAgICAgIFxyXG4gICAgfSAgIFxyXG5cclxuICAgIC8vICoqIENsb3NlIFdlYlNvY2tldCBjb25uZWN0aW9uXHJcbiAgICBjbG9zZSgpIHsgaWYodGhpcy53cykgeyB0aGlzLndzLmNsb3NlKCk7IHRoaXMud3M9IG51bGw7IH0gfVxyXG4gICBcclxuXHQvLyAqKiBPcGVuIGEgV2ViU29ja2V0IGF0IHByb3ZpZGVkIHVybFxyXG5cdG9wZW4odXJsOnN0cmluZywgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcclxuICAgICAgICB1cmw9ICh1cmwpID8gdXJsIDogdGhpcy5lbmRwb2ludDtcclxuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IHE9ICh1cmwuaW5kZXhPZignPycpPT0tMSkgPyAnPycgOiAnJidcclxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gJHtxfXN1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4gfHwgdG9rZW4pIHsgdXJsKz0gYCR7KHN1YnNjcmliZSkgPyAnJicgOiAnPyd9dG9rZW49JHt0aGlzLl90b2tlbiB8fCB0b2tlbn1gIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxyXG4gICAgICAgIHNldFRpbWVvdXQoIFxyXG4gICAgICAgICAgICAoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxyXG4gICAgICAgICk7XHJcblx0XHRcclxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5fZXJyb3IubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcclxuICAgICAgICAgICAgbGV0IGRhdGE6IGFueTtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7IHJldHVybiB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxmSWQ9IGRhdGEuc2VsZjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrTW9kZT0gKHR5cGVvZiBkYXRhLnN0YXJ0VGltZSE9ICd1bmRlZmluZWQnKSA/IHRydWUgOiBmYWxzZTsgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEuY29udGV4dD09IHRoaXMuX2ZpbHRlcikgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG5cdFx0fVxyXG4gICAgfSAgICAgIFxyXG5cclxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cclxuICAgIHNlbmQoZGF0YTphbnkpIHtcclxuICAgICAgICBpZih0aGlzLndzKSB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2VuZCB2YWx1ZShzKSB2aWEgZGVsdGEgc3RyZWFtIHVwZGF0ZSAqKlxyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZywgcGF0aDpBcnJheTxhbnk+KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6IHN0cmluZyB8IEFycmF5PGFueT4sIHZhbHVlPzphbnkpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnVwZGF0ZXMoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGxldCB1VmFsdWVzPSBbXTtcclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdVZhbHVlcy5wdXNoKHsgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICAgdVZhbHVlcz0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsLnVwZGF0ZXMucHVzaCh7IHZhbHVlczogdVZhbHVlcyB9ICk7IFxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgb3B0aW9uczogey4ufSoqXHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBvcHRpb25zPzphbnkpO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmcgfCBBcnJheTxhbnk+PScqJywgb3B0aW9ucz86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS5zdWJzY3JpYmUoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgc1ZhbHVlPSB7fTtcclxuICAgICAgICAgICAgc1ZhbHVlWydwYXRoJ109IHBhdGg7XHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwZXJpb2QnXSkgeyBzVmFsdWVbJ3BlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydtaW5QZXJpb2QnXSkgeyBzVmFsdWVbJ21pblBlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydmb3JtYXQnXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1snZm9ybWF0J109PSdkZWx0YScgfHwgb3B0aW9uc1snZm9ybWF0J109PSdmdWxsJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ2Zvcm1hdCddPSBvcHRpb25zWydmb3JtYXQnXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BvbGljeSddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydwb2xpY3knXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0naWRlYWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1sncG9saWN5J109PSdmaXhlZCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydwb2xpY3knXT0gb3B0aW9uc1sncG9saWN5J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsLnN1YnNjcmliZS5wdXNoKHNWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcclxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDphbnk9JyonKSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnVuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHsgdmFsLnVuc3Vic2NyaWJlLnB1c2goe3BhdGg6IHBhdGh9KSB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiBNRVNTQUdFIFBBUlNJTkcgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBjb250ZXh0IGlzICdzZWxmJ1xyXG4gICAgaXNTZWxmKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gKG1zZy5jb250ZXh0PT0gdGhpcy5zZWxmSWQpIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxyXG4gICAgaXNEZWx0YShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxyXG4gICAgaXNIZWxsbyhtc2c6YW55KTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNnLnNlbGYhPSAndW5kZWZpbmVkJyk7XHJcbiAgICB9ICAgICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgcmVxdWVzdCBSZXNwb25zZSBtZXNzYWdlXHJcbiAgICBpc1Jlc3BvbnNlKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5yZXF1ZXN0SWQhPSAndW5kZWZpbmVkJyB9IFxyXG59IiwiLyoqIFdlYiBXb3JrZXIgU2VydmljZVxyXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW1Xb3JrZXIgIHtcclxuXHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIHdvcmtlcjogV29ya2VyO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgfSBcclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IHRoaXMud29ya2VyID0gdW5kZWZpbmVkOyB9XHJcblxyXG4gICAgLy8gKiogSW5pdGlhbGlzZSB3b3JrZXJcclxuICAgIGluaXQocGF0aFRvRmlsZTpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYodHlwZW9mKFdvcmtlcik9PSBcInVuZGVmaW5lZFwiKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYodGhpcy53b3JrZXIpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCkgfSAgIC8vICoqIHRlcm1pbmF0ZSBhbiBvcGVuIHdvcmtlclxyXG5cclxuICAgICAgICB0aGlzLndvcmtlcj0gbmV3IFdvcmtlcihwYXRoVG9GaWxlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2U9IGV2ZW50PT4geyB0aGlzLl9tZXNzYWdlLm5leHQoZXZlbnQpIH07XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25lcnJvcj0gZXZlbnQ9PiB7IHRoaXMuX2Vycm9yLm5leHQoZXZlbnQpIH07ICAgICAgICAgICBcclxuICAgICAgICAvLyAqKiB3b3JrZXIgcmVhZHkgZm9yIHBvc3RNZXNzYWdlKClcclxuICAgIH0gICAgXHJcbiAgICBcclxuICAgIC8vICoqIFNlbmQgbWVzc2FnZSB0byB3b3JrZXJcclxuICAgIHBvc3RNZXNzYWdlKG1zZzphbnkpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci5wb3N0TWVzc2FnZShtc2cpIH0gfVxyXG5cclxuICAgIC8vICoqIHRlcm1pbmF0ZSB3b3JrZXJcclxuICAgIHRlcm1pbmF0ZSgpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci50ZXJtaW5hdGUoKX0gfVxyXG59IiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgU2lnbmFsS0h0dHAgfSBmcm9tICcuL2h0dHAtYXBpJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW0gfSBmcm9tICcuL3N0cmVhbS1hcGknO1xuaW1wb3J0IHsgUGF0aCwgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbVdvcmtlcn0gZnJvbSAnLi9zdHJlYW0td29ya2VyJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBTaWduYWxLQ2xpZW50IHtcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICBcbiAgICBwcml2YXRlIF92ZXJzaW9uOiBzdHJpbmc9ICd2MSc7ICAgICAgLy8gKiogZGVmYXVsdCBTaWduYWwgSyBhcGkgdmVyc2lvblxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHRva2VuIGZvciB3aGVuIHNlY3VyaXR5IGlzIGVuYWJsZWQgb24gdGhlIHNlcnZlclxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG4gICAgXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogc2VydmVyIGluZm9ybWF0aW9uIGJsb2NrICoqXG4gICAgcHVibGljIHNlcnZlcj0ge1xuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdXG4gICAgfSAgICBcbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuICAgIHNldCB2ZXJzaW9uKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGxldCB2OnN0cmluZz0gJ3YnKyB2YWw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmxlbmd0aD09MCkgeyBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249IHY7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgdG86ICR7dn1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249ICh0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5pbmRleE9mKHYpIT0tMSkgPyB2IDogdGhpcy5fdmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCByZXF1ZXN0OiAke3Z9LCByZXN1bHQ6ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyBcbiAgICAgICAgdGhpcy5fdG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5hcGkudG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5zdHJlYW0udG9rZW49IHZhbDtcbiAgICB9ICAgIFxuICAgIC8vICoqIE1lc3NhZ2UgT2JqZWN0XG4gICAgZ2V0IG1lc3NhZ2UoKSB7IHJldHVybiBNZXNzYWdlIH1cblxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBcbiAgICAgICAgICAgICAgICBwdWJsaWMgYXBpOiBTaWduYWxLSHR0cCwgXG4gICAgICAgICAgICAgICAgcHVibGljIHN0cmVhbTogU2lnbmFsS1N0cmVhbSxcbiAgICAgICAgICAgICAgICBwdWJsaWMgd29ya2VyOiBTaWduYWxLU3RyZWFtV29ya2VyICkgeyBcbiAgICAgICAgdGhpcy5pbml0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9ICAgXG4gICAgXG4gICAgLy8gKiogaW5pdGlhbGlzZSBwcm90b2NvbCwgaG9zdG5hbWUsIHBvcnQgdmFsdWVzXG4gICAgcHJpdmF0ZSBpbml0KGhvc3RuYW1lOnN0cmluZz0nbG9jYWxob3N0JywgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5ob3N0bmFtZSA9IGhvc3RuYW1lO1xuICAgICAgICBpZih1c2VTU0wpIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cHMnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA0NDM7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgODA7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH0gICAgXG5cbiAgICAvLyAqKioqKioqKioqKioqKioqIENPTk5FQ1RJT04gQU5EIERJU0NPVkVSWSAgKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIFNpZ25hbCBLIHNlcnZlciBlbmRwb2ludCBkaXNjb3ZlcnkgcmVxdWVzdCAoL3NpZ25hbGspLiAgXG4gICAgaGVsbG8oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaW5pdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCcvc2lnbmFsaycpO1xuICAgIH0gICAgXG4gICAgLy8gKiogY29ubmVjdCB0byBzZXJ2ZXIgKGVuZHBvaW50IGRpc2NvdmVyeSkgYW5kIERPIE5PVCBvcGVuIFN0cmVhbVxuICAgIGNvbm5lY3QoaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ0NvbnRhY3RpbmcgU2lnbmFsIEsgc2VydmVyLi4uLi4uLi4uJyk7XG4gICAgICAgICAgICB0aGlzLmhlbGxvKGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpLnN1YnNjcmliZSggICAgLy8gKiogZGlzY292ZXIgZW5kcG9pbnRzICoqXG4gICAgICAgICAgICAgICAgcmVzcG9uc2U9PiB7IFxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnN0cmVhbSkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSGVsbG8ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLmVuZHBvaW50PSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I9PiB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKTsgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIC8vICoqIGRpc2Nvbm5lY3QgZnJvbSBzZXJ2ZXJcbiAgICBkaXNjb25uZWN0KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpOyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTsgfVxuICAgIFxuICAgIC8vICoqIENvbm5lY3QgKyBvcGVuIERlbHRhIFN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RTdHJlYW0oaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBzdWJzY3JpYmU6c3RyaW5nPW51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCwgc3Vic2NyaWJlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCBlPT4geyByZWplY3QoIGUgKSB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFBsYXliYWNrKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgb3B0aW9uczphbnkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdChob3N0bmFtZSwgcG9ydCwgdXNlU1NMKVxuICAgICAgICAgICAgLnRoZW4oICgpPT4geyBcbiAgICAgICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5QbGF5YmFjayhudWxsLCBvcHRpb25zLCB0aGlzLl90b2tlbik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pXG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBkZWx0YSBzdHJlYW0gd2l0aCAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5TdHJlYW0odXJsOnN0cmluZz1udWxsLCBzdWJzY3JpYmU/OnN0cmluZywgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuU3RyZWFtLi4uLi4uLi4uJyk7ICBcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSwgdG9rZW4pOyAgXG4gICAgICAgIHJldHVybiB0cnVlOyAgICAgIFxuICAgIH0gICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgc3RyZWFtIChOTyBlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgb3BlblBsYXliYWNrKHVybDpzdHJpbmc9bnVsbCwgb3B0aW9ucz86YW55LCB0b2tlbj86c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ29wZW5QbGF5YmFjay4uLi4uLi4uLicpO1xuICAgICAgICBpZighdXJsKSB7ICAgICAvLyBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgZGlzY292ZXJlZCBlbmRwb2ludFxuICAgICAgICAgICAgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4oIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVybD0gdXJsLnJlcGxhY2UoJ3N0cmVhbScsICdwbGF5YmFjaycpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgbGV0IHBiPSAnJztcbiAgICAgICAgbGV0IHN1YnNjcmliZTogc3RyaW5nO1xuICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSdvYmplY3QnKXtcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMuc3RhcnRUaW1lKSA/ICc/c3RhcnRUaW1lPScgKyBvcHRpb25zLnN0YXJ0VGltZS5zbGljZSgwLG9wdGlvbnMuc3RhcnRUaW1lLmluZGV4T2YoJy4nKSkgKyAnWicgOiAnJztcbiAgICAgICAgICAgIHBiKz0gKG9wdGlvbnMucGxheWJhY2tSYXRlKSA/IGAmcGxheWJhY2tSYXRlPSR7b3B0aW9ucy5wbGF5YmFja1JhdGV9YCA6ICcnO1xuICAgICAgICAgICAgc3Vic2NyaWJlPSAob3B0aW9ucy5zdWJzY3JpYmUpID8gb3B0aW9ucy5zdWJzY3JpYmUgOiBudWxsOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsICsgcGIsIHN1YnNjcmliZSwgdG9rZW4pOyBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSAgICAgIFxuXG4gICAgLy8gKiogcHJvY2VzcyBIZWxsbyByZXNwb25zZSBcbiAgICBwcml2YXRlIHByb2Nlc3NIZWxsbyhyZXNwb25zZTogYW55KSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0gKHJlc3BvbnNlWydlbmRwb2ludHMnXSkgPyByZXNwb25zZVsnZW5kcG9pbnRzJ10gOiB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuaW5mbz0gKHJlc3BvbnNlWydzZXJ2ZXInXSkgPyByZXNwb25zZVsnc2VydmVyJ10gOiB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9ICh0aGlzLnNlcnZlci5lbmRwb2ludHMpID8gT2JqZWN0LmtleXModGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA6IFtdO1xuICAgICAgICB0aGlzLmRlYnVnKHRoaXMuc2VydmVyLmVuZHBvaW50cyk7XG4gICAgfVxuXG4gICAgLy8gKiogcmV0dXJuIHByZWZlcnJlZCBXUyBzdHJlYW0gdXJsXG4gICAgcHVibGljIHJlc29sdmVTdHJlYW1FbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl1bJ3NpZ25hbGstd3MnXSkge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGluZyBlbmRwb2ludCB2ZXJzaW9uOiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ119YDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXSAmJiB0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXSkgeyBcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3Rpb24gZmFsbGluZyBiYWNrIHRvOiB2MWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay13cyddfWAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBudWxsIH1cbiAgICB9ICBcblxuICAgIC8vICoqIHJldHVybiBzaWduYWxrLWh0dHAgZW5kcG9pbnQgdXJsXG4gICAgcHJpdmF0ZSByZXNvbHZlSHR0cEVuZHBvaW50KCk6c3RyaW5nIHtcbiAgICAgICAgbGV0IHVybDogc3RyaW5nO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0pIHsgLy8gKiogY29ubmVjdGlvbiBtYWRlXG4gICAgICAgICAgICAvLyAqKiBjb25uZWN0IHRvIGh0dHAgZW5kcG9pbnQgYXQgcHJlc2NyaWJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXSkge1xuICAgICAgICAgICAgICAgIHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLWh0dHAnXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IHVybD0gYCR7dGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLWh0dHAnXX1gIH0gICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbXNnPSAnTm8gY3VycmVudCBjb25uZWN0aW9uIGh0dHAgZW5kcG9pbnQgc2VydmljZSEgVXNlIGNvbm5lY3QoKSB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uLidcbiAgICAgICAgICAgIHRoaXMuZGVidWcobXNnKTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHVybDsgICBcbiAgICB9ICAgIFxuICAgIFxuICAgIC8vICoqIGNsZWFudXAgb24gc2VydmVyIGRpc2Nvbm5lY3Rpb25cbiAgICBwcml2YXRlIGRpc2Nvbm5lY3RlZEZyb21TZXJ2ZXIoKSB7XG4gICAgICAgIHRoaXMuc2VydmVyLmVuZHBvaW50cz0ge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gW107ICBcbiAgICB9XG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZyb20gaHR0cCBwYXRoXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgZ2V0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfSAgICAgICAgXG4gICAgfTsgIFxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcHV0IHRvIGh0dHAgcGF0aFxuICAgIHB1dChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcbiAgICAgICAgdGhpcy5kZWJ1ZyhgcHV0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgdmFsdWUpIH0gICAgICAgIFxuICAgIH07XG5cbiAgICAvLyoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBwb3N0IHRvIGh0dHAgcGF0aFxuICAgIHBvc3QocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHBvc3QgJHt1cmx9YCk7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9OyAgIFxuXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsIGBhcHBsaWNhdGlvbi9qc29uYCk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChcbiAgICAgICAgICAgIGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9naW5gLFxuICAgICAgICAgICAgeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICB7IGhlYWRlcnMgfVxuICAgICAgICApO1xuICAgIH1cblx0XG4gICAgLy8gKiogbG9nb3V0IGZyb20gc2VydmVyICoqXG4gICAgbG9nb3V0KCkge1xuXHRcdGxldCB1cmw9YCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fS9zaWduYWxrLyR7dGhpcy5fdmVyc2lvbn0vYXV0aC9sb2dvdXRgO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwsIHsgaGVhZGVycyB9ICk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQoIHVybCwgbnVsbCApIH1cbiAgICB9XHQgICBcbiAgICBcbiAgICAvLyoqIGdldCBkYXRhIHZpYSB0aGUgc25hcHNob3QgaHR0cCBhcGkgcGF0aCBmb3Igc3VwcGxpZWQgdGltZVxuICAgIHNuYXBzaG90KGNvbnRleHQ6c3RyaW5nLCB0aW1lOnN0cmluZykgeyBcbiAgICAgICAgaWYoIXRpbWUpIHsgcmV0dXJuIH1cbiAgICAgICAgdGltZT0gdGltZS5zbGljZSgwLHRpbWUuaW5kZXhPZignLicpKSArICdaJztcbiAgICAgICAgbGV0IHVybD0gdGhpcy5yZXNvbHZlSHR0cEVuZHBvaW50KCk7XG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cbiAgICAgICAgdXJsPSBgJHt1cmwucmVwbGFjZSgnYXBpJywnc25hcHNob3QnKX0ke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0/dGltZT0ke3RpbWV9YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cbiAgICB9XG5cbn1cbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBTaWduYWxLQ2xpZW50IE1vZHVsZTpcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFsgSHR0cENsaWVudE1vZHVsZSBdLCAgICBcclxuICAgIGRlY2xhcmF0aW9uczogW10sXHJcbiAgICBleHBvcnRzOiBbXSxcclxuICAgIGVudHJ5Q29tcG9uZW50czogW10sIFxyXG4gICAgcHJvdmlkZXJzOiBbXSAgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLQ2xpZW50TW9kdWxlIHt9XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL3NpZ25hbGstY2xpZW50JzsiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsTUFBYSxJQUFJOzs7Ozs7SUFHYixPQUFPLFVBQVUsQ0FBQyxJQUFXO1FBQ3pCLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRTthQUN6RDtZQUFFLE9BQU8sSUFBSSxDQUFBO1NBQUU7S0FDdkI7Ozs7OztJQUdELE9BQU8sYUFBYSxDQUFDLE9BQWM7O1lBQzNCLEdBQUcsR0FBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLElBQUssY0FBYyxHQUFFLE9BQU87UUFDckQsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuQztDQUVKOztBQUdELE1BQWEsT0FBTzs7Ozs7SUFHaEIsT0FBTyxPQUFPOztRQUVWLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSxFQUFFO1NBQ2QsQ0FBQTtLQUNKOzs7OztJQUVELE9BQU8sU0FBUzs7Ozs7Ozs7UUFRWixPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixTQUFTLEVBQUUsRUFBRTtTQUNoQixDQUFBO0tBQ0o7Ozs7O0lBRUQsT0FBTyxXQUFXOztRQUVkLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxFQUFFO1NBQ2xCLENBQUE7S0FDSjs7Ozs7SUFFRCxPQUFPLE9BQU87UUFDVixPQUFPO1lBQ0gsU0FB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