document.addEventListener("DOMContentLoaded", async () => {

const tg = window.Telegram.WebApp;

if(!tg){
alert("Open inside Telegram");
return;
}

tg.expand();

const telegramId = tg.initDataUnsafe.user.id.toString();
const initData = tg.initData;

/* ===================== ELEMENTS ========================= */

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const profitEl = document.getElementById("profit");

const tapBtn = document.getElementById("tapBtn");

const navEarn = document.getElementById("navEarn");
const navMine = document.getElementById("navMine");
const navTasks = document.getElementById("navTasks");
const navAccount = document.getElementById("navAccount");
const navSkills = document.getElementById("navSkills");
const navCashier = document.getElementById("navCashier");

const earnSection = document.getElementById("earnSection");
const mineSection = document.getElementById("mineSection");
const tasksSection = document.getElementById("tasksSection");
const accountSection = document.getElementById("accountSection");
const skillsSection = document.getElementById("skillsSection");
const cashierSection = document.getElementById("cashierSection");

/* ======================= LOAD USER ========================== */

async function loadUser(){

const res = await fetch("/load/" + telegramId);
const data = await res.json();

coinsEl.innerText = Math.floor(data.coins);
energyEl.innerText = data.energy;
profitEl.innerText = data.profitPerHour;

/* =================== CARDS ======================= */

document.getElementById("gpuLevel").innerText =
data.gpuLevel + "/20";

document.getElementById("gpuProfit").innerText =
data.gpuProfit;

document.getElementById("gpuCost").innerText =
data.gpuCost;

document.getElementById("marketingLevel").innerText =
data.marketingLevel + "/20";

document.getElementById("marketingProfit").innerText =
data.marketingProfit;

document.getElementById("marketingCost").innerText =
data.marketingCost;

}

await loadUser();

/* =================== TAP ENGINE ================ */

let tapping = false;

tapBtn.onclick = async () => {

if(tapping) return;

tapping = true;

try{

const res = await fetch("/tap",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({
telegramId,
initData
})
});

const data = await res.json();

if(data.success){

coinsEl.innerText = data.coins;
energyEl.innerText = data.energy;

showPlus(data.tapPower);

}

}catch(e){

console.log("Tap error",e);

}

setTimeout(()=>{ tapping=false },120);

};

/* ================== PLUS ANIMATION ================ */

function showPlus(amount){

const el = document.createElement("div");

el.innerText = "+" + amount;

el.className = "plus-one";

document.querySelector(".coin-wrapper")
.appendChild(el);

setTimeout(()=>{

el.remove();

},800);

}

/* =================== NAVIGATION =============== */

function showSection(section){

earnSection.style.display="none";
mineSection.style.display="none";
tasksSection.style.display="none";
accountSection.style.display="none";
skillsSection.style.display="none";
cashierSection.style.display="none";

section.style.display="block";

}

navEarn.onclick = ()=>showSection(earnSection);
navMine.onclick = ()=>showSection(mineSection);
navTasks.onclick = ()=>showSection(tasksSection);
navAccount.onclick = ()=>showSection(accountSection);
navSkills.onclick = ()=>showSection(skillsSection);
navCashier.onclick = ()=>showSection(cashierSection);

/* ================= CARD UPGRADE ================= */

window.upgradeCard = async function(type){

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const initData = tg.initData;

const res = await fetch("/upgrade-card",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

telegramId,
initData,
type

})

});

const data = await res.json();


if(data.success){

/* UPDATE COINS */

document.getElementById("coins").innerText = data.coins;


/* UPDATE CARD */

document.getElementById(type+"Level").innerText =
data.level + "/20";

document.getElementById(type+"Profit").innerText =
data.profit;

document.getElementById(type+"Cost").innerText =
data.cost;


/* UPDATE TOTAL PROFIT */

document.getElementById("profit").innerText =
data.totalProfit;

}else{

alert(data.message);

}

};

/* ========================== DAILY SPIN =================== */

const spinBtn = document.getElementById("spinBtn");

if(spinBtn){

spinBtn.onclick = async ()=>{

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const initData = tg.initData;

const res = await fetch("/spin",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
telegramId,
initData
})

});

const data = await res.json();

if(data.success){

alert("🎉 You won " + data.reward + " coins!");

document.getElementById("coins").innerText = data.coins;

}else{

alert(data.message);

}

};

}

/* ============================= DAILY REWARD ================= */

const dailyBtn = document.getElementById("dailyRewardBtn");

if(dailyBtn){

dailyBtn.onclick = async ()=>{

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const initData = tg.initData;

const res = await fetch("/daily-reward",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
telegramId,
initData
})

});

const data = await res.json();

if(data.success){

alert("🎁 Daily reward +" + data.reward);

document.getElementById("coins").innerText =
parseInt(document.getElementById("coins").innerText) + data.reward;

}else{

alert(data.message);

}

};

}
  
