"use strict";

// The roster, exactly where the JavaScript course's finale left it: an array
// of artist objects at the top of the file, and one repeatable rule that
// renders it. In this course the data moves out of this file, step by step.

//Moved array to a artists.json file and loading it here using fetch()
// Function to load and use the artist data
// Function that returns the array of artists
async function loadArtists() {
  try {
    const response = await fetch("artists.json");
    const data = await response.json();

    // Return the array directly
    return data.artists;
  } catch (error) {
    console.error("Error loading JSON data:", error);
    return []; // Return empty array on failure to prevent app crashes
  }
}

const cardArea = document.querySelector(".cards");
// Every artist currently on the page, whatever the data's source. renderCards
// maintains this list, so the shuffle button and the form keep working no
// matter where the artists came from.
const roster = [];

// One card from one artist: the shared builder, used by the first render
// and by the form below.
function buildCard(artist) {
  const card = document.createElement("article");
  if (artist.photo) {
    const photo = document.createElement("img");
    photo.src = artist.photo;
    photo.alt = `${artist.name}, artist photo`;
    card.append(photo);
  }
  const title = document.createElement("h3");
  title.textContent = artist.name;
  const line = document.createElement("p");
  line.textContent = `${artist.genre}, ${artist.total} of music`;
  card.append(title, line);
  return card;
}

function renderCards(list) {
  for (const artist of list) {
    checkArtist(artist); //check if a particular artist name exists
    roster.push(artist);
    cardArea.append(buildCard(artist));
  }
}

//lesson-03 add a custom error class
class MissingDataError extends Error {
  constructor(field) {
    super("Required data is missing " + field);
    this.name = "MissingDataError";
  }
}

//function to check if a particular artist exists otherwise throw error
/*When added a dummy data in artists.json with no name
Console: script.js:65 Uncaught MissingDataError: Required data is missing name
    at checkArtist (script.js:65:27)
    at renderCards (script.js:49:5)
    at script.js:88:7 */
function checkArtist(artist) {
  if (!artist.name) throw new MissingDataError("name");
}

//created and updated method from lesson-01, lesson-02 and lesson-03 adding try,catch and finally
async function initArtistsLoading() {
  // Add the loading message in the card container
  cardArea.textContent = "Loading artists data: Please wait...";
  console.log("Initialization started.");

  try {
    //Fetch the data in the background
    const artists = await loadArtists();

    // Force an error if the array comes back empty (simulating a failure)
    if (!artists || artists.length === 0) {
      throw new Error("Artist load failed for the home page. " + error.message);
    }
    console.log(artists);
    console.log(`Total artists: ${artists.length}`);

    //Delay the visual rendering by 2 seconds on success
    setTimeout(() => {
      cardArea.textContent = "";
      renderCards(artists);
    }, 2000);
  } catch (error) {
    //Handle any network, parsing, or manual errors here
    console.error("Caught an error during initialization:", error);
    cardArea.textContent = "Error loading data. Please try again later."; //added message on screen when data is not loading.
  } finally {
    //Cleanup code that must run regardless of success or failure
    console.log("Initialization attempt completed.");
  }
}

//lesson-03 function to load artists using then, catch and finally
function loadArtistsWithDelayMessage() {
  // Set up the initial UI state immediately
  cardArea.textContent = "Loading artists data: Please wait...";

  //Start the asynchronous data fetch using then, catch and finally
  loadArtists()
    .then((artists) => {
      // Handles success: Triggers when the data successfully arrives
      console.log(artists);
      console.log(`Total artists: ${artists.length}`);

      // Delay the visual rendering by 2 seconds
      setTimeout(() => {
        cardArea.textContent = "";
        renderCards(artists);
      }, 2000);
    })
    .catch((error) => {
      // Handles failure: Triggers if the fetch or parsing breaks
      console.error("Failed to initialize artist data:", error);
      cardArea.textContent = "Error loading data. Please try again later.";
    })
    .finally(() => {
      // Handles cleanup: Always runs regardless of success or failure
      console.log("Initialization attempt completed.");
    });
}

//loading artists using asynch and await lesson-01,02,03 all updates combined here.
initArtistsLoading();

//Lesson-03 independent function to load artists JSON and pass it to renderCards function()
//loadArtistsWithDelayMessage(); //created for lesson-03

// Shuffle: pick a random artist and feature them.
const shuffleButton = document.querySelector(".shuffle");
/*
//lesson-02 step 4: testing delays on button click freeze for 5 seconds
shuffleButton.addEventListener("click", () => {
  if (roster.length === 0) return;
  console.log("Freezing browser thread for 5 seconds...");
  const startTime = Date.now();
  while (Date.now() - startTime < 5000) {
    // Single-thread is blocked. UI cannot render any text changes here.
  }
  console.log("5 seconds over. Thread unfrozen.");

  const pick = roster[Math.floor(Math.random() * roster.length)];
  document.querySelector(".featured").textContent =
    `Featured today: ${pick.name}`;
});
//Output: the UI didn't respond or loaded when the 5 seconds loop was running.
*/
//original button call event with no delays
shuffleButton.addEventListener("click", () => {
  if (roster.length === 0) return;
  const pick = roster[Math.floor(Math.random() * roster.length)];
  document.querySelector(".featured").textContent =
    `Featured today: ${pick.name}`;
});

// The suggestion form: an empty submission does nothing, because an empty
// string is falsy.
const form = document.querySelector(".signup");
const nameInput = document.querySelector("#artist-name");
const genreInput = document.querySelector("#artist-genre");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value;
  if (name) {
    const genre = genreInput.value || "Unsigned";
    renderCards([{ name: name, genre: genre, total: "0:00" }]);
    nameInput.value = "";
    genreInput.value = "";
  }
});
