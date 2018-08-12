# CHANGELOG: signalk-client-angular


### v1.2.0

- added Alarm handling `clearAlarm()`, `setAlarm()`.


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
