// mood.js

const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY;
// declare a variable for current query
let currentQuery = "";

function runSearch() {
  // Clear previous search results
  clearResults();

  // Build the query
  const query = document.querySelector(".search input").value.trim();
  if (!query) {
    return false;
  }

  currentQuery = query;

  openResultsPane();

  // Construct the request object
  // Use XMLHTTPRequest to make an AJAX requests to the image search API
  let request = new XMLHttpRequest();
  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  // Include the search term as a url query parameter
  request.open("GET", `${bing_api_endpoint}?q=${encodeURIComponent(query)}`, true);
  // Include the correct API authorization header as required
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  // Retrieve results in a json format
  request.responseType = "json";
  console.log("request: ", request);

  // Handle responses
  request.onload = function () {
    if (request.status === 200) {
      const results = request.response.value;

      // Display image results 
      // Use the DOM API to display image results to the user - 2 points
      displayImageResults(results);
      
      // Display related concepts
      displayQueryExpansions(request.response.queryExpansions);
    } else {
      console.error("Error fetching search results:", request.statusText);
    }
  };

  // Send the request 
  // Use XMLHTTPRequest to make an AJAX request to the image search API)
  request.send();

  return false;
}

// helper functions
// TODO: Clear the results pane before you run a new search
// Running a search clears previous search results - 1 point
function clearResults() {
  const resultsContainer = document.querySelector("#resultsImageContainer");
  resultsContainer.innerHTML = "";
}

// Use the DOM API to display image results to the user - 2 points
// Clicking on a result image adds it to the user's mood board - 2 points
function displayImageResults(results) {
  const resultsContainer = document.querySelector("#resultsImageContainer");

  results.forEach((result) => {
    const imageElement = document.createElement("div");
    imageElement.classList.add("resultImage");
    // Clicking on a result image adds it to the user's mood board
    imageElement.innerHTML = `<img src="${result.contentUrl}" alt="${result.name}" onclick="addToMoodBoard('${result.contentUrl}')">`;
    resultsContainer.appendChild(imageElement);
  });
}

// Use the DOM API to display related concept results to the user -1 point
// Clicking on a related concept runs a new search for that concept - 1 point
function displayQueryExpansions(queryExpansions) {
  const suggestionsList = document.querySelector(".suggestions ul");
  suggestionsList.innerHTML = "<h3>Related Concepts</h3>";

  if (queryExpansions && queryExpansions.length > 0) {
    queryExpansions.forEach((term) => {
      const listItem = document.createElement("li");
      listItem.textContent = term.displayText;

      // Clicking on a related concept runs a new search for that concept
      listItem.addEventListener("click", () => {
        document.querySelector(".search input").value = term.displayText;
        runSearch();
      });

      suggestionsList.appendChild(listItem);
    });
  } else {
    console.log("No related concepts found.");
    suggestionsList.innerHTML = "<p>No related concepts found.</p>";
  }
}

// Other functions (not directly related to the specified requirements)
function addToMoodBoard(imageUrl) {
  const boardContainer = document.querySelector("#board");

  const savedImage = document.createElement("div");
  savedImage.classList.add("savedImage");
  savedImage.innerHTML = `<img src="${imageUrl}">`;

  boardContainer.appendChild(savedImage);
}

// -------------------------------original script--------------------------------------
function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    runSearch();
  }
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    closeResultsPane();
  }
});

