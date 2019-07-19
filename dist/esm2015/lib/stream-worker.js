/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** Web Worker Service
 * ************************************/
import { Injectable, isDevMode } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class SignalKStreamWorker {
    // *******************************************************    
    constructor() {
        this._error = new Subject();
        this.onError = this._error.asObservable();
        this._message = new Subject();
        this.onMessage = this._message.asObservable();
        if (isDevMode()) {
            console.warn(`DEPRECATION WARNING: SignalKClient.worker is replaced by the signalk-worker-angular package and will be removed in signalk-client-angular v1.6`);
        }
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
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
SignalKStreamWorker.ctorParameters = () => [];
/** @nocollapse */ SignalKStreamWorker.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SignalKStreamWorker_Factory() { return new SignalKStreamWorker(); }, token: SignalKStreamWorker, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvc3RyZWFtLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsT0FBTyxFQUFjLE1BQU0sTUFBTSxDQUFDOztBQUczQyxNQUFNLE9BQU8sbUJBQW1COztJQWE1QjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3QyxJQUFHLFNBQVMsRUFBRSxFQUFFO1lBQ1osT0FBTyxDQUFDLElBQUksQ0FBQyxnSkFBZ0osQ0FBQyxDQUFDO1NBQ2xLO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVcsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7Ozs7SUFHbkUsSUFBSSxDQUFDLFVBQWlCO1FBQ2xCLElBQUcsT0FBTSxDQUFDLE1BQU0sQ0FBQyxJQUFHLFdBQVcsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFBO1NBQUU7UUFDakQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtTQUFFLENBQUcsOEJBQThCO1FBRTVFLElBQUksQ0FBQyxNQUFNLEdBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTOzs7O1FBQUUsS0FBSyxDQUFBLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQSxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTzs7OztRQUFFLEtBQUssQ0FBQSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUEsQ0FBQztRQUN6RCxvQ0FBb0M7SUFDeEMsQ0FBQzs7Ozs7O0lBR0QsV0FBVyxDQUFDLEdBQU8sSUFBSSxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUFFLENBQUMsQ0FBQzs7Ozs7SUFHeEUsU0FBUyxLQUFLLElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7S0FBQyxDQUFDLENBQUM7OztZQXpDNUQsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7Ozs7Ozs7OztJQUdqQyxxQ0FBNkI7Ozs7O0lBQzdCLHVDQUErQjs7Ozs7SUFDNUIscUNBQXVCOztJQUl2QixzQ0FBZ0M7O0lBQ2hDLHdDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBXZWIgV29ya2VyIFNlcnZpY2VcclxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtTdHJlYW1Xb3JrZXIgIHtcclxuXHJcblx0cHJpdmF0ZSBfZXJyb3I6IFN1YmplY3Q8YW55PjtcclxuXHRwcml2YXRlIF9tZXNzYWdlOiBTdWJqZWN0PGFueT47XHJcbiAgICBwcml2YXRlIHdvcmtlcjogV29ya2VyO1xyXG4gICAgXHJcbiAgIC8vICoqKioqKioqKioqKioqKiogQVRUUklCVVRFUyAqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcclxuICAgIHB1YmxpYyBvbkVycm9yOiBPYnNlcnZhYmxlPGFueT47IFx0XHJcbiAgICBwdWJsaWMgb25NZXNzYWdlOiBPYnNlcnZhYmxlPGFueT47XHRcclxuXHJcbiAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogICAgXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3I9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgICAgICB0aGlzLm9uRXJyb3I9IHRoaXMuX2Vycm9yLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZT0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlPSB0aGlzLl9tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpOyAgXHJcbiAgICAgICAgaWYoaXNEZXZNb2RlKCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBERVBSRUNBVElPTiBXQVJOSU5HOiBTaWduYWxLQ2xpZW50LndvcmtlciBpcyByZXBsYWNlZCBieSB0aGUgc2lnbmFsay13b3JrZXItYW5ndWxhciBwYWNrYWdlIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gc2lnbmFsay1jbGllbnQtYW5ndWxhciB2MS42YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCk7IHRoaXMud29ya2VyID0gdW5kZWZpbmVkOyB9XHJcblxyXG4gICAgLy8gKiogSW5pdGlhbGlzZSB3b3JrZXJcclxuICAgIGluaXQocGF0aFRvRmlsZTpzdHJpbmcpIHsgXHJcbiAgICAgICAgaWYodHlwZW9mKFdvcmtlcik9PSBcInVuZGVmaW5lZFwiKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgICAgaWYodGhpcy53b3JrZXIpIHsgdGhpcy53b3JrZXIudGVybWluYXRlKCkgfSAgIC8vICoqIHRlcm1pbmF0ZSBhbiBvcGVuIHdvcmtlclxyXG5cclxuICAgICAgICB0aGlzLndvcmtlcj0gbmV3IFdvcmtlcihwYXRoVG9GaWxlKTtcclxuICAgICAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2U9IGV2ZW50PT4geyB0aGlzLl9tZXNzYWdlLm5leHQoZXZlbnQpIH07XHJcbiAgICAgICAgdGhpcy53b3JrZXIub25lcnJvcj0gZXZlbnQ9PiB7IHRoaXMuX2Vycm9yLm5leHQoZXZlbnQpIH07ICAgICAgICAgICBcclxuICAgICAgICAvLyAqKiB3b3JrZXIgcmVhZHkgZm9yIHBvc3RNZXNzYWdlKClcclxuICAgIH0gICAgXHJcbiAgICBcclxuICAgIC8vICoqIFNlbmQgbWVzc2FnZSB0byB3b3JrZXJcclxuICAgIHBvc3RNZXNzYWdlKG1zZzphbnkpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci5wb3N0TWVzc2FnZShtc2cpIH0gfVxyXG5cclxuICAgIC8vICoqIHRlcm1pbmF0ZSB3b3JrZXJcclxuICAgIHRlcm1pbmF0ZSgpIHsgaWYodGhpcy53b3JrZXIpIHt0aGlzLndvcmtlci50ZXJtaW5hdGUoKX0gfVxyXG59Il19