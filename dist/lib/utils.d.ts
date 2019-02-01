export declare class Path {
    static dotToSlash(path: string): string;
    static contextToPath(context: string): string;
}
export declare class Message {
    static updates(): {
        context: any;
        updates: any[];
    };
    static subscribe(): {
        context: any;
        subscribe: any[];
    };
    static unsubscribe(): {
        context: any;
        unsubscribe: any[];
    };
    static request(): {
        requestId: string;
    };
}
export declare class Alarm {
    private _state;
    private _method;
    private _message;
    constructor(message: string, state?: AlarmState, visual?: boolean, sound?: boolean);
    readonly value: {
        message: string;
        state: AlarmState;
        method: AlarmMethod[];
    };
}
export declare enum AlarmState {
    normal = "normal",
    alert = "alert",
    warn = "warn",
    alarm = "alarm",
    emergency = "emergency"
}
export declare enum AlarmMethod {
    visual = "visual",
    sound = "sound"
}
export declare enum AlarmType {
    mob = "notifications.mob",
    fire = "notifications.fire",
    sinking = "notifications.sinking",
    flooding = "notifications.flooding",
    collision = "notifications.collision",
    grounding = "notifications.grounding",
    listing = "notifications.listing",
    adrift = "notifications.adrift",
    piracy = "notifications.piracy",
    abandon = "notifications.abandon"
}
