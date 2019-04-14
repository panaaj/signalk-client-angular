/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { UUID } from './uuid';
// ** Path utilities
export class Path {
    // ** transform dot notation to slash
    /**
     * @param {?} path
     * @return {?}
     */
    static dotToSlash(path) {
        /** @type {?} */
        let p = path.split('?');
        if (p[0].indexOf('.') != -1) {
            p[0] = p[0].split('.').join('/');
        }
        return p.join('?');
    }
    // ** parse context to valid Signal K path
    /**
     * @param {?} context
     * @return {?}
     */
    static contextToPath(context) {
        /** @type {?} */
        let res = (context == 'self') ? 'vessels.self' : context;
        return res.split('.').join('/');
    }
}
// ** Message templates **
export class Message {
    // ** return UPDATES message object
    /**
     * @return {?}
     */
    static updates() {
        // array values= { values: [ {path: xx, value: xx } ] }
        return {
            context: null,
            updates: []
        };
    }
    // ** return SUBSCRIBE message object
    /**
     * @return {?}
     */
    static subscribe() {
        /* array values= {
            "path": "path.to.key",
            "period": 1000,
            "format": "delta",
            "policy": "ideal",
            "minPeriod": 200
            } */
        return {
            context: null,
            subscribe: []
        };
    }
    // ** return UNSUBSCRIBE message object
    /**
     * @return {?}
     */
    static unsubscribe() {
        // array values= { "path": "path.to.key" }
        return {
            context: null,
            unsubscribe: []
        };
    }
    // ** return REQUEST message object
    /**
     * @return {?}
     */
    static request() {
        return {
            requestId: new UUID().toString()
        };
    }
}
// ** Alarm message **
export class Alarm {
    /**
     * @param {?} message
     * @param {?=} state
     * @param {?=} visual
     * @param {?=} sound
     */
    constructor(message, state, visual, sound) {
        this._method = [];
        this._message = '';
        this._message = (typeof message !== 'undefined') ? message : '';
        this._state = (typeof state !== 'undefined') ? state : AlarmState.alarm;
        if (visual) {
            this._method.push(AlarmMethod.visual);
        }
        ;
        if (sound) {
            this._method.push(AlarmMethod.sound);
        }
        ;
    }
    /**
     * @return {?}
     */
    get value() {
        return {
            message: this._message,
            state: this._state,
            method: this._method
        };
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    Alarm.prototype._state;
    /**
     * @type {?}
     * @private
     */
    Alarm.prototype._method;
    /**
     * @type {?}
     * @private
     */
    Alarm.prototype._message;
}
/** @enum {string} */
const AlarmState = {
    normal: 'normal',
    alert: 'alert',
    warn: 'warn',
    alarm: 'alarm',
    emergency: 'emergency',
};
export { AlarmState };
;
/** @enum {string} */
const AlarmMethod = {
    visual: 'visual',
    sound: 'sound',
};
export { AlarmMethod };
;
/** @enum {string} */
const AlarmType = {
    mob: 'notifications.mob',
    fire: 'notifications.fire',
    sinking: 'notifications.sinking',
    flooding: 'notifications.flooding',
    collision: 'notifications.collision',
    grounding: 'notifications.grounding',
    listing: 'notifications.listing',
    adrift: 'notifications.adrift',
    piracy: 'notifications.piracy',
    abandon: 'notifications.abandon',
};
export { AlarmType };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDOztBQUc5QixNQUFNLE9BQU8sSUFBSTs7Ozs7O0lBR2IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFXOztZQUNyQixDQUFDLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDdEIsSUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDOzs7Ozs7SUFHRCxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQWM7O1lBQzNCLEdBQUcsR0FBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFBLENBQUMsQ0FBQyxPQUFPO1FBQ3JELE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUVKOztBQUdELE1BQU0sT0FBTyxPQUFPOzs7OztJQUdoQixNQUFNLENBQUMsT0FBTztRQUNWLHVEQUF1RDtRQUN2RCxPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsRUFBRTtTQUNkLENBQUE7SUFDTCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxTQUFTO1FBQ1o7Ozs7OztnQkFNUTtRQUNSLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLFNBQVMsRUFBRSxFQUFFO1NBQ2hCLENBQUE7SUFDTCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxXQUFXO1FBQ2QsMENBQTBDO1FBQzFDLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxFQUFFO1NBQ2xCLENBQUE7SUFDTCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1YsT0FBTztZQUNILFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtTQUNuQyxDQUFBO0lBQ0wsQ0FBQztDQUVKOztBQUdELE1BQU0sT0FBTyxLQUFLOzs7Ozs7O0lBTWQsWUFBWSxPQUFjLEVBQUUsS0FBaUIsRUFBRSxNQUFlLEVBQUUsS0FBYztRQUh0RSxZQUFPLEdBQXFCLEVBQUUsQ0FBQztRQUMvQixhQUFRLEdBQVEsRUFBRSxDQUFDO1FBR3ZCLElBQUksQ0FBQyxRQUFRLEdBQUUsQ0FBQyxPQUFPLE9BQU8sS0FBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRSxDQUFDLE9BQU8sS0FBSyxLQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDdEUsSUFBRyxNQUFNLEVBQUU7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7U0FBQztRQUFBLENBQUM7UUFDcEQsSUFBRyxLQUFLLEVBQUU7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7U0FBQztRQUFBLENBQUM7SUFDdEQsQ0FBQzs7OztJQUVELElBQUksS0FBSztRQUNMLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN2QixDQUFBO0lBQ0wsQ0FBQztDQUNKOzs7Ozs7SUFsQkcsdUJBQTBCOzs7OztJQUMxQix3QkFBdUM7Ozs7O0lBQ3ZDLHlCQUEyQjs7OztJQW1CM0IsUUFBUSxRQUFRO0lBQ2hCLE9BQU8sT0FBTztJQUNkLE1BQU0sTUFBTTtJQUNaLE9BQU8sT0FBTztJQUNkLFdBQVcsV0FBVzs7O0FBQ3pCLENBQUM7OztJQUdFLFFBQVEsUUFBUTtJQUNoQixPQUFPLE9BQU87OztBQUNqQixDQUFDOzs7SUFHRSxLQUFLLG1CQUFtQjtJQUN4QixNQUFNLG9CQUFvQjtJQUMxQixTQUFTLHVCQUF1QjtJQUNoQyxVQUFVLHdCQUF3QjtJQUNsQyxXQUFXLHlCQUF5QjtJQUNwQyxXQUFXLHlCQUF5QjtJQUNwQyxTQUFTLHVCQUF1QjtJQUNoQyxRQUFRLHNCQUFzQjtJQUM5QixRQUFRLHNCQUFzQjtJQUM5QixTQUFTLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVVSUQgfSBmcm9tICcuL3V1aWQnO1xyXG5cclxuLy8gKiogUGF0aCB1dGlsaXRpZXNcclxuZXhwb3J0IGNsYXNzIFBhdGgge1xyXG5cclxuICAgIC8vICoqIHRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gc2xhc2hcclxuICAgIHN0YXRpYyBkb3RUb1NsYXNoKHBhdGg6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgICAgIGxldCBwPSBwYXRoLnNwbGl0KCc/Jyk7XHJcbiAgICAgICAgaWYocFswXS5pbmRleE9mKCcuJykhPS0xKSB7IFxyXG4gICAgICAgICAgICBwWzBdPSBwWzBdLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcC5qb2luKCc/Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXHJcbiAgICBzdGF0aWMgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcclxuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgfSAgICBcclxuXHJcbn1cclxuXHJcbi8vICoqIE1lc3NhZ2UgdGVtcGxhdGVzICoqXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcclxuICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVVBEQVRFUyBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVwZGF0ZXMoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyB2YWx1ZXM6IFsge3BhdGg6IHh4LCB2YWx1ZTogeHggfSBdIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdXBkYXRlczogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gKiogcmV0dXJuIFNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLyogYXJyYXkgdmFsdWVzPSB7XHJcbiAgICAgICAgICAgIFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kXCI6IDEwMDAsXHJcbiAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwiZGVsdGFcIixcclxuICAgICAgICAgICAgXCJwb2xpY3lcIjogXCJpZGVhbFwiLFxyXG4gICAgICAgICAgICBcIm1pblBlcmlvZFwiOiAyMDBcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVU5TVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1bnN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIgfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1bnN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbiAgICAvLyAqKiByZXR1cm4gUkVRVUVTVCBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHJlcXVlc3QoKSB7IFxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICByZXF1ZXN0SWQ6IG5ldyBVVUlEKCkudG9TdHJpbmcoKVxyXG4gICAgICAgIH1cclxuICAgIH0gICAgICAgICAgIFxyXG5cclxufVxyXG5cclxuLy8gKiogQWxhcm0gbWVzc2FnZSAqKlxyXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xyXG5cclxuICAgIHByaXZhdGUgX3N0YXRlOkFsYXJtU3RhdGU7XHJcbiAgICBwcml2YXRlIF9tZXRob2Q6QXJyYXk8QWxhcm1NZXRob2Q+PSBbXTtcclxuICAgIHByaXZhdGUgX21lc3NhZ2U6c3RyaW5nPScnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nLCBzdGF0ZT86QWxhcm1TdGF0ZSwgdmlzdWFsPzpib29sZWFuLCBzb3VuZD86Ym9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9ICh0eXBlb2YgbWVzc2FnZSE9PSAndW5kZWZpbmVkJykgPyBtZXNzYWdlIDogJyc7XHJcbiAgICAgICAgdGhpcy5fc3RhdGU9ICh0eXBlb2Ygc3RhdGUhPT0gJ3VuZGVmaW5lZCcpID8gc3RhdGUgOiBBbGFybVN0YXRlLmFsYXJtO1xyXG4gICAgICAgIGlmKHZpc3VhbCkgeyB0aGlzLl9tZXRob2QucHVzaChBbGFybU1ldGhvZC52aXN1YWwpfTtcclxuICAgICAgICBpZihzb3VuZCkgeyB0aGlzLl9tZXRob2QucHVzaChBbGFybU1ldGhvZC5zb3VuZCl9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLl9tZXNzYWdlLFxyXG4gICAgICAgICAgICBzdGF0ZTogdGhpcy5fc3RhdGUsXHJcbiAgICAgICAgICAgIG1ldGhvZDogdGhpcy5fbWV0aG9kXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtU3RhdGUge1xyXG4gICAgbm9ybWFsPSAnbm9ybWFsJyxcclxuICAgIGFsZXJ0PSAnYWxlcnQnLFxyXG4gICAgd2Fybj0gJ3dhcm4nLFxyXG4gICAgYWxhcm09ICdhbGFybScsXHJcbiAgICBlbWVyZ2VuY3k9ICdlbWVyZ2VuY3knXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBBbGFybU1ldGhvZCB7XHJcbiAgICB2aXN1YWw9ICd2aXN1YWwnLFxyXG4gICAgc291bmQ9ICdzb3VuZCdcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtVHlwZSB7XHJcbiAgICBtb2I9ICdub3RpZmljYXRpb25zLm1vYicsXHJcbiAgICBmaXJlPSAnbm90aWZpY2F0aW9ucy5maXJlJyxcclxuICAgIHNpbmtpbmc9ICdub3RpZmljYXRpb25zLnNpbmtpbmcnLFxyXG4gICAgZmxvb2Rpbmc9ICdub3RpZmljYXRpb25zLmZsb29kaW5nJyxcclxuICAgIGNvbGxpc2lvbj0gJ25vdGlmaWNhdGlvbnMuY29sbGlzaW9uJyxcclxuICAgIGdyb3VuZGluZz0gJ25vdGlmaWNhdGlvbnMuZ3JvdW5kaW5nJyxcclxuICAgIGxpc3Rpbmc9ICdub3RpZmljYXRpb25zLmxpc3RpbmcnLFxyXG4gICAgYWRyaWZ0PSAnbm90aWZpY2F0aW9ucy5hZHJpZnQnLFxyXG4gICAgcGlyYWN5PSAnbm90aWZpY2F0aW9ucy5waXJhY3knLFxyXG4gICAgYWJhbmRvbj0gJ25vdGlmaWNhdGlvbnMuYWJhbmRvbidcclxufVxyXG5cclxuIl19