/* ================================
PUPBYTE TAP BOT
MAIN SCRIPT
=============================== */

document.addEventListener("DOMContentLoaded", async () => {

const tg = window.Telegram?.WebApp;

if(!tg){
alert("Open inside Telegram");
return;
}

tg.expand();

/* ================================
TELEGRAM USER
================================ */

const telegramUser = tg.initDataUnsafe?.user;

if(!telegramUser){
alert("Telegram user not found");
return;
}

const telegramId = telegramUser.id.toString();
const username = telegramUser.username || telegramUser.first_name || "Player";

const initData = tg.initData;

/* ================================
GLOBAL GAME STATE
================================ */

let GAME = {

coins:0,
energy:0,
profit:0,

tapPower:1,
tapLevel:1,

gpuLevel:1,
marketingLevel:1,

league:"Wood"

};

/* ================================
GLOBAL HELPERS
================================ */

function qs(id){
return document.getElementById(id);
}

function notify(msg){
alert(msg);
}

/* ================================
START LOADING USER
================================ */

await loadUser();
initNavigation();
initTap();
initCards();
initBoost();
initSpin();
initDailyReward();
initMission();
initReferral();

loadGlobalTop();
loadLeagueTop(GAME.league);
loadMyRank();
  
});

/* ================================
DOM ELEMENTS
================================ */

const coinsEl = qs("coins");
const energyEl = qs("energy");
const profitEl = qs("profit");

/* TAP */

const tapBtn = qs("tapBtn");

/* NAVIGATION */

const navEarn = qs("navEarn");
const navMine = qs("navMine");
const navTasks = qs("navTasks");
const navAccount = qs("navAccount");
const navSkills = qs("navSkills");
const navCashier = qs("navCashier");

/* SECTIONS */

const earnSection = qs("earnSection");
const mineSection = qs("mineSection");
const tasksSection = qs("tasksSection");
const accountSection = qs("accountSection");
const skillsSection = qs("skillsSection");
const cashierSection = qs("cashierSection");

/* BOOST */

const openBoostBtn = qs("openBoost");
const boostSection = qs("boostSection");
const backBoostBtn = qs("backBtn");

const upgradeTapBtn = qs("upgradeTapBtn");
const upgradeProfitBtn = qs("upgradeProfitBtn");

/* MINE CARDS */

const gpuLevelEl = qs("gpuLevel");
const gpuProfitEl = qs("gpuProfit");
const gpuCostEl = qs("gpuCost");

const marketingLevelEl = qs("marketingLevel");
const marketingProfitEl = qs("marketingProfit");
const marketingCostEl = qs("marketingCost");

/* MISSIONS */

const missionPage = qs("missionPage");

/* SPIN */

const spinBtn = qs("spinBtn");

/* DAILY REWARD */

const dailyBtn = qs("dailyRewardBtn");

/* ACCOUNT */

const accountUserId = qs("accountUserId");
const accountCoins = qs("accountCoins");
const accountReferrals = qs("accountReferrals");
const refLinkInput = qs("accountRefLink");
const copyRefBtn = qs("copyRefBtn");

/* LEAGUE */

const leagueSection = qs("leagueSection");
const leagueNameEl = qs("leagueName");
const leagueProgressEl = qs("leagueProgress");

/* LEADERBOARD */

const globalTopEl = qs("globalTop");
const leagueTopEl = qs("leagueTop");
const myRankEl = qs("myRank");

/* ================================
NAVIGATION SYSTEM
================================ */

function hideAllSections(){

if(earnSection) earnSection.style.display = "none";
if(mineSection) mineSection.style.display = "none";
if(tasksSection) tasksSection.style.display = "none";
if(accountSection) accountSection.style.display = "none";
if(skillsSection) skillsSection.style.display = "none";
if(cashierSection) cashierSection.style.display = "none";

}

function removeActive(){

document.querySelectorAll(".nav-item").forEach(btn=>{
btn.classList.remove("active");
});

}

function switchSection(section,btn){

hideAllSections();
removeActive();

if(section) section.style.display="block";
if(btn) btn.classList.add("active");

}

/* ================================
INIT NAVIGATION
================================ */

function initNavigation(){

if(navEarn){

navEarn.onclick = ()=>{
switchSection(earnSection,navEarn);
};

}

if(navMine){

navMine.onclick = ()=>{
switchSection(mineSection,navMine);
};

}

if(navTasks){

navTasks.onclick = ()=>{
switchSection(tasksSection,navTasks);
};

}

if(navAccount){

navAccount.onclick = ()=>{
switchSection(accountSection,navAccount);
};

}

if(navSkills){

navSkills.onclick = ()=>{
switchSection(skillsSection,navSkills);
};

}

if(navCashier){

navCashier.onclick = ()=>{
switchSection(cashierSection,navCashier);
};

}

}

