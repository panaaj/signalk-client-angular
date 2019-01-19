import { Observable } from 'rxjs';
export declare class SignalKStreamWorker {
    private _error;
    private _message;
    private worker;
    onError: Observable<any>;
    onMessage: Observable<any>;
    constructor();
    ngOnDestroy(): void;
    init(pathToFile: string): boolean;
    postMessage(msg: any): void;
    terminate(): void;
}
