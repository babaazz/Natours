import { login, logout } from "./auth.js";
import { displayMap } from "./mapbox.js";
import { updateSettings } from "./updateSettings.js";

//DOM Elements
const form = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const mapBox = document.getElementById("map");
const updateDataForm = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-settings");

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

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (updateDataForm) {
  updateDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateSettings(form, "data");
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const oldPassword = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const confirmNewPassword =
      document.getElementById("password-confirm").value;

    await updateSettings(
      { oldPassword, newPassword, confirmNewPassword },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save Password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}
