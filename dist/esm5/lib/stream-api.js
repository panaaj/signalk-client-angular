/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './utils';
import * as i0 from "@angular/core";
var SignalKStream = /** @class */ (function () {
    // ******************************************************
    function SignalKStream() {
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
    Object.defineProperty(SignalKStream.prototype, "source", {
        // ** set source label for use in messages
        set: 
        // ** set source label for use in messages
        /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            if (!this._source) {
                this._source = {};
            }
            this._source['label'] = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalKStream.prototype, "authToken", {
        // ** set auth token value **
        set: 
        // ** set auth token value **
        /**
         * @param {?} val
         * @return {?}
         */
        function (val) { this._token = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalKStream.prototype, "connectionTimeout", {
        // ** get / set websocket connection timeout 3000<=timeout<=60000 **
        get: 
        // ** get / set websocket connection timeout 3000<=timeout<=60000 **
        /**
         * @return {?}
         */
        function () { return this._wsTimeout; },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._wsTimeout = (val < 3000) ? 3000 : (val > 60000) ? 60000 : val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalKStream.prototype, "isOpen", {
        // ** is WS Stream connected?
        get: 
        // ** is WS Stream connected?
        /**
         * @return {?}
         */
        function () {
            return (this.ws && (this.ws.readyState != 1 && this.ws.readyState != 3)) ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalKStream.prototype, "filter", {
        // ** get / set filter to select delta messages just for supplied vessel id   
        get: 
        // ** get / set filter to select delta messages just for supplied vessel id   
        /**
         * @return {?}
         */
        function () { return this._filter; },
        // ** set filter= null to remove message filtering
        set: 
        // ** set filter= null to remove message filtering
        /**
         * @param {?} id
         * @return {?}
         */
        function (id) {
            if (id && id.indexOf('self') != -1) { // ** self
                this._filter = (this.selfId) ? this.selfId : null;
            }
            else {
                this._filter = id;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalKStream.prototype, "playbackMode", {
        // ** returns true if Playback Hello message
        get: 
        // ** returns true if Playback Hello message
        /**
         * @return {?}
         */
        function () { return this._playbackMode; },
        enumerable: true,
        configurable: true
    });
    // ** Close WebSocket connection
    // ** Close WebSocket connection
    /**
     * @return {?}
     */
    SignalKStream.prototype.close = 
    // ** Close WebSocket connection
    /**
     * @return {?}
     */
    function () { if (this.ws) {
        this.ws.close();
        this.ws = null;
    } };
    // ** Open a WebSocket at provided url
    // ** Open a WebSocket at provided url
    /**
     * @param {?} url
     * @param {?=} subscribe
     * @param {?=} token
     * @return {?}
     */
    SignalKStream.prototype.open = 
    // ** Open a WebSocket at provided url
    /**
     * @param {?} url
     * @param {?=} subscribe
     * @param {?=} token
     * @return {?}
     */
    function (url, subscribe, token) {
        var _this = this;
        url = (url) ? url : this.endpoint;
        if (!url) {
            return;
        }
        /** @type {?} */
        var q = (url.indexOf('?') == -1) ? '?' : '&';
        if (subscribe) {
            url += q + "subscribe=" + subscribe;
        }
        if (this._token || token) {
            url += ((subscribe) ? '&' : '?') + "token=" + (this._token || token);
        }
        this.close();
        this.ws = new WebSocket(url);
        // ** start connection watchdog **
        setTimeout(function () {
            if (_this.ws && (_this.ws.readyState != 1 && _this.ws.readyState != 3)) {
                console.warn("Connection watchdog expired (" + _this._wsTimeout / 1000 + " sec): " + _this.ws.readyState + "... aborting connection...");
                _this.close();
            }
        }, this._wsTimeout);
        this.ws.onopen = function (e) { _this._connect.next(e); };
        this.ws.onclose = function (e) { _this._close.next(e); };
        this.ws.onerror = function (e) { _this._error.next(e); };
        this.ws.onmessage = function (e) { _this.parseOnMessage(e); };
    };
    // ** parse received message
    // ** parse received message
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    SignalKStream.prototype.parseOnMessage = 
    // ** parse received message
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        /** @type {?} */
        var data;
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
    };
    // ** send request via Delta stream
    // ** send request via Delta stream
    /**
     * @param {?} value
     * @return {?}
     */
    SignalKStream.prototype.sendRequest = 
    // ** send request via Delta stream
    /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (typeof value !== 'object') {
            return null;
        }
        /** @type {?} */
        var msg = Message.request();
        if (typeof value.login === 'undefined' && this._token) {
            msg['token'] = this._token;
        }
        /** @type {?} */
        var keys = Object.keys(value);
        keys.forEach(function (k) { msg[k] = value[k]; });
        this.send(msg);
        return msg.requestId;
    };
    // ** send put request via Delta stream
    // ** send put request via Delta stream
    /**
     * @param {?} context
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    SignalKStream.prototype.put = 
    // ** send put request via Delta stream
    /**
     * @param {?} context
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    function (context, path, value) {
        /** @type {?} */
        var msg = {
            context: (context == 'self') ? 'vessels.self' : context,
            put: { path: path, value: value }
        };
        return this.sendRequest(msg);
    };
    // ** get auth token for supplied user details **
    // ** get auth token for supplied user details **
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    SignalKStream.prototype.login = 
    // ** get auth token for supplied user details **
    /**
     * @param {?} username
     * @param {?} password
     * @return {?}
     */
    function (username, password) {
        /** @type {?} */
        var msg = {
            login: { "username": username, "password": password }
        };
        return this.sendRequest(msg);
    };
    // ** send data to Signal K stream
    // ** send data to Signal K stream
    /**
     * @param {?} data
     * @return {?}
     */
    SignalKStream.prototype.send = 
    // ** send data to Signal K stream
    /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (this.ws) {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            this.ws.send(data);
        }
    };
    /**
     * @param {?=} context
     * @param {?=} path
     * @param {?=} value
     * @return {?}
     */
    SignalKStream.prototype.sendUpdate = /**
     * @param {?=} context
     * @param {?=} path
     * @param {?=} value
     * @return {?}
     */
    function (context, path, value) {
        if (context === void 0) { context = 'self'; }
        /** @type {?} */
        var val = Message.updates();
        if (this._token) {
            val['token'] = this._token;
        }
        val.context = (context == 'self') ? 'vessels.self' : context;
        if (this._token) {
            val['token'] = this._token;
        }
        /** @type {?} */
        var uValues = [];
        if (typeof path === 'string') {
            uValues.push({ path: path, value: value });
        }
        if (typeof path === 'object' && Array.isArray(path)) {
            uValues = path;
        }
        /** @type {?} */
        var u = {
            timestamp: new Date().toISOString(),
            values: uValues
        };
        if (this._source) {
            u['source'] = this._source;
        }
        val.updates.push(u);
        this.send(val);
    };
    /**
     * @param {?=} context
     * @param {?=} path
     * @param {?=} options
     * @return {?}
     */
    SignalKStream.prototype.subscribe = /**
     * @param {?=} context
     * @param {?=} path
     * @param {?=} options
     * @return {?}
     */
    function (context, path, options) {
        if (context === void 0) { context = '*'; }
        if (path === void 0) { path = '*'; }
        /** @type {?} */
        var val = Message.subscribe();
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
            var sValue = {};
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
    };
    // ** Unsubscribe from Delta stream messages **
    // ** Unsubscribe from Delta stream messages **
    /**
     * @param {?=} context
     * @param {?=} path
     * @return {?}
     */
    SignalKStream.prototype.unsubscribe = 
    // ** Unsubscribe from Delta stream messages **
    /**
     * @param {?=} context
     * @param {?=} path
     * @return {?}
     */
    function (context, path) {
        if (context === void 0) { context = '*'; }
        if (path === void 0) { path = '*'; }
        /** @type {?} */
        var val = Message.unsubscribe();
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
    };
    /**
     * @param {?=} context
     * @param {?=} alarmId
     * @param {?=} alarm
     * @return {?}
     */
    SignalKStream.prototype.raiseAlarm = /**
     * @param {?=} context
     * @param {?=} alarmId
     * @param {?=} alarm
     * @return {?}
     */
    function (context, alarmId, alarm) {
        if (context === void 0) { context = '*'; }
        /** @type {?} */
        var n;
        if (typeof alarmId === 'string') {
            n = (alarmId.indexOf('notifications.') == -1) ? "notifications." + alarmId : alarmId;
        }
        else {
            n = alarmId;
        }
        this.sendUpdate(context, n, alarm.value);
    };
    // ** raise alarm for path
    // ** raise alarm for path
    /**
     * @param {?=} context
     * @param {?=} name
     * @return {?}
     */
    SignalKStream.prototype.clearAlarm = 
    // ** raise alarm for path
    /**
     * @param {?=} context
     * @param {?=} name
     * @return {?}
     */
    function (context, name) {
        if (context === void 0) { context = '*'; }
        /** @type {?} */
        var n = (name.indexOf('notifications.') == -1) ? "notifications." + name : name;
        this.sendUpdate(context, n, null);
    };
    // *************** MESSAGE PARSING ******************************
    // ** returns true if message context is 'self'
    // *************** MESSAGE PARSING ******************************
    // ** returns true if message context is 'self'
    /**
     * @param {?} msg
     * @return {?}
     */
    SignalKStream.prototype.isSelf = 
    // *************** MESSAGE PARSING ******************************
    // ** returns true if message context is 'self'
    /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) { return (msg.context == this.selfId); };
    // ** returns true if message is a Delta message
    // ** returns true if message is a Delta message
    /**
     * @param {?} msg
     * @return {?}
     */
    SignalKStream.prototype.isDelta = 
    // ** returns true if message is a Delta message
    /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) { return typeof msg.context != 'undefined'; };
    // ** returns true if message is a Hello message
    // ** returns true if message is a Hello message
    /**
     * @param {?} msg
     * @return {?}
     */
    SignalKStream.prototype.isHello = 
    // ** returns true if message is a Hello message
    /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) {
        return (typeof msg.version != 'undefined' && typeof msg.self != 'undefined');
    };
    // ** returns true if message is a request Response message
    // ** returns true if message is a request Response message
    /**
     * @param {?} msg
     * @return {?}
     */
    SignalKStream.prototype.isResponse = 
    // ** returns true if message is a request Response message
    /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) { return typeof msg.requestId != 'undefined'; };
    SignalKStream.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    SignalKStream.ctorParameters = function () { return []; };
    /** @nocollapse */ SignalKStream.ngInjectableDef = i0.defineInjectable({ factory: function SignalKStream_Factory() { return new SignalKStream(); }, token: SignalKStream, providedIn: "root" });
    return SignalKStream;
}());
export { SignalKStream };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLWFwaS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvc3RyZWFtLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQW9CLE1BQU0sU0FBUyxDQUFDOztBQUVwRDtJQXNESSx5REFBeUQ7SUFFekQ7UUEvQ1EsWUFBTyxHQUFFLElBQUksQ0FBQyxDQUFlLDJDQUEyQzs7UUFDeEUsZUFBVSxHQUFFLEtBQUssQ0FBQyxDQUFXLG9DQUFvQztRQUVqRSxrQkFBYSxHQUFXLEtBQUssQ0FBQztRQVcvQixZQUFPLEdBQU8sSUFBSSxDQUFDO1FBa0N0QixJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFPLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFPLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pELENBQUM7SUF2Q0Qsc0JBQUksaUNBQU07UUFEViwwQ0FBMEM7Ozs7Ozs7UUFDMUMs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LE9BQU8sSUFBRyxXQUFXLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFHLFdBQVcsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFDRCwyREFBMkQ7Ozs7OztJQUMzRCxrQ0FBVTs7Ozs7O0lBQVYsVUFBVyxHQUFPLElBQVksT0FBTyxPQUFPLEdBQUcsQ0FBQyxTQUFTLElBQUcsV0FBVyxDQUFBLENBQUMsQ0FBQzs7Z0JBaFE1RSxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7Ozt3QkFKbEM7Q0FxUUMsQUFqUUQsSUFpUUM7U0FoUVksYUFBYTs7Ozs7O0lBRXpCLGlDQUErQjs7Ozs7SUFDNUIsK0JBQTZCOzs7OztJQUNoQywrQkFBNkI7Ozs7O0lBQzFCLGlDQUErQjs7Ozs7SUFFL0IsMkJBQWdCOzs7OztJQUNoQixnQ0FBc0I7Ozs7O0lBQ3RCLG1DQUEwQjs7Ozs7SUFDMUIsK0JBQXVCOzs7OztJQUN2QixzQ0FBc0M7O0lBSXRDLGtDQUFrQzs7SUFDbEMsZ0NBQWdDOztJQUNoQyxnQ0FBZ0M7O0lBQ2hDLGtDQUFrQzs7SUFFbEMsaUNBQXdCOztJQUN4QiwrQkFBc0I7O0lBQ3RCLGdDQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlLCBBbGFybSwgQWxhcm1UeXBlIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbSB7XHJcblxyXG5cdHByaXZhdGUgX2Nvbm5lY3Q6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX2Nsb3NlOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgX21lc3NhZ2U6IFN1YmplY3Q8YW55PjtcclxuXHJcbiAgICBwcml2YXRlIHdzOiBhbnk7ICAgIFxyXG4gICAgcHJpdmF0ZSBfZmlsdGVyPSBudWxsOyAgICAgICAgICAgICAgIC8vICoqIGlkIG9mIHZlc3NlbCB0byBmaWx0ZXIgZGVsdGEgbWVzc2FnZXNcclxuICAgIHByaXZhdGUgX3dzVGltZW91dD0gMjAwMDA7ICAgICAgICAgICAvLyAqKiB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0ICBcclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7ICBcclxuICAgIHByaXZhdGUgX3BsYXliYWNrTW9kZTogYm9vbGVhbj0gZmFsc2U7XHJcbiAgICBcclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIHB1YmxpYyBvbkNvbm5lY3Q6IE9ic2VydmFibGU8YW55PjtcdFx0XHJcbiAgICBwdWJsaWMgb25DbG9zZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgcHVibGljIHNlbGZJZDogc3RyaW5nO1xyXG4gICAgcHVibGljIF9zb3VyY2U6IGFueT0gbnVsbDtcclxuXHJcbiAgICAvLyAqKiBzZXQgc291cmNlIGxhYmVsIGZvciB1c2UgaW4gbWVzc2FnZXNcclxuICAgIHNldCBzb3VyY2UodmFsOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5fc291cmNlKSB7IHRoaXMuX3NvdXJjZT0ge30gfVxyXG4gICAgICAgIHRoaXMuX3NvdXJjZVsnbGFiZWwnXT0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXHJcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgMzAwMDw9dGltZW91dDw9NjAwMDAgKipcclxuICAgIGdldCBjb25uZWN0aW9uVGltZW91dCgpOm51bWJlciB7IHJldHVybiB0aGlzLl93c1RpbWVvdXQgfVxyXG4gICAgc2V0IGNvbm5lY3Rpb25UaW1lb3V0KHZhbDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93c1RpbWVvdXQ9ICh2YWw8MzAwMCkgPyAzMDAwIDogKHZhbD42MDAwMCkgPyA2MDAwMCA6IHZhbDtcclxuICAgIH0gICBcclxuICAgIC8vICoqIGlzIFdTIFN0cmVhbSBjb25uZWN0ZWQ/XHJcbiAgICBnZXQgaXNPcGVuKCk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gIFxyXG4gICAgLy8gKiogZ2V0IC8gc2V0IGZpbHRlciB0byBzZWxlY3QgZGVsdGEgbWVzc2FnZXMganVzdCBmb3Igc3VwcGxpZWQgdmVzc2VsIGlkICAgXHJcbiAgICBnZXQgZmlsdGVyKCk6c3RyaW5nIHsgcmV0dXJuIHRoaXMuX2ZpbHRlciB9XHJcbiAgICAvLyAqKiBzZXQgZmlsdGVyPSBudWxsIHRvIHJlbW92ZSBtZXNzYWdlIGZpbHRlcmluZ1xyXG4gICAgc2V0IGZpbHRlcihpZDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIGlkICYmIGlkLmluZGV4T2YoJ3NlbGYnKSE9LTEgKSB7ICAvLyAqKiBzZWxmXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcj0gKHRoaXMuc2VsZklkKSA/IHRoaXMuc2VsZklkIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX2ZpbHRlcj0gaWQgfVxyXG4gICAgfSAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIFBsYXliYWNrIEhlbGxvIG1lc3NhZ2VcclxuICAgIGdldCBwbGF5YmFja01vZGUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuX3BsYXliYWNrTW9kZSB9XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoICkgeyBcclxuICAgICAgICB0aGlzLl9jb25uZWN0PSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3Q9IHRoaXMuX2Nvbm5lY3QuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICAgICAgdGhpcy5fY2xvc2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2U9IHRoaXMuX2Nsb3NlLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgICAgICAgIFxyXG4gICAgfSAgIFxyXG5cclxuICAgIC8vICoqIENsb3NlIFdlYlNvY2tldCBjb25uZWN0aW9uXHJcbiAgICBjbG9zZSgpIHsgaWYodGhpcy53cykgeyB0aGlzLndzLmNsb3NlKCk7IHRoaXMud3M9IG51bGw7IH0gfVxyXG4gICBcclxuXHQvLyAqKiBPcGVuIGEgV2ViU29ja2V0IGF0IHByb3ZpZGVkIHVybFxyXG5cdG9wZW4odXJsOnN0cmluZywgc3Vic2NyaWJlPzpzdHJpbmcsIHRva2VuPzpzdHJpbmcpIHtcclxuICAgICAgICB1cmw9ICh1cmwpID8gdXJsIDogdGhpcy5lbmRwb2ludDtcclxuICAgICAgICBpZighdXJsKSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IHE9ICh1cmwuaW5kZXhPZignPycpPT0tMSkgPyAnPycgOiAnJidcclxuICAgICAgICBpZihzdWJzY3JpYmUpIHsgdXJsKz1gJHtxfXN1YnNjcmliZT0ke3N1YnNjcmliZX1gIH0gXHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4gfHwgdG9rZW4pIHsgdXJsKz0gYCR7KHN1YnNjcmliZSkgPyAnJicgOiAnPyd9dG9rZW49JHt0aGlzLl90b2tlbiB8fCB0b2tlbn1gIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgICAgICAgLy8gKiogc3RhcnQgY29ubmVjdGlvbiB3YXRjaGRvZyAqKlxyXG4gICAgICAgIHNldFRpbWVvdXQoIFxyXG4gICAgICAgICAgICAoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy53cyAmJiAodGhpcy53cy5yZWFkeVN0YXRlIT0xICYmIHRoaXMud3MucmVhZHlTdGF0ZSE9MykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29ubmVjdGlvbiB3YXRjaGRvZyBleHBpcmVkICgke3RoaXMuX3dzVGltZW91dC8xMDAwfSBzZWMpOiAke3RoaXMud3MucmVhZHlTdGF0ZX0uLi4gYWJvcnRpbmcgY29ubmVjdGlvbi4uLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3dzVGltZW91dFxyXG4gICAgICAgICk7XHJcblx0XHRcclxuXHRcdHRoaXMud3Mub25vcGVuPSBlPT4geyB0aGlzLl9jb25uZWN0Lm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbmNsb3NlPSBlPT4geyB0aGlzLl9jbG9zZS5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25lcnJvcj0gZT0+IHsgdGhpcy5fZXJyb3IubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9ubWVzc2FnZT0gZT0+IHt0aGlzLnBhcnNlT25NZXNzYWdlKGUpIH1cclxuICAgIH0gIFxyXG4gICAgXHJcbiAgICAvLyAqKiBwYXJzZSByZWNlaXZlZCBtZXNzYWdlXHJcbiAgICBwcml2YXRlIHBhcnNlT25NZXNzYWdlKGUpIHtcclxuICAgICAgICBsZXQgZGF0YTogYW55O1xyXG4gICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRyeSB7IGRhdGE9IEpTT04ucGFyc2UoZS5kYXRhKSB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHsgcmV0dXJuIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5pc0hlbGxvKGRhdGEpKSB7IFxyXG4gICAgICAgICAgICB0aGlzLnNlbGZJZD0gZGF0YS5zZWxmO1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFja01vZGU9ICh0eXBlb2YgZGF0YS5zdGFydFRpbWUhPSAndW5kZWZpbmVkJykgPyB0cnVlIDogZmFsc2U7ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpO1xyXG4gICAgICAgIH0gICAgICBcclxuICAgICAgICBlbHNlIGlmKHRoaXMuaXNSZXNwb25zZShkYXRhKSkgeyBcclxuICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEubG9naW4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgZGF0YS5sb2dpbi50b2tlbiAhPT0gJ3VuZGVmaW5lZCcpIHsgdGhpcy5fdG9rZW49IGRhdGEubG9naW4udG9rZW4gfVxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSk7XHJcbiAgICAgICAgfSAgICAgICAgICAgICBcclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2ZpbHRlciAmJiB0aGlzLmlzRGVsdGEoZGF0YSkpIHtcclxuICAgICAgICAgICAgaWYoZGF0YS5jb250ZXh0PT0gdGhpcy5fZmlsdGVyKSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG4gICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKSB9IFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgcmVxdWVzdCB2aWEgRGVsdGEgc3RyZWFtXHJcbiAgICBzZW5kUmVxdWVzdCh2YWx1ZTphbnkpOnN0cmluZyB7XHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gbnVsbCB9XHJcbiAgICAgICAgbGV0IG1zZz0gTWVzc2FnZS5yZXF1ZXN0KCk7XHJcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlLmxvZ2luID09PSAndW5kZWZpbmVkJyAmJiB0aGlzLl90b2tlbikgeyBtc2dbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuICAgICAgICBsZXQga2V5cz0gT2JqZWN0LmtleXModmFsdWUpO1xyXG4gICAgICAgIGtleXMuZm9yRWFjaCggaz0+IHsgbXNnW2tdPSB2YWx1ZVtrXSB9KTtcclxuICAgICAgICB0aGlzLnNlbmQobXNnKTtcclxuICAgICAgICByZXR1cm4gbXNnLnJlcXVlc3RJZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZW5kIHB1dCByZXF1ZXN0IHZpYSBEZWx0YSBzdHJlYW1cclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgbXNnPSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQ6IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0LFxyXG4gICAgICAgICAgICBwdXQ6IHsgcGF0aDogcGF0aCwgdmFsdWU6IHZhbHVlIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KG1zZyk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vICoqIGdldCBhdXRoIHRva2VuIGZvciBzdXBwbGllZCB1c2VyIGRldGFpbHMgKipcclxuICAgIGxvZ2luKHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IG1zZz0geyBcclxuICAgICAgICAgICAgbG9naW46IHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCB9IFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXHJcbiAgICBzZW5kKGRhdGE6YW55KSB7XHJcbiAgICAgICAgaWYodGhpcy53cykge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgdmFsdWUocykgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOiBzdHJpbmcgfCBBcnJheTxhbnk+LCB2YWx1ZT86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51cGRhdGVzKCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBsZXQgdVZhbHVlcz0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXMucHVzaCh7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXM9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1PSB7IFxyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgXHJcbiAgICAgICAgICAgIHZhbHVlczogdVZhbHVlcyBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc291cmNlKSB7IHVbJ3NvdXJjZSddPSB0aGlzLl9zb3VyY2UgfVxyXG4gICAgICAgIHZhbC51cGRhdGVzLnB1c2goIHUgKTsgXHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogU3Vic2NyaWJlIHRvIERlbHRhIHN0cmVhbSBtZXNzYWdlcyBvcHRpb25zOiB7Li59KipcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZywgcGF0aDpBcnJheTxhbnk+KTtcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIG9wdGlvbnM/OmFueSk7XHJcbiAgICBzdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOnN0cmluZyB8IEFycmF5PGFueT49JyonLCBvcHRpb25zPzphbnkpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnN1YnNjcmliZSgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG4gICAgICAgIHZhbC5jb250ZXh0PSAoY29udGV4dD09J3NlbGYnKSA/ICd2ZXNzZWxzLnNlbGYnIDogY29udGV4dDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikgeyB2YWxbJ3Rva2VuJ109IHRoaXMuX3Rva2VuIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgdmFsLnN1YnNjcmliZT0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGxldCBzVmFsdWU9IHt9O1xyXG4gICAgICAgICAgICBzVmFsdWVbJ3BhdGgnXT0gcGF0aDtcclxuICAgICAgICAgICAgaWYob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ3BlcmlvZCddKSB7IHNWYWx1ZVsncGVyaW9kJ109IG9wdGlvbnNbJ3BlcmlvZCddIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ21pblBlcmlvZCddKSB7IHNWYWx1ZVsnbWluUGVyaW9kJ109IG9wdGlvbnNbJ3BlcmlvZCddIH1cclxuICAgICAgICAgICAgICAgIGlmKG9wdGlvbnNbJ2Zvcm1hdCddICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zWydmb3JtYXQnXT09J2RlbHRhJyB8fCBvcHRpb25zWydmb3JtYXQnXT09J2Z1bGwnKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNWYWx1ZVsnZm9ybWF0J109IG9wdGlvbnNbJ2Zvcm1hdCddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1sncG9saWN5J10gJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnNbJ3BvbGljeSddPT0naW5zdGFudCcgfHwgb3B0aW9uc1sncG9saWN5J109PSdpZGVhbCdcclxuICAgICAgICAgICAgICAgICAgICB8fCBvcHRpb25zWydwb2xpY3knXT09J2ZpeGVkJykgKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzVmFsdWVbJ3BvbGljeSddPSBvcHRpb25zWydwb2xpY3knXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWwuc3Vic2NyaWJlLnB1c2goc1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZW5kKHZhbCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBVbnN1YnNjcmliZSBmcm9tIERlbHRhIHN0cmVhbSBtZXNzYWdlcyAqKlxyXG4gICAgdW5zdWJzY3JpYmUoY29udGV4dDpzdHJpbmc9JyonLCBwYXRoOmFueT0nKicpIHtcclxuICAgICAgICBsZXQgdmFsPSBNZXNzYWdlLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICB2YWwudW5zdWJzY3JpYmU9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykgeyB2YWwudW5zdWJzY3JpYmUucHVzaCh7cGF0aDogcGF0aH0pIH1cclxuICAgICAgICB0aGlzLnNlbmQodmFsKTsgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcmFpc2UgYWxhcm0gZm9yIHBhdGhcclxuICAgIHJhaXNlQWxhcm0oY29udGV4dDpzdHJpbmcsIG5hbWU6c3RyaW5nLCBhbGFybTpBbGFybSk7XHJcbiAgICByYWlzZUFsYXJtKGNvbnRleHQ6c3RyaW5nLCB0eXBlOkFsYXJtVHlwZSwgYWxhcm06QWxhcm0pO1xyXG4gICAgcmFpc2VBbGFybShjb250ZXh0OnN0cmluZz0nKicsIGFsYXJtSWQ6YW55LCBhbGFybTpBbGFybSkge1xyXG4gICAgICAgIGxldCBuOnN0cmluZztcclxuICAgICAgICBpZih0eXBlb2YgYWxhcm1JZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbj0oYWxhcm1JZC5pbmRleE9mKCdub3RpZmljYXRpb25zLicpPT0tMSkgPyBgbm90aWZpY2F0aW9ucy4ke2FsYXJtSWR9YCA6IGFsYXJtSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyBuPSBhbGFybUlkIH1cclxuICAgICAgICB0aGlzLnNlbmRVcGRhdGUoY29udGV4dCwgbiwgYWxhcm0udmFsdWUgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiByYWlzZSBhbGFybSBmb3IgcGF0aFxyXG4gICAgY2xlYXJBbGFybShjb250ZXh0OnN0cmluZz0nKicsIG5hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IG49KG5hbWUuaW5kZXhPZignbm90aWZpY2F0aW9ucy4nKT09LTEpID8gYG5vdGlmaWNhdGlvbnMuJHtuYW1lfWAgOiBuYW1lO1xyXG4gICAgICAgIHRoaXMuc2VuZFVwZGF0ZShjb250ZXh0LCBuLCBudWxsKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqIE1FU1NBR0UgUEFSU0lORyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBtZXNzYWdlIGNvbnRleHQgaXMgJ3NlbGYnXHJcbiAgICBpc1NlbGYobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiAobXNnLmNvbnRleHQ9PSB0aGlzLnNlbGZJZCkgfVxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSBEZWx0YSBtZXNzYWdlXHJcbiAgICBpc0RlbHRhKG1zZzphbnkpOmJvb2xlYW4geyByZXR1cm4gdHlwZW9mIG1zZy5jb250ZXh0IT0gJ3VuZGVmaW5lZCcgfVxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSBIZWxsbyBtZXNzYWdlXHJcbiAgICBpc0hlbGxvKG1zZzphbnkpOmJvb2xlYW4geyBcclxuICAgICAgICByZXR1cm4gKHR5cGVvZiBtc2cudmVyc2lvbiE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtc2cuc2VsZiE9ICd1bmRlZmluZWQnKTtcclxuICAgIH0gICAgIFxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgaXMgYSByZXF1ZXN0IFJlc3BvbnNlIG1lc3NhZ2VcclxuICAgIGlzUmVzcG9uc2UobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiB0eXBlb2YgbXNnLnJlcXVlc3RJZCE9ICd1bmRlZmluZWQnIH0gXHJcbn0iXX0=