// 🔐 Sign Up
function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    return showMessage("Please enter a username and password.");
  }

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[username]) {
    return showMessage("User already exists. Please log in.");
  }

  users[username] = {
    password: password,
    rating: 4.2, // Default starting score
  };

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", username);

  window.location.href = "profile.html";
}

// 🔓 Log In
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!users[username]) {
    return showMessage("No such user. Please sign up.");
  }

  if (users[username].password !== password) {
    return showMessage("Wrong password.");
  }

  localStorage.setItem("loggedInUser", username);
  window.location.href = "profile.html";
}

// 🧠 Show messages
function showMessage(msg) {
  const el = document.getElementById("message");
  if (el) el.textContent = msg;
}

// 🧾 Load profile page
function loadProfile() {
  const username = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!username || !users[username]) {
    window.location.href = "index.html";
    return;
  }

  const userData = users[username];

  const nameDisplay = document.getElementById("display-username");
  const ratingDisplay = document.getElementById("display-rating");

  if (nameDisplay && ratingDisplay) {
    nameDisplay.textContent = username;
    ratingDisplay.textContent = userData.rating.toFixed(1);
  }
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// 🚀 Auto-run profile logic if on profile.html
if (window.location.pathname.includes("profile.html")) {
  window.onload = loadProfile;
}