/* ================================
LOAD USER DATA
================================ */

async function loadUser(){

try{

const res = await fetch("/load/" + telegramId);

const data = await res.json();

if(!data) return;

/* ================================
UPDATE GAME STATE
================================ */

GAME.coins = data.coins;
GAME.energy = data.energy;
GAME.profit = data.profitPerHour;

GAME.tapLevel = data.tapLevel;
GAME.tapPower = data.tapPower;

GAME.gpuLevel = data.gpuLevel;
GAME.marketingLevel = data.marketingLevel;

GAME.league = data.league;


/* ================================
UPDATE UI
================================ */

if(coinsEl) coinsEl.innerText = Math.floor(data.coins);
  
  updateLeagueProgress(data.coins);
updateAccount(data);
  
if(energyEl) energyEl.innerText = data.energy;

if(profitEl) profitEl.innerText = data.profitPerHour;


/* ================================
MINE CARDS
================================ */

if(gpuLevelEl)
gpuLevelEl.innerText = data.gpuLevel + "/20";

if(gpuProfitEl)
gpuProfitEl.innerText = data.gpuProfit;

if(gpuCostEl)
gpuCostEl.innerText = data.gpuCost;


if(marketingLevelEl)
marketingLevelEl.innerText = data.marketingLevel + "/20";

if(marketingProfitEl)
marketingProfitEl.innerText = data.marketingProfit;

if(marketingCostEl)
marketingCostEl.innerText = data.marketingCost;


/* ================================
ACCOUNT SECTION
================================ */

if(accountUserId)
accountUserId.innerText = telegramId;

if(accountCoins)
accountCoins.innerText = Math.floor(data.coins);

if(accountReferrals)
accountReferrals.innerText = data.referrals || 0;

if(refLinkInput)
refLinkInput.value = "https://t.me/PupByteTapBot?start=" + telegramId;


/* ================================
BOOST COST
================================ */

if(upgradeTapBtn)
upgradeTapBtn.innerText = "Upgrade Tap ("+data.nextTapCost+")";

if(upgradeProfitBtn)
upgradeProfitBtn.innerText = "Upgrade Profit ("+data.nextProfitCost+")";


}catch(err){

console.log("Load user error",err);

}

}

/* ================================
TAP SYSTEM
================================ */

function initTap(){

if(!tapBtn) return;

let tapping = false;

tapBtn.onclick = async ()=>{

if(tapping) return;

tapping = true;

try{

const res = await fetch("/tap",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

telegramId:telegramId,
initData:initData

})

});

const data = await res.json();

if(!data.success){

notify(data.message || "Tap rejected");
tapping = false;
return;

}

/* UPDATE UI */

GAME.coins = data.coins;
GAME.energy = data.energy;
GAME.profit = data.profitPerHour;

if(coinsEl)
coinsEl.innerText = Math.floor(data.coins);

if(energyEl)
energyEl.innerText = data.energy;

if(profitEl)
profitEl.innerText = data.profitPerHour;

/* COIN ANIMATION */

showPlus(data.tapPower);

}catch(err){

console.log("Tap error",err);

}

setTimeout(()=>{

tapping = false;

},120);

};

}


/* ================================
COIN FLOAT ANIMATION
================================ */

function showPlus(amount){

const el = document.createElement("div");

el.className = "plus-one";

el.innerText = "+" + amount;

const wrapper = document.querySelector(".coin-wrapper");

if(wrapper){

wrapper.appendChild(el);

setTimeout(()=>{

el.remove();

},800);

}

}

/* ================================
MINE CARDS SYSTEM
================================ */

function initCards(){

/* GPU CARD */

window.upgradeCard = async function(type){

try{

const res = await fetch("/upgrade-card",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

telegramId:telegramId,
initData:initData,
type:type

})

});

const data = await res.json();

if(!data.success){

notify(data.message || "Upgrade failed");

return;

}

/* UPDATE COINS */

GAME.coins = data.coins;

if(coinsEl)
coinsEl.innerText = Math.floor(data.coins);


/* UPDATE CARD UI */

const levelEl = qs(type+"Level");
const profitEl = qs(type+"Profit");
const costEl = qs(type+"Cost");

if(levelEl)
levelEl.innerText = data.level + "/20";

if(profitEl)
profitEl.innerText = data.profit;

if(costEl)
costEl.innerText = data.cost;


/* UPDATE TOTAL PROFIT */

GAME.profit = data.totalProfit;

if(profitEl)
profitEl.innerText = data.totalProfit;


}catch(err){

console.log("Card upgrade error",err);

}

};

}


/* ================================
BOOST SYSTEM
================================ */

