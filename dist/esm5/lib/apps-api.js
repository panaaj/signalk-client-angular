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
    // ** return App List
    // ** return App List
    /**
     * @return {?}
     */
    SignalKApps.prototype.list = 
    // ** return App List
    /**
     * @return {?}
     */
    function () { return this.http.get(this.endpoint); };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwcy1hcGkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2FwcHMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7QUFFbEQ7SUFRRyw4REFBOEQ7SUFFN0QscUJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDOzs7O0lBRXpDLGlDQUFXOzs7SUFBWCxjQUFnQixDQUFDO0lBRWpCLHFCQUFxQjs7Ozs7SUFDckIsMEJBQUk7Ozs7O0lBQUosY0FBUyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDLENBQUM7O2dCQWZqRCxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O2dCQUZ6QixVQUFVOzs7c0JBSG5CO0NBc0JDLEFBakJELElBaUJDO1NBaEJZLFdBQVc7OztJQUtwQiwrQkFBd0I7Ozs7O0lBSVosMkJBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFNpZ25hbCBLIHNlcnZlciBBcHBzXHJcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtBcHBzICB7XHJcblxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHJcbiAgICAvLyAqKiBhcHBzIGFwaSBlbmRwb2ludCBwYXRoXHJcbiAgICBwdWJsaWMgZW5kcG9pbnQ6IHN0cmluZztcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH0gXHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7IH1cclxuICAgIFxyXG4gICAgLy8gKiogcmV0dXJuIEFwcCBMaXN0XHJcbiAgICBsaXN0KCkgeyByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLmVuZHBvaW50KSB9XHJcbiAgICBcclxufSJdfQ==