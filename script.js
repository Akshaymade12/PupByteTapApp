const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
const userId = user.id;

const coinsEl = document.getElementById("coins");
const tapBtn = document.getElementById("tapBtn");

/* LOAD USER */
async function load(){
    const res = await fetch("/load/" + userId);
    const data = await res.json();
    coinsEl.innerText = data.coins;
}

load();

/* TAP */
tapBtn.onclick = async () => {

    const res = await fetch("/tap", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ id: userId })
    });

    const data = await res.json();

    if(data.success){
        coinsEl.innerText = data.coins;
    }

 app.get('/', (req, res) => {
  res.send('PupByte Tap App is Running 🚀');   
};
