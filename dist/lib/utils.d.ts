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
        requestId: any;
    };
}
