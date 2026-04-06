document.addEventListener("DOMContentLoaded", () => {

const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe.user;

const telegramId = user ? user.id.toString() : null;
const initData = tg.initData;
 
 /* ================= TELEGRAM SAFE INIT ================= */

  const tg = window.Telegram?.WebApp;

  if (!tg) {
    document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:50px;'>Please open from Telegram</h2>";
    throw new Error("Telegram not found");
  }

  tg.expand();

  // ✅ SAFE USER FETCH (FIXED)
  let user;
  if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    user = tg.initDataUnsafe.user;
  } else {
    document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:50px;'>Please open from Telegram</h2>";
    throw new Error("User not found");
  }

  const telegramId = user.id;
  const userId = user.id; // ✅ for tap API
  const initData = tg.initData;

  /* ================= ELEMENTS ================= */

  const coinsEl = document.getElementById("coins");
  const energyEl = document.getElementById("energy");
  const profitEl = document.getElementById("profit");

  const tapBtn = document.getElementById("tapBtn");
  const upgradeTapBtn = document.getElementById("upgradeTapBtn");
  const upgradeProfitBtn = document.getElementById("upgradeProfitBtn");

  const earnSection = document.getElementById("earnSection");
  const boostSection = document.getElementById("boostSection");
  const tasksSection = document.getElementById("tasksSection");
  const leagueSection = document.getElementById("leagueSection");
  const accountSection = document.getElementById("accountSection");
  const skillsSection = document.getElementById("skillsSection");
  
  const dailyRewardBtn = document.getElementById("dailyRewardBtn");
  const spinBtn = document.getElementById("spinBtn");

  const accountUserId = document.getElementById("accountUserId");
  const accountCoins = document.getElementById("accountCoins");
  const accountReferrals = document.getElementById("accountReferrals");
  const accountRefLink = document.getElementById("accountRefLink");
  const copyRefBtn = document.getElementById("copyRefBtn");

  /* ================= LOAD USER ================= */

  async function loadUser() {
    const res = await fetch("/load", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    telegramId: telegramId,
    initData: initData
  })
});
    
    const data = await res.json();

    coinsEl.innerText = Math.floor(data.coins);
    const leagueText = document.getElementById("currentLeagueText");
if(leagueText) leagueText.innerText = data.league;
    
    updateLeagueProgress(data.coins);
    energyEl.innerText = data.energy;
    profitEl.innerText = data.profitPerHour;

    if (accountUserId) accountUserId.innerText = telegramId;
    if (accountCoins) accountCoins.innerText = Math.floor(data.coins);
    if (accountReferrals) accountReferrals.innerText = data.referrals || 0;

    if (accountRefLink) {
      accountRefLink.value = `https://t.me/PupByteTapBot?start=${telegramId}`;
    }

    if (upgradeTapBtn)
      upgradeTapBtn.innerText = `Upgrade Tap (${data.nextTapCost})`;

    if (upgradeProfitBtn)
      upgradeProfitBtn.innerText = `Upgrade Profit (${data.nextProfitCost})`;
    loadDailyCombo();
    
  }
  loadUser();
  
/* ================= LEAGUE PROGRESS ================= */
  
  function updateLeagueProgress(coins) {

  const LEAGUES = [
  { name: "Wood", min: 0, max: 1000 },
  { name: "Bronze", min: 1000, max: 5000 },
  { name: "Silver", min: 5000, max: 15000 },
  { name: "Gold", min: 15000, max: 50000 },
  { name: "Platinum", min: 50000, max: 100000 },
  { name: "Diamond", min: 100000, max: 250000 },
  { name: "Master", min: 250000, max: 500000 },
  { name: "Elite", min: 500000, max: 1000000 },
  { name: "Champion", min: 1000000, max: 2500000 },
  { name: "Legend", min: 2500000, max: 5000000 },
  { name: "Grandmaster", min: 5000000, max: 10000000 },
  { name: "Immortal", min: 10000000, max: Infinity }
  ];

  const leagueNameEl = document.getElementById("leagueName");
  const progressEl = document.getElementById("leagueProgress");

  let currentLeague;

  for (let league of LEAGUES) {
    if (coins >= league.min && coins < league.max) {
      currentLeague = league;
      break;
    }
  }

  if (!currentLeague) return;
leagueNameEl.innerText = currentLeague.name + " League";

  if (currentLeague.max === Infinity) {
    progressEl.style.width = "100%";
    return;
  }

  const progress =
    ((coins - currentLeague.min) /
      (currentLeague.max - currentLeague.min)) * 100;

  progressEl.style.width = progress + "%";
    
  }

  /* ================= TAP (FIXED) ================= */

  let tapping = false;

