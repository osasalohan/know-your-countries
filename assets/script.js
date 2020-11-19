const allCountries = "https://restcountries.eu/rest/v2/all";
const singleCountry = "https://restcountries.eu/rest/v2/name/";
const countriesList = document.querySelector(".countries-list");
const countryDetails = document.querySelector(".country-details");
const screens = document.querySelectorAll(".screen");

//stores active page number
const activePage = (function () {
  var activePageNum = 1;

  var get = function () {
    return activePageNum;
  };

  var set = function (page) {
    activePageNum = page;
  };

  return { get, set };
})();

//show countries page number {num}
function showPage(num) {
  for (let i = 1; i <= 12; i++) {
    document.querySelector(`#page${i}`).classList.add("hide");
    document.getElementById(`${i}`).classList.remove("active");
  }
  document.querySelector(`#page${num}`).classList.remove("hide");
  document.getElementById(`${num}`).classList.add("active");
}

//show previous countries page
function prevPage() {
  let activePageNum = activePage.get();
  if (activePageNum === 1) {
    activePageNum = 12;
  } else {
    activePageNum--;
  }
  activePage.set(activePageNum);
  showPage(activePageNum);
}

//show next countries page
function nextPage() {
  let activePageNum = activePage.get();
  if (activePageNum === 12) {
    activePageNum = 1;
  } else {
    activePageNum++;
  }
  activePage.set(activePageNum);
  showPage(activePageNum);
}

//show other screen
function toggleScreens() {
  screens.forEach((screen) => {
    screen.classList.toggle("hide");
  });
}

//fetch all country names from api and put them in pages of 20. Show only first page initially
fetch(allCountries)
  .then((response) => response.json())
  .then((countries) =>
    countries.map(
      (country) =>
        `<div class="country"><h3>${country.name}</h3><button id=${country.name}>View Details</button></div>`
    )
  )
  .then((countries) => {
    let currentPageNum = 1;
    let currentPage = document.createElement("div");
    currentPage.id = `page${currentPageNum}`;
    countries.forEach((country) => {
      if (currentPage.children.length <= 20) {
        currentPage.insertAdjacentHTML("beforeend", country);
      } else {
        countriesList.insertAdjacentElement("beforeend", currentPage);
        currentPageNum++;
        currentPage = document.createElement("div");
        currentPage.classList.add("hide");
        currentPage.id = `page${currentPageNum}`;
        currentPage.insertAdjacentHTML("beforeend", country);
      }
    });
    countriesList.insertAdjacentElement("beforeend", currentPage);
  });

document.addEventListener("click", (e) => {
  if (
    e.target.tagName === "BUTTON" &&
    e.target.textContent === "View Details"
  ) {
    //toggle screen, fetch and display country data when view details button is clicked
    toggleScreens();
    let country = e.target.parentElement.firstElementChild.textContent;
    fetch(singleCountry + country + "?fullText=true")
      .then((response) => response.json())
      .then((data) => {
        country = data[0];
        countryInfo = `
          <div><img src=${country.flag} /></div>
          <div><h3>Name - ${country.name}</h3></div>
          <div><h3>Capital - ${country.capital}</h3></div>
          <div><h3>Calling code - ${country.callingCodes[0]}</h3></div>
          <div><h3>Region - ${country.region}</h3></div>
          <div><h3>Subregion - ${country.subregion}</h3></div>
          <div><h3>Population - ${country.population}</h3></div>
          <div><h3>Time zone - ${country.timezones[0]}</h3></div>
          <div><h3>Currency - ${country.currencies[0].name} (${country.currencies[0].symbol})</h3></div>
          <div><h3>Primary language - ${country.languages[0].name}</h3></div>
          `;
        countryDetails.innerHTML = countryInfo;
      });
  } else if (e.target.id === "back") {
    toggleScreens();
  } else if (e.target.tagName === "A") {
    if (e.target.id === "prev") {
      prevPage();
    } else if (e.target.id === "next") {
      nextPage();
    } else {
      showPage(e.target.id);
    }
  }
});
