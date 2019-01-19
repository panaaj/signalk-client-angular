/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        this.worker.onmessage = event => { this._message.next(event); };
        this.worker.onerror = event => { this._error.next(event); };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvc3RyZWFtLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7O0FBRzNDLE1BQU0sT0FBTyxtQkFBbUI7O0lBYTVCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFFLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pELENBQUM7Ozs7SUFFRCxXQUFXLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBR25FLElBQUksQ0FBQyxVQUFpQjtRQUNsQixJQUFHLE9BQU0sQ0FBQyxNQUFNLENBQUMsSUFBRyxXQUFXLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQTtTQUFFO1FBQ2pELElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7U0FBRSxDQUFHLDhCQUE4QjtRQUU1RSxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFFLEtBQUssQ0FBQSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUUsS0FBSyxDQUFBLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUN6RCxvQ0FBb0M7SUFDeEMsQ0FBQzs7Ozs7O0lBR0QsV0FBVyxDQUFDLEdBQU8sSUFBSSxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUFFLENBQUMsQ0FBQzs7Ozs7SUFHeEUsU0FBUyxLQUFLLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7S0FBQyxDQUFDLENBQUM7OztZQXRDNUQsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7Ozs7Ozs7OztJQUdqQyxxQ0FBNkI7Ozs7O0lBQzdCLHVDQUErQjs7Ozs7SUFDNUIscUNBQXVCOztJQUl2QixzQ0FBZ0M7O0lBQ2hDLHdDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBXZWIgV29ya2VyIFNlcnZpY2VcclxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduYWxLU3RyZWFtV29ya2VyICB7XHJcblxyXG5cdHByaXZhdGUgX2Vycm9yOiBTdWJqZWN0PGFueT47XHJcblx0cHJpdmF0ZSBfbWVzc2FnZTogU3ViamVjdDxhbnk+O1xyXG4gICAgcHJpdmF0ZSB3b3JrZXI6IFdvcmtlcjtcclxuICAgIFxyXG4gICAvLyAqKioqKioqKioqKioqKioqIEFUVFJJQlVURVMgKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHJcbiAgICBwdWJsaWMgb25FcnJvcjogT2JzZXJ2YWJsZTxhbnk+OyBcdFxyXG4gICAgcHVibGljIG9uTWVzc2FnZTogT2JzZXJ2YWJsZTxhbnk+O1x0XHJcblxyXG4gICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICAgIFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yPSB0aGlzLl9lcnJvci5hc09ic2VydmFibGUoKTsgIFxyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZT0gdGhpcy5fbWVzc2FnZS5hc09ic2VydmFibGUoKTsgICBcclxuICAgIH0gXHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpOyB0aGlzLndvcmtlciA9IHVuZGVmaW5lZDsgfVxyXG5cclxuICAgIC8vICoqIEluaXRpYWxpc2Ugd29ya2VyXHJcbiAgICBpbml0KHBhdGhUb0ZpbGU6c3RyaW5nKSB7IFxyXG4gICAgICAgIGlmKHR5cGVvZihXb3JrZXIpPT0gXCJ1bmRlZmluZWRcIikgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmKHRoaXMud29ya2VyKSB7IHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpIH0gICAvLyAqKiB0ZXJtaW5hdGUgYW4gb3BlbiB3b3JrZXJcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZXI9IG5ldyBXb3JrZXIocGF0aFRvRmlsZSk7XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25tZXNzYWdlPSBldmVudD0+IHsgdGhpcy5fbWVzc2FnZS5uZXh0KGV2ZW50KSB9O1xyXG4gICAgICAgIHRoaXMud29ya2VyLm9uZXJyb3I9IGV2ZW50PT4geyB0aGlzLl9lcnJvci5uZXh0KGV2ZW50KSB9OyAgICAgICAgICAgXHJcbiAgICAgICAgLy8gKiogd29ya2VyIHJlYWR5IGZvciBwb3N0TWVzc2FnZSgpXHJcbiAgICB9ICAgIFxyXG4gICAgXHJcbiAgICAvLyAqKiBTZW5kIG1lc3NhZ2UgdG8gd29ya2VyXHJcbiAgICBwb3N0TWVzc2FnZShtc2c6YW55KSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIucG9zdE1lc3NhZ2UobXNnKSB9IH1cclxuXHJcbiAgICAvLyAqKiB0ZXJtaW5hdGUgd29ya2VyXHJcbiAgICB0ZXJtaW5hdGUoKSB7IGlmKHRoaXMud29ya2VyKSB7dGhpcy53b3JrZXIudGVybWluYXRlKCl9IH1cclxufSJdfQ==