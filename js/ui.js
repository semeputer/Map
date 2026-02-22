document.getElementById("toggleBtn").onclick = () =>
  document.getElementById("sidebar").classList.toggle("collapsed");

document.getElementById("themeToggle").onclick = () =>
  document.body.classList.toggle("dark-mode");

function logout() {
  sessionStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}