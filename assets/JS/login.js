// login.js
// Frontend-only login simulation (no backend yet).
// Later, you'll replace mockAuth() with a real fetch() call to your API.

const loginForm = document.getElementById("loginForm");
const identifierEl = document.getElementById("identifier");
const passwordEl = document.getElementById("password");
const rememberEl = document.getElementById("rememberMe");
const loginBtn = document.getElementById("loginBtn");
const alertEl = document.getElementById("alert");
const togglePasswordBtn = document.getElementById("togglePassword");

document.getElementById("year").textContent = new Date().getFullYear();

function showAlert(message, type = "danger") {
  alertEl.textContent = message;
  alertEl.classList.add("show");
  alertEl.classList.remove("danger", "ok");
  alertEl.classList.add(type);
}

function clearAlert() {
  alertEl.textContent = "";
  alertEl.classList.remove("show", "danger", "ok");
}

function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  loginBtn.textContent = isLoading ? "Logging in..." : "Login";
}

togglePasswordBtn.addEventListener("click", () => {
  const isHidden = passwordEl.type === "password";
  passwordEl.type = isHidden ? "text" : "password";
  togglePasswordBtn.textContent = isHidden ? "Hide" : "Show";
  togglePasswordBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

// Mock users (temporary)
const DEMO_USERS = [
  { identifier: "admin@yan.com", password: "Admin123!", role: "admin", name: "Admin" },
  { identifier: "member@yan.com", password: "Member123!", role: "member", name: "Member User" }
];

function normalizeIdentifier(value) {
  return (value || "").trim().toLowerCase();
}

function mockAuth(identifier, password) {
  // Simulate latency + validation
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = DEMO_USERS.find(
        (u) => normalizeIdentifier(u.identifier) === normalizeIdentifier(identifier) && u.password === password
      );

      if (!found) {
        resolve({ success: false, message: "Invalid email/username or password." });
        return;
      }

      // Simulated login response (what backend should return later)
      resolve({
        success: true,
        token: "mock_token_" + Math.random().toString(16).slice(2),
        role: found.role,
        user: { name: found.name, identifier: found.identifier, role: found.role }
      });
    }, 600);
  });
}

function saveSession(data, remember) {
  const payload = {
    token: data.token,
    role: data.role,
    user: data.user
  };

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("yan_auth", JSON.stringify(payload));

  // Optional: clear from the other storage to avoid conflicts
  (remember ? sessionStorage : localStorage).removeItem("yan_auth");
}

function getDashboardPathByRole(role) {
  // Adjust these paths to match your project structure
  if (role === "admin") return "adminDashboard.html";
  return "memberDashboard.html";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();

  const identifier = identifierEl.value.trim();
  const password = passwordEl.value;

  if (!identifier || !password) {
    showAlert("Please enter your email/username and password.");
    return;
  }

  setLoading(true);

  try {
    // Replace this later with: fetch("YOUR_API/login", ...)
    const result = await mockAuth(identifier, password);

    if (!result.success) {
      showAlert(result.message || "Login failed. Try again.");
      setLoading(false);
      return;
    }

    // Save session
    saveSession(result, rememberEl.checked);

    showAlert("Login successful! Redirecting...", "ok");

    // Redirect by role
    const target = getDashboardPathByRole(result.role);
    setTimeout(() => {
      window.location.href = target;
    }, 450);

  } catch (err) {
    showAlert("Network error. Please try again.");
    setLoading(false);
  }
});