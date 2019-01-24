/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './utils';
import * as i0 from "@angular/core";
export class SignalKStream {
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
/** @nocollapse */ SignalKStream.ngInjectableDef = i0.defineInjectable({ factory: function SignalKStream_Factory() { return new SignalKStream(); }, token: SignalKStream, providedIn: "root" });
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLWFwaS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvc3RyZWFtLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxTQUFTLENBQUM7O0FBR2xDLE1BQU0sT0FBTyxhQUFhOztJQWdEdEI7UUF4Q1EsWUFBTyxHQUFFLElBQUksQ0FBQyxDQUFlLDJDQUEyQzs7UUFDeEUsZUFBVSxHQUFFLEtBQUssQ0FBQyxDQUFXLG9DQUFvQztRQUVqRSxrQkFBYSxHQUFXLEtBQUssQ0FBQztRQXNDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksT0FBTyxFQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNqRCxDQUFDOzs7Ozs7SUFqQ0QsSUFBSSxLQUFLLENBQUMsR0FBVSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUUsR0FBRyxDQUFB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Qzs7SUFDbEMsZ0NBQWdDOztJQUNoQyxnQ0FBZ0M7O0lBQ2hDLGtDQUFrQzs7SUFFbEMsaUNBQXdCOztJQUN4QiwrQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW0ge1xyXG5cclxuXHRwcml2YXRlIF9jb25uZWN0OiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIF9jbG9zZTogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG5cclxuICAgIHByaXZhdGUgd3M6IGFueTsgICAgXHJcbiAgICBwcml2YXRlIF9maWx0ZXI9IG51bGw7ICAgICAgICAgICAgICAgLy8gKiogaWQgb2YgdmVzc2VsIHRvIGZpbHRlciBkZWx0YSBtZXNzYWdlc1xyXG4gICAgcHJpdmF0ZSBfd3NUaW1lb3V0PSAyMDAwMDsgICAgICAgICAgIC8vICoqIHdlYnNvY2tldCBjb25uZWN0aW9uIHRpbWVvdXQgIFxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZzsgIFxyXG4gICAgcHJpdmF0ZSBfcGxheWJhY2tNb2RlOiBib29sZWFuPSBmYWxzZTtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgcHVibGljIG9uQ29ubmVjdDogT2JzZXJ2YWJsZTxhbnk+O1x0XHRcclxuICAgIHB1YmxpYyBvbkNsb3NlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2VsZklkOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCB0b2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuICAgIC8vICoqIGdldCAvIHNldCB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0aW1lb3V0IDMwMDA8PXRpbWVvdXQ8PTYwMDAwICoqXHJcbiAgICBnZXQgY29ubmVjdGlvblRpbWVvdXQoKTpudW1iZXIgeyByZXR1cm4gdGhpcy5fd3NUaW1lb3V0IH1cclxuICAgIHNldCBjb25uZWN0aW9uVGltZW91dCh2YWw6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fd3NUaW1lb3V0PSAodmFsPDMwMDApID8gMzAwMCA6ICh2YWw+NjAwMDApID8gNjAwMDAgOiB2YWw7XHJcbiAgICB9ICAgXHJcbiAgICAvLyAqKiBpcyBXUyBTdHJlYW0gY29ubmVjdGVkP1xyXG4gICAgZ2V0IGlzT3BlbigpOmJvb2xlYW4geyBcclxuICAgICAgICByZXR1cm4gKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9ICBcclxuICAgIC8vICoqIGdldCAvIHNldCBmaWx0ZXIgdG8gc2VsZWN0IGRlbHRhIG1lc3NhZ2VzIGp1c3QgZm9yIHN1cHBsaWVkIHZlc3NlbCBpZCAgIFxyXG4gICAgZ2V0IGZpbHRlcigpOnN0cmluZyB7IHJldHVybiB0aGlzLl9maWx0ZXIgfVxyXG4gICAgLy8gKiogc2V0IGZpbHRlcj0gbnVsbCB0byByZW1vdmUgbWVzc2FnZSBmaWx0ZXJpbmdcclxuICAgIHNldCBmaWx0ZXIoaWQ6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCBpZCAmJiBpZC5pbmRleE9mKCdzZWxmJykhPS0xICkgeyAgLy8gKiogc2VsZlxyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXI9ICh0aGlzLnNlbGZJZCkgPyB0aGlzLnNlbGZJZCA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyB0aGlzLl9maWx0ZXI9IGlkIH1cclxuICAgIH0gICBcclxuICAgIC8vICoqIHJldHVybnMgdHJ1ZSBpZiBQbGF5YmFjayBIZWxsbyBtZXNzYWdlXHJcbiAgICBnZXQgcGxheWJhY2tNb2RlKCk6Ym9vbGVhbiB7IHJldHVybiB0aGlzLl9wbGF5YmFja01vZGUgfVxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCApIHsgXHJcbiAgICAgICAgdGhpcy5fY29ubmVjdD0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gICAgICAgIHRoaXMub25Db25uZWN0PSB0aGlzLl9jb25uZWN0LmFzT2JzZXJ2YWJsZSgpOyAgIFxyXG4gICAgICAgIHRoaXMuX2Nsb3NlPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkNsb3NlPSB0aGlzLl9jbG9zZS5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICAgICAgICBcclxuICAgIH0gICBcclxuXHJcbiAgICAvLyAqKiBDbG9zZSBXZWJTb2NrZXQgY29ubmVjdGlvblxyXG4gICAgY2xvc2UoKSB7IGlmKHRoaXMud3MpIHsgdGhpcy53cy5jbG9zZSgpOyB0aGlzLndzPSBudWxsOyB9IH1cclxuICAgXHJcblx0Ly8gKiogT3BlbiBhIFdlYlNvY2tldCBhdCBwcm92aWRlZCB1cmxcclxuXHRvcGVuKHVybDpzdHJpbmcsIHN1YnNjcmliZT86c3RyaW5nLCB0b2tlbj86c3RyaW5nKSB7XHJcbiAgICAgICAgdXJsPSAodXJsKSA/IHVybCA6IHRoaXMuZW5kcG9pbnQ7XHJcbiAgICAgICAgaWYoIXVybCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGxldCBxPSAodXJsLmluZGV4T2YoJz8nKT09LTEpID8gJz8nIDogJyYnXHJcbiAgICAgICAgaWYoc3Vic2NyaWJlKSB7IHVybCs9YCR7cX1zdWJzY3JpYmU9JHtzdWJzY3JpYmV9YCB9IFxyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuIHx8IHRva2VuKSB7IHVybCs9IGAkeyhzdWJzY3JpYmUpID8gJyYnIDogJz8nfXRva2VuPSR7dGhpcy5fdG9rZW4gfHwgdG9rZW59YCB9IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xyXG4gICAgICAgIC8vICoqIHN0YXJ0IGNvbm5lY3Rpb24gd2F0Y2hkb2cgKipcclxuICAgICAgICBzZXRUaW1lb3V0KCBcclxuICAgICAgICAgICAgKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMud3MgJiYgKHRoaXMud3MucmVhZHlTdGF0ZSE9MSAmJiB0aGlzLndzLnJlYWR5U3RhdGUhPTMpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYENvbm5lY3Rpb24gd2F0Y2hkb2cgZXhwaXJlZCAoJHt0aGlzLl93c1RpbWVvdXQvMTAwMH0gc2VjKTogJHt0aGlzLndzLnJlYWR5U3RhdGV9Li4uIGFib3J0aW5nIGNvbm5lY3Rpb24uLi5gKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzLl93c1RpbWVvdXRcclxuICAgICAgICApO1xyXG5cdFx0XHJcblx0XHR0aGlzLndzLm9ub3Blbj0gZT0+IHsgdGhpcy5fY29ubmVjdC5uZXh0KGUpIH1cclxuXHRcdHRoaXMud3Mub25jbG9zZT0gZT0+IHsgdGhpcy5fY2xvc2UubmV4dChlKSB9XHJcblx0XHR0aGlzLndzLm9uZXJyb3I9IGU9PiB7IHRoaXMuX2Vycm9yLm5leHQoZSkgfVxyXG5cdFx0dGhpcy53cy5vbm1lc3NhZ2U9IGU9PiB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOiBhbnk7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlLmRhdGEgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkgeyBkYXRhPSBKU09OLnBhcnNlKGUuZGF0YSkgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2goZSkgeyByZXR1cm4gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNIZWxsbyhkYXRhKSkgeyBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZklkPSBkYXRhLnNlbGY7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5YmFja01vZGU9ICh0eXBlb2YgZGF0YS5zdGFydFRpbWUhPSAndW5kZWZpbmVkJykgPyB0cnVlIDogZmFsc2U7ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UubmV4dChkYXRhKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLl9maWx0ZXIgJiYgdGhpcy5pc0RlbHRhKGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnRleHQ9PSB0aGlzLl9maWx0ZXIpIHsgdGhpcy5fbWVzc2FnZS5uZXh0KGRhdGEpIH0gXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9tZXNzYWdlLm5leHQoZGF0YSkgfSBcclxuXHRcdH1cclxuICAgIH0gICAgICBcclxuXHJcbiAgICAvLyAqKiBzZW5kIGRhdGEgdG8gU2lnbmFsIEsgc3RyZWFtXHJcbiAgICBzZW5kKGRhdGE6YW55KSB7XHJcbiAgICAgICAgaWYodGhpcy53cykge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHsgZGF0YT0gSlNPTi5zdHJpbmdpZnkoZGF0YSkgfVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIHNlbmQgdmFsdWUocykgdmlhIGRlbHRhIHN0cmVhbSB1cGRhdGUgKipcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmcsIHBhdGg6QXJyYXk8YW55Pik7XHJcbiAgICBzZW5kVXBkYXRlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHNlbmRVcGRhdGUoY29udGV4dDpzdHJpbmc9J3NlbGYnLCBwYXRoOiBzdHJpbmcgfCBBcnJheTxhbnk+LCB2YWx1ZT86YW55KSB7XHJcbiAgICAgICAgbGV0IHZhbD0gTWVzc2FnZS51cGRhdGVzKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBsZXQgdVZhbHVlcz0gW107XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXMucHVzaCh7IHBhdGg6IHBhdGgsIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkocGF0aCkgKSB7XHJcbiAgICAgICAgICAgIHVWYWx1ZXM9IHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbC51cGRhdGVzLnB1c2goeyB2YWx1ZXM6IHVWYWx1ZXMgfSApOyBcclxuICAgICAgICB0aGlzLnNlbmQodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKiBTdWJzY3JpYmUgdG8gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzIG9wdGlvbnM6IHsuLn0qKlxyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOkFycmF5PGFueT4pO1xyXG4gICAgc3Vic2NyaWJlKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgb3B0aW9ucz86YW55KTtcclxuICAgIHN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6c3RyaW5nIHwgQXJyYXk8YW55Pj0nKicsIG9wdGlvbnM/OmFueSkge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2Uuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgdmFsLmNvbnRleHQ9IChjb250ZXh0PT0nc2VsZicpID8gJ3Zlc3NlbHMuc2VsZicgOiBjb250ZXh0O1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7IHZhbFsndG9rZW4nXT0gdGhpcy5fdG9rZW4gfVxyXG5cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheShwYXRoKSApIHtcclxuICAgICAgICAgICB2YWwuc3Vic2NyaWJlPSBwYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgbGV0IHNWYWx1ZT0ge307XHJcbiAgICAgICAgICAgIHNWYWx1ZVsncGF0aCddPSBwYXRoO1xyXG4gICAgICAgICAgICBpZihvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1sncGVyaW9kJ10pIHsgc1ZhbHVlWydwZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snbWluUGVyaW9kJ10pIHsgc1ZhbHVlWydtaW5QZXJpb2QnXT0gb3B0aW9uc1sncGVyaW9kJ10gfVxyXG4gICAgICAgICAgICAgICAgaWYob3B0aW9uc1snZm9ybWF0J10gJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnNbJ2Zvcm1hdCddPT0nZGVsdGEnIHx8IG9wdGlvbnNbJ2Zvcm1hdCddPT0nZnVsbCcpICkgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc1ZhbHVlWydmb3JtYXQnXT0gb3B0aW9uc1snZm9ybWF0J107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zWydwb2xpY3knXSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uc1sncG9saWN5J109PSdpbnN0YW50JyB8fCBvcHRpb25zWydwb2xpY3knXT09J2lkZWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIHx8IG9wdGlvbnNbJ3BvbGljeSddPT0nZml4ZWQnKSApIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNWYWx1ZVsncG9saWN5J109IG9wdGlvbnNbJ3BvbGljeSddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbC5zdWJzY3JpYmUucHVzaChzVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbmQodmFsKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vICoqIFVuc3Vic2NyaWJlIGZyb20gRGVsdGEgc3RyZWFtIG1lc3NhZ2VzICoqXHJcbiAgICB1bnN1YnNjcmliZShjb250ZXh0OnN0cmluZz0nKicsIHBhdGg6YW55PScqJykge1xyXG4gICAgICAgIGxldCB2YWw9IE1lc3NhZ2UudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB2YWwuY29udGV4dD0gKGNvbnRleHQ9PSdzZWxmJykgPyAndmVzc2Vscy5zZWxmJyA6IGNvbnRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHsgdmFsWyd0b2tlbiddPSB0aGlzLl90b2tlbiB9XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwYXRoID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KHBhdGgpICkge1xyXG4gICAgICAgICAgIHZhbC51bnN1YnNjcmliZT0gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7IHZhbC51bnN1YnNjcmliZS5wdXNoKHtwYXRoOiBwYXRofSkgfVxyXG4gICAgICAgIHRoaXMuc2VuZCh2YWwpOyBcclxuICAgIH1cclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKiogTUVTU0FHRSBQQVJTSU5HICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgLy8gKiogcmV0dXJucyB0cnVlIGlmIG1lc3NhZ2UgY29udGV4dCBpcyAnc2VsZidcclxuICAgIGlzU2VsZihtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIChtc2cuY29udGV4dD09IHRoaXMuc2VsZklkKSB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIERlbHRhIG1lc3NhZ2VcclxuICAgIGlzRGVsdGEobXNnOmFueSk6Ym9vbGVhbiB7IHJldHVybiB0eXBlb2YgbXNnLmNvbnRleHQhPSAndW5kZWZpbmVkJyB9XHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIEhlbGxvIG1lc3NhZ2VcclxuICAgIGlzSGVsbG8obXNnOmFueSk6Ym9vbGVhbiB7IFxyXG4gICAgICAgIHJldHVybiAodHlwZW9mIG1zZy52ZXJzaW9uIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zZy5zZWxmIT0gJ3VuZGVmaW5lZCcpO1xyXG4gICAgfSAgICAgXHJcbiAgICAvLyAqKiByZXR1cm5zIHRydWUgaWYgbWVzc2FnZSBpcyBhIHJlcXVlc3QgUmVzcG9uc2UgbWVzc2FnZVxyXG4gICAgaXNSZXNwb25zZShtc2c6YW55KTpib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBtc2cucmVxdWVzdElkIT0gJ3VuZGVmaW5lZCcgfSBcclxufSJdfQ==