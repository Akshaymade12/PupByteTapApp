document.addEventListener("DOMContentLoaded", async () => {

const tg = window.Telegram.WebApp;
tg.expand();

const telegramId = tg.initDataUnsafe.user.id.toString();
const initData = tg.initData;

/* ELEMENTS */

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

/* LOAD USER */

async function loadUser(){

const res = await fetch("/load/" + telegramId);
const data = await res.json();

coinsEl.innerText = data.coins;
energyEl.innerText = data.energy;
profitEl.innerText = data.profitPerHour;

/* CARDS */

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

/* TAP */

if(tapBtn){

tapBtn.onclick = async () => {

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

};

}

/* PLUS ANIMATION */

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

/* NAVIGATION */

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

/* CARD UPGRADE */

window.upgradeCard = async function(type){

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

coinsEl.innerText = data.coins;

document.getElementById(type+"Level")
.innerText = data.level + "/20";

document.getElementById(type+"Profit")
.innerText = data.profit;

document.getElementById(type+"Cost")
.innerText = data.cost;

profitEl.innerText = data.totalProfit;

}else{

alert(data.message);

}

};

/* DAILY SPIN */

const spinBtn = document.getElementById("spinBtn");

if(spinBtn){

spinBtn.onclick = async ()=>{

const res = await fetch("/spin",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({
telegramId,
initData
})
});

const data = await res.json();

if(data.success){

alert("You won " + data.reward + " coins");

await loadUser();

}else{

alert(data.message);

}

};

}

  window.verifyTask = async function(){

const res = await fetch("/complete-task",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
telegramId: telegramId,
initData: initData,
taskId: "telegram_join"
})
});

const data = await res.json();

if(data.success){

alert("Task completed +" + data.reward + " coins");

await loadUser();

}else{

alert(data.message);

}
  };
 
  
/* DAILY REWARD */

const dailyBtn = document.getElementById("dailyRewardBtn");

if(dailyBtn){

dailyBtn.onclick = async ()=>{

const res = await fetch("/daily-reward",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({
telegramId,
initData
})
});

const data = await res.json();

if(data.success){

alert("Reward +"+data.reward);

await loadUser();

}else{

alert(data.message);

}

};

}

  /* ================= SOCIAL MISSIONS ================= */

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
  }
  
});
