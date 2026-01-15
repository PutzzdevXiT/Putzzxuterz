const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/keyputz.json";

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
    const now = Date.now();

    /* ===== KEY PERMANEN ===== */
    if(data.permanent_keys?.includes(input)){
      sukses("Key permanen");
      return;
    }

    /* ===== KEY SEKALI ===== */
    if(data.once_keys?.includes(input)){
      if(localStorage.getItem("USED_"+input)){
        gagal("Key sudah digunakan");
        return;
      }
      localStorage.setItem("USED_"+input,"true");
      sukses("Key sekali pakai");
      return;
    }

    /* ===== KEY DURASI ===== */
    const durationKey = data.duration_keys?.find(k=>k.key===input);
    if(durationKey){
      const saved = localStorage.getItem("TIME_"+input);
      if(!saved){
        const end = now + parseDuration(durationKey.time);
        localStorage.setItem("TIME_"+input,end);
        sukses("Aktif "+durationKey.time);
        return;
      }else{
        const sisa = saved - now;
        if(sisa <= 0){
          gagal("Key expired");
          return;
        }
        sukses("Sisa "+formatTime(sisa));
        return;
      }
    }

    gagal("Key tidak ditemukan");

  }catch{
    gagal("Gagal memuat data");
  }

  function sukses(text){
    msg.style.color="lime";
    msg.innerText="Akses diterima ("+text+")";
    setTimeout(()=>{
      loading.classList.add("loading-hide");
      document.getElementById("keyBox").classList.add("hidden");
      document.getElementById("contentBox").classList.remove("hidden");
    },1200);
  }

  function gagal(text){
    loading.classList.add("loading-hide");
    msg.style.color="red";
    msg.innerText=text;
  }
}

/* ===== HELPER ===== */
function parseDuration(t){
  const n=parseInt(t);
  if(t.includes("d")) return n*86400000;
  if(t.includes("h")) return n*3600000;
  if(t.includes("m")) return n*60000;
  return 0;
}

function formatTime(ms){
  const s=Math.floor(ms/1000);
  const h=Math.floor(s/3600);
  const m=Math.floor((s%3600)/60);
  const d=Math.floor(h/24);
  if(d>0) return d+" hari";
  if(h>0) return h+" jam";
  return m+" menit";
}