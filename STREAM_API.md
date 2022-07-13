# STREAM API:

The `stream` object provides methods to facilitate interaction with the Signal K STREAM API for the preferred api version as defined with the `version` attribute. 

*e.g. `/signalk/v1/stream`*

**Note: You must use any of the `connect` or `open` methods prior to calling any of these API functions!**

[SignalKClient](README.md): Class for interacting with Signal K server

[api](HTTP_API.md): class for interacting with Signal K HTTP API

[apps](APPS.md): class to enable interaction with applications installed on the Signal K server.

*Follow the links for the relevant documentation.*

---

[Attributes](#attributes)
- `isopen`
- `connectionTimeout`
- `filter`
- `selfId`
- `playbackMode`
- `source`
- `authToken`

[Methods](#methods)
- `open()`
- `close()`
- `login()`
- `put()`
- `sendRequest()`
- `sendUpdate()`
- `send()`
- `subscribe()`
- `unsubscribe()`
- `isHello()`
- `isDelta()`
- `isResponse()`
- `isSelf()`
- `raiseAlarm()`
- `clearAlarm()`

[Events](#events)
- `onConnect()`
- `onClose()`
- `onError()`
- `onMessage()`

[Alarms](#alarms)
- `Alarm`
- `AlarmState`
- `AlarmType`

---

### Attributes


`isOpen: boolean`

Returns true if WebSocket connection is established.

---

`playbackMode: boolean`

Returns true if stream is a history playback data stream.

---

`connectionTimeout: number`

Set stream connection timeout value in milliseconds. default=20000 (20 sec).

If a connection has not been established within the specified time period the connection attempt is aborted and an `onError` event is raised.

*Parameters:*
- *period*: Number of milliseconds to elapse before connection attempt is aborted.

*Valid value range is 3000 to 60000 milliseconds (3 to 60 sec).*

*Example:*
```javascript
this.sk.stream.connectionTimeout= 10000;

this.sk.stream.connect( ... );
```
---
`filter: string`

Use the filter attribute to only include messages with the context of the supplied `uuid`.

*Parameters:*

- *uuid*: The `uuid` of messages to include in the `onMessage` event. Can also use `self` or `vessel.self`. To clear the filter set the value of `uuid` to `null`.

*Examples:*

```javascript
// **** see only delta messages from 'self' ****
this.sk.stream.filter= 'self';
this.sk.stream.filter 'vessels.self';

// **** see only delta messages from vessel with uuid= urn:mrn:signalk:uuid:c63cf2d8-eee1-43ef-aa3b-e1392cee5b7c 
this.sk.stream.filter= 'urn:mrn:signalk:uuid:c63cf2d8-eee1-43ef-aa3b-e1392cee5b7c';

// **** Remove the filter ****
this.sk.stream.filter= null;
```
---

`selfId: string`

Value of the Self identity returned in the WebSocket `hello` message.

---

`source: string`

Source label value to be used in messages sent to the Signal K server.

_Example:_
```javascript
this.sk.stream.source= 'my-app-name';

this.sk.stream.sendUpdate(....);

// ** resultant message payload **
{
    context: 'vessels.self',
    updates: [
        {
            source: {label: 'my-app-name'},
            timestamp: .....,
            values: [... ]
        }
    ]
}
```
---

`authToken: string`:

A token string to be used for authentication when interacting with the Signal K server.

Use the `login()` method to authenticate to the server and retrieve a token for the specified user.

*Example:*
```javascript
this.sk.stream.authToken= '<auth_token_string>';
```

Once you have supplied an `authToken` it will be used for all subsequent operations. 

---

### Events

The following STREAM events are exposed for the purposes of interacting with the Signal K delta stream:

- `onConnection`: Raised when WebSocket connection is made.

- `onError`: Raised upon stream error.

- `onClose`: Raised when WebSocket connection is closed.

- `onMessage`: Raised when a message is received on WebSocket connection.

Subscribe to these events to interact with the Signal K delta stream.

*Example:*

```javascript
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
```
---

### Methods

`open(url, subscribe, token)`

Opens Signal K server DELTA stream.

*Paramaters:*

- *url*: url of Signal K stream endpoint. If `null` or `undefined` will use the discovered stream endpoint url for the preferred api `version`.

- *subscribe*: Signal K subcription request value: 'all', 'self' or 'none'. *(Uses server default if null)*

- *token*: Authentication token.

*Returns*: true or Error().  Subscribe to `SignalKClient.stream` events to receive results of actions.

```javascript
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

// **** CONNECT to a discovered stream endpoint ****
this.sk.stream.open( null, 'self');

// **** CONNECT to a specified Signal K Stream ****
this.sk.stream.open( 'stream_url', 'self');
```

---

`close()`

Closes Signal K Delta stream.

---

`login(username,password)`

Authenticate user to Signal K server vai STREAM API.

_Note: The `stream` object will process the login response message and retain the returned token for use in future requests._

*Parameters:*

- *username*: User name to authenticate

- *password*: User password.

*Returns*: The `requestId` of the put request. Use this `requestId` to determine the status of the request from returned stream message(s).

*Example:*

```javascript
// ** connect to server **
this.sk.streamOpen(...);

let id= this.sk.stream.login("myuser", "myUserPassword");
```
---

`put(context, path, value)`

Put value to Signal K path via the Signal K server STREAM API.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

- *path*: path to Signal K resource *(dotted notation)*. Can also be an array of valid Signal K subscription objects.

- *value*: value to write

*Returns*: The `requestId` of the put request. Use this `requestId` to determine the status of the request from returned stream message(s).

*Example:*

```javascript
// ** connect to server **
this.sk.connect(...);

...
// **** send update to STREAM API ****
let id= this.sk.stream.put("vessels.self", "steering.autopilot.target.headingTrue", 1.52);
```
---

`sendRequest(value)`

Send Request message via the Signal K server STREAM API.

A `requestId` is automatically generated and added to the message by the method.

This method will also detect and include an authentication token from prevous `login()` method calls.

*Parameters:*

- *value*: Object containing the message payload.

- *path*: path to Signal K resource *(dotted notation)*. Can also be an array of valid Signal K subscription objects.

- *value*: value to write

*Returns*: The `requestId` of the put request. Use this `requestId` to determine the status of the request from returned stream message(s).

*Example:*

```javascript
// ** connect to server **
this.sk.streamOpen(...);

...
// **** send request to STREAM API ****
this.sk.stream.sendRequest( {
    key1: 'Key1 data.',
    key2: 'Key2 data.'
});
```

---

`sendUpdate(context, path, value)`

Send delta update via the Signal K server STREAM API.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

- *path*: path to Signal K resource *(dotted notation)*. Can also be an array of valid Signal K subscription objects.

- *value*: value to write

*Returns*: Subscribe to `SignalKClient.stream` events to receive results of actions.

*Example:*

```javascript
// ** connect to server **
this.sk.connect(...);

...
// **** send update to STREAM API ****
this.sk.stream.sendUpdate("vessels.self", "steering.autopilot.target.headingTrue", 1.52);

this.sk.stream.sendUpdate("vessels.self", [
    {path: "steering.autopilot.target.headingTrue", value: 1.52},
    {path: "navigation.speedOverGround.", value: 12.52}
]);
```
---

`send(data)`

Send data to the Signal K server STREAM API.

*Parameters:*

- *data*: Valid Signal K formatted data sent to the server.

*Returns*: Subscribe to `SignalKClient.stream` events to receive results of actions.

*Example:*

```javascript
// ** connect to server **
this.sk.connect(...);

...

// **** send data to STREAM API ****
this.sk.stream.send({
    "context": "vessels.self",
    "put": {
        "path": "steering.autopilot.target.headingTrue",
        "source": "actisense.204",
        "value": 1.52
    }
});
```
---

`subscribe(context, path, options?)`

Subscribe to specific Signal K paths in the delta stream.

By default the delta stream will contain all updates for vessels.self. Use the subscribe function to 
specify which updates to recieve in the delta stream.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

- *path*: path to Signal K resource *(dotted notation)*. Can also be an array of valid Signal K subscription objects. 

- *options (optional)*: Object containing one or more of the following subscription options.
```javascript
{
    period: Time in milliseconds in between transmission (default: 1000),
    format: Transmission format 'delta' or 'full' (default: 'delta'),    
    policy: 'instant', 'ideal', 'fixed' (default: 'ideal'),
    minPeriod: Fastest transmission rate allowed. (relates only to policy= 'instant')
}
```
*Example:*

```javascript
// **** subscribe using defaults ****
this.sk.stream.subscribe('self','navigation.courseOverGroundTrue');

// **** subscribe using some specified options ****
this.sk.stream.subscribe('self','navigation.courseOverGroundTrue', {period: 2000});

// **** subscribe to a numbe rof paths ****
this.sk.stream.subscribe('self',[
    {path: 'navigation.courseOverGroundTrue', period: 2000},
    {path: 'navigation.speedOverGround', period: 2000}
]);

// **** subscribe to all updates ****
this.sk.stream.subscribe();    
```
---

`unsubscribe(context, path)`

Unubscribe from specific Signal K paths so data for the specified path(s) are no longer received in the delta stream.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

- *path*: path to Signal K resource *(dotted notation)*. Can also be an array of valid Signal K paths. 

*Examples:*
```javascript
// **** unsubscribe from specific updates ****
this.sk.stream.unsubscribe('self','navigation.courseOverGroundTrue');

this.sk.stream.unsubscribe('self', [
    'navigation.courseOverGroundTrue',
    'navigation.speedOverGround'
]);

// **** unsubscribe from all updates ****
this.sk.stream.unsubscribe();    
```

---

`raiseAlarm(context, name, alarm)`

Send stream update to raise an alarm of the supplied name.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

- *name*: String containing a name for the alarm or an AlarmType _(see AlarmType below)_. 

- *alarm*: An `Alarm` object _(see Alarm below)_

*Examples:*
```javascript
this.sk.stream.raiseAlarm('self','Anchor', new Alarm(
    'Anchor dragging!',
    AlarmState.alarm,
    true, true )
);   

// ** using special alarm type **

this.sk.stream.raiseAlarm('self',AlarmType.sinking, new Alarm(
    'SINKING',
    AlarmState.alarm,
    true, true )
);   
```

---

`clearAlarm(context, name)`

Send stream update to clear the alarm of the supplied name.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

- *name*: Alarm name e.g.MOB, Anchor. 

*Examples:*
```javascript
this.sk.stream.clearAlarm('self','MOB');   
```

---

`isDelta(msg)`

Returns true if supplied message is a delta message containing updates.

*Parameters:*

- *msg*: Signal K delta message

*Returns*: boolean

*Example:*

```javascript
// ** connect to server **
this.sk.connect(...);

...

this.sk.onMessage.subscribe( e=> {
    if( this.sk.stream.isDelta(e) ) { ... }
});    
```

---

`isHello(msg)`

Returns true if supplied message is a Signal K server `hello` message.

*Parameters:*

- *msg*: Signal K delta message

*Returns*: boolean

*Example:*

```javascript
// ** connect to server **
this.sk.connect(...);

...

this.sk.onMessage.subscribe( e=> {
    if( this.sk.stream.isHello(e) ) { ... }
});    
```

---

`isResponse(msg)`

Returns true if supplied message is a Stream Request `response` message.

*Parameters:*

- *msg*: Signal K delta message

*Returns*: boolean

*Example:*

```javascript
// ** connect to server **
this.sk.connect(...);

...

this.sk.onMessage.subscribe( e=> {
    if( this.sk.stream.isResponse(e) ) { ... }
});    
```

---

`isSelf(msg)`

Returns true if supplied message context is for the `self` identity.

*Parameters:*

- *msg*: Signal K delta message

*Returns*: boolean

*Example:*

```javascript
// ** connect to server **
this.sk.connect(...);

...

this.sk.onMessage.subscribe( e=> {
    if( this.sk.stream.isSelf(e) ) { ... }
});    
```

---

### Alarms

`Alarm`

Alarm object that encapsulates an alarm message for use with `raiseAlarm()` method.

`new Alarm(<message>, <state>, <visual>, <sound>)`

*Parameters:*

- *message*: Alarm message text
- *state*: An AlarmState value.
- *visual*: true / false
- *sound*: true / false

`value`

Attribute that returns a formatted value for use with `raiseAlarm()` method.

*Example:*

```javascript
let al= new Alarm(
    'Anchor drag alarm!',
    AlarmState.alarm,
    true, true
) 

this.sk.stream.raiseAlarm('self', 'Anchor', al);
```

---

`AlarmState`

Set of valid Signal K alarm state values.

- `normal`
- `alert`
- `warn`
- `alarm`
- `emergency`

---

`AlarmType`

Special alarm types:
- `mob`
- `fire`
- `sinking`
- `flooding`
- `collision`
- `grounding`
- `listing`
- `adrift`
- `piracy`
- `abandon`

---    
