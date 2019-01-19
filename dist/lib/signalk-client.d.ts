import { HttpClient } from '@angular/common/http';
import { SignalKHttp } from './http-api';
import { SignalKStream } from './stream-api';
import { Message } from './utils';
import { SignalKStreamWorker } from './stream-worker';
export declare class SignalKClient {
    private http;
    api: SignalKHttp;
    stream: SignalKStream;
    worker: SignalKStreamWorker;
    private hostname;
    private port;
    private protocol;
    private _version;
    private _token;
    private debug;
    server: {
        endpoints: {};
        info: {};
        apiVersions: any[];
    };
    version: number;
    authToken: string;
    readonly message: typeof Message;
    constructor(http: HttpClient, api: SignalKHttp, stream: SignalKStream, worker: SignalKStreamWorker);
    ngOnDestroy(): void;
    private init;
    hello(hostname?: string, port?: number, useSSL?: boolean): import("rxjs/internal/Observable").Observable<Object>;
    connect(hostname?: string, port?: number, useSSL?: boolean): Promise<any>;
    disconnect(): void;
    connectStream(hostname?: string, port?: number, useSSL?: boolean, subscribe?: string): Promise<{}>;
    connectPlayback(hostname: string, port: number, useSSL: boolean, options: any): Promise<{}>;
    openStream(url?: string, subscribe?: string, token?: string): true | Error;
    openPlayback(url?: string, options?: any, token?: string): true | Error;
    private processHello;
    resolveStreamEndpoint(): string;
    private resolveHttpEndpoint;
    private disconnectedFromServer;
    get(path: string): import("rxjs/internal/Observable").Observable<Object>;
    put(path: string, value: any): import("rxjs/internal/Observable").Observable<Object>;
    post(path: string, value: any): import("rxjs/internal/Observable").Observable<Object>;
    login(username: string, password: string): import("rxjs/internal/Observable").Observable<Object>;
    logout(): import("rxjs/internal/Observable").Observable<Object>;
    snapshot(context: string, time: string): import("rxjs/internal/Observable").Observable<Object>;
}
