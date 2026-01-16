const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

let countdownInterval = null;

// ================== AUTO CHECK SAAT LOAD ==================
window.onload = () => {
  const expired = localStorage.getItem("expiredTime");
  const type = localStorage.getItem("keyType");

  if (expired && Date.now() < expired) {
    openContent(type || "🔓 KEY AKTIF");
    startCountdownFromExpire(expired);
  } else {
    localStorage.clear();
  }
};

// ================== CHECK KEY ==================
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
  msg.innerText="";

  try{
    const res = await fetch(KEY_URL);
    const data = await res.json();

    // KEY PERMANEN
    if(data.permanent_keys?.includes(input)){
      localStorage.setItem("keyType","🔐 KEY PERMANEN");
      openContent("🔐 KEY PERMANEN");
      return;
    }

    // KEY SEKALI
    if(data.once_keys?.includes(input)){
      localStorage.setItem("keyType","⚠️ KEY SEKALI PAKAI");
      openContent("⚠️ KEY SEKALI PAKAI");
      return;
    }

    // KEY DURASI
    const dur = data.duration_keys?.find(k=>k.key===input);
    if(!dur){
      loading.classList.add("loading-hide");
      msg.innerText="Key tidak ditemukan";
      return;
    }

    const seconds = parseDuration(dur.time);
    const expiredTime = Date.now() + seconds * 1000;

    localStorage.setItem("expiredTime", expiredTime);
    localStorage.setItem("keyType", "⏳ KEY DURASI");

    startCountdownFromExpire(expiredTime);

  }catch{
    loading.classList.add("loading-hide");
    msg.innerText="Gagal memuat data";
  }
}

// ================== OPEN CONTENT ==================
function openContent(text){
  setTimeout(()=>{
    document.getElementById("loadingScreen").classList.add("loading-hide");
    document.getElementById("keyBox").classList.add("hidden");
    document.getElementById("contentBox").classList.remove("hidden");
    document.getElementById("keyText").innerText = text;
  },800);
}

// ================== COUNTDOWN ==================
function startCountdownFromExpire(expiredTime){
  openContent("⏳ Menghitung waktu...");

  if(countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(()=>{
    let seconds = Math.floor((expiredTime - Date.now()) / 1000);

    if(seconds <= 0){
      clearInterval(countdownInterval);
      document.getElementById("keyText").innerText = "⛔ KEY EXPIRED";
      localStorage.clear();
      return;
    }

    let d = Math.floor(seconds / 86400);
    let h = Math.floor((seconds % 86400) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;

    document.getElementById("keyText").innerText =
      `⏳ Sisa waktu key: ${d}d ${h}j ${m}m ${s}d`;
  },1000);
}

// ================== PARSE ==================
function parseDuration(t){
  if(t.endsWith("d")) return parseInt(t)*86400;
  if(t.endsWith("h")) return parseInt(t)*3600;
  if(t.endsWith("m")) return parseInt(t)*60;
  return parseInt(t);
}

// ===============================
// SAVE KEY (NEMPEL)
function saveKey(key){
  localStorage.setItem("SAVED_KEY", key);
}

// ===============================
// LOAD KEY KE INPUT (TAPI TIDAK AUTO LOGIN)
window.addEventListener("DOMContentLoaded", ()=>{
  const saved = localStorage.getItem("SAVED_KEY");
  if(saved){
    document.getElementById("keyInput").value = saved;
  }
});