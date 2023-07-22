let main_container = document.querySelector("#blank");
let loader= document.getElementById("loader");
let col3=document.getElementById("3-col");
let col4=document.getElementById("4-col");
let searchinp = document.querySelector("#mainsearch>input");
let searchbtn = document.querySelector("#mainsearch>button");
let paginationContainer = document.querySelector("#pagination-container");
let lowToHighBtn = document.querySelector("#lowToHigh");
let highToLowBtn = document.querySelector("#highToLow");
let filterByCountry = document.querySelector("#country");
let filterByRating = Array.from(
  document.querySelectorAll(".filter-rating>div")
);
let filterByPrice =Array.from(document.querySelectorAll(".filter-price>.filter-price-option"));

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
    filterDestinationsByRating(ratingFilter.getAttribute("data"),1);
  });
});
filterByPrice.forEach((priceRange)=>{
  priceRange.addEventListener("click", ()=>{
    filterDestinationsByPrice(priceRange.getAttribute("data-value"),1);
  });
});
col3.addEventListener("click", () =>{
  main_container.style.gridTemplateColumns='1fr 1fr 1fr';
  col4.classList.remove('col-active');
  col3.classList.add('col-active');
})
col4.addEventListener("click", () =>{
  main_container.style.gridTemplateColumns='1fr 1fr 1fr 1fr';
  col3.classList.remove('col-active');
  col4.classList.add('col-active');
})

//This function fetches all the destinations with a specified query string
async function fetchAllDestinations(page) {
  try {
    main_container.innerHTML="";
    paginationContainer.innerHTML="";
    loader.style.display = "block";
    let url = `${destinationURL}?_page=${page}&_limit=${limit}`;
    let res = await fetch(url);
    totalCount = res.headers.get("X-Total-Count");
    numPages = Math.ceil(totalCount / limit);
    let data = await res.json();
    displayDestinations(data);
    createPaginationBtns(numPages);
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
function createPaginationBtns(num) {
  setTimeout(function () {
    paginationContainer.innerHTML = "";
    for (let i = 0; i < num; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        fetchAllDestinations(i + 1);
      });
      paginationContainer.append(btn);
    }
  },1500) 
}

// display function for destination
function displayDestinations(arr) {
  setTimeout(() => {
    loader.style.display = "none";
    main_container.innerHTML = "";
    arr.forEach((element) => {
      main_container.append(createCard(element));
    });
},1500);
}

// This funciton creates individual cards
function createCard(item) {
  console.log;
  let card = document.createElement("div");
  // card.classList.add("card");

  let img = document.createElement("img");
  img.setAttribute("src", item.img);

  let title = document.createElement("h4");
  title.innerText = item.name;

  let rating = document.createElement("p");
  rating.innerText = +item.rating;

  let price = document.createElement("p");
  price.innerText = `$${item.estimatedCost} per person`;

  let itemBtn = document.createElement("button");
  itemBtn.innerText = "View Package";
  itemBtn.classList.add("btn-small");
  itemBtn.addEventListener("click", function () {
    console.log(item.name + " clicked");
  });
  card.append(img, title, rating, price, itemBtn);
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
  setTimeout(()=>{
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
  },1500) 
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
  setTimeout(()=>{
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
  },1500)
}

// This function filters data by rating
async function filterDestinationsByRating(num,page) {
  loader.style.display = "block";
  main_container.innerHTML = "";
  paginationContainer.innerHTML = "";
  let url;
  if(num==5){
    url = `${destinationURL}?rating_gte=4&_page=${page}&_limit=${limit}`;
  }else if(num==4){
     url = `${destinationURL}?rating_gte=3&rating_lte=3.9&_page=${page}&_limit=${limit}`;
  }else if(num==3){
    url = `${destinationURL}?rating_gte=2&rating_lte=2.9&_page=${page}&_limit=${limit}`;
  }else if(num==2){
    url = `${destinationURL}?rating_gte=1&rating_lte=1.9&_page=${page}&_limit=${limit}`;
  }
  try {
    let res = await fetch(url);
    totalCount = res.headers.get("X-Total-Count");
    numPages = Math.ceil(totalCount / limit);
    let data = await res.json();
    console.log(totalCount,numPages);
    displayDestinations(data);
    createPaginationBtnsByRating(num,numPages);
  } catch (err) {
    console.log(err);
  }
}
// This function creates pagination btns exclusively for filter by rating
function createPaginationBtnsByRating(num, numPages) {
  setTimeout(()=>{
    paginationContainer.innerHTML = "";
    for (let i = 0; i < numPages; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        filterDestinationsByRating(num,i + 1);
      });
      paginationContainer.append(btn);
    }
  },1500);
}

// This function fiters data by price optoin
async function filterDestinationsByPrice(str,page){
  loader.style.display = "block";
  main_container.innerHTML = "";
  paginationContainer.innerHTML = "";
  let url;
  if(str=='above 7500'){
    url = `${destinationURL}?estimatedCost_gte=7500&_page=${page}&_limit=${limit}`;
  }else if(str=='6000-7500'){
     url = `${destinationURL}?estimatedCost_gte=6000&estimatedCost_lte=7499&_page=${page}&_limit=${limit}`;
  }else if(str=='4000-6000'){
    url = `${destinationURL}?estimatedCost_gte=4000&estimatedCost_lte=5999&_page=${page}&_limit=${limit}`;
  }else if(str=='below 4000'){
    url = `${destinationURL}?estimatedCost_lte=3999&_page=${page}&_limit=${limit}`;
  }
  try {
    let res = await fetch(url);
    totalCount = res.headers.get("X-Total-Count");
    numPages = Math.ceil(totalCount / limit);
    let data = await res.json();
    // console.log(totalCount,numPages);
    displayDestinations(data);
    createPaginationBtnsByPrice(str,numPages);
  } catch (err) {
    console.log(err);
  }
}

function createPaginationBtnsByPrice(str,numPages){
  setTimeout(()=>{
    paginationContainer.innerHTML = "";
    for (let i = 0; i < numPages; i++) {
      let btn = document.createElement("button");
      btn.classList.add("btn-small");
      btn.innerText = i + 1;
      btn.addEventListener("click", () => {
        filterDestinationsByPrice(str,i + 1);
      });
      paginationContainer.append(btn);
    }
  },1500);
}
