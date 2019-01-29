import { Injectable, NgModule, isDevMode, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';

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
            requestId: new UUID().toString()
        };
    }
}
// ** Alarm message **
class Alarm {
    /**
     * @param {?} message
     * @param {?=} state
     * @param {?=} visual
     * @param {?=} sound
     */
    constructor(message, state, visual, sound) {
        this._method = [];
        this._message = '';
        this._message = (typeof message !== 'undefined') ? message : '';
        this._state = (typeof state !== 'undefined') ? state : AlarmState.alarm;
        if (visual) {
            this._method.push(AlarmMethod.visual);
        }
        if (sound) {
            this._method.push(AlarmMethod.sound);
        }
    }
    /**
     * @return {?}
     */
    get value() {
        return {
            message: this._message,
            state: this._state,
            method: this._method
        };
    }
}
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
/** @enum {string} */
const AlarmType = {
    mob: 'notifications.mob',
    fire: 'notifications.fire',
    sinking: 'notifications.sinking',
    flodding: 'notifications.flooding',
    collision: 'notifications.collision',
    grounding: 'notifications.grounding',
    listing: 'notifications.listing',
    adrift: 'notifications.adrift',
    piracy: 'notifications.piracy',
    abandon: 'notifications.abandon',
};

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
        this._source = null;
        this._connect = new Subject();
        this.onConnect = this._connect.asObservable();
        this._close = new Subject();
        this.onClose = this._close.asObservable();
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
        this.onMessage = this._message.asObservable();
    }
    // ** set source label for use in messages
    /**
     * @param {?} val
     * @return {?}
     */
    set source(val) {
        if (!this._source) {
            this._source = {};
        }
        this._source['label'] = val;
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
        this.ws.onmessage = e => { this.parseOnMessage(e); };
    }
    // ** parse received message
    /**
     * @param {?} e
     * @return {?}
     */
    parseOnMessage(e) {
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
        /** @type {?} */
        let u = {
            timestamp: new Date().toISOString(),
            values: uValues
        };
        if (this._source) {
            u['source'] = this._source;
        }
        val.updates.push(u);
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
    /**
     * @param {?=} context
     * @param {?=} alarmId
     * @param {?=} alarm
     * @return {?}
     */
    raiseAlarm(context = '*', alarmId, alarm) {
        /** @type {?} */
        let n;
        if (typeof alarmId === 'string') {
            n = (alarmId.indexOf('notifications.') == -1) ? `notifications.${alarmId}` : alarmId;
        }
        else {
            n = alarmId;
        }
        this.sendUpdate(context, n, alarm.value);
    }
    // ** raise alarm for path
    /**
     * @param {?=} context
     * @param {?=} name
     * @return {?}
     */
    clearAlarm(context = '*', name) {
        /** @type {?} */
        let n = (name.indexOf('notifications.') == -1) ? `notifications.${name}` : name;
        this.sendUpdate(context, n, null);
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

export { SignalKClientModule, SignalKClient, Path, Message, Alarm, AlarmState, AlarmMethod, AlarmType, SignalKHttp as ɵa, SignalKStream as ɵb, SignalKStreamWorker as ɵc, UUID as ɵd };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXVpZC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXRpbHMudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL2h0dHAtYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0tYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0td29ya2VyLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zaWduYWxrLWNsaWVudC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIFVVSUQ6IEEganMgbGlicmFyeSB0byBnZW5lcmF0ZSBhbmQgcGFyc2UgVVVJRHMsIFRpbWVVVUlEcyBhbmQgZ2VuZXJhdGVcclxuICogVGltZVVVSUQgYmFzZWQgb24gZGF0ZXMgZm9yIHJhbmdlIHNlbGVjdGlvbnMuXHJcbiAqIEBzZWUgaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcclxuICoqL1xyXG5leHBvcnQgY2xhc3MgVVVJRCB7XHJcblxyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTA4O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNDtcclxuICAgIHByaXZhdGUgbGltaXRVSTE2O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMzI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0MDtcclxuICAgIHByaXZhdGUgbGltaXRVSTQ4O1xyXG5cclxuICAgIHByaXZhdGUgdmVyc2lvbjpudW1iZXI7XHJcbiAgICBwcml2YXRlIGhleDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDQgPSB0aGlzLm1heEZyb21CaXRzKDQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA2ID0gdGhpcy5tYXhGcm9tQml0cyg2KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwOCA9IHRoaXMubWF4RnJvbUJpdHMoOCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTIgPSB0aGlzLm1heEZyb21CaXRzKDEyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNCA9IHRoaXMubWF4RnJvbUJpdHMoMTQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTE2ID0gdGhpcy5tYXhGcm9tQml0cygxNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMzIgPSB0aGlzLm1heEZyb21CaXRzKDMyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0MCA9IHRoaXMubWF4RnJvbUJpdHMoNDApO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTQ4ID0gdGhpcy5tYXhGcm9tQml0cyg0OCk7IFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gdGhpcy5oZXggfVxyXG4gICAgdG9VUk4oKSB7IHJldHVybiAndXJuOnV1aWQ6JyArIHRoaXMuaGV4IH1cclxuICAgIHRvU2lnbmFsSygpOnN0cmluZyAgeyByZXR1cm4gYHVybjptcm46c2lnbmFsazp1dWlkOiR7dGhpcy5oZXh9YCB9XHJcbiAgICB0b0J5dGVzKCkge1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IHRoaXMuaGV4LnNwbGl0KCctJyk7XHJcbiAgICAgICAgbGV0IGludHMgPSBbXTtcclxuICAgICAgICBsZXQgaW50UG9zID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydHNbaV0ubGVuZ3RoOyBqKz0yKSB7XHJcbiAgICAgICAgICAgIGludHNbaW50UG9zKytdID0gcGFyc2VJbnQocGFydHNbaV0uc3Vic3RyKGosIDIpLCAxNik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludHM7XHJcbiAgICB9OyAgICBcclxuXHJcbiAgICBwcml2YXRlIG1heEZyb21CaXRzKGJpdHMpIHsgcmV0dXJuIE1hdGgucG93KDIsIGJpdHMpIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSYW5kb21JbnQobWluLCBtYXgpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4gfVxyXG5cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA2LTEpO31cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwOCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA4LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTEyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE2LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkzMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTMyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0MCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0MCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTQ4KCkgeyByZXR1cm4gKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgMzApKSArICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDQ4IC0gMzApKSAqICgxIDw8IDMwKSB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5mcm9tUGFydHMoXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkzMigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMTYoKSxcclxuICAgICAgICAgICAgMHg0MDAwIHwgdGhpcy5yYW5kb21VSTEyKCksXHJcbiAgICAgICAgICAgIDB4ODAgICB8IHRoaXMucmFuZG9tVUkwNigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMDgoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTQ4KClcclxuICAgICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHBhZGRlZFN0cmluZyhzdHJpbmcsIGxlbmd0aCwgej1udWxsKSB7XHJcbiAgICAgICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XHJcbiAgICAgICAgeiA9ICgheikgPyAnMCcgOiB6O1xyXG4gICAgICAgIGxldCBpID0gbGVuZ3RoIC0gc3RyaW5nLmxlbmd0aDtcclxuICAgICAgICBmb3IgKDsgaSA+IDA7IGkgPj4+PSAxLCB6ICs9IHopIHtcclxuICAgICAgICAgICAgaWYgKGkgJiAxKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyA9IHogKyBzdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cmluZztcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBmcm9tUGFydHModGltZUxvdywgdGltZU1pZCwgdGltZUhpQW5kVmVyc2lvbiwgY2xvY2tTZXFIaUFuZFJlc2VydmVkLCBjbG9ja1NlcUxvdywgbm9kZSkge1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9ICh0aW1lSGlBbmRWZXJzaW9uID4+IDEyKSAmIDB4RjtcclxuICAgICAgICB0aGlzLmhleCA9IHRoaXMucGFkZGVkU3RyaW5nKHRpbWVMb3cudG9TdHJpbmcoMTYpLCA4KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVNaWQudG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVIaUFuZFZlcnNpb24udG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxSGlBbmRSZXNlcnZlZC50b1N0cmluZygxNiksIDIpXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcoY2xvY2tTZXFMb3cudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKG5vZGUudG9TdHJpbmcoMTYpLCAxMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9OyAgICBcclxuICAgIFxyXG4gICAgLypcclxuICAgIHByaXZhdGUgZ2V0VGltZUZpZWxkVmFsdWVzKHRpbWUpIHtcclxuICAgICAgICBsZXQgdHMgPSB0aW1lIC0gRGF0ZS5VVEMoMTU4MiwgOSwgMTUpO1xyXG4gICAgICAgIGxldCBobSA9ICgodHMgLyAweDEwMDAwMDAwMCkgKiAxMDAwMCkgJiAweEZGRkZGRkY7XHJcbiAgICAgICAgcmV0dXJuIHsgbG93OiAoKHRzICYgMHhGRkZGRkZGKSAqIDEwMDAwKSAlIDB4MTAwMDAwMDAwLFxyXG4gICAgICAgICAgICAgICAgbWlkOiBobSAmIDB4RkZGRiwgaGk6IGhtID4+PiAxNiwgdGltZXN0YW1wOiB0cyB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tVGltZSh0aW1lLCBsYXN0OmJvb2xlYW4pIHtcclxuICAgICAgICBsYXN0ID0gKCFsYXN0KSA/IGZhbHNlIDogbGFzdDtcclxuICAgICAgICBsZXQgdGYgPSB0aGlzLmdldFRpbWVGaWVsZFZhbHVlcyh0aW1lKTtcclxuICAgICAgICBsZXQgdGwgPSB0Zi5sb3c7XHJcbiAgICAgICAgbGV0IHRoYXYgPSAodGYuaGkgJiAweEZGRikgfCAweDEwMDA7ICAvLyBzZXQgdmVyc2lvbiAnMDAwMSdcclxuICAgICAgICBpZiAobGFzdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVVUlEKCkuZnJvbVBhcnRzKHRsLCB0Zi5taWQsIHRoYXYsIDAsIDAsIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRCgpLmZyb21QYXJ0cyh0bCwgdGYubWlkLCB0aGF2LCAweDgwIHwgdGhpcy5saW1pdFVJMDYsIHRoaXMubGltaXRVSTA4IC0gMSwgdGhpcy5saW1pdFVJNDggLSAxKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZpcnN0RnJvbVRpbWUodGltZSkgeyByZXR1cm4gdGhpcy5mcm9tVGltZSh0aW1lLCBmYWxzZSkgfVxyXG4gICAgbGFzdEZyb21UaW1lKHRpbWUpIHsgcmV0dXJuIHRoaXMuZnJvbVRpbWUodGltZSwgdHJ1ZSkgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIGVxdWFscyh1dWlkKSB7XHJcbiAgICAgICAgaWYgKCEodXVpZCBpbnN0YW5jZW9mIFVVSUQpKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGV4ICE9PSB1dWlkLmhleCkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tVVJOKHN0cklkKSB7XHJcbiAgICAgICAgbGV0IHI7XHJcbiAgICAgICAgbGV0IHAgPSAvXig/OnVybjp1dWlkOnxcXHspPyhbMC05YS1mXXs4fSktKFswLTlhLWZdezR9KS0oWzAtOWEtZl17NH0pLShbMC05YS1mXXsyfSkoWzAtOWEtZl17Mn0pLShbMC05YS1mXXsxMn0pKD86XFx9KT8kL2k7XHJcbiAgICAgICAgaWYgKChyID0gcC5leGVjKHN0cklkKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnJvbVBhcnRzKFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoclsxXSwgMTYpLCBwYXJzZUludChyWzJdLCAxNiksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzNdLCAxNiksIHBhcnNlSW50KHJbNF0sIDE2KSxcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbNV0sIDE2KSwgcGFyc2VJbnQocls2XSwgMTYpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZyb21CeXRlcyhpbnRzKSB7XHJcbiAgICAgICAgaWYgKGludHMubGVuZ3RoIDwgNSkgeyByZXR1cm4gbnVsbCB9XHJcbiAgICAgICAgbGV0IHN0ciA9ICcnO1xyXG4gICAgICAgIGxldCBwb3MgPSAwO1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IFs0LCAyLCAyLCAyLCA2XTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydHNbaV07IGorKykge1xyXG4gICAgICAgICAgICBsZXQgb2N0ZXQgPSBpbnRzW3BvcysrXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIGlmIChvY3RldC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgb2N0ZXQgPSAnMCcgKyBvY3RldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHIgKz0gb2N0ZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhcnRzW2ldICE9PSA2KSB7XHJcbiAgICAgICAgICAgIHN0ciArPSAnLSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbVVSTihzdHIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tQmluYXJ5KGJpbmFyeSkge1xyXG4gICAgICAgIGxldCBpbnRzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaW50c1tpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBpZiAoaW50c1tpXSA+IDI1NSB8fCBpbnRzW2ldIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgYnl0ZSBpbiBiaW5hcnkgZGF0YS4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9tQnl0ZXMoaW50cyk7XHJcbiAgICB9O1xyXG4gICAgKi9cclxuXHJcbn07IiwiaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XHJcblxyXG4vLyAqKiBQYXRoIHV0aWxpdGllc1xyXG5leHBvcnQgY2xhc3MgUGF0aCB7XHJcblxyXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxyXG4gICAgc3RhdGljIGRvdFRvU2xhc2gocGF0aDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgaWYocGF0aC5pbmRleE9mKCcuJykhPS0xKSB7IHJldHVybiBwYXRoLnNwbGl0KCcuJykuam9pbignLycpIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHBhdGggfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHBhcnNlIGNvbnRleHQgdG8gdmFsaWQgU2lnbmFsIEsgcGF0aFxyXG4gICAgc3RhdGljIGNvbnRleHRUb1BhdGgoY29udGV4dDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJlcz0gKGNvbnRleHQ9PSdzZWxmJyApID8gJ3Zlc3NlbHMuc2VsZic6IGNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zcGxpdCgnLicpLmpvaW4oJy8nKTtcclxuICAgIH0gICAgXHJcblxyXG59XHJcblxyXG4vLyAqKiBNZXNzYWdlIHRlbXBsYXRlcyAqKlxyXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XHJcbiAgIFxyXG4gICAgLy8gKiogcmV0dXJuIFVQREFURVMgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1cGRhdGVzKCkgeyBcclxuICAgICAgICAvLyBhcnJheSB2YWx1ZXM9IHsgdmFsdWVzOiBbIHtwYXRoOiB4eCwgdmFsdWU6IHh4IH0gXSB9XHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVwZGF0ZXM6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vICoqIHJldHVybiBTVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyBzdWJzY3JpYmUoKSB7IFxyXG4gICAgICAgIC8qIGFycmF5IHZhbHVlcz0ge1xyXG4gICAgICAgICAgICBcInBhdGhcIjogXCJwYXRoLnRvLmtleVwiLFxyXG4gICAgICAgICAgICBcInBlcmlvZFwiOiAxMDAwLFxyXG4gICAgICAgICAgICBcImZvcm1hdFwiOiBcImRlbHRhXCIsXHJcbiAgICAgICAgICAgIFwicG9saWN5XCI6IFwiaWRlYWxcIixcclxuICAgICAgICAgICAgXCJtaW5QZXJpb2RcIjogMjAwXHJcbiAgICAgICAgICAgIH0gKi9cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgc3Vic2NyaWJlOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9ICAgIFxyXG4gICAgLy8gKiogcmV0dXJuIFVOU1VCU0NSSUJFIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgdW5zdWJzY3JpYmUoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyBcInBhdGhcIjogXCJwYXRoLnRvLmtleVwiIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdW5zdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gIFxyXG4gICAgLy8gKiogcmV0dXJuIFJFUVVFU1QgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyByZXF1ZXN0KCkgeyBcclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgcmVxdWVzdElkOiBuZXcgVVVJRCgpLnRvU3RyaW5nKClcclxuICAgICAgICB9XHJcbiAgICB9ICAgICAgICAgICBcclxuXHJcbn1cclxuXHJcbi8vICoqIEFsYXJtIG1lc3NhZ2UgKipcclxuZXhwb3J0IGNsYXNzIEFsYXJtIHtcclxuXHJcbiAgICBwcml2YXRlIF9zdGF0ZTpBbGFybVN0YXRlO1xyXG4gICAgcHJpdmF0ZSBfbWV0aG9kOkFycmF5PEFsYXJtTWV0aG9kPj0gW107XHJcbiAgICBwcml2YXRlIF9tZXNzYWdlOnN0cmluZz0nJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOnN0cmluZywgc3RhdGU/OkFsYXJtU3RhdGUsIHZpc3VhbD86Ym9vbGVhbiwgc291bmQ/OmJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSAodHlwZW9mIG1lc3NhZ2UhPT0gJ3VuZGVmaW5lZCcpID8gbWVzc2FnZSA6ICcnO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlPSAodHlwZW9mIHN0YXRlIT09ICd1bmRlZmluZWQnKSA/IHN0YXRlIDogQWxhcm1TdGF0ZS5hbGFybTtcclxuICAgICAgICBpZih2aXN1YWwpIHsgdGhpcy5fbWV0aG9kLnB1c2goQWxhcm1NZXRob2QudmlzdWFsKX07XHJcbiAgICAgICAgaWYoc291bmQpIHsgdGhpcy5fbWV0aG9kLnB1c2goQWxhcm1NZXRob2Quc291bmQpfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmFsdWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5fbWVzc2FnZSxcclxuICAgICAgICAgICAgc3RhdGU6IHRoaXMuX3N0YXRlLFxyXG4gICAgICAgICAgICBtZXRob2Q6IHRoaXMuX21ldGhvZFxyXG4gICAgICAgIH1cclxuICAgIH0gIFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBBbGFybVN0YXRlIHtcclxuICAgIG5vcm1hbD0gJ25vcm1hbCcsXHJcbiAgICBhbGVydD0gJ2FsZXJ0JyxcclxuICAgIHdhcm49ICd3YXJuJyxcclxuICAgIGFsYXJtPSAnYWxhcm0nLFxyXG4gICAgZW1lcmdlbmN5PSAnZW1lcmdlbmN5J1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gQWxhcm1NZXRob2Qge1xyXG4gICAgdmlzdWFsPSAndmlzdWFsJyxcclxuICAgIHNvdW5kPSAnc291bmQnXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBBbGFybVR5cGUge1xyXG4gICAgbW9iPSAnbm90aWZpY2F0aW9ucy5tb2InLFxyXG4gICAgZmlyZT0gJ25vdGlmaWNhdGlvbnMuZmlyZScsXHJcbiAgICBzaW5raW5nPSAnbm90aWZpY2F0aW9ucy5zaW5raW5nJyxcclxuICAgIGZsb2RkaW5nPSAnbm90aWZpY2F0aW9ucy5mbG9vZGluZycsXHJcbiAgICBjb2xsaXNpb249ICdub3RpZmljYXRpb25zLmNvbGxpc2lvbicsXHJcbiAgICBncm91bmRpbmc9ICdub3RpZmljYXRpb25zLmdyb3VuZGluZycsXHJcbiAgICBsaXN0aW5nPSAnbm90aWZpY2F0aW9ucy5saXN0aW5nJyxcclxuICAgIGFkcmlmdD0gJ25vdGlmaWNhdGlvbnMuYWRyaWZ0JyxcclxuICAgIHBpcmFjeT0gJ25vdGlmaWNhdGlvbnMucGlyYWN5JyxcclxuICAgIGFiYW5kb249ICdub3RpZmljYXRpb25zLmFiYW5kb24nXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFBhdGggfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLSHR0cCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZztcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IHRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyB9ICAgXHJcbiAgICBcclxuICAgIC8vICoqIGdldCB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuZ2V0KGB2ZXNzZWxzL3NlbGZgKSB9XHJcblxyXG4gICAgLy8qKiBnZXQgSUQgb2YgdmVzc2VsIHNlbGYgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmdldChgc2VsZmApIH1cclxuXHJcbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXHJcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoYCR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICAvLyoqIGdldCBBUEkgcGF0aCB2YWx1ZSB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldChwYXRoOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyoqIHNlbmQgdmFsdWUgdG8gQVBJIHBhdGggdmlhIGh0dHAgcHV0LiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KTtcclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleT86YW55LCB2YWx1ZT86YW55KSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCkgKyAnLycgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlPT0ndW5kZWZpbmVkJykgeyBtc2cudmFsdWU9IGtleSB9XHJcblx0XHRlbHNlIHsgbXNnLnZhbHVlW2tleV09IHZhbHVlIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKSB9XHJcbiAgICB9IFxyXG5cclxufSIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlLCBBbGFybSwgQWxhcm1UeXBlIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbSB7XHJcblxyXG5cdHByaXZhdGUgX2Nvbm5lY3Q6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX2Nsb3NlOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX21lc3NhZ2U6IFN1YmplY3Q8YW55PjtcclxuXHJcbiAgICBwcml2YXRlIHdzOiBhbnk7ICAgIFxyXG4gICAgcHJpdmF0ZSBfZmlsdGVyPSBudWxsOyAgICAgICAgICAgICAgIC8vICoqIGlkIG9mIHZlc3NlbCB0byBmaWx0ZXIgZGVsdGEgbWVzc2FnZXNcclxuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0ICBcclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICBcclxuICAgIHByaXZhdGUgX3BsYXliYWNrTW9kZTogYm9vbGVhbj0gZmFsc2U7XHJcbiAgICBcclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIHB1YmxpYyBvbkNvbm5lY3Q6IE9ic2VydmFibGU8YW55PjtcdFx0XHJcbiAgICBwdWJsaWMgb25DbG9zZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgcHVibGljIHNlbGZJZDogc3RyaW5nO1xyXG4gICAgcHVibGljIF9zb3VyY2U6IGFueT0gbnVsbDtcclxuXHJcbiAgICAvLyAqKiBzZXQgc291cmNlIGxhYmVsIGZvciB1c2UgaW4gbWVzc2FnZXNcclxuICAgIHNldCBzb3VyY2UodmFsOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5fc291cmNlKSB7IHRoaXMuX3NvdXJjZT0ge30gfVxyXG4gICAgICAgIHRoaXMuX3NvdXJjZVsnbGFiZWwnXT0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXHJcbiAgICBzZXQgdG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH0gICAgXHJcbiAgICAvLyAqKiBnZXQgLyBzZXQgd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAzMDAwPD10aW1lb3V0PD02MDAwMCAqKlxyXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XHJcbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3dzVGltZW91dD0gKHZhbDwzMDAwKSA/IDMwMDAgOiAodmFsPjYwMDAwKSA/IDYwMDAwIDogdmFsO1xyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogaXMgV1MgU3RyZWFtIGNvbm5lY3RlZD9cclxuICAgIGdldCBpc09wZW4oKTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfSAgXHJcbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcclxuICAgIGdldCBmaWx0ZXIoKTpzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmlsdGVyIH1cclxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXHJcbiAgICBzZXQgZmlsdGVyKGlkOnN0cmluZykgeyBcclxuICAgICAgICBpZiggaWQgJiYgaWQuaW5kZXhPZignc2VsZicpIT0tMSApIHsgIC8vICoqIHNlbGZcclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPSAodGhpcy5zZWxmSWQpID8gdGhpcy5zZWxmSWQgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSBpZCB9XHJcbiAgICB9ICAgXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgUGxheWJhY2sgSGVsbG8gbWVzc2FnZVxyXG4gICAgZ2V0IHBsYXliYWNrTW9kZSgpOmJvb2xlYW4geyByZXR1cm4gdGhpcy5fcGxheWJhY2tNb2RlIH1cclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggKSB7IFxyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ29ubmVjdD0gdGhpcy5fY29ubmVjdC5hc09ic2VydmFibGUoKTsgICBcclxuICAgICAgICB0aGlzLl9jbG9zZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgICAgICAgXHJcbiAgICB9ICAgXHJcblxyXG4gICAgLy8gKiogQ2xvc2UgV2ViU29ja2V0IGNvbm5lY3Rpb25cclxuICAgIGNsb3NlKCkgeyBpZih0aGlzLndzKSB7IHRoaXMud3MuY2xvc2UoKTsgdGhpcy53cz0gbnVsbDsgfSB9XHJcbiAgIFxyXG5cdC8vICoqIE9wZW4gYSBXZWJTb2NrZXQgYXQgcHJvdmlkZWQgdXJsXHJcblx0b3Blbih1cmw6c3RyaW5nLCBzdWJzY3JpYmU/OnN0cmluZywgdG9rZW4/OnN0cmluZykge1xyXG4gICAgICAgIHVybD0gKHVybCkgPyB1cmwgOiB0aGlzLmVuZHBvaW50O1xyXG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cclxuICAgICAgICBsZXQgcT0gKHVybC5pbmRleE9mKCc/Jyk9PS0xKSA/ICc/JyA6ICcmJ1xyXG4gICAgICAgIGlmKHN1YnNjcmliZSkgeyB1cmwrPWAke3F9c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWAgfSBcclxuICAgICAgICBpZih0aGlzLl90b2tlbiB8fCB0b2tlbikgeyB1cmwrPSBgJHsoc3Vic2NyaWJlKSA/ICcmJyA6ICc/J310b2tlbj0ke3RoaXMuX3Rva2VuIHx8IHRva2VufWAgfSBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcclxuICAgICAgICAvLyAqKiBzdGFydCBjb25uZWN0aW9uIHdhdGNoZG9nICoqXHJcbiAgICAgICAgc2V0VGltZW91dCggXHJcbiAgICAgICAgICAgICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb25uZWN0aW9uIHdhdGNoZG9nIGV4cGlyZWQgKCR7dGhpcy5fd3NUaW1lb3V0LzEwMDB9IHNlYyk6ICR7dGhpcy53cy5yZWFkeVN0YXRlfS4uLiBhYm9ydGluZyBjb25uZWN0aW9uLi4uYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5fd3NUaW1lb3V0XHJcbiAgICAgICAgKTtcclxuXHRcdFxyXG5cdFx0dGhpcy53cy5vbm9wZW49IGU9PiB7IHRoaXMuX2Nvbm5lY3QubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9uY2xvc2U9IGU9PiB7IHRoaXMuX2Nsb3NlLm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25tZXNzYWdlPSBlPT4ge3RoaXMucGFyc2VPbk1lc3NhZ2UoZSkgfVxyXG4gICAgfSAgXHJcbiAgICBcclxuICAgIC8vICoqIHBhcnNlIHJlY2VpdmVkIG1lc3NhZ2VcclxuICAgIHBhcnNlT25NZXNzYWdlKGUpIHtcclxuICAgICAgICBsZXQgZGF0YTogYW55O1xyXG4gICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7IFxyXG4gICAgICAgICAgICB0aGlzLnNlbGZJZD0gZGF0YS5zZWxmO1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFja01vZGU9ICh0eXBlb2YgZGF0YS5zdGFydFRpbWUhPSAndW5kZWZpbmVkJykgPyB0cnVlIDogZmFsc2U7ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpO1xyXG4gICAgICAgIH0gICAgICAgICAgXHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuY29udGV4dD09IHRoaXMuX2ZpbHRlcikgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXHJcbiAgICBzZW5kKGRhdGE6YW55KSB7XHJcbiAgICAgICAgaWYodGhpcy53cykge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgdmFsdWUocykgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOiBzdHJpbmcgfCBBcnJheTxhbnk+LCB2YWx1ZT86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51cGRhdGVzKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBsZXQgdVZhbHVlcz0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXMucHVzaCh7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXM9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1PSB7IFxyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgXHJcbiAgICAgICAgICAgIHZhbHVlczogdVZhbHVlcyBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc291cmNlKSB7IHVbJ3NvdXJjZSddPSB0aGlzLl9zb3VyY2UgfVxyXG4gICAgICAgIHZhbC51cGRhdGVzLnB1c2goIHUgKTsgXHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogU3Vic2NyaWJlIHRvIERlbHRhIHN0cmVhbSBtZXNzYWdlcyBvcHRpb25zOiB7Li59KipcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZywgcGF0aDpBcnJheTxhbnk+KTtcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIG9wdGlvbnM/OmFueSk7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZyB8IEFycmF5PGFueT49JyonLCBvcHRpb25zPzphbnkpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnN1YnNjcmliZSgpO1xyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnN1YnNjcmliZT0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxldCBzVmFsdWU9IHt9O1xyXG4gICAgICAgICAgICBzVmFsdWVbJ3BhdGgnXT0gcGF0aDtcclxuICAgICAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BlcmlvZCddKSB7IHNWYWx1ZVsncGVyaW9kJ109IG9wdGlvbnNbJ3BlcmlvZCddIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ21pblBlcmlvZCddKSB7IHNWYWx1ZVsnbWluUGVyaW9kJ109IG9wdGlvbnNbJ3BlcmlvZCddIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ2Zvcm1hdCddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydmb3JtYXQnXT09J2RlbHRhJyB8fCBvcHRpb25zWydmb3JtYXQnXT09J2Z1bGwnKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNWYWx1ZVsnZm9ybWF0J109IG9wdGlvbnNbJ2Zvcm1hdCddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1sncG9saWN5J10gJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnNbJ3BvbGljeSddPT0naW5zdGFudCcgfHwgb3B0aW9uc1sncG9saWN5J109PSdpZGVhbCdcclxuICAgICAgICAgICAgICAgICAgICB8fCBvcHRpb25zWydwb2xpY3knXT09J2ZpeGVkJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ3BvbGljeSddPSBvcHRpb25zWydwb2xpY3knXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWwuc3Vic2NyaWJlLnB1c2goc1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBVbnN1YnNjcmliZSBmcm9tIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxyXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOmFueT0nKicpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICB2YWwudW5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykgeyB2YWwudW5zdWJzY3JpYmUucHVzaCh7cGF0aDogcGF0aH0pIH1cclxuICAgICAgICB0aGlzLnNlbmQodmFsKTsgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcmFpc2UgYWxhcm0gZm9yIHBhdGhcclxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmcsIG5hbWU6c3RyaW5nLCBhbGFybTpBbGFybSk7XHJcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nLCB0eXBlOkFsYXJtVHlwZSwgYWxhcm06QWxhcm0pO1xyXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZz0nKicsIGFsYXJtSWQ6YW55LCBhbGFybTpBbGFybSkge1xyXG4gICAgICAgIGxldCBuOnN0cmluZztcclxuICAgICAgICBpZih0eXBlb2YgYWxhcm1JZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbj0oYWxhcm1JZC5pbmRleE9mKCdub3RpZmljYXRpb25zLicpPT0tMSkgPyBgbm90aWZpY2F0aW9ucy4ke2FsYXJtSWR9YCA6IGFsYXJtSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyBuPSBhbGFybUlkIH1cclxuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgbiwgYWxhcm0udmFsdWUgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiByYWlzZSBhbGFybSBmb3IgcGF0aFxyXG4gICAgY2xlYXJBbGFybShjb250ZXh0OnN0cmluZz0nKicsIG5hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IG49KG5hbWUuaW5kZXhPZignbm90aWZpY2F0aW9ucy4nKT09LTEpID8gYG5vdGlmaWNhdGlvbnMuJHtuYW1lfWAgOiBuYW1lO1xyXG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBuLCBudWxsKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqIE1FU1NBR0UgUEFSU0lORyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGNvbnRleHQgaXMgJ3NlbGYnXHJcbiAgICBpc1NlbGYobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiAobXNnLmNvbnRleHQ9PSB0aGlzLnNlbGZJZCkgfVxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXHJcbiAgICBpc0RlbHRhKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5jb250ZXh0IT0gJ3VuZGVmaW5lZCcgfVxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSBIZWxsbyBtZXNzYWdlXHJcbiAgICBpc0hlbGxvKG1zZzphbnkpOmJvb2xlYW4geyBcclxuICAgICAgICByZXR1cm4gKHR5cGVvZiBtc2cudmVyc2lvbiE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc2cuc2VsZiE9ICd1bmRlZmluZWQnKTtcclxuICAgIH0gICAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSByZXF1ZXN0IFJlc3BvbnNlIG1lc3NhZ2VcclxuICAgIGlzUmVzcG9uc2UobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiB0eXBlb2YgbXNnLnJlcXVlc3RJZCE9ICd1bmRlZmluZWQnIH0gXHJcbn0iLCIvKiogV2ViIFdvcmtlciBTZXJ2aWNlXHJcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbVdvcmtlciAge1xyXG5cclxuXHRwcml2YXRlIF9lcnJvcjogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX21lc3NhZ2U6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgd29ya2VyOiBXb3JrZXI7XHJcbiAgICBcclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG5cclxuICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICB9IFxyXG5cclxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTsgdGhpcy53b3JrZXIgPSB1bmRlZmluZWQ7IH1cclxuXHJcbiAgICAvLyAqKiBJbml0aWFsaXNlIHdvcmtlclxyXG4gICAgaW5pdChwYXRoVG9GaWxlOnN0cmluZykgeyBcclxuICAgICAgICBpZih0eXBlb2YoV29ya2VyKT09IFwidW5kZWZpbmVkXCIpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICBpZih0aGlzLndvcmtlcikgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKSB9ICAgLy8gKiogdGVybWluYXRlIGFuIG9wZW4gd29ya2VyXHJcblxyXG4gICAgICAgIHRoaXMud29ya2VyPSBuZXcgV29ya2VyKHBhdGhUb0ZpbGUpO1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9ubWVzc2FnZT0gZXZlbnQ9PiB7IHRoaXMuX21lc3NhZ2UubmV4dChldmVudCkgfTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbmVycm9yPSBldmVudD0+IHsgdGhpcy5fZXJyb3IubmV4dChldmVudCkgfTsgICAgICAgICAgIFxyXG4gICAgICAgIC8vICoqIHdvcmtlciByZWFkeSBmb3IgcG9zdE1lc3NhZ2UoKVxyXG4gICAgfSAgICBcclxuICAgIFxyXG4gICAgLy8gKiogU2VuZCBtZXNzYWdlIHRvIHdvcmtlclxyXG4gICAgcG9zdE1lc3NhZ2UobXNnOmFueSkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnBvc3RNZXNzYWdlKG1zZykgfSB9XHJcblxyXG4gICAgLy8gKiogdGVybWluYXRlIHdvcmtlclxyXG4gICAgdGVybWluYXRlKCkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnRlcm1pbmF0ZSgpfSB9XHJcbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBTaWduYWxLSHR0cCB9IGZyb20gJy4vaHR0cC1hcGknO1xuaW1wb3J0IHsgU2lnbmFsS1N0cmVhbSB9IGZyb20gJy4vc3RyZWFtLWFwaSc7XG5pbXBvcnQgeyBQYXRoLCBNZXNzYWdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtV29ya2VyfSBmcm9tICcuL3N0cmVhbS13b3JrZXInO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudCB7XG4gICAgXG4gICAgcHJpdmF0ZSBob3N0bmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICAgIHByaXZhdGUgcHJvdG9jb2w6IHN0cmluZztcbiAgXG4gICAgcHJpdmF0ZSBfdmVyc2lvbjogc3RyaW5nPSAndjEnOyAgICAgIC8vICoqIGRlZmF1bHQgU2lnbmFsIEsgYXBpIHZlcnNpb25cbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nOyAgICAgICAgICAgICAvLyB0b2tlbiBmb3Igd2hlbiBzZWN1cml0eSBpcyBlbmFibGVkIG9uIHRoZSBzZXJ2ZXJcblxuICAgIHByaXZhdGUgZGVidWcodmFsOiBhbnkpIHsgaWYoaXNEZXZNb2RlKCkpeyBjb25zb2xlLmxvZyh2YWwpIH0gfVxuICAgIFxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgIC8vICoqIHNlcnZlciBpbmZvcm1hdGlvbiBibG9jayAqKlxuICAgIHB1YmxpYyBzZXJ2ZXI9IHtcbiAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgaW5mbzoge30sXG4gICAgICAgIGFwaVZlcnNpb25zOiBbXVxuICAgIH0gICAgXG4gICAgLy8gKiogZ2V0IC8gc2V0IFNpZ25hbCBLIHByZWZlcnJlZCBhcGkgdmVyc2lvbiB0byB1c2UgKipcbiAgICBnZXQgdmVyc2lvbigpOm51bWJlciB7IHJldHVybiBwYXJzZUludCggdGhpcy5fdmVyc2lvbi5zbGljZSgxKSApIH1cbiAgICBzZXQgdmVyc2lvbih2YWw6IG51bWJlcikge1xuICAgICAgICBsZXQgdjpzdHJpbmc9ICd2JysgdmFsO1xuICAgICAgICBpZih0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5sZW5ndGg9PTApIHsgXG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSB2O1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgU2lnbmFsIEsgYXBpIHZlcnNpb24gc2V0IHRvOiAke3Z9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJzaW9uPSAodGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnMuaW5kZXhPZih2KSE9LTEpID8gdiA6IHRoaXMuX3ZlcnNpb247XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgcmVxdWVzdDogJHt2fSwgcmVzdWx0OiAke3RoaXMuX3ZlcnNpb259YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgXG4gICAgICAgIHRoaXMuX3Rva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuYXBpLnRva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuc3RyZWFtLnRva2VuPSB2YWw7XG4gICAgfSAgICBcbiAgICAvLyAqKiBNZXNzYWdlIE9iamVjdFxuICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gTWVzc2FnZSB9XG5cbiAgICAvLyAqKiBnZW5lcmF0ZSBhbmQgcmV0dXJuIGEgVVVJRCBvYmplY3RcbiAgICBnZXQgdXVpZCgpOlVVSUQgeyByZXR1cm4gbmV3IFVVSUQoKSB9XG5cbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgXG4gICAgICAgICAgICAgICAgcHVibGljIGFwaTogU2lnbmFsS0h0dHAsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzdHJlYW06IFNpZ25hbEtTdHJlYW0sXG4gICAgICAgICAgICAgICAgcHVibGljIHdvcmtlcjogU2lnbmFsS1N0cmVhbVdvcmtlciApIHsgXG4gICAgICAgIHRoaXMuaW5pdCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfSAgIFxuICAgIFxuICAgIC8vICoqIGluaXRpYWxpc2UgcHJvdG9jb2wsIGhvc3RuYW1lLCBwb3J0IHZhbHVlc1xuICAgIHByaXZhdGUgaW5pdChob3N0bmFtZTpzdHJpbmc9J2xvY2FsaG9zdCcsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlKSB7XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICAgICAgaWYodXNlU1NMKSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHBzJztcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgNDQzO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdG9jb2wgPSAnaHR0cCc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDgwO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9ICAgIFxuXG4gICAgLy8gKioqKioqKioqKioqKioqKiBDT05ORUNUSU9OIEFORCBESVNDT1ZFUlkgICoqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyAqKiBTaWduYWwgSyBzZXJ2ZXIgZW5kcG9pbnQgZGlzY292ZXJ5IHJlcXVlc3QgKC9zaWduYWxrKS4gIFxuICAgIGhlbGxvKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmluaXQoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnL3NpZ25hbGsnKTtcbiAgICB9ICAgIFxuICAgIC8vICoqIGNvbm5lY3QgdG8gc2VydmVyIChlbmRwb2ludCBkaXNjb3ZlcnkpIGFuZCBETyBOT1Qgb3BlbiBTdHJlYW1cbiAgICBjb25uZWN0KGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdDb250YWN0aW5nIFNpZ25hbCBLIHNlcnZlci4uLi4uLi4uLicpO1xuICAgICAgICAgICAgdGhpcy5oZWxsbyhob3N0bmFtZSwgcG9ydCwgdXNlU1NMKS5zdWJzY3JpYmUoICAgIC8vICoqIGRpc2NvdmVyIGVuZHBvaW50cyAqKlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlPT4geyBcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdHJlYW0pIHsgdGhpcy5zdHJlYW0uY2xvc2UoKSB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0hlbGxvKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGkuZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbS5lbmRwb2ludD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWRGcm9tU2VydmVyKCk7ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICAvLyAqKiBkaXNjb25uZWN0IGZyb20gc2VydmVyXG4gICAgZGlzY29ubmVjdCgpIHsgdGhpcy5zdHJlYW0uY2xvc2UoKTsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IH1cbiAgICBcbiAgICAvLyAqKiBDb25uZWN0ICsgb3BlbiBEZWx0YSBTdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0U3RyZWFtKGhvc3RuYW1lOnN0cmluZz1udWxsLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSwgc3Vic2NyaWJlOnN0cmluZz1udWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwsIHN1YnNjcmliZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCggZT0+IHsgcmVqZWN0KCBlICkgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIGNvbm5lY3RQbGF5YmFjayhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIG9wdGlvbnM6YW55KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoaG9zdG5hbWUsIHBvcnQsIHVzZVNTTClcbiAgICAgICAgICAgIC50aGVuKCAoKT0+IHsgXG4gICAgICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBhcGkgYXQgcHJlZmVycmVkIHZlcnNpb24gZWxzZSBmYWxsIGJhY2sgdG8gZGVmYXVsdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuUGxheWJhY2sobnVsbCwgb3B0aW9ucywgdGhpcy5fdG9rZW4pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KVxuICAgIH0gICAgICBcblxuICAgIC8vICoqIGNvbm5lY3QgdG8gZGVsdGEgc3RyZWFtIHdpdGggKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuU3RyZWFtKHVybDpzdHJpbmc9bnVsbCwgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblN0cmVhbS4uLi4uLi4uLicpOyAgXG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUsIHRva2VuKTsgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICBcbiAgICB9ICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIHBsYXliYWNrIHN0cmVhbSAoTk8gZW5kcG9pbnQgZGlzY292ZXJ5KVxuICAgIG9wZW5QbGF5YmFjayh1cmw6c3RyaW5nPW51bGwsIG9wdGlvbnM/OmFueSwgdG9rZW4/OnN0cmluZykge1xuICAgICAgICB0aGlzLmRlYnVnKCdvcGVuUGxheWJhY2suLi4uLi4uLi4nKTtcbiAgICAgICAgaWYoIXVybCkgeyAgICAgLy8gY29ubmVjdCB0byBzdHJlYW0gYXBpIGF0IGRpc2NvdmVyZWQgZW5kcG9pbnRcbiAgICAgICAgICAgIHVybD0gdGhpcy5yZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTtcbiAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuKCBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgbm8gYWR2ZXJ0aXNlZCBTdHJlYW0gZW5kcG9pbnRzIScpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cmw9IHVybC5yZXBsYWNlKCdzdHJlYW0nLCAncGxheWJhY2snKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGxldCBwYj0gJyc7XG4gICAgICAgIGxldCBzdWJzY3JpYmU6IHN0cmluZztcbiAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0nb2JqZWN0Jyl7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnN0YXJ0VGltZSkgPyAnP3N0YXJ0VGltZT0nICsgb3B0aW9ucy5zdGFydFRpbWUuc2xpY2UoMCxvcHRpb25zLnN0YXJ0VGltZS5pbmRleE9mKCcuJykpICsgJ1onIDogJyc7XG4gICAgICAgICAgICBwYis9IChvcHRpb25zLnBsYXliYWNrUmF0ZSkgPyBgJnBsYXliYWNrUmF0ZT0ke29wdGlvbnMucGxheWJhY2tSYXRlfWAgOiAnJztcbiAgICAgICAgICAgIHN1YnNjcmliZT0gKG9wdGlvbnMuc3Vic2NyaWJlKSA/IG9wdGlvbnMuc3Vic2NyaWJlIDogbnVsbDsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCArIHBiLCBzdWJzY3JpYmUsIHRva2VuKTsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gICAgICBcblxuICAgIC8vICoqIHByb2Nlc3MgSGVsbG8gcmVzcG9uc2UgXG4gICAgcHJpdmF0ZSBwcm9jZXNzSGVsbG8ocmVzcG9uc2U6IGFueSkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IChyZXNwb25zZVsnZW5kcG9pbnRzJ10pID8gcmVzcG9uc2VbJ2VuZHBvaW50cyddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmluZm89IChyZXNwb25zZVsnc2VydmVyJ10pID8gcmVzcG9uc2VbJ3NlcnZlciddIDoge307XG4gICAgICAgIHRoaXMuc2VydmVyLmFwaVZlcnNpb25zPSAodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKSA/IE9iamVjdC5rZXlzKHRoaXMuc2VydmVyLmVuZHBvaW50cykgOiBbXTtcbiAgICAgICAgdGhpcy5kZWJ1Zyh0aGlzLnNlcnZlci5lbmRwb2ludHMpO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHB1dCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTsgICBcblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwgKSB9XG4gICAgfVx0ICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuXG59XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogU2lnbmFsS0NsaWVudCBNb2R1bGU6XHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbIEh0dHBDbGllbnRNb2R1bGUgXSwgICAgXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW10sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdLCBcclxuICAgIHByb3ZpZGVyczogW10gIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudE1vZHVsZSB7fVxyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9zaWduYWxrLWNsaWVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdXRpbHMnOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBS0EsTUFBYSxJQUFJO0lBZWI7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDakI7Ozs7SUFFRCxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBLEVBQUU7Ozs7SUFDOUIsS0FBSyxLQUFLLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUEsRUFBRTs7OztJQUN6QyxTQUFTLEtBQWEsT0FBTyx3QkFBd0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBLEVBQUU7Ozs7SUFDakUsT0FBTzs7WUFDQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztZQUMzQixJQUFJLEdBQUcsRUFBRTs7WUFDVCxNQUFNLEdBQUcsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7OztJQUVPLFdBQVcsQ0FBQyxJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQSxFQUFFOzs7Ozs7OztJQUU5QyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUEsRUFBRTs7Ozs7SUFFbkYsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUU7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUks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