// ====================
// INITIALIZING & ELEMENT
// ====================
const countEl = document.getElementById("count-el");
const saveEl = document.getElementById("save-el");
const totalEl = document.getElementById("total-el");

let count = 0;

function updateButtonStates() {
  document.getElementById("save-btn").disabled = count === 0;
  document.getElementById("decrement-btn").disabled = count === 0;
}

// ====================
// UTILITY FUNCTIONS
// ====================
function animateOnce(element, className, duration = 300) {
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), duration);
}

function showInfoBanner(message) {
  const banner = document.createElement("div");
  banner.textContent = message;
  banner.style.position = "fixed";
  banner.style.bottom = "16px";
  banner.style.left = "50%";
  banner.style.transform = "translateX(-50%)";
  banner.style.padding = "12px 20px";
  banner.style.background = "#1c1c2b";
  banner.style.color = "#dcd3f8";
  banner.style.border = "1px solid #6b21a8";
  banner.style.borderRadius = "8px";
  banner.style.boxShadow = "0 0 12px rgba(150, 120, 255, 0.3)";
  banner.style.zIndex = "9999";
  banner.style.fontFamily = "Crimson Pro, serif";
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3000);
}

// ====================
// INCREMENT BUTTON FUNKTION
// ====================
function increment() {
  count += 1;
  countEl.textContent = count;
  updateButtonStates();
  animateOnce(countEl, "animate-pulse");
}

// ====================
// DECREMENT BUTTON FUNKTION
// ====================
function decrement() {
  if (count > 0) {
    count -= 1;
    countEl.textContent = count;
    updateButtonStates();
    animateOnce(countEl, "animate-pulse");
  }
}

// ====================
// SAVE BUTTON FUNKTION
// ====================
function save() {
  if (typeof count !== "number" || isNaN(count) || count <= 0) return;

  const currentSaved = localStorage.getItem("savedEntries");
  const savedArray = currentSaved ? currentSaved.split(" - ").filter((n) => n !== "") : [];

  savedArray.push(count);
  localStorage.setItem("savedEntries", savedArray.join(" - "));

  count = 0;
  countEl.textContent = count;
  updateButtonStates();
  updateStats();

  animateOnce(document.getElementById("save-btn"), "btn-glow", 300);
}

// ====================
// RESET FUNKTION
// ====================
function reset() {
  if (!localStorage.getItem("savedEntries")) {
    showInfoBanner("Nothing to reset.");
    return;
  }

  const confirmed = confirm("Are you sure you want to reset everything?");
  if (!confirmed) return;

  count = 0;
  countEl.textContent = count;
  updateButtonStates();

  document.getElementById("save-title").textContent = "Previous Entries:";
  document.getElementById("entries-list").innerHTML = "<span>(none)</span>";

  localStorage.removeItem("savedEntries");
  updateStats();
}

// ====================
// EXPORTERA DATA
// ====================
function exportData() {
  const savedData = localStorage.getItem("savedEntries");
  if (!savedData || savedData.trim() === "") {
    showInfoBanner("No data to export.");
    return;
  }

  const entries = savedData.split(" - ");
  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const header = `╔═══════════════════════════════════════╗\n║         📜  NOCTRA LOG EXPORT         ║\n╚═══════════════════════════════════════╝`;

  let content = `${header}\n\n📅 Date: ${date}\n⏰ Time: ${time}\n📦 Total Entries: ${entries.length}\n\n📕 Saved Entries:\n`;

  for (let i = 0; i < entries.length; i++) {
    content += entries[i];
    if ((i + 1) % 5 === 0) {
      content += "\n";
    } else if (i !== entries.length - 1) {
      content += " - ";
    }
  }

  content += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ Thank you for using Noctra ✨\nKeep your records safe, traveler.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Noctra_Log_${date.replace(/\//g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ====================
// UPPDATERA STATISTIK
// ====================
function updateStats() {
  const savedData = localStorage.getItem("savedEntries") || "";
  const saveTitleEl = document.getElementById("save-title");
  const entriesListEl = document.getElementById("entries-list");
  const totalValueEl = document.getElementById("total-value");
  const lastUpdatedEl = document.getElementById("last-updated");

  if (savedData) {
    const entries = savedData.split(" - ").filter((n) => n !== "");
    let formatted = "";

    entries.forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const span = isLast ? `<span class=\"entry-new\">${entry}</span>` : entry;

      formatted += span;

      if (!isLast) {
        formatted += " - ";
      }

      if ((index + 1) % 8 === 0 && !isLast) {
        formatted += "<br>";
      }
    });

    saveTitleEl.textContent = "Previous Entries:";
    entriesListEl.innerHTML = formatted;
  } else {
    saveTitleEl.textContent = "Previous Entries:";
    entriesListEl.textContent = "(none)";
  }

  const numbers = savedData
    .split(" - ")
    .filter((n) => !isNaN(n) && n !== "")
    .map((n) => parseInt(n));

  const total = numbers.reduce((a, b) => a + b, 0);
  totalValueEl.textContent = total;
  animateOnce(totalValueEl, "animate-glow", 500);
  totalValueEl.style.color = total === 0 ? "darkred" : "";

  const now = new Date();
  const date = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  const timestamp = `${date}, ${time}`;
  lastUpdatedEl.textContent = "Last updated: " + timestamp;
}

// ====================
// TA BORT 1 FRÅN TOTAL
// ====================
function removeFromTotal() {
  const savedData = localStorage.getItem("savedEntries");
  if (!savedData) return;

  let numbers = savedData
    .split(" - ")
    .filter((n) => !isNaN(n) && n !== "")
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
  const newSaved = isNowEmpty ? "" : numbers.join(" - ");
  localStorage.setItem("savedEntries", newSaved);
  updateStats();

  if (isNowEmpty) {
    animateOnce(document.getElementById("total-value"), "blink-total", 400);
  }
}

// ====================
// LADDNING AV SIDAN
// ====================
document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  updateButtonStates();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Backspace" || e.key === "Delete") removeFromTotal();
  });
});
