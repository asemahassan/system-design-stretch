"use strict";

// Lesson 4: HTTP and the Fetch API.
// Recorded observations go in this file as comments. The loader and form
// work happens in stretch-records/script.js, against the server you run
// with json-server.

/*Console Output Errors:
Initialization started.
script.js:13  GET http://localhost:3000/artists net::ERR_CONNECTION_REFUSED
loadArtists @ script.js:13
initArtistsLoading @ script.js:86
(anonymous) @ script.js:140
script.js:23 Error loading JSON data: TypeError: Failed to fetch
    at loadArtists (script.js:13:28)
    at initArtistsLoading (script.js:86:27)
    at script.js:140:1
loadArtists @ script.js:23
await in loadArtists
initArtistsLoading @ script.js:86
(anonymous) @ script.js:140
script.js:102 Caught an error during initialization: ReferenceError: error is not defined
    at initArtistsLoading (script.js:90:66)
initArtistsLoading @ script.js:102
await in initArtistsLoading
(anonymous) @ script.js:140
script.js:106 Initialization attempt completed.
*/

/*Running json server properly: 
asemahassan@Asemas-MacBook-Pro stretch-records % npx json-server artists.json --port 3000

Need to install the following packages:
json-server@1.0.0-beta.15
Ok to proceed? (y) y
JSON Server started on PORT :3000
Press CTRL-C to stop
Watching artists.json...

♡⸜(˶˃ ᵕ ˂˶)⸝♡

Index:
http://localhost:3000/

Static files:
Serving ./public directory if it exists

Endpoints:
http://localhost:3000/artists
*/

/*Output DevTools --> Console
Initialization started.
script.js:92 Array(6)0: {name: 'Pinkfong', genre: "Children's music", total: '11:31', photo: 'images/pinkfong.jpeg', id: 'np_3gmHInn0'}1: {name: 'Adriano Celentano', genre: 'Italian pop', total: '20:52', photo: 'images/adriano-celentano.jpg', id: 'PcYhUF7RT78'}2: {name: 'Asake', genre: 'Afrobeats', total: '14:08', photo: 'images/asake.jpg', id: 'gyeQpJKnsbg'}3: {name: 'Miyagi and Andy Panda', genre: 'Hip-hop', total: '16:21', photo: 'images/miyagi-and-andy-panda.jpg', id: 'r_XwynrsWvQ'}4: {name: 'Johnny Cash', genre: 'Country', total: '15:40', photo: 'images/johnny-cash.jpg', id: 'vmR3ClEjNjM'}5: {name: 'Henry Moodie', genre: 'Britist Hop', total: '25:40', photo: 'images/henry.jpeg', id: 'A-TXUl7JXfE'}length: 6[[Prototype]]: Array(0)
script.js:93 Total artists: 6
script.js:106 Initialization attempt completed.
 */
// Step 2: both status codes and the response Content-Type.
/*Output DevTools-->Network-->artists
Status Code 200 OK
Content Type application/json
Sun, 23 Aug 2026 16:01:07 GMT
 */
// Step 3: ok, status, and one Access-Control-Allow header from the Network tab.
/*Output DevTools-->Console
ok: true
redirected:false
status:200
statusText: OK
Output DevTools --->Network

HTTP/1.1 200 OK
X-Powered-By: tinyhttp
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, PUT, PATCH, POST, DELETE
Access-Control-Allow-Headers: content-type
Content-Type: application/json
Date: Sun, 23 Aug 2026 16:13:48 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 902

 */
// Step 4: show that the Promise fulfilled anyway on the wrong path.
/*Output -->DevTools -->Console with wrong path
script.js:86 Initialization started.
localhost:3000/artist:1  Failed to load resource: the server responded with a status of 404 (Not Found)
script.js:16 Raw Response Object: Responsebody: (...)body Used: false headers: Headers[[Prototype]]: Headers ok: false redirected: false status: 404
statusText: "Not Found"type: "basic"url: "http://localhost:3000/artist"

script.js:27 Error loading JSON data: Error: Request failed with status 404
    at loadArtists (script.js:19:13)
    at async initArtistsLoading (script.js:90:21)
loadArtists @ script.js:27
script.js:106 Caught an error during initialization: ReferenceError: error is not defined
    at initArtistsLoading (script.js:94:66)
initArtistsLoading @ script.js:106
script.js:110 Initialization attempt completed.

*/
// Step 5: how did the refused connection differ from the 404?
/*Output after stopping the JSON server.
No Raw Response Object was logged.
Network Tab shows no response headers.
___________
Initialization started.
localhost:3000/artists:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
script.js:27 Error loading JSON data: TypeError: Failed to fetch
    at loadArtists (script.js:13:28)
    at initArtistsLoading (script.js:93:27)
    at script.js:147:1
loadArtists @ script.js:27
script.js:31 Loading Artists from JSON Attempt Complete !!!
script.js:109 Caught an error during initialization: ReferenceError: error is not defined
    at initArtistsLoading (script.js:97:66)
initArtistsLoading @ script.js:109
script.js:113 Initialization attempt completed.

 */
// STRETCH, step 8: the public API's endpoint address, the method, one
// parameter, the response shape you would code against, and one stated limit.
