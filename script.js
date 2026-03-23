function qs(id){
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", async () => {

const tg = window.Telegram?.WebApp;

if(!tg){
    alert("Open inside Telegram");
    return;
}

tg.expand();

/* ================= TELEGRAM USER ================= */

const telegramUser = tg.initDataUnsafe?.user;

if(!telegramUser){
    alert("Telegram user not found");
    return;
}

const telegramId = telegramUser.id.toString();
const username = telegramUser.username || telegramUser.first_name || "Player";
const initData = tg.initData;

/* ================= GAME STATE ================= */

let GAME = {
    coins:0,
    energy:0,
    profit:0,
    tapPower:1,
    tapLevel:1,
    league:"Wood"
};

/* ================= DOM ================= */

const coinsEl = qs("coins");
const energyEl = qs("energy");
const profitEl = qs("profit");
const tapBtn = qs("tapBtn");

/* ================= LOAD USER ================= */

async function loadUser(){

    try{

        const res = await fetch("/load/" + telegramId);
        const data = await res.json();

        if(!data) return;

        GAME.coins = data.coins;
        GAME.energy = data.energy;
        GAME.profit = data.profitPerHour || 0;
        GAME.tapLevel = data.tapLevel || 1;
        GAME.tapPower = data.tapPower || 1;
        GAME.league = data.league || "Wood";

        if(coinsEl) coinsEl.innerText = Math.floor(GAME.coins);
        if(energyEl) energyEl.innerText = GAME.energy;
        if(profitEl) profitEl.innerText = GAME.profit;

        updateEnergyBar();
        updateAccount(data);

    }catch(err){
        console.log("Load error",err);
    }
}

/* ================= TAP ================= */

function initTap(){

    if(!tapBtn) return;

    let lock = false;

    tapBtn.onclick = async () => {

        if(lock) return;
        lock = true;

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
                notify(data.message || "Tap failed");
                lock = false;
                return;
            }

            GAME.coins = data.coins;
            GAME.energy = data.energy;

            if(coinsEl) coinsEl.innerText = Math.floor(GAME.coins);
            if(energyEl) energyEl.innerText = GAME.energy;

            showPlus(GAME.tapPower);
            updateEnergyBar();

        }catch(err){
            console.log("Tap error",err);
        }

        setTimeout(()=>{ lock=false },100);
    };
}

/* ================= ENERGY BAR ================= */

function updateEnergyBar(){

    const fill = qs("energyFill");
    const text = qs("energyText");

    if(fill){
        const percent = (GAME.energy / 100) * 100;
        fill.style.width = percent + "%";
    }

    if(text){
        text.innerText = GAME.energy + "/100";
    }
}

/* ================= FLOAT ANIMATION ================= */

function showPlus(amount){

    const el = document.createElement("div");
    el.className = "plus-one";
    el.innerText = "+" + amount;

    const wrapper = document.querySelector(".coin-wrapper");

    if(wrapper){
        wrapper.appendChild(el);
        setTimeout(()=> el.remove(),800);
    }
}

/* ================= NAVIGATION ================= */

function hideAll(){
    document.querySelectorAll(".section").forEach(sec=>{
        sec.style.display="none";
    });
}

function removeActive(){
    document.querySelectorAll(".nav-item").forEach(btn=>{
        btn.classList.remove("active-nav");
    });
}

function switchSection(section,btn){
    hideAll();
    removeActive();
    if(section) section.style.display="block";
    if(btn) btn.classList.add("active-nav");
}

function initNavigation(){

    const navMap = {
        navEarn:"earnSection",
        navMine:"mineSection",
        navTasks:"tasksSection",
        navAccount:"accountSection",
        navSkills:"skillsSection",
        navCashier:"cashierSection"
    };

    Object.keys(navMap).forEach(navId=>{
        const btn = qs(navId);
        const section = qs(navMap[navId]);

        if(btn){
            btn.onclick = ()=>{
                switchSection(section,btn);
            };
        }
    });
}

/* ================= DAILY ================= */

function initDaily(){

    const btn = qs("dailyRewardBtn");
    if(!btn) return;

    btn.onclick = async ()=>{

        const res = await fetch("/daily-reward",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({ telegramId })
        });

        const data = await res.json();

        if(!data.success){
            notify(data.message);
            return;
        }

        notify("+"+data.reward+" coins 🎉");
        loadUser();
    };
}

/* ================= SPIN ================= */

function initSpin(){

    const btn = qs("spinBtn");
    if(!btn) return;

    btn.onclick = async ()=>{

        const res = await fetch("/spin",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({ telegramId })
        });

        const data = await res.json();

        if(!data.success){
            notify(data.message);
            return;
        }

        notify("You won "+data.reward+" 🎉");
        loadUser();
    };
}

/* ================= ACCOUNT ================= */

function updateAccount(data){

    const userIdEl = qs("userId");
    const coinsEl2 = qs("accountCoins");
    const refEl = qs("accountReferrals");

    if(userIdEl) userIdEl.innerText = telegramId;
    if(coinsEl2) coinsEl2.innerText = Math.floor(data.coins);
    if(refEl) refEl.innerText = data.referrals || 0;
}

/* ================= NOTIFY ================= */

function notify(msg){
    alert(msg);
}

/* ================= AUTO MINING ================= */

setInterval(()=>{
    GAME.coins += (GAME.profit || 0) / 3600;
    if(coinsEl) coinsEl.innerText = Math.floor(GAME.coins);
},1000);

/* ================= INIT ================= */

await loadUser();
initTap();
initNavigation();
initDaily();
initSpin();

});
