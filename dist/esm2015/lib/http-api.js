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
/** @nocollapse */ SignalKHttp.ngInjectableDef = i0.defineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(i0.inject(i1.HttpClient)); }, token: SignalKHttp, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1hcGkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2h0dHAtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBRy9CLE1BQU0sT0FBTyxXQUFXOzs7OztJQVlwQixZQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUssQ0FBQzs7Ozs7O0lBSjNDLElBQUksU0FBUyxDQUFDLEdBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFFLEdBQUcsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBTzlDLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUEsQ0FBQyxDQUFDOzs7OztJQUc3QyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUMsQ0FBQzs7Ozs7OztJQUd2QyxPQUFPLENBQUMsT0FBYyxFQUFFLElBQVc7UUFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRixDQUFDOzs7Ozs7SUFHRCxHQUFHLENBQUMsSUFBVztRQUNYLElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQUUsT0FBTTtTQUFFO1FBQzdCLElBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsRUFBRTtZQUFFLElBQUksR0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFB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QUFHLENBQUMsQ0FBQTtTQUFFO0lBQ3pDLENBQUM7OztZQW5ISixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O1lBSHpCLFVBQVU7Ozs7Ozs7O0lBTWYsNkJBQXVCOztJQUd2Qiw2QkFBbUI7O0lBQ25CLCtCQUF3Qjs7Ozs7SUFNWCwyQkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0h0dHAge1xyXG5cclxuICAgIHByaXZhdGUgX3Rva2VuOiBzdHJpbmc7XHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgcHVibGljIHNlcnZlcjogYW55O1xyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcbiAgICAvLyAqKiBzZXQgYXV0aCB0b2tlbiB2YWx1ZSAqKlxyXG4gICAgc2V0IGF1dGhUb2tlbih2YWw6c3RyaW5nKSB7IHRoaXMuX3Rva2VuPSB2YWwgfSAgICBcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgfSAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBnZXQgdGhlIGNvbnRlbnRzIG9mIHRoZSBTaWduYWwgSyB0cmVlIHBvaW50ZWQgdG8gYnkgc2VsZi4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGYoKSB7IHJldHVybiB0aGlzLmdldChgdmVzc2Vscy9zZWxmYCkgfVxyXG5cclxuICAgIC8vKiogZ2V0IElEIG9mIHZlc3NlbCBzZWxmIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZklkKCkgeyByZXR1cm4gdGhpcy5nZXQoYHNlbGZgKSB9XHJcblxyXG4gICAgLy8gKiogcmV0dXJuIG9ic2VydmFibGUgcmVzcG9uc2UgZm9yIG1ldGEgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgY29udGV4dCBhbmQgcGF0aFxyXG4gICAgZ2V0TWV0YShjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGAke1BhdGguY29udGV4dFRvUGF0aChjb250ZXh0KX0vJHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9L21ldGFgKTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLy8qKiBnZXQgQVBJIHBhdGggdmFsdWUgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXQocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gdGhpcy5lbmRwb2ludCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCggdXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5nZXQodXJsKSB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIFBVVC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIHB1dChwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuXHRwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG4gICAgcHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywga2V5OmFueSwgdmFsdWU6YW55KTtcclxuICAgIHB1dChjOnN0cmluZywgcDphbnksIGs/OmFueSwgdj86YW55KSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgbGV0IGNvbnRleHQ6c3RyaW5nO1xyXG4gICAgICAgIGxldCBwYXRoOnN0cmluZztcclxuICAgICAgICBsZXQgbXNnID0geyB2YWx1ZToge30gfSBcclxuICAgICAgICAvLyAqKiBwYXRoIC8gdmFsdWVcclxuICAgICAgICBpZih0eXBlb2Ygaz09J3VuZGVmaW5lZCcgJiYgdHlwZW9mIHY9PSd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGlmKGNbMF09PScvJykgeyBjPSBjLnNsaWNlKDEpIH1cclxuICAgICAgICAgICAgcGF0aD0gUGF0aC5kb3RUb1NsYXNoKGMpO1xyXG4gICAgICAgICAgICBjb250ZXh0PSAnJztcclxuICAgICAgICAgICAgbXNnLnZhbHVlPSBwO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAqKiBjb250ZXh0IC8gcGF0aCAvIHZhbHVlXHJcbiAgICAgICAgZWxzZSBpZih0eXBlb2Ygdj09J3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ9IChjKSA/IFBhdGguY29udGV4dFRvUGF0aChjKSA6ICcnO1xyXG4gICAgICAgICAgICBwYXRoPVBhdGguZG90VG9TbGFzaChwKTtcclxuICAgICAgICAgICAgbXNnLnZhbHVlPSBrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgIC8vICoqIGNvbnRleHQgLyBwYXRoIC8ga2V5IC8gdmFsdWVcclxuICAgICAgICAgICAgY29udGV4dD0gKGMpID8gUGF0aC5jb250ZXh0VG9QYXRoKGMpIDogJyc7XHJcbiAgICAgICAgICAgIGxldCB0PSBQYXRoLmRvdFRvU2xhc2gocCkuc3BsaXQoJy8nKTtcclxuICAgICAgICAgICAgdC5wdXNoKGspO1xyXG4gICAgICAgICAgICBwYXRoPSB0LmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgbXNnLnZhbHVlPSB2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gKiogcGF0Y2ggZm9yIG5vZGUgc2VydmVyIFBVVCBoYW5kbGluZyBvZiByZXNvdXJjZXNcclxuICAgICAgICBsZXQgcj0gcGF0aC5zcGxpdCgnLycpO1xyXG4gICAgICAgIGlmKHJbMF09PSdyZXNvdXJjZXMnKSB7IFxyXG4gICAgICAgICAgICBjb250ZXh0PSAnJzsgIFxyXG4gICAgICAgICAgICBpZih0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5pZD09J3NpZ25hbGstc2VydmVyLW5vZGUnKSB7IC8vICoqIGNoZWNrIGZvciBub2RlIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgLy8gKiogcmUtZm9ybWF0IHZhbHVlIHsgdXVpZDogeyA8cmVzb3VyY2VfZGF0YT4gfX1cclxuICAgICAgICAgICAgICAgIGxldCB2PSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1zZy52YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgbXNnLnZhbHVlPSB7fVxyXG4gICAgICAgICAgICAgICAgbXNnLnZhbHVlW3Jbci5sZW5ndGgtMV1dPXY7XHJcbiAgICAgICAgICAgICAgICAvLyAqKiBhZGQgc2VsZiBjb250ZXh0IGFuZCByZW1vdmUgdXVpZCBmcm9tIHBhdGhcclxuICAgICAgICAgICAgICAgIHBhdGg9ICd2ZXNzZWxzL3NlbGYvJyArIHIuc2xpY2UoMCwgci5sZW5ndGgtMSkuam9pbignLycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICAgICAgY29udGV4dD0gKGNvbnRleHQpID8gY29udGV4dCArICcvJyA6ICcnO1xyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBjb250ZXh0ICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZykgfVxyXG4gICAgfSBcclxuXHJcbiAgICAvLyoqIHNlbmQgdmFsdWUgdG8gQVBJIHBhdGggdmlhIGh0dHAgUE9TVC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIHBvc3QocGF0aDpzdHJpbmcsIHZhbHVlOmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLmVuZHBvaW50fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlKSB9XHJcbiAgICB9ICAgICBcclxuXHJcbiAgICAvLyoqIGRlbGV0ZSB2YWx1ZSBmcm9tIEFQSSBwYXRoIHZpYSBodHRwIERFTEVURS4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGRlbGV0ZShwYXRoOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSBgJHt0aGlzLmVuZHBvaW50fSR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfWA7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodXJsLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh1cmwpIH1cclxuICAgIH0gICAgICBcclxuXHJcbn0gIl19