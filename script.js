const KEY_URL = "https://raw.githubusercontent.com/PutzzdevXiT/sefelink-by-putzz/refs/heads/main/key.json";

async function checkKey() {
  const input = document.getElementById("keyInput").value.trim();
  const msg = document.getElementById("msg");

  if (!input) {
    msg.style.color = "red";
    msg.innerText = "Key tidak valid";
    return;
  }

  const used = JSON.parse(localStorage.getItem("USED_KEYS") || "[]");
  if (used.includes(input)) {
    msg.style.color = "red";
    msg.innerText = "Key sudah kedaluwarsa";
    return;
  }

  try {
    const res = await fetch(KEY_URL);
    const data = await res.json();

    if (!data.keys.includes(input)) {
      msg.style.color = "red";
      msg.innerText = "Key tidak terdaftar/salah";
      return;
    }

    const now = new Date();
    const exp = new Date(data.expired + "T23:59:59");

    if (now > exp) {
      msg.style.color = "red";
      msg.innerText = "Key sudah expired";
      return;
    }

    used.push(input);
    localStorage.setItem("USED_KEYS", JSON.stringify(used));

    msg.style.color = "green";
    msg.innerText = "Akses diterima";

    setTimeout(() => {
      document.getElementById("keyBox").classList.add("hidden");
      document.getElementById("contentBox").classList.remove("hidden");
    }, 600);

  } catch {
    msg.style.color = "red";
    msg.innerText = "Gagal memuat data";
  }
}