tapBtn.addEventListener("click", async () => {

  if (tapping) return;
  tapping = true;

  tapBtn.style.transform = "scale(0.9)";
  setTimeout(() => tapBtn.style.transform = "scale(1)", 100);

  try {

    const res = await fetch("/tap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        telegramId: telegramId,
        initData: initData
      })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins);
      energyEl.innerText = data.energy;
      profitEl.innerText = data.profitPerHour;
      showPlusOne(data.tapPower);
    } else {
  alert(data.message || "Tap failed");
    }

  } catch (e) {
    console.log("Tap error", e);
  }

  setTimeout(() => tapping = false, 120);
});
 
  
/* ===== SOCIAL MISSIONS ===== */
  
  window.openMission = function(){

document.getElementById("tasksSection").style.display="none";
document.getElementById("missionPage").style.display="block";

}

window.closeMission = function(){

document.getElementById("missionPage").style.display="none";
document.getElementById("tasksSection").style.display="block";

}

window.openLink = function(url){

window.open(url,"_blank");

}

  /* ================= TAP UPGRADE ================= */

  if (upgradeTapBtn) {
    upgradeTapBtn.onclick = async () => {

      const res = await fetch("/upgrade-tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) loadUser();
      else alert("Not enough coins");
    };
  }
  
/* ================= DAILY COMBO CARD ================= */
  
  async function loadDailyCombo() {
  const res = await fetch("/daily-combo");
  const data = await res.json();

  if (!container) return;

  data.combo.forEach(card => {
    container.innerHTML += `
      <div class="combo-card">?</div>
    `;
  });
  }

  async function claimCombo() {
  const res = await fetch("/claim-combo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId,
      initData
    })
  });

  const data = await res.json();

  if (data.success) {
    alert("You got " + data.reward + " coins!");
    loadUser();
  } else {
    alert(data.message);
  }
  }
  
  /* ================= PROFIT UPGRADE ================= */

  if (upgradeProfitBtn) {
    upgradeProfitBtn.onclick = async () => {

      const res = await fetch("/upgrade-profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) loadUser();
      else alert("Not enough coins");
    };
  }

  /* ================= DAILY REWARD ================= */

  if (dailyRewardBtn) {
    dailyRewardBtn.onclick = async () => {

      const res = await fetch("/daily-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        alert("You received " + data.reward + " coins!");
        loadUser();
      } else {
        alert("Already claimed today");
      }
    };
  }
  
/* ================= SPIN ================= */
  
const wheel = document.getElementById("wheel");
const wheelWrapper = document.getElementById("wheelWrapper");

if (spinBtn) {
  spinBtn.onclick = async () => {

    const res = await fetch("/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Already spun today!");
      return;
    }

    const rewardsMap = {
      100: 30,
      200: 90,
      300: 150,
      500: 210,
      800: 270,
      1000: 330
    };

    const reward = data.reward;

    // SAFETY CHECK
    if (wheel && wheelWrapper) {

      wheelWrapper.style.display = "flex";

      const baseDeg = rewardsMap[reward];
      const spinRounds = 5 * 360;
      const finalDeg = spinRounds + (360 - baseDeg);

      wheel.style.transform = `rotate(${finalDeg}deg)`;

      setTimeout(() => {
        alert("🎉 You won " + reward + " coins!");
        loadUser();
      }, 4000);

    } else {
      // Fallback if wheel missing
      alert("🎉 You won " + reward + " coins!");
      loadUser();
    }
  };
}
  
  /* ================= OPEN BOOST ================= */

const openBoostBtn = document.getElementById("openBoost");
const backBtn = document.getElementById("backBtn");

if (openBoostBtn) {
  openBoostBtn.onclick = () => {
    earnSection.style.display = "none";
    boostSection.style.display = "block";
  };
}

