const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

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
    if (today > data.expired) {
      msg.innerText = "Akses sudah ditutup";
      return;
    }

    const usedOnceKeys = JSON.parse(localStorage.getItem("used_once_keys")) || [];

    // 🔐 KEY PERMANEN
    if (data.permanent_keys.includes(input)) {
      openContent();
      return;
    }

    // 🔑 KEY 1x PAKAI
    if (data.once_keys.includes(input)) {
      if (usedOnceKeys.includes(input)) {
        msg.innerText = "Key ini sudah digunakan";
        return;
      }

      // tandai key sudah dipakai
      usedOnceKeys.push(input);
      localStorage.setItem("used_once_keys", JSON.stringify(usedOnceKeys));

      openContent();
      return;
    }

    msg.innerText = "Key tidak valid";

  } catch (err) {
    msg.innerText = "Gagal mengambil data key";
  }
}

function openContent() {
  document.getElementById("keyBox").classList.add("hidden");
  document.getElementById("contentBox").classList.remove("hidden");
}
