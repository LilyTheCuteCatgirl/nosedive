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
    rating: 4.2, // default starting rating
  };

  localStorage.setItem("users", JSON.stringify(users));
  showMessage("Account created! You can now log in.");
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!users[username]) {
    return showMessage("No such user. Please sign up first.");
  }

  if (users[username].password !== password) {
    return showMessage("Incorrect password.");
  }

  localStorage.setItem("loggedInUser", username);
  showMessage(`Welcome, ${username}! You are logged in.`);
  // Redirect or load profile page here later
}

function showMessage(msg) {
  document.getElementById("message").textContent = msg;
}
