import { HttpClient } from '@angular/common/http';
export declare class SignalKApps {
    private http;
    endpoint: string;
    constructor(http: HttpClient);
    ngOnDestroy(): void;
    list(): import("rxjs").Observable<Object>;
}
