# APP:

The `app` object provides methods to facilitate interaction with applications installed on the Signal K server.

i.e. /signalk/v1/apps

[SignalKClient](README.md): Class for interacting with Signal K server

[api](HTTP_API.md): class for interacting with Signal K HTTP API

[stream](STREAM_API.md): class for interacting with Signal K STREAM API

*Follow the links for the relevant documentation.*

---

[Methods](#methods)
- `list()`

---

### Methods

`list()`

Returns the list of applications installed on the Signal K server.

```
this.sk.apps.list().subscribe( 
    appsList=> {
        appsList.forEach( app=> {
            console.log(app.name);
        });
    }
);         
```

---
