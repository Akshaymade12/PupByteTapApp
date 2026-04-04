const tg = window.Telegram.WebApp;
tg.expand();

/* ✅ REAL TELEGRAM USER */
const user = tg.initDataUnsafe.user;

if (!user) {
    alert("Open this inside Telegram!");
}

const userId = user.id;

/* ELEMENTS */
const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const refLinkEl = document.getElementById("refLink");

/* SAVE USER DATA */
fetch("/saveUser", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        id: user.id,
        name: user.first_name,
        username: user.username
    })
});

/* LOAD */
async function load() {
    const res = await fetch("/user/" + userId);
    const data = await res.json();

    coinsEl.innerText = data.coins;
    energyEl.innerText = data.energy;
    document.getElementById("energyText").innerText = data.energy + "/100";

    const botUsername = "PupByteTapBot";
    const link = "https://t.me/" + botUsername + "?start=" + userId;

    refLinkEl.innerText = link;
    refLinkEl.href = link;
}

load();

/* TAP */
tapBtn.onclick = async () => {
    tapBtn.style.transform = "scale(0.9)";
    setTimeout(() => tapBtn.style.transform = "scale(1)", 100);

    const res = await fetch("/tap/" + userId, { method: "POST" });
    const data = await res.json();

    coinsEl.innerText = data.coins;
    energyEl.innerText = data.energy;
    document.getElementById("energyText").innerText = data.energy + "/100";
};

/* UPGRADE */
upgradeBtn.onclick = async () => {
    const res = await fetch("/upgrade/power/" + userId, { method: "POST" });
    const data = await res.json();

    coinsEl.innerText = data.coins;
};

/* NAVIGATION */
function showSection(section) {

    const sections = ["earn", "task", "account", "skills", "cashier"];

    sections.forEach(s => {
        document.getElementById(s + "Section").style.display = "none";
    });

    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

    document.getElementById(section + "Section").style.display = "block";

    const index = sections.indexOf(section);
    document.querySelectorAll(".nav-item")[index].classList.add("active");
}
