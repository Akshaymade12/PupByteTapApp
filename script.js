const tg = window.Telegram.WebApp;
tg.expand();

const userId = 123456; // test id

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const refLinkEl = document.getElementById("refLink");

/* LOAD USER */
async function load() {
    try {
        const res = await fetch(window.location.origin + "/user/" + userId);
        const data = await res.json();

        const coins = data.coins ?? 0;
        const energy = data.energy ?? 100;

        coinsEl.innerText = coins;
        energyEl.innerText = energy;

        // 🔗 Referral link
        const botUsername = "pupbyte_tap_bot";
        refLinkEl.innerText = "https://t.me/" + botUsername + "?start=" + userId;

    } catch (err) {
        console.error("Load error:", err);
    }
}

load();

/* TAP */
tapBtn.onclick = async () => {
    try {
        // animation
        tapBtn.style.transform = "scale(0.9)";
        setTimeout(() => {
            tapBtn.style.transform = "scale(1)";
        }, 100);

        const res = await fetch(window.location.origin + "/tap/" + userId, {
            method: "POST"
        });

        const data = await res.json();

        coinsEl.innerText = data.coins;
        energyEl.innerText = data.energy;

    } catch (err) {
        console.error("Tap error:", err);
    }
};

/* UPGRADE */
upgradeBtn.onclick = async () => {
    const res = await fetch(window.location.origin + "/upgrade/power/" + userId, {
        method: "POST"
    });

    const data = await res.json();

    coinsEl.innerText = data.coins;
};

/* NAVIGATION */
function showSection(section) {
    document.getElementById("earnSection").style.display = "none";
    document.getElementById("taskSection").style.display = "none";

    if (section === "earn") {
        document.getElementById("earnSection").style.display = "block";
    } else {
        document.getElementById("taskSection").style.display = "block";
    }
}
