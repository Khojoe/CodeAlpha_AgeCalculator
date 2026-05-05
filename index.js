// ── Helpers ──────────────────────────────────────────────────────────────

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate(); // month is 1-based here
}

function animateNum(el, value) {
  el.classList.remove("counting");
  void el.offsetWidth; // reflow
  el.textContent = value;
  el.classList.add("counting");
}

// ── Validation ───────────────────────────────────────────────────────────

function validate(day, month, year) {
  const dayEl = document.getElementById("day");
  const monthEl = document.getElementById("month");
  const yearEl = document.getElementById("year");

  [dayEl, monthEl, yearEl].forEach((el) => el.classList.remove("error"));

  if (!day || !month || !year) {
    if (!day) dayEl.classList.add("error");
    if (!month) monthEl.classList.add("error");
    if (!year) yearEl.classList.add("error");
    return "Please fill in all three fields.";
  }

  if (month < 1 || month > 12) {
    monthEl.classList.add("error");
    return "Month must be between 1 and 12.";
  }

  const maxDay = daysInMonth(month, year);
  if (day < 1 || day > maxDay) {
    dayEl.classList.add("error");
    return `Day must be between 1 and ${maxDay} for that month.`;
  }

  const today = new Date();
  const dob = new Date(year, month - 1, day);

  if (year < 1900 || year > today.getFullYear()) {
    yearEl.classList.add("error");
    return `Year must be between 1900 and ${today.getFullYear()}.`;
  }

  if (dob > today) {
    dayEl.classList.add("error");
    monthEl.classList.add("error");
    yearEl.classList.add("error");
    return "Date of birth cannot be in the future.";
  }

  return null; // no error
}

// ── Calculation ──────────────────────────────────────────────────────────

function calculate() {
  const day = parseInt(document.getElementById("day").value);
  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);

  const errorEl = document.getElementById("error-msg");
  const resultEl = document.getElementById("result");

  const err = validate(day, month, year);
  if (err) {
    errorEl.textContent = err;
    resultEl.classList.remove("show");
    return;
  }

  errorEl.textContent = "";

  const today = new Date();
  let tY = today.getFullYear(),
    tM = today.getMonth() + 1,
    tD = today.getDate();
  let bY = year,
    bM = month,
    bD = day;

  // Calculate difference
  let years = tY - bY;
  let months = tM - bM;
  let days = tD - bD;

  if (days < 0) {
    months--;
    days += daysInMonth(tM - 1 === 0 ? 12 : tM - 1, tM - 1 === 0 ? tY - 1 : tY);
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Show result
  resultEl.classList.remove("show");
  void resultEl.offsetWidth;
  resultEl.classList.add("show");

  animateNum(document.getElementById("res-years"), years);
  animateNum(document.getElementById("res-months"), months);
  animateNum(document.getElementById("res-days"), days);

  // Birthday check
  const bdayBanner = document.getElementById("bday-banner");
  if (tM === bM && tD === bD) {
    bdayBanner.classList.add("show");
  } else {
    bdayBanner.classList.remove("show");
  }
}

// Allow Enter key
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculate();
});
