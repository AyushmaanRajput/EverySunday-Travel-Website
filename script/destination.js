let main_container = document.querySelector("#blank");
let searchinp = document.querySelector("#mainsearch>input");
let searchbtn = document.querySelector("#mainsearch>button");
let paginationContainer = document.querySelector("#pagination-container");

let baseURL = `https://main-mock-server.onrender.com`;
let destinationURL = `${baseURL}/destinations`;
let limit = 12;
let totalCount, numPages, imageUrl;

// All Event Listeners go here
searchbtn.addEventListener("click", fetchAllDestinations);
searchbtn.addEventListener("click", () => {
  findImageUrl(searchinp.value);
});

//This function fetches all the destinations with a specified query string
async function fetchAllDestinations() {
  try {
    let query = searchinp.value;
    let res = await fetch(`${destinationURL}?q=${query}`);
    let data = await res.json();
    console.log(data);
    totalCount = data.length;
    numPages = Math.ceil(totalCount / limit);
    if(data.length!==0){
        fetchDestinationPage();
    }
    } catch (err) {
    console.log(err);
    }
}

// This function fetches all the destinations with a specified page number ( if not parameter is passed then the default value if 1)
async function fetchDestinationPage(page = 1) {
  createPaginationBtns(numPages);
  try {
    let query = searchinp.value;
    let res = await fetch(
      `${destinationURL}?q=${query}&_page=${page}&_limit=${limit}`
    );
    let data = await res.json();
    console.log(data);
    if(coutn){
        
    }
    displayDestinations(data);
  } catch (err) {
    console.log(err);
  }
}

// This function creates the pagination buttons
function createPaginationBtns(num) {
  paginationContainer.innerHTML = "";
  for (let i = 0; i < num; i++) {
    let pageBtn = document.createElement("button");
    pageBtn.innerText = i + 1;
    pageBtn.addEventListener("click", () => {
      fetchDestinationPage(i + 1);
    });
    pageBtn.classList.add("btn-small");
    paginationContainer.append(pageBtn);
  }
}

// display function for destination
function displayDestinations(arr) {
  main_container.innerHTML = "";

  arr.forEach((element) => {
    main_container.append(createCard(element));
  });
}

// activity
// :
// (3) ['Visiting Innovative Tech Parks', 'Exploring the Bangalore Fort', 'Shopping on MG Road']
// attractions
// :
// (3) ['Lalbagh Botanical Garden', 'Bangalore Palace', 'Cubbon Park']
// country
// :
// "India"
// description
// :
// "Bangalore, also known as Bengaluru, is the Silicon Valley of India. It is known for its pleasant climate, vibrant nightlife, and thriving IT industry."
// estimatedCost
// :
// "5500"
// food
// :
// (3) ['Masala Dosa', 'Biryani', 'Filter Coffee']
// name
// :
// "Bangalore"
// rating
// :
// "4.1"

// This funciton creates individual cards
function createCard(item) {
  let card = document.createElement("div");
  card.classList.add("card");

  let img = document.createElement("img");
  img.setAttribute("src", imageUrl);

  let title = document.createElement("h4");
  title.innerText = item.name;
  let country = document.createElement("h5");
  country.innerText = item.country;
  let rating = document.createElement("p");
  rating.innerText = +item.rating;

  let itemBtn = document.createElement("button");
  itemBtn.innerText = "View Package";
  itemBtn.classList.add("btn");
  itemBtn.addEventListener("click", function () {
    console.log(item.name + " clicked");
  });
  card.append(img, title, country, rating, itemBtn);
  return card;
}
  