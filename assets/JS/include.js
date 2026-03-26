async function inject(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    el.innerHTML = `<!-- Failed to load ${path} -->`;
  }
}

function initNavbarToggle() {
  const toggle = document.getElementById("hamburger");
  const menu = document.getElementById("navMenu");

  if (!toggle || !menu) return;

  // Prevent double-binding
  if (toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    toggle.classList.toggle("active");
  });

  // Optional: close menu when clicking a link on mobile
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    if (window.innerWidth <= 768) {
      menu.classList.remove("active");
      toggle.classList.remove("active");
    }
  });
}

function initFounderReveal() {
  const cards = document.querySelectorAll(".founderHero");
  cards.forEach(card => {
    const btn = card.querySelector(".founderHeroTap");
    if (!btn) return;

    if(btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      const isOn = card.getAttribute("data-reveal") === "true";
      card.setAttribute("data-reveal", String(!isOn));
      btn.textContent = isOn ? "Tap to reveal" : "Tap to hide";
    });
  });
}

function getStoredAuth() {
  try {
    const localAuth = JSON.parse(localStorage.getItem("yan_auth") || "null");
    if (localAuth && localAuth.role) return localAuth;

    const sessionAuth = JSON.parse(sessionStorage.getItem("yan_auth") || "null");
    if (sessionAuth && sessionAuth.role) return sessionAuth;
  } catch (error) {
    console.warn("Unable to parse auth state.", error);
  }

  return null;
}

function initNavbarAuthToggle() {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return;

  const auth = getStoredAuth();
  const isLoggedIn = Boolean(auth?.role);
  const loginText = loginBtn.querySelector(".login-text");
  const loginIcon = loginBtn.querySelector(".login-icon");
  const loginAnchor = loginBtn.closest("a");

  if (!isLoggedIn) return;

  if (loginText) loginText.textContent = "Logout";
  if (loginIcon) loginIcon.textContent = "↗";
  if (loginAnchor) loginAnchor.setAttribute("href", "#");

  loginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("yan_auth");
    sessionStorage.removeItem("yan_auth");
    window.location.reload();
  });
}

function getBasePathToRoot() {
  // Example paths:
  // /index.html -> depth 0 -> "."
  // /pages/events.html -> depth 1 -> ".."
  // /pages/members/members.html -> depth 2 -> "../.."
  // /pages/members/profiles/x.html -> depth 3 -> "../../.."

  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);

  // If last part looks like a file, remove it for depth calculation
  if (parts.length && parts[parts.length - 1].includes(".")) {
    parts.pop();
  }

  const depth = parts.length;
  if (depth === 0) return ".";
  return "../".repeat(depth).replace(/\/$/, "");
}

document.addEventListener("DOMContentLoaded", async () => {
  const base = getBasePathToRoot();

  await inject("#navbarMount", `${base}/components/navbar.html`);
  await inject("#footerMount", `${base}/components/footer.html`);

  initNavbarToggle();
  initFounderReveal();
  initNavbarAuthToggle();
});