function initBoost(){

/* OPEN BOOST */

if(openBoostBtn){

openBoostBtn.onclick = ()=>{

if(earnSection) earnSection.style.display="none";

if(boostSection) boostSection.style.display="block";

};

}

/* BACK BUTTON */

if(backBoostBtn){

backBoostBtn.onclick = ()=>{

if(boostSection) boostSection.style.display="none";

if(earnSection) earnSection.style.display="block";

};

}


/* ================================
UPGRADE TAP
================================ */

if(upgradeTapBtn){

upgradeTapBtn.onclick = async ()=>{

try{

const res = await fetch("/upgrade-tap",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

telegramId:telegramId,
initData:initData

})

});

const data = await res.json();

if(!data.success){

notify("Not enough coins");

return;

}

await loadUser();

}catch(err){

console.log("Tap upgrade error",err);

}

};

}


/* ================================
UPGRADE PROFIT
================================ */

if(upgradeProfitBtn){

upgradeProfitBtn.onclick = async ()=>{

try{

const res = await fetch("/upgrade-profit",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

telegramId:telegramId,
initData:initData

})

});

const data = await res.json();

if(!data.success){

notify("Not enough coins");

return;

}

await loadUser();

}catch(err){

console.log("Profit upgrade error",err);

}

};

}

}

/* ================================
SOCIAL MISSIONS
================================ */

function initMission(){

/* OPEN MISSION PAGE */

window.openMission = function(){

if(tasksSection) tasksSection.style.display = "none";

if(missionPage) missionPage.style.display = "block";

};

/* CLOSE MISSION */

window.closeMission = function(){

if(missionPage) missionPage.style.display = "none";

if(tasksSection) tasksSection.style.display = "block";

};

/* OPEN SOCIAL LINK */

window.openLink = function(url){

window.open(url,"_blank");

};

/* VERIFY TASK */

window.verifyTask = async function(){

try{

const res = await fetch("/complete-task",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

telegramId:telegramId,
initData:initData,
taskId:"telegram_join"

})

});

const data = await res.json();

if(!data.success){

notify(data.message || "Task not completed");

return;

}

/* REWARD */

notify("Task completed +" + data.reward + " coins");

/* RELOAD USER */

await loadUser();

}catch(err){

console.log("Task verify error",err);

}

};

}

/* ================================
DAILY REWARD SYSTEM
================================ */

function initDailyReward(){

if(!dailyBtn) return;

dailyBtn.onclick = async ()=>{

try{

const res = await fetch("/daily-reward",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

telegramId:telegramId,
initData:initData

})

});

const data = await res.json();

if(!data.success){

notify(data.message || "Already claimed");

return;

}

/* REWARD MESSAGE */

notify("You received " + data.reward + " coins 🎉");

/* RELOAD USER */

await loadUser();

}catch(err){

console.log("Daily reward error",err);

}

};

}

/* ================================
SPIN WHEEL SYSTEM
================================ */

function initSpin(){

if(!spinBtn) return;

const wheel = qs("wheel");
const wheelWrapper = qs("wheelWrapper");

spinBtn.onclick = async ()=>{

try{

const res = await fetch("/spin",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

telegramId:telegramId,
initData:initData

})

});

const data = await res.json();

if(!data.success){

notify(data.message || "Spin not available");

return;

}

/* REWARD */

const reward = data.reward;

/* WHEEL ANIMATION */

if(wheel && wheelWrapper){

wheelWrapper.style.display = "flex";

const rewardsMap = {

100:30,
200:90,
300:150,
500:210,
800:270,
1000:330

};

const baseDeg = rewardsMap[reward] || 30;

const spinRounds = 5 * 360;

const finalDeg = spinRounds + (360 - baseDeg);

wheel.style.transform = `rotate(${finalDeg}deg)`;

/* SHOW RESULT */

setTimeout(()=>{

notify("🎉 You won " + reward + " coins!");

loadUser();

},4000);

}else{

notify("🎉 You won " + reward + " coins!");

loadUser();

}

}catch(err){

console.log("Spin error",err);

}

};

}

/* ================================
REFERRAL SYSTEM
================================ */

function initReferral(){

/* COPY REFERRAL LINK */

if(copyRefBtn){

copyRefBtn.onclick = ()=>{

if(!refLinkInput) return;

navigator.clipboard.writeText(refLinkInput.value);

notify("Referral link copied ✅");

};

}


/* INVITE FRIEND */

const inviteBtn = qs("inviteBtn");

if(inviteBtn){

inviteBtn.onclick = ()=>{

const link = "https://t.me/PupByteTapBot?start=" + telegramId;

const shareUrl =
"https://t.me/share/url?url=" + encodeURIComponent(link);

window.open(shareUrl,"_blank");

};

}

}

/* ================================
LEAGUE SYSTEM
================================ */

