document.addEventListener("DOMContentLoaded", () => {
 
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

 const streakCount = document.getElementById("streakCount");
const claimStreakBtn = document.getElementById("claimStreakBtn");
 
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
  const cashierSection = document.getElementById("cashierSection");
  
  const dailyRewardBtn = document.getElementById("dailyRewardBtn");
  const spinBtn = document.getElementById("spinBtn");

  const accountUserId = document.getElementById("accountUserId");
  const accountUserName = document.getElementById("accountUserName");
  const accountCoins = document.getElementById("accountCoins");
  const accountReferrals = document.getElementById("accountReferrals");
  const accountRefLink = document.getElementById("accountRefLink");
  const copyRefBtn = document.getElementById("copyRefBtn");

  /* ================= LOAD USER ================= */

  async function loadUser() {
    try {
      const res = await fetch("/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: telegramId, initData: initData })
      });
      
      const data = await res.json();

if (!data || data.success === false) {
  console.log("User load failed ❌");
  return;
}
      coinsEl.innerText = Math.floor(data.coins);
      const leagueText = document.getElementById("currentLeagueText");
      if(leagueText) leagueText.innerText = data.league;
      
      updateLeagueProgress(data.coins);
      energyEl.innerText = data.energy;
      profitEl.innerText = data.profitPerHour;

      if (accountUserId) accountUserId.innerText = telegramId;
      if (accountUserName) accountUserName.innerText = user.first_name || "User";
      if (accountCoins) accountCoins.innerText = Math.floor(data.coins);
      if (accountReferrals) accountReferrals.innerText = data.referrals || 0;
     if (streakCount) streakCount.innerText = data.streak || 0;
     if (document.getElementById("totalClaims")) {
  document.getElementById("totalClaims").innerText = data.totalClaims || 0;
     }
     
      if (accountRefLink) {
        accountRefLink.value = `https://t.me/PupByteTapBot?start=${telegramId}`;
      }

      if (upgradeTapBtn)
        upgradeTapBtn.innerText = `Upgrade Tap (${data.nextTapCost})`;

      if (upgradeProfitBtn)
        upgradeProfitBtn.innerText = `Upgrade Profit (${data.nextProfitCost})`;
      
      loadDailyCombo();
    } catch (e) {
      console.log("Load user error", e);
    }
  }
  loadUser();
  
/* ================= LEAGUE PROGRESS ================= */
  
  function updateLeagueProgress(coins) {
    const LEAGUES = [
      { name: "Bronze", min: 0, max: 1000 },
      { name: "Silver", min: 1000, max: 5000 },
      { name: "Gold", min: 5000, max: 15000 },
      { name: "Platinum", min: 15000, max: 50000 },
      { name: "Diamond", min: 50000, max: Infinity }
    ];

    let currentLeague;
    for (let league of LEAGUES) {
      if (coins >= league.min && coins < league.max) {
        currentLeague = league;
        break;
      }
    }

    if (!currentLeague) return;
    
    const leagueText = document.getElementById("currentLeagueText");
    if(leagueText) leagueText.innerText = currentLeague.name;
  }

  /* ================= TAP ================= */

  let tapping = false;

  if (tapBtn) {
    tapBtn.addEventListener("click", async () => {
      if (tapping) return;
      tapping = true;

      tapBtn.style.transform = "scale(0.9)";
      setTimeout(() => tapBtn.style.transform = "scale(1)", 100);

      try {
        const res = await fetch("/tap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId: telegramId, initData: initData })
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
  const container = document.getElementById("combo");
  async function loadDailyCombo() {
    try {
      const res = await fetch("/daily-combo");
      const data = await res.json();
      if (!container) return;
      container.innerHTML = "";
      data.combo.forEach(card => {
        container.innerHTML += `<div class="combo-card">?</div>`;
      });
    } catch (e) {}
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

/* ================= NAVIGATION SHOW ================= */
 
  function hideAllSections() {
    earnSection.style.display = "none";
    document.getElementById("mineSection").style.display = "none";
    tasksSection.style.display = "none";
    accountSection.style.display = "none";
    skillsSection.style.display = "none";
    cashierSection.style.display = "none";
    leagueSection.style.display = "none";
    document.getElementById("missionPage").style.display = "none";
    boostSection.style.display = "none";
    
    // Remove active class from all nav items
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  }

  document.getElementById("navEarn").onclick = () => {
    hideAllSections();
    earnSection.style.display = "block";
    document.getElementById("navEarn").classList.add("active");
  };

  document.getElementById("navMine").onclick = () => {
    hideAllSections();
    document.getElementById("mineSection").style.display = "block";
    document.getElementById("navMine").classList.add("active");
  };

  document.getElementById("navTasks").onclick = () => {
    hideAllSections();
    tasksSection.style.display = "block";
    document.getElementById("navTasks").classList.add("active");
  };

  document.getElementById("navAccount").onclick = () => {
    hideAllSections();
    accountSection.style.display = "block";
    document.getElementById("navAccount").classList.add("active");
    loadAccount();
  };

  document.getElementById("navSkills").onclick = () => {
    hideAllSections();
    skillsSection.style.display = "block";
    document.getElementById("navSkills").classList.add("active");
  };

  document.getElementById("navCashier").onclick = () => {
    hideAllSections();
    cashierSection.style.display = "block";
    document.getElementById("navCashier").classList.add("active");
  };

  /* ================= LEAGUE OPEN ================= */
 
  const openLeagueBtn = document.getElementById("openLeague");

if (openLeagueBtn) {
  openLeagueBtn.onclick = async () => {
    hideAllSections();
    leagueSection.style.display = "block";

    try {
      const res = await fetch("/league/" + telegramId);
      const data = await res.json();
      document.getElementById("leagueName").innerText = data.league + " League";
      
      const topRes = await fetch("/top-league/" + data.league);
      const players = await topRes.json();

      const box = document.getElementById("leagueTop");
      box.innerHTML = "";

      players.forEach((p, i) => {
        box.innerHTML += `
          <div class="leaderboard-item">
            <span class="rank">#${i+1}</span>
            <span class="name">Player ${p.telegramId}</span>
            <span class="coins">${Math.floor(p.coins)}</span>
          </div>`;
      });

      const rankRes = await fetch("/rank/" + telegramId);
const rankData = await rankRes.json();
  
      document.getElementById("myRankDisplay").innerText = "#" + (rankData.rank || "--");
      document.getElementById("myCoinsDisplay").innerText = Math.floor(rankData.coins);
    } catch (e) {
      console.log("League error", e);
    }
  };
}

  if(document.getElementById("closeLeagueBtn")){
    document.getElementById("closeLeagueBtn").onclick = ()=>{
      hideAllSections();
      earnSection.style.display = "block";
      document.getElementById("navEarn").classList.add("active");
    }
  }

  /* ================= ACCOUNT SHOW ================= */
 
  async function loadAccount() {
    try {
      const res = await fetch("/rank/" + telegramId);
      const data = await res.json();

      document.getElementById("accountUserId").innerText = telegramId;
      document.getElementById("accountUserName").innerText = user.first_name || "User";
      document.getElementById("accountCoins").innerText = Math.floor(data.coins);
      document.getElementById("accountReferrals").innerText = data.referrals || 0;

      // airdrop logic
      const condCoins = data.coins >= 50000;
      const condWallet = false; // Placeholder for wallet connection
      const condRefs = (data.referrals || 0) >= 5;

      document.getElementById("condCoins").innerText = condCoins ? "✅" : "❌";
      document.getElementById("condWallet").innerText = condWallet ? "✅" : "❌";
      document.getElementById("condRefs").innerText = condRefs ? "✅" : "❌";

      const airdropStatus = document.getElementById("airdropStatus");
      if (condCoins && condWallet && condRefs) {
        airdropStatus.innerText = "Eligible";
        airdropStatus.className = "eligibility-status eligible";
      } else {
        airdropStatus.innerText = "Not Eligible";
        airdropStatus.className = "eligibility-status";
      }
    } catch (e) {
      console.log("Account error", e);
    }
  }
 
// ================= DAILY REWARD =================

const dailyPopup = document.getElementById("dailyPopup");
const dailyGrid = document.getElementById("dailyGrid");
const claimDailyBtn = document.getElementById("claimDailyBtn");

const rewards = [500,1000,2500,5000,15000,25000,100000,500000,1000000,5000000];

// show popup
setTimeout(() => {
  if(dailyPopup){
    dailyPopup.style.display = "flex";
    renderDaily(1); // ✅ default day
  }
}, 1000);

// render
function renderDaily(currentDay){
  if(!dailyGrid) return;

  dailyGrid.innerHTML = "";
  rewards.forEach((r,i)=>{
    dailyGrid.innerHTML += `
      <div class="day-card ${i+1 === currentDay ? 'active-day':''}">
        Day ${i+1}<br>${r}
      </div>
    `;
  });
}

// claim
if(claimDailyBtn){
  claimDailyBtn.onclick = async ()=>{
    try{
      const res = await fetch("/daily-reward",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ telegramId })
      });

      const data = await res.json();

      if(data.success){
        alert("🔥 +" + data.reward);
        coinsEl.innerText = Math.floor(data.coins);
        renderDaily(data.day);
               // ✅ POPUP CLOSE
        dailyPopup.style.display = "none";
      }else{
        alert(data.message);
      }

    }catch(err){
      console.log("Daily error:", err);
    }
  };
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

});
