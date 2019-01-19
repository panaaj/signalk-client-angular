# HTTP API Functions:

The `api` object provides methods to facilitate interaction with the Signal K HTTP API path for the preferred api version as defined with the `version` attribute. 

*e.g. `/signalk/v1/api`*

**Note: Use the `connect()` method prior to using any of these API functions!**

[SignalKClient](README.md): Class for interacting with Signal K server

[stream](STREAM_API.md): class for interacting with Signal K STREAM API

[worker](WORKER.md): class to enable the use of a WebWorker script to enable client data processing to occur off the main thread.

*Follow the links for the relevant documentation.*

---

[Methods](#methods)
- `get()`
- `put()`
- `getMeta()`
- `getSelf()`
- `getSelfId()`

---

### Methods

`get(path)`

Make a request to a path relative to the Signal K server HTTP API path. *i.e. `/signalk/v1/api`*.

*Parameters:*

- *path*: path relative to HTTP API 

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...

// **** make HTTP API request ****
this.sk.api.get('/resources/waypoints').subscribe(
    response=> { ... },
    error=> { ... }
);
```
---

`put(context, path, value)`

Send a HTTP PUT request to a path relative to the Signal K server HTTP API path. *i.e. `/signalk/v1/api`*.

*results in HTTP PUT '<host>/signalk/v1/api/<path>' {value: <value>}*

`put(context, path, key, value)`

*results in HTTP PUT '<host>/signalk/v1/api/<path>' {value: <key>: {<value>} }*

*Parameters:*

- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *path*: path to Signal K resource  *(slash or dotted notation)*

- *key*: name of attribute the value is being written to

- *value*: value to be written

*Returns*: Observable<HttpResponse>

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...
this.sk.api.put(
    'self',
    'environment/outside', 
    'temperature', 
    '297.4'
).subscribe(
    res=> { console.log(res) },
    err=> { console.log(err) }
);
```
---

`getMeta(context, path)`

Returns the metadata for the specified context and path in the Signal K tree.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels.<uuid>', 'self'*

- *path*: path to Signal K resource *(slash or dotted notation)*

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...

// **** Meta data request ****
this.sk.api.getMeta('self', 'navigation.speedOverGround').subscribe(
    response=> { ... },
    error=> { ... }
);
```
---

`getSelf()`

Returns the contents of the Signal K tree pointed to by self.

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...

this.sk.api.getSelf().subscribe(
    response=> { ... },
    error=> { ... }
);
```
---

`getSelfId()`

Returns the `uuid` of the self identity.

*Returns*: Observable

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...

this.sk.getSelfId().subscribe(
    response=> { ... },
    error=> { ... }
);
```
---