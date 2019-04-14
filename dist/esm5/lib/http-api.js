/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Path } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var SignalKHttp = /** @class */ (function () {
    // *******************************************************
    function SignalKHttp(http) {
        this.http = http;
    }
    Object.defineProperty(SignalKHttp.prototype, "authToken", {
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
    // ** get the contents of the Signal K tree pointed to by self. returns: Observable 
    // ** get the contents of the Signal K tree pointed to by self. returns: Observable 
    /**
     * @return {?}
     */
    SignalKHttp.prototype.getSelf = 
    // ** get the contents of the Signal K tree pointed to by self. returns: Observable 
    /**
     * @return {?}
     */
    function () { return this.get("vessels/self"); };
    //** get ID of vessel self via http. returns: Observable 
    //** get ID of vessel self via http. returns: Observable 
    /**
     * @return {?}
     */
    SignalKHttp.prototype.getSelfId = 
    //** get ID of vessel self via http. returns: Observable 
    /**
     * @return {?}
     */
    function () { return this.get("self"); };
    // ** return observable response for meta object at the specified context and path
    // ** return observable response for meta object at the specified context and path
    /**
     * @param {?} context
     * @param {?} path
     * @return {?}
     */
    SignalKHttp.prototype.getMeta = 
    // ** return observable response for meta object at the specified context and path
    /**
     * @param {?} context
     * @param {?} path
     * @return {?}
     */
    function (context, path) {
        return this.get(Path.contextToPath(context) + "/" + Path.dotToSlash(path) + "/meta");
    };
    //** get API path value via http. returns: Observable 
    //** get API path value via http. returns: Observable 
    /**
     * @param {?} path
     * @return {?}
     */
    SignalKHttp.prototype.get = 
    //** get API path value via http. returns: Observable 
    /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        if (!this.endpoint) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        var url = this.endpoint + Path.dotToSlash(path);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.get(url, { headers: headers });
        }
        else {
            return this.http.get(url);
        }
    };
    /**
     * @param {?} c
     * @param {?} p
     * @param {?=} k
     * @param {?=} v
     * @return {?}
     */
    SignalKHttp.prototype.put = /**
     * @param {?} c
     * @param {?} p
     * @param {?=} k
     * @param {?=} v
     * @return {?}
     */
    function (c, p, k, v) {
        if (!this.endpoint) {
            return;
        }
        /** @type {?} */
        var context;
        /** @type {?} */
        var path;
        /** @type {?} */
        var msg = { value: {} }
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
            var t = Path.dotToSlash(p).split('/');
            t.push(k);
            path = t.join('/');
            msg.value = v;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        // ** patch for node server PUT handling of resources
        /** @type {?} */
        var r = path.split('/');
        if (r[0] == 'resources') {
            context = '';
            if (this.server && this.server.id == 'signalk-server-node') { // ** check for node server
                // ** check for node server
                // ** re-format value { uuid: { <resource_data> }}
                /** @type {?} */
                var v_1 = JSON.parse(JSON.stringify(msg.value));
                msg.value = {};
                msg.value[r[r.length - 1]] = v_1;
                // ** add self context and remove uuid from path
                path = 'vessels/self/' + r.slice(0, r.length - 1).join('/');
            }
        }
        // ****************************************
        context = (context) ? context + '/' : '';
        /** @type {?} */
        var url = this.endpoint + context + Path.dotToSlash(path);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.put(url, msg, { headers: headers });
        }
        else {
            return this.http.put(url, msg);
        }
    };
    //** send value to API path via http POST. returns: Observable 
    //** send value to API path via http POST. returns: Observable 
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    SignalKHttp.prototype.post = 
    //** send value to API path via http POST. returns: Observable 
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    function (path, value) {
        if (!this.endpoint) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        var url = "" + this.endpoint + Path.dotToSlash(path);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.post(url, value, { headers: headers });
        }
        else {
            return this.http.post(url, value);
        }
    };
    //** delete value from API path via http DELETE. returns: Observable 
    //** delete value from API path via http DELETE. returns: Observable 
    /**
     * @param {?} path
     * @return {?}
     */
    SignalKHttp.prototype.delete = 
    //** delete value from API path via http DELETE. returns: Observable 
    /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        if (!this.endpoint) {
            return;
        }
        if (path[0] == '/') {
            path = path.slice(1);
        }
        /** @type {?} */
        var url = "" + this.endpoint + Path.dotToSlash(path);
        if (this._token) {
            /** @type {?} */
            var headers = new HttpHeaders({ 'Authorization': "JWT " + this._token });
            return this.http.delete(url, { headers: headers });
        }
        else {
            return this.http.delete(url);
        }
    };
    SignalKHttp.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    SignalKHttp.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ SignalKHttp.ngInjectableDef = i0.defineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(i0.inject(i1.HttpClient)); }, token: SignalKHttp, providedIn: "root" });
    return SignalKHttp;
}());
export { SignalKHttp };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1hcGkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2h0dHAtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBRS9CO0lBV0ksMERBQTBEO0lBRTFELHFCQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUssQ0FBQztJQUozQyxzQkFBSSxrQ0FBUztRQURiLDZCQUE2Qjs7Ozs7OztRQUM3QixVQUFjLEdBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFFLEdBQUcsQ0FBQSxDQUFDLENBQUM7OztPQUFBO0lBTTlDLG9GQUFvRjs7Ozs7SUFDcEYsNkJBQU87Ozs7O0lBQVAsY0FBWSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRTdDLHlEQUF5RDs7Ozs7SUFDekQsK0JBQVM7Ozs7O0lBQVQsY0FBYyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRXZDLGtGQUFrRjs7Ozs7OztJQUNsRiw2QkFBTzs7Ozs7OztJQUFQLFVBQVEsT0FBYyxFQUFFLElBQVc7UUFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBTyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELHNEQUFzRDs7Ozs7O0lBQ3RELHlCQUFHOzs7Ozs7SUFBSCxVQUFJLElBQVc7UUFDWCxJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFB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Q0FBRTtZQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBRSxDQUFDO1NBQ3ZEO2FBQ0k7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQUU7SUFDekMsQ0FBQzs7Z0JBbkhKLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Ozs7Z0JBSHpCLFVBQVU7OztzQkFEbkI7Q0F5SEMsQUFySEQsSUFxSEM7U0FwSFksV0FBVzs7Ozs7O0lBRXBCLDZCQUF1Qjs7SUFHdkIsNkJBQW1COztJQUNuQiwrQkFBd0I7Ozs7O0lBTVgsMkJBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUGF0aCB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtIdHRwIHtcclxuXHJcbiAgICBwcml2YXRlIF90b2tlbjogc3RyaW5nO1xyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgIHB1YmxpYyBzZXJ2ZXI6IGFueTtcclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG4gICAgLy8gKiogc2V0IGF1dGggdG9rZW4gdmFsdWUgKipcclxuICAgIHNldCBhdXRoVG9rZW4odmFsOnN0cmluZykgeyB0aGlzLl90b2tlbj0gdmFsIH0gICAgXHJcblxyXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7IH0gICBcclxuICAgIFxyXG4gICAgLy8gKiogZ2V0IHRoZSBjb250ZW50cyBvZiB0aGUgU2lnbmFsIEsgdHJlZSBwb2ludGVkIHRvIGJ5IHNlbGYuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmKCkgeyByZXR1cm4gdGhpcy5nZXQoYHZlc3NlbHMvc2VsZmApIH1cclxuXHJcbiAgICAvLyoqIGdldCBJRCBvZiB2ZXNzZWwgc2VsZiB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldFNlbGZJZCgpIHsgcmV0dXJuIHRoaXMuZ2V0KGBzZWxmYCkgfVxyXG5cclxuICAgIC8vICoqIHJldHVybiBvYnNlcnZhYmxlIHJlc3BvbnNlIGZvciBtZXRhIG9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGNvbnRleHQgYW5kIHBhdGhcclxuICAgIGdldE1ldGEoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChgJHtQYXRoLmNvbnRleHRUb1BhdGgoY29udGV4dCl9LyR7UGF0aC5kb3RUb1NsYXNoKHBhdGgpfS9tZXRhYCk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC8vKiogZ2V0IEFQSSBwYXRoIHZhbHVlIHZpYSBodHRwLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0KHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IHRoaXMuZW5kcG9pbnQgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoIHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCkgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vKiogc2VuZCB2YWx1ZSB0byBBUEkgcGF0aCB2aWEgaHR0cCBQVVQuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBwdXQocGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcblx0cHV0KGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZywgdmFsdWU6YW55KTtcclxuICAgIHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIGtleTphbnksIHZhbHVlOmFueSk7XHJcbiAgICBwdXQoYzpzdHJpbmcsIHA6YW55LCBrPzphbnksIHY/OmFueSkgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGxldCBjb250ZXh0OnN0cmluZztcclxuICAgICAgICBsZXQgcGF0aDpzdHJpbmc7XHJcbiAgICAgICAgbGV0IG1zZyA9IHsgdmFsdWU6IHt9IH0gXHJcbiAgICAgICAgLy8gKiogcGF0aCAvIHZhbHVlXHJcbiAgICAgICAgaWYodHlwZW9mIGs9PSd1bmRlZmluZWQnICYmIHR5cGVvZiB2PT0ndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZihjWzBdPT0nLycpIHsgYz0gYy5zbGljZSgxKSB9XHJcbiAgICAgICAgICAgIHBhdGg9IFBhdGguZG90VG9TbGFzaChjKTtcclxuICAgICAgICAgICAgY29udGV4dD0gJyc7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gKiogY29udGV4dCAvIHBhdGggLyB2YWx1ZVxyXG4gICAgICAgIGVsc2UgaWYodHlwZW9mIHY9PSd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBjb250ZXh0PSAoYykgPyBQYXRoLmNvbnRleHRUb1BhdGgoYykgOiAnJztcclxuICAgICAgICAgICAgcGF0aD1QYXRoLmRvdFRvU2xhc2gocCk7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7ICAvLyAqKiBjb250ZXh0IC8gcGF0aCAvIGtleSAvIHZhbHVlXHJcbiAgICAgICAgICAgIGNvbnRleHQ9IChjKSA/IFBhdGguY29udGV4dFRvUGF0aChjKSA6ICcnO1xyXG4gICAgICAgICAgICBsZXQgdD0gUGF0aC5kb3RUb1NsYXNoKHApLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgIHQucHVzaChrKTtcclxuICAgICAgICAgICAgcGF0aD0gdC5qb2luKCcvJyk7XHJcbiAgICAgICAgICAgIG1zZy52YWx1ZT0gdjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vICoqIHBhdGNoIGZvciBub2RlIHNlcnZlciBQVVQgaGFuZGxpbmcgb2YgcmVzb3VyY2VzXHJcbiAgICAgICAgbGV0IHI9IHBhdGguc3BsaXQoJy8nKTtcclxuICAgICAgICBpZihyWzBdPT0ncmVzb3VyY2VzJykgeyBcclxuICAgICAgICAgICAgY29udGV4dD0gJyc7ICBcclxuICAgICAgICAgICAgaWYodGhpcy5zZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXIuaWQ9PSdzaWduYWxrLXNlcnZlci1ub2RlJykgeyAvLyAqKiBjaGVjayBmb3Igbm9kZSBzZXJ2ZXJcclxuICAgICAgICAgICAgICAgIC8vICoqIHJlLWZvcm1hdCB2YWx1ZSB7IHV1aWQ6IHsgPHJlc291cmNlX2RhdGE+IH19XHJcbiAgICAgICAgICAgICAgICBsZXQgdj0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtc2cudmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIG1zZy52YWx1ZT0ge31cclxuICAgICAgICAgICAgICAgIG1zZy52YWx1ZVtyW3IubGVuZ3RoLTFdXT12O1xyXG4gICAgICAgICAgICAgICAgLy8gKiogYWRkIHNlbGYgY29udGV4dCBhbmQgcmVtb3ZlIHV1aWQgZnJvbSBwYXRoXHJcbiAgICAgICAgICAgICAgICBwYXRoPSAndmVzc2Vscy9zZWxmLycgKyByLnNsaWNlKDAsIHIubGVuZ3RoLTEpLmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG4gICAgICAgIGNvbnRleHQ9IChjb250ZXh0KSA/IGNvbnRleHQgKyAnLycgOiAnJztcclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgY29udGV4dCArIFBhdGguZG90VG9TbGFzaChwYXRoKTtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIG1zZywgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2cpIH1cclxuICAgIH0gXHJcblxyXG4gICAgLy8qKiBzZW5kIHZhbHVlIHRvIEFQSSBwYXRoIHZpYSBodHRwIFBPU1QuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBwb3N0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5lbmRwb2ludH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHZhbHVlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSkgfVxyXG4gICAgfSAgICAgXHJcblxyXG4gICAgLy8qKiBkZWxldGUgdmFsdWUgZnJvbSBBUEkgcGF0aCB2aWEgaHR0cCBERUxFVEUuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBkZWxldGUocGF0aDpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBpZihwYXRoWzBdPT0nLycpIHsgcGF0aD0gcGF0aC5zbGljZSgxKSB9XHJcbiAgICAgICAgbGV0IHVybD0gYCR7dGhpcy5lbmRwb2ludH0ke1BhdGguZG90VG9TbGFzaChwYXRoKX1gO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHVybCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodXJsKSB9XHJcbiAgICB9ICAgICAgXHJcblxyXG59ICJdfQ==