/* =========================== MISSION ==================== */
  
/* OPEN MISSION PAGE */

window.openMission = function(){

document.getElementById("tasksSection").style.display="none";

document.getElementById("missionPage").style.display="block";

};


/* CLOSE MISSION */

window.closeMission = function(){

document.getElementById("missionPage").style.display="none";

document.getElementById("tasksSection").style.display="block";

};


/* OPEN SOCIAL LINK */

window.openLink = function(url){

window.open(url,"_blank");

};

/* ============================ TASK VERIFY ==================== */

window.verifyTask = async function(){

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const initData = tg.initData;

const res = await fetch("/complete-task",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

telegramId,
initData,
taskId:"telegram_join"

})

});

const data = await res.json();


if(data.success){

alert("🎉 Task Completed! +" + data.reward + " coins");

document.getElementById("coins").innerText =
parseInt(document.getElementById("coins").innerText) + data.reward;

}else{

alert(data.message);

}

};

  /* ================= ACCOUNT SYSTEM ================= */

const accountUserId = document.getElementById("userId");
const accountCoins = document.getElementById("accountCoins");
const accountReferrals = document.getElementById("referrals");
const accountRefLink = document.getElementById("refLink");


async function loadAccount(){

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const res = await fetch("/load/" + telegramId);

const data = await res.json();


if(accountUserId)
accountUserId.innerText = telegramId;


if(accountCoins)
accountCoins.innerText = Math.floor(data.coins);


if(accountReferrals)
accountReferrals.innerText = data.referrals || 0;


if(accountRefLink){

accountRefLink.value =
"https://t.me/PupByteTapBot?start=" + telegramId;

}

}

loadAccount();



/* ================= COPY REF LINK ================= */

window.copyRef = function(){

const refInput = document.getElementById("refLink");

refInput.select();

document.execCommand("copy");

alert("Referral link copied!");

};

  /* ================= BOOST SYSTEM ================= */

const upgradeTapBtn = document.getElementById("upgradeTapBtn");
const upgradeProfitBtn = document.getElementById("upgradeProfitBtn");


/* TAP UPGRADE */

if(upgradeTapBtn){

upgradeTapBtn.onclick = async ()=>{

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const initData = tg.initData;

const res = await fetch("/upgrade-tap",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
telegramId,
initData
})

});

const data = await res.json();

if(data.success){

alert("🔥 Tap upgraded!");

document.getElementById("coins").innerText = data.coins;

}else{

alert("Not enough coins");

}

};

}


/* PROFIT UPGRADE */

if(upgradeProfitBtn){

upgradeProfitBtn.onclick = async ()=>{

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const initData = tg.initData;

const res = await fetch("/upgrade-profit",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
telegramId,
initData
})

});

const data = await res.json();

if(data.success){

alert("⛏ Profit upgraded!");

document.getElementById("coins").innerText = data.coins;

document.getElementById("profit").innerText = data.profitPerHour;

}else{

alert("Not enough coins");

}

};

}



/* ================= ENERGY BAR UPDATE ================= */

function updateEnergyBar(){

const energy = parseInt(document.getElementById("energy").innerText);

const maxEnergy = 100;

const percent = (energy/maxEnergy)*100;

const bar = document.getElementById("energyFill");

if(bar){

bar.style.width = percent + "%";

}

}

setInterval(updateEnergyBar,1000);



/* ================= AUTO USER REFRESH ================= */

setInterval(async ()=>{

try{

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const res = await fetch("/load/" + telegramId);

const data = await res.json();

document.getElementById("coins").innerText = data.coins;

document.getElementById("energy").innerText = data.energy;

document.getElementById("profit").innerText = data.profitPerHour;

}catch(e){

console.log("Auto refresh error");

}

},15000);

  
/* ================= GLOBAL LEADERBOARD ================= */

async function loadGlobalTop(){

const res = await fetch("/top-global");

const users = await res.json();

const list = document.getElementById("leaderboardList");

if(!list) return;

list.innerHTML = "";

users.forEach((u,i)=>{

const row = document.createElement("div");

row.className="leaderboard-row";

row.innerHTML = `
<span>#${i+1}</span>
<span>${u.telegramId}</span>
<span>${Math.floor(u.coins)}</span>
`;

list.appendChild(row);

});

}



/* ================= LEAGUE LEADERBOARD ================= */

async function loadLeagueTop(){

const tg = window.Telegram.WebApp;

const telegramId = tg.initDataUnsafe.user.id.toString();

const res = await fetch("/rank/"+telegramId);

const data = await res.json();

const list = document.getElementById("leaderboardList");

if(!list) return;

list.innerHTML="";

const row = document.createElement("div");

row.className="leaderboard-row";

row.innerHTML=`
<span>#${data.rank}</span>
<span>You</span>
<span>${Math.floor(data.coins)}</span>
`;

list.appendChild(row);

}

};
