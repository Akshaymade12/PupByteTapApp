const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
const userId = user.id;

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");

async function load() {
    const res = await fetch("/user/" + userId);
    const data = await res.json();

    coinsEl.innerText = data.coins;
    energyEl.innerText = data.energy;
}

load();

/* TAP */
tapBtn.onclick = async () => {
    const res = await fetch("/tap/" + userId, {
        method: "POST"
    });

    const data = await res.json();

    coinsEl.innerText = data.coins;
    energyEl.innerText = data.energy;
};
