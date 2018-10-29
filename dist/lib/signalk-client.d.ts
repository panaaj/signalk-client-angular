import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export declare class SignalKClient {
    private http;
    private _connect;
    onConnect: any;
    private _close;
    onClose: any;
    private _error;
    onError: any;
    private _message;
    onMessage: any;
    private ws;
    private hostname;
    private port;
    private protocol;
    private wsProtocol;
    private _version;
    private _filter;
    private _wsTimeout;
    private _token;
    private _authType;
    server: {
        authRequired: number;
        endpoints: {};
        info: {};
        apiVersions: any[];
        ws: {
            self: any;
            roles: {};
        };
    };
    private debug(val);
    constructor(http: HttpClient);
    version: number;
    readonly apiVersions: any[];
    readonly isConnected: boolean;
    readonly authRequired: number;
    authToken: string;
    login(username: string, password: string): Observable<Object>;
    logout(): Observable<Object>;
    connectionTimeout: number;
    private init(hostname?, port?, useSSL?);
    private processHello(response);
    private getStreamUrl();
    hello(hostname?: string, port?: number, useSSL?: boolean): Observable<Object>;
    connect(hostname?: string, port?: number, useSSL?: boolean, subscribe?: string): void;
    connectDelta(hostname?: string, port?: number, useSSL?: boolean, subscribe?: string): void;
    playback(hostname: string, port: number, useSSL: boolean, subscribe: any): void;
    connectPlayback(hostname: string, port: number, useSSL: boolean, subscribe: any): void;
    private parsePlaybackOptions(opt);
    private connectDeltaByUrl(url);
    disconnect(): void;
    send(data: any): void;
    sendUpdate(context: string, path: string, value: any): void;
    subscribe(context?: string, path?: string, ...options: any[]): void;
    unsubscribe(context?: string, path?: string): void;
    isDelta(msg: any): boolean;
    isHello(msg: any): boolean;
    filter: string;
    raiseAlarm(context: string, alarmPath: string, alarm: Alarm): void;
    clearAlarm(context: string, alarmPath: string): void;
    getSelf(): Observable<Object>;
    getSelfId(): Observable<Object>;
    getMeta(context: string, path: string): Observable<Object>;
    apiGet(path: string): Observable<Object>;
    apiPut(context: string, path: string, value: any): any;
    apiPut(context: string, path: string, key: any, value: any): any;
    snapshot(context: string, time: string): Observable<Object>;
    get(path: string): Observable<Object>;
    put(path: string, value: any): Observable<Object>;
    post(path: string, value: any): Observable<Object>;
    private resolveHttpEndpoint();
    private contextToPath(context);
    private dotToSlash(path);
    private slashToDot(path);
}
export declare enum AlarmState {
    normal = "normal",
    alert = "alert",
    warn = "warn",
    alarm = "alarm",
    emergency = "emergency",
}
export declare enum AlarmMethod {
    visual = "visual",
    sound = "sound",
}
export declare class Alarm {
    state: AlarmState;
    method: Array<AlarmMethod>;
    message: string;
    constructor(message?: string);
}