if (backBtn) {
  backBtn.onclick = () => {
    boostSection.style.display = "none";
    earnSection.style.display = "block";
  };
}
  
  /* ================= REFERRAL ================= */

  const inviteBtn = document.getElementById("inviteBtn");

  if (inviteBtn) {
    inviteBtn.onclick = () => {
      const link = `https://t.me/PupByteTapBot?start=${telegramId}`;
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(link)}`
      );
    };
  }

  if (copyRefBtn) {
    copyRefBtn.onclick = () => {
      navigator.clipboard.writeText(accountRefLink.value);
      alert("Referral link copied!");
    };
  }

  /* ================= TASK TABS ================= */

const specialBtn = document.getElementById("specialBtn");
const leagueBtn = document.getElementById("leagueBtn");
const referBtn = document.getElementById("referBtn");

const specialTab = document.getElementById("specialTab");
const leagueTab = document.getElementById("leagueTab");
const referTab = document.getElementById("referTab");

if (specialBtn) {
  specialBtn.onclick = () => {
    specialTab.style.display = "block";
    leagueTab.style.display = "none";
    referTab.style.display = "none";
  };
}

if (leagueBtn) {
  leagueBtn.onclick = () => {
    specialTab.style.display = "none";
    leagueTab.style.display = "block";
    referTab.style.display = "none";
  };
}

if (referBtn) {
  referBtn.onclick = () => {
    specialTab.style.display = "none";
    leagueTab.style.display = "none";
    referTab.style.display = "block";
  };
}

  /* ================= LEAGUE OPEN ================= */

const openLeague = document.getElementById("openLeague");

if (openLeague) {
  openLeague.onclick = async () => {

    earnSection.style.display = "none";
    leagueSection.style.display = "block";

    await loadUser();

    const currentName =
      document.getElementById("leagueName")
      .innerText.replace(" League","");

    currentLeagueIndex =
      leagueData.findIndex(l => l.name === currentName);

    if(currentLeagueIndex < 0)
      currentLeagueIndex = 0;

    loadLeagueByIndex(currentLeagueIndex);

    loadGlobalTop();
    loadMyRank();
  };
}

  /* ================= LEAGUE SLIDER SYSTEM ================= */

const leagueData = [
  { name: "Wood", img: "images/wood.png" },
  { name: "Bronze", img: "images/bronze.png" },
  { name: "Silver", img: "images/silver.png" },
  { name: "Gold", img: "images/golden.png" },
  { name: "Platinum", img: "images/platinum.png" },
  { name: "Diamond", img: "images/diamond.png" },
  { name: "Master", img: "images/master.png" },
  { name: "Grandmaster", img: "images/grandmaster.png" },
  { name: "Elite", img: "images/elite.png" },
  { name: "Legendary", img: "images/legendary.png" },
  { name: "Mythic", img: "images/mythic.png" }
];

let currentLeagueIndex = 0;

function loadLeagueByIndex(index){

  const league = leagueData[index];

  const img = document.getElementById("leagueImage");

  img.style.opacity = 0;

  setTimeout(()=>{
    img.src = league.img;
    img.style.opacity = 1;
  },200);

  document.getElementById("leagueName").innerText =
    league.name + " League";

  loadLeagueTop(league.name);
}

const prevBtn = document.getElementById("prevLeague");
const nextBtn = document.getElementById("nextLeague");

if(prevBtn){
  prevBtn.onclick = ()=>{
    if(currentLeagueIndex > 0){
      currentLeagueIndex--;
      loadLeagueByIndex(currentLeagueIndex);
    }
  }
}

if(nextBtn){
  nextBtn.onclick = ()=>{
    if(currentLeagueIndex < leagueData.length -1){
      currentLeagueIndex++;
      loadLeagueByIndex(currentLeagueIndex);
    }
  }
}
 
/* ================= NAVIGATION SHOW ================= */
 
function hideAllSections() {
  document.getElementById("earnSection").style.display = "none";
  document.getElementById("mineSection").style.display = "none";
  document.getElementById("tasksSection").style.display = "none";
  document.getElementById("accountSection").style.display = "none";
  document.getElementById("skillsSection").style.display = "none";
  document.getElementById("cashierSection").style.display = "none";
}

document.getElementById("navEarn").onclick = () => {
  hideAllSections();
  document.getElementById("earnSection").style.display = "block";
};

document.getElementById("navMine").onclick = () => {
  hideAllSections();
  document.getElementById("mineSection").style.display = "block";
};

document.getElementById("navTasks").onclick = () => {
  hideAllSections();
  document.getElementById("tasksSection").style.display = "block";
};

document.getElementById("navAccount").onclick = () => {
  hideAllSections();
  document.getElementById("accountSection").style.display = "block";
  loadAccount();
};

document.getElementById("navSkills").onclick = () => {
  hideAllSections();
  document.getElementById("skillsSection").style.display = "block";
};

document.getElementById("navCashier").onclick = () => {
  hideAllSections();
  document.getElementById("cashierSection").style.display = "block";
};

/* ================= LEAGUE OPEN ================= */
 
 document.getElementById("openLeague").onclick = async () => {

  document.getElementById("leagueSection").style.display = "block";
  document.getElementById("earnSection").style.display = "none";

  const res = await fetch("/league/" + telegramId);
  const data = await res.json();

  document.getElementById("leagueName").innerText = data.league;

  const top = await fetch("/top-league/" + data.league);
  const players = await top.json();

  const box = document.getElementById("leagueTop");
  box.innerHTML = "";

  players.forEach((p, i) => {
    box.innerHTML += `<div>#${i+1} - ${p.telegramId} - ${p.coins}</div>`;
  });

  const rankRes = await fetch("/rank/" + telegramId);
  const rankData = await rankRes.json();

  document.getElementById("myRank").innerHTML =
    `Rank: #${rankData.rank} | Coins: ${rankData.coins}`;
};

