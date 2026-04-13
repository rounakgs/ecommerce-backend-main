// ✅ Dummy Products Data
const products = [
  { id: 1, name: "TIMEWEAR", price: 1299, image: "images/product1.jpg" },
  { id: 2, name: "Carlington", price: 2499, image: "images/product2.jpg" },
  { id: 3, name: "Michael Kors", price: 999, image: "images/product3.jpg" },
  { id: 4, name: "Titan", price: 499, image: "images/product4.jpg" }
];

// ✅ Load products on products.html
const productsContainer = document.getElementById("products-container");
if (productsContainer) {
  products.forEach(product => {
    productsContainer.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <label for="qty-${product.id}">Quantity:</label>
        <input type="number" id="qty-${product.id}" min="1" value="1" />
        <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

// ✅ Add to Cart
async function addToCart(id) {
  const qtyInput = document.getElementById(`qty-${id}`);
  const quantity = parseInt(qtyInput.value);

  if (quantity < 1 || isNaN(quantity)) {
    alert("Please enter a valid quantity.");
    return;
  }

  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    alert("Please login first!");
    return;
  }

  const response = await fetch("http://localhost:3000/add-to-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userId, productId: id, quantity: quantity })
  });

  const data = await response.json();
  if (data.success) {
    alert(`${quantity} item(s) added to your cart!`);
  } else {
    alert("Failed to add to cart. Try again!");
  }
}

// ✅ Load Cart from DB
async function loadCart() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) return;

  const response = await fetch(`http://localhost:3000/get-cart/${userId}`);
  const cartItems = await response.json();

  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartItemsContainer.innerHTML += `
      <div class="cart-card">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>₹${item.price} × 
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)" style="width: 60px;" />
          </p>
          <p><strong>Total: ₹${itemTotal}</strong></p>
          <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });

  document.getElementById("cart-total").innerHTML = `Total: ₹${total}`;
}

// ✅ Remove Item
async function removeItem(productId) {
  const userId = sessionStorage.getItem("userId");
  if (!userId) return;

  await fetch("http://localhost:3000/remove-from-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId })
  });

  loadCart();
}

// ✅ Update Quantity
async function updateQuantity(productId, newQty) {
  const userId = sessionStorage.getItem("userId");
  if (!userId) return;

  const quantity = parseInt(newQty);
  await fetch("http://localhost:3000/update-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity })
  });

  loadCart();
}

// ✅ Call loadCart if on cart page
if (document.getElementById("cart-items")) {
  loadCart();
}

// ✅ Proceed to Checkout: empty cart check
const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("Please login first!");
      return;
    }

    const response = await fetch(`http://localhost:3000/get-cart/${userId}`);
    const cartItems = await response.json();

    // ✅ Check if cart is empty
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add some items before proceeding to checkout.");
      window.location.href = "products.html"; // Redirect to products page
    } else {
      window.location.href = "checkout.html"; // Proceed to checkout
    }
  });
}

// ✅ EmailJS Contact Form
(function() {
  emailjs.init("vfmcsmxk2FZT1nVBf");
})();
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    emailjs.sendForm('service_sshxtzd', 'template_yvl6ulk', this)
      .then(() => {
        document.getElementById("form-message").textContent = "Message sent successfully!";
        contactForm.reset();
      }, (error) => {
        document.getElementById("form-message").textContent = "Something went wrong!";
        console.log(error);
      });
  });
}

// ✅ Navbar Hamburger Toggle
const hamburger = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
hamburger?.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove("show");
  }
});

// ✅ Login Modal
const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");
const closeLogin = document.getElementById("close-login");
loginBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.style.display = "flex";
});
closeLogin?.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// ✅ Toggle Forms
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
showSignup?.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
});
showLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
});

// ✅ Enable Sign Up Button
const agreeCheckbox = document.getElementById("agree-checkbox");
const signupBtn = document.getElementById("signup-btn");
agreeCheckbox?.addEventListener("change", () => {
  signupBtn.disabled = !agreeCheckbox.checked;
});

