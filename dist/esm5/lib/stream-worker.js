/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** Web Worker Service
 * ************************************/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
var SignalKStreamWorker = /** @class */ (function () {
    // *******************************************************    
    function SignalKStreamWorker() {
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
        this.onMessage = this._message.asObservable();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvc3RyZWFtLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7O0FBRTNDO0lBWUcsOERBQThEO0lBRTdEO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pELENBQUM7Ozs7SUFFRCx5Q0FBVzs7O0lBQVgsY0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVuRSx1QkFBdUI7Ozs7OztJQUN2QixrQ0FBSTs7Ozs7O0lBQUosVUFBSyxVQUFpQjtRQUF0QixpQkFRQztRQVBHLElBQUcsT0FBTSxDQUFDLE1BQU0sQ0FBQyxJQUFHLFdBQVcsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFBO1NBQUU7UUFDakQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtTQUFFLENBQUcsOEJBQThCO1FBRTVFLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTOzs7O1FBQUUsVUFBQSxLQUFLLElBQUssS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUEsQ0FBQztRQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Ozs7UUFBRSxVQUFBLEtBQUssSUFBSyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQSxDQUFDO1FBQ3pELG9DQUFvQztJQUN4QyxDQUFDO0lBRUQsNEJBQTRCOzs7Ozs7SUFDNUIseUNBQVc7Ozs7OztJQUFYLFVBQVksR0FBTyxJQUFJLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQUUsQ0FBQyxDQUFDO0lBRXhFLHNCQUFzQjs7Ozs7SUFDdEIsdUNBQVM7Ozs7O0lBQVQsY0FBYyxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQUMsQ0FBQyxDQUFDOztnQkF0QzVELFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Ozs7OzhCQUxsQztDQTRDQyxBQXZDRCxJQXVDQztTQXRDWSxtQkFBbUI7Ozs7OztJQUUvQixxQ0FBNkI7Ozs7O0lBQzdCLHVDQUErQjs7Ozs7SUFDNUIscUNBQXVCOztJQUl2QixzQ0FBZ0M7O0lBQ2hDLHdDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBXZWIgV29ya2VyIFNlcnZpY2VcclxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLU3RyZWFtV29ya2VyICB7XHJcblxyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSB3b3JrZXI6IFdvcmtlcjtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcblxyXG4gICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICBcclxuICAgIH0gXHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB0aGlzLndvcmtlciA9IHVuZGVmaW5lZDsgfVxyXG5cclxuICAgIC8vICoqIEluaXRpYWxpc2Ugd29ya2VyXHJcbiAgICBpbml0KHBhdGhUb0ZpbGU6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKHR5cGVvZihXb3JrZXIpPT0gXCJ1bmRlZmluZWRcIikgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmKHRoaXMud29ya2VyKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpIH0gICAvLyAqKiB0ZXJtaW5hdGUgYW4gb3BlbiB3b3JrZXJcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZXI9IG5ldyBXb3JrZXIocGF0aFRvRmlsZSk7XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25tZXNzYWdlPSBldmVudD0+IHsgdGhpcy5fbWVzc2FnZS5uZXh0KGV2ZW50KSB9O1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9uZXJyb3I9IGV2ZW50PT4geyB0aGlzLl9lcnJvci5uZXh0KGV2ZW50KSB9OyAgICAgICAgICAgXHJcbiAgICAgICAgLy8gKiogd29ya2VyIHJlYWR5IGZvciBwb3N0TWVzc2FnZSgpXHJcbiAgICB9ICAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBTZW5kIG1lc3NhZ2UgdG8gd29ya2VyXHJcbiAgICBwb3N0TWVzc2FnZShtc2c6YW55KSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIucG9zdE1lc3NhZ2UobXNnKSB9IH1cclxuXHJcbiAgICAvLyAqKiB0ZXJtaW5hdGUgd29ya2VyXHJcbiAgICB0ZXJtaW5hdGUoKSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIudGVybWluYXRlKCl9IH1cclxufSJdfQ==