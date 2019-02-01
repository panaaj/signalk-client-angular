/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        if (path.indexOf('.') != -1) {
            return path.split('.').join('/');
        }
        else {
            return path;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zaWduYWxrLWNsaWVudC1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDOztBQUc5QixNQUFNLE9BQU8sSUFBSTs7Ozs7O0lBR2IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFXO1FBQ3pCLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRTthQUN6RDtZQUFFLE9BQU8sSUFBSSxDQUFBO1NBQUU7SUFDeEIsQ0FBQzs7Ozs7O0lBR0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFjOztZQUMzQixHQUFHLEdBQUUsQ0FBQyxPQUFPLElBQUUsTUFBTSxDQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQSxDQUFDLENBQUMsT0FBTztRQUNyRCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FFSjs7QUFHRCxNQUFNLE9BQU8sT0FBTzs7Ozs7SUFHaEIsTUFBTSxDQUFDLE9BQU87UUFDVix1REFBdUQ7UUFDdkQsT0FBTztZQUNILE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLEVBQUU7U0FDZCxDQUFBO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsU0FBUztRQUNaOzs7Ozs7Z0JBTVE7UUFDUixPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixTQUFTLEVBQUUsRUFBRTtTQUNoQixDQUFBO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsV0FBVztRQUNkLDBDQUEwQztRQUMxQyxPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFBO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsT0FBTztRQUNWLE9BQU87WUFDSCxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7U0FDbkMsQ0FBQTtJQUNMLENBQUM7Q0FFSjs7QUFHRCxNQUFNLE9BQU8sS0FBSzs7Ozs7OztJQU1kLFlBQVksT0FBYyxFQUFFLEtBQWlCLEVBQUUsTUFBZSxFQUFFLEtBQWM7UUFIdEUsWUFBTyxHQUFxQixFQUFFLENBQUM7UUFDL0IsYUFBUSxHQUFRLEVBQUUsQ0FBQztRQUd2QixJQUFJLENBQUMsUUFBUSxHQUFFLENBQUMsT0FBTyxPQUFPLEtBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzlELElBQUksQ0FBQyxNQUFNLEdBQUUsQ0FBQyxPQUFPLEtBQUssS0FBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ3RFLElBQUcsTUFBTSxFQUFFO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQUM7UUFBQSxDQUFDO1FBQ3BELElBQUcsS0FBSyxFQUFFO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQUM7UUFBQSxDQUFDO0lBQ3RELENBQUM7Ozs7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNsQixNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdkIsQ0FBQTtJQUNMLENBQUM7Q0FDSjs7Ozs7O0lBbEJHLHVCQUEwQjs7Ozs7SUFDMUIsd0JBQXVDOzs7OztJQUN2Qyx5QkFBMkI7Ozs7SUFtQjNCLFFBQVEsUUFBUTtJQUNoQixPQUFPLE9BQU87SUFDZCxNQUFNLE1BQU07SUFDWixPQUFPLE9BQU87SUFDZCxXQUFXLFdBQVc7OztBQUN6QixDQUFDOzs7SUFHRSxRQUFRLFFBQVE7SUFDaEIsT0FBTyxPQUFPOzs7QUFDakIsQ0FBQzs7O0lBR0UsS0FBSyxtQkFBbUI7SUFDeEIsTUFBTSxvQkFBb0I7SUFDMUIsU0FBUyx1QkFBdUI7SUFDaEMsVUFBVSx3QkFBd0I7SUFDbEMsV0FBVyx5QkFBeUI7SUFDcEMsV0FBVyx5QkFBeUI7SUFDcEMsU0FBUyx1QkFBdUI7SUFDaEMsUUFBUSxzQkFBc0I7SUFDOUIsUUFBUSxzQkFBc0I7SUFDOUIsU0FBUyx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi91dWlkJztcclxuXHJcbi8vICoqIFBhdGggdXRpbGl0aWVzXHJcbmV4cG9ydCBjbGFzcyBQYXRoIHtcclxuXHJcbiAgICAvLyAqKiB0cmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIHNsYXNoXHJcbiAgICBzdGF0aWMgZG90VG9TbGFzaChwYXRoOnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBpZihwYXRoLmluZGV4T2YoJy4nKSE9LTEpIHsgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5qb2luKCcvJykgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gcGF0aCB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKiogcGFyc2UgY29udGV4dCB0byB2YWxpZCBTaWduYWwgSyBwYXRoXHJcbiAgICBzdGF0aWMgY29udGV4dFRvUGF0aChjb250ZXh0OnN0cmluZyk6c3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzPSAoY29udGV4dD09J3NlbGYnICkgPyAndmVzc2Vscy5zZWxmJzogY29udGV4dDtcclxuICAgICAgICByZXR1cm4gcmVzLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgfSAgICBcclxuXHJcbn1cclxuXHJcbi8vICoqIE1lc3NhZ2UgdGVtcGxhdGVzICoqXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcclxuICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVVBEQVRFUyBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHVwZGF0ZXMoKSB7IFxyXG4gICAgICAgIC8vIGFycmF5IHZhbHVlcz0geyB2YWx1ZXM6IFsge3BhdGg6IHh4LCB2YWx1ZTogeHggfSBdIH1cclxuICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgdXBkYXRlczogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gKiogcmV0dXJuIFNVQlNDUklCRSBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLyogYXJyYXkgdmFsdWVzPSB7XHJcbiAgICAgICAgICAgIFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIsXHJcbiAgICAgICAgICAgIFwicGVyaW9kXCI6IDEwMDAsXHJcbiAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwiZGVsdGFcIixcclxuICAgICAgICAgICAgXCJwb2xpY3lcIjogXCJpZGVhbFwiLFxyXG4gICAgICAgICAgICBcIm1pblBlcmlvZFwiOiAyMDBcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmU6IFtdIFxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICAvLyAqKiByZXR1cm4gVU5TVUJTQ1JJQkUgbWVzc2FnZSBvYmplY3RcclxuICAgIHN0YXRpYyB1bnN1YnNjcmliZSgpIHsgXHJcbiAgICAgICAgLy8gYXJyYXkgdmFsdWVzPSB7IFwicGF0aFwiOiBcInBhdGgudG8ua2V5XCIgfVxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB1bnN1YnNjcmliZTogW10gXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbiAgICAvLyAqKiByZXR1cm4gUkVRVUVTVCBtZXNzYWdlIG9iamVjdFxyXG4gICAgc3RhdGljIHJlcXVlc3QoKSB7IFxyXG4gICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICByZXF1ZXN0SWQ6IG5ldyBVVUlEKCkudG9TdHJpbmcoKVxyXG4gICAgICAgIH1cclxuICAgIH0gICAgICAgICAgIFxyXG5cclxufVxyXG5cclxuLy8gKiogQWxhcm0gbWVzc2FnZSAqKlxyXG5leHBvcnQgY2xhc3MgQWxhcm0ge1xyXG5cclxuICAgIHByaXZhdGUgX3N0YXRlOkFsYXJtU3RhdGU7XHJcbiAgICBwcml2YXRlIF9tZXRob2Q6QXJyYXk8QWxhcm1NZXRob2Q+PSBbXTtcclxuICAgIHByaXZhdGUgX21lc3NhZ2U6c3RyaW5nPScnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nLCBzdGF0ZT86QWxhcm1TdGF0ZSwgdmlzdWFsPzpib29sZWFuLCBzb3VuZD86Ym9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX21lc3NhZ2U9ICh0eXBlb2YgbWVzc2FnZSE9PSAndW5kZWZpbmVkJykgPyBtZXNzYWdlIDogJyc7XHJcbiAgICAgICAgdGhpcy5fc3RhdGU9ICh0eXBlb2Ygc3RhdGUhPT0gJ3VuZGVmaW5lZCcpID8gc3RhdGUgOiBBbGFybVN0YXRlLmFsYXJtO1xyXG4gICAgICAgIGlmKHZpc3VhbCkgeyB0aGlzLl9tZXRob2QucHVzaChBbGFybU1ldGhvZC52aXN1YWwpfTtcclxuICAgICAgICBpZihzb3VuZCkgeyB0aGlzLl9tZXRob2QucHVzaChBbGFybU1ldGhvZC5zb3VuZCl9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLl9tZXNzYWdlLFxyXG4gICAgICAgICAgICBzdGF0ZTogdGhpcy5fc3RhdGUsXHJcbiAgICAgICAgICAgIG1ldGhvZDogdGhpcy5fbWV0aG9kXHJcbiAgICAgICAgfVxyXG4gICAgfSAgXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtU3RhdGUge1xyXG4gICAgbm9ybWFsPSAnbm9ybWFsJyxcclxuICAgIGFsZXJ0PSAnYWxlcnQnLFxyXG4gICAgd2Fybj0gJ3dhcm4nLFxyXG4gICAgYWxhcm09ICdhbGFybScsXHJcbiAgICBlbWVyZ2VuY3k9ICdlbWVyZ2VuY3knXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBBbGFybU1ldGhvZCB7XHJcbiAgICB2aXN1YWw9ICd2aXN1YWwnLFxyXG4gICAgc291bmQ9ICdzb3VuZCdcclxufTtcclxuXHJcbmV4cG9ydCBlbnVtIEFsYXJtVHlwZSB7XHJcbiAgICBtb2I9ICdub3RpZmljYXRpb25zLm1vYicsXHJcbiAgICBmaXJlPSAnbm90aWZpY2F0aW9ucy5maXJlJyxcclxuICAgIHNpbmtpbmc9ICdub3RpZmljYXRpb25zLnNpbmtpbmcnLFxyXG4gICAgZmxvb2Rpbmc9ICdub3RpZmljYXRpb25zLmZsb29kaW5nJyxcclxuICAgIGNvbGxpc2lvbj0gJ25vdGlmaWNhdGlvbnMuY29sbGlzaW9uJyxcclxuICAgIGdyb3VuZGluZz0gJ25vdGlmaWNhdGlvbnMuZ3JvdW5kaW5nJyxcclxuICAgIGxpc3Rpbmc9ICdub3RpZmljYXRpb25zLmxpc3RpbmcnLFxyXG4gICAgYWRyaWZ0PSAnbm90aWZpY2F0aW9ucy5hZHJpZnQnLFxyXG4gICAgcGlyYWN5PSAnbm90aWZpY2F0aW9ucy5waXJhY3knLFxyXG4gICAgYWJhbmRvbj0gJ25vdGlmaWNhdGlvbnMuYWJhbmRvbidcclxufVxyXG5cclxuIl19