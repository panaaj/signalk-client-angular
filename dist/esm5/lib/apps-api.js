/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** Signal K server Apps
 * ************************************/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var SignalKApps = /** @class */ (function () {
    // *******************************************************    
    function SignalKApps(http) {
        this.http = http;
    }
    /**
     * @return {?}
     */
    SignalKApps.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { };
    // ** return List of installed apps
    // ** return List of installed apps
    /**
     * @return {?}
     */
    SignalKApps.prototype.list = 
    // ** return List of installed apps
    /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var ep = (this.endpoint.indexOf('webapps') == -1) ?
            this.endpoint + "list" : this.endpoint;
        return this.http.get(ep);
    };
    SignalKApps.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    SignalKApps.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ SignalKApps.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKApps_Factory() { return new SignalKApps(i0.ɵɵinject(i1.HttpClient)); }, token: SignalKApps, providedIn: "root" });
    return SignalKApps;
}());
export { SignalKApps };
if (false) {
    /** @type {?} */
    SignalKApps.prototype.endpoint;
    /**
     * @type {?}
     * @private
     */
    SignalKApps.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwcy1hcGkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2FwcHMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7QUFFbEQ7SUFRRyw4REFBOEQ7SUFFN0QscUJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDOzs7O0lBRXpDLGlDQUFXOzs7SUFBWCxjQUFnQixDQUFDO0lBRWpCLG1DQUFtQzs7Ozs7SUFDbkMsMEJBQUk7Ozs7O0lBQUo7O1lBQ1EsRUFBRSxHQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLFNBQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVE7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QixDQUFDOztnQkFuQkosVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7OztnQkFGekIsVUFBVTs7O3NCQUhuQjtDQTBCQyxBQXJCRCxJQXFCQztTQXBCWSxXQUFXOzs7SUFLcEIsK0JBQXdCOzs7OztJQUlaLDJCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBTaWduYWwgSyBzZXJ2ZXIgQXBwc1xyXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLQXBwcyAge1xyXG5cclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFxyXG4gICAgLy8gKiogYXBwcyBhcGkgZW5kcG9pbnQgcGF0aFxyXG4gICAgcHVibGljIGVuZHBvaW50OiBzdHJpbmc7XHJcblxyXG4gICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9IFxyXG5cclxuICAgIG5nT25EZXN0cm95KCkgeyB9XHJcbiAgICBcclxuICAgIC8vICoqIHJldHVybiBMaXN0IG9mIGluc3RhbGxlZCBhcHBzXHJcbiAgICBsaXN0KCkgeyBcclxuICAgICAgICBsZXQgZXA9ICh0aGlzLmVuZHBvaW50LmluZGV4T2YoJ3dlYmFwcHMnKT09LTEpID9cclxuICAgICAgICAgICAgYCR7dGhpcy5lbmRwb2ludH1saXN0YCA6IHRoaXMuZW5kcG9pbnQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoZXApO1xyXG4gICAgfVxyXG4gICAgXHJcbn0iXX0=