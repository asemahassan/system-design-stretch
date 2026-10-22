"use strict";

// Lesson 2: Asynchronous JavaScript and the Event Loop.
// Standalone programs and observations go in this file as code and comments.

// ===== Provided program (task step 2): predict before you run =====
// Write your predicted output order as a comment BELOW, before running this
// file with node. Then run it, mark each line of your prediction right or
// wrong, and correct the wrong ones with one sentence each explaining why.

console.log("doors open");
setTimeout(() => console.log("encore"), 1000);
setTimeout(() => console.log("soundcheck"), 0);
console.log("main act");
setTimeout(() => console.log("intermission"), 500);
console.log("lights down");

// Your prediction:
// 1. doors open - correct
// 2. main act - correct
// 3. lights down - correct
// 4.soundcheck - correct
// 5.intermission - correct
// 6.encore - correct

/*Output:
asemahassan@Asemas-MacBook-Pro system-design-stretch % node lesson-02.js 
doors open
main act
lights down
soundcheck
intermission
encore
 */
// ===== Provided program (task step 4): trace the call stack =====
// Trace this as a written call stack diagram in comments, listing every push
// and pop in order. Then cause an error inside the innermost function and
// confirm the stack trace in the console matches your diagram, innermost
// first. Keep it commented out while you work on step 2.

function prepare(artist) {
  return "Now playing " + format(artist);
}
function format(artist) {
  return artist.name.toUpperCase(); //changed name to genre to create an error
}
console.log(prepare({ name: "Asake" }));

/*Output without error:
asemahassan@Asemas-MacBook-Pro system-design-stretch % node lesson-02.js
doors open
main act
lights down
Now playing ASAKE 
soundcheck
intermission
encore
 */

/*Output with error:
asemahassan@Asemas-MacBook-Pro system-design-stretch % node lesson-02.js
doors open
main act
lights down
/Users/asemahassan/Documents/SAP Developer/projects/system-design-stretch/lesson-02.js:45
  return artist.genre.toUpperCase();
                      ^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at format (/Users/asemahassan/Documents/SAP Developer/projects/system-design-stretch/lesson-02.js:45:23)
    at prepare (/Users/asemahassan/Documents/SAP Developer/projects/system-design-stretch/lesson-02.js:42:27)
    at Object.<anonymous> (/Users/asemahassan/Documents/SAP Developer/projects/system-design-stretch/lesson-02.js:47:13)
    at Module._compile (node:internal/modules/cjs/loader:1871:14)
    at Object..js (node:internal/modules/cjs/loader:2002:10)
    at Module.load (node:internal/modules/cjs/loader:1594:32)
    at Module._load (node:internal/modules/cjs/loader:1396:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47

Node.js v24.18.0 */

//step 6: build a count down function
function startConsoleCountdown(startNumber) {
  let currentCount = startNumber;

  // Log the initial number immediately
  console.log(currentCount);

  // Start the timer to run every 1000 milliseconds (1 second)
  const timerId = setInterval(() => {
    currentCount--;

    if (currentCount > 0) {
      console.log(currentCount);
    } else {
      clearInterval(timerId);
    }
  }, 1000);
}

//count down from 10 to zero
startConsoleCountdown(10);

/*Output:
asemahassan@Asemas-MacBook-Pro system-design-stretch % node lesson-02.js
doors open
main act
lights down
Now playing ASAKE
10
soundcheck
intermission
encore
9
8
7
6
5
4
3
2
1*/
