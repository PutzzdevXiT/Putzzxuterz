// GANTI LINK RAW GITHUB KAMU
const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

async function checkKey(){
  const input = document.getElementById("keyInput").value.trim();
  const status = document.getElementById("status");

  try{
    const res = await fetch(KEY_URL);
    const data = await res.json();

    if(data.keys.includes(input)){
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("vault").classList.remove("hidden");
    }else{
      status.innerText = "❌ Key salah dev ada penyusup otw Bug";
    }

  }catch{
    status.innerText = "⚠️ Gagal mengambil key";
  }
}

function copyLink(btn){
  const input = btn.previousElementSibling;
  input.select();
  document.execCommand("copy");
  btn.innerText = "TERSALIN";
  setTimeout(()=>btn.innerText="SALIN",1500);
}