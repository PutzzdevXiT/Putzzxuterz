const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/keyputz.json";

async function checkKey(){
  const input = document.getElementById("keyInput").value.trim();
  const msg = document.getElementById("msg");
  const loading = document.getElementById("loadingScreen");

  if(!input){
    msg.style.color = "red";
    msg.innerText = "Key tidak valid";
    return;
  }

  // TAMPILKAN LOADING SETELAH PENCET LOGIN
  loading.classList.add("show");

  try{
    const res = await fetch(KEY_URL);
    const data = await res.json();

    let keyType = "";
    let expireText = "";

    // PERMANENT
    if(data.permanent_keys?.includes(input)){
      keyType = "permanen";
      expireText = "Key Permanen";
    }

    // SEKALI PAKAI
    else if(data.once_keys?.includes(input)){
      keyType = "sekali";
      expireText = "Key Sekali Pakai";
    }

    // DURASI
    else{
      const dur = data.duration_keys?.find(k => k.key === input);
      if(dur){
        keyType = "durasi";
        expireText = `Durasi ${dur.time}`;
      } else {
        loading.classList.remove("show");
        msg.style.color = "red";
        msg.innerText = "Key tidak ditemukan";
        return;
      }
    }

    // SIMULASI CEK
    setTimeout(() => {
      loading.classList.remove("show");

      msg.style.color = "lime";
      msg.innerText = `Akses diterima (${expireText})`;

      document.getElementById("keyBox").classList.add("hidden");
      document.getElementById("contentBox").classList.remove("hidden");

    }, 1500);

  }catch(e){
    loading.classList.remove("show");
    msg.style.color = "red";
    msg.innerText = "Gagal memuat data";
  }
}