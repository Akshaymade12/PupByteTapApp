const loginPage = document.getElementById("loginPage");
const adminPanel = document.getElementById("adminPanel");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const ADMIN_API_BASE = "https://pupbytetapapp.onrender.com";

loginBtn.onclick = async () => {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  try {
    const res = await fetch(`${ADMIN_API_BASE}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    });

    const data = await res.json();

    if (!data.success) {
      document.getElementById("loginError").innerText = data.message || "Invalid login";
      return;
    }

    localStorage.setItem("adminToken", data.token);
    document.getElementById("loginError").innerText = "";

    loginPage.style.display = "none";
    adminPanel.style.display = "flex";

    loadDashboard();
  } catch (e) {
    document.getElementById("loginError").innerText = "Server error";
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem("adminToken");
  adminPanel.style.display = "none";
  loginPage.style.display = "flex";
  showDashboardPage();
};

function loadDashboard() {
  // demo values (later API se aayega)
  document.getElementById("totalUsers").innerText = "1250";
  document.getElementById("activeUsers").innerText = "320";
  document.getElementById("totalCoins").innerText = "9500000";
  document.getElementById("totalRefs").innerText = "420";
}

const menuDashboard = document.getElementById("menuDashboard");
const menuUsers = document.getElementById("menuUsers");

const usersPage = document.getElementById("usersPage");
const usersTableBody = document.getElementById("usersTableBody");
const userSearchInput = document.getElementById("userSearchInput");

const userModal = document.getElementById("userModal");
const closeUserModal = document.getElementById("closeUserModal");

const modalUserId = document.getElementById("modalUserId");
const modalUserName = document.getElementById("modalUserName");
const modalUserUsername = document.getElementById("modalUserUsername");
const modalUserCoins = document.getElementById("modalUserCoins");
const modalUserProfit = document.getElementById("modalUserProfit");
const modalUserRefs = document.getElementById("modalUserRefs");
const modalUserLeague = document.getElementById("modalUserLeague");
const modalUserStatus = document.getElementById("modalUserStatus");

const adminCoinsInput = document.getElementById("adminCoinsInput");
const addCoinsBtn = document.getElementById("addCoinsBtn");
const deductCoinsBtn = document.getElementById("deductCoinsBtn");

let selectedUser = null;

/* ================= DEMO USERS DATA ================= */
let adminUsers = [
  {
    userId: "1001",
    name: "Akshay",
    username: "@akshay",
    coins: 54000,
    profitPerHour: 385,
    referrals: 12,
    league: "Silver",
    status: "Active"
  },
  {
    userId: "1002",
    name: "Rohan",
    username: "@rohan",
    coins: 12000,
    profitPerHour: 120,
    referrals: 2,
    league: "Bronze",
    status: "Active"
  },
  {
    userId: "1003",
    name: "Aman",
    username: "@aman",
    coins: 98000,
    profitPerHour: 540,
    referrals: 21,
    league: "Gold",
    status: "Banned"
  }
];

/* ================= PAGE SWITCH ================= */
function showDashboardPage() {
  menuDashboard.classList.add("active");
  menuUsers.classList.remove("active");

  document.querySelector(".topbar h2").innerText = "Dashboard";
  document.querySelector(".cards").style.display = "grid";
  document.querySelector(".table-box").style.display = "block";
  usersPage.style.display = "none";
}

function showUsersPage() {
  menuDashboard.classList.remove("active");
  menuUsers.classList.add("active");

  document.querySelector(".topbar h2").innerText = "Users";
  document.querySelector(".cards").style.display = "none";
  document.querySelector(".table-box").style.display = "none";
  usersPage.style.display = "block";

  loadUsersFromBackend();
}

if (menuDashboard) menuDashboard.onclick = showDashboardPage;
if (menuUsers) menuUsers.onclick = showUsersPage;

/* ================= USERS TABLE ================= */
function renderUsersTable(users) {
  if (!usersTableBody) return;

  if (!users.length) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="9">No users found</td>
      </tr>
    `;
    return;
  }

  usersTableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.userId}</td>
      <td>${user.name}</td>
      <td>${user.username}</td>
      <td>${user.coins}</td>
      <td>${user.profitPerHour}</td>
      <td>${user.referrals}</td>
      <td>${user.league}</td>
      <td>${user.status}</td>
      <td><button class="view-btn" onclick="openUserModal('${user.userId}')">View</button></td>
    </tr>
  `).join("");
}

/* ================= SEARCH ================= */
if (userSearchInput) {
  userSearchInput.oninput = () => {
    const q = userSearchInput.value.trim().toLowerCase();

    const filtered = adminUsers.filter(user =>
      user.userId.toLowerCase().includes(q) ||
      user.name.toLowerCase().includes(q) ||
      user.username.toLowerCase().includes(q)
    );

    renderUsersTable(filtered);
  };
}

/* ================= MODAL ================= */
window.openUserModal = function(userId) {
  const user = adminUsers.find(u => u.userId === userId);
  if (!user) return;

  selectedUser = user;

  modalUserId.innerText = user.userId;
  modalUserName.innerText = user.name;
  modalUserUsername.innerText = user.username;
  modalUserCoins.innerText = user.coins;
  modalUserProfit.innerText = user.profitPerHour;
  modalUserRefs.innerText = user.referrals;
  modalUserLeague.innerText = user.league;
  modalUserStatus.innerText = user.status;

  adminCoinsInput.value = "";
  userModal.style.display = "flex";
};

if (closeUserModal) {
  closeUserModal.onclick = () => {
    userModal.style.display = "none";
    selectedUser = null;
  };
}

/* ================= COINS ACTION ================= */
if (addCoinsBtn) {
  addCoinsBtn.onclick = async () => {
    if (!selectedUser) return;

    const amount = Number(adminCoinsInput.value);
    if (!amount || amount <= 0) return;

    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${ADMIN_API_BASE}/admin/users/add-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.dbId || selectedUser.userId,
          amount
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to add coins");
        return;
      }

      selectedUser.coins = data.coins;
      selectedUser.league = data.league;

      modalUserCoins.innerText = selectedUser.coins;
      modalUserLeague.innerText = selectedUser.league;

      renderUsersTable(adminUsers);
      adminCoinsInput.value = "";
    } catch (e) {
      alert("Server error");
    }
  };
}

/* ================= DEDUCT COIN ================= */

if (deductCoinsBtn) {
  deductCoinsBtn.onclick = async () => {
    if (!selectedUser) return;

    const amount = Number(adminCoinsInput.value);
    if (!amount || amount <= 0) return;

    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${ADMIN_API_BASE}/admin/users/deduct-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.dbId || selectedUser.userId,
          amount
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to deduct coins");
        return;
      }

      selectedUser.coins = data.coins;
      selectedUser.league = data.league;

      modalUserCoins.innerText = selectedUser.coins;
      modalUserLeague.innerText = selectedUser.league;

      renderUsersTable(adminUsers);
      adminCoinsInput.value = "";
    } catch (e) {
      alert("Server error");
    }
  };
}

/* ================= load function ================= */

async function loadUsersFromBackend() {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    const res = await fetch(`${ADMIN_API_BASE}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Failed to load users");
      return;
    }

    adminUsers = data.users || [];
    renderUsersTable(adminUsers);
  } catch (e) {
    console.log("loadUsersFromBackend error", e);
  }
}

/* ================= Load ================= */

window.onload = () => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    loginPage.style.display = "none";
    adminPanel.style.display = "flex";
    loadDashboard();
  } else {
    loginPage.style.display = "flex";
    adminPanel.style.display = "none";
  }
};
