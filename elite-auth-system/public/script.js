document.getElementById("login-btn").addEventListener("click", () => {
  document.getElementById("login-modal").style.display = "block";
});

// LOGIN HANDLER
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.success) {
    sessionStorage.setItem("userName", data.user.fname);
    alert("Login Successful!");
    document.getElementById("login-modal").style.display = "none";
    updateNavbar();
  } else {
    alert("Incorrect details. Please sign up.");
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("signup-modal").style.display = "block";
  }
});

// SIGNUP HANDLER
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fname, lname, email, password }),
  });

  const data = await res.json();
  if (data.success) {
    alert("Signup successful! Now please login.");
    document.getElementById("signup-modal").style.display = "none";
    document.getElementById("login-modal").style.display = "block";
  } else {
    alert("Signup failed! Maybe user already exists.");
  }
});
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.clear(); // Clear session
  alert("Logged out successfully!");
  location.reload(); // Refresh page
});

// Navbar update
function updateNavbar() {
  const user = sessionStorage.getItem("userName");
  if (user) {
    document.getElementById("account-info").innerHTML = `<a href="#">Welcome, ${user}</a>`;
    document.getElementById("login-btn").style.display = "none";
  }
}

updateNavbar(); // call on page load
