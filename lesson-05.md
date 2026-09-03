# Lesson 5: The System Audit (This whole exercise is done with assistance from AI, analyzed localhost, network and console tabs but lacked technical terms to explain it properly in system audit language, AI assisted to formulate the right structure)

The written audit of your running system. Every claim must be backed by
something you observed in the Network tab, the console, or the server's
terminal output.

## Single point of failure

-->Single Point of Failure is any component whose failure stops the entire system (or a critical feature) from working.
In this architecture, the Node.js server running on port 3001 is a Single Point of Failure for the label data and application initialization.

While fetching data from local servers using fetch()
i-e fetch("http://localhost:3000/artists")
fetch("http://localhost:3001/label")
If one of the servers e-g 3001 is not online the HTML page still loads but throws an error with a message on screen.
"Error loading data. Please try again later."

---

_Original Console Output_
Initialization started.
script.js:17 GET http://localhost:3001/label net::ERR_CONNECTION_REFUSED
loadArtists @ script.js:17
initArtistsLoading @ script.js:101
(anonymous) @ script.js:126
script.js:42 Error loading JSON data: TypeError: Failed to fetch
at loadArtists (script.js:17:7)
at initArtistsLoading (script.js:101:27)
at script.js:126:1
loadArtists @ script.js:42
await in loadArtists
initArtistsLoading @ script.js:101
(anonymous) @ script.js:126
script.js:46 Loading Data from JSON Attempt Complete !!!
script.js:117 Caught an error during initialization: ReferenceError: error is not defined
at initArtistsLoading (script.js:105:66)
initArtistsLoading @ script.js:117
await in initArtistsLoading
(anonymous) @ script.js:126
script.js:121 Initialization attempt completed.

---

_Conclusion_
*When the server on port 3001 is offline while port 3000 is online, the core HTML structure successfully loads into the browser. However, the application fails to completely initialize or render its data-dependent views. This architectural vulnerability is proven by the following sequence observed in the browser Console tab: The Network Block: The browser attempts an asynchronous fetch request but is blocked by the dead port, spitting out a low-level network refusal:
-->script.js:17 GET http://localhost:3001/label net::ERR_CONNECTION_REFUSED
*The Catch Block: The promise cannot resolve, the fetch API throws a standard browser error which is caught by the script's catch block:
script.js:42 Error loading JSON data: TypeError: Failed to fetch

## Latency

When both servers are running and data is retrieved from both JSON files label and artists:
The Network tabs shows:
14 requests
1.9 kB transferred
737 kB resources
Finish: 2.05 s
DOMContentLoaded: 29 ms
Load: 29 ms

The 2.05s latency is because we are using asynch function to load both files.

## Caching

Our JSON files are not that big in size total 1.9 kB transferred.
label.json 0.5 kB and artists.json 1.5kB
_Conclusions_ The observed data from the Network tab provides a clear baseline of how the browser handles optimization and data retrieval across the application. The system's network behaviors can be categorized into three distinct operational states:

_Memory Cache Execution_ Core styling dependencies—specifically the Google Font stylesheet (css2?family=Inter...) and the associated font file (UcC73F...woff2)—register a transfer size of (memory cache) and a latency of 0 ms. This confirms that the browser completely bypasses the network stack for external design dependencies, pulling them instantly from local RAM based on previous page-load data.

_Conditional Requests (304 Handshakes)_ The seven application artist images (including asake.jpg and johnny-cash.jpg) display a transfer footprint of 0.0 kB while requiring between 14 ms and 18 ms of processing time. This latency profile indicates the execution of conditional HTTP requests. The browser validates file integrity with the local server, receives a 304 Not Modified handshake, and renders the assets locally without re-downloading the source image bytes.

_Raw Data Overhead_ The remaining network traffic is heavily consolidated within the core script files and data endpoints. The dynamic components—label (0.5 kB in 4 ms) and artists (1.5 kB in 2 ms)—account for the bulk of the 1.9 kB total transferred data metric.

The current architecture relies entirely on native browser behavior to optimize static assets and media files. Because the local backend servers emit no explicit cache-control directives for dynamic endpoints, the core application data must be pulled fresh on every initialization. This ensures data accuracy but binds total page latency directly to the real-time responsiveness of ports 3000 and 3001.

## The layers

