let coins = 0;

// Unique user ID (browser based)
let userId = localStorage.getItem("pupbyte_user");

if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("pupbyte_user", userId);
}

function tap() {
    coins++;
    document.getElementById("coins").innerText = coins;
    saveCoins();
}

async function saveCoins() {
    await fetch("/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            coins: coins
        })
    });
}

async function loadCoins() {
    const res = await fetch("/load/" + userId);
    const data = await res.json();

    coins = data.coins || 0;
    document.getElementById("coins").innerText = coins;
    document.getElementById("profit").innerText = data.profitPerHour || 0;
}

// Level display update
if (document.getElementById("level")) {
  document.getElementById("level").innerText = "Legendary " + (data.level || 1);
}

window.onload = loadCoins;

async function upgrade() {
    const res = await fetch("/upgrade", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (data.success) {
        coins = data.coins;
        document.getElementById("coins").innerText = coins;
        document.getElementById("profit").innerText = data.profitPerHour;
        alert("Upgrade Successful 🚀");
    } else {
        alert("Not enough coins 💸");
    }
}
