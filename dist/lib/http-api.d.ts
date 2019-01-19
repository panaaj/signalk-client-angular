import { HttpClient } from '@angular/common/http';
export declare class SignalKHttp {
    private http;
    private _token;
    endpoint: string;
    token: string;
    constructor(http: HttpClient);
    getSelf(): import("rxjs/internal/Observable").Observable<Object>;
    getSelfId(): import("rxjs/internal/Observable").Observable<Object>;
    getMeta(context: string, path: string): import("rxjs/internal/Observable").Observable<Object>;
    get(path: string): import("rxjs/internal/Observable").Observable<Object>;
    put(context: string, path: string, value: any): any;
    put(context: string, path: string, key: any, value: any): any;
}
