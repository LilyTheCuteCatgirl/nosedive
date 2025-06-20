// Redirect to profile after login
function redirectToProfile() {
  window.location.href = "profile.html";
}

// Load user info on profile page
function loadProfile() {
  const username = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!username || !users[username]) {
    // Not logged in — go back
    window.location.href = "index.html";
    return;
  }

  const userData = users[username];
  document.getElementById("display-username").textContent = username;
  document.getElementById("display-rating").textContent = userData.rating.toFixed(1);
}

// Log out and return to login page
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
