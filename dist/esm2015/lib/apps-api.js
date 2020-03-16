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
export class SignalKApps {
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
/** @nocollapse */ SignalKApps.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKApps_Factory() { return new SignalKApps(i0.ɵɵinject(i1.HttpClient)); }, token: SignalKApps, providedIn: "root" });
if (false) {
    /** @type {?} */
    SignalKApps.prototype.endpoint;
    /**
     * @type {?}
     * @private
     */
    SignalKApps.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwcy1hcGkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2FwcHMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7QUFHbEQsTUFBTSxPQUFPLFdBQVc7Ozs7O0lBU3BCLFlBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDOzs7O0lBRXpDLFdBQVcsS0FBSyxDQUFDOzs7OztJQUdqQixJQUFJOztZQUNJLEVBQUUsR0FBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxHQUFHLElBQUksQ0FBQyxRQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVE7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7WUFuQkosVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7OztZQUZ6QixVQUFVOzs7OztJQVFmLCtCQUF3Qjs7Ozs7SUFJWiwyQkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogU2lnbmFsIEsgc2VydmVyIEFwcHNcclxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS0FwcHMgIHtcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcclxuICAgIC8vICoqIGFwcHMgYXBpIGVuZHBvaW50IHBhdGhcclxuICAgIHB1YmxpYyBlbmRwb2ludDogc3RyaW5nO1xyXG5cclxuICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfSBcclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHsgfVxyXG4gICAgXHJcbiAgICAvLyAqKiByZXR1cm4gTGlzdCBvZiBpbnN0YWxsZWQgYXBwc1xyXG4gICAgbGlzdCgpIHsgXHJcbiAgICAgICAgbGV0IGVwPSAodGhpcy5lbmRwb2ludC5pbmRleE9mKCd3ZWJhcHBzJyk9PS0xKSA/XHJcbiAgICAgICAgICAgIGAke3RoaXMuZW5kcG9pbnR9bGlzdGAgOiB0aGlzLmVuZHBvaW50O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGVwKTtcclxuICAgIH1cclxuICAgIFxyXG59Il19