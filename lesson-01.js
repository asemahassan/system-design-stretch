"use strict";

// Lesson 1: The Client and Server Model.
// Your standalone code and written observations for this lesson live here,
// as code and comments. The site work happens in the stretch-records folder.
//
// Step 4: how many requests did the single page load make? List three by name.

/* Output: Chrome DevTools --> Network tab 
Total 10 requests
index.html
style.css
script.js
*/

//Step 5:  Move the artist array to artists.json file and call in script.js

// Step 6: which files changed when you added the sixth artist, which did not,
// and why is that separation the point?

//Output: only needed to change artists.json to add sixth artist, everything else works perfectly
// because the code iterates through the whole json and loads all artists. HTML also displays all cards.

// Step 7: paste the console error the broken artists.json produced.

// I added a semi-column at the end of the JSON file to break it

/*Console script.js:18 Error loading JSON data: SyntaxError: Unexpected non-whitespace 
character after JSON at position 843 (line 40 column 2) */

// Step 8: build one artist object, JSON.stringify() it, log the text,
// JSON.parse() it back, and log one property of the result.

// a sample artist object
const artistObject = {
  name: "Jay Z",
  genre: "Punjabi MC",
  total: "35:40",
  photo: "images/jayz.jpg",
};

// Converting the object to a JSON string
const jsonString = JSON.stringify(artistObject);
console.log("JSON String:", jsonString);

// Parse the JSON string back into a JavaScript object
const parsedObject = JSON.parse(jsonString);

//console log one property
console.log("Artist Name:", parsedObject.name);

/* Output:
JSON String: {"name":"Jay Z","genre":"Punjabi MC","total":"35:40","photo":"images/jayz.jpg"}
Artist Name: Jay Z
*/

// STRETCH, step 9: describe your page as a system. Name the client, name the
// server, and state what the request asked for and what the response carried.
/* Our page system:
The client side:  index.html is our front-end application interface, .css is the style file 
which displays how our client page will display elements.
script.js is our server side that fetches the data from database upon request
the data is stored in artists.json file*/
