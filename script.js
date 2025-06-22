// 🌸 Inject demo users if none exist
function loadDemoUsers() {
  let users = JSON.parse(localStorage.getItem("users") || "{}");
  if (Object.keys(users).length === 0) {
    users = {
      "ava.glow": { password: "1234", rating: 4.7, ratings: [] },
      "milo.smiles": { password: "1234", rating: 3.9, ratings: [] },
      "zoe.laughs": { password: "1234", rating: 4.3, ratings: [] },
      "rex.mode": { password: "1234", rating: 2.1, ratings: [] }
    };
    localStorage.setItem("users", JSON.stringify(users));
  }
}

loadDemoUsers();

// 🔐 Sign Up
function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if (!username || !password) return showMessage("Enter username and password.");

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[username]) return showMessage("User already exists.");

  users[username] = { password, rating: 4.2, ratings: [] };
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", username);
  window.location.href = "profile.html";
}

// 🔓 Log In
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!users[username]) return showMessage("No such user.");
  if (users[username].password !== password) return showMessage("Wrong password.");

  localStorage.setItem("loggedInUser", username);
  window.location.href = "profile.html";
}

// 💬 Show a temporary message
function showMessage(msg) {
  const el = document.getElementById("message");
  if (el) el.textContent = msg;
}

// 👤 Load profile + other users
function loadProfile() {
  const username = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!username || !users[username]) {
    return window.location.href = "index.html";
  }

  document.getElementById("display-username").textContent = username;
  document.getElementById("display-rating").textContent = users[username].rating.toFixed(1);

  loadUserFeed(username, users);
  enableSwipe();
}

// 👥 Load other users + rating buttons
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
        ${[1, 2, 3, 4, 5].map(star =>
          `<button data-username="${username}" data-stars="${star}">${star}</button>`
        ).join("")}
      </div>
    `;

    feed.appendChild(card);
  });

  feed.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.username;
      const stars = parseInt(btn.dataset.stars);
      rateUser(target, stars);
    });
  });
}

// ⭐ Weighted rating logic
function rateUser(targetUsername, stars) {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const rater = localStorage.getItem("loggedInUser");
  if (!users[targetUsername] || !users[rater]) return;

  const raterRating = users[rater].rating || 1;
  const target = users[targetUsername];

  if (!target.ratings) target.ratings = [];

  target.ratings.push({ from: rater, stars });

  let totalWeighted = 0, totalWeight = 0;
  target.ratings.forEach(({ from, stars }) => {
    const weight = users[from]?.rating || 1;
    totalWeighted += stars * weight;
    totalWeight += weight;
  });

  target.rating = totalWeighted / totalWeight;
  localStorage.setItem("users", JSON.stringify(users));

  loadUserFeed(rater, users); // Refresh after rating
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// 👉 Swipe behavior
function enableSwipe() {
  const container = document.getElementById("swipeContainer");
  if (!container) return;

  let startX = 0;
  container.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
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

// 🚀 Run only on profile page
if (window.location.pathname.includes("profile.html")) {
  window.onload = loadProfile;
}
