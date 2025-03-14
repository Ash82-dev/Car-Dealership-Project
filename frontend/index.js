"use strict";

const header = document.querySelector(".header");
const carContainer = document.querySelector(".featured-car-container");

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const allCars = (await fetchCars()) || [];
  let nextIndex = 0;
  const chunkSize = 5; // Number of cars to add on each scroll event

  function loadMoreCars() {
    const slice = allCars.slice(nextIndex, nextIndex + chunkSize);
    slice.forEach((car) => addCarCarts(car));
    nextIndex += chunkSize;
  }

  // Initially load the first batch of cars.
  loadMoreCars();

  const infiniteScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);

        loadMoreCars();

        // Observe the new last element if more cars remain.
        if (nextIndex < allCars.length) {
          const newLastElement = carContainer.lastElementChild;
          if (newLastElement) {
            observer.observe(newLastElement);
          }
        }
      }
    });
  };

  const observer = new IntersectionObserver(infiniteScroll, {
    root: null,
    threshold: 1.0,
  });

  const lastElement = carContainer.lastElementChild;
  if (lastElement) {
    observer.observe(lastElement);
  }

  document.querySelectorAll('a[href="#section-footer"]').forEach((link) => {
    link.addEventListener("click", () => {
      // Load all remaining cars immediately.
      while (nextIndex < allCars.length) {
        loadMoreCars();
      }
    });
  });
});

function addCarCarts(car) {
  let html = `
    <figure class="featured-car">
          <div class="car-img-container">
            <img
              class="car-img"
              src=${car.image}
            />
          </div>
          <div class="car-detail">
            <p class="car-name">${car.name}</p>
            <div class="car-detail-container">
              <div class="car-category-pack pack">
                <ion-icon
                  class="car-detail-logo"
                  name="car-sport-outline"
                ></ion-icon>
                <span class="car-category-name">${car.category}</span>
              </div>

              <div class="car-country-pack pack">
                <ion-icon
                  class="car-detail-logo"
                  name="earth-outline"
                ></ion-icon>
                <span class="car-country">${car.country}</span>
              </div>

              <div class="car-stock-pack pack">
                <ion-icon
                  class="car-detail-logo"
                  name="checkmark-circle-outline"
                ></ion-icon>
                <span class="car-stock"><strong>${car.stock}</strong> Units</span>
              </div>

              <div class="car-year-pack pack">
                <ion-icon
                  class="car-detail-logo"
                  name="calendar-outline"
                ></ion-icon>
                <span class="car-year"><strong>${car.year}</strong></span>
              </div>
            </div>
            <div class="car-price-pack">
              <span class="car-price">${car.price} USD</span>
              <button class="buy-button">BUY</button>
            </div>
          </div>
        </figure>
  `;
  carContainer.insertAdjacentHTML("beforeend", html);
}

async function fetchCars() {
  try {
    const response = await fetch("../data/cars.json");
    if (!response.ok) throw new Error("Network response was not ok");
    const jsonArray = await response.json();
    return jsonArray;
  } catch (error) {
    console.error("Error fetching JSON file:", error);
  }
}
