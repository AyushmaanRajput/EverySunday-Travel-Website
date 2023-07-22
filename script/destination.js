let main_container = document.querySelector("#blank");
let loader = document.getElementById("loader");
let col2 = document.getElementById("2-col");
let col3 = document.getElementById("3-col");
let searchinp = document.querySelector("#mainsearch>input");
let searchbtn = document.querySelector("#mainsearch>button");
let paginationContainer = document.querySelector("#pagination-container");
let lowToHighBtn = document.querySelector("#lowToHigh");
let highToLowBtn = document.querySelector("#highToLow");
let filterByCountry = document.querySelector("#country");
let filterByRating = Array.from(
  document.querySelectorAll(".filter-rating>div")
);
let filterByPrice = Array.from(
  document.querySelectorAll(".filter-price>.filter-price-option")
);
let destinationDialog = document.querySelector("#destination-dialog");
let closeDestinationBtn = document.querySelector("#close-destination");
let destinationImgContainer = document.querySelector(
  "#destination-img-container"
);
let destinationImgRow = document.querySelector("#destination-img-row");
let destinationDescription = document.querySelector("#destination-description");
let destinationActivity = document.querySelector("#destination-activity");
let destinationAttractions = document.querySelector("#destination-attractions");

let baseURL = `https://mock-every-sunday-server.onrender.com/`;
let destinationURL = `${baseURL}destinations`;
let limit = 12;
let totalCount, numPages, imageUrl;

// All Event Listeners go here
// searchbtn.addEventListener("click", fetchDestination);
window.addEventListener("load", () => fetchAllDestinations(1));
lowToHighBtn.addEventListener("click", () => filterPriceSort("asc"));
highToLowBtn.addEventListener("click", () => filterPriceSort("desc"));
filterByCountry.addEventListener("change", () =>
  filterDestinationsByCountry(1)
);
filterByRating.forEach((ratingFilter) => {
  ratingFilter.addEventListener("click", () => {
    // console.log(ratingFilter.getAttribute("data"));
    filterDestinationsByRating(ratingFilter.getAttribute("data"), 1);
  });
});
filterByPrice.forEach((priceRange) => {
  priceRange.addEventListener("click", () => {
    filterDestinationsByPrice(priceRange.getAttribute("data-value"), 1);
  });
});
col2.addEventListener("click", () => {
  main_container.style.gridTemplateColumns = "1fr 1fr";
  col3.classList.remove("col-active");
  col2.classList.add("col-active");
});
col3.addEventListener("click", () => {
  main_container.style.gridTemplateColumns = "1fr 1fr 1fr";
  col2.classList.remove("col-active");
  col3.classList.add("col-active");
});
closeDestinationBtn.addEventListener("click", () => {
    destinationDialog.close();
    destinationDialog.style.display = "none";
});

//This function fetches all the destinations with a specified query string
async function fetchAllDestinations(page) {
  try {
    main_container.innerHTML = "";
    paginationContainer.innerHTML = "";
    loader.style.display = "block";
    let url = `${destinationURL}?_page=${page}&_limit=${limit}`;
    let res = await fetch(url);
    totalCount = res.headers.get("X-Total-Count");
    numPages = Math.ceil(totalCount / limit);
    let data = await res.json();
    displayDestinations(data);
    createPaginationBtns(numPages,page);
  } catch (err) {
    console.log(err);
  }
}
async function fetchDestination() {
  try {
  } catch (err) {
    console.log(err);
  }
}
// This function creates pagination btns
function createPaginationBtns(num,currNum) {
  setTimeout(function () {
    paginationContainer.innerHTML = "";
    for (let i = 0; i < num; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      if(i==currNum-1){
        btn.classList.add("page-active");
      }
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        fetchAllDestinations(i + 1);
      });
      paginationContainer.append(btn);
    }
  }, 1500);
}

// display function for destination
function displayDestinations(arr) {
  setTimeout(() => {
    loader.style.display = "none";
    main_container.innerHTML = "";
    arr.forEach((element) => {
      main_container.append(createCard(element));
    });
  }, 1500);
}

// This funciton creates individual cards
function createCard(item) {
  console.log;
  let card = document.createElement("div");
  card.classList.add("destination-card");

  let img = document.createElement("img");
  img.setAttribute("src", item.img);

  let content = document.createElement("div");
  content.innerHTML = `<i class="fa-solid fa-plane-departure"></i>`;

  let title = document.createElement("h4");
  title.innerText = item.name;

  let rating = document.createElement("div");
  rating.classList.add("destination-rating");
  let r = +item.rating;
  if (r >= 4) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)  `;
  } else if (r < 4 && r >= 3) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)`;
  } else if (r < 3 && r >= 2) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)`;
  } else if (r < 2 && r >= 1) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)`;
  }

  let price = document.createElement("p");
  price.innerHTML = `<span>$${item.estimatedCost}</span> per person`;

  let viewDetailsBtn = document.createElement("button");
  viewDetailsBtn.innerText = "View Details";
  viewDetailsBtn.classList.add("btn-small", "view-details");
  viewDetailsBtn.addEventListener("click", function () {
    createDetails(item);
    destinationDialog.style.display = "grid";
    destinationDialog.showModal();
  });

  let AddToCart = document.createElement("button");
  AddToCart.innerText = "Add To Cart";
  AddToCart.classList.add("btn-small", "atc");
  AddToCart.addEventListener("click", function () {
    console.log(item.name + " clicked");
  });

  content.append(title, rating, price, viewDetailsBtn, AddToCart);
  card.append(img, content);
  return card;
}

