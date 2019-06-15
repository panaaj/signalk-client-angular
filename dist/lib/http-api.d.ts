import { HttpClient } from '@angular/common/http';
export declare class SignalKHttp {
    private http;
    private _token;
    server: any;
    endpoint: string;
    authToken: string;
    constructor(http: HttpClient);
    getSelf(): import("rxjs").Observable<Object>;
    getSelfId(): import("rxjs").Observable<Object>;
    getMeta(context: string, path: string): import("rxjs").Observable<Object>;
    get(path: string): import("rxjs").Observable<Object>;
    put(path: string, value: any): any;
    put(context: string, path: string, value: any): any;
    put(context: string, path: string, key: any, value: any): any;
    post(path: string, value: any): import("rxjs").Observable<Object>;
    delete(path: string): import("rxjs").Observable<Object>;
}
