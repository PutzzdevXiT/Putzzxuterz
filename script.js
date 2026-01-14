const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/main/key.json";

async function checkKey() {
  const input = document.getElementById("keyInput").value.trim();
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

    /* ===== PERMANENT KEY ===== */
    if (data.permanent_keys?.includes(input)) {
      msg.style.color = "lime";
      msg.innerText = "Akses diterima (Permanent)";
      unlock();
      return;
    }

    /* ===== ONCE KEY ===== */
    const used = JSON.parse(localStorage.getItem("USED_KEYS") || "[]");
    if (data.once_keys?.includes(input)) {
      if (used.includes(input)) {
        msg.style.color = "red";
        msg.innerText = "Key sudah digunakan";
        return;
      }

      used.push(input);
      localStorage.setItem("USED_KEYS", JSON.stringify(used));

      msg.style.color = "lime";
      msg.innerText = "Akses diterima (1x Pakai)";
      unlock();
      return;
    }

    /* ===== DURATION KEY ===== */
    const durKey = data.duration_keys?.find(k => k.key === input);
    if (durKey) {
      const storeKey = "DUR_" + input;
      let expTime = localStorage.getItem(storeKey);

      if (!expTime) {
        const num = parseInt(durKey.time);
        const unit = durKey.time.replace(num, "");

        let ms = 0;
        if (unit === "d") ms = num * 86400000;
        if (unit === "h") ms = num * 3600000;

        expTime = now + ms;
        localStorage.setItem(storeKey, expTime);
      }

      if (now > expTime) {
        msg.style.color = "red";
        msg.innerText = "Key duration sudah habis";
        return;
      }

      msg.style.color = "lime";
      msg.innerText = `Akses diterima (${durKey.time})`;
      unlock();
      return;
    }

    msg.style.color = "red";
    msg.innerText = "Key tidak ditemukan";

  } catch (e) {
    msg.style.color = "red";
    msg.innerText = "Gagal memuat data";
    console.error(e);
  }
}

function unlock() {
  setTimeout(() => {
    document.getElementById("keyBox").classList.add("hidden");
    document.getElementById("contentBox").classList.remove("hidden");
  }, 600);
}