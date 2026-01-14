const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

const keyBox = document.getElementById("keyBox");
const contentBox = document.getElementById("contentBox");
const msg = document.getElementById("msg");

/* ===== AUTO LOGIN ===== */
(function autoLogin(){
  const type = localStorage.getItem("KEY_TYPE");
  const exp = localStorage.getItem("EXPIRE_TIME");

  if(type === "permanent"){
    keyBox.classList.add("hidden");
    contentBox.classList.remove("hidden");
  }

  if(type === "duration"){
    if(Date.now() > Number(exp)){
      localStorage.clear();
      location.reload();
    }else{
      keyBox.classList.add("hidden");
      contentBox.classList.remove("hidden");
    }
  }
})();

/* ===== CEK DURASI ===== */
function getDays(key){
  const m = key.match(/(\d+)d/i);
  return m ? Number(m[1]) : null;
}

/* ===== LOGIN ===== */
async function checkKey(){
  const key = document.getElementById("keyInput").value.trim();
  if(!key){
    msg.innerText="Key kosong";
    msg.style.color="red";
    return;
  }

  msg.innerText="Memeriksa key...";
  msg.style.color="#7dd7ff";

  try{
    const res = await fetch(KEY_URL);
    const data = await res.json();

    if(!data.keys.includes(key)){
      throw "Key tidak valid";
    }

    const days = getDays(key);

    // 🔥 KEY DURASI
    if(days){
      const expire = Date.now() + (days * 86400000);
      localStorage.setItem("KEY_TYPE","duration");
      localStorage.setItem("EXPIRE_TIME",expire);
      msg.innerText = `Akses aktif ${days} hari`;
    }
    // 🔥 KEY PERMANEN
    else{
      localStorage.setItem("KEY_TYPE","permanent");
      msg.innerText = "Akses permanen";
    }

    msg.style.color="lime";

    setTimeout(()=>{
      keyBox.classList.add("hidden");
      contentBox.classList.remove("hidden");
    },700);

  }catch(e){
    msg.innerText = e;
    msg.style.color="red";
  }
}