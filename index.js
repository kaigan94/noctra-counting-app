let countEl = document.getElementById("count-el");
let saveEl = document.getElementById("save-el");
let count = 0;

function increment() {
  count += 1; // count + count = 1;
  countEl.textContent = count;
}

function save() {
  let countString = count + " - ";
  saveEl.textContent += countString;
  countEl.textContent = 0;
  count = 0;
}

function reset() {
  count = 0;
  countEl.textContent = count;
  saveEl.textContent = "";
}
