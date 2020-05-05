import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignalKHttp } from './http-api';
import { SignalKStream } from './stream-api';
import { SignalKApps } from './apps-api';
import { Message } from './utils';
import { UUID } from './uuid';
interface Server_Info {
    endpoints: any;
    info: any;
    apiVersions: Array<any>;
}
interface JSON_Patch {
    op: 'add' | 'replace' | 'remove' | 'copy' | 'move' | 'test';
    path: string;
    value: any;
}
export declare enum APPDATA_CONTEXT {
    USER = "user",
    GLOBAL = "global"
}
export declare class SignalKClient {
    private http;
    apps: SignalKApps;
    api: SignalKHttp;
    stream: SignalKStream;
    private hostname;
    private port;
    private protocol;
    private _version;
    private _token;
    private debug;
    private fallbackEndpoints;
    server: Server_Info;
    fallback: boolean;
    version: number;
    authToken: string;
    readonly message: typeof Message;
    readonly uuid: UUID;
    constructor(http: HttpClient, apps: SignalKApps, api: SignalKHttp, stream: SignalKStream);
    ngOnDestroy(): void;
    private init;
    hello(hostname?: string, port?: number, useSSL?: boolean): Observable<Object>;
    connectAsPromise(hostname?: string, port?: number, useSSL?: boolean): Promise<any>;
    connect(hostname?: string, port?: number, useSSL?: boolean): Observable<any>;
    disconnect(): void;
    connectStreamAsPromise(hostname?: string, port?: number, useSSL?: boolean, subscribe?: string): Promise<any>;
    connectStream(hostname?: string, port?: number, useSSL?: boolean, subscribe?: string): Observable<any>;
    connectPlaybackAsPromise(hostname: string, port: number, useSSL: boolean, options: any): Promise<any>;
    connectPlayback(hostname: string, port: number, useSSL: boolean, options: any): Observable<any>;
    openStream(url?: string, subscribe?: string, token?: string): true | Error;
    openPlayback(url?: string, options?: any, token?: string): true | Error;
    private processHello;
    private resolveAppsEndpoint;
    resolveStreamEndpoint(): string;
    private resolveHttpEndpoint;
    private disconnectedFromServer;
    get(path: string): Observable<Object>;
    put(path: string, value: any): Observable<Object>;
    post(path: string, value: any): Observable<Object>;
    login(username: string, password: string): Observable<Object>;
    logout(): Observable<boolean>;
    isLoggedIn(): Observable<boolean>;
    getLoginStatus(): Observable<any>;
    snapshot(context: string, time: string): Observable<Object>;
    /*******************************
     *  applicationData api methods
     * context: 'user' or 'global'
     * appId: application id string
     *******************************/
    private _appId;
    private _appVersion;
    private resolveAppDataEndpoint;
    setAppId(value: string): void;
    setAppVersion(value: string): void;
    appDataVersions(context?: APPDATA_CONTEXT, appId?: string): Observable<Object>;
    appDataKeys(path?: string, context?: APPDATA_CONTEXT, appId?: string, version?: string): Observable<Object>;
    appDataGet(path?: string, context?: APPDATA_CONTEXT, appId?: string, version?: string): Observable<Object>;
    appDataSet(path: string, value: any, context?: APPDATA_CONTEXT, appId?: string, version?: string): Observable<Object>;
    appDataPatch(value: Array<JSON_Patch>, context?: APPDATA_CONTEXT, appId?: string, version?: string): Observable<Object>;
}
export {};
