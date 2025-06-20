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

// 🧾 Load profile page and user feed
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

  loadUserFeed(username, users);
}

// 🖼️ Load swipeable user feed
function loadUserFeed(currentUser, users) {
  const feed = document.getElementById("userFeed");
  if (!feed) return;

  Object.keys(users).forEach((username) => {
    if (username === currentUser) return;

    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <img src="assets/profile.jpg" alt="profile" />
      <div>${username}</div>
    `;

    feed.appendChild(card);
  });
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



function enableSwipe() {
  const container = document.getElementById("swipeContainer");
  let startX = 0;

  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  container.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      container.style.transform = "translateX(-100vw)";
    } else if (diff < -50) {
      container.style.transform = "translateX(0)";
    }
  });
}