function updateLeagueProgress(coins){

const leagues = [

{ name:"Wood", min:0, max:10000 },
{ name:"Bronze", min:10000, max:30000 },
{ name:"Silver", min:30000, max:70000 },
{ name:"Golden", min:70000, max:150000 },
{ name:"Platinum", min:150000, max:300000 },
{ name:"Diamond", min:300000, max:600000 },
{ name:"Master", min:600000, max:1200000 },
{ name:"Grandmaster", min:1200000, max:2500000 },
{ name:"Elite", min:2500000, max:5000000 },
{ name:"Legendary", min:5000000, max:10000000 },
{ name:"Mythic", min:10000000, max:Infinity }

];

let currentLeague = null;

for(const league of leagues){

if(coins >= league.min && coins < league.max){

currentLeague = league;
break;

}

}

if(!currentLeague) return;


/* UPDATE NAME */

if(leagueNameEl)

leagueNameEl.innerText = currentLeague.name + " League";


/* UPDATE PROGRESS */

if(!leagueProgressEl) return;

if(currentLeague.max === Infinity){

leagueProgressEl.style.width = "100%";

return;

}

const progress =

((coins - currentLeague.min) /
(currentLeague.max - currentLeague.min)) * 100;

leagueProgressEl.style.width = progress + "%";

}

/* ================================
LEADERBOARD SYSTEM
================================ */


/* GLOBAL TOP */

async function loadGlobalTop(){

try{

const res = await fetch("/top-global");

const users = await res.json();

if(!globalTopEl) return;

globalTopEl.innerHTML = "";

users.forEach((u,i)=>{

const row = document.createElement("div");

row.className = "user-row";

row.innerHTML = `
<span>#${i+1}</span>
<span>${u.telegramId}</span>
<span>${Math.floor(u.coins)}</span>
`;

globalTopEl.appendChild(row);

});

}catch(err){

console.log("Global top error",err);

}

}


/* LEAGUE TOP */

async function loadLeagueTop(league){

try{

const res = await fetch("/top-league/" + league);

const users = await res.json();

if(!leagueTopEl) return;

leagueTopEl.innerHTML = "";

users.forEach((u,i)=>{

const row = document.createElement("div");

row.className = "user-row";

row.innerHTML = `
<span>#${i+1}</span>
<span>${u.telegramId}</span>
<span>${Math.floor(u.coins)}</span>
`;

leagueTopEl.appendChild(row);

});

}catch(err){

console.log("League top error",err);

}

}


/* MY RANK */

async function loadMyRank(){

try{

const res = await fetch("/rank/" + telegramId);

const data = await res.json();

if(!myRankEl) return;

myRankEl.innerHTML = `
<div class="user-row my-rank">
<span>#${data.rank}</span>
<span>You</span>
<span>${Math.floor(data.coins)}</span>
</div>
`;

}catch(err){

console.log("Rank error",err);

}

}

/* ================================
ACCOUNT SYSTEM
================================ */

function updateAccount(data){

/* USER ID */

if(accountUserId){

accountUserId.innerText = telegramId;

}

/* USERNAME */

const usernameEl = qs("accountUsername");

if(usernameEl){

usernameEl.innerText = username;

}

/* COINS */

if(accountCoins){

accountCoins.innerText = Math.floor(data.coins);

}

/* REFERRALS */

if(accountReferrals){

accountReferrals.innerText = data.referrals || 0;

}

/* REFERRAL LINK */

if(refLinkInput){

refLinkInput.value =
"https://t.me/PupByteTapBot?start=" + telegramId;

}

}

/* =================================
FINAL SECURITY + UTILITIES
================================= */


/* SAFE FETCH WRAPPER */

async function safeFetch(url, options){

try{

const res = await fetch(url, options);

if(!res.ok){
throw new Error("Network error");
}

return await res.json();

}catch(err){

console.log("Fetch error:",err);

notify("Network error");

return { success:false };

}

}


/* =================================
ANTI DOUBLE CLICK PROTECTION
================================= */

let clickLock = false;

function lockClick(ms=250){

clickLock = true;

setTimeout(()=>{

clickLock = false;

},ms);

}


/* =================================
AUTO MINING UPDATE
================================= */

function startAutoMining(){

setInterval(()=>{

if(!GAME) return;

const profit = GAME.profit || 0;

const perSecond = profit / 3600;

GAME.coins += perSecond;

if(coinsEl)
coinsEl.innerText = Math.floor(GAME.coins);

},1000);

}


/* =================================
FORMAT NUMBERS
================================= */

function formatNumber(num){

return num.toLocaleString();

}


/* =================================
POPUP MESSAGE SYSTEM
================================= */

function notify(msg){

if(!msg) return;

alert(msg);

}


/* =================================
START AUTO SYSTEMS
================================= */

startAutoMining();


/* =================================
GLOBAL ERROR HANDLER
================================= */

window.onerror = function(msg,src,line){

console.log("JS ERROR:",msg,"line:",line);

};
