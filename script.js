const tg = window.Telegram.WebApp;
tg.expand();

const userId = 123456; // test id
console.log(user);
console.log(userId);

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");

async function load() {
    try {
        const res = await fetch(window.location.origin + "/user/" + userId);
        const data = await res.json();

        const coins = data.coins ?? 0;
        const energy = data.energy ?? 100;

        coinsEl.innerText = coins;
        energyEl.innerText = energy;

    } catch (err) {
        console.error("Load error:", err);
    }
}

load();

/* TAP */
tapBtn.onclick = async () => {
    const res = await fetch(window.location.origin + "/tap/" + userId)
        method: "POST"
    });

    const data = await res.json();

    coinsEl.innerText = data.coins;
    energyEl.innerText = data.energy;
};
