const loginPage = document.getElementById("loginPage");
const adminPanel = document.getElementById("adminPanel");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.onclick = () => {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  // SIMPLE LOGIN (later backend se connect karenge)
  if (user === "admin" && pass === "1234") {
    loginPage.style.display = "none";
    adminPanel.style.display = "flex";

    loadDashboard();
  } else {
    document.getElementById("loginError").innerText = "Invalid login";
  }
};

logoutBtn.onclick = () => {
  adminPanel.style.display = "none";
  loginPage.style.display = "flex";
};

function loadDashboard() {
  // demo values (later API se aayega)
  document.getElementById("totalUsers").innerText = "1250";
  document.getElementById("activeUsers").innerText = "320";
  document.getElementById("totalCoins").innerText = "9500000";
  document.getElementById("totalRefs").innerText = "420";
}
