# CHANGELOG: signalk-client-angular

### v1.5.0

This version represents a significant refactoring of SignalKClient to better align it with recent enhancements to the Signal K specification. It contains **MANY BREAKING CHANGES** so please review the [README](README_MD) before upgrading!

It introduces the new classes to interact with Signal K API's:

[api](HTTP_API.MD): class for interacting with Signal K HTTP API endpoint path

[stream](STREAM_API.MD): class for interacting with Signal K STREAM API endpoint path

It also provides a [worker](WORKER.MD)  class as a wrapper for WebWorker scripts to enable moving Signal K data processing off the main thread.


### v1.4.1

- updated to align with updated security specification.

### v1.4.0

- add support for *History Playback* api via `playback()`, `connectPlayback()` and `snapshot()` methods
- added `isConnected` property

### v1.3.5

- bug fixes: corrects issue where secure connection to web socket endpoint was using `ws://` rather than `wss://`

### v1.3.4

- bug fixes

### v1.3.3

- bug fixes

### v1.3.2

- added overloaded apiPut() method `apiPut(context, path, value)`


### v1.3.0

- added put() and post() to enable these actions to urls outside the */signalk/v1/api/* scope.


### v1.2.0

- added Alarm functionality `raiseAlarm()`, `clearAlarm()`.

- added ability to see if Signal K server has security enabled via the`authRequired` attribute.

- get list of supported api versions by server via the `apiVersions` attribute.


### v1.1.0

- added `connectionTimeout` attribute.

- added `sendUpdate()` function to enable updates to be sent to Delta Stream.

- added support for Authentication via `authtoken` attribute and `login()` function.


### v1.0.1

- `connectDelta()` function added to allow connection to servers that do not reply with an HTTP discovery response detailing service endpoints.


**BREAKING CHANGES:**

- `version` attribute is now a number not a string.


### v1.0.0

Initial Release
