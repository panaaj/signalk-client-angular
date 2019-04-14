/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** Web Worker Service
 * ************************************/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class SignalKStreamWorker {
    // *******************************************************    
    constructor() {
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
        this.onMessage = this._message.asObservable();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.worker.terminate(); this.worker = undefined; }
    // ** Initialise worker
    /**
     * @param {?} pathToFile
     * @return {?}
     */
    init(pathToFile) {
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
        event => { this._message.next(event); });
        this.worker.onerror = (/**
         * @param {?} event
         * @return {?}
         */
        event => { this._error.next(event); });
        // ** worker ready for postMessage()
    }
    // ** Send message to worker
    /**
     * @param {?} msg
     * @return {?}
     */
    postMessage(msg) { if (this.worker) {
        this.worker.postMessage(msg);
    } }
    // ** terminate worker
    /**
     * @return {?}
     */
    terminate() { if (this.worker) {
        this.worker.terminate();
    } }
}
SignalKStreamWorker.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
SignalKStreamWorker.ctorParameters = () => [];
/** @nocollapse */ SignalKStreamWorker.ngInjectableDef = i0.defineInjectable({ factory: function SignalKStreamWorker_Factory() { return new SignalKStreamWorker(); }, token: SignalKStreamWorker, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvc3RyZWFtLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7O0FBRzNDLE1BQU0sT0FBTyxtQkFBbUI7O0lBYTVCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pELENBQUM7Ozs7SUFFRCxXQUFXLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBR25FLElBQUksQ0FBQyxVQUFpQjtRQUNsQixJQUFHLE9BQU0sQ0FBQyxNQUFNLENBQUMsSUFBRyxXQUFXLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQTtTQUFFO1FBQ2pELElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7U0FBRSxDQUFHLDhCQUE4QjtRQUU1RSxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUzs7OztRQUFFLEtBQUssQ0FBQSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUEsQ0FBQztRQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Ozs7UUFBRSxLQUFLLENBQUEsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBLENBQUM7UUFDekQsb0NBQW9DO0lBQ3hDLENBQUM7Ozs7OztJQUdELFdBQVcsQ0FBQyxHQUFPLElBQUksSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7S0FBRSxDQUFDLENBQUM7Ozs7O0lBR3hFLFNBQVMsS0FBSyxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQUMsQ0FBQyxDQUFDOzs7WUF0QzVELFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Ozs7Ozs7Ozs7SUFHakMscUNBQTZCOzs7OztJQUM3Qix1Q0FBK0I7Ozs7O0lBQzVCLHFDQUF1Qjs7SUFJdkIsc0NBQWdDOztJQUNoQyx3Q0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogV2ViIFdvcmtlciBTZXJ2aWNlXHJcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmFsS1N0cmVhbVdvcmtlciAge1xyXG5cclxuXHRwcml2YXRlIF9lcnJvcjogU3ViamVjdDxhbnk+O1xyXG5cdHByaXZhdGUgX21lc3NhZ2U6IFN1YmplY3Q8YW55PjtcclxuICAgIHByaXZhdGUgd29ya2VyOiBXb3JrZXI7XHJcbiAgICBcclxuICAgLy8gKioqKioqKioqKioqKioqKiBBVFRSSUJVVEVTICoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFxyXG4gICAgcHVibGljIG9uRXJyb3I6IE9ic2VydmFibGU8YW55PjsgXHRcclxuICAgIHB1YmxpYyBvbk1lc3NhZ2U6IE9ic2VydmFibGU8YW55PjtcdFxyXG5cclxuICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgICBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9lcnJvcj0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25FcnJvcj0gdGhpcy5fZXJyb3IuYXNPYnNlcnZhYmxlKCk7ICBcclxuICAgICAgICB0aGlzLl9tZXNzYWdlPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2U9IHRoaXMuX21lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7ICAgXHJcbiAgICB9IFxyXG5cclxuICAgIG5nT25EZXN0cm95KCkgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTsgdGhpcy53b3JrZXIgPSB1bmRlZmluZWQ7IH1cclxuXHJcbiAgICAvLyAqKiBJbml0aWFsaXNlIHdvcmtlclxyXG4gICAgaW5pdChwYXRoVG9GaWxlOnN0cmluZykgeyBcclxuICAgICAgICBpZih0eXBlb2YoV29ya2VyKT09IFwidW5kZWZpbmVkXCIpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICBpZih0aGlzLndvcmtlcikgeyB0aGlzLndvcmtlci50ZXJtaW5hdGUoKSB9ICAgLy8gKiogdGVybWluYXRlIGFuIG9wZW4gd29ya2VyXHJcblxyXG4gICAgICAgIHRoaXMud29ya2VyPSBuZXcgV29ya2VyKHBhdGhUb0ZpbGUpO1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9ubWVzc2FnZT0gZXZlbnQ9PiB7IHRoaXMuX21lc3NhZ2UubmV4dChldmVudCkgfTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbmVycm9yPSBldmVudD0+IHsgdGhpcy5fZXJyb3IubmV4dChldmVudCkgfTsgICAgICAgICAgIFxyXG4gICAgICAgIC8vICoqIHdvcmtlciByZWFkeSBmb3IgcG9zdE1lc3NhZ2UoKVxyXG4gICAgfSAgICBcclxuICAgIFxyXG4gICAgLy8gKiogU2VuZCBtZXNzYWdlIHRvIHdvcmtlclxyXG4gICAgcG9zdE1lc3NhZ2UobXNnOmFueSkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnBvc3RNZXNzYWdlKG1zZykgfSB9XHJcblxyXG4gICAgLy8gKiogdGVybWluYXRlIHdvcmtlclxyXG4gICAgdGVybWluYXRlKCkgeyBpZih0aGlzLndvcmtlcikge3RoaXMud29ya2VyLnRlcm1pbmF0ZSgpfSB9XHJcbn0iXX0=