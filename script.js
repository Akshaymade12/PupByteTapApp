const telegramId = "12345";

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const profitEl = document.getElementById("profit");
const tapBtn = document.getElementById("tapBtn");
const upgradeTapBtn = document.getElementById("upgradeTapBtn");
const upgradeProfitBtn = document.getElementById("upgradeProfitBtn");

/* LOAD USER */

async function loadUser() {
  const res = await fetch(`/load/${telegramId}`);
  const data = await res.json();

  coinsEl.innerText = Math.floor(data.coins);
  energyEl.innerText = data.energy;
  profitEl.innerText = data.profitPerHour;

  upgradeTapBtn.innerText = `Tap Upgrade (${data.nextTapCost})`;
  upgradeProfitBtn.innerText = `Profit Upgrade (${data.nextProfitCost})`;
}

loadUser();

/* TAP */

tapBtn.addEventListener("click", async () => {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    coinsEl.innerText = Math.floor(data.coins);
    energyEl.innerText = data.energy;
    
    profitEl.innerText = data.profitPerHour || profitEl.innerText;
    
    showPlusOne(data.tapPower);
  }
});

/* TAP UPGRADE */

upgradeTapBtn.addEventListener("click", async () => {
  const res = await fetch("/upgrade-tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    loadUser();
  } else {
    alert("Not enough coins!");
  }
});

/* PROFIT UPGRADE */

upgradeProfitBtn.addEventListener("click", async () => {
  const res = await fetch("/upgrade-profit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    loadUser();
  } else {
    alert("Not enough coins!");
  }
});

/* +1 Animation */

function showPlusOne(amount) {
  const plus = document.createElement("div");
  plus.className = "plus-one";
  plus.innerText = "+" + amount;
  document.querySelector(".coin-wrapper").appendChild(plus);
  setTimeout(() => plus.remove(), 800);
}

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
  if (item.innerText.includes("Skills")) {
    item.addEventListener("click", showBoots);
  }
  if (item.innerText.includes("Earn")) {
    item.addEventListener("click", showEarn);
  }
});

function showBoots() {
  document.querySelector(".coin-wrapper").style.display = "none";
  document.getElementById("bootsSection").style.display = "block";
}

function showEarn() {
  document.querySelector(".coin-wrapper").style.display = "block";
  document.getElementById("bootsSection").style.display = "none";
}
