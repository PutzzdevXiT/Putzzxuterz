const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/keyputz.json";

async function checkKey() {
  const input = document.getElementById("keyInput").value.trim();
  const msg = document.getElementById("msg");

  if (!input) {
    msg.innerText = "Key belum diisi";
    return;
  }

  try {
    const res = await fetch(KEY_URL);
    const data = await res.json();

    // cek expired global
    const today = new Date().toISOString().split("T")[0];
    if (today > data.global_expired) {
      msg.innerText = "Akses ditutup";
      return;
    }

    // ===== PERMANEN =====
    if (data.permanent_keys.includes(input)) {
      openContent();
      return;
    }

    // ===== 1x PAKAI =====
    const usedOnce = JSON.parse(localStorage.getItem("used_once_keys")) || [];
    if (data.once_keys.includes(input)) {
      if (usedOnce.includes(input)) {
        msg.innerText = "Key sudah kedeluarsa";
        return;
      }
      usedOnce.push(input);
      localStorage.setItem("used_once_keys", JSON.stringify(usedOnce));
      openContent();
      return;
    }

    // ===== DURASI =====
    const durationKey = data.duration_keys.find(k => k.key === input);
    if (durationKey) {
      const storeKey = "duration_" + input;
      const savedTime = localStorage.getItem(storeKey);

      const durationMs = parseDuration(durationKey.time);

      if (!savedTime) {
        localStorage.setItem(storeKey, Date.now());
        openContent();
        return;
      }

      if (Date.now() - savedTime <= durationMs) {
        openContent();
        return;
      } else {
        msg.innerText = "Key sudah expired";
        return;
      }
    }

    msg.innerText = "Key salah🥺";

  } catch {
    msg.innerText = "Gagal mengambil data key";
  }
}

function parseDuration(time) {
  const num = parseInt(time);
  if (time.includes("d")) return num * 24 * 60 * 60 * 1000;
  if (time.includes("h")) return num * 60 * 60 * 1000;
  if (time.includes("m")) return num * 60 * 1000;
  return 0;
}

function openContent() {
  document.getElementById("keyBox").classList.add("hidden");
  document.getElementById("contentBox").classList.remove("hidden");
}