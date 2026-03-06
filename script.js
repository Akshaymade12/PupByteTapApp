document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram?.WebApp;
  const initData = tg.initData;

  if (!tg) {
    alert("Please open inside Telegram");
    return;
  }

  tg.expand();

  const telegramId = tg.initDataUnsafe?.user?.id;
  const startParam = tg.initDataUnsafe?.start_param;

  if (!telegramId) {
    alert("Telegram ID not found");
    return;
  }

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
    const res = await fetch(`/load/${telegramId}`);
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
  }

  loadUser();
  
/* ================= LEAGUE PROGRESS ================= */
  
  function updateLeagueProgress(coins) {

  const leagues = [
    { name: "Wood", min: 0, max: 10000 },
    { name: "Bronze", min: 10000, max: 30000 },
    { name: "Silver", min: 30000, max: 70000 },
    { name: "Golden", min: 70000, max: 150000 },
    { name: "Platinum", min: 150000, max: 300000 },
    { name: "Diamond", min: 300000, max: 600000 },
    { name: "Master", min: 600000, max: 1200000 },
    { name: "Grandmaster", min: 1200000, max: 2500000 },
    { name: "Elite", min: 2500000, max: 5000000 },
    { name: "Legendary", min: 5000000, max: 10000000 },
    { name: "Mythic", min: 10000000, max: Infinity }
  ];

  const leagueNameEl = document.getElementById("leagueName");
  const progressEl = document.getElementById("leagueProgress");

  let currentLeague;

  for (let league of leagues) {
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
                          
  /* ================= TAP ================= */

if (tapBtn) {

let tapping = false;

tapBtn.onclick = async () => {

if(tapping) return;
tapping = true;

try{

const res = await fetch("/tap",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({
telegramId: telegramId,
initData: initData
})
});

const data = await res.json();

if(data.success){

coinsEl.innerText = Math.floor(data.coins);
energyEl.innerText = data.energy;
profitEl.innerText = data.profitPerHour;

showPlusOne(data.tapPower);

}else{
console.log(data);
alert(data.message || "Tap rejected");
}
  
}catch(e){

console.log("Tap error",e);

}

setTimeout(()=>{ tapping=false },150);

};

}
  
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
/* =========== UPGRADE CARD ============= */
  
  function upgradeCard(type){

let coins = parseInt(localStorage.getItem("coins")) || 0;

let level = parseInt(localStorage.getItem(type+"Level")) || 1;
let cost = parseInt(localStorage.getItem(type+"Cost")) || 1000;
let profit = parseInt(localStorage.getItem(type+"Profit")) || 10;

if(coins < cost){
alert("Not enough coins");
return;
}

coins -= cost;
level += 1;
profit += 10;
cost = Math.floor(cost * 1.5);

localStorage.setItem("coins", coins);
localStorage.setItem(type+"Level", level);
localStorage.setItem(type+"Profit", profit);
localStorage.setItem(type+"Cost", cost);

document.getElementById("coins").innerText = coins;
document.getElementById(type+"Level").innerText = level;
document.getElementById(type+"Profit").innerText = profit;
document.getElementById(type+"Cost").innerText = cost;

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
  { name: "Golden", img: "images/golden.png" },
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
  
  
/* ================= NAVIGATION ================= */

 const navEarn = document.getElementById("navEarn");
const navMine = document.getElementById("navMine");
const navTasks = document.getElementById("navTasks");
const navAccount = document.getElementById("navAccount");
const navSkills = document.getElementById("navSkills");
const navCashier = document.getElementById("navCashier");

const sections = document.querySelectorAll(
"#earnSection,#mineSection,#tasksSection,#accountSection,#skillsSection,#cashierSection"
);

function switchSection(sectionId, navBtn){

sections.forEach(sec => sec.style.display="none");

document.getElementById(sectionId).style.display="block";

document.querySelectorAll(".nav-item")
.forEach(btn=>btn.classList.remove("active"));

navBtn.classList.add("active");

}

navEarn.onclick = ()=>switchSection("earnSection",navEarn);
navMine.onclick = ()=>switchSection("mineSection",navMine);
navTasks.onclick = ()=>switchSection("tasksSection",navTasks);
navAccount.onclick = ()=>switchSection("accountSection",navAccount);
navSkills.onclick = ()=>switchSection("skillsSection",navSkills);
navCashier.onclick = ()=>switchSection("cashierSection",navCashier);
  
  
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
      <span>#${data.rank}</span>
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
      body: JSON.stringify({ telegramId, initData })
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
  
/* ========== LOAD CARD =========== */
  
  function loadCard(type){

let level = parseInt(localStorage.getItem(type+"Level")) || 1;
let profit = parseInt(localStorage.getItem(type+"Profit")) || 10;
let cost = parseInt(localStorage.getItem(type+"Cost")) || 1000;

document.getElementById(type+"Level").innerText = level + "/20";
document.getElementById(type+"Profit").innerText = profit;
document.getElementById(type+"Cost").innerText = cost;

}

  }
  
/* ================= MINE CARDS ================= */

function upgradeCard(type){

let coins = parseInt(localStorage.getItem("coins")) || 0;

let level = parseInt(localStorage.getItem(type+"Level")) || 1;
let profit = parseInt(localStorage.getItem(type+"Profit")) || 10;
let cost = parseInt(localStorage.getItem(type+"Cost")) || 1000;

if(coins < cost){
alert("Not enough coins");
return;
}

coins -= cost;
level += 1;
profit += 10;
cost = Math.floor(cost * 1.6);

localStorage.setItem("coins", coins);
localStorage.setItem(type+"Level", level);
localStorage.setItem(type+"Profit", profit);
localStorage.setItem(type+"Cost", cost);

document.getElementById("coins").innerText = coins;

loadCard(type);

}

window.onload = function(){

let coins = localStorage.getItem("coins") || 3067;

document.getElementById("coins").innerText = coins;

loadCard("gpu");
loadCard("marketing");

}
