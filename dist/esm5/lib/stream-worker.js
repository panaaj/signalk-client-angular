/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** Web Worker Service
 * ************************************/
import { Injectable, isDevMode } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
var SignalKStreamWorker = /** @class */ (function () {
    // *******************************************************    
    function SignalKStreamWorker() {
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
        this.onMessage = this._message.asObservable();
        if (isDevMode()) {
            console.warn("DEPRECATION WARNING: SignalKClient.worker is replaced by the signalk-worker-angular package and will be removed in signalk-client-angular v1.6");
        }
    }
    /**
     * @return {?}
     */
    SignalKStreamWorker.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { this.worker.terminate(); this.worker = undefined; };
    // ** Initialise worker
    // ** Initialise worker
    /**
     * @param {?} pathToFile
     * @return {?}
     */
    SignalKStreamWorker.prototype.init = 
    // ** Initialise worker
    /**
     * @param {?} pathToFile
     * @return {?}
     */
    function (pathToFile) {
        var _this = this;
        if (typeof (Worker) == "undefined") {
            return false;
        }
        if (this.worker) {
            this.worker.terminate();
        } // ** terminate an open worker
        this.worker = new Worker(pathToFile);
        this.worker.onmessage = (/**
         * @param {?} event
         * @return {?}
         */
        function (event) { _this._message.next(event); });
        this.worker.onerror = (/**
         * @param {?} event
         * @return {?}
         */
        function (event) { _this._error.next(event); });
        // ** worker ready for postMessage()
    };
    // ** Send message to worker
    // ** Send message to worker
    /**
     * @param {?} msg
     * @return {?}
     */
    SignalKStreamWorker.prototype.postMessage = 
    // ** Send message to worker
    /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) { if (this.worker) {
        this.worker.postMessage(msg);
    } };
    // ** terminate worker
    // ** terminate worker
    /**
     * @return {?}
     */
    SignalKStreamWorker.prototype.terminate = 
    // ** terminate worker
    /**
     * @return {?}
     */
    function () { if (this.worker) {
        this.worker.terminate();
    } };
    SignalKStreamWorker.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    SignalKStreamWorker.ctorParameters = function () { return []; };
    /** @nocollapse */ SignalKStreamWorker.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKStreamWorker_Factory() { return new SignalKStreamWorker(); }, token: SignalKStreamWorker, providedIn: "root" });
    return SignalKStreamWorker;
}());
export { SignalKStreamWorker };
if (false) {
    /**
     * @type {?}
     * @private
     */
    SignalKStreamWorker.prototype._error;
    /**
     * @type {?}
     * @private
     */
    SignalKStreamWorker.prototype._message;
    /**
     * @type {?}
     * @private
     */
    SignalKStreamWorker.prototype.worker;
    /** @type {?} */
    SignalKStreamWorker.prototype.onError;
    /** @type {?} */
    SignalKStreamWorker.prototype.onMessage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvc3RyZWFtLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsT0FBTyxFQUFjLE1BQU0sTUFBTSxDQUFDOztBQUUzQztJQVlHLDhEQUE4RDtJQUU3RDtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFHLFNBQVMsRUFBRSxFQUFFO1lBQ1osT0FBTyxDQUFDLElBQUksQ0FBQyxnSkFBZ0osQ0FBQyxDQUFDO1NBQ2xLO0lBQ0wsQ0FBQzs7OztJQUVELHlDQUFXOzs7SUFBWCxjQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRW5FLHVCQUF1Qjs7Ozs7O0lBQ3ZCLGtDQUFJOzs7Ozs7SUFBSixVQUFLLFVBQWlCO1FBQXRCLGlCQVFDO1FBUEcsSUFBRyxPQUFNLENBQUMsTUFBTSxDQUFDLElBQUcsV0FBVyxFQUFFO1lBQUUsT0FBTyxLQUFLLENBQUE7U0FBRTtRQUNqRCxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO1NBQUUsQ0FBRyw4QkFBOEI7UUFFNUUsSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7Ozs7UUFBRSxVQUFBLEtBQUssSUFBSyxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQSxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTzs7OztRQUFFLFVBQUEsS0FBSyxJQUFLLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBLENBQUM7UUFDekQsb0NBQW9DO0lBQ3hDLENBQUM7SUFFRCw0QkFBNEI7Ozs7OztJQUM1Qix5Q0FBVzs7Ozs7O0lBQVgsVUFBWSxHQUFPLElBQUksSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7S0FBRSxDQUFDLENBQUM7SUFFeEUsc0JBQXNCOzs7OztJQUN0Qix1Q0FBUzs7Ozs7SUFBVCxjQUFjLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7S0FBQyxDQUFDLENBQUM7O2dCQXpDNUQsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7Ozs7OEJBTGxDO0NBK0NDLEFBMUNELElBMENDO1NBekNZLG1CQUFtQjs7Ozs7O0lBRS9CLHFDQUE2Qjs7Ozs7SUFDN0IsdUNBQStCOzs7OztJQUM1QixxQ0FBdUI7O0lBSXZCLHNDQUFnQzs7SUFDaEMsd0NBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFdlYiBXb3JrZXIgU2VydmljZVxyXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmltcG9ydCB7IEluamVjdGFibGUsIGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbVdvcmtlciAge1xyXG5cclxuXHRwcml2YXRlIF9lcnJvcjogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX21lc3NhZ2U6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgd29ya2VyOiBXb3JrZXI7XHJcbiAgICBcclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG5cclxuICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICBpZihpc0Rldk1vZGUoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYERFUFJFQ0FUSU9OIFdBUk5JTkc6IFNpZ25hbEtDbGllbnQud29ya2VyIGlzIHJlcGxhY2VkIGJ5IHRoZSBzaWduYWxrLXdvcmtlci1hbmd1bGFyIHBhY2thZ2UgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBzaWduYWxrLWNsaWVudC1hbmd1bGFyIHYxLjZgKTtcclxuICAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTsgdGhpcy53b3JrZXIgPSB1bmRlZmluZWQ7IH1cclxuXHJcbiAgICAvLyAqKiBJbml0aWFsaXNlIHdvcmtlclxyXG4gICAgaW5pdChwYXRoVG9GaWxlOnN0cmluZykgeyBcclxuICAgICAgICBpZih0eXBlb2YoV29ya2VyKT09IFwidW5kZWZpbmVkXCIpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICBpZih0aGlzLndvcmtlcikgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKSB9ICAgLy8gKiogdGVybWluYXRlIGFuIG9wZW4gd29ya2VyXHJcblxyXG4gICAgICAgIHRoaXMud29ya2VyPSBuZXcgV29ya2VyKHBhdGhUb0ZpbGUpO1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9ubWVzc2FnZT0gZXZlbnQ9PiB7IHRoaXMuX21lc3NhZ2UubmV4dChldmVudCkgfTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbmVycm9yPSBldmVudD0+IHsgdGhpcy5fZXJyb3IubmV4dChldmVudCkgfTsgICAgICAgICAgIFxyXG4gICAgICAgIC8vICoqIHdvcmtlciByZWFkeSBmb3IgcG9zdE1lc3NhZ2UoKVxyXG4gICAgfSAgICBcclxuICAgIFxyXG4gICAgLy8gKiogU2VuZCBtZXNzYWdlIHRvIHdvcmtlclxyXG4gICAgcG9zdE1lc3NhZ2UobXNnOmFueSkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnBvc3RNZXNzYWdlKG1zZykgfSB9XHJcblxyXG4gICAgLy8gKiogdGVybWluYXRlIHdvcmtlclxyXG4gICAgdGVybWluYXRlKCkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnRlcm1pbmF0ZSgpfSB9XHJcbn0iXX0=