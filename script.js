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

// 🧾 Load profile info + other users
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

// 🖼️ Load all other users into swipe feed
function loadUserFeed(currentUser, users) {
  const feed = document.getElementById("userFeed");
  if (!feed) return;

  feed.innerHTML = ""; // clear it

  Object.keys(users).forEach((username) => {
    if (username === currentUser) return;

    const user = users[username];

    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <img src="assets/profile.jpg" alt="profile" />
      <div><strong>${username}</strong></div>
      <div>⭐ ${user.rating.toFixed(1)}</div>
      <div class="rate-buttons">
        ${[1, 2, 3, 4, 5].map((star) => `
          <button onclick="rateUser('${username}', ${star})">${star}</button>
        `).join("")}
      </div>
    `;

    feed.appendChild(card);
  });
}


// 🚪 Logout button
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// 👉 Swipe between profile and user pages
function enableSwipe() {
  const container = document.getElementById("swipeContainer");
  if (!container) return;

  let startX = 0;
  let edgeBuffer = 30; // px from edge

  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  container.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    // prevent edge swipes from triggering swipe logic
    if (startX < edgeBuffer || startX > window.innerWidth - edgeBuffer) return;

    if (diff > 50) {
      container.style.transform = "translateX(-100vw)";
    } else if (diff < -50) {
      container.style.transform = "translateX(0)";
    }
  });
}


// 🚀 Auto-run on profile.html only
if (window.location.pathname.includes("profile.html")) {
  window.onload = () => {
    loadProfile();
    enableSwipe();
  };
}

function rateUser(targetUsername, stars) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const rater = localStorage.getItem("loggedInUser");

  if (!users[targetUsername] || !users[rater]) return;

  const raterRating = users[rater].rating || 1;
  const target = users[targetUsername];

  // Add to ratings history
  if (!target.ratings) target.ratings = [];

  target.ratings.push({ from: rater, stars: stars });

  // Weighted average calculation
  let totalWeighted = 0;
  let totalWeight = 0;

  target.ratings.forEach((r) => {
    const fromUser = users[r.from];
    const weight = fromUser?.rating || 1;
    totalWeighted += r.stars * weight;
    totalWeight += weight;
  });

  target.rating = totalWeighted / totalWeight;
  target.numRatings = target.ratings.length;

  localStorage.setItem("users", JSON.stringify(users));
  loadUserFeed(rater, users); // Refresh view
}
