document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".nav-brand");
  if (!logo) return;

  // If we are inside, go back two folders
  const inPages = window.location.pathname.includes("/pages/");
  const homePath = inPages ? "../../index.html" : "index.html";

  logo.setAttribute("href", homePath);
});
