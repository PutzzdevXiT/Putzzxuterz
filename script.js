const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

// ===============================
async function checkKey(){
  const input = document.getElementById("keyInput").value.trim();
  const msg = document.getElementById("msg");
  const loading = document.getElementById("loadingScreen");

  if(!input){
    msg.style.color = "red";
    msg.innerText = "Key tidak valid";
    return;
  }

  // tampilkan loading
  loading.classList.remove("loading-hide");
  msg.innerText = "";

  try{
    const res = await fetch(KEY_URL);
    const data = await res.json();

    // ===== KEY PERMANEN =====
    if(data.permanent_keys?.includes(input)){
      saveKey(input);
      openContent("🔐 KEY PERMANEN");
      return;
    }

    // ===== KEY SEKALI PAKAI =====
    if(data.once_keys?.includes(input)){
      saveKey(input);
      openContent("⚠️ KEY SEKALI PAKAI");
      return;
    }

    // ===== KEY DURASI (TANPA WAKTU) =====
    const dur = data.duration_keys?.find(k => k.key === input);
    if(dur){
      saveKey(input);
      openContent("✅ KEY AKTIF");
      return;
    }

    // ===== KEY TIDAK ADA =====
    loading.classList.add("loading-hide");
    msg.style.color = "red";
    msg.innerText = "Key tidak ditemukan";

  }catch(err){
    loading.classList.add("loading-hide");
    msg.style.color = "red";
    msg.innerText = "Gagal memuat data";
    console.error(err);
  }
}

// ===============================
function openContent(text){
  setTimeout(()=>{
    document.getElementById("loadingScreen").classList.add("loading-hide");
    document.getElementById("keyBox").classList.add("hidden");
    document.getElementById("contentBox").classList.remove("hidden");

    const keyText = document.getElementById("keyText");
    if(keyText) keyText.innerText = text;
  },1000);
}

// ===============================
// SAVE KEY (NEMPEL)
function saveKey(key){
  localStorage.setItem("SAVED_KEY", key);
}

// ===============================
// LOAD KEY KE INPUT (TIDAK AUTO LOGIN)
window.addEventListener("DOMContentLoaded", ()=>{
  const saved = localStorage.getItem("SAVED_KEY");
  if(saved){
    document.getElementById("keyInput").value = saved;
  }
});