// logic/dates.js
// Funzioni pure su date e finestra rolling. Nessun React.
// todayKey, rollingGranello, dayLabel, daysAgoKey, dateKeyDaysBefore.

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Returns total granello consumed in the last 7 days (rolling window, inclusive of today)
function rollingGranello(daysData, todayKey) {
  let total = 0;
  for (let i = 0; i <= 6; i++) {
    const key = i === 0 ? todayKey : dateKeyDaysBefore(todayKey, i);
    const day = daysData[key];
    if (day && day.granello) total += day.granello;
  }
  return Math.round(total * 10) / 10;
}

function dayLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Oggi";
  if (diffDays === -1) return "Ieri";
  if (diffDays === 1) return "Domani";
  const dayNames = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
  return `${dayNames[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

function daysAgoKey(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateKeyDaysBefore(dateKey, n) {
  const d = new Date(dateKey + "T12:00:00");
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
