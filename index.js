const countEl = document.getElementById("count-el");
const saveEl = document.getElementById("save-el");
const totalEl = document.getElementById("total-el");

let count = 0;

// ===== [ 2. FUNKTIONER FÖR COUNT ] =====
// Öka räknaren med 1
function increment() {
  count += 1;
  countEl.textContent = count;

  // Enkel animation
  countEl.classList.add("animate-pulse");
  setTimeout(() => countEl.classList.remove("animate-pulse"), 300);
}

// Minska räknaren med 1, men aldrig under 0
function decrement() {
  if (count > 0) {
    count -= 1;
    countEl.textContent = count;

    countEl.classList.add("animate-pulse");
    setTimeout(() => countEl.classList.remove("animate-pulse"), 300);
  }
}

// Spara aktuellt antal till localStorage
function save() {
  const countString = count + " - ";

  const currentSaved = localStorage.getItem("savedEntries") || "";
  localStorage.setItem("savedEntries", currentSaved + countString);

  count = 0;
  countEl.textContent = count;

  updateStats();
}

// Återställ räknare och tidigare sparat
function reset() {
  count = 0;
  countEl.textContent = count;
  saveEl.textContent = "Previous Entries: ";

  localStorage.removeItem("savedEntries");

  updateStats();
}

// ===== [ 3. UPPDATERA STATISTIK & VISA TOTAL ] =====
function updateStats() {
  const savedData = localStorage.getItem("savedEntries") || "";

  saveEl.textContent = savedData ? "Previous Entries: " + savedData : "Previous Entries: (none)";

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

    // Färga bara siffran röd om 0
    if (total === 0) {
      totalValueEl.style.color = "darkred";
    } else {
      totalValueEl.style.color = "";
    }

    // Senast uppdaterad
    const now = new Date();

    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const timestamp = `${date}, ${time}`;
    lastUpdatedEl.textContent = "⏱️ Last updated: " + timestamp;
  } else {
    totalValueEl.textContent = "0";
    totalValueEl.style.color = "firebrick";
    lastUpdatedEl.textContent = "⏱️ Last updated: never";
  }
}

// ===== [ 4. TA BORT 1 FRÅN TOTAL ] =====
function removeFromTotal() {
  const savedData = localStorage.getItem("savedEntries");
  if (!savedData) return;

  let numbers = savedData
    .trim()
    .split(" - ")
    .filter((n) => n !== "")
    .map((n) => parseInt(n));

  // Gå baklänges och minska första värde som är > 0
  for (let i = numbers.length - 1; i >= 0; i--) {
    if (numbers[i] > 0) {
      numbers[i] -= 1;
      break;
    }
  }

  const newSaved = numbers.join(" - ") + " - ";
  localStorage.setItem("savedEntries", newSaved);
  updateStats();
}

// ===== [ 5. LADDNING AV SIDAN ] =====
document.addEventListener("DOMContentLoaded", () => {
  updateStats(); // Ladda sparade värden och visa direkt
});
