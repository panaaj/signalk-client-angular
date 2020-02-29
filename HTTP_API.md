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
- `post()`
- `delete()`
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
`put()`

Send a HTTP PUT request to a path relative to the Signal K server HTTP API path. *i.e. `/signalk/v1/api`*.

Overloaded method enables values to be supplied in the following ways: 

`put(path, value)`

*results in HTTP PUT '_<host_>/signalk/v1/api/_<path_>' {value: _<value_>}*

Note: context is set to `vessels.self` if path does not start with `vessels`.

`put(context, path, value)`

*results in HTTP PUT '_<host_>/signalk/v1/api/_<context_>/_<path_>' {value:  {_<value_>} }*

`put(context, path, key, value)`

*results in HTTP PUT '_<host_>/signalk/v1/api/_<context_>/_<path_>/_<key_>' {value:  {_<value_>} }*

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

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

`post(path, value)`

Send a HTTP POST request to a path relative to the Signal K server HTTP API path. *i.e. `/signalk/v1/api`*.


*Parameters:*

- *path*: path to Signal K resource  *(slash or dotted notation)*

- *value*: value to be written

*Returns*: Observable<HttpResponse>

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...
this.sk.api.post(
    'resource/waypoints', 
    {
        "urn:mrn:signalk:uuid:36f9b6b5-959f-46a1-8a68-82159742ccaa": {
            "position": {"latitude":-35.02577800787516,"longitude":138.02825595260182},
            "feature": {
                "type":"Feature",
                "geometry": {
                    "type":"Point",
                    "coordinates":[138.02825595260182,-35.02577800787516]
                },
                "properties":{"name":"gds","cmt":""},
                "id":""
            }
        }
    }
).subscribe(
    res=> { console.log(res) },
    err=> { console.log(err) }
);
```
---

`delete(path)`

Send a HTTP DELETE request to a path relative to the Signal K server HTTP API path. *i.e. `/signalk/v1/api`*.


*Parameters:*

- *path*: path to Signal K resource  *(slash or dotted notation)*


*Returns*: Observable<HttpResponse>

*Example:*

```
// ** connect to server **
this.sk.connect(...);

...
this.sk.api.delete(
    'resource/waypoints/urn:mrn:signalk:uuid:36f9b6b5-959f-46a1-8a68-82159742ccaa'
).subscribe(
    res=> { console.log(res) },
    err=> { console.log(err) }
);
```
---

`getMeta(context, path)`

Returns the metadata for the specified context and path in the Signal K tree.

*Parameters:*

- *context*: Signal K context *e.g. 'vessels._<uuid_>', 'self'*

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