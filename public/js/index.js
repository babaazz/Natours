import { login } from "./auth.js";
import { displayMap } from "./mapbox.js";

//DOM Elements
const form = document.querySelector(".form");
const mapBox = document.getElementById("map");

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
