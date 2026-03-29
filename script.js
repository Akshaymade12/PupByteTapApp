let userId = 123; // test id

async function load(){
    const res = await fetch("/load/" + userId);
    const data = await res.json();
    document.getElementById("coins").innerText = data.coins;
}

async function tap(){
    const res = await fetch("/tap/" + userId, { method: "POST" });
    const data = await res.json();
    document.getElementById("coins").innerText = data.coins;
}

load();
