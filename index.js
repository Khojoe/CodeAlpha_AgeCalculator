// ── Helpers ──────────────────────────────────────────────────────────────

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate(); // month is 1-based here
}

function animateNum(elem, value) {
  elem.classList.remove("counting");
  void elem.offsetWidth; // reflow
  elem.textContent = value;
  elem.classList.add("counting");
}

// ── Validation ───────────────────────────────────────────────────────────

function validate(day, month, year) {
  const dayElem = document.getElementById("day");
  const monthElem = document.getElementById("month");
  const yearElem = document.getElementById("year");

  [dayElem, monthElem, yearElem].forEach((elem) =>
    elem.classList.remove("error"),
  );

  if (!day || !month || !year) {
    if (!day) dayElem.classList.add("error");
    if (!month) monthElem.classList.add("error");
    if (!year) yearElem.classList.add("error");
    return "Please fill in all three fields.";
  }

  if (month < 1 || month > 12) {
    monthElem.classList.add("error");
    return "Month must be between 1 and 12.";
  }

  const maxDay = daysInMonth(month, year);
  if (day < 1 || day > maxDay) {
    dayElem.classList.add("error");
    return `Day must be between 1 and ${maxDay} for that month.`;
  }

  const today = new Date();
  const dob = new Date(year, month - 1, day);

  if (year < 1900 || year > today.getFullYear()) {
    yearElem.classList.add("error");
    return `Year must be between 1900 and ${today.getFullYear()}.`;
  }

  if (dob > today) {
    dayElem.classList.add("error");
    monthElem.classList.add("error");
    yearElem.classList.add("error");
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
  let todayYear = today.getFullYear(),
    todayMonth = today.getMonth() + 1,
    todayDay = today.getDate();
  let birthYear = year,
    birthMonth = month,
    birthDay = day;

  // Calculate difference
  let years = todayYear - birthYear;
  let months = todayMonth - birthMonth;
  let days = todayDay - birthDay;

  if (days < 0) {
    months--;
    days += daysInMonth(
      todayMonth - 1 === 0 ? 12 : todayMonth - 1,
      todayMonth - 1 === 0 ? todayYear - 1 : todayYear,
    );
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
  const birthdayBanner = document.getElementById("birthday-banner");
  if (todayMonth === birthMonth && todayDay === birthDay) {
    birthdayBanner.classList.add("show");
  } else {
    birthdayBanner.classList.remove("show");
  }
}

// Allow Enter key
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") calculate();
});
