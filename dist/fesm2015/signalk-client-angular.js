import { Injectable, ɵɵdefineInjectable, ɵɵinject, isDevMode, NgModule } from '@angular/core';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI04;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI06;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI08;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI12;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI14;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI16;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI32;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI40;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI48;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.version;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.hex;
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
}
;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// ** Path utilities
class Path {
    // ** transform dot notation to slash
    /**
     * @param {?} path
     * @return {?}
     */
    static dotToSlash(path) {
        /** @type {?} */
        let p = path.split('?');
        if (p[0].indexOf('.') != -1) {
            p[0] = p[0].split('.').join('/');
        }
        return p.join('?');
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
        ;
        if (sound) {
            this._method.push(AlarmMethod.sound);
        }
        ;
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    Alarm.prototype._state;
    /**
     * @type {?}
     * @private
     */
    Alarm.prototype._method;
    /**
     * @type {?}
     * @private
     */
    Alarm.prototype._message;
}
/** @enum {string} */
const AlarmState = {
    normal: 'normal',
    alert: 'alert',
    warn: 'warn',
    alarm: 'alarm',
    emergency: 'emergency',
};
;
/** @enum {string} */
const AlarmMethod = {
    visual: 'visual',
    sound: 'sound',
};
;
/** @enum {string} */
const AlarmType = {
    mob: 'notifications.mob',
    fire: 'notifications.fire',
    sinking: 'notifications.sinking',
    flooding: 'notifications.flooding',
    collision: 'notifications.collision',
    grounding: 'notifications.grounding',
    listing: 'notifications.listing',
    adrift: 'notifications.adrift',
    piracy: 'notifications.piracy',
    abandon: 'notifications.abandon',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    set authToken(val) { this._token = val; }
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
     * @param {?} c
     * @param {?} p
     * @param {?=} k
     * @param {?=} v
     * @return {?}
     */
    put(c, p, k, v) {
        if (!this.endpoint) {
            return;
        }
        /** @type {?} */
        let context;
        /** @type {?} */
        let path;
        /** @type {?} */
        let msg = { value: {} }
        // ** path / value
        ;
        // ** path / value
        if (typeof k == 'undefined' && typeof v == 'undefined') {
            if (c[0] == '/') {
                c = c.slice(1);
            }
            path = Path.dotToSlash(c);
            context = '';
            msg.value = p;
        }
        // ** context / path / value
        else if (typeof v == 'undefined') {
            context = (c) ? Path.contextToPath(c) : '';
            path = Path.dotToSlash(p);
            msg.value = k;
        }
        else { // ** context / path / key / value
            context = (c) ? Path.contextToPath(c) : '';
            /** @type {?} */
            let t = Path.dotToSlash(p).split('/');
            t.push(k);
            path = t.join('/');
            msg.value = v;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        // ** patch for node server PUT handling of resources
        /** @type {?} */
        let r = path.split('/');
        if (r[0] == 'resources') {
            context = '';
            if (this.server && this.server.id == 'signalk-server-node') { // ** check for node server
                // ** check for node server
                //let ver= this.server.info['version'].split('.');
                //if(ver[1]<100) { // detect older versions
                // ** re-format value { uuid: { <resource_data> }}
                /** @type {?} */
                let v = JSON.parse(JSON.stringify(msg.value));
                msg.value = {};
                msg.value[r[r.length - 1]] = v;
                // ** add self context and remove uuid from path
                path = 'vessels/self/' + r.slice(0, r.length - 1).join('/');
                //}
            }
        }
        // ****************************************
        context = (context) ? context + '/' : '';
        /** @type {?} */
        let url = this.endpoint + context + Path.dotToSlash(path);
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.put(url, msg, { headers: headers });
        }
        else {
            return this.http.put(url, msg);
        }
    }
    //** send value to API path via http POST. returns: Observable 
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    post(path, value) {
        if (!this.endpoint) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        let url = `${this.endpoint}${Path.dotToSlash(path)}`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.post(url, value, { headers: headers });
        }
        else {
            return this.http.post(url, value);
        }
    }
    //** delete value from API path via http DELETE. returns: Observable 
    /**
     * @param {?} path
     * @return {?}
     */
    delete(path) {
        if (!this.endpoint) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        let url = `${this.endpoint}${Path.dotToSlash(path)}`;
        if (this._token) {
            /** @type {?} */
            let headers = new HttpHeaders({ 'Authorization': `JWT ${this._token}` });
            return this.http.delete(url, { headers: headers });
        }
        else {
            return this.http.delete(url);
        }
    }
}
SignalKHttp.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
SignalKHttp.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ SignalKHttp.ngInjectableDef = ɵɵdefineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(ɵɵinject(HttpClient)); }, token: SignalKHttp, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    SignalKHttp.prototype._token;
    /** @type {?} */
    SignalKHttp.prototype.server;
    /** @type {?} */
    SignalKHttp.prototype.endpoint;
    /**
     * @type {?}
     * @private
     */
    SignalKHttp.prototype.http;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    set authToken(val) { this._token = val; }
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
        setTimeout((/**
         * @return {?}
         */
        () => {
            if (this.ws && (this.ws.readyState != 1 && this.ws.readyState != 3)) {
                console.warn(`Connection watchdog expired (${this._wsTimeout / 1000} sec): ${this.ws.readyState}... aborting connection...`);
                this.close();
            }
        }), this._wsTimeout);
        this.ws.onopen = (/**
         * @param {?} e
         * @return {?}
         */
        e => { this._connect.next(e); });
        this.ws.onclose = (/**
         * @param {?} e
         * @return {?}
         */
        e => { this._close.next(e); });
        this.ws.onerror = (/**
         * @param {?} e
         * @return {?}
         */
        e => { this._error.next(e); });
        this.ws.onmessage = (/**
         * @param {?} e
         * @return {?}
         */
        e => { this.parseOnMessage(e); });
    }
    // ** parse received message
    /**
     * @private
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
        else if (this.isResponse(data)) {
            if (typeof data.login !== 'undefined') {
                if (typeof data.login.token !== 'undefined') {
                    this._token = data.login.token;
                }
            }
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
    // ** send request via Delta stream
    /**
     * @param {?} value
     * @return {?}
     */
    sendRequest(value) {
        if (typeof value !== 'object') {
            return null;
        }
        /** @type {?} */
        let msg = Message.request();
        if (typeof value.login === 'undefined' && this._token) {
            msg['token'] = this._token;
        }
        /** @type {?} */
        let keys = Object.keys(value);
        keys.forEach((/**
         * @param {?} k
         * @return {?}
         */
        k => { msg[k] = value[k]; }));
        this.send(msg);
        return msg.requestId;
    }
    // ** send put request via Delta stream
    /**
     * @param {?} context
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    put(context, path, value) {
        /** @type {?} */
        let msg = {
            context: (context == 'self') ? 'vessels.self' : context,
            put: { path: path, value: value }
        };
        return this.sendRequest(msg);
    }
    // ** get auth token for supplied user details **
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    login(username, password) {
        /** @type {?} */
        let msg = {
            login: { "username": username, "password": password }
        };
        return this.sendRequest(msg);
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
        if (this._token) {
            val['token'] = this._token;
        }
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
        if (this._token) {
            val['token'] = this._token;
        }
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
        if (this._token) {
            val['token'] = this._token;
        }
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
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
SignalKStream.ctorParameters = () => [];
/** @nocollapse */ SignalKStream.ngInjectableDef = ɵɵdefineInjectable({ factory: function SignalKStream_Factory() { return new SignalKStream(); }, token: SignalKStream, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._connect;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._close;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._error;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._message;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype.ws;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._filter;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._wsTimeout;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._token;
    /**
     * @type {?}
     * @private
     */
    SignalKStream.prototype._playbackMode;
    /** @type {?} */
    SignalKStream.prototype.onConnect;
    /** @type {?} */
    SignalKStream.prototype.onClose;
    /** @type {?} */
    SignalKStream.prototype.onError;
    /** @type {?} */
    SignalKStream.prototype.onMessage;
    /** @type {?} */
    SignalKStream.prototype.endpoint;
    /** @type {?} */
    SignalKStream.prototype.selfId;
    /** @type {?} */
    SignalKStream.prototype._source;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SignalKApps {
    // *******************************************************    
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { }
    // ** return List of installed apps
    /**
     * @return {?}
     */
    list() {
        /** @type {?} */
        let ep = (this.endpoint.indexOf('webapps') == -1) ?
            `${this.endpoint}list` : this.endpoint;
        return this.http.get(ep);
    }
}
SignalKApps.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
SignalKApps.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ SignalKApps.ngInjectableDef = ɵɵdefineInjectable({ factory: function SignalKApps_Factory() { return new SignalKApps(ɵɵinject(HttpClient)); }, token: SignalKApps, providedIn: "root" });
if (false) {
    /** @type {?} */
    SignalKApps.prototype.endpoint;
    /**
     * @type {?}
     * @private
     */
    SignalKApps.prototype.http;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function IServer_Info() { }
if (false) {
    /** @type {?} */
    IServer_Info.prototype.endpoints;
    /** @type {?} */
    IServer_Info.prototype.info;
    /** @type {?} */
    IServer_Info.prototype.apiVersions;
}
class SignalKClient {
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
    disconnect() { this.stream.close(); }
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
    { type: SignalKStream }
];
/** @nocollapse */ SignalKClient.ngInjectableDef = ɵɵdefineInjectable({ factory: function SignalKClient_Factory() { return new SignalKClient(ɵɵinject(HttpClient), ɵɵinject(SignalKApps), ɵɵinject(SignalKHttp), ɵɵinject(SignalKStream)); }, token: SignalKClient, providedIn: "root" });
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
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { Alarm, AlarmMethod, AlarmState, AlarmType, Message, Path, SignalKApps, SignalKClient, SignalKClientModule, SignalKHttp, SignalKStream, UUID as ɵa };
//# sourceMappingURL=signalk-client-angular.js.map
