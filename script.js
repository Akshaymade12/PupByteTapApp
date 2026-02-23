let coins = 0;
let energy = 100;
let maxEnergy = 100;
let profitPerHour = 10;

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const profitEl = document.getElementById("profit");
const tapBtn = document.getElementById("tapBtn");

profitEl.innerText = profitPerHour;

tapBtn.addEventListener("click", () => {
  if (energy <= 0) return;

  coins += 1;
  energy -= 1;

  coinsEl.innerText = coins;
  energyEl.innerText = energy;

  showPlusOne();
});

/* Floating +1 */
function showPlusOne() {
  const plus = document.createElement("div");
  plus.classList.add("plus-one");
  plus.innerText = "+1";

  document.querySelector(".coin-wrapper").appendChild(plus);

  setTimeout(() => {
    plus.remove();
  }, 1000);
}

/* Energy Regeneration */
setInterval(() => {
  if (energy < maxEnergy) {
    energy += 1;
    energyEl.innerText = energy;
  }
}, 3000);

/* Passive Profit System */
setInterval(() => {
  coins += profitPerHour / 3600;
  coinsEl.innerText = Math.floor(coins);
}, 1000);
