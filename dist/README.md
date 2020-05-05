# Signal K client for the Angular Framework

**SignalKClient** is an Angular library to facilitate communication with a Signal K server.

It provides the following classes to interact with Signal K `HTTP` and `STREAM` APIs as well as exposing STREAM `Events`:

- `api` class for interacting with Signal K HTTP API

- `stream` class for interacting with Signal K STREAM API

- `apps` class to enable interaction with applications installed on the Signal K server

---
NOTE: To connect to a Signal K stream using a web worker use the `signalk-worker-angular` library in conjunction with this library.

```
npm i signalk-worker-angular
```

---

### Breaking Changes:

From the release of __version 1.7.0__ the following methods now return an `Observable`.

- `connect()`
- `connectStream()`
- `connectPlayback()`

To continue using `Promise`s update your code to use the following methods:

- `connectAsPromise()`
- `connectStreamAsPromise()`
- `connectPlaybackAsPromise()`

---

See below for some [Examples](#usage) below to see how to use this library..


Detailed documentation for using this library can be found on [**GitHub**](https://github.com/panaaj/signalk-client-angular/tree/master/dist).



## Installation

```
npm install signalk-client-angular
```



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