// This function filter low to High or High to low
async function filterPriceSort(str, page) {
  loader.style.display = "block";
  main_container.innerHTML = "";
  paginationContainer.innerHTML = "";
  let url;
  if (str == "asc") {
    url = `${destinationURL}?_sort=estimatedCost&_order=asc&_page=${page}&_limit=12`;
  } else if (str == "desc") {
    url = `${destinationURL}?_sort=estimatedCost&_order=desc&_page=${page}&_limit=12`;
  }
  try {
    let res = await fetch(url);
    totalCount = res.headers.get("X-Total-Count");
    numPages = Math.ceil(totalCount / limit);
    let data = await res.json();
    displayDestinations(data);
    createFilterPaginationBtns(numPages, str);
  } catch (err) {
    console.log(err);
  }
}

// This function creates pagination btns exclusively for filter methods
function createFilterPaginationBtns(num, str) {
  setTimeout(() => {
    paginationContainer.innerHTML = "";
    for (let i = 0; i < num; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        filterPriceSort(str, i + 1);
      });
      paginationContainer.append(btn);
    }
  }, 1500);
}

// This function filters destinations By Country
async function filterDestinationsByCountry(page) {
  loader.style.display = "block";
  main_container.innerHTML = "";
  paginationContainer.innerHTML = "";
  let value = filterByCountry.value;
  if (value == "") {
    fetchAllDestinations(1);
  } else {
    try {
      let url = `${destinationURL}?country=${value}&_page=${page}&_limit=${limit}`;
      let res = await fetch(url);
      totalCount = res.headers.get("X-Total-Count");
      numPages = Math.ceil(totalCount / limit);
      let data = await res.json();
      displayDestinations(data);
      createPaginationBtnsByCountry(numPages);
    } catch (e) {
      console.log(e);
    }
  }
}

// This function create pagination btns exclusively for filter By Country
function createPaginationBtnsByCountry(num) {
  setTimeout(() => {
    paginationContainer.innerHTML = "";
    for (let i = 0; i < num; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        filterDestinationsByCountry(i + 1);
      });
      paginationContainer.append(btn);
    }
  }, 1500);
}

// This function filters data by rating
async function filterDestinationsByRating(num, page) {
  loader.style.display = "block";
  main_container.innerHTML = "";
  paginationContainer.innerHTML = "";
  let url;
  if (num == 5) {
    url = `${destinationURL}?rating_gte=4&_page=${page}&_limit=${limit}`;
  } else if (num == 4) {
    url = `${destinationURL}?rating_gte=3&rating_lte=3.9&_page=${page}&_limit=${limit}`;
  } else if (num == 3) {
    url = `${destinationURL}?rating_gte=2&rating_lte=2.9&_page=${page}&_limit=${limit}`;
  } else if (num == 2) {
    url = `${destinationURL}?rating_gte=1&rating_lte=1.9&_page=${page}&_limit=${limit}`;
  }
  try {
    let res = await fetch(url);
    totalCount = res.headers.get("X-Total-Count");
    numPages = Math.ceil(totalCount / limit);
    let data = await res.json();
    console.log(totalCount, numPages);
    displayDestinations(data);
    createPaginationBtnsByRating(num, numPages);
  } catch (err) {
    console.log(err);
  }
}
// This function creates pagination btns exclusively for filter by rating
function createPaginationBtnsByRating(num, numPages) {
  setTimeout(() => {
    paginationContainer.innerHTML = "";
    for (let i = 0; i < numPages; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        filterDestinationsByRating(num, i + 1);
      });
      paginationContainer.append(btn);
    }
  }, 1500);
}

