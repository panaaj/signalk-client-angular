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
            path = path.split('.').join('/');
        }
        return path;
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
                // ** re-format value { uuid: { <resource_data> }}
                /** @type {?} */
                let v = JSON.parse(JSON.stringify(msg.value));
                msg.value = {};
                msg.value[r[r.length - 1]] = v;
                // ** add self context and remove uuid from path
                path = 'vessels/self/' + r.slice(0, r.length - 1).join('/');
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
        keys.forEach(k => { msg[k] = value[k]; });
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
        this.api.server = this.server.info;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQtYW5ndWxhci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXVpZC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvdXRpbHMudHMiLCJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvbGliL2h0dHAtYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0tYXBpLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zdHJlYW0td29ya2VyLnRzIiwibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyL2xpYi9zaWduYWxrLWNsaWVudC50cyIsIm5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci9saWIvc2lnbmFsay1jbGllbnQubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIFVVSUQ6IEEganMgbGlicmFyeSB0byBnZW5lcmF0ZSBhbmQgcGFyc2UgVVVJRHMsIFRpbWVVVUlEcyBhbmQgZ2VuZXJhdGVcclxuICogVGltZVVVSUQgYmFzZWQgb24gZGF0ZXMgZm9yIHJhbmdlIHNlbGVjdGlvbnMuXHJcbiAqIEBzZWUgaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcclxuICoqL1xyXG5leHBvcnQgY2xhc3MgVVVJRCB7XHJcblxyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTA4O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNDtcclxuICAgIHByaXZhdGUgbGltaXRVSTE2O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMzI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0MDtcclxuICAgIHByaXZhdGUgbGltaXRVSTQ4O1xyXG5cclxuICAgIHByaXZhdGUgdmVyc2lvbjpudW1iZXI7XHJcbiAgICBwcml2YXRlIGhleDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDQgPSB0aGlzLm1heEZyb21CaXRzKDQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA2ID0gdGhpcy5tYXhGcm9tQml0cyg2KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwOCA9IHRoaXMubWF4RnJvbUJpdHMoOCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTIgPSB0aGlzLm1heEZyb21CaXRzKDEyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNCA9IHRoaXMubWF4RnJvbUJpdHMoMTQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTE2ID0gdGhpcy5tYXhGcm9tQml0cygxNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMzIgPSB0aGlzLm1heEZyb21CaXRzKDMyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0MCA9IHRoaXMubWF4RnJvbUJpdHMoNDApO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTQ4ID0gdGhpcy5tYXhGcm9tQml0cyg0OCk7IFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gdGhpcy5oZXggfVxyXG4gICAgdG9VUk4oKSB7IHJldHVybiAndXJuOnV1aWQ6JyArIHRoaXMuaGV4IH1cclxuICAgIHRvU2lnbmFsSygpOnN0cmluZyAgeyByZXR1cm4gYHVybjptcm46c2lnbmFsazp1dWlkOiR7dGhpcy5oZXh9YCB9XHJcbiAgICB0b0J5dGVzKCkge1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IHRoaXMuaGV4LnNwbGl0KCctJyk7XHJcbiAgICAgICAgbGV0IGludHMgPSBbXTtcclxuICAgICAgICBsZXQgaW50UG9zID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydHNbaV0ubGVuZ3RoOyBqKz0yKSB7XHJcbiAgICAgICAgICAgIGludHNbaW50UG9zKytdID0gcGFyc2VJbnQocGFydHNbaV0uc3Vic3RyKGosIDIpLCAxNik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludHM7XHJcbiAgICB9OyAgICBcclxuXHJcbiAgICBwcml2YXRlIG1heEZyb21CaXRzKGJpdHMpIHsgcmV0dXJuIE1hdGgucG93KDIsIGJpdHMpIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSYW5kb21JbnQobWluLCBtYXgpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4gfVxyXG5cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA2LTEpO31cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwOCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA4LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTEyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE2LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkzMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTMyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0MCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0MCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTQ4KCkgeyByZXR1cm4gKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgMzApKSArICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDQ4IC0gMzApKSAqICgxIDw8IDMwKSB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5mcm9tUGFydHMoXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkzMigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMTYoKSxcclxuICAgICAgICAgICAgMHg0MDAwIHwgdGhpcy5yYW5kb21VSTEyKCksXHJcbiAgICAgICAgICAgIDB4ODAgICB8IHRoaXMucmFuZG9tVUkwNigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMDgoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTQ4KClcclxuICAgICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHBhZGRlZFN0cmluZyhzdHJpbmcsIGxlbmd0aCwgej1udWxsKSB7XHJcbiAgICAgICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XHJcbiAgICAgICAgeiA9ICgheikgPyAnMCcgOiB6O1xyXG4gICAgICAgIGxldCBpID0gbGVuZ3RoIC0gc3RyaW5nLmxlbmd0aDtcclxuICAgICAgICBmb3IgKDsgaSA+IDA7IGkgPj4+PSAxLCB6ICs9IHopIHtcclxuICAgICAgICAgICAgaWYgKGkgJiAxKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyA9IHogKyBzdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cmluZztcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBmcm9tUGFydHModGltZUxvdywgdGltZU1pZCwgdGltZUhpQW5kVmVyc2lvbiwgY2xvY2tTZXFIaUFuZFJlc2VydmVkLCBjbG9ja1NlcUxvdywgbm9kZSkge1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9ICh0aW1lSGlBbmRWZXJzaW9uID4+IDEyKSAmIDB4RjtcclxuICAgICAgICB0aGlzLmhleCA9IHRoaXMucGFkZGVkU3RyaW5nKHRpbWVMb3cudG9TdHJpbmcoMTYpLCA4KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVNaWQudG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVIaUFuZFZlcnNpb24udG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxSGlBbmRSZXNlcnZlZC50b1N0cmluZygxNiksIDIpXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcoY2xvY2tTZXFMb3cudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKG5vZGUudG9TdHJpbmcoMTYpLCAxMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9OyAgICBcclxuICAgIFxyXG4gICAgLypcclxuICAgIHByaXZhdGUgZ2V0VGltZUZpZWxkVmFsdWVzKHRpbWUpIHtcclxuICAgICAgICBsZXQgdHMgPSB0aW1lIC0gRGF0ZS5VVEMoMTU4MiwgOSwgMTUpO1xyXG4gICAgICAgIGxldCBobSA9ICgodHMgLyAweDEwMDAwMDAwMCkgKiAxMDAwMCkgJiAweEZGRkZGRkY7XHJcbiAgICAgICAgcmV0dXJuIHsgbG93OiAoKHRzICYgMHhGRkZGRkZGKSAqIDEwMDAwKSAlIDB4MTAwMDAwMDAwLFxyXG4gICAgICAgICAgICAgICAgbWlkOiBobSAmIDB4RkZGRiwgaGk6IGhtID4+PiAxNiwgdGltZXN0YW1wOiB0cyB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tVGltZSh0aW1lLCBsYXN0OmJvb2xlYW4pIHtcclxuICAgICAgICBsYXN0ID0gKCFsYXN0KSA/IGZhbHNlIDogbGFzdDtcclxuICAgICAgICBsZXQgdGYgPSB0aGlzLmdldFRpbWVGaWVsZFZhbHVlcyh0aW1lKTtcclxuICAgICAgICBsZXQgdGwgPSB0Zi5sb3c7XHJcbiAgICAgICAgbGV0IHRoYXYgPSAodGYuaGkgJiAweEZGRikgfCAweDEwMDA7ICAvLyBzZXQgdmVyc2lvbiAnMDAwMSdcclxuICAgICAgICBpZiAobGFzdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVVUlEKCkuZnJvbVBhcnRzKHRsLCB0Zi5taWQsIHRoYXYsIDAsIDAsIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRCgpLmZyb21QYXJ0cyh0bCwgdGYubWlkLCB0aGF2LCAweDgwIHwgdGhpcy5saW1pdFVJMDYsIHRoaXMubGltaXRVSTA4IC0gMSwgdGhpcy5saW1pdFVJNDggLSAxKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZpcnN0RnJvbVRpbWUodGltZSkgeyByZXR1cm4gdGhpcy5mcm9tVGltZSh0aW1lLCBmYWxzZSkgfVxyXG4gICAgbGFzdEZyb21UaW1lKHRpbWUpIHsgcmV0dXJuIHRoaXMuZnJvbVRpbWUodGltZSwgdHJ1ZSkgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIGVxdWFscyh1dWlkKSB7XHJcbiAgICAgICAgaWYgKCEodXVpZCBpbnN0YW5jZW9mIFVVSUQpKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGV4ICE9PSB1dWlkLmhleCkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tVVJOKHN0cklkKSB7XHJcbiAgICAgICAgbGV0IHI7XHJcbiAgICAgICAgbGV0IHAgPSAvXig/OnVybjp1dWlkOnxcXHspPyhbMC05YS1mXXs4fSktKFswLTlhLWZdezR9KS0oWzAtOWEtZl17NH0pLShbMC05YS1mXXsyfSkoWzAtOWEtZl17Mn0pLShbMC05YS1mXXsxMn0pKD86XFx9KT8kL2k7XHJcbiAgICAgICAgaWYgKChyID0gcC5leGVjKHN0cklkKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnJvbVBhcnRzKFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoclsxXSwgMTYpLCBwYXJzZUludChyWzJdLCAxNiksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzNdLCAxNiksIHBhcnNlSW50KHJbNF0sIDE2KSxcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbNV0sIDE2KSwgcGFyc2VJbnQocls2XSwgMTYpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZyb21CeXRlcyhpbnRzKSB7XHJcbiAgICAgICAgaWYgKGludHMubGVuZ3RoIDwgNSkgeyByZXR1cm4gbnVsbCB9XHJcbiAgICAgICAgbGV0IHN0ciA9ICcnO1xyXG4gICAgICAgIGxldCBwb3MgPSAwO1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IFs0LCAyLCAyLCAyLCA2XTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydHNbaV07IGorKykge1xyXG4gICAgICAgICAgICBsZXQgb2N0ZXQgPSBpbnRzW3BvcysrXS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIGlmIChvY3RldC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgb2N0ZXQgPSAnMCcgKyBvY3RldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHIgKz0gb2N0ZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhcnRzW2ldICE9PSA2KSB7XHJcbiAgICAgICAgICAgIHN0ciArPSAnLSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbVVSTihzdHIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmcm9tQmluYXJ5KGJpbmFyeSkge1xyXG4gICAgICAgIGxldCBpbnRzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaW50c1tpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBpZiAoaW50c1tpXSA+IDI1NSB8fCBpbnRzW2ldIDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgYnl0ZSBpbiBiaW5hcnkgZGF0YS4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9tQnl0ZXMoaW50cyk7XHJcbiAgICB9O1xyXG4gICAgKi9cclxuXHJcbn07IiwiaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4vdXVpZCc7XHJcblxyXG4vLyAqKiBQYXRoIHV0aWxpdGllc1xyXG5leHBvcnQgY2xhc3MgUGF0aCB7XHJcblxyXG4gICAgLy8gKiogdHJhbnNmb3JtIGRvdCBub3RhdGlvbiB0byBzbGFzaFxyXG4gICAgc3RhdGljIGRvdFRvU2xhc2gocGF0aDpzdHJpbmcpOnN0cmluZyB7XHJcbiAgICAgICAgaWYocGF0aC5pbmRleE9mKCcuJykhPS0xKSB7IFxyXG4gICAgICAgICAgICBwYXRoPSBwYXRoLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBwYXJzZSBjb250ZXh0IHRvIHZhbGlkIFNpZ25hbCBLIHBhdGhcclxuICAgIHN0YXRpYyBjb250ZXh0VG9QYXRoKGNvbnRleHQ6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGxldCByZXM9IChjb250ZXh0PT0nc2VsZicgKSA/ICd2ZXNzZWxzLnNlbGYnOiBjb250ZXh0O1xyXG4gICAgICAgIHJldHVybiByZXMuc3BsaXQoJy4nKS5qb2luKCcvJyk7XHJcbiAgICB9ICAgIFxyXG5cclxufVxyXG5cclxuLy8gKiogTWVzc2FnZSB0ZW1wbGF0ZXMgKipcclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2Uge1xyXG4gICBcclxuICAgIC8vICoqIHJldHVybiBVUERBVEVTIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgdXBkYXRlcygpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IHZhbHVlczogWyB7cGF0aDogeHgsIHZhbHVlOiB4eCB9IF0gfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1cGRhdGVzOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyAqKiByZXR1cm4gU1VCU0NSSUJFIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgc3Vic2NyaWJlKCkgeyBcclxuICAgICAgICAvKiBhcnJheSB2YWx1ZXM9IHtcclxuICAgICAgICAgICAgXCJwYXRoXCI6IFwicGF0aC50by5rZXlcIixcclxuICAgICAgICAgICAgXCJwZXJpb2RcIjogMTAwMCxcclxuICAgICAgICAgICAgXCJmb3JtYXRcIjogXCJkZWx0YVwiLFxyXG4gICAgICAgICAgICBcInBvbGljeVwiOiBcImlkZWFsXCIsXHJcbiAgICAgICAgICAgIFwibWluUGVyaW9kXCI6IDIwMFxyXG4gICAgICAgICAgICB9ICovXHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICBcclxuICAgIC8vICoqIHJldHVybiBVTlNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVuc3Vic2NyaWJlKCkgeyBcclxuICAgICAgICAvLyBhcnJheSB2YWx1ZXM9IHsgXCJwYXRoXCI6IFwicGF0aC50by5rZXlcIiB9XHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiBbXSBcclxuICAgICAgICB9XHJcbiAgICB9ICBcclxuICAgIC8vICoqIHJldHVybiBSRVFVRVNUIG1lc3NhZ2Ugb2JqZWN0XHJcbiAgICBzdGF0aWMgcmVxdWVzdCgpIHsgXHJcbiAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgIHJlcXVlc3RJZDogbmV3IFVVSUQoKS50b1N0cmluZygpXHJcbiAgICAgICAgfVxyXG4gICAgfSAgICAgICAgICAgXHJcblxyXG59XHJcblxyXG4vLyAqKiBBbGFybSBtZXNzYWdlICoqXHJcbmV4cG9ydCBjbGFzcyBBbGFybSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3RhdGU6QWxhcm1TdGF0ZTtcclxuICAgIHByaXZhdGUgX21ldGhvZDpBcnJheTxBbGFybU1ldGhvZD49IFtdO1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZTpzdHJpbmc9Jyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcsIHN0YXRlPzpBbGFybVN0YXRlLCB2aXN1YWw/OmJvb2xlYW4sIHNvdW5kPzpib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gKHR5cGVvZiBtZXNzYWdlIT09ICd1bmRlZmluZWQnKSA/IG1lc3NhZ2UgOiAnJztcclxuICAgICAgICB0aGlzLl9zdGF0ZT0gKHR5cGVvZiBzdGF0ZSE9PSAndW5kZWZpbmVkJykgPyBzdGF0ZSA6IEFsYXJtU3RhdGUuYWxhcm07XHJcbiAgICAgICAgaWYodmlzdWFsKSB7IHRoaXMuX21ldGhvZC5wdXNoKEFsYXJtTWV0aG9kLnZpc3VhbCl9O1xyXG4gICAgICAgIGlmKHNvdW5kKSB7IHRoaXMuX21ldGhvZC5wdXNoKEFsYXJtTWV0aG9kLnNvdW5kKX07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMuX21lc3NhZ2UsXHJcbiAgICAgICAgICAgIHN0YXRlOiB0aGlzLl9zdGF0ZSxcclxuICAgICAgICAgICAgbWV0aG9kOiB0aGlzLl9tZXRob2RcclxuICAgICAgICB9XHJcbiAgICB9ICBcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQWxhcm1TdGF0ZSB7XHJcbiAgICBub3JtYWw9ICdub3JtYWwnLFxyXG4gICAgYWxlcnQ9ICdhbGVydCcsXHJcbiAgICB3YXJuPSAnd2FybicsXHJcbiAgICBhbGFybT0gJ2FsYXJtJyxcclxuICAgIGVtZXJnZW5jeT0gJ2VtZXJnZW5jeSdcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtTWV0aG9kIHtcclxuICAgIHZpc3VhbD0gJ3Zpc3VhbCcsXHJcbiAgICBzb3VuZD0gJ3NvdW5kJ1xyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gQWxhcm1UeXBlIHtcclxuICAgIG1vYj0gJ25vdGlmaWNhdGlvbnMubW9iJyxcclxuICAgIGZpcmU9ICdub3RpZmljYXRpb25zLmZpcmUnLFxyXG4gICAgc2lua2luZz0gJ25vdGlmaWNhdGlvbnMuc2lua2luZycsXHJcbiAgICBmbG9vZGluZz0gJ25vdGlmaWNhdGlvbnMuZmxvb2RpbmcnLFxyXG4gICAgY29sbGlzaW9uPSAnbm90aWZpY2F0aW9ucy5jb2xsaXNpb24nLFxyXG4gICAgZ3JvdW5kaW5nPSAnbm90aWZpY2F0aW9ucy5ncm91bmRpbmcnLFxyXG4gICAgbGlzdGluZz0gJ25vdGlmaWNhdGlvbnMubGlzdGluZycsXHJcbiAgICBhZHJpZnQ9ICdub3RpZmljYXRpb25zLmFkcmlmdCcsXHJcbiAgICBwaXJhY3k9ICdub3RpZmljYXRpb25zLnBpcmFjeScsXHJcbiAgICBhYmFuZG9uPSAnbm90aWZpY2F0aW9ucy5hYmFuZG9uJ1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0h0dHAge1xyXG5cclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgcHVibGljIHNlcnZlcjogYW55O1xyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgfSAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBnZXQgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZi4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmdldChgdmVzc2Vscy9zZWxmYCkgfVxyXG5cclxuICAgIC8vKiogZ2V0IElEIG9mIHZlc3NlbCBzZWxmIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5nZXQoYHNlbGZgKSB9XHJcblxyXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxyXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGAke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9L21ldGFgKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8qKiBnZXQgQVBJIHBhdGggdmFsdWUgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gdGhpcy5lbmRwb2ludCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIFBVVC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIHB1dChwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuXHRwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG4gICAgcHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KTtcclxuICAgIHB1dChjOnN0cmluZywgcDphbnksIGs/OmFueSwgdj86YW55KSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IGNvbnRleHQ6c3RyaW5nO1xyXG4gICAgICAgIGxldCBwYXRoOnN0cmluZztcclxuICAgICAgICBsZXQgbXNnID0geyB2YWx1ZToge30gfSBcclxuICAgICAgICAvLyAqKiBwYXRoIC8gdmFsdWVcclxuICAgICAgICBpZih0eXBlb2Ygaz09J3VuZGVmaW5lZCcgJiYgdHlwZW9mIHY9PSd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGlmKGNbMF09PScvJykgeyBjPSBjLnNsaWNlKDEpIH1cclxuICAgICAgICAgICAgcGF0aD0gUGF0aC5kb3RUb1NsYXNoKGMpO1xyXG4gICAgICAgICAgICBjb250ZXh0PSAnJztcclxuICAgICAgICAgICAgbXNnLnZhbHVlPSBwO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAqKiBjb250ZXh0IC8gcGF0aCAvIHZhbHVlXHJcbiAgICAgICAgZWxzZSBpZih0eXBlb2Ygdj09J3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ9IChjKSA/IFBhdGguY29udGV4dFRvUGF0aChjKSA6ICcnO1xyXG4gICAgICAgICAgICBwYXRoPVBhdGguZG90VG9TbGFzaChwKTtcclxuICAgICAgICAgICAgbXNnLnZhbHVlPSBrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgIC8vICoqIGNvbnRleHQgLyBwYXRoIC8ga2V5IC8gdmFsdWVcclxuICAgICAgICAgICAgY29udGV4dD0gKGMpID8gUGF0aC5jb250ZXh0VG9QYXRoKGMpIDogJyc7XHJcbiAgICAgICAgICAgIGxldCB0PSBQYXRoLmRvdFRvU2xhc2gocCkuc3BsaXQoJy8nKTtcclxuICAgICAgICAgICAgdC5wdXNoKGspO1xyXG4gICAgICAgICAgICBwYXRoPSB0LmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgbXNnLnZhbHVlPSB2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gKiogcGF0Y2ggZm9yIG5vZGUgc2VydmVyIFBVVCBoYW5kbGluZyBvZiByZXNvdXJjZXNcclxuICAgICAgICBsZXQgcj0gcGF0aC5zcGxpdCgnLycpO1xyXG4gICAgICAgIGlmKHJbMF09PSdyZXNvdXJjZXMnKSB7IFxyXG4gICAgICAgICAgICBjb250ZXh0PSAnJzsgIFxyXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5pZD09J3NpZ25hbGstc2VydmVyLW5vZGUnKSB7IC8vICoqIGNoZWNrIGZvciBub2RlIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgLy8gKiogcmUtZm9ybWF0IHZhbHVlIHsgdXVpZDogeyA8cmVzb3VyY2VfZGF0YT4gfX1cclxuICAgICAgICAgICAgICAgIGxldCB2PSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1zZy52YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgbXNnLnZhbHVlPSB7fVxyXG4gICAgICAgICAgICAgICAgbXNnLnZhbHVlW3Jbci5sZW5ndGgtMV1dPXY7XHJcbiAgICAgICAgICAgICAgICAvLyAqKiBhZGQgc2VsZiBjb250ZXh0IGFuZCByZW1vdmUgdXVpZCBmcm9tIHBhdGhcclxuICAgICAgICAgICAgICAgIHBhdGg9ICd2ZXNzZWxzL3NlbGYvJyArIHIuc2xpY2UoMCwgci5sZW5ndGgtMSkuam9pbignLycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICAgICAgY29udGV4dD0gKGNvbnRleHQpID8gY29udGV4dCArICcvJyA6ICcnO1xyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBjb250ZXh0ICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZykgfVxyXG4gICAgfSBcclxuXHJcbiAgICAvLyoqIHNlbmQgdmFsdWUgdG8gQVBJIHBhdGggdmlhIGh0dHAgUE9TVC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIHBvc3QocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLmVuZHBvaW50fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKSB9XHJcbiAgICB9ICAgICBcclxuXHJcbiAgICAvLyoqIGRlbGV0ZSB2YWx1ZSBmcm9tIEFQSSBwYXRoIHZpYSBodHRwIERFTEVURS4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGRlbGV0ZShwYXRoOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLmVuZHBvaW50fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh1cmwpIH1cclxuICAgIH0gICAgICBcclxuXHJcbn0gIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UsIEFsYXJtLCBBbGFybVR5cGUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLU3RyZWFtIHtcclxuXHJcblx0cHJpdmF0ZSBfY29ubmVjdDogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSBfY2xvc2U6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9lcnJvcjogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG5cclxuICAgIHByaXZhdGUgd3M6IGFueTsgICAgXHJcbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xyXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgIFxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgIFxyXG4gICAgcHJpdmF0ZSBfcGxheWJhY2tNb2RlOiBib29sZWFuPSBmYWxzZTtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIG9uQ29ubmVjdDogT2JzZXJ2YWJsZTxhbnk+O1x0XHRcclxuICAgIHB1YmxpYyBvbkNsb3NlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2VsZklkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgX3NvdXJjZTogYW55PSBudWxsO1xyXG5cclxuICAgIC8vICoqIHNldCBzb3VyY2UgbGFiZWwgZm9yIHVzZSBpbiBtZXNzYWdlc1xyXG4gICAgc2V0IHNvdXJjZSh2YWw6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLl9zb3VyY2UpIHsgdGhpcy5fc291cmNlPSB7fSB9XHJcbiAgICAgICAgdGhpcy5fc291cmNlWydsYWJlbCddPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH0gICAgXHJcbiAgICAvLyAqKiBnZXQgLyBzZXQgd2Vic29ja2V0IGNvbm5lY3Rpb24gdGltZW91dCAzMDAwPD10aW1lb3V0PD02MDAwMCAqKlxyXG4gICAgZ2V0IGNvbm5lY3Rpb25UaW1lb3V0KCk6bnVtYmVyIHsgcmV0dXJuIHRoaXMuX3dzVGltZW91dCB9XHJcbiAgICBzZXQgY29ubmVjdGlvblRpbWVvdXQodmFsOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3dzVGltZW91dD0gKHZhbDwzMDAwKSA/IDMwMDAgOiAodmFsPjYwMDAwKSA/IDYwMDAwIDogdmFsO1xyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogaXMgV1MgU3RyZWFtIGNvbm5lY3RlZD9cclxuICAgIGdldCBpc09wZW4oKTpib29sZWFuIHsgXHJcbiAgICAgICAgcmV0dXJuICh0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfSAgXHJcbiAgICAvLyAqKiBnZXQgLyBzZXQgZmlsdGVyIHRvIHNlbGVjdCBkZWx0YSBtZXNzYWdlcyBqdXN0IGZvciBzdXBwbGllZCB2ZXNzZWwgaWQgICBcclxuICAgIGdldCBmaWx0ZXIoKTpzdHJpbmcgeyByZXR1cm4gdGhpcy5fZmlsdGVyIH1cclxuICAgIC8vICoqIHNldCBmaWx0ZXI9IG51bGwgdG8gcmVtb3ZlIG1lc3NhZ2UgZmlsdGVyaW5nXHJcbiAgICBzZXQgZmlsdGVyKGlkOnN0cmluZykgeyBcclxuICAgICAgICBpZiggaWQgJiYgaWQuaW5kZXhPZignc2VsZicpIT0tMSApIHsgIC8vICoqIHNlbGZcclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyPSAodGhpcy5zZWxmSWQpID8gdGhpcy5zZWxmSWQgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgdGhpcy5fZmlsdGVyPSBpZCB9XHJcbiAgICB9ICAgXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgUGxheWJhY2sgSGVsbG8gbWVzc2FnZVxyXG4gICAgZ2V0IHBsYXliYWNrTW9kZSgpOmJvb2xlYW4geyByZXR1cm4gdGhpcy5fcGxheWJhY2tNb2RlIH1cclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggKSB7IFxyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Q9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ29ubmVjdD0gdGhpcy5fY29ubmVjdC5hc09ic2VydmFibGUoKTsgICBcclxuICAgICAgICB0aGlzLl9jbG9zZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25DbG9zZT0gdGhpcy5fY2xvc2UuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgICAgICAgXHJcbiAgICB9ICAgXHJcblxyXG4gICAgLy8gKiogQ2xvc2UgV2ViU29ja2V0IGNvbm5lY3Rpb25cclxuICAgIGNsb3NlKCkgeyBpZih0aGlzLndzKSB7IHRoaXMud3MuY2xvc2UoKTsgdGhpcy53cz0gbnVsbDsgfSB9XHJcbiAgIFxyXG5cdC8vICoqIE9wZW4gYSBXZWJTb2NrZXQgYXQgcHJvdmlkZWQgdXJsXHJcblx0b3Blbih1cmw6c3RyaW5nLCBzdWJzY3JpYmU/OnN0cmluZywgdG9rZW4/OnN0cmluZykge1xyXG4gICAgICAgIHVybD0gKHVybCkgPyB1cmwgOiB0aGlzLmVuZHBvaW50O1xyXG4gICAgICAgIGlmKCF1cmwpIHsgcmV0dXJuIH1cclxuICAgICAgICBsZXQgcT0gKHVybC5pbmRleE9mKCc/Jyk9PS0xKSA/ICc/JyA6ICcmJ1xyXG4gICAgICAgIGlmKHN1YnNjcmliZSkgeyB1cmwrPWAke3F9c3Vic2NyaWJlPSR7c3Vic2NyaWJlfWAgfSBcclxuICAgICAgICBpZih0aGlzLl90b2tlbiB8fCB0b2tlbikgeyB1cmwrPSBgJHsoc3Vic2NyaWJlKSA/ICcmJyA6ICc/J310b2tlbj0ke3RoaXMuX3Rva2VuIHx8IHRva2VufWAgfSBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodXJsKTtcclxuICAgICAgICAvLyAqKiBzdGFydCBjb25uZWN0aW9uIHdhdGNoZG9nICoqXHJcbiAgICAgICAgc2V0VGltZW91dCggXHJcbiAgICAgICAgICAgICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLndzICYmICh0aGlzLndzLnJlYWR5U3RhdGUhPTEgJiYgdGhpcy53cy5yZWFkeVN0YXRlIT0zKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb25uZWN0aW9uIHdhdGNoZG9nIGV4cGlyZWQgKCR7dGhpcy5fd3NUaW1lb3V0LzEwMDB9IHNlYyk6ICR7dGhpcy53cy5yZWFkeVN0YXRlfS4uLiBhYm9ydGluZyBjb25uZWN0aW9uLi4uYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5fd3NUaW1lb3V0XHJcbiAgICAgICAgKTtcclxuXHRcdFxyXG5cdFx0dGhpcy53cy5vbm9wZW49IGU9PiB7IHRoaXMuX2Nvbm5lY3QubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9uY2xvc2U9IGU9PiB7IHRoaXMuX2Nsb3NlLm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmVycm9yPSBlPT4geyB0aGlzLl9lcnJvci5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25tZXNzYWdlPSBlPT4ge3RoaXMucGFyc2VPbk1lc3NhZ2UoZSkgfVxyXG4gICAgfSAgXHJcbiAgICBcclxuICAgIC8vICoqIHBhcnNlIHJlY2VpdmVkIG1lc3NhZ2VcclxuICAgIHByaXZhdGUgcGFyc2VPbk1lc3NhZ2UoZSkge1xyXG4gICAgICAgIGxldCBkYXRhOiBhbnk7XHJcbiAgICAgICAgaWYodHlwZW9mIGUuZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdHJ5IHsgZGF0YT0gSlNPTi5wYXJzZShlLmRhdGEpIH1cclxuICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzSGVsbG8oZGF0YSkpIHsgXHJcbiAgICAgICAgICAgIHRoaXMuc2VsZklkPSBkYXRhLnNlbGY7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrTW9kZT0gKHR5cGVvZiBkYXRhLnN0YXJ0VGltZSE9ICd1bmRlZmluZWQnKSA/IHRydWUgOiBmYWxzZTsgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSk7XHJcbiAgICAgICAgfSAgICAgIFxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5pc1Jlc3BvbnNlKGRhdGEpKSB7IFxyXG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YS5sb2dpbiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhLmxvZ2luLnRva2VuICE9PSAndW5kZWZpbmVkJykgeyB0aGlzLl90b2tlbj0gZGF0YS5sb2dpbi50b2tlbiB9XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKTtcclxuICAgICAgICB9ICAgICAgICAgICAgIFxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5fZmlsdGVyICYmIHRoaXMuaXNEZWx0YShkYXRhKSkge1xyXG4gICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXHJcbiAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICBlbHNlIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2VuZCByZXF1ZXN0IHZpYSBEZWx0YSBzdHJlYW1cclxuICAgIHNlbmRSZXF1ZXN0KHZhbHVlOmFueSk6c3RyaW5nIHtcclxuICAgICAgICBpZih0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBudWxsIH1cclxuICAgICAgICBsZXQgbXNnPSBNZXNzYWdlLnJlcXVlc3QoKTtcclxuICAgICAgICBpZih0eXBlb2YgdmFsdWUubG9naW4gPT09ICd1bmRlZmluZWQnICYmIHRoaXMuX3Rva2VuKSB7IG1zZ1sndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG4gICAgICAgIGxldCBrZXlzPSBPYmplY3Qua2V5cyh2YWx1ZSk7XHJcbiAgICAgICAga2V5cy5mb3JFYWNoKCBrPT4geyBtc2dba109IHZhbHVlW2tdIH0pO1xyXG4gICAgICAgIHRoaXMuc2VuZChtc2cpO1xyXG4gICAgICAgIHJldHVybiBtc2cucmVxdWVzdElkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgcHV0IHJlcXVlc3QgdmlhIERlbHRhIHN0cmVhbVxyXG4gICAgcHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTpzdHJpbmcge1xyXG4gICAgICAgIGxldCBtc2c9IHtcclxuICAgICAgICAgICAgY29udGV4dDogKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQsXHJcbiAgICAgICAgICAgIHB1dDogeyBwYXRoOiBwYXRoLCB2YWx1ZTogdmFsdWUgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QobXNnKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8gKiogZ2V0IGF1dGggdG9rZW4gZm9yIHN1cHBsaWVkIHVzZXIgZGV0YWlscyAqKlxyXG4gICAgbG9naW4odXNlcm5hbWU6c3RyaW5nLCBwYXNzd29yZDpzdHJpbmcpIHtcclxuICAgICAgICBsZXQgbXNnPSB7IFxyXG4gICAgICAgICAgICBsb2dpbjogeyBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcInBhc3N3b3JkXCI6IHBhc3N3b3JkIH0gXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdChtc2cpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgZGF0YSB0byBTaWduYWwgSyBzdHJlYW1cclxuICAgIHNlbmQoZGF0YTphbnkpIHtcclxuICAgICAgICBpZih0aGlzLndzKSB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgeyBkYXRhPSBKU09OLnN0cmluZ2lmeShkYXRhKSB9XHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogc2VuZCB2YWx1ZShzKSB2aWEgZGVsdGEgc3RyZWFtIHVwZGF0ZSAqKlxyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZywgcGF0aDpBcnJheTxhbnk+KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG4gICAgc2VuZFVwZGF0ZShjb250ZXh0OnN0cmluZz0nc2VsZicsIHBhdGg6IHN0cmluZyB8IEFycmF5PGFueT4sIHZhbHVlPzphbnkpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnVwZGF0ZXMoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGxldCB1VmFsdWVzPSBbXTtcclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdVZhbHVlcy5wdXNoKHsgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICAgdVZhbHVlcz0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHU9IHsgXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBcclxuICAgICAgICAgICAgdmFsdWVzOiB1VmFsdWVzIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9zb3VyY2UpIHsgdVsnc291cmNlJ109IHRoaXMuX3NvdXJjZSB9XHJcbiAgICAgICAgdmFsLnVwZGF0ZXMucHVzaCggdSApOyBcclxuICAgICAgICB0aGlzLnNlbmQodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzIG9wdGlvbnM6IHsuLn0qKlxyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOkFycmF5PGFueT4pO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgb3B0aW9ucz86YW55KTtcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nIHwgQXJyYXk8YW55Pj0nKicsIG9wdGlvbnM/OmFueSkge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2Uuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICB2YWwuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHNWYWx1ZT0ge307XHJcbiAgICAgICAgICAgIHNWYWx1ZVsncGF0aCddPSBwYXRoO1xyXG4gICAgICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1sncGVyaW9kJ10pIHsgc1ZhbHVlWydwZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snbWluUGVyaW9kJ10pIHsgc1ZhbHVlWydtaW5QZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snZm9ybWF0J10gJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnNbJ2Zvcm1hdCddPT0nZGVsdGEnIHx8IG9wdGlvbnNbJ2Zvcm1hdCddPT0nZnVsbCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydmb3JtYXQnXT0gb3B0aW9uc1snZm9ybWF0J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwb2xpY3knXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1sncG9saWN5J109PSdpbnN0YW50JyB8fCBvcHRpb25zWydwb2xpY3knXT09J2lkZWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0nZml4ZWQnKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNWYWx1ZVsncG9saWN5J109IG9wdGlvbnNbJ3BvbGljeSddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbC5zdWJzY3JpYmUucHVzaChzVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbmQodmFsKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXHJcbiAgICB1bnN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6YW55PScqJykge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2UudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC51bnN1YnNjcmliZT0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7IHZhbC51bnN1YnNjcmliZS5wdXNoKHtwYXRoOiBwYXRofSkgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiByYWlzZSBhbGFybSBmb3IgcGF0aFxyXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZywgbmFtZTpzdHJpbmcsIGFsYXJtOkFsYXJtKTtcclxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmcsIHR5cGU6QWxhcm1UeXBlLCBhbGFybTpBbGFybSk7XHJcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nPScqJywgYWxhcm1JZDphbnksIGFsYXJtOkFsYXJtKSB7XHJcbiAgICAgICAgbGV0IG46c3RyaW5nO1xyXG4gICAgICAgIGlmKHR5cGVvZiBhbGFybUlkID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBuPShhbGFybUlkLmluZGV4T2YoJ25vdGlmaWNhdGlvbnMuJyk9PS0xKSA/IGBub3RpZmljYXRpb25zLiR7YWxhcm1JZH1gIDogYWxhcm1JZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IG49IGFsYXJtSWQgfVxyXG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBuLCBhbGFybS52YWx1ZSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHJhaXNlIGFsYXJtIGZvciBwYXRoXHJcbiAgICBjbGVhckFsYXJtKGNvbnRleHQ6c3RyaW5nPScqJywgbmFtZTpzdHJpbmcpIHtcclxuICAgICAgICBsZXQgbj0obmFtZS5pbmRleE9mKCdub3RpZmljYXRpb25zLicpPT0tMSkgPyBgbm90aWZpY2F0aW9ucy4ke25hbWV9YCA6IG5hbWU7XHJcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKGNvbnRleHQsIG4sIG51bGwpO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKiogTUVTU0FHRSBQQVJTSU5HICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgY29udGV4dCBpcyAnc2VsZidcclxuICAgIGlzU2VsZihtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIChtc2cuY29udGV4dD09IHRoaXMuc2VsZklkKSB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIERlbHRhIG1lc3NhZ2VcclxuICAgIGlzRGVsdGEobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiB0eXBlb2YgbXNnLmNvbnRleHQhPSAndW5kZWZpbmVkJyB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcclxuICAgIGlzSGVsbG8obXNnOmFueSk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zZy5zZWxmIT0gJ3VuZGVmaW5lZCcpO1xyXG4gICAgfSAgICAgXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIHJlcXVlc3QgUmVzcG9uc2UgbWVzc2FnZVxyXG4gICAgaXNSZXNwb25zZShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cucmVxdWVzdElkIT0gJ3VuZGVmaW5lZCcgfSBcclxufSIsIi8qKiBXZWIgV29ya2VyIFNlcnZpY2VcclxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLU3RyZWFtV29ya2VyICB7XHJcblxyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSB3b3JrZXI6IFdvcmtlcjtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcblxyXG4gICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICBcclxuICAgIH0gXHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB0aGlzLndvcmtlciA9IHVuZGVmaW5lZDsgfVxyXG5cclxuICAgIC8vICoqIEluaXRpYWxpc2Ugd29ya2VyXHJcbiAgICBpbml0KHBhdGhUb0ZpbGU6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKHR5cGVvZihXb3JrZXIpPT0gXCJ1bmRlZmluZWRcIikgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmKHRoaXMud29ya2VyKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpIH0gICAvLyAqKiB0ZXJtaW5hdGUgYW4gb3BlbiB3b3JrZXJcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZXI9IG5ldyBXb3JrZXIocGF0aFRvRmlsZSk7XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25tZXNzYWdlPSBldmVudD0+IHsgdGhpcy5fbWVzc2FnZS5uZXh0KGV2ZW50KSB9O1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9uZXJyb3I9IGV2ZW50PT4geyB0aGlzLl9lcnJvci5uZXh0KGV2ZW50KSB9OyAgICAgICAgICAgXHJcbiAgICAgICAgLy8gKiogd29ya2VyIHJlYWR5IGZvciBwb3N0TWVzc2FnZSgpXHJcbiAgICB9ICAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBTZW5kIG1lc3NhZ2UgdG8gd29ya2VyXHJcbiAgICBwb3N0TWVzc2FnZShtc2c6YW55KSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIucG9zdE1lc3NhZ2UobXNnKSB9IH1cclxuXHJcbiAgICAvLyAqKiB0ZXJtaW5hdGUgd29ya2VyXHJcbiAgICB0ZXJtaW5hdGUoKSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIudGVybWluYXRlKCl9IH1cclxufSIsImltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IFNpZ25hbEtIdHRwIH0gZnJvbSAnLi9odHRwLWFwaSc7XG5pbXBvcnQgeyBTaWduYWxLU3RyZWFtIH0gZnJvbSAnLi9zdHJlYW0tYXBpJztcbmltcG9ydCB7IFBhdGgsIE1lc3NhZ2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFNpZ25hbEtTdHJlYW1Xb3JrZXJ9IGZyb20gJy4vc3RyZWFtLXdvcmtlcic7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi91dWlkJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBTaWduYWxLQ2xpZW50IHtcbiAgICBcbiAgICBwcml2YXRlIGhvc3RuYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3J0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwcm90b2NvbDogc3RyaW5nO1xuICBcbiAgICBwcml2YXRlIF92ZXJzaW9uOiBzdHJpbmc9ICd2MSc7ICAgICAgLy8gKiogZGVmYXVsdCBTaWduYWwgSyBhcGkgdmVyc2lvblxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICAgICAgICAgICAgIC8vIHRva2VuIGZvciB3aGVuIHNlY3VyaXR5IGlzIGVuYWJsZWQgb24gdGhlIHNlcnZlclxuXG4gICAgcHJpdmF0ZSBkZWJ1Zyh2YWw6IGFueSkgeyBpZihpc0Rldk1vZGUoKSl7IGNvbnNvbGUubG9nKHZhbCkgfSB9XG4gICAgXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogc2VydmVyIGluZm9ybWF0aW9uIGJsb2NrICoqXG4gICAgcHVibGljIHNlcnZlcj0ge1xuICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICBpbmZvOiB7fSxcbiAgICAgICAgYXBpVmVyc2lvbnM6IFtdXG4gICAgfSAgICBcbiAgICAvLyAqKiBnZXQgLyBzZXQgU2lnbmFsIEsgcHJlZmVycmVkIGFwaSB2ZXJzaW9uIHRvIHVzZSAqKlxuICAgIGdldCB2ZXJzaW9uKCk6bnVtYmVyIHsgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl92ZXJzaW9uLnNsaWNlKDEpICkgfVxuICAgIHNldCB2ZXJzaW9uKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGxldCB2OnN0cmluZz0gJ3YnKyB2YWw7XG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmFwaVZlcnNpb25zLmxlbmd0aD09MCkgeyBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249IHY7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBTaWduYWwgSyBhcGkgdmVyc2lvbiBzZXQgdG86ICR7dn1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnNpb249ICh0aGlzLnNlcnZlci5hcGlWZXJzaW9ucy5pbmRleE9mKHYpIT0tMSkgPyB2IDogdGhpcy5fdmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNpZ25hbCBLIGFwaSB2ZXJzaW9uIHNldCByZXF1ZXN0OiAke3Z9LCByZXN1bHQ6ICR7dGhpcy5fdmVyc2lvbn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyBcbiAgICAgICAgdGhpcy5fdG9rZW49IHZhbDtcbiAgICAgICAgdGhpcy5hcGkuYXV0aFRva2VuPSB2YWw7XG4gICAgICAgIHRoaXMuc3RyZWFtLmF1dGhUb2tlbj0gdmFsO1xuICAgIH0gICAgXG4gICAgLy8gKiogTWVzc2FnZSBPYmplY3RcbiAgICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuIE1lc3NhZ2UgfVxuXG4gICAgLy8gKiogZ2VuZXJhdGUgYW5kIHJldHVybiBhIFVVSUQgb2JqZWN0XG4gICAgZ2V0IHV1aWQoKTpVVUlEIHsgcmV0dXJuIG5ldyBVVUlEKCkgfVxuXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIFxuICAgICAgICAgICAgICAgIHB1YmxpYyBhcGk6IFNpZ25hbEtIdHRwLCBcbiAgICAgICAgICAgICAgICBwdWJsaWMgc3RyZWFtOiBTaWduYWxLU3RyZWFtLFxuICAgICAgICAgICAgICAgIHB1YmxpYyB3b3JrZXI6IFNpZ25hbEtTdHJlYW1Xb3JrZXIgKSB7IFxuICAgICAgICB0aGlzLmluaXQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLnN0cmVhbS5jbG9zZSgpIH0gICBcbiAgICBcbiAgICAvLyAqKiBpbml0aWFsaXNlIHByb3RvY29sLCBob3N0bmFtZSwgcG9ydCB2YWx1ZXNcbiAgICBwcml2YXRlIGluaXQoaG9zdG5hbWU6c3RyaW5nPSdsb2NhbGhvc3QnLCBwb3J0Om51bWJlcj1udWxsLCB1c2VTU0w6Ym9vbGVhbj1mYWxzZSkge1xuICAgICAgICB0aGlzLmhvc3RuYW1lID0gaG9zdG5hbWU7XG4gICAgICAgIGlmKHVzZVNTTCkge1xuICAgICAgICAgICAgdGhpcy5wcm90b2NvbCA9ICdodHRwcyc7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBwb3J0IHx8IDQ0MztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3RvY29sID0gJ2h0dHAnO1xuICAgICAgICAgICAgdGhpcy5wb3J0ID0gcG9ydCB8fCA4MDtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfSAgICBcblxuICAgIC8vICoqKioqKioqKioqKioqKiogQ09OTkVDVElPTiBBTkQgRElTQ09WRVJZICAqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gKiogU2lnbmFsIEsgc2VydmVyIGVuZHBvaW50IGRpc2NvdmVyeSByZXF1ZXN0ICgvc2lnbmFsaykuICBcbiAgICBoZWxsbyhob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbml0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoJy9zaWduYWxrJyk7XG4gICAgfSAgICBcbiAgICAvLyAqKiBjb25uZWN0IHRvIHNlcnZlciAoZW5kcG9pbnQgZGlzY292ZXJ5KSBhbmQgRE8gTk9UIG9wZW4gU3RyZWFtXG4gICAgY29ubmVjdChob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnQ29udGFjdGluZyBTaWduYWwgSyBzZXJ2ZXIuLi4uLi4uLi4nKTtcbiAgICAgICAgICAgIHRoaXMuaGVsbG8oaG9zdG5hbWUsIHBvcnQsIHVzZVNTTCkuc3Vic2NyaWJlKCAgICAvLyAqKiBkaXNjb3ZlciBlbmRwb2ludHMgKipcbiAgICAgICAgICAgICAgICByZXNwb25zZT0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RyZWFtKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCkgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NIZWxsbyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpLmVuZHBvaW50PSB0aGlzLnJlc29sdmVIdHRwRW5kcG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0uZW5kcG9pbnQ9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcj0+IHsgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkRnJvbVNlcnZlcigpOyAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgLy8gKiogZGlzY29ubmVjdCBmcm9tIHNlcnZlclxuICAgIGRpc2Nvbm5lY3QoKSB7IHRoaXMuc3RyZWFtLmNsb3NlKCk7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB9XG4gICAgXG4gICAgLy8gKiogQ29ubmVjdCArIG9wZW4gRGVsdGEgU3RyZWFtIChlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgY29ubmVjdFN0cmVhbShob3N0bmFtZTpzdHJpbmc9bnVsbCwgcG9ydDpudW1iZXI9bnVsbCwgdXNlU1NMOmJvb2xlYW49ZmFsc2UsIHN1YnNjcmliZTpzdHJpbmc9bnVsbCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpXG4gICAgICAgICAgICAudGhlbiggKCk9PiB7IFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBwcmVmZXJyZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgICAgICBsZXQgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgICAgIGlmKCF1cmwpIHsgXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtLm9wZW4odXJsLCBzdWJzY3JpYmUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goIGU9PiB7IHJlamVjdCggZSApIH0pO1xuICAgICAgICB9KTtcbiAgICB9IFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBjb25uZWN0UGxheWJhY2soaG9zdG5hbWU6c3RyaW5nPW51bGwsIHBvcnQ6bnVtYmVyPW51bGwsIHVzZVNTTDpib29sZWFuPWZhbHNlLCBvcHRpb25zOmFueSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0KGhvc3RuYW1lLCBwb3J0LCB1c2VTU0wpXG4gICAgICAgICAgICAudGhlbiggKCk9PiB7IFxuICAgICAgICAgICAgICAgIC8vICoqIGNvbm5lY3QgdG8gcGxheWJhY2sgYXBpIGF0IHByZWZlcnJlZCB2ZXJzaW9uIGVsc2UgZmFsbCBiYWNrIHRvIGRlZmF1bHQgdmVyc2lvblxuICAgICAgICAgICAgICAgIHRoaXMub3BlblBsYXliYWNrKG51bGwsIG9wdGlvbnMsIHRoaXMuX3Rva2VuKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCBlPT4geyByZWplY3QoIGUgKSB9KTtcbiAgICAgICAgfSlcbiAgICB9ICAgICAgXG5cbiAgICAvLyAqKiBjb25uZWN0IHRvIGRlbHRhIHN0cmVhbSB3aXRoIChOTyBlbmRwb2ludCBkaXNjb3ZlcnkpXG4gICAgb3BlblN0cmVhbSh1cmw6c3RyaW5nPW51bGwsIHN1YnNjcmliZT86c3RyaW5nLCB0b2tlbj86c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVidWcoJ29wZW5TdHJlYW0uLi4uLi4uLi4nKTsgIFxuICAgICAgICBpZighdXJsKSB7ICAgICAvLyBjb25uZWN0IHRvIHN0cmVhbSBhcGkgYXQgZGlzY292ZXJlZCBlbmRwb2ludFxuICAgICAgICAgICAgdXJsPSB0aGlzLnJlc29sdmVTdHJlYW1FbmRwb2ludCgpO1xuICAgICAgICAgICAgaWYoIXVybCkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4oIG5ldyBFcnJvcignU2VydmVyIGhhcyBubyBhZHZlcnRpc2VkIFN0cmVhbSBlbmRwb2ludHMhJykgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbS5vcGVuKHVybCwgc3Vic2NyaWJlLCB0b2tlbik7ICBcbiAgICAgICAgcmV0dXJuIHRydWU7ICAgICAgXG4gICAgfSAgIFxuXG4gICAgLy8gKiogY29ubmVjdCB0byBwbGF5YmFjayBzdHJlYW0gKE5PIGVuZHBvaW50IGRpc2NvdmVyeSlcbiAgICBvcGVuUGxheWJhY2sodXJsOnN0cmluZz1udWxsLCBvcHRpb25zPzphbnksIHRva2VuPzpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWJ1Zygnb3BlblBsYXliYWNrLi4uLi4uLi4uJyk7XG4gICAgICAgIGlmKCF1cmwpIHsgICAgIC8vIGNvbm5lY3QgdG8gc3RyZWFtIGFwaSBhdCBkaXNjb3ZlcmVkIGVuZHBvaW50XG4gICAgICAgICAgICB1cmw9IHRoaXMucmVzb2x2ZVN0cmVhbUVuZHBvaW50KCk7XG4gICAgICAgICAgICBpZighdXJsKSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiggbmV3IEVycm9yKCdTZXJ2ZXIgaGFzIG5vIGFkdmVydGlzZWQgU3RyZWFtIGVuZHBvaW50cyEnKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXJsPSB1cmwucmVwbGFjZSgnc3RyZWFtJywgJ3BsYXliYWNrJyk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgICBsZXQgcGI9ICcnO1xuICAgICAgICBsZXQgc3Vic2NyaWJlOiBzdHJpbmc7XG4gICAgICAgIGlmKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09J29iamVjdCcpe1xuICAgICAgICAgICAgcGIrPSAob3B0aW9ucy5zdGFydFRpbWUpID8gJz9zdGFydFRpbWU9JyArIG9wdGlvbnMuc3RhcnRUaW1lLnNsaWNlKDAsb3B0aW9ucy5zdGFydFRpbWUuaW5kZXhPZignLicpKSArICdaJyA6ICcnO1xuICAgICAgICAgICAgcGIrPSAob3B0aW9ucy5wbGF5YmFja1JhdGUpID8gYCZwbGF5YmFja1JhdGU9JHtvcHRpb25zLnBsYXliYWNrUmF0ZX1gIDogJyc7XG4gICAgICAgICAgICBzdWJzY3JpYmU9IChvcHRpb25zLnN1YnNjcmliZSkgPyBvcHRpb25zLnN1YnNjcmliZSA6IG51bGw7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW0ub3Blbih1cmwgKyBwYiwgc3Vic2NyaWJlLCB0b2tlbik7IFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9ICAgICAgXG5cbiAgICAvLyAqKiBwcm9jZXNzIEhlbGxvIHJlc3BvbnNlIFxuICAgIHByaXZhdGUgcHJvY2Vzc0hlbGxvKHJlc3BvbnNlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzPSAocmVzcG9uc2VbJ2VuZHBvaW50cyddKSA/IHJlc3BvbnNlWydlbmRwb2ludHMnXSA6IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSAocmVzcG9uc2VbJ3NlcnZlciddKSA/IHJlc3BvbnNlWydzZXJ2ZXInXSA6IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5hcGlWZXJzaW9ucz0gKHRoaXMuc2VydmVyLmVuZHBvaW50cykgPyBPYmplY3Qua2V5cyh0aGlzLnNlcnZlci5lbmRwb2ludHMpIDogW107XG4gICAgICAgIHRoaXMuZGVidWcodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzKTtcbiAgICAgICAgdGhpcy5hcGkuc2VydmVyPSB0aGlzLnNlcnZlci5pbmZvO1xuICAgIH1cblxuICAgIC8vICoqIHJldHVybiBwcmVmZXJyZWQgV1Mgc3RyZWFtIHVybFxuICAgIHB1YmxpYyByZXNvbHZlU3RyZWFtRW5kcG9pbnQoKTpzdHJpbmcge1xuICAgICAgICBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbdGhpcy5fdmVyc2lvbl0gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dWydzaWduYWxrLXdzJ10pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgZW5kcG9pbnQgdmVyc2lvbjogJHt0aGlzLl92ZXJzaW9ufWApO1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay13cyddfWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ10gJiYgdGhpcy5zZXJ2ZXIuZW5kcG9pbnRzWyd2MSddWydzaWduYWxrLXdzJ10pIHsgXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIGZhbGxpbmcgYmFjayB0bzogdjFgKTtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnNlcnZlci5lbmRwb2ludHNbJ3YxJ11bJ3NpZ25hbGstd3MnXX1gIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gbnVsbCB9XG4gICAgfSAgXG5cbiAgICAvLyAqKiByZXR1cm4gc2lnbmFsay1odHRwIGVuZHBvaW50IHVybFxuICAgIHByaXZhdGUgcmVzb2x2ZUh0dHBFbmRwb2ludCgpOnN0cmluZyB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZW5kcG9pbnRzW3RoaXMuX3ZlcnNpb25dKSB7IC8vICoqIGNvbm5lY3Rpb24gbWFkZVxuICAgICAgICAgICAgLy8gKiogY29ubmVjdCB0byBodHRwIGVuZHBvaW50IGF0IHByZXNjcmliZWQgdmVyc2lvbiBlbHNlIGZhbGwgYmFjayB0byBkZWZhdWx0IHZlcnNpb25cbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ10pIHtcbiAgICAgICAgICAgICAgICB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1t0aGlzLl92ZXJzaW9uXVsnc2lnbmFsay1odHRwJ119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyB1cmw9IGAke3RoaXMuc2VydmVyLmVuZHBvaW50c1sndjEnXVsnc2lnbmFsay1odHRwJ119YCB9ICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1zZz0gJ05vIGN1cnJlbnQgY29ubmVjdGlvbiBodHRwIGVuZHBvaW50IHNlcnZpY2UhIFVzZSBjb25uZWN0KCkgdG8gZXN0YWJsaXNoIGEgY29ubmVjdGlvbi4nXG4gICAgICAgICAgICB0aGlzLmRlYnVnKG1zZyk7XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB1cmw7ICAgXG4gICAgfSAgICBcbiAgICBcbiAgICAvLyAqKiBjbGVhbnVwIG9uIHNlcnZlciBkaXNjb25uZWN0aW9uXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0ZWRGcm9tU2VydmVyKCkge1xuICAgICAgICB0aGlzLnNlcnZlci5lbmRwb2ludHM9IHt9O1xuICAgICAgICB0aGlzLnNlcnZlci5pbmZvPSB7fTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIuYXBpVmVyc2lvbnM9IFtdOyAgXG4gICAgfVxuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmcm9tIGh0dHAgcGF0aFxuICAgIGdldChwYXRoOnN0cmluZykgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYGdldCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH0gICAgICAgIFxuICAgIH07ICBcblxuICAgIC8vKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIHB1dCB0byBodHRwIHBhdGhcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5wcm90b2NvbH06Ly8ke3RoaXMuaG9zdG5hbWV9OiR7dGhpcy5wb3J0fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XG4gICAgICAgIHRoaXMuZGVidWcoYHB1dCAke3VybH1gKTtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIHZhbHVlKSB9ICAgICAgICBcbiAgICB9O1xuXG4gICAgLy8qKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgcG9zdCB0byBodHRwIHBhdGhcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xuICAgICAgICB0aGlzLmRlYnVnKGBwb3N0ICR7dXJsfWApO1xuICAgICAgICBpZih0aGlzLl90b2tlbikge1xuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfSAgICAgICAgXG4gICAgfTsgICBcblxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcbiAgICBsb2dpbih1c2VybmFtZTpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdDb250ZW50LVR5cGUnLCBgYXBwbGljYXRpb24vanNvbmApO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoXG4gICAgICAgICAgICBgJHt0aGlzLnByb3RvY29sfTovLyR7dGhpcy5ob3N0bmFtZX06JHt0aGlzLnBvcnR9L3NpZ25hbGsvJHt0aGlzLl92ZXJzaW9ufS9hdXRoL2xvZ2luYCxcbiAgICAgICAgICAgIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9LFxuICAgICAgICAgICAgeyBoZWFkZXJzIH1cbiAgICAgICAgKTtcbiAgICB9XG5cdFxuICAgIC8vICoqIGxvZ291dCBmcm9tIHNlcnZlciAqKlxuICAgIGxvZ291dCgpIHtcblx0XHRsZXQgdXJsPWAke3RoaXMucHJvdG9jb2x9Oi8vJHt0aGlzLmhvc3RuYW1lfToke3RoaXMucG9ydH0vc2lnbmFsay8ke3RoaXMuX3ZlcnNpb259L2F1dGgvbG9nb3V0YDtcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCggdXJsLCBudWxsLCB7IGhlYWRlcnMgfSApO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KCB1cmwsIG51bGwgKSB9XG4gICAgfVx0ICAgXG4gICAgXG4gICAgLy8qKiBnZXQgZGF0YSB2aWEgdGhlIHNuYXBzaG90IGh0dHAgYXBpIHBhdGggZm9yIHN1cHBsaWVkIHRpbWVcbiAgICBzbmFwc2hvdChjb250ZXh0OnN0cmluZywgdGltZTpzdHJpbmcpIHsgXG4gICAgICAgIGlmKCF0aW1lKSB7IHJldHVybiB9XG4gICAgICAgIHRpbWU9IHRpbWUuc2xpY2UoMCx0aW1lLmluZGV4T2YoJy4nKSkgKyAnWic7XG4gICAgICAgIGxldCB1cmw9IHRoaXMucmVzb2x2ZUh0dHBFbmRwb2ludCgpO1xuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XG4gICAgICAgIHVybD0gYCR7dXJsLnJlcGxhY2UoJ2FwaScsJ3NuYXBzaG90Jyl9JHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9P3RpbWU9JHt0aW1lfWA7XG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XG4gICAgfVxuXG59XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogU2lnbmFsS0NsaWVudCBNb2R1bGU6XHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbIEh0dHBDbGllbnRNb2R1bGUgXSwgICAgXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW10sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtdLCBcclxuICAgIHByb3ZpZGVyczogW10gIFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0NsaWVudE1vZHVsZSB7fVxyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9zaWduYWxrLWNsaWVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdXRpbHMnOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBS0EsTUFBYSxJQUFJO0lBZWI7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDakI7Ozs7SUFFRCxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBLEVBQUU7Ozs7SUFDOUIsS0FBSyxLQUFLLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUEsRUFBRTs7OztJQUN6QyxTQUFTLEtBQWEsT0FBTyx3QkFBd0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBLEVBQUU7Ozs7SUFDakUsT0FBTzs7WUFDQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztZQUMzQixJQUFJLEdBQUcsRUFBRTs7WUFDVCxNQUFNLEdBQUcsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7OztJQUVPLFdBQVcsQ0FBQyxJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQSxFQUFFOzs7Ozs7OztJQUU5QyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUEsRUFBRTs7Ozs7SUFFbkYsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUU7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsRUFBRTs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFFOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQSxFQUFFOzs7OztJQUMxRyxVQUFVLEtBQUssT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQSxFQUFFOzs7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