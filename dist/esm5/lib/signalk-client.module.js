/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*****************************
 * SignalKClient Module:
 *****************************/
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
var SignalKClientModule = /** @class */ (function () {
    function SignalKClientModule() {
    }
    SignalKClientModule.decorators = [
        { type: NgModule, args: [{
                    imports: [HttpClientModule],
                    declarations: [],
                    exports: [],
                    entryComponents: [],
                    providers: []
                },] }
    ];
    return SignalKClientModule;
}());
export { SignalKClientModule };
export { APPDATA_CONTEXT, SignalKClient } from './signalk-client';
export { Path, Message, Alarm, AlarmState, AlarmMethod, AlarmType } from './utils';
export { SignalKStream } from './stream-api';
export { SignalKHttp } from './http-api';
export { SignalKApps } from './apps-api';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsay1jbGllbnQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vc2lnbmFsay1jbGllbnQtYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9zaWduYWxrLWNsaWVudC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUlBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFdkQ7SUFBQTtJQU9rQyxDQUFDOztnQkFQbEMsUUFBUSxTQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFFLGdCQUFnQixDQUFFO29CQUM3QixZQUFZLEVBQUUsRUFBRTtvQkFDaEIsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsZUFBZSxFQUFFLEVBQUU7b0JBQ25CLFNBQVMsRUFBRSxFQUFFO2lCQUNoQjs7SUFDaUMsMEJBQUM7Q0FBQSxBQVBuQyxJQU9tQztTQUF0QixtQkFBbUI7QUFFaEMsK0NBQWMsa0JBQWtCLENBQUM7QUFDakMseUVBQWMsU0FBUyxDQUFDO0FBQ3hCLDhCQUFjLGNBQWMsQ0FBQztBQUM3Qiw0QkFBYyxZQUFZLENBQUM7QUFDM0IsNEJBQWMsWUFBWSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIFNpZ25hbEtDbGllbnQgTW9kdWxlOlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogWyBIdHRwQ2xpZW50TW9kdWxlIF0sICAgIFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOiBbXSwgXHJcbiAgICBwcm92aWRlcnM6IFtdICBcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZ25hbEtDbGllbnRNb2R1bGUge31cclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vc2lnbmFsay1jbGllbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3V0aWxzJztcclxuZXhwb3J0ICogZnJvbSAnLi9zdHJlYW0tYXBpJztcclxuZXhwb3J0ICogZnJvbSAnLi9odHRwLWFwaSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vYXBwcy1hcGknOyJdfQ==