// ✅ Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  themeToggle.innerHTML = theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
if (themeToggle) {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  themeToggle.addEventListener("click", () => {
    const current = document.body.classList.contains("dark-mode") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

// ✅ Shop Now Button
const shopNowBtn = document.getElementById("shop-now-btn");
shopNowBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "products.html";
  } else {
    alert("Please login or sign up first!");
    loginModal.style.display = "flex";
  }
});

// ✅ Login Submit
document.querySelector("#login-form form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.elements[0].value;
  const password = e.target.elements[1].value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userEmail", data.user.email);
      sessionStorage.setItem("userName", data.user.fname);
      sessionStorage.setItem("userId", data.user.id);
      alert("Login successful!");
      loginModal.style.display = "none";
      updateNavbar();
    } else {
      alert("Invalid credentials. Please try again.");
    }

  } catch (err) {
    console.error("Login error:", err);
    alert("Server error. Please try again later.");
  }
});

// ✅ Navbar Update
function updateNavbar() {
  const user = sessionStorage.getItem("userName");
  const accountInfo = document.getElementById("account-info");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  if (user) {
    accountInfo.innerHTML = `<a href="account.html">Welcome, ${user}</a>`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    accountInfo.innerHTML = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

// ✅ Logout
const logoutBtn = document.getElementById("logout-btn");
logoutBtn?.addEventListener("click", () => {
  sessionStorage.clear();
  alert("You have been logged out!");
  location.reload();
});

// ✅ Protect Pages
updateNavbar();
if (window.location.search.includes("loginRequired=true")) {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    loginModal.style.display = "flex";
  }
  const url = new URL(window.location);
  url.searchParams.delete("loginRequired");
  window.history.replaceState({}, document.title, url.pathname);
};

// ✅ Signup Submit
document.querySelector("#signup-data")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fname = e.target.elements[0].value;
  const lname = e.target.elements[1].value;
  const mobile = e.target.elements[2].value;
  const email = e.target.elements[3].value;
  const password = e.target.elements[4].value;

  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fname, lname, email, password })
  });

  const data = await response.json();
  if (data.success) {
    alert("Signup successful! Now you can log in.");
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  } else {
    alert("Signup failed: " + data.error);
  }
});

// ✅ Load checkout
async function loadCheckout() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    alert("Please login first!");
    window.location.href = "index.html?loginRequired=true";
    return;
  }

  const response = await fetch(`http://localhost:3000/get-cart/${userId}`);
  const cartItems = await response.json();

  const checkoutItems = document.getElementById("checkout-items");
  let total = 0;

  checkoutItems.innerHTML = "";

  cartItems.forEach(item => {
    checkoutItems.innerHTML += `
      <div>
        <h4>${item.name}</h4>
        <p>₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</p>
      </div>
    `;
    total += item.price * item.quantity;
  });

  document.getElementById("checkout-total").innerText = `Grand Total: ₹${total}`;
}

if (document.getElementById("checkout-items")) {
  loadCheckout();
}

// ✅ Checkout form submit
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("Please login first!");
      return;
    }

    const formData = new FormData(checkoutForm);

    const payload = {
      userId: userId,
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      mobile: formData.get("mobile"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode")
    };

    try {
      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = "order-confirmation.html";
      } else {
        alert("Order failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error: " + err.message);
    }
  });
}

// ✅ Auto redirect on confirmation
if (window.location.pathname.includes("order-confirmation.html")) {
  const counter = document.getElementById("redirect-timer");
  let timeLeft = 15;

  function updateCounter() {
    counter.innerText = timeLeft;
    if (timeLeft === 0) {
      window.location.href = "index.html";
    } else {
      timeLeft--;
      setTimeout(updateCounter, 1000);
    }
  }
  updateCounter();
}
