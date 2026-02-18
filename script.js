let coins = 0;

// Telegram WebApp Ready
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();

    console.log("Telegram Loaded ✅");
    console.log("User Data:", window.Telegram.WebApp.initDataUnsafe);
}
function tap() {
    coins++;
    document.getElementById("coins").innerText = coins;
    saveCoins();
}

async function saveCoins() {
    try {
        if (!window.Telegram || !window.Telegram.WebApp) return;

        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (!user) return;

        await fetch("/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegramId: user.id,
                coins: coins
            })
        });

    } catch (err) {
        console.log("Save Error:", err);
    }
}

async function loadCoins() {
    try {
        if (!window.Telegram || !window.Telegram.WebApp) return;

        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (!user) return;

        const res = await fetch("/load/" + user.id);
        const data = await res.json();

        coins = data.coins || 0;
        document.getElementById("coins").innerText = coins;

    } catch (err) {
        console.log("Load Error:", err);
    }
}

window.onload = loadCoins;
