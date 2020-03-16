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
                //let ver= this.server.info['version'].split('.');
                //if(ver[1]<100) { // detect older versions
                // ** re-format value { uuid: { <resource_data> }}
                /** @type {?} */
                var v_1 = JSON.parse(JSON.stringify(msg.value));
                msg.value = {};
                msg.value[r[r.length - 1]] = v_1;
                // ** add self context and remove uuid from path
                path = 'vessels/self/' + r.slice(0, r.length - 1).join('/');
                //}
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
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    SignalKHttp.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ SignalKHttp.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKHttp_Factory() { return new SignalKHttp(i0.ɵɵinject(i1.HttpClient)); }, token: SignalKHttp, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1hcGkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2h0dHAtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBRS9CO0lBV0ksMERBQTBEO0lBRTFELHFCQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUssQ0FBQztJQUozQyxzQkFBSSxrQ0FBUztRQURiLDZCQUE2Qjs7Ozs7OztRQUM3QixVQUFjLEdBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFFLEdBQUcsQ0FBQSxDQUFDLENBQUM7OztPQUFBO0lBTTlDLG9GQUFvRjs7Ozs7SUFDcEYsNkJBQU87Ozs7O0lBQVAsY0FBWSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRTdDLHlEQUF5RDs7Ozs7SUFDekQsK0JBQVM7Ozs7O0lBQVQsY0FBYyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRXZDLGtGQUFrRjs7Ozs7OztJQUNsRiw2QkFBTzs7Ozs7OztJQUFQLFVBQVEsT0FBYyxFQUFFLElBQVc7UUFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBTyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELHNEQUFzRDs7Ozs7O0lBQ3RELHlCQUFHOzs7Ozs7SUFBSCxVQUFJLElBQVc7UUFDWCxJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFB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QUMsTUFBUSxFQUFFLENBQUU7WUFDekUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUUsQ0FBQztTQUN2RDthQUNJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFO0lBQ3pDLENBQUM7O2dCQXRISixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O2dCQUh6QixVQUFVOzs7c0JBRG5CO0NBNEhDLEFBeEhELElBd0hDO1NBdkhZLFdBQVc7Ozs7OztJQUVwQiw2QkFBdUI7O0lBR3ZCLDZCQUFtQjs7SUFDbkIsK0JBQXdCOzs7OztJQU1YLDJCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFBhdGggfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLSHR0cCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdG9rZW46IHN0cmluZztcclxuXHJcbiAgICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICBwdWJsaWMgc2VydmVyOiBhbnk7XHJcbiAgICBwdWJsaWMgZW5kcG9pbnQ6IHN0cmluZztcclxuICAgIC8vICoqIHNldCBhdXRoIHRva2VuIHZhbHVlICoqXHJcbiAgICBzZXQgYXV0aFRva2VuKHZhbDpzdHJpbmcpIHsgdGhpcy5fdG9rZW49IHZhbCB9ICAgIFxyXG5cclxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50ICkgeyB9ICAgXHJcbiAgICBcclxuICAgIC8vICoqIGdldCB0aGUgY29udGVudHMgb2YgdGhlIFNpZ25hbCBLIHRyZWUgcG9pbnRlZCB0byBieSBzZWxmLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZ2V0U2VsZigpIHsgcmV0dXJuIHRoaXMuZ2V0KGB2ZXNzZWxzL3NlbGZgKSB9XHJcblxyXG4gICAgLy8qKiBnZXQgSUQgb2YgdmVzc2VsIHNlbGYgdmlhIGh0dHAuIHJldHVybnM6IE9ic2VydmFibGUgXHJcbiAgICBnZXRTZWxmSWQoKSB7IHJldHVybiB0aGlzLmdldChgc2VsZmApIH1cclxuXHJcbiAgICAvLyAqKiByZXR1cm4gb2JzZXJ2YWJsZSByZXNwb25zZSBmb3IgbWV0YSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBjb250ZXh0IGFuZCBwYXRoXHJcbiAgICBnZXRNZXRhKGNvbnRleHQ6c3RyaW5nLCBwYXRoOnN0cmluZykgeyBcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoYCR7UGF0aC5jb250ZXh0VG9QYXRoKGNvbnRleHQpfS8ke1BhdGguZG90VG9TbGFzaChwYXRoKX0vbWV0YWApO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICAvLyoqIGdldCBBUEkgcGF0aCB2YWx1ZSB2aWEgaHR0cC4gcmV0dXJuczogT2JzZXJ2YWJsZSBcclxuICAgIGdldChwYXRoOnN0cmluZykgeyBcclxuICAgICAgICBpZighdGhpcy5lbmRwb2ludCkgeyByZXR1cm4gfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBsZXQgdXJsPSB0aGlzLmVuZHBvaW50ICsgUGF0aC5kb3RUb1NsYXNoKHBhdGgpO1xyXG4gICAgICAgIGlmKHRoaXMuX3Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJzPSBuZXcgSHR0cEhlYWRlcnMoIHsgJ0F1dGhvcml6YXRpb24nOiBgSldUICR7dGhpcy5fdG9rZW59YCB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KCB1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyoqIHNlbmQgdmFsdWUgdG8gQVBJIHBhdGggdmlhIGh0dHAgUFVULiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgcHV0KHBhdGg6c3RyaW5nLCB2YWx1ZTphbnkpO1xyXG5cdHB1dChjb250ZXh0OnN0cmluZywgcGF0aDpzdHJpbmcsIHZhbHVlOmFueSk7XHJcbiAgICBwdXQoY29udGV4dDpzdHJpbmcsIHBhdGg6c3RyaW5nLCBrZXk6YW55LCB2YWx1ZTphbnkpO1xyXG4gICAgcHV0KGM6c3RyaW5nLCBwOmFueSwgaz86YW55LCB2PzphbnkpIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuZW5kcG9pbnQpIHsgcmV0dXJuIH1cclxuICAgICAgICBsZXQgY29udGV4dDpzdHJpbmc7XHJcbiAgICAgICAgbGV0IHBhdGg6c3RyaW5nO1xyXG4gICAgICAgIGxldCBtc2cgPSB7IHZhbHVlOiB7fSB9IFxyXG4gICAgICAgIC8vICoqIHBhdGggLyB2YWx1ZVxyXG4gICAgICAgIGlmKHR5cGVvZiBrPT0ndW5kZWZpbmVkJyAmJiB0eXBlb2Ygdj09J3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgaWYoY1swXT09Jy8nKSB7IGM9IGMuc2xpY2UoMSkgfVxyXG4gICAgICAgICAgICBwYXRoPSBQYXRoLmRvdFRvU2xhc2goYyk7XHJcbiAgICAgICAgICAgIGNvbnRleHQ9ICcnO1xyXG4gICAgICAgICAgICBtc2cudmFsdWU9IHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICoqIGNvbnRleHQgLyBwYXRoIC8gdmFsdWVcclxuICAgICAgICBlbHNlIGlmKHR5cGVvZiB2PT0ndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgY29udGV4dD0gKGMpID8gUGF0aC5jb250ZXh0VG9QYXRoKGMpIDogJyc7XHJcbiAgICAgICAgICAgIHBhdGg9UGF0aC5kb3RUb1NsYXNoKHApO1xyXG4gICAgICAgICAgICBtc2cudmFsdWU9IGs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyAgLy8gKiogY29udGV4dCAvIHBhdGggLyBrZXkgLyB2YWx1ZVxyXG4gICAgICAgICAgICBjb250ZXh0PSAoYykgPyBQYXRoLmNvbnRleHRUb1BhdGgoYykgOiAnJztcclxuICAgICAgICAgICAgbGV0IHQ9IFBhdGguZG90VG9TbGFzaChwKS5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICB0LnB1c2goayk7XHJcbiAgICAgICAgICAgIHBhdGg9IHQuam9pbignLycpO1xyXG4gICAgICAgICAgICBtc2cudmFsdWU9IHY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHBhdGhbMF09PScvJykgeyBwYXRoPSBwYXRoLnNsaWNlKDEpIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyAqKiBwYXRjaCBmb3Igbm9kZSBzZXJ2ZXIgUFVUIGhhbmRsaW5nIG9mIHJlc291cmNlc1xyXG4gICAgICAgIGxldCByPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgaWYoclswXT09J3Jlc291cmNlcycpIHsgXHJcbiAgICAgICAgICAgIGNvbnRleHQ9ICcnOyAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuc2VydmVyICYmIHRoaXMuc2VydmVyLmlkPT0nc2lnbmFsay1zZXJ2ZXItbm9kZScpIHsgLy8gKiogY2hlY2sgZm9yIG5vZGUgc2VydmVyXHJcbiAgICAgICAgICAgICAgICAvL2xldCB2ZXI9IHRoaXMuc2VydmVyLmluZm9bJ3ZlcnNpb24nXS5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICAgICAgLy9pZih2ZXJbMV08MTAwKSB7IC8vIGRldGVjdCBvbGRlciB2ZXJzaW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICoqIHJlLWZvcm1hdCB2YWx1ZSB7IHV1aWQ6IHsgPHJlc291cmNlX2RhdGE+IH19XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHY9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobXNnLnZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnLnZhbHVlPSB7fVxyXG4gICAgICAgICAgICAgICAgICAgIG1zZy52YWx1ZVtyW3IubGVuZ3RoLTFdXT12O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICoqIGFkZCBzZWxmIGNvbnRleHQgYW5kIHJlbW92ZSB1dWlkIGZyb20gcGF0aFxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGg9ICd2ZXNzZWxzL3NlbGYvJyArIHIuc2xpY2UoMCwgci5sZW5ndGgtMSkuam9pbignLycpO1xyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuICAgICAgICBjb250ZXh0PSAoY29udGV4dCkgPyBjb250ZXh0ICsgJy8nIDogJyc7XHJcbiAgICAgICAgbGV0IHVybD0gdGhpcy5lbmRwb2ludCArIGNvbnRleHQgKyBQYXRoLmRvdFRvU2xhc2gocGF0aCk7XHJcbiAgICAgICAgaWYodGhpcy5fdG9rZW4pIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlcnM9IG5ldyBIdHRwSGVhZGVycyggeyAnQXV0aG9yaXphdGlvbic6IGBKV1QgJHt0aGlzLl90b2tlbn1gIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBtc2csIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgbXNnKSB9XHJcbiAgICB9IFxyXG5cclxuICAgIC8vKiogc2VuZCB2YWx1ZSB0byBBUEkgcGF0aCB2aWEgaHR0cCBQT1NULiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgcG9zdChwYXRoOnN0cmluZywgdmFsdWU6YW55KSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMuZW5kcG9pbnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCB2YWx1ZSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0gKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlIHsgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgdmFsdWUpIH1cclxuICAgIH0gICAgIFxyXG5cclxuICAgIC8vKiogZGVsZXRlIHZhbHVlIGZyb20gQVBJIHBhdGggdmlhIGh0dHAgREVMRVRFLiByZXR1cm5zOiBPYnNlcnZhYmxlIFxyXG4gICAgZGVsZXRlKHBhdGg6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmVuZHBvaW50KSB7IHJldHVybiB9XHJcbiAgICAgICAgaWYocGF0aFswXT09Jy8nKSB7IHBhdGg9IHBhdGguc2xpY2UoMSkgfVxyXG4gICAgICAgIGxldCB1cmw9IGAke3RoaXMuZW5kcG9pbnR9JHtQYXRoLmRvdFRvU2xhc2gocGF0aCl9YDtcclxuICAgICAgICBpZih0aGlzLl90b2tlbikge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVycz0gbmV3IEh0dHBIZWFkZXJzKCB7ICdBdXRob3JpemF0aW9uJzogYEpXVCAke3RoaXMuX3Rva2VufWAgfSApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh1cmwsIHsgaGVhZGVyczogaGVhZGVycyB9ICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7IHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHVybCkgfVxyXG4gICAgfSAgICAgIFxyXG5cclxufSAiXX0=