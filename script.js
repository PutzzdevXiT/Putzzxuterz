const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

let countdownInterval;

async function checkKey(){
  const input = document.getElementById("keyInput").value.trim();
  const msg = document.getElementById("msg");
  const loading = document.getElementById("loadingScreen");

  if(!input){
    msg.style.color="red";
    msg.innerText="Key tidak valid";
    return;
  }

  loading.classList.remove("loading-hide");

  try{
    const res = await fetch(KEY_URL);
    const data = await res.json();

    let statusText = "";

    if(data.permanent_keys?.includes(input)){
      statusText = "🔐 KEY PERMANEN";
      showContent(statusText);
      return;
    }

    if(data.once_keys?.includes(input)){
      statusText = "⚠️ KEY SEKALI PAKAI";
      showContent(statusText);
      return;
    }

    const dur = data.duration_keys?.find(k=>k.key===input);
    if(!dur){
      loading.classList.add("loading-hide");
      msg.style.color="red";
      msg.innerText="Key tidak ditemukan";
      return;
    }

    startCountdown(dur.time);

  }catch{
    loading.classList.add("loading-hide");
    msg.innerText="Gagal memuat data";
  }
}

function showContent(text){
  setTimeout(()=>{
    document.getElementById("loadingScreen").classList.add("loading-hide");
    document.getElementById("keyBox").classList.add("hidden");
    document.getElementById("contentBox").classList.remove("hidden");

    const div=document.createElement("div");
    div.className="key-status";
    div.innerText=text;
    document.getElementById("contentBox").prepend(div);
  },1200);
}

function startCountdown(time){
  let seconds=parseInt(time)*86400;

  showContent("");

  const status=document.querySelector(".key-status");

  countdownInterval=setInterval(()=>{
    if(seconds<=0){
      clearInterval(countdownInterval);
      status.innerText="⛔ KEY EXPIRED";
      return;
    }

    let d=Math.floor(seconds/86400);
    let h=Math.floor((seconds%86400)/3600);
    let m=Math.floor((seconds%3600)/60);
    let s=seconds%60;

    status.innerText=`⏳ Sisa waktu key: ${d}d ${h}j ${m}m ${s}d`;
    seconds--;
  },1000);
}