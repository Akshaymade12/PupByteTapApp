const tg = window.Telegram.WebApp;
tg.expand();

const userId = 123456; // test id

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const refLinkEl = document.getElementById("refLink");
/* UPGRADE */

upgradeBtn.onclick = async () => {
    const res = await fetch(window.location.origin + "/upgrade/power/" + userId, {
        method: "POST"
    });

    const data = await res.json();

    coinsEl.innerText = data.coins;
};

/* LOAD */
async function load() {
    try {
        const res = await fetch(window.location.origin + "/user/" + userId);
        const data = await res.json();

        const coins = data.coins ?? 0;
        const energy = data.energy ?? 100;
        
const botUsername = "PupByteTapBot";
refLinkEl.innerText = "Invite: https://t.me/" + botUsername + "?start=" + userId;
        
        coinsEl.innerText = coins;
        energyEl.innerText = energy;

    } catch (err) {
        console.error("Load error:", err);
    }
}

load();

/* TAP (FIXED) */
tapBtn.onclick = async () => {
    try {
         // 🔥 animation start
        tapBtn.style.transform = "scale(0.9)";
        setTimeout(() => {
            tapBtn.style.transform = "scale(1)";
        }, 100);
        
        tapBtn.disabled = true; // double tap रोकने के लिए

        const res = await fetch(window.location.origin + "/tap/" + userId, {
            method: "POST"
        });

        const data = await res.json();

        coinsEl.innerText = data.coins;
        energyEl.innerText = data.energy;

        setTimeout(() => {
            tapBtn.disabled = false;
        }, 200);

    } catch (err) {
        console.error("Tap error:", err);
    }
};
