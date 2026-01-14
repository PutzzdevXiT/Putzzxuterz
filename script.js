const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

/* ===== AUTO LOGIN SAAT LOAD ===== */
window.addEventListener("load", () => {
  const saved = localStorage.getItem("SAVED_KEY");
  if (saved) {
    document.getElementById("keyInput").value = saved;
    checkKey(true);
  }
});

async function checkKey(auto = false) {
  const inputEl = document.getElementById("keyInput");
  const input = inputEl.value.trim();
  const msg = document.getElementById("msg");

  if (!input) {
    msg.style.color = "red";
    msg.innerText = "Key tidak valid";
    return;
  }

  try {
    const res = await fetch(KEY_URL);
    const data = await res.json();
    const now = Date.now();

    /* ===== PERMANENT ===== */
    if (data.permanent_keys?.includes(input)) {
      saveKey(input);
      success("Akses diterima (Permanent)");
      return;
    }

    /* ===== ONCE ===== */
    const used = JSON.parse(localStorage.getItem("USED_KEYS") || "[]");
    if (data.once_keys?.includes(input)) {
      if (!auto && used.includes(input)) {
        error("Key sudah digunakan");
        return;
      }

      if (!used.includes(input)) {
        used.push(input);
        localStorage.setItem("USED_KEYS", JSON.stringify(used));
      }

      saveKey(input);
      success("Akses diterima (1x Pakai)");
      return;
    }

    /* ===== DURATION ===== */
    const dur = data.duration_keys?.find(k => k.key === input);
    if (dur) {
      const store = "DUR_" + input;
      let exp = localStorage.getItem(store);

      if (!exp) {
        const num = parseInt(dur.time);
        const unit = dur.time.replace(num, "");
        let ms = unit === "d" ? num * 86400000 : num * 3600000;
        exp = now + ms;
        localStorage.setItem(store, exp);
      }

      if (now > exp) {
        error("Key duration sudah habis");
        localStorage.removeItem("SAVED_KEY");
        return;
      }

      saveKey(input);
      success(`Akses diterima (${dur.time})`);
      return;
    }

    error("Key tidak ditemukan");

  } catch (e) {
    error("Gagal memuat data");
    console.error(e);
  }
}

/* ===== UTIL ===== */
function saveKey(key) {
  localStorage.setItem("SAVED_KEY", key);
}

function success(text) {
  const msg = document.getElementById("msg");
  msg.style.color = "lime";
  msg.innerText = text;
  unlock();
}

function error(text) {
  const msg = document.getElementById("msg");
  msg.style.color = "red";
  msg.innerText = text;
}

function unlock() {
  setTimeout(() => {
    document.getElementById("keyBox").classList.add("hidden");
    document.getElementById("contentBox").classList.remove("hidden");
  }, 500);
}