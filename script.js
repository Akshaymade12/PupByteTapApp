let coins = 0;

// Unique user id (browser based)
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
    try {
        await fetch("/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegramId: userId,
                coins: coins
            })
        });
    } catch (err) {
        console.log("Save error:", err);
    }
}

async function loadCoins() {
    try {
        const res = await fetch("/load/" + userId);
        const data = await res.json();
        coins = data.coins || 0;
        document.getElementById("coins").innerText = coins;
        document.getElementById("profit").innerText = data.profitPerHour;
    } catch (err) {
        console.log("Load error:", err);
    }
}

window.onload = loadCoins;
