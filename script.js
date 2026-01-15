const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

let countdownInterval = null;

async function checkKey(){
  const input = document.getElementById("keyInput").value.trim();
  const msg = document.getElementById("msg");
  const loading = document.getElementById("loadingScreen");

  if(!input){
    msg.style.color = "red";
    msg.innerText = "Key tidak boleh kosong";
    return;
  }

  // tampilkan loading SETELAH klik login
  loading.classList.remove("loading-hide");
  msg.innerText = "";

  try{
    const res = await fetch(KEY_URL);
    const data = await res.json();

    // ===== KEY PERMANEN =====
    if(data.permanent_keys && data.permanent_keys.includes(input)){
      openContent("🔐 KEY PERMANEN");
      return;
    }

    // ===== KEY SEKALI PAKAI =====
    if(data.once_keys && data.once_keys.includes(input)){
      openContent("⚠️ KEY SEKALI PAKAI");
      return;
    }

    // ===== KEY DURASI =====
    if(Array.isArray(data.duration_keys)){
      const dur = data.duration_keys.find(k => k.key === input);
      if(dur){
        startCountdown(dur.time);
        return;
      }
    }

    // jika tidak ada di semua kategori
    loading.classList.add("loading-hide");
    msg.style.color = "red";
    msg.innerText = "Key tidak ditemukan";

  }catch(e){
    console.error(e);
    loading.classList.add("loading-hide");
    msg.style.color = "red";
    msg.innerText = "Gagal memuat data key";
  }
}

// ===============================
function openContent(text){
  setTimeout(()=>{
    document.getElementById("loadingScreen").classList.add("loading-hide");
    document.getElementById("keyBox").classList.add("hidden");
    document.getElementById("contentBox").classList.remove("hidden");

    document.getElementById("keyText").innerText = text;
  }, 1000);
}

// ===============================
function startCountdown(time){
  let seconds = parseDuration(time);

  openContent("⏳ Menyiapkan waktu...");

  const keyText = document.getElementById("keyText");

  if(countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(()=>{
    if(seconds <= 0){
      clearInterval(countdownInterval);
      keyText.innerText = "⛔ KEY EXPIRED";
      return;
    }

    let d = Math.floor(seconds / 86400);
    let h = Math.floor((seconds % 86400) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;

    keyText.innerText = `⏳ Sisa waktu key: ${d}d ${h}j ${m}m ${s}d`;
    seconds--;
  }, 1000);
}

// ===============================
function parseDuration(t){
  if(typeof t !== "string") return 0;

  if(t.endsWith("d")) return parseInt(t) * 86400;
  if(t.endsWith("h")) return parseInt(t) * 3600;
  if(t.endsWith("m")) return parseInt(t) * 60;

  return parseInt(t) || 0;
}