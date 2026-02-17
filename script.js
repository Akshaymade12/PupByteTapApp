let coins = 0;

function tap(){
  coins += 1;
  document.getElementById("coins").innerText = coins;
}
async function saveCoins(telegramId, coins) {
  try {
    await fetch("https://pupbytetapapp.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        telegramId: telegramId,
        coins: coins
      })
    });
  } catch (err) {
    console.log("Save error:", err);
  }
}
