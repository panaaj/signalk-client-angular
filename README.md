# Signal K client for the Angular Framework

**SignalKClient** is an Angular library to facilitate communication with a Signal K server.

It provides the following classes to interact with the Signal K `HTTP` and `STREAM` APIs as well as exposing STREAM `Events`:

[api](HTTP_API.md): class for interacting with Signal K HTTP API

[stream](STREAM_API.md): class for interacting with Signal K STREAM API

[apps](APPS.md): class to enable interaction with applications installed on the Signal K server.

See [SignalKClient API](#signalkclient-api) below for details.

---

Please see the [**Usage**](#usage) section below for guidance on how to use the updated library.

---

### Breaking Changes:

Note: `version 1.8` is built using Angular 12 in `partial-Ivy` mode. 
This means that means projects using:
- the `View Engine`
- versions of Angular prior to v9
need to ensure that `"enableIvy": false` is set in the `tsconfig.json` file.

As of `version 1.7` the following methods return an `Observable` rather than a `Promise`.

- `connect()`
- `connectStream()`
- `connectPlayback()`

To continue using `Promise`s update your code to use the following methods:

- `connectAsPromise()`
- `connectStreamAsPromise()`
- `connectPlaybackAsPromise()`

---

## Installation

```
npm install signalk-client-angular
```

---

## Usage


**app.module.ts**

- Include `SignalKClientModule` in your project.

```
 import { SignalKClientModule } from 'signalk-client-angular';
```

**app.component.ts**

- Inject `SignalKClient` into your application.

```
import { SignalKClient } from 'signalk-client-angular';

// **** Inject the SignalKClient ****

constructor( public sk: SignalKClient ) {
    ...
}
```

---

### Basic Usage

The simplest way to get started is to connect to a Signal K server and open a websocket to its data stream.

To do this:

1. Use `connectStream(...)` to connect to the server and open the data stream.

2. Subscribe to the `stream` events to process the received data 

*Example:*
```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...handle connection event
});
this.sk.stream.onError.subscribe( e=> {
    ...handle error event
});
this.sk.stream.onClose.subscribe( e=> {
    ...handle connection closed event
});
this.sk.stream.onMessage.subscribe( e=> {
    ...handle message received event
});    

// **** CONNECT to Server and open STREAM ****
this.sk.connectStream('192.168.99.100', 80, false, 'self');
```

Once connected you can then interact with both the STREAM and HTTP APIs in the following ways:

- Use the `stream` object to interact with the websocket connection.

```
    // **** send data to STREAM API ****
    this.sk.stream.send({..data..});    

```

- Use the `api` object to interact Signal K HTTP API path. `/signalk/v1/api/`

*Example:*
```
// **** make HTTP API request ****
this.sk.api.get('vessels/self/navigation/position').subscribe(
    response=> { ... },
    error=> { ... }
);
```

---

### Connect and open Stream on Demand

If you want to just use the HTTP API or defer the connection to the STREAM API based on user interaction use the `connect(..)` method.

1. Use `connect(...)` to connect to the server and perform endpoint discovery.

2. When you are ready to connect to the STREAM API use `openStream()` ( or `stream.open()` ) with a `null` or `undefined` *url* parameter. This will cnnect to the discovered stream endpoint. 

*Example:*
```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...handle connection event
});
this.sk.stream.onError.subscribe( e=> {
    ...handle error event
});
this.sk.stream.onClose.subscribe( e=> {
    ...handle connection closed event
});
this.sk.stream.onMessage.subscribe( e=> {
    ...handle message received event
});    

// **** CONNECT to Signal K Server ****
this.sk.connect('192.168.99.100', 80, false, 'self');

... 

this.sk.openStream( null, 'self');

OR

this.sk.stream.open( null, 'self');
```

---

### Use with non-HTTP enabled Signal K server

By default the **connect** methods will cause an HTTP request to be sent to the server `/signalk` path to discover the server's advertised endpoints.

To interact with the server without using endpoint discovery use the `openStream(<hostname>, <port>)` method specifying the host ip address and port.

*Note: No HTTP endpoint discovery is performed when using `openXX()` methods and specifying a host.*

*Example:*
```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...handle connection event
});
this.sk.stream.onError.subscribe( e=> {
    ...handle error event
});
this.sk.stream.onClose.subscribe( e=> {
    ...handle connection closed event
});
this.sk.stream.onMessage.subscribe( e=> {
    ...handle message received event
});    

// **** CONNECT to Signal K Server ****
this.sk.openStream('192.168.99.100', 80, false, 'self');
```
---

# SignalKClient API

SignalKClient contains the following classes to interact with Signal K API's:

[api](HTTP_API.md): class for interacting with Signal K HTTP API

[stream](STREAM_API.md): class for interacting with Signal K STREAM API

[apps](APPS.md): class to enable interaction with applications installed on the Signal K server.

*Follow the links for the relevant documentation.*

[Attributes](#attributes)
- `server`
- `version`
- `authToken`
- `uuid`

[Methods](#methods)
- `hello()`
- `connect()`
- `disconnect()`
- `connectStream()`
- `connectPlayback()`
- `openStream()`
- `openPlayBack()`
- `snapshot()`
- `resovleStreamEndpoint()`
- `get()`
- `put()`
- `post()`
- `login()`
- `logout()`
- `isLoggedIn()`
- `setAppId()`
- `setAppVersion()`
- `appDataVersions()`
- `appDataKeys()`
- `appDataGet()`
- `appDataSet()`
- `appDataPatch()`

---

### Attributes:

`server`: 

Information returned from Signal K server *hello* response.
```
{
    endpoints: {},
    info: {},
    apiVersions: []
} 
```
*apiVersions* Constains list of api versions supported by the  Signal K server.

---

`version`: 

Get / Set preferred Signal K API version to use when the server supports more than one version. *This must be used prior to connecting to the server.* If the Signal K server does not supports the specified version `v1` will be used. 

*Note: Signal K API is currently only available in `v1`.*

*Example:*

```
    // ** set target version **
    this.sk.version=2;

    // ** connect to server **
    this.sk.connect(...);

    // ** get the version currently in use **
    console.log(this.sk.version)
```
---

`authToken`:

A token string to be used for authentication when interacting with the Signal K server.

Use the `login()` method to authenticate to the server and retrieve a token for the specified user.

*Example:*
```
this.sk.authToken= '<auth_token_string>';
```

Once you have supplied an `authToken` it will be used for all subsequent operations. 

---

`uuid`:

Provides a convenient way to generate a v4 UUID object which has two methods:

- `toString()`: Returns a v4 UUID string

- `toSignalK()`: Returns a formatted Signal K resource identifier

*Example:*
```
let uuid= this.sk.uuid;

uuid.toString();  

// returns 27b88354-9fe0-4952-9ce6-c9d4eaea6d9e

uuid.toSignalK();

// returns urn:mrn:signalk:uuid:27b88354-9fe0-4952-9ce6-c9d4eaea6d9e

```

_Note: A new UUID is generated everytime `uuid` is used!_ 

---

### Methods:


`hello(hostname, port, useSSL):Observable`

Send *discovery* request to the Signal K server `/signalk` path.

*Note: SignalKClient is not considered **connected** after using this method.*

*Parameters:* 

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*


*Returns*: Observable

*Example:*

```
// **** make Discovery request ****
this.sk.hello('myServer', 80, false).subscribe(
    response=> { ... },
    error=> { ... }
);
```
---
`connect(hostname, port, useSSL, subscribe):Observable`

Connect to Signal K server and perform service endpoint discovery to initalise SignalKClient for operation.

This method performs the following:

1. Issues a `hello()` request
2. Populates the `server` attibute with the received data

*Parameters:*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

*Returns*: Observable

*Example:*
```
this.sk.connect('myServer', 80, false).subscribe( 
    r=>{ ... },
    e=>{ ... } 
);
```

---
`connectAsPromise(hostname, port, useSSL, subscribe):Promise`

Same as `connect()` but returns a Promise.

This method performs the following:

1. Issues a `hello()` request
2. Populates the `server` attibute with the received data

*Parameters:*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

*Returns*: Promise

*Example:*
```
this.sk.connect('myServer', 80, false)
.then( r=>{ ... } )
.catch ( e=>{ ... } )
```

---

`disconnect()`

Disconnects from Signal K server and closes all connections.

*Example:*
```
this.sk.disconnect();
```
---

`connectStream(hostname, port, useSSL, subscribe):Observable`

Connect to Signal K server and and open a connection to the STREAM API after performing service endpoint discovery.

This method performs the following:

1. Calls `connect()`
2. Opens a connection to the discovered Stream endpoint.

*Parameters:*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

*Returns*: Observable

*Example:*

```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...
});
this.sk.stream.onError.subscribe( e=> {
    ...
});
this.sk.stream.onClose.subscribe( e=> {
    ..
});
this.sk.stream.onMessage.subscribe( e=> {
    ...
});    

// **** CONNECT to Delta Stream ****

this.sk.connectStream('myServer', 80, false, 'self').subscribe( 
    r=>{ ... },
    e=>{ ... } 
);
```

---

`connectStreamAsPromise(hostname, port, useSSL, subscribe):Promise`

Same as `connectStream()` but returns a Promise.

This method performs the following:

1. Calls `connect()`
2. Opens a connection to the discovered Stream endpoint.

*Parameters:*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

*Returns*: Promise

*Example:*

```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...
});
this.sk.stream.onError.subscribe( e=> {
    ...
});
this.sk.stream.onClose.subscribe( e=> {
    ..
});
this.sk.stream.onMessage.subscribe( e=> {
    ...
});    

// **** CONNECT to Delta Stream ****

this.sk.connectStream('myServer', 80, false, 'self')
.then( r=>{ ... } )
.catch ( e=>{ ... } )
```
---

`connectPlayback(hostname, port, useSSL, options):Observable`

Connect to Signal K server and and open a connection to the PLAYBACK STREAM API after performing service endpoint discovery.

This method performs the following:

1. Calls `connect()`
2. Calls `openPlayback()`.

*Parameters:*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *options*: Signal K Playback options
```
{ 
    startTime: *Date / Time to start playback from.
    playbackRate: A number defining the rate at which data is sent.
    subscribe: 'all', 'self' or 'none'. *(Uses server default if null)*
}
```

*Returns*: Observable

*Example:*

```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...
});
this.sk.stream.onError.subscribe( e=> {
    ...
});
this.sk.stream.onClose.subscribe( e=> {
    ..
});
this.sk.stream.onMessage.subscribe( e=> {
    ...
});    

// **** CONNECT to Playback Stream ****

this.sk.connectPlayback('myServer', 80, false, {
    subscribe: 'self',
    playbackRate: 1,
    startTime: '2019-01-19T07:14:58Z'
}).subscribe( 
    r=>{ ... },
    e=>{ ... } 
);
```

---

`connectPlaybackAsPromise(hostname, port, useSSL, options):Promise`

Same as `connectPlayback()` but returns a Promise.

This method performs the following:

1. Calls `connectAsPromise()`
2. Calls `openPlayback()`.

*Parameters:*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *options*: Signal K Playback options
```
{ 
    startTime: *Date / Time to start playback from.
    playbackRate: A number defining the rate at which data is sent.
    subscribe: 'all', 'self' or 'none'. *(Uses server default if null)*
}
```

*Returns*: Promise

*Example:*

```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...
});
this.sk.stream.onError.subscribe( e=> {
    ...
});
this.sk.stream.onClose.subscribe( e=> {
    ..
});
this.sk.stream.onMessage.subscribe( e=> {
    ...
});    

// **** CONNECT to Playback Stream ****

this.sk.connectPlayback('myServer', 80, false, {
    subscribe: 'self',
    playbackRate: 1,
    startTime: '2019-01-19T07:14:58Z'
})
.then( r=>{ ... } )
.catch ( e=>{ ... } );
```

---

`openStream(url, subscribe, token)`

Connect direct to Signal K server DELTA stream using the supplied parameters without performing *endpoint discovery*.

This method is for use when there is no HTTP API available.

*Paramaters:*

- *url*: url of Signal K stream endpoint. 

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

- *token*: Authentication token.

*Returns*: true or Error().  Subscribe to `SignalKClient.stream` events to receive results of actions.

```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...
});
this.sk.stream.onError.subscribe( e=> {
    ...
});
this.sk.stream.onClose.subscribe( e=> {
    ..
});
this.sk.stream.onMessage.subscribe( e=> {
    ...
});    

// **** CONNECT to Signal K Stream ****
this.sk.openStream( 'stream_url', 'self');
```
---

`openPlayback(url, options, token)`

Connect direct to Signal K server PLAYBACK stream using the supplied parameters without performing *endpoint discovery*.

This method is for use when there is no HTTP API available.

*Paramaters:*

- *url*: url of Signal K playback endpoint.

- *options*: Signal K Playback options
```
{ 
    startTime: *Date / Time to start playback from.
    playbackRate: A number defining the rate at which data is sent.
    subscribe: 'all', 'self' or 'none'. *(Uses server default if null)*
}
```

- *token*: Authentication token.

*Returns*: true or Error().  Subscribe to `SignalKClient.stream` events to receive results of actions.

```
// **** Subscribe to Signal K Stream events ***

this.sk.stream.onConnect.subscribe( e=> {
    ...
});
this.sk.stream.onError.subscribe( e=> {
    ...
});
this.sk.stream.onClose.subscribe( e=> {
    ..
});
this.sk.stream.onMessage.subscribe( e=> {
    ...
});    

// **** CONNECT to Signal K Stream ****
this.sk.openStream( 'playback_url', {
    subscribe: 'self',
    playbackRate: 1,
    startTime: '2019-01-19T07:14:58Z'
});
```
---

`resolveStreamEndpoint()`

Returns preferred STREAM API url based on:

1. Discovered stream endpoint urls

2. Preferred API version set with `version` attribute.

---------------------------------------------------------

`get(path)`

Make a HTTP request to a path relative to Signal K server root path. *`http(s)://server:port/`*.

*Parameters:*

- *path*: path relative to Signal K srver root  

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...

// **** make HTTP GET request ****
this.sk.get('/plugins').subscribe(
    response=> { ... },
    error=> { ... }
);
```

---

`put(path, value)`

Make a HTTP PUT request to a path relative to Signal K server root path. *`http(s)://server:port/`*.

*Parameters:*

- *path*: path relative to Signal K srver root  

- *value*: Value to assign

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...

// **** make HTTP PUT request ****
this.sk.put('/plugins/plugin-name/acton').subscribe(
    response=> { ... },
    error=> { ... }
);
```

---

`post(path, value)`

Make a HTTP POST request to a path relative to Signal K server root path. *`http(s)://server:port/`*.

*Parameters:*

- *path*: path relative to Signal K srver root  

- *value*: Value to assign

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...

// **** make HTTP POST request ****
this.sk.post('/plugins/plugin-name/acton').subscribe(
    response=> { ... },
    error=> { ... }
);
```

---

`snapshot(context, time)`

**History Snapshot Retrieval**

Request from the Signal K server the part of the full model at the requested time.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

- *time*: date/time in ISO format *eg: 2018-08-24T15:19:09Z*

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...
this.sk.snapshot(
    'self',
    new Date().toISOString()
).subscribe(
    res=> { console.log(res) },
    err=> { console.log(err) }
);
```

---

### AUTHENTICATION:

Signal K servers with security enabled will require an authentication token assigned to the `authToken` attribute to access protected HTTP and STREAM APIs.

You can assign `authToken`: 

- A valid token you have already generated 

- Retrieve a token for a specific user by usingthe `login()` method providing *username / password*

*Note: if a Signal K server has security enabled and you have not provided a valid 
`authToken` an Error event will be triggered to notify of this situation.* 

---

`login(user, password)`

Retrieve authentication token for the provided user credentials.

This token can then be applied to the `authToken` attribute so it is used in subsequent operations.

*Parameters:*

-*user*: User name

-*password*: User's password

*Returns*: Observable containing JWT token.

*Example:*

```
this.sk.hello( myserver, 80, false );

// ** login
this.sk.login( 'myuser', 'mypassword').subscribe(
    r=> { 
        // **** authenticated ****
        this.sk.authToken= r['token'];
        ...

        this.sk.api.get( ... ).subscribe(
        response=> { ... },
        error=> { ... }
    );
        
    },
    err=> { // **** not authenticated **** }
); 
```
---

`logout()`

Log out the current user.

*Returns*: Observable<boolean> true= success, false= failure.

---

`isLoggedIn()`

Log out the current user.

---

### APPLICATION DATA:

Signal K servers with security enabled allow client applications to store data using the `applicationData` API path.

Applications can store data either per user using the `user` path or globally using the `global` path: 

Use the following methods to interact with the `applicationData` API path.

See [SignalK.org](http://signalk.org) for details.

---

`setAppId(appId)`

Set the application id used for all subsequent `applicationData` actions.

This value will be used if `appId` is not supplied to a called method.

*Parameters:*

-*appId*: string value representing the application id.

*Example:*

```
setAppId('myapp')
```

---

`setAppVersion(version)`

Set the version used for all subsequent `applicationData` actions.

This value will be used if `version` is not supplied to a called method.

*Parameters:*

-*version*: string value representing the version of the data stored on the server.

*Example:*

```
setAppVersion('1.1')
```

---

`appDataVersions(context, appId)`

Return a list of versions under which data is stored for the supplied context.

*Parameters:*

-*context*: `user` or `global`. If not supplied defaults to `user`.

-*appId*: string value representing the application id. If not supplied the value set by `setAppId()` is used.

*Returns*: Observable

*Example:*

```
appDataVersions('user', 'myapp')
```
---

`appDataKeys(path, context, appId, version)`

Return a list of keys stored under the path which data is stored for the supplied context, appId and version.

*Parameters:*

-*path*: pointer to the JSON key.

-*context*: `user` or `global`. If not supplied defaults to `user`.

-*appId*: string value representing the application id. If not supplied the value set by `setAppId()` is used.

-*version*: string value representing the stored data version. If not supplied the value set by `setAppVerison()` is used.

*Returns*: Observable.

*Example:*

```
appDataKeys('vessel/speed', 'user', 'myapp', '1.0')
```
---

`appDataGet(path, context, appId, version)`

Return the value stored at the supplied path for the supplied context, appId and version.

*Parameters:*

-*path*: pointer to the JSON key.

-*context*: `user` or `global`. If not supplied defaults to `user`.

-*appId*: string value representing the application id. If not supplied the value set by `setAppId()` is used.

-*version*: string value representing the stored data version. If not supplied the value set by `setAppVerison()` is used.

*Returns*: Observable.

*Example:*

```
appDataGet('vessel/speed', 'user', 'myapp', '1.0')
```
---

`appDataSet(path, value, context, appId, version)`

Store a value at the supplied path for the supplied context, appId and version.

*Parameters:*

-*path*: pointer to the JSON key under which to store the data.

-*value*: value to store.

-*context*: `user` or `global`. If not supplied defaults to `user`.

-*appId*: string value representing the application id. If not supplied the value set by `setAppId()` is used.

-*version*: string value representing the stored data version. If not supplied the value set by `setAppVerison()` is used.


*Example:*

```
appDataSet('vessel/speed/sog', 1.5, 'user', 'myapp', '1.0')
```
---

`appDataPatch(value, context, appId, version)`

Add / Update / Remove multiple values at the supplied path for the supplied context, appId and version.

*Parameters:*

-*value*: Array of JSON Patch formatted objects representing the actions and values.

-*context*: `user` or `global`. If not supplied defaults to `user`.

-*appId*: string value representing the application id. If not supplied the value set by `setAppId()` is used.

-*version*: string value representing the stored data version. If not supplied the value set by `setAppVerison()` is used.


*Example:*

```
appDataPatch(
    [
        {"op":"add", "path": "/vessel/speed", "value": {sog: 1.25} },
        {"op":"remove", "path": "/vessel/speed/stw" }
    ], 
    'user', 'myapp', '1.0')
```
---
