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
    private server;
    private debug(val);
    constructor(http: HttpClient);
    version: number;
    readonly apiVersions: any[];
    readonly authRequired: boolean;
    authToken: string;
    login(username: string, password: string): Observable<Object>;
    connectionTimeout: number;
    private init(hostname?, port?, useSSL?);
    hello(hostname?: string, port?: number, useSSL?: boolean): Observable<Object>;
    connect(hostname?: string, port?: number, useSSL?: boolean, subscribe?: string): void;
    connectDelta(hostname?: string, port?: number, useSSL?: boolean, subscribe?: string): void;
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
    apiPut(context: string, path: string, key: any, value: any): Observable<Object>;
    get(path: string): Observable<Object>;
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