// This function fiters data by price optoin
async function filterDestinationsByPrice(str, page) {
  loader.style.display = "block";
  main_container.innerHTML = "";
  paginationContainer.innerHTML = "";
  let url;
  if (str == "above 7500") {
    url = `${destinationURL}?estimatedCost_gte=7500&_page=${page}&_limit=${limit}`;
  } else if (str == "6000-7500") {
    url = `${destinationURL}?estimatedCost_gte=6000&estimatedCost_lte=7499&_page=${page}&_limit=${limit}`;
  } else if (str == "4000-6000") {
    url = `${destinationURL}?estimatedCost_gte=4000&estimatedCost_lte=5999&_page=${page}&_limit=${limit}`;
  } else if (str == "below 4000") {
    url = `${destinationURL}?estimatedCost_lte=3999&_page=${page}&_limit=${limit}`;
  }
  try {
    let res = await fetch(url);
    totalCount = res.headers.get("X-Total-Count");
    numPages = Math.ceil(totalCount / limit);
    let data = await res.json();
    // console.log(totalCount,numPages);
    displayDestinations(data);
    createPaginationBtnsByPrice(str, numPages);
  } catch (err) {
    console.log(err);
  }
}

function createPaginationBtnsByPrice(str, numPages) {
  setTimeout(() => {
    paginationContainer.innerHTML = "";
    for (let i = 0; i < numPages; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        filterDestinationsByPrice(str, i + 1);
      });
      paginationContainer.append(btn);
    }
  }, 1500);
}

/******* functinality of destination modal **********/

function createDetails(city) {
  let detailedObj = {}; //obj containing city atts,foods and activities urls
  city.attractions.forEach(async (att) => {
    try {
      let res = await fetchImages(att, 1);
      let data = await res.json();
      let link = data.results[0].urls.regular;
      detailedObj[att.trim()] = link;
    } catch (e) {
      console.log(e);
    }
  });
  city.food.forEach(async (foodItem) => {
    try {
      let res = await fetchImages(foodItem, 1);
      let data = await res.json();
      let link = data.results[0].urls.regular;
      detailedObj[foodItem.trim()] = link;
    } catch (e) {
      console.log(e);
    }
  });
  city.activity.forEach(async (act, i) => {
    try {
      let res = await fetchImages(act, 1);
      let data = await res.json();
      let link = data.results[0].urls.regular;
      detailedObj[act.trim()] = link;
      if (i == 2) {
        displayDestinationDetails(detailedObj, city);
      }
    } catch (e) {
      console.log(e);
    }
  });

  // Display the city and detailed obj
}

//Fetch Photos function
async function fetchImages(query, num) {
  try {
    let key = `3tYuCQraI7s0B2DooME9qes1DqQKGkrF8Fm64SWdKf8`;
    return await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${key}&per_page=${num}`
    );
  } catch (err) {
    console.log(err);
  }
}

// Display City Details
function displayDestinationDetails(imgObj, city) {
  console.log(imgObj);

  destinationImgContainer.innerHTML = "";
  destinationImgRow.innerHTML = "";
  destinationDescription.innerHTML = "";
  destinationActivity.innerHTML = "";
  destinationAttractions.innerHTML = "";

  let mainImage = document.createElement("div");
  let imgMain = document.createElement("img");
  imgMain.setAttribute("src", city.img);
  mainImage.append(imgMain);
  destinationImgContainer.append(mainImage);

  let urls = fetchImages(city.name, 4);
  urls
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.results.forEach((result) => {
        let temp = document.createElement("img");
        temp.setAttribute("src", result.urls.regular);
        destinationImgRow.append(temp);
      });
    });

  let title = document.createElement("h3");
  title.innerText = city.name;
  let price = document.createElement("p");
  price.innerHTML = `It would take about <span>$${item.estimatedCost}</span> per person to travel to ${city.name}`;
  let country = document.createElement("h5");
  country.innerText = city.country;
  let desc = document.createElement("p");
  desc.innerText = city.description;
  let rating = document.createElement("div");
  rating.classList.add("destination-rating");
  let r = +city.rating;
  if (r >= 4) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)  `;
  } else if (r < 4 && r >= 3) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)`;
  } else if (r < 3 && r >= 2) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)`;
  } else if (r < 2 && r >= 1) {
    rating.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i> (<span>${r}</span>)`;
  }
  destinationDescription.append(title,rating, country, desc, price);

  let activityDiv = document.createElement("div");
  let activityTitle = document.createElement("h4");
  activityTitle.innerText = "Things To Do In This City";
  city.activity.forEach((activity) => {
    // console.log(activity,imgObj[activity]);
    if (imgObj[activity]) {
      let img = document.createElement("img");
      img.setAttribute("src", imgObj[activity]);
      activityDiv.append(img);
    }
  });
  if (activityDiv.innerHTML) {
    destinationActivity.append(activityTitle, activityDiv);
  }

  let attractionDiv = document.createElement("div");
  let attTitle = document.createElement("h4");
  attTitle.innerText = "Don't Forget To Visit These Spots";
  city.attractions.forEach((att) => {
    // console.log(typeof att);
    if (imgObj[att]) {
      let img = document.createElement("img");
      img.setAttribute("src", imgObj[att]);
      attractionDiv.append(img);
    }
  });
  if (attractionDiv.innerHTML) {
    destinationAttractions.append(attTitle, attractionDiv);
  }
}
