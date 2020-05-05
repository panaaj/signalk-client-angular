/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Path } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class SignalKHttp {
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
/** @nocollapse */ SignalKHttp.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(i0.ɵɵinject(i1.HttpClient)); }, token: SignalKHttp, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1hcGkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2h0dHAtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBRy9CLE1BQU0sT0FBTyxXQUFXOzs7OztJQVlwQixZQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUssQ0FBQzs7Ozs7O0lBSjNDLElBQUksU0FBUyxDQUFDLEdBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFFLEdBQUcsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBTzlDLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUEsQ0FBQyxDQUFDOzs7OztJQUc3QyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUMsQ0FBQzs7Ozs7OztJQUd2QyxPQUFPLENBQUMsT0FBYyxFQUFFLElBQVc7UUFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRixDQUFDOzs7Ozs7SUFHRCxHQUFHLENBQUMsSUFBVztRQUNYLElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQUUsT0FBTTtTQUFFO1FBQzdCLElBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsRUFBRTtZQUFFLElBQUksR0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFB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QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRTtJQUN6QyxDQUFDOzs7WUF0SEosVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7OztZQUh6QixVQUFVOzs7Ozs7OztJQU1mLDZCQUF1Qjs7SUFHdkIsNkJBQW1COztJQUNuQiwrQkFBd0I7Ozs7O0lBTVgsMkJBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUGF0aCB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtIdHRwIHtcclxuXHJcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nO1xyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIHB1YmxpYyBzZXJ2ZXI6IGFueTtcclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH0gICAgXHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7IH0gICBcclxuICAgIFxyXG4gICAgLy8gKiogZ2V0IHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGYuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5nZXQoYHZlc3NlbHMvc2VsZmApIH1cclxuXHJcbiAgICAvLyoqIGdldCBJRCBvZiB2ZXNzZWwgc2VsZiB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGZJZCgpIHsgcmV0dXJuIHRoaXMuZ2V0KGBzZWxmYCkgfVxyXG5cclxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcclxuICAgIGdldE1ldGEoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChgJHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfS9tZXRhYCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vKiogZ2V0IEFQSSBwYXRoIHZhbHVlIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vKiogc2VuZCB2YWx1ZSB0byBBUEkgcGF0aCB2aWEgaHR0cCBQVVQuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XHJcbiAgICBwdXQoYzpzdHJpbmcsIHA6YW55LCBrPzphbnksIHY/OmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGxldCBjb250ZXh0OnN0cmluZztcclxuICAgICAgICBsZXQgcGF0aDpzdHJpbmc7XHJcbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXHJcbiAgICAgICAgLy8gKiogcGF0aCAvIHZhbHVlXHJcbiAgICAgICAgaWYodHlwZW9mIGs9PSd1bmRlZmluZWQnICYmIHR5cGVvZiB2PT0ndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZihjWzBdPT0nLycpIHsgYz0gYy5zbGljZSgxKSB9XHJcbiAgICAgICAgICAgIHBhdGg9IFBhdGguZG90VG9TbGFzaChjKTtcclxuICAgICAgICAgICAgY29udGV4dD0gJyc7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gKiogY29udGV4dCAvIHBhdGggLyB2YWx1ZVxyXG4gICAgICAgIGVsc2UgaWYodHlwZW9mIHY9PSd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBjb250ZXh0PSAoYykgPyBQYXRoLmNvbnRleHRUb1BhdGgoYykgOiAnJztcclxuICAgICAgICAgICAgcGF0aD1QYXRoLmRvdFRvU2xhc2gocCk7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7ICAvLyAqKiBjb250ZXh0IC8gcGF0aCAvIGtleSAvIHZhbHVlXHJcbiAgICAgICAgICAgIGNvbnRleHQ9IChjKSA/IFBhdGguY29udGV4dFRvUGF0aChjKSA6ICcnO1xyXG4gICAgICAgICAgICBsZXQgdD0gUGF0aC5kb3RUb1NsYXNoKHApLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgIHQucHVzaChrKTtcclxuICAgICAgICAgICAgcGF0aD0gdC5qb2luKCcvJyk7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gdjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vICoqIHBhdGNoIGZvciBub2RlIHNlcnZlciBQVVQgaGFuZGxpbmcgb2YgcmVzb3VyY2VzXHJcbiAgICAgICAgbGV0IHI9IHBhdGguc3BsaXQoJy8nKTtcclxuICAgICAgICBpZihyWzBdPT0ncmVzb3VyY2VzJykgeyBcclxuICAgICAgICAgICAgY29udGV4dD0gJyc7ICBcclxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXIuaWQ9PSdzaWduYWxrLXNlcnZlci1ub2RlJykgeyAvLyAqKiBjaGVjayBmb3Igbm9kZSBzZXJ2ZXJcclxuICAgICAgICAgICAgICAgIC8vbGV0IHZlcj0gdGhpcy5zZXJ2ZXIuaW5mb1sndmVyc2lvbiddLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgICAgICAgICAvL2lmKHZlclsxXTwxMDApIHsgLy8gZGV0ZWN0IG9sZGVyIHZlcnNpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gKiogcmUtZm9ybWF0IHZhbHVlIHsgdXVpZDogeyA8cmVzb3VyY2VfZGF0YT4gfX1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdj0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtc2cudmFsdWUpKTtcclxuICAgICAgICAgICAgICAgICAgICBtc2cudmFsdWU9IHt9XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnLnZhbHVlW3Jbci5sZW5ndGgtMV1dPXY7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gKiogYWRkIHNlbGYgY29udGV4dCBhbmQgcmVtb3ZlIHV1aWQgZnJvbSBwYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aD0gJ3Zlc3NlbHMvc2VsZi8nICsgci5zbGljZSgwLCByLmxlbmd0aC0xKS5qb2luKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgICAgIGNvbnRleHQ9IChjb250ZXh0KSA/IGNvbnRleHQgKyAnLycgOiAnJztcclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgY29udGV4dCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2cpIH1cclxuICAgIH0gXHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIFBPU1QuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5lbmRwb2ludH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfVxyXG4gICAgfSAgICAgXHJcblxyXG4gICAgLy8qKiBkZWxldGUgdmFsdWUgZnJvbSBBUEkgcGF0aCB2aWEgaHR0cCBERUxFVEUuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBkZWxldGUocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5lbmRwb2ludH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodXJsKSB9XHJcbiAgICB9XHJcblxyXG59ICJdfQ==