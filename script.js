const telegramId = "12345"; // temporary test ID

async function loadUser() {
  const res = await fetch(`/test-user/${telegramId}`);
  const data = await res.json();

  document.getElementById("coins").innerText = data.coins;
  document.getElementById("energy").innerText = data.energy;
}

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    document.getElementById("coins").innerText = data.coins;
    document.getElementById("energy").innerText = data.energy;
  }
}

loadUser();
