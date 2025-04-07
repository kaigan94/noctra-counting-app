// ====================
// 🚀 INITIALISERING & ELEMENT
// ====================
const countEl = document.getElementById("count-el");
const saveEl = document.getElementById("save-el");
const totalEl = document.getElementById("total-el");

let count = 0;

// ====================
// ➕ INKCREMENT
// ====================
function increment() {
  count += 1;
  countEl.textContent = count;

  countEl.classList.add("animate-pulse");
  setTimeout(() => countEl.classList.remove("animate-pulse"), 300);
}

// ====================
// ➖ DECREMENT
// ====================
function decrement() {
  if (count > 0) {
    count -= 1;
    countEl.textContent = count;

    countEl.classList.add("animate-pulse");
    setTimeout(() => countEl.classList.remove("animate-pulse"), 300);
  }
}

// ====================
// 💾 SPARA VÄRDE
// ====================
function save() {
  const countString = count + " - ";
  const currentSaved = localStorage.getItem("savedEntries") || "";

  localStorage.setItem("savedEntries", currentSaved + countString);
  count = 0;
  countEl.textContent = count;
  updateStats();

  // ✨ Feedback-animation
  const saveBtn = document.getElementById("save-btn");
  saveBtn.classList.add("btn-glow");
  setTimeout(() => saveBtn.classList.remove("btn-glow"), 300);
}

// ====================
// ❌ ÅTERSTÄLL ALLT
// ====================
function reset() {
  const confirmed = confirm("Are you sure you want to reset everything?");
  if (!confirmed) return;

  count = 0;
  countEl.textContent = count;
  saveEl.textContent = "Previous Entries: ";
  localStorage.removeItem("savedEntries");

  updateStats();
}

// ====================
// 📤 EXPORTERA DATA
// ====================
function exportData() {
  const savedData = localStorage.getItem("savedEntries");
  if (!savedData || savedData.trim() === "") {
    alert("No data to export.");
    return;
  }

  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const content = `🧾 SwiftTracker Export\n\nDate: ${date}\nTime: ${time}\n\nSaved Entries:\n${savedData
    .split(" - ")
    .filter((n) => n !== "")
    .join(", ")}`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `SmartTracker-${date.replace(/\//g, "-")}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}

// ====================
// 📊 UPPDATERA STATISTIK
// ====================
function updateStats() {
  const savedData = localStorage.getItem("savedEntries") || "";

  saveEl.textContent = savedData ? "📜 Previous Entries: " + savedData : "📜 Previous Entries: (none)";

  const totalValueEl = document.getElementById("total-value");
  const lastUpdatedEl = document.getElementById("last-updated");

  if (savedData) {
    const numbers = savedData
      .trim()
      .split(" - ")
      .filter((n) => n !== "")
      .map((n) => parseInt(n));
    const total = numbers.reduce((a, b) => a + b, 0);

    totalValueEl.textContent = total;
    totalValueEl.classList.add("animate-glow");
    setTimeout(() => totalValueEl.classList.remove("animate-glow"), 500);

    totalValueEl.style.color = total === 0 ? "darkred" : "";

    const now = new Date();
    const date = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    const timestamp = `${date}, ${time}`;

    lastUpdatedEl.textContent = "Last updated: " + timestamp;
  } else {
    totalValueEl.textContent = "0";
    totalValueEl.style.color = "firebrick";
    lastUpdatedEl.textContent = "Last updated: never";
  }
}

// ====================
// ⏪ TA BORT 1 FRÅN TOTAL
// ====================
function removeFromTotal() {
  const savedData = localStorage.getItem("savedEntries");
  if (!savedData) return;

  let numbers = savedData
    .trim()
    .split(" - ")
    .filter((n) => n !== "")
    .map((n) => parseInt(n));

  if (numbers.length === 0) return;

  for (let i = numbers.length - 1; i >= 0; i--) {
    if (numbers[i] > 0) {
      numbers[i] -= 1;
      break;
    } else {
      numbers.pop();
      break;
    }
  }

  const isNowEmpty = numbers.length === 0;

  const newSaved = isNowEmpty ? "" : numbers.join(" - ") + " - ";
  localStorage.setItem("savedEntries", newSaved);
  updateStats();

  if (isNowEmpty) {
    const totalValueEl = document.getElementById("total-value");
    totalValueEl.classList.add("blink-total");

    setTimeout(() => {
      totalValueEl.classList.remove("blink-total");
    }, 400);
  }
}

// ====================
// 📦 LADDNING AV SIDAN
// ====================
document.addEventListener("DOMContentLoaded", () => {
  updateStats();
});
