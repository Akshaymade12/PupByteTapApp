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

const tapBtn = document.getElementById("tapBtn");

tapBtn.addEventListener("click", (e) => {

  // Create +1 element
  const plusOne = document.createElement("div");
  plusOne.className = "plus-one";
  plusOne.innerText = "+1";

  // Position where clicked
  plusOne.style.left = e.offsetX + "px";
  plusOne.style.top = e.offsetY + "px";

  tapBtn.parentElement.appendChild(plusOne);

  // Remove after animation
  setTimeout(() => {
    plusOne.remove();
  }, 800);

});