_---------Layer 1: PRESENTATION LAYER (Browser/The Client/DOM)---------_
\*HTML Parsed (index.html) -> Triggers CSS (styles.css)
-->The visual layout rendered by the browser. The entry point for this layer is our main page index.html
The Initiator column shows that index.html is what requested styles.css (line 12) and script.js (line 80).
This represents the visual outer shell loading up.

_---------Layer 2: APPLICATION Layer (The Controller, JS and core logic)---------_
\*The script.js executes -> Fires fetch() at lines 16 & 17
-->The JavaScript file executing logic, making decisions, and managing network requests.
Looking at the Initiator column of our data. It was not the HTML file that requested our database; it was the script.js:16 and script.js:17 executing fetch() commands to pull artists and label json files from local hosts. When the data arrived, script.js:62 programmatically injected the image tags into the HTML, triggering the downloads for all .jpg images.

_---------Layer 3: DATA LAYER (The Backend: Node.js Servers & JSON Files)---------_
\*Port 3000 & 3001 serve 'artists' (1.5kB) & 'label' and Returns JSON -> script.js loops & mounts images
-->It is the underlying data storage system ( Node servers reading the JSON files).
The Type column classifies label and artists as fetch.
They returned pure data payloads (1.5 kB and 0.5 kB) rather than UI documents, proving they came from an API endpoint meant to feed the Application Layer.

## One request's full journey

The lifecycle of a single user-driven event—specifically, the execution of the artist data initialization sequence—traces a sequential path across the client-side environment and the network loopback. Backed by logs from the browser console, network inspector, and terminal outputs, the journey proceeds as follows:

_The Client-Side Trigger_ The browser parses the document tree --> executes the script environment
The console prints --> Initialization started signaling that the application runtime has begun parsing script.js to coordinate the user interface.

_The Outgoing Network Flight_ The execution engine reaches the application logic layer. As documented by the Network tab, script.js at line 16 issues an asynchronous fetch() API command. The browser packages this into an HTTP GET request directed toward the network endpoint http://localhost:3000/artists.json

_Processing & The Data Layer_ The Node.js server listening on port 3000 intercepts the incoming TCP connection. The backend filesystem operations read the physical artists.json file from disk, serialize the artist array into a text stream, and return a _200 OK HTTP_ response package back through the local socket.

_Payload Resolution & Parsing_ The browser network stack catches the returning stream. The Network tab registers a finalized payload structure of 1.5 kB resolved over a 2 ms duration. Control returns to the script runtime, which resolves the JavaScript Promise and parses the raw string data back into usable memory objects.

_Dynamic Document Generation_ The journey concludes within the Presentation Layer. The application loop iterates over the array of artist objects. As proven by the Network tab's asset logs, script.js at line 62 dynamically alters the DOM tree by injecting brand new image nodes into the markup. This programmatic modification forces the browser to request contextual media files, such as asake.jpg and johnny-cash.jpg, completing the visual presentation for the end-user.

## STRETCH: what a real system would need that json-server skipped

A local-server mock environment like json-server provides an efficient baseline for local prototyping, it lacks the critical architecture required for a stable, secure, and production-ready enterprise application.

A real-world deployment would require the integration of the following infrastructure layers:

_Robust Exception Isolation (Crash Resilience)_ As observed in the initial system failure log, an offline server port caused a secondary, unhandled reference error (ReferenceError: error is not defined) that halted script execution. A real-world application requires centralized global boundary error catchers and robust semantic validation to guarantee the interface remains stable and fails gracefully even when network tiers go offline.

_Authentication and Access Authorization_ The prototype environment permits unauthenticated, open access to read and overwrite database entities. A production system must implement explicit cryptographic token exchanges (such as JSON Web Tokens or secure session cookies) alongside Middleware verification layers to restrict data access based on defined user roles.

_Persistent Storage Engines with Transaction Safety_ A mock server interacts directly with a single, flat JSON text file. If multiple asynchronous write requests occur simultaneously, file corruption or data race conditions will occur. Enterprise systems replace flat files with relational or document databases (such as PostgreSQL or MongoDB) that implement strict data types, schemas, and ACID transactions to preserve data integrity during concurrent workloads.

_Network Security and Rate Limiting_ The local setup has no defense mechanisms against excessive traffic. A real system must introduce security reverse-proxies (like Nginx or Cloudflare) to enforce Rate Limiting. This mechanism caps the maximum allowable requests an IP address can make per minute to mitigate Distributed Denial of Service (DDoS) attempts or malicious API scraping.
