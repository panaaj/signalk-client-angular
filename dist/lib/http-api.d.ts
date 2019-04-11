import { HttpClient } from '@angular/common/http';
export declare class SignalKHttp {
    private http;
    private _token;
    server: any;
    endpoint: string;
    authToken: string;
    constructor(http: HttpClient);
    getSelf(): import("rxjs/internal/Observable").Observable<Object>;
    getSelfId(): import("rxjs/internal/Observable").Observable<Object>;
    getMeta(context: string, path: string): import("rxjs/internal/Observable").Observable<Object>;
    get(path: string): import("rxjs/internal/Observable").Observable<Object>;
    put(path: string, value: any): any;
    put(context: string, path: string, value: any): any;
    put(context: string, path: string, key: any, value: any): any;
    post(path: string, value: any): import("rxjs/internal/Observable").Observable<Object>;
    delete(path: string): import("rxjs/internal/Observable").Observable<Object>;
}
