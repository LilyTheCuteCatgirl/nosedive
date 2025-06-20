// 🌸 Inject demo users if none exist
function loadDemoUsers() {
  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (Object.keys(users).length === 0) {
    users = {
      "ava.glow": { password: "1234", rating: 4.7, ratings: [], numRatings: 1 },
      "milo.smiles": { password: "1234", rating: 3.9, ratings: [], numRatings: 1 },
      "zoe.laughs": { password: "1234", rating: 4.3, ratings: [], numRatings: 1 },
      "rex.mode": { password: "1234", rating: 2.1, ratings: [], numRatings: 1 }
    };
    localStorage.setItem("users", JSON.stringify(users));
  }
}
loadDemoUsers(); // 🪩 Call this immediately

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
    rating: 4.2,
    ratings: [],
    numRatings: 1
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

// 🧾 Load profile and user feed
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

// 🧑‍🤝‍🧑 Load user feed with rating buttons
function loadUserFeed(currentUser, users) {
  const feed = document.getElementById("userFeed");
  if (!feed) return;

  feed.innerHTML = "";

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
        ${[1, 2, 3, 4, 5].map(star => `
          <button data-username="${username}" data-stars="${star}">
            ${star}
          </button>
        `).join("")}
      </div>
    `;

    feed.appendChild(card);
  });

  feed.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.username;
      const stars = parseInt(btn.dataset.stars);
      rateUser(target, stars);
    });
  });
}

// ⭐ Weighted Rating Logic
function rateUser(targetUsername, stars) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const rater = localStorage.getItem("loggedInUser");

  if (!users[targetUsername] || !users[rater]) return;

  const raterRating = users[rater].rating || 1;
  const target = users[targetUsername];

  if (!target.ratings) target.ratings = [];

  target.ratings.push({ from: rater, stars });

  let totalWeighted = 0;
  let totalWeight = 0;

  target.ratings.forEach(entry => {
    const weight = users[entry.from]?.rating || 1;
    totalWeighted += entry.stars * weight;
    totalWeight += weight;
  });

  target.rating = totalWeighted / totalWeight;
  target.numRatings = target.ratings.length;

  localStorage.setItem("users", JSON.stringify(users));
  loadUserFeed(rater, users);
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// 👉 Swipe logic
function enableSwipe() {
  const container = document.getElementById("swipeContainer");
  if (!container) return;

  let startX = 0;
  const edgeBuffer = 30;

  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  container.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (startX < edgeBuffer || startX > window.innerWidth - edgeBuffer) return;

    if (diff > 50) {
      container.style.transform = "translateX(-100vw)";
    } else if (diff < -50) {
      container.style.transform = "translateX(0)";
    }
  });
}

// 🚀 Init on profile.html only
if (window.location.pathname.includes("profile.html")) {
  window.onload = () => {
    loadProfile();
    enableSwipe();
  };
}
