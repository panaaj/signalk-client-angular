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
/*
 * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see http://www.ietf.org/rfc/rfc4122.txt
 **/
class UUID {
    constructor() {
        this.limitUI04 = this.maxFromBits(4);
        this.limitUI06 = this.maxFromBits(6);
        this.limitUI08 = this.maxFromBits(8);
        this.limitUI12 = this.maxFromBits(12);
        this.limitUI14 = this.maxFromBits(14);
        this.limitUI16 = this.maxFromBits(16);
        this.limitUI32 = this.maxFromBits(32);
        this.limitUI40 = this.maxFromBits(40);
        this.limitUI48 = this.maxFromBits(48);
        this.create();
    }
    /**
     * @return {?}
     */
    toString() { return this.hex; }
    /**
     * @return {?}
     */
    toURN() { return 'urn:uuid:' + this.hex; }
    /**
     * @return {?}
     */
    toSignalK() { return `urn:mrn:signalk:uuid:${this.hex}`; }
    /**
     * @return {?}
     */
    toBytes() {
        /** @type {?} */
        let parts = this.hex.split('-');
        /** @type {?} */
        let ints = [];
        /** @type {?} */
        let intPos = 0;
        for (let i = 0; i < parts.length; i++) {
            for (let j = 0; j < parts[i].length; j += 2) {
                ints[intPos++] = parseInt(parts[i].substr(j, 2), 16);
            }
        }
        return ints;
    }
    ;
    /**
     * @private
     * @param {?} bits
     * @return {?}
     */
    maxFromBits(bits) { return Math.pow(2, bits); }
    ;
    /**
     * @private
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    /**
     * @private
     * @return {?}
     */
    randomUI04() { return this.getRandomInt(0, this.limitUI04 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI06() { return this.getRandomInt(0, this.limitUI06 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI08() { return this.getRandomInt(0, this.limitUI08 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI12() { return this.getRandomInt(0, this.limitUI12 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI14() { return this.getRandomInt(0, this.limitUI14 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI16() { return this.getRandomInt(0, this.limitUI16 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI32() { return this.getRandomInt(0, this.limitUI32 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI40() { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 40 - 30)) * (1 << 30); }
    /**
     * @private
     * @return {?}
     */
    randomUI48() { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30); }
    /**
     * @private
     * @return {?}
     */
    create() {
        this.fromParts(this.randomUI32(), this.randomUI16(), 0x4000 | this.randomUI12(), 0x80 | this.randomUI06(), this.randomUI08(), this.randomUI48());
    }
    ;
    /**
     * @private
     * @param {?} string
     * @param {?} length
     * @param {?=} z
     * @return {?}
     */
    paddedString(string, length, z = null) {
        string = String(string);
        z = (!z) ? '0' : z;
        /** @type {?} */
        let i = length - string.length;
        for (; i > 0; i >>>= 1, z += z) {
            if (i & 1) {
                string = z + string;
            }
        }
        return string;
    }
    ;
    /**
     * @private
     * @template THIS
     * @this {THIS}
     * @param {?} timeLow
     * @param {?} timeMid
     * @param {?} timeHiAndVersion
     * @param {?} clockSeqHiAndReserved
     * @param {?} clockSeqLow
     * @param {?} node
     * @return {THIS}
     */
    fromParts(timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
        (/** @type {?} */ (this)).version = (timeHiAndVersion >> 12) & 0xF;
        (/** @type {?} */ (this)).hex = (/** @type {?} */ (this)).paddedString(timeLow.toString(16), 8)
            + '-'
            + (/** @type {?} */ (this)).paddedString(timeMid.toString(16), 4)
            + '-'
            + (/** @type {?} */ (this)).paddedString(timeHiAndVersion.toString(16), 4)
            + '-'
            + (/** @type {?} */ (this)).paddedString(clockSeqHiAndReserved.toString(16), 2)
            + (/** @type {?} */ (this)).paddedString(clockSeqLow.toString(16), 2)
            + '-'
            + (/** @type {?} */ (this)).paddedString(node.toString(16), 12);
        return (/** @type {?} */ (this));
    }
    ;
}

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXRpbHMudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL2h0dHAtYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0tYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0td29ya2VyLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi91dWlkLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zaWduYWxrLWNsaWVudC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vICoqIFBhdGggdXRpbGl0aWVzXHJcbmV4cG9ydCBjbGFzcyBQYXRoIHtcclxuXHJcbiAgICAvLyAqKiB0cmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIHNsYXNoXHJcbiAgICBzdGF0aWMgZG90VG9TbGFzaChwYXRoOnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHsgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5qb2luKCcvJykgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXHJcbiAgICBzdGF0aWMgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcclxuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgfSAgICBcclxuXHJcbn1cclxuXHJcbi8vICoqIE1lc3NhZ2UgdGVtcGxhdGVzICoqXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcclxuICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVVBEQVRFUyBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVwZGF0ZXMoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyB2YWx1ZXM6IFsge3BhdGg6IHh4LCB2YWx1ZTogeHggfSBdIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdXBkYXRlczogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gKiogcmV0dXJuIFNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLyogYXJyYXkgdmFsdWVzPSB7XHJcbiAgICAgICAgICAgIFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kXCI6IDEwMDAsXHJcbiAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwiZGVsdGFcIixcclxuICAgICAgICAgICAgXCJwb2xpY3lcIjogXCJpZGVhbFwiLFxyXG4gICAgICAgICAgICBcIm1pblBlcmlvZFwiOiAyMDBcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVU5TVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1bnN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIgfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1bnN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbiAgICAvLyAqKiByZXR1cm4gUkVRVUVTVCBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHJlcXVlc3QoKSB7IFxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICByZXF1ZXN0SWQ6IG51bGxcclxuICAgICAgICB9XHJcbiAgICB9ICAgICAgICAgICBcclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFBhdGggfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLSHR0cCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZztcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyB9ICAgXHJcbiAgICBcclxuICAgIC8vICoqIGdldCB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuZ2V0KGB2ZXNzZWxzL3NlbGZgKSB9XHJcblxyXG4gICAgLy8qKiBnZXQgSUQgb2YgdmVzc2VsIHNlbGYgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmdldChgc2VsZmApIH1cclxuXHJcbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXHJcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoYCR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICAvLyoqIGdldCBBUEkgcGF0aCB2YWx1ZSB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldChwYXRoOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyoqIHNlbmQgdmFsdWUgdG8gQVBJIHBhdGggdmlhIGh0dHAgcHV0LiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KTtcclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleT86YW55LCB2YWx1ZT86YW55KSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCkgKyAnLycgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlPT0ndW5kZWZpbmVkJykgeyBtc2cudmFsdWU9IGtleSB9XHJcblx0XHRlbHNlIHsgbXNnLnZhbHVlW2tleV09IHZhbHVlIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKSB9XHJcbiAgICB9IFxyXG5cclxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbSB7XHJcblxyXG5cdHByaXZhdGUgX2Nvbm5lY3Q6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX2Nsb3NlOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcblxyXG4gICAgcHJpdmF0ZSB3czogYW55OyAgICBcclxuICAgIHByaXZhdGUgX2ZpbHRlcj0gbnVsbDsgICAgICAgICAgICAgICAvLyAqKiBpZCBvZiB2ZXNzZWwgdG8gZmlsdGVyIGRlbHRhIG1lc3NhZ2VzXHJcbiAgICBwcml2YXRlIF93c1RpbWVvdXQ9IDIwMDAwOyAgICAgICAgICAgLy8gKiogd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAgXHJcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgXHJcbiAgICBwcml2YXRlIF9wbGF5YmFja01vZGU6IGJvb2xlYW49IGZhbHNlO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBwdWJsaWMgb25Db25uZWN0OiBPYnNlcnZhYmxlPGFueT47XHRcdFxyXG4gICAgcHVibGljIG9uQ2xvc2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcclxuXHJcbiAgICBwdWJsaWMgZW5kcG9pbnQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBzZWxmSWQ6IHN0cmluZztcclxuXHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcclxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxyXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcclxuICAgIH0gICBcclxuICAgIC8vICoqIGlzIFdTIFN0cmVhbSBjb25uZWN0ZWQ/XHJcbiAgICBnZXQgaXNPcGVuKCk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXHJcbiAgICBnZXQgZmlsdGVyKCk6c3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XHJcbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xyXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIGlkICYmIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj0gKHRoaXMuc2VsZklkKSA/IHRoaXMuc2VsZklkIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gaWQgfVxyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIFBsYXliYWNrIEhlbGxvIG1lc3NhZ2VcclxuICAgIGdldCBwbGF5YmFja01vZGUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuX3BsYXliYWNrTW9kZSB9XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoICkgeyBcclxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgICAgICAgIFxyXG4gICAgfSAgIFxyXG5cclxuICAgIC8vICoqIENsb3NlIFdlYlNvY2tldCBjb25uZWN0aW9uXHJcbiAgICBjbG9zZSgpIHsgaWYodGhpcy53cykgeyB0aGlzLndzLmNsb3NlKCk7IHRoaXMud3M9IG51bGw7IH0gfVxyXG4gICBcclxuXHQvLyAqKiBPcGVuIGEgV2ViU29ja2V0IGF0IHByb3ZpZGVkIHVybFxyXG5cdG9wZW4odXJsOnN0cmluZywgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcclxuICAgICAgICB1cmw9ICh1cmwpID8gdXJsIDogdGhpcy5lbmRwb2ludDtcclxuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IHE9ICh1cmwuaW5kZXhPZignPycpPT0tMSkgPyAnPycgOiAnJidcclxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gJHtxfXN1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4gfHwgdG9rZW4pIHsgdXJsKz0gYCR7KHN1YnNjcmliZSkgPyAnJicgOiAnPyd9dG9rZW49JHt0aGlzLl90b2tlbiB8fCB0b2tlbn1gIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxyXG4gICAgICAgIHNldFRpbWVvdXQoIFxyXG4gICAgICAgICAgICAoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxyXG4gICAgICAgICk7XHJcblx0XHRcclxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5fZXJyb3IubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHtcclxuICAgICAgICAgICAgbGV0IGRhdGE6IGFueTtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7IHJldHVybiB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxmSWQ9IGRhdGEuc2VsZjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrTW9kZT0gKHR5cGVvZiBkYXRhLnN0YXJ0VGltZSE9ICd1bmRlZmluZWQnKSA/IHRydWUgOiBmYWxzZTsgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEuY29udGV4dD09IHRoaXMuX2ZpbHRlcikgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG5cdFx0fVxyXG4gICAgfSAgICAgIFxyXG5cclxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cclxuICAgIHNlbmQoZGF0YTphbnkpIHtcclxuICAgICAgICBpZih0aGlzLndzKSB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2VuZCB2YWx1ZShzKSB2aWEgZGVsdGEgc3RyZWFtIHVwZGF0ZSAqKlxyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZywgcGF0aDpBcnJheTxhbnk+KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6IHN0cmluZyB8IEFycmF5PGFueT4sIHZhbHVlPzphbnkpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnVwZGF0ZXMoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGxldCB1VmFsdWVzPSBbXTtcclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdVZhbHVlcy5wdXNoKHsgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICAgdVZhbHVlcz0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsLnVwZGF0ZXMucHVzaCh7IHZhbHVlczogdVZhbHVlcyB9ICk7IFxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFN1YnNjcmliZSB0byBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgb3B0aW9uczogey4ufSoqXHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBvcHRpb25zPzphbnkpO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDpzdHJpbmcgfCBBcnJheTxhbnk+PScqJywgb3B0aW9ucz86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS5zdWJzY3JpYmUoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBsZXQgc1ZhbHVlPSB7fTtcclxuICAgICAgICAgICAgc1ZhbHVlWydwYXRoJ109IHBhdGg7XHJcbiAgICAgICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwZXJpb2QnXSkgeyBzVmFsdWVbJ3BlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydtaW5QZXJpb2QnXSkgeyBzVmFsdWVbJ21pblBlcmlvZCddPSBvcHRpb25zWydwZXJpb2QnXSB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydmb3JtYXQnXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1snZm9ybWF0J109PSdkZWx0YScgfHwgb3B0aW9uc1snZm9ybWF0J109PSdmdWxsJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ2Zvcm1hdCddPSBvcHRpb25zWydmb3JtYXQnXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BvbGljeSddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydwb2xpY3knXT09J2luc3RhbnQnIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0naWRlYWwnXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgb3B0aW9uc1sncG9saWN5J109PSdmaXhlZCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydwb2xpY3knXT0gb3B0aW9uc1sncG9saWN5J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsLnN1YnNjcmliZS5wdXNoKHNWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogVW5zdWJzY3JpYmUgZnJvbSBEZWx0YSBzdHJlYW0gbWVzc2FnZXMgKipcclxuICAgIHVuc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nPScqJywgcGF0aDphbnk9JyonKSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnVuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHsgdmFsLnVuc3Vic2NyaWJlLnB1c2goe3BhdGg6IHBhdGh9KSB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiBNRVNTQUdFIFBBUlNJTkcgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBjb250ZXh0IGlzICdzZWxmJ1xyXG4gICAgaXNTZWxmKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gKG1zZy5jb250ZXh0PT0gdGhpcy5zZWxmSWQpIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgRGVsdGEgbWVzc2FnZVxyXG4gICAgaXNEZWx0YShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cuY29udGV4dCE9ICd1bmRlZmluZWQnIH1cclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgSGVsbG8gbWVzc2FnZVxyXG4gICAgaXNIZWxsbyhtc2c6YW55KTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgbXNnLnZlcnNpb24hPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNnLnNlbGYhPSAndW5kZWZpbmVkJyk7XHJcbiAgICB9ICAgICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGlzIGEgcmVxdWVzdCBSZXNwb25zZSBtZXNzYWdlXHJcbiAgICBpc1Jlc3BvbnNlKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5yZXF1ZXN0SWQhPSAndW5kZWZpbmVkJyB9IFxyXG59IiwiLyoqIFdlYiBXb3JrZXIgU2VydmljZVxyXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW1Xb3JrZXIgIHtcclxuXHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIHdvcmtlcjogV29ya2VyO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgfSBcclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IHRoaXMud29ya2VyID0gdW5kZWZpbmVkOyB9XHJcblxyXG4gICAgLy8gKiogSW5pdGlhbGlzZSB3b3JrZXJcclxuICAgIGluaXQocGF0aFRvRmlsZTpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYodHlwZW9mKFdvcmtlcik9PSBcInVuZGVmaW5lZFwiKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYodGhpcy53b3JrZXIpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCkgfSAgIC8vICoqIHRlcm1pbmF0ZSBhbiBvcGVuIHdvcmtlclxyXG5cclxuICAgICAgICB0aGlzLndvcmtlcj0gbmV3IFdvcmtlcihwYXRoVG9GaWxlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2U9IGV2ZW50PT4geyB0aGlzLl9tZXNzYWdlLm5leHQoZXZlbnQpIH07XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25lcnJvcj0gZXZlbnQ9PiB7IHRoaXMuX2Vycm9yLm5leHQoZXZlbnQpIH07ICAgICAgICAgICBcclxuICAgICAgICAvLyAqKiB3b3JrZXIgcmVhZHkgZm9yIHBvc3RNZXNzYWdlKClcclxuICAgIH0gICAgXHJcbiAgICBcclxuICAgIC8vICoqIFNlbmQgbWVzc2FnZSB0byB3b3JrZXJcclxuICAgIHBvc3RNZXNzYWdlKG1zZzphbnkpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci5wb3N0TWVzc2FnZShtc2cpIH0gfVxyXG5cclxuICAgIC8vICoqIHRlcm1pbmF0ZSB3b3JrZXJcclxuICAgIHRlcm1pbmF0ZSgpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci50ZXJtaW5hdGUoKX0gfVxyXG59IiwiLypcclxuICogVVVJRDogQSBqcyBsaWJyYXJ5IHRvIGdlbmVyYXRlIGFuZCBwYXJzZSBVVUlEcywgVGltZVVVSURzIGFuZCBnZW5lcmF0ZVxyXG4gKiBUaW1lVVVJRCBiYXNlZCBvbiBkYXRlcyBmb3IgcmFuZ2Ugc2VsZWN0aW9ucy5cclxuICogQHNlZSBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gKiovXHJcbmV4cG9ydCBjbGFzcyBVVUlEIHtcclxuXHJcbiAgICBwcml2YXRlIGxpbWl0VUkwNDtcclxuICAgIHByaXZhdGUgbGltaXRVSTA2O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDg7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxMjtcclxuICAgIHByaXZhdGUgbGltaXRVSTE0O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTY7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkzMjtcclxuICAgIHByaXZhdGUgbGltaXRVSTQwO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJNDg7XHJcblxyXG4gICAgcHJpdmF0ZSB2ZXJzaW9uOm51bWJlcjtcclxuICAgIHByaXZhdGUgaGV4OnN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwNCA9IHRoaXMubWF4RnJvbUJpdHMoNCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDYgPSB0aGlzLm1heEZyb21CaXRzKDYpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA4ID0gdGhpcy5tYXhGcm9tQml0cyg4KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxMiA9IHRoaXMubWF4RnJvbUJpdHMoMTIpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTE0ID0gdGhpcy5tYXhGcm9tQml0cygxNCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTYgPSB0aGlzLm1heEZyb21CaXRzKDE2KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkzMiA9IHRoaXMubWF4RnJvbUJpdHMoMzIpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTQwID0gdGhpcy5tYXhGcm9tQml0cyg0MCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJNDggPSB0aGlzLm1heEZyb21CaXRzKDQ4KTsgXHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKSB7IHJldHVybiB0aGlzLmhleCB9XHJcbiAgICB0b1VSTigpIHsgcmV0dXJuICd1cm46dXVpZDonICsgdGhpcy5oZXggfVxyXG4gICAgdG9TaWduYWxLKCk6c3RyaW5nICB7IHJldHVybiBgdXJuOm1ybjpzaWduYWxrOnV1aWQ6JHt0aGlzLmhleH1gIH1cclxuICAgIHRvQnl0ZXMoKSB7XHJcbiAgICAgICAgbGV0IHBhcnRzID0gdGhpcy5oZXguc3BsaXQoJy0nKTtcclxuICAgICAgICBsZXQgaW50cyA9IFtdO1xyXG4gICAgICAgIGxldCBpbnRQb3MgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJ0c1tpXS5sZW5ndGg7IGorPTIpIHtcclxuICAgICAgICAgICAgaW50c1tpbnRQb3MrK10gPSBwYXJzZUludChwYXJ0c1tpXS5zdWJzdHIoaiwgMiksIDE2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW50cztcclxuICAgIH07ICAgIFxyXG5cclxuICAgIHByaXZhdGUgbWF4RnJvbUJpdHMoYml0cykgeyByZXR1cm4gTWF0aC5wb3coMiwgYml0cykgfTtcclxuXHJcbiAgICBwcml2YXRlIGdldFJhbmRvbUludChtaW4sIG1heCkgeyByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbiB9XHJcblxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTA0KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMDQtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTA2KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMDYtMSk7fVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTA4KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMDgtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTEyKCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMTItMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTE0KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMTQtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTE2KCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMTYtMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTMyKCkgeyByZXR1cm4gdGhpcy5nZXRSYW5kb21JbnQoMCwgdGhpcy5saW1pdFVJMzItMSkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTQwKCkgeyByZXR1cm4gKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgMzApKSArICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDQwIC0gMzApKSAqICgxIDw8IDMwKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJNDgoKSB7IHJldHVybiAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCAzMCkpICsgKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgNDggLSAzMCkpICogKDEgPDwgMzApIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcclxuICAgICAgICB0aGlzLmZyb21QYXJ0cyhcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTMyKCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkxNigpLFxyXG4gICAgICAgICAgICAweDQwMDAgfCB0aGlzLnJhbmRvbVVJMTIoKSxcclxuICAgICAgICAgICAgMHg4MCAgIHwgdGhpcy5yYW5kb21VSTA2KCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkwOCgpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJNDgoKVxyXG4gICAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgcGFkZGVkU3RyaW5nKHN0cmluZywgbGVuZ3RoLCB6PW51bGwpIHtcclxuICAgICAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKTtcclxuICAgICAgICB6ID0gKCF6KSA/ICcwJyA6IHo7XHJcbiAgICAgICAgbGV0IGkgPSBsZW5ndGggLSBzdHJpbmcubGVuZ3RoO1xyXG4gICAgICAgIGZvciAoOyBpID4gMDsgaSA+Pj49IDEsIHogKz0geikge1xyXG4gICAgICAgICAgICBpZiAoaSAmIDEpIHtcclxuICAgICAgICAgICAgc3RyaW5nID0geiArIHN0cmluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGZyb21QYXJ0cyh0aW1lTG93LCB0aW1lTWlkLCB0aW1lSGlBbmRWZXJzaW9uLCBjbG9ja1NlcUhpQW5kUmVzZXJ2ZWQsIGNsb2NrU2VxTG93LCBub2RlKSB7XHJcbiAgICAgICAgdGhpcy52ZXJzaW9uID0gKHRpbWVIaUFuZFZlcnNpb24gPj4gMTIpICYgMHhGO1xyXG4gICAgICAgIHRoaXMuaGV4ID0gdGhpcy5wYWRkZWRTdHJpbmcodGltZUxvdy50b1N0cmluZygxNiksIDgpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcodGltZU1pZC50b1N0cmluZygxNiksIDQpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcodGltZUhpQW5kVmVyc2lvbi50b1N0cmluZygxNiksIDQpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcoY2xvY2tTZXFIaUFuZFJlc2VydmVkLnRvU3RyaW5nKDE2KSwgMilcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhjbG9ja1NlcUxvdy50b1N0cmluZygxNiksIDIpXHJcbiAgICAgICAgICAgICsgJy0nXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcobm9kZS50b1N0cmluZygxNiksIDEyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07ICAgIFxyXG4gICAgXHJcbiAgICAvKlxyXG4gICAgcHJpdmF0ZSBnZXRUaW1lRmllbGRWYWx1ZXModGltZSkge1xyXG4gICAgICAgIGxldCB0cyA9IHRpbWUgLSBEYXRlLlVUQygxNTgyLCA5LCAxNSk7XHJcbiAgICAgICAgbGV0IGhtID0gKCh0cyAvIDB4MTAwMDAwMDAwKSAqIDEwMDAwKSAmIDB4RkZGRkZGRjtcclxuICAgICAgICByZXR1cm4geyBsb3c6ICgodHMgJiAweEZGRkZGRkYpICogMTAwMDApICUgMHgxMDAwMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBtaWQ6IGhtICYgMHhGRkZGLCBoaTogaG0gPj4+IDE2LCB0aW1lc3RhbXA6IHRzIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGZyb21UaW1lKHRpbWUsIGxhc3Q6Ym9vbGVhbikge1xyXG4gICAgICAgIGxhc3QgPSAoIWxhc3QpID8gZmFsc2UgOiBsYXN0O1xyXG4gICAgICAgIGxldCB0ZiA9IHRoaXMuZ2V0VGltZUZpZWxkVmFsdWVzKHRpbWUpO1xyXG4gICAgICAgIGxldCB0bCA9IHRmLmxvdztcclxuICAgICAgICBsZXQgdGhhdiA9ICh0Zi5oaSAmIDB4RkZGKSB8IDB4MTAwMDsgIC8vIHNldCB2ZXJzaW9uICcwMDAxJ1xyXG4gICAgICAgIGlmIChsYXN0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVVSUQoKS5mcm9tUGFydHModGwsIHRmLm1pZCwgdGhhdiwgMCwgMCwgMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVVUlEKCkuZnJvbVBhcnRzKHRsLCB0Zi5taWQsIHRoYXYsIDB4ODAgfCB0aGlzLmxpbWl0VUkwNiwgdGhpcy5saW1pdFVJMDggLSAxLCB0aGlzLmxpbWl0VUk0OCAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZmlyc3RGcm9tVGltZSh0aW1lKSB7IHJldHVybiB0aGlzLmZyb21UaW1lKHRpbWUsIGZhbHNlKSB9XHJcbiAgICBsYXN0RnJvbVRpbWUodGltZSkgeyByZXR1cm4gdGhpcy5mcm9tVGltZSh0aW1lLCB0cnVlKSB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgZXF1YWxzKHV1aWQpIHtcclxuICAgICAgICBpZiAoISh1dWlkIGluc3RhbmNlb2YgVVVJRCkpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICBpZiAodGhpcy5oZXggIT09IHV1aWQuaGV4KSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIGZyb21VUk4oc3RySWQpIHtcclxuICAgICAgICBsZXQgcjtcclxuICAgICAgICBsZXQgcCA9IC9eKD86dXJuOnV1aWQ6fFxceyk/KFswLTlhLWZdezh9KS0oWzAtOWEtZl17NH0pLShbMC05YS1mXXs0fSktKFswLTlhLWZdezJ9KShbMC05YS1mXXsyfSktKFswLTlhLWZdezEyfSkoPzpcXH0pPyQvaTtcclxuICAgICAgICBpZiAoKHIgPSBwLmV4ZWMoc3RySWQpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mcm9tUGFydHMoXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzFdLCAxNiksIHBhcnNlSW50KHJbMl0sIDE2KSxcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbM10sIDE2KSwgcGFyc2VJbnQocls0XSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQocls1XSwgMTYpLCBwYXJzZUludChyWzZdLCAxNilcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnJvbUJ5dGVzKGludHMpIHtcclxuICAgICAgICBpZiAoaW50cy5sZW5ndGggPCA1KSB7IHJldHVybiBudWxsIH1cclxuICAgICAgICBsZXQgc3RyID0gJyc7XHJcbiAgICAgICAgbGV0IHBvcyA9IDA7XHJcbiAgICAgICAgbGV0IHBhcnRzID0gWzQsIDIsIDIsIDIsIDZdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJ0c1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBvY3RldCA9IGludHNbcG9zKytdLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgaWYgKG9jdGV0Lmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBvY3RldCA9ICcwJyArIG9jdGV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0ciArPSBvY3RldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGFydHNbaV0gIT09IDYpIHtcclxuICAgICAgICAgICAgc3RyICs9ICctJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9tVVJOKHN0cik7XHJcbiAgICB9O1xyXG5cclxuICAgIGZyb21CaW5hcnkoYmluYXJ5KSB7XHJcbiAgICAgICAgbGV0IGludHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpbnRzW2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgIGlmIChpbnRzW2ldID4gMjU1IHx8IGludHNbaV0gPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBieXRlIGluIGJpbmFyeSBkYXRhLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb21CeXRlcyhpbnRzKTtcclxuICAgIH07XHJcbiAgICAqL1xyXG5cclxufTsiLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBTaWduYWxLSHR0cCB9IGZyb20gJy4vaHR0cC1hcGknO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbSB9IGZyb20gJy4vc3RyZWFtLWFwaSc7XG5pbXBvcnQgeyBQYXRoLCBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtV29ya2VyfSBmcm9tICcuL3N0cmVhbS13b3JrZXInO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuICAgIFxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHB1YmxpYyBzZXJ2ZXI9IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXVxuICAgIH0gICAgXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgXG4gICAgICAgIHRoaXMuX3Rva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuYXBpLnRva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuc3RyZWFtLnRva2VuPSB2YWw7XG4gICAgfSAgICBcbiAgICAvLyAqKiBNZXNzYWdlIE9iamVjdFxuICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gTWVzc2FnZSB9XG5cbiAgICAvLyAqKiBnZW5lcmF0ZSBhbmQgcmV0dXJuIGEgVVVJRCBvYmplY3RcbiAgICBnZXQgdXVpZCgpOlVVSUQgeyByZXR1cm4gbmV3IFVVSUQoKSB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgXG4gICAgICAgICAgICAgICAgcHVibGljIGFwaTogU2lnbmFsS0h0dHAsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzdHJlYW06IFNpZ25hbEtTdHJlYW0sXG4gICAgICAgICAgICAgICAgcHVibGljIHdvcmtlcjogU2lnbmFsS1N0cmVhbVdvcmtlciApIHsgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfSAgIFxuICAgIFxuICAgIC8vICoqIGluaXRpYWxpc2UgcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0IHZhbHVlc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9J2xvY2FsaG9zdCcsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OIEFORCBESVNDT1ZFUlkgICoqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZW5kcG9pbnQgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyIChlbmRwb2ludCBkaXNjb3ZlcnkpIGFuZCBETyBOT1Qgb3BlbiBTdHJlYW1cbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlPT4geyBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKTsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IH1cbiAgICBcbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RQbGF5YmFjayhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIG9wdGlvbnM6YW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHB1dCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTsgICBcblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwgKSB9XG4gICAgfVx0ICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuXG59XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogU2lnbmFsS0NsaWVudCBNb2R1bGU6XHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbIEh0dHBDbGllbnRNb2R1bGUgXSwgICAgXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW10sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdLCBcclxuICAgIHByb3ZpZGVyczogW10gIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudE1vZHVsZSB7fVxyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9zaWduYWxrLWNsaWVudCc7Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLE1BQWEsSUFBSTs7Ozs7O0lBR2IsT0FBTyxVQUFVLENBQUMsSUFBVztRQUN6QixJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUUsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQUU7YUFDekQ7WUFBRSxPQUFPLElBQUksQ0FBQTtTQUFFO0tBQ3ZCOzs7Ozs7SUFHRCxPQUFPLGFBQWEsQ0FBQyxPQUFjOztZQUMzQixHQUFHLEdBQUUsQ0FBQyxPQUFPLElBQUUsTUFBTSxJQUFLLGNBQWMsR0FBRSxPQUFPO1FBQ3JELE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7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U0FBUyxHQUFFLEtBQUssTUFBSyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxFQUFFLENBQUM7UUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUUsS0FBSyxNQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBLEVBQUUsQ0FBQzs7S0FFNUQ7Ozs7OztJQUdELFdBQVcsQ0FBQyxHQUFPLElBQUksSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7S0FBRSxFQUFFOzs7OztJQUd4RSxTQUFTLEtBQUssSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtLQUFDLEVBQUU7OztZQXRDNUQsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0FDQWxDLE1BQWEsSUFBSTtJQWViO1FBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2pCOzs7O0lBRUQsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQSxFQUFFOzs7O0lBQzlCLEtBQUssS0FBSyxPQUFPLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBLEVBQUU7Ozs7SUFDekMsU0FBUyxLQUFhLE9BQU8sd0JBQXdCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQSxFQUFFOzs7O0lBQ2pFLE9BQU87O1lBQ0MsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzs7WUFDM0IsSUFBSSxHQUFHLEVBQUU7O1lBQ1QsTUFBTSxHQUFHLENBQUM7UUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDcEQ7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7Ozs7Ozs7SUFFTyxXQUFXLENBQUMsSUFBSSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUEsRUFBRTs7Ozs7Ozs7SUFFOUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBLEVBQUU7Ozs7O0lBRW5GLFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUU7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUU7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFF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