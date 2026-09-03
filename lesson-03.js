"use strict";

// Lesson 3: Promises, async, and await.
// Standalone programs and observations go in this file as code and comments.
// The loader work happens in stretch-records/script.js.
//

// Step 3, the ordering puzzle: write a program mixing plain logs, a zero
// delay timer, and a settled Promise reaction. Predict the full output order
// in comments before running, then explain in one sentence why the Promise
// beat the timer.

function orderingPuzzle() {
  console.log("I am the first here.");

  // Zero-delay timer (goes to the Macro/Task Queue)
  setTimeout(() => {
    console.log("I am the last.");
  }, 0);

  // Settled Promise reaction (goes to the Microtask Queue)
  Promise.resolve().then(() => {
    console.log("I am the third.");
  });

  console.log("I am the second.");
  // PREDICTED OUTPUT ORDER:
  // 1. I am the first here.
  // 2. I am the second.
  // 3. I am third.
  // 4. I am the last.
}
orderingPuzzle();
/*Output from node js console:
 asemahassan@Asemas-MacBook-Pro system-design-stretch % node lesson-03.js
I am the first here.
I am the second.
I am the third.
I am the last.
*/

//
// Step 6: paste the final rethrown message that reached the top.
//create a simple method to check the rethrow messages concept using persons age while processing profile data
function calculateSquareRoot(value) {
  if (typeof value !== "number") {
    throw new TypeError(
      "Input must be a numeric value to calculate square root",
    ); // Raw error thrown
  }
  return Math.sqrt(value);
}

// catch the error, adds context, and rethrows onward
function userProfileData(input) {
  try {
    const result = calculateSquareRoot(input);
    return result;
  } catch (rawError) {
    // Add context naming the page (Registration Page) and the operation (Age Verification)
    const contextMessage = `[Registration Page - Age Verification Operation] Cannot compute age metrics. 
    Technical Reason: ${rawError.message}`;

    // Throw onward
    throw new Error(contextMessage);
  }
}

//Trigger the failure by passing a string instead of a number to test
try {
  userProfileData("twenty-five"); // This triggers the error
} catch (topLevelError) {
  console.log(topLevelError.message);
}

/* OUTPUT from node console:
asemahassan@Asemas-MacBook-Pro system-design-stretch % node lesson-03.js
I am the first here.
I am the second.
[Registration Page - Age Verification Operation] Cannot compute age metrics. 
    Technical Reason: Input must be a numeric value to calculate square root
I am the third.
I am the last.
    */

//Step 7: Run three independent delayed tasks with Promise.all() and log the combined result. Then make one of them reject,
// observe the whole call fail, switch to Promise.allSettled(), and log every outcome, keeping the survivors.

// A simple function that returns a delayed promise
const delayValue = (value, ms, shouldSucceed = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => (shouldSucceed ? resolve(value) : reject("Broke!")), ms);
  });
};

//check for all scenarios here
async function testPromises() {
  //test 1
  console.log("Test 1: All Succeed with Promise.all");
  const successBatch = [delayValue("A", 100), delayValue("B", 200)];
  const goodResults = await Promise.all(successBatch);
  console.log("Combined Result:", goodResults); // Output: ['A', 'B']

  //test 2 for failure
  console.log("\nTest 2: One Fails");
  const badBatch = [delayValue("A", 100), delayValue("B", 200, false)]; // 'B' will fail
  try {
    await Promise.all(badBatch);
  } catch (error) {
    console.log("Result: Entire call failed because of:", error); // Output: Broke!
  }

  // test 3 use promise all settled to check for survivors
  console.log("\nTest 3: Keeping Survivors");
  const outcomes = await Promise.allSettled(badBatch);
  console.log("All Raw Outcomes:", outcomes);

  // Extract only the ones that worked at the end.
  const survivors = outcomes
    .filter((item) => item.status === "fulfilled")
    .map((item) => item.value);

  console.log("Kept Survivors:", survivors); // Output: ['A']
}

//test all scenarios of promises.
testPromises();

/*Output node console:
asemahassan@Asemas-MacBook-Pro system-design-stretch % node lesson-03.js
I am the first here.
I am the second.
[Registration Page - Age Verification Operation] Cannot compute age metrics. 
    Technical Reason: Input must be a numeric value to calculate square root
Test 1: All Succeed with promise.all
I am the third.
I am the last.
Combined Result: [ 'A', 'B' ]

Test 2: One Fails
Result: Entire call failed because of: Broke!

Test 3: Keeping Survivors
All Raw Outcomes: [
  { status: 'fulfilled', value: 'A' },
  { status: 'rejected', reason: 'Broke!' }
]
Kept Survivors: [ 'A' ] */
