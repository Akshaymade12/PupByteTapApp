/* ============================================================
   PUPBYTE TAP BOT - FRESH WORKING SCRIPT (v2.0)
   Optimized, Bug-Free, and Ready for Production
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
    
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (!tg) {
        console.error("This app must be opened inside Telegram.");
        // Fallback for testing outside Telegram
        window.Telegram = { WebApp: { expand: () => {}, initData: "", initDataUnsafe: { user: { id: "12345", username: "TestUser" } } } };
    } else {
        tg.expand();
        tg.ready();
    }

    const telegramUser = tg.initDataUnsafe?.user;
    if (!telegramUser) {
        console.error("Telegram user not found.");
        return;
    }

    const telegramId = telegramUser.id.toString();
    const username = telegramUser.username || telegramUser.first_name || "Player";
    const initData = tg.initData;

    /* ================================
       GLOBAL GAME STATE
       ================================ */
    let GAME = {
        coins: 0,
        energy: 1000,
        maxEnergy: 1000,
        profit: 0,
        tapPower: 1,
        tapLevel: 1,
        gpuLevel: 1,
        marketingLevel: 1,
        league: "Wood",
        referrals: 0,
        nextTapCost: 100,
        nextProfitCost: 200
    };

    /* ================================
       UI UTILITIES
       ================================ */
    const qs = (id) => document.getElementById(id);

    const UI = {
        coins: qs("coins"),
        energy: qs("energy"),
        profit: qs("profit"),
        tapBtn: qs("tapBtn"),
        // Sections
        sections: {
            earn: qs("earnSection"),
            mine: qs("mineSection"),
            tasks: qs("tasksSection"),
            account: qs("accountSection"),
            skills: qs("skillsSection"),
            cashier: qs("cashierSection"),
            boost: qs("boostSection"),
            mission: qs("missionPage")
        },
        // Navigation
        nav: {
            earn: qs("navEarn"),
            mine: qs("navMine"),
            tasks: qs("navTasks"),
            account: qs("navAccount"),
            skills: qs("navSkills"),
            cashier: qs("navCashier")
        },
        // Boost/Upgrades
        upgradeTapBtn: qs("upgradeTapBtn"),
        upgradeProfitBtn: qs("upgradeProfitBtn"),
        // Account
        userId: qs("userId"),
        accountCoins: qs("accountCoins"),
        accountReferrals: qs("accountReferrals"),
        refLink: qs("refLink"),
        // League
        leagueName: qs("leagueName"),
        leagueProgress: qs("leagueProgress"),
        // Leaderboard
        globalTop: qs("globalTop"),
        leagueTop: qs("leagueTop"),
        myRank: qs("myRank")
    };

    /* ================================
       CORE SYSTEMS
       ================================ */

    // 1. Notification System
    function notify(msg) {
        if (!msg) return;
        // Using Telegram's built-in Haptic Feedback and Alert
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        
        // Check if a custom toast exists, else fallback to alert
        const toast = qs("toast");
        if (toast) {
            toast.innerText = msg;
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 3000);
        } else {
            alert(msg);
        }
    }

    // 2. Navigation System
    function switchSection(targetKey) {
        // Hide all sections
        Object.values(UI.sections).forEach(section => {
            if (section) section.style.display = "none";
        });

        // Show target section
        if (UI.sections[targetKey]) {
            UI.sections[targetKey].style.display = "block";
        }

        // Update active nav button
        Object.keys(UI.nav).forEach(key => {
            const btn = UI.nav[key];
            if (btn) {
                if (key === targetKey) {
                    btn.classList.add("active-nav");
                } else {
                    btn.classList.remove("active-nav");
                }
            }
        });
    }

    function initNavigation() {
        Object.keys(UI.nav).forEach(key => {
            const btn = UI.nav[key];
            if (btn) {
                btn.onclick = () => switchSection(key);
            }
        });

        // Special Back Buttons
        const backBtn = qs("backBtn");
        if (backBtn) {
            backBtn.onclick = () => switchSection('earn');
        }

        const openBoost = qs("openBoost");
        if (openBoost) {
            openBoost.onclick = () => switchSection('boost');
        }
    }

    // 3. Data Fetching Wrapper
    async function apiRequest(endpoint, method = "GET", body = null) {
        try {
            const options = {
                method,
                headers: { "Content-Type": "application/json" }
            };
            
            // For POST requests, include telegramId and initData in the body
            if (method === "POST") {
                options.body = JSON.stringify({
                    telegramId,
                    initData,
                    ...(body || {})
                });
            }

            const res = await fetch(endpoint, options);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (err) {
            console.error(`API Error (${endpoint}):`, err);
            return { success: false, message: "Network Error" };
        }
    }

    // 4. Load User Data
    async function loadUser() {
        const data = await apiRequest("/load/" + telegramId);
        if (data && !data.error) {
            updateGameState(data);
            updateUI();
        }
    }

    function updateGameState(data) {
        GAME = {
            ...GAME,
            coins: data.coins ?? GAME.coins,
            energy: data.energy ?? GAME.energy,
            profit: data.profitPerHour ?? GAME.profit,
            tapLevel: data.tapLevel ?? GAME.tapLevel,
            tapPower: data.tapPower ?? GAME.tapPower,
            gpuLevel: data.gpuLevel ?? GAME.gpuLevel,
            marketingLevel: data.marketingLevel ?? GAME.marketingLevel,
            league: data.league ?? GAME.league,
            referrals: data.referrals ?? GAME.referrals,
            nextTapCost: data.nextTapCost ?? GAME.nextTapCost,
            nextProfitCost: data.nextProfitCost ?? GAME.nextProfitCost
        };
    }

    function updateUI() {
        if (UI.coins) UI.coins.innerText = Math.floor(GAME.coins).toLocaleString();
        if (UI.energy) UI.energy.innerText = Math.floor(GAME.energy);
        if (UI.profit) UI.profit.innerText = "+" + Math.floor(GAME.profit).toLocaleString();

        // Mine Cards
        const gpuLevelEl = qs("gpuLevel");
        if (gpuLevelEl) gpuLevelEl.innerText = `${GAME.gpuLevel}/20`;
        
        // Boosts
        if (UI.upgradeTapBtn) UI.upgradeTapBtn.innerText = `Upgrade Tap (${GAME.nextTapCost})`;
        if (UI.upgradeProfitBtn) UI.upgradeProfitBtn.innerText = `Upgrade Profit (${GAME.nextProfitCost})`;

        // Account
        if (UI.userId) UI.userId.innerText = telegramId;
        if (UI.accountCoins) UI.accountCoins.innerText = Math.floor(GAME.coins).toLocaleString();
        if (UI.accountReferrals) UI.accountReferrals.innerText = GAME.referrals;
        if (UI.refLink) UI.refLink.value = `https://t.me/PupByteTapBot?start=${telegramId}`;

        updateLeagueProgress();
    }

    // 5. Tap System
    let isTapping = false;
    function initTap() {
        if (!UI.tapBtn) return;

        UI.tapBtn.onclick = async () => {
            if (isTapping || GAME.energy < GAME.tapPower) return;

            // Optimistic Update
            GAME.coins += GAME.tapPower;
            GAME.energy -= GAME.tapPower;
            updateUI();
            showPlusAnimation(GAME.tapPower);

            isTapping = true;
            const data = await apiRequest("/tap", "POST");
            isTapping = false;

            if (data.success) {
                updateGameState(data);
                updateUI();
            } else {
                // Rollback on failure
                loadUser();
                notify(data.message || "Tap rejected");
            }
            
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        };
    }

    function showPlusAnimation(amount) {
        const el = document.createElement("div");
        el.className = "plus-animation";
        el.innerText = "+" + amount;
        
        const wrapper = document.querySelector(".coin-wrapper") || document.body;
        wrapper.appendChild(el);
        
        // Randomize position slightly
        const x = Math.random() * 40 - 20;
        el.style.left = `calc(50% + ${x}px)`;
        
        setTimeout(() => el.remove(), 1000);
    }

    // 6. Card/Upgrade System
    window.upgradeCard = async function(type) {
        const data = await apiRequest("/upgrade-card", "POST", { type });
        if (data.success) {
            notify(`${type.toUpperCase()} Upgraded!`);
            await loadUser();
        } else {
            notify(data.message || "Upgrade failed");
        }
    };

    function initUpgrades() {
        if (UI.upgradeTapBtn) {
            UI.upgradeTapBtn.onclick = async () => {
                const data = await apiRequest("/upgrade-tap", "POST");
                if (data.success) {
                    notify("Tap Level Up!");
                    await loadUser();
                } else {
                    notify("Not enough coins");
                }
            };
        }

        if (UI.upgradeProfitBtn) {
            UI.upgradeProfitBtn.onclick = async () => {
                const data = await apiRequest("/upgrade-profit", "POST");
                if (data.success) {
                    notify("Profit Per Hour Increased!");
                    await loadUser();
                } else {
                    notify("Not enough coins");
                }
            };
        }
    }

    // 7. League System
    function updateLeagueProgress() {
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

        const current = leagues.find(l => GAME.coins >= l.min && GAME.coins < l.max) || leagues[0];
        
        if (UI.leagueName) UI.leagueName.innerText = current.name + " League";
        
        if (UI.leagueProgress) {
            if (current.max === Infinity) {
                UI.leagueProgress.style.width = "100%";
            } else {
                const prog = ((GAME.coins - current.min) / (current.max - current.min)) * 100;
                UI.leagueProgress.style.width = Math.min(100, Math.max(0, prog)) + "%";
            }
        }
    }

    // 8. Auto Mining & Energy Regen
    function startAutoSystems() {
        setInterval(() => {
            // 1. Auto Profit (Coins per second)
            if (GAME.profit > 0) {
                const perSecond = GAME.profit / 3600;
                GAME.coins += perSecond;
                if (UI.coins) UI.coins.innerText = Math.floor(GAME.coins).toLocaleString();
            }

            // 2. Energy Regeneration
            if (GAME.energy < GAME.maxEnergy) {
                GAME.energy = Math.min(GAME.maxEnergy, GAME.energy + 1);
                if (UI.energy) UI.energy.innerText = Math.floor(GAME.energy);
            }
        }, 1000);
    }

    // 9. Spin Wheel
    function initSpin() {
        const spinBtn = qs("spinBtn");
        const wheel = qs("wheel");
        const wheelWrapper = qs("wheelWrapper");
        
        if (!spinBtn) return;

        spinBtn.onclick = async () => {
            const data = await apiRequest("/spin", "POST");
            if (!data.success) {
                notify(data.message || "Spin not available");
                return;
            }

            const reward = data.reward;
            if (wheel && wheelWrapper) {
                wheelWrapper.style.display = "flex";
                const rewardsMap = { 100: 30, 200: 90, 300: 150, 500: 210, 800: 270, 1000: 330 };
                const baseDeg = rewardsMap[reward] || 30;
                const spinRounds = 5 * 360;
                const finalDeg = spinRounds + (360 - baseDeg);
                wheel.style.transform = `rotate(${finalDeg}deg)`;

                setTimeout(() => {
                    notify(`🎉 You won ${reward} coins!`);
                    loadUser();
                }, 4000);
            } else {
                notify(`🎉 You won ${reward} coins!`);
                loadUser();
            }
        };
    }

    // 10. Daily Reward
    function initDailyReward() {
        const dailyBtn = qs("dailyRewardBtn");
        if (!dailyBtn) return;

        dailyBtn.onclick = async () => {
            const data = await apiRequest("/daily-reward", "POST");
            if (data.success) {
                notify(`You received ${data.reward} coins 🎉`);
                loadUser();
            } else {
                notify(data.message || "Already claimed");
            }
        };
    }

    // 11. Missions
    function initMissions() {
        window.openMission = () => switchSection('mission');
        window.closeMission = () => switchSection('tasks');
        window.openLink = (url) => tg.openLink(url);
        
        window.verifyTask = async (taskId = "telegram_join") => {
            const data = await apiRequest("/complete-task", "POST", { taskId });
            if (data.success) {
                notify(`Task completed +${data.reward} coins`);
                loadUser();
            } else {
                notify(data.message || "Task not completed");
            }
        };
    }

    // 12. Leaderboard
    async function loadLeaderboard() {
        // Global Top
        const globalData = await apiRequest("/top-global");
        if (UI.globalTop && Array.isArray(globalData)) {
            UI.globalTop.innerHTML = globalData.map((u, i) => `
                <div class="user-row">
                    <span>#${i + 1}</span>
                    <span>${u.telegramId}</span>
                    <span>${Math.floor(u.coins).toLocaleString()}</span>
                </div>
            `).join('');
        }

        // League Top
        const leagueData = await apiRequest("/top-league/" + GAME.league);
        if (UI.leagueTop && Array.isArray(leagueData)) {
            UI.leagueTop.innerHTML = leagueData.map((u, i) => `
                <div class="user-row">
                    <span>#${i + 1}</span>
                    <span>${u.telegramId}</span>
                    <span>${Math.floor(u.coins).toLocaleString()}</span>
                </div>
            `).join('');
        }

        // My Rank
        const rankData = await apiRequest("/rank/" + telegramId);
        if (UI.myRank && rankData.rank) {
            UI.myRank.innerHTML = `
                <div class="user-row my-rank">
                    <span>#${rankData.rank}</span>
                    <span>You</span>
                    <span>${Math.floor(rankData.coins).toLocaleString()}</span>
                </div>
            `;
        }
    }

    // 13. Referral & Social
    function initSocial() {
        const copyBtn = qs("copyRefBtn");
        if (copyBtn && UI.refLink) {
            copyBtn.onclick = () => {
                UI.refLink.select();
                document.execCommand("copy");
                notify("Referral link copied! ✅");
            };
        }

        const inviteBtn = qs("inviteBtn");
        if (inviteBtn) {
            inviteBtn.onclick = () => {
                const link = `https://t.me/PupByteTapBot?start=${telegramId}`;
                const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Join my meme coin empire! 🚀")}`;
                tg.openTelegramLink(shareUrl);
            };
        }
    }

    /* ================================
       INITIALIZATION
       ================================ */
    async function init() {
        initNavigation();
        initTap();
        initUpgrades();
        initSpin();
        initDailyReward();
        initMissions();
        initSocial();
        
        await loadUser();
        startAutoSystems();
        
        // Load leaderboard if in tasks or account section
        if (UI.nav.tasks) UI.nav.tasks.addEventListener('click', loadLeaderboard);
        if (UI.nav.account) UI.nav.account.addEventListener('click', loadLeaderboard);

        // Initial view
        switchSection('earn');
        
        console.log("PupByte Tap Bot Initialized");
    }

    init();
});
