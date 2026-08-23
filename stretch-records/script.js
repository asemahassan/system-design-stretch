"use strict";

// The roster, exactly where the JavaScript course's finale left it: an array
// of artist objects at the top of the file, and one repeatable rule that
// renders it. In this course the data moves out of this file, step by step.

//lesson-01 to lesson-04 changes in loadArtists()
//Moved array to a artists.json file and loading it here using fetch()
//Function to load and use the artist data
//Function that returns the array of artists
async function loadArtists() {
  try {
    //lesson-04 fetch with path but first ensure the json server is enabled in terminal on this directory
    //Start both fetch() requests simultaneously
    const [artistsResponse, labelResponse] = await Promise.all([
      fetch("http://localhost:3000/artists"),
      fetch("http://localhost:3001/label"),
    ]);

    //"Log the Response object before parsing"
    console.log("Raw Response Object:", artistsResponse);

    //Check if both network requests succeeded
    if (!artistsResponse.ok || !labelResponse.ok) {
      if (!artistsResponse.ok) {
        throw new Error("Request failed with status " + artistsResponse.status);
      } else
        throw new Error("Request failed with status " + labelResponse.status);
    }
    //Parse both responses into usable JSON objects simultaneously
    const [artistsData, labelData] = await Promise.all([
      artistsResponse.json(),
      labelResponse.json(),
    ]);

    //Code only reaches this point when BOTH pieces of data have arrived
    console.log("Artists data:", artistsData);
    console.log("Label data:", labelData); //log to test label.json data has arrived

    return artistsData;
  } catch (error) {
    console.error("Error loading JSON data:", error);
    return []; // Return empty array on failure to prevent app crashes
  } finally {
    //Cleanup code that must run regardless of success or failure
    console.log("Loading Data from JSON Attempt Complete !!!");
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
    // console.log(artists);
    // console.log(`Total artists: ${artists.length}`);

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

//loading artists using asynch and await lesson-01,02,03,04 all updates combined here.
initArtistsLoading();

// Shuffle: pick a random artist and feature them.
const shuffleButton = document.querySelector(".shuffle");

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
const totalInput = document.querySelector("#artist-total");
const photoInput = document.querySelector("#artist-photo");

//lesson-04 add the form data to the json
//added two more input data for form for consistency of the json artists data
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newArtist = {
    name: nameInput.value,
    genre: genreInput.value,
    total: totalInput.value,
    photo: photoInput.value,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newArtist),
  };
  console.log(options);

  const response = await fetch("http://localhost:3000/artists", options);
  console.log(response.status);
});