/* ================= ACCOUNT SHOW ================= */
 
async function loadAccount() {

  const res = await fetch("/rank/" + telegramId);
  const data = await res.json();

  document.getElementById("accountUserId").innerText = telegramId;
  document.getElementById("accountCoins").innerText = data.coins;

  // referrals load (optional)
  document.getElementById("accountReferrals").innerText = "0";

  // airdrop logic
  let eligible = "Not Eligible";
  if (data.coins >= 5000) eligible = "Eligible";

  const el = document.createElement("p");
  el.innerHTML = `<strong>Airdrop:</strong> ${eligible}`;
  
  document.querySelector(".account-card").appendChild(el);
}
 
/* ================= SHILLS SHOW  ================= */
 
 document.getElementById("navSkills").onclick = () => {
  hideAllSections();
  document.getElementById("skillsSection").style.display = "block";
  document.getElementById("skillsSection").innerHTML =
    "<h2 style='text-align:center'>🚧 Coming Soon</h2>";
};

document.getElementById("navCashier").onclick = () => {
  hideAllSections();
  document.getElementById("cashierSection").style.display = "block";
  document.getElementById("cashierSection").innerHTML =
    "<h2 style='text-align:center'>💰 Coming Soon</h2>";
};
 
  /* ================= GLOBAL TOP ================= */

async function loadGlobalTop() {

  const res = await fetch("/top-global");
  const users = await res.json();

  const el = document.getElementById("globalTop");
  el.innerHTML = "";

  users.forEach((u, i) => {

    const row = document.createElement("div");
    row.className = "user-row";

    row.innerHTML = `
      <span>#${i + 1}</span>
      <span>${u.telegramId}</span>
      <span>${Math.floor(u.coins)}</span>
    `;

    el.appendChild(row);
  });
}


/* ================= LEAGUE TOP ================= */

async function loadLeagueTop(league) {

  const res = await fetch(`/top-league/${league}`);
  const users = await res.json();

  const el = document.getElementById("leagueTop");
  el.innerHTML = "";

  users.forEach((u, i) => {

    const row = document.createElement("div");
    row.className = "user-row";

    row.innerHTML = `
      <span>#${i + 1}</span>
      <span>${u.telegramId}</span>
      <span>${Math.floor(u.coins)}</span>
    `;

    el.appendChild(row);
  });
}


/* ================= MY RANK ================= */

async function loadMyRank() {

  const res = await fetch(`/rank/${telegramId}`);
  const data = await res.json();

  const el = document.getElementById("myRank");

  el.innerHTML = `
    <div class="user-row" style="background:#00f7ff22;">
      <span>#${data.rank || "-"}</span>
      <span>You</span>
      <span>${Math.floor(data.coins)}</span>
    </div>
  `;
}
  
  /* ================= +1 Animation ================= */

  function showPlusOne(amount) {
    const plus = document.createElement("div");
    plus.className = "plus-one";
    plus.innerText = "+" + amount;
    document.querySelector(".coin-wrapper").appendChild(plus);
    setTimeout(() => plus.remove(), 800);
  }

  /* ================= VERIFY TASK ================= */

  window.verifyTask = async function(){

const res = await fetch("/complete-task",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
telegramId: telegramId,
initData: initData,
taskId: "telegram_join"
})
});

const data = await res.json();

if(data.success){

alert("Task completed +" + data.reward + " coins");

loadUser();

}else{

alert(data.message);

}

  }
  
/* ================= COMPLETE TASK ================= */

  async function completeTask(taskId) {

  const res = await fetch("/complete-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId,
      initData,
      taskId: taskId
    })
  });

  const data = await res.json();

  if (data.success) {
    alert("You received " + data.reward + " coins!");
    loadUser();
  } else {
    alert(data.message || "Task already completed");
  }
}


  /* ================= CLAIM LEAGUE REWARD ================= */

  async function claimLeagueReward() {

    const res = await fetch("/claim-league", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      alert("League reward claimed! +" + data.reward);
      loadUser();
    } else {
      alert("Reward already claimed or not eligible");
    }
  }

  const closeLeagueBtn =
  document.getElementById("closeLeagueBtn");

if(closeLeagueBtn){
  closeLeagueBtn.onclick = ()=>{
    leagueSection.style.display = "none";
    earnSection.style.display = "block";
  }
}

  });
