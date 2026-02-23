const telegramId = "12345"; // later Telegram WebApp se lenge

let coins = 0;
let energy = 100;
let maxEnergy = 100;
let profitPerHour = 10;

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");

/* Load user from server */
async function loadUser() {
  const res = await fetch(`/test-user/${telegramId}`);
  const data = await res.json();

  coins = data.coins;
  energy = data.energy;
  profitPerHour = data.profitPerHour;

  coinsEl.innerText = coins;
  energyEl.innerText = energy;
}

loadUser();

/* Tap */
tapBtn.addEventListener("click", async () => {
  if (energy <= 0) return;

  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
  coins = data.coins;
  energy = data.energy;

  coinsEl.innerText = coins;
  energyEl.innerText = energy;

  showPlusOne(data.tapPower);
  }
  }
});

/* Floating +1 */
function showPlusOne(amount) {
  const plus = document.createElement("div");
  plus.classList.add("plus-one");
  plus.innerText = "+" + amount;

  document.querySelector(".coin-wrapper").appendChild(plus);

  setTimeout(() => {
    plus.remove();
  }, 1000);
}

const upgradeBtn = document.getElementById("upgradeBtn");

upgradeBtn.addEventListener("click", async () => {
  const res = await fetch("/upgrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    coinsEl.innerText = data.coins;
    upgradeBtn.innerText = `Upgrade (${data.nextCost})`;
  } else {
    alert("Not enough coins!");
  }
});
