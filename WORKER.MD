# WORKER:

[SignalKClient](README.MD): Class for interacting with Signal K server

[api](HTTP_API.MD): class for interacting with Signal K HTTP API

[stream](STREAM_API.MD): class for interacting with Signal K STREAM API

*Follow the links for the relevant documentation.*

[Attributes](#attributes)
- `server`
- `version`
- `authToken`

[Methods](#methods)
- `init()`
- `postMessage()`
- `terminate()`

[Events](#events)
- `onMessage()`
- `onError()`

---

### Methods

`init(path_to_script)`

Creates the WebWorker using the supplied javascrip script file.

- *e.g. './assets/js/worker.js*

*Note: The `worker` class provides a wrapper for Worker script files. These files must be valid javascript worker files.*

---

`postMessage(msg)`

Send message to worker script. Use this to control worker script operation.

---

`terminate()`

Terminate the worker immediately.

---

### Events

The following STREAM events are exposed for the purposes of interacting with the worker script:

- `onMessage`: Raised when a message is received from the worker.

- `onError`: Raised upon an error event in the worker.



Subscribe to these events to interact with the worker script.

*Example:*

```
this.sk.worker.onMessage.subscribe( e=> {
    ...
}); 
this.sk.worker.onError.subscribe( e=> {
    ...
});
```
---