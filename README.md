# Signal K client for the Angular Framework

**SignalKClient** is a port of the Signal K javascript client for use with the Angular
framework to facilitate communication with a Signal K server.

It provides methods to access both the Signal K HTTP and STREAM APIs as well as exposing 
STREAM events which can be subscribed to.

*Note: Mdns auto-discovery functions are not included as they are not relevant to browser 
based applications.*


## Installation

```
npm install signalk-client-angular
```

## Usage

**app.module.ts**

- SignalKClient has a dependency on HttpClient so be sure to include the HttpClient Module in your project.

```
 import { HttpClientModule } from '@angular/common/http';
    ...
    imports: [
        ...
        HttpClientModule
    ],
    ...
```

**app.component.ts**

- Inject SignalKClient and subscribe to Signal K Stream API events.

```
import { SignalKClient } from 'signalk-client-angular';

    // **** Inject the SignalKClient ****

    constructor( public sk: SignalKClient ) {
        ...
    }

    nginit( {

        // **** Subscribe to Signal K Stream events ***

        this.sk.onConnect.subscribe( e=> {
            ...handle connection event
        });
        this.sk.onError.subscribe( e=> {
            ...handle error event
        });
        this.sk.onClose.subscribe( e=> {
            ...handle connection closed event
        });
        this.sk.onMessage.subscribe( e=> {
            ...handle message received event
        });    

        // **** CONNECT to Signal K Server ****
        this.sk.connect('192.168.99.100', 80, false, 'self');

    })

    ...

    // **** make HTTP API request ****
    this.sk.apiGet('/resources/routes').subscribe(
        response=> { ... },
        error=> { ... }
    );

    // **** send data to STREAM API ****
    this.sk.send({..data..});    

```

## API


### AUTHENTICATION:

Signal K servers with security enabled will require authentication 
to use HTTP and STREAM APIs.

You can: 

- Use a token already you have already generated 

- Retrieve a token for a specific user by providing *username / password*

*Note: if a Signal K server has security enabled and you have not provided a valid 
`authToken` an Error event will be triggered to notify of this situation.* 


#### authToken (token)

Used to provide an authentication token to be used when interacting with
the Signal K server.

The `login()` function can be used to retrieve the token for a particular user account.

```
    this.sk.authToken= '<auth token>';
```

Once you have supplied an `authToken` it will be used for all subsequent operations. 


#### login (user, password)

Get authentication token for the provided user credentials.

This token can then be applied to the `authToken` attribute so it is  
used in subsequent operations.

*Returns*: Observable<HttpResponse> containing JWT token.

```
    this.sk.hello( myserver, 80, false );

    // ** login
    this.sk.login( 'myuser', 'mypassword').subscribe(
        r=> { 
            // **** authenticated ****
            this.sk.authToken= r['token'];
            ...
            this.sk.apiGet( ... );
            ... 
        },
        err=> { // **** not authenticated **** }
    ); 
```


### CONNECT / DISCONNECT:

Use the following methods to establish connection to a Signal K server.


#### isConnected: boolean

Returns true if a Web socket stream connection has been established.


#### connect(hostname, port, useSSL, subscribe)

Connect to Signal K server using the supplied parameters using *discovered* service endpoints.

This method contacts the server using the supplied details and performs the following:

1. Issues a `hello()` request to obtain service endpoints.
2. Persists received endpoint information for future HTTP API requests
3. Opens a connection using the STREAM API via `connectDelta()`.

*Note: if the target server only supports Stream API (does not support http or does not return a discovery response) use `connectDelta()` to directly connect to a web socket stream.*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

*Returns*: void.  Subscribe to SignalKClient events to receive results of actions.

```
        // **** Subscribe to Signal K Stream events ***

        this.sk.onConnect.subscribe( e=> {
            ...
        });
        this.sk.onError.subscribe( e=> {
            ...
        });
        this.sk.onClose.subscribe( e=> {
            ..
        });
        this.sk.onMessage.subscribe( e=> {
            ...
        });    

        // **** CONNECT to Signal K Stream ****
        this.sk.connect( 'myServer', 80, false, 'self');
```

**Connection defaults:**

SignalKClient will use default connection parameter values if they are left blank when 
using the connect() function.
The default values applied will depend if you are in Angular Development or Production mode.

Angular development mode:

- Debug messages are printed to the console

- Default Signal K server host if no values supplied `192.168.99.100:3000` *(the default Docker container configuration)*

Angular production build:

- No Debug messages

- Default Signal K server host if no values supplied `http://localhost:80` *(useSSL=false)*

- Default Signal K server host if no values supplied `http://localhost:443` *(useSSL=true)*

#### connectionTimeout (milliseconds)

Set stream connection timeout value in milliseconds. default=20000 (20 sec).

If a connection has not been established withing the specified time period the connection attempt is aborted and an onError event is raised.

*Valid value range is 3000 to 60000 milliseconds (3 to 60 sec).*


```
    this.sk.connectionTimeout= 10000;

    this.sk.connect( ... );
```

#### playback(hostname, port, useSSL, subscribe)

**History Playback Retrieval**

Creates a WebSocket connection that plays back data from a certain point in time with a specified rate using *discovered* service endpoints.

This method contacts the server using the supplied details and performs the following:

1. Issues a `hello()` request to obtain service endpoints.
2. Persists received endpoint information for future HTTP API requests
3. Opens a connection using the STREAM API via `connectPlayback()`.

*Note: if the target server only supports Stream API (does not support http or does not return a discovery response) use `connectPlayback()` to directly connect to a web socket stream.*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K playback subcription parameters can be either: 
    1. query string:  *e.g. `self&startTime=2018-08-24T15:19:09Z&playbackRate=5`*

        See [Signal K Docs](https://github.com/SignalK/specification/blob/master/gitbook-docs/streaming_api.md) for details.

    2. object: 
    ```
        {   
            context: 'self', 
            startTime: 'startTime=2018-08-24T15:19:09Z', 
            playbackRate: 1
        }
    ```


*Returns*: void.  Subscribe to SignalKClient events to receive results of actions.

```
        // **** Subscribe to Signal K Stream events ***

        this.sk.onConnect.subscribe( e=> {
            ...
        });
        this.sk.onError.subscribe( e=> {
            ...
        });
        this.sk.onClose.subscribe( e=> {
            ..
        });
        this.sk.onMessage.subscribe( e=> {
            ...
        });    

        // **** CONNECT to Signal K Playback Stream ****
        this.sk.connectPlayback( 
            'myServer', 
            80, 
            false, 
            'self&startTime=2018-08-24T15:19:09Z&playbackRate=5'
        );
```


#### connectPlayback(hostname, port, useSSL, subscribe)

**History Playback Retrieval**

Creates a WebSocket connection that plays back data from a certain point in time with a specified rate.

Connects directly to Signal K server delta stream using the supplied parameters without performing *endpoint discovery*.

This method is for use when there is no HTTP API available.

*Note: `playback()` is the preferred connection method if HTTP API endpoints are to be used during playback.*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K playback subcription parameters can be either: 
    1. query string:  *e.g. `self&startTime=2018-08-24T15:19:09Z&playbackRate=5`*

        See [Signal K Docs](https://github.com/SignalK/specification/blob/master/gitbook-docs/streaming_api.md) for details.

    2. object: 
    ```
        {   
            context: 'self', 
            startTime: 'startTime=2018-08-24T15:19:09Z', 
            playbackRate: 1
        }
    ```


*Returns*: void.  Subscribe to SignalKClient events to receive results of actions.

```
        // **** Subscribe to Signal K Stream events ***

        this.sk.onConnect.subscribe( e=> {
            ...
        });
        this.sk.onError.subscribe( e=> {
            ...
        });
        this.sk.onClose.subscribe( e=> {
            ..
        });
        this.sk.onMessage.subscribe( e=> {
            ...
        });    

        // **** CONNECT to Signal K Playback Stream ****
        this.sk.connectPlayback( 
            'myServer', 
            80, 
            false, 
            'self&startTime=2018-08-24T15:19:09Z&playbackRate=5'
        );
```


#### connectDelta(hostname, port, useSSL, subscribe)

Connect direct to Signal K server delta stream using the supplied parameters without performing *endpoint discovery*.

This method is for use when there is no HTTP API available.

*Note: `connect()` is the preferred connection method when HTTP API endpoints are to be used.*

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

*Returns*: void.  Subscribe to SignalKClient events to receive results of actions.

```
        // **** Subscribe to Signal K Stream events ***

        this.sk.onConnect.subscribe( e=> {
            ...
        });
        this.sk.onError.subscribe( e=> {
            ...
        });
        this.sk.onClose.subscribe( e=> {
            ..
        });
        this.sk.onMessage.subscribe( e=> {
            ...
        });    

        // **** CONNECT to Signal K Stream ****
        this.sk.connectDelta( 'myServer', 80, false, 'self');
```


#### disconnect()

Disconnects from Signal K server Stream endpoint and closes the connection.

```
// **** disconnect from STREAM API ****
    this.sk.disconnect();
```


#### hello(hostname, port, useSSL)

Get Signal K server discovery response **without** establishing a connection to 
the STREAM API service endpoint.

Contacts the server and requests the server *discovery* response.

- *hostname*: host name or ip address

- *port*:     port number

- *useSSL*:   true: uses secure socket protocols *(https / wss)*


*Returns*: Observable<HttpResponse>

```
    // **** make Discovery request ****
    this.sk.hello('myServer', 80, false).subscribe(
        response=> { ... },
        error=> { ... }
    );
```


#### apiVersions (array)

Get list of api versions supported by the  Signal K server.


```
    // ** connect to server **
    this.sk.connect(...);

    // ** get supported api versions **
    console.log(this.sk.apiVersions);
```


#### version (number)

Get / Set preferred Signal K API version.

Specify the target Signal K API version you want as a number. 

```
    // ** set target version **
    this.sk.version=2;

    // ** connect to server **
    this.sk.connect(...);


    // ** get the version currently in use **
    console.log(this.sk.version)
```

SignalKClient will check if the Signal K server supports the specified target api version and use it for all subsequent actions. If the targeted version is not supported by the server SignalKClient will fall back to using `v1`. 

If the version is set after connection to Signal K server stream has been made you will need to re-connect to 
the stream to use the specified version.

*Note: Signal K API is currently only available in `v1`.*



### HTTP API Functions:

The following functions facilitate interaction with the Signal K HTTP API via the 
established connection. 

Use the `connect(...)` function prior to using any of these API functions!

#### apiGet(path)

Make a request to a path WITHIN the Signal K server HTTP API scope */signalk/v1/api/*.

Returns the Signal K resource from the specified path.

- *path*: path relative to HTTP API *i.e. http://server:port/signalk/v1/api/*

*Returns*: Observable<HttpResponse>

```
    // ** connect to server **
    this.sk.connect(...);

    ...

    // **** make HTTP API request ****
    this.sk.apiGet('/resources/waypoints').subscribe(
        response=> { ... },
        error=> { ... }
    );
```


#### get(path)

Make a request to a path NOT WITHIN the Signal K server HTTP API scope */signalk/v1/api/*.

- *path*: path relative to Signal K root *i.e. http://server:port/*

*Returns*: Observable<HttpResponse>

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

#### snapshot(context:string, time:string)

**History Snapshot Retrieval**

Request from the Signal K server the part of the full model at the requested time.

- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *time*: date/time in ISO format *eg: 2018-08-24T15:19:09Z*

*Returns*: Observable<HttpResponse>

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


#### apiPut()

Overloaded method with the following call signatures:

**apiPut(context, path, value)**

*results in HTTP PUT '<host>/signalk/v1/api/<path>' {value: <value>}*

**apiPut(context, path, key, value)**

*results in HTTP PUT '<host>/signalk/v1/api/<path>' {value: <key>: {<value>} }*

Send a PUT request to the Signal K server HTTP API for a path that has
a handler assigned.

A Signal K server plugin may handle the PUT request for a specific Signal K path, 
in this case you can use `apiPut()` to submit a value to the server for this path.

*For more information refer to: Signal K specification RFC 0010: Actions (PUT/POST)*

- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *path*: path to Signal K resource  *(slash or dotted notation)*

- *key*: name of attribute the value is being written to

- *value*: value to be written

*Returns*: Observable<HttpResponse>

```
    // ** connect to server **
    this.sk.connect(...);

    ...
    this.sk.apiPut(
        'self',
        'environment/outside', 
        'temperature', 
        '297.4'
    ).subscribe(
        res=> { console.log(res) },
        err=> { console.log(err) }
    );
```

#### put(path, value)

Make a PUT request to a path NOT WITHIN the Signal K server HTTP API scope */signalk/v1/api/*.

- *path*: path relative to Signal K root *i.e. http://server:port/*

*Returns*: Observable<HttpResponse>

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

#### post(path, value)

Make a POST request to a path NOT WITHIN the Signal K server HTTP API scope */signalk/v1/api/*.

- *path*: path relative to Signal K root *i.e. http://server:port/*

*Returns*: Observable<HttpResponse>

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

#### getMeta(context, path)

Get Meta data for the specified context and path in the Signal K tree.

- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *path*: path to Signal K resource *(slash or dotted notation)*

*Returns*: Observable<HttpResponse>

```
    // ** connect to server **
    this.sk.connect(...);

    ...

    // **** Meta data request ****
    this.sk.getMeta('self', 'navigation.speedOverGround').subscribe(
        response=> { ... },
        error=> { ... }
    );
```

#### getSelf()

Returns the contents of the Signal K tree pointed to by self.

*Returns*: Observable<HttpResponse>

```
    // ** connect to server **
    this.sk.connect(...);

    ...
    
    this.sk.getSelf().subscribe(
        response=> { ... },
        error=> { ... }
    );
```

#### getSelfId()

Returns the self identity.

*Returns*: Observable<HttpResponse>

```
    // ** connect to server **
    this.sk.connect(...);

    ...
    
    this.sk.getSelfId().subscribe(
        response=> { ... },
        error=> { ... }
    );
```


### STREAM API Functions:

The following functions facilitate interaction with the Signal K STREAM API via the 
established connection.

Use the `connect(...)` or `connectDelta()` functions prior to using any of these API functions!


#### STREAM API Events

The following STREAM events are exposed for the purposes of interacting with the Signal K delta stream:

- onConnection: Raised when web socket connection is made.

- onError: Raised upon stream error.

- onClose: Raised when web socket connection is closed.

- onMessage: Raised when a message is received on web socket connection.

Subscribe to these events to interact with the Signal K delta stream.

```
    this.sk.onConnect.subscribe( e=> {
        ...
    });
    this.sk.onError.subscribe( e=> {
        ...
    });
    this.sk.onClose.subscribe( e=> {
        ..
    });
    this.sk.onMessage.subscribe( e=> {
        ...
    }); 
```

#### filter (attribute)

Use the filter attribute to ignore all recieved delta messages except for those 
from specified vessel.

Specify 'self' or the `uuid` of the vessel.

To clear the filter set it to null.

```
    // **** see only delta messages from 'self' ****
    this.sk.filter= 'self';
    this.sk.filter 'vessels.self';

    // **** see only delta messages from vessel with uuid= urn:mrn:signalk:uuid:c63cf2d8-eee1-43ef-aa3b-e1392cee5b7c 
    this.sk.filter= 'urn:mrn:signalk:uuid:c63cf2d8-eee1-43ef-aa3b-e1392cee5b7c';
    this.sk.filter= 'vessels.urn:mrn:signalk:uuid:c63cf2d8-eee1-43ef-aa3b-e1392cee5b7c';

    // **** Remove the filter ****
    this.sk.filter= null;
```


#### subscribe(context, path, *period, format, policy, minPeriod*)

Subscribe to specific Signal K paths in the  delta stream.

By default the delta stream will contain all updates for vessels.self. Use the subscribe function to 
specify which updates to recieve in the delta stream.

- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *path*: path to Signal K resource *(dotted notation)*

- *period (optional)*: Period in milliseconds in between transmission *(default: 1000)*

- *format (optional)*: Transmission format 'delta' or 'full' *(default: 'delta')*
    
- *policy (optional)*: 'instant', 'ideal', 'fixed' *(default: 'ideal')*

- *minPeriod (optional)*: Fastest transmission rate allowed. *(relates only to policy= 'instant')*

*Note: you can specify none or all optional parameters. If used they need to be specified in the order detailed above.*


```
    // **** subscribe using defaults ****
    this.sk.subscribe('self','navigation.courseOverGroundTrue');

    // **** subscribe using some specified options ****
    this.sk.subscribe('self','navigation.courseOverGroundTrue', 2000, 'full');

    // **** subscribe to all updates ****
    this.sk.subscribe();    
```


#### unsubscribe(context, path)

Unubscribe from specific Signal K paths so they are no longer received in the delta stream.

```
    // **** unsubscribe from specific updates ****
    this.sk.unsubscribe('self','navigation.courseOverGroundTrue');

    // **** unsubscribe from all updates ****
    this.sk.unsubscribe();    
```


#### send(data)

Send data to the Signal K server STREAM API.

- *data*: Valid Signal K formatted data sent to the server.

*Returns*: Subscribe to SignalKClient events to receive results of actions.

```
    // ** connect to server **
    this.sk.connect(...);

    ...

    // **** send data to STREAM API ****
    this.sk.send({
        "context": "vessels.self",
        "put": {
            "path": "steering.autopilot.target.headingTrue",
            "source": "actisense.204",
            "value": 1.52
        }
    });
```


#### sendUpdate(context, path, value)

Send delta update via the Signal K server STREAM API.

- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *path*: path to Signal K resource *(dotted notation)*

- *value*: value to write

*Returns*: Subscribe to SignalKClient events to receive results of actions.

```
    // ** connect to server **
    this.sk.connect(...);

    ...

    // **** send update to STREAM API ****
    this.sk.sendUpdate("vessels.self", "steering.autopilot.target.headingTrue", 1.52);
```


#### isDelta(msg)

Returns true if recieved message is a delta message containing updates.

- *msg*: Signal K delta message

*Returns*: boolean

```
    // ** connect to server **
    this.sk.connect(...);

    ...

    this.sk.onMessage.subscribe( e=> {
        if( this.sk.isDelta(e) ) { ... }
    });    
```


#### isHello(msg)

Returns true if recieved message is a Signal K server 'hello' message.

- *msg*: Signal K delta message

*Returns*: boolean

```
    // ** connect to server **
    this.sk.connect(...);

    ...

    this.sk.onMessage.subscribe( e=> {
        if( this.sk.isHello(e) ) { ... }
    });    
```


### ALARMS

The following are functions and classes that support interaction with Signal K notification / alarm functionality.

Be sure to `import` these along with `SignalKClient`in your application;
```
import {Alarm, AlarmState, AlarmMethod, SignalKClient} from signalk-client-angular;
```


#### raiseAlarm(context, alarmPath, alarm)

Raise an alarm to trigger the server to send a notification message.


- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *alarmPath*: path of alarm in the `notifications` tree. *(e.g. 'mob')*

- *alarm*: `Alarm` object that defines the alarm to raise. 

*See datails regarding `Alarm` and associated classes below.*

```
import {Alarm, AlarmState, AlarmMethod, SignalKClient} from signalk-client-angular;
    ...
    this.sk.connect( ... );
    ...

    let al= new Alarm('Vessel is sinking!');
    al.state= AlarmState.warn;
    al.method= [AlarmMethod.visual];
    this.sk.raiseAlarm('self', 'sinking', al);
```

#### clearAlarm(context, alarmPath)

Clear alarm that was raised using `raiseAlarm()` function.


- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *alarmPath*: path of alarm in the `notifications` tree. *(e.g. 'mob', 'sinking')*

```
    this.sk.clearAlarm('self', 'sinking');
    ...
    this.sk.clearAlarm('self', 'navigation.anchor.currentRadius');

```



#### Alarm (class)

Class to encapsulate Alarm message that is raised when using `raiseAlarm()`.

**Usage**
```
let al= new Alarm();

let al= new Alarm('Anchor drag alarm!!!');
```

**Constructor**

`Alarm(message:string)`

- *message*: (optional) string containing alarm message text.

**Attibutes**

- *message*: String containing alarm message text.

- *state*: Alarm state value *default: `AlarmState.normal`*

- *method*: Array of AlarmMethod values. *default: `[AlarmMethod.visual, AlarmMethod.sound]`*


#### AlarmState (enum)

AlarmState defines the valid values for Signal K alarm state parameter.

```
AlarmState.normal
AlarmState.alert
AlarmState.warn
AlarmState.alarm
AlarmState.emergency
```

#### AlarmMethod (enum)

AlarmMethod defines the valid values for Signal K alarm method parameter.

```
AlarmMethod.visual
AlarmMethod.sound
```

