// water.js — assunzioni d'acqua: aggiungi, elimina, timeline, progresso, storico.
// Contiene anche le piccole funzioni di utilità condivise (sanitize, showToast, date).

const GOAL = 2000;
let selectedDate = '';
let formQty = 1;

function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}
function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}
function getNowTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
}
function formatDate(dateKey) {
  const [y,m,d] = dateKey.split('-');
  return new Date(Number(y),Number(m)-1,Number(d)).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

function getDayEntries() {
  return (data[selectedDate] || []).slice().sort((a,b) => a.time.localeCompare(b.time));
}
function calcTotal(entries) {
  return entries.reduce((s,e) => s + e.size * e.qty, 0);
}
function changeQty(delta) {
  formQty = Math.max(1, Math.min(20, formQty + delta));
  document.getElementById('qtyNum').textContent = formQty;
  updateQtyMl();
}
function updateQtyMl() {
  const size = parseInt(document.getElementById('sizeSelect').value, 10);
  document.getElementById('qtyMl').textContent = `= ${size * formQty} ml`;
}
function addEntry() {
  const time = document.getElementById('timeInput').value;
  const size = parseInt(document.getElementById('sizeSelect').value, 10);
  const note = document.getElementById('noteInput').value.trim();
  if (!time) { alert("Inserisci l'orario!"); return; }
  if (!data[selectedDate]) data[selectedDate] = [];
  data[selectedDate].push({ time, size, qty: formQty, note });
  saveData();
  document.getElementById('noteInput').value = '';
  render();
}
function deleteEntry(index) {
  const entries = getDayEntries();
  const entry = entries[index];
  const orig = data[selectedDate];
  const i = orig.findIndex(e => e.time === entry.time && e.size === entry.size && e.qty === entry.qty && e.note === entry.note);
  if (i !== -1) orig.splice(i, 1);
  if (orig.length === 0) delete data[selectedDate];
  saveData();
  render();
}
function render() {
  renderTimeline();
  renderProgress();
  renderToilet();
  renderHistory();
  updateBtns();
}
function renderTimeline() {
  const entries = getDayEntries();
  const tl = document.getElementById('timeline');
  if (!entries.length) {
    tl.innerHTML = '<div class="empty-timeline">💧 Nessuna assunzione registrata</div>';
    return;
  }
  tl.innerHTML = entries.map((e, i) => `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <button class="tl-delete" data-index="${i}" aria-label="Elimina assunzione">✕</button>
      <div class="tl-header">
        <div class="tl-time">${sanitize(e.time)}</div>
        <div class="tl-right">
          <div class="tl-ml">${Number(e.size) * Number(e.qty)} ml</div>
          <div class="tl-detail">${Number(e.qty)} × ${Number(e.size)} ml</div>
        </div>
      </div>
      ${e.note ? `<div class="tl-note">📝 ${sanitize(e.note)}</div>` : ''}
    </div>
  `).join('');
}
function renderProgress() {
  const entries = getDayEntries();
  const total = calcTotal(entries);
  const pct = Math.min(100, (total / GOAL) * 100);
  const color = pct < 40 ? '#f87171' : pct < 70 ? '#fbbf24' : '#34d399';
  document.getElementById('progressText').textContent = `${total} ml / ${GOAL} ml`;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressFill').style.background = `linear-gradient(90deg, ${color}, ${color}bb)`;
  document.getElementById('progressStatus').style.color = pct >= 100 ? '#34d399' : '#64748b';
  document.getElementById('progressStatus').textContent = pct >= 100
    ? '🎉 Obiettivo raggiunto!'
    : `${Math.round(pct)}% dell'obiettivo (${GOAL} ml)`;
  const totalGlasses = entries.reduce((s,e) => s + Number(e.qty), 0);
  document.getElementById('statEntries').textContent = entries.length;
  document.getElementById('statGlasses').textContent = totalGlasses;
  document.getElementById('statFirst').textContent = entries.length ? entries[0].time : '—';
  document.getElementById('statLast').textContent = entries.length ? entries[entries.length-1].time : '—';
}
function renderHistory() {
  const dates = [...new Set([...Object.keys(data), ...Object.keys(toiletData)])].sort((a,b) => b.localeCompare(a));
  const list = document.getElementById('historyList');
  if (!dates.length) { list.innerHTML = ''; return; }
  list.innerHTML = dates.map(date => {
    const entries = (data[date] || []).slice();
    const waterTotal = calcTotal(entries);
    const visits = (toiletData[date] || []);
    const toiletSeconds = visits.reduce((sum, visit) => sum + (Number(visit.duration) || 0), 0);
    const color = waterTotal >= GOAL ? '#34d399' : '#94a3b8';
    const detail = `${entries.length} assunzioni · ${entries.reduce((s,e)=>s+Number(e.qty),0)} bicchieri<br>${visits.length} visite bagno · ${toiletSeconds} secondi`;
    return `<div class="history-item ${date === selectedDate ? 'selected' : ''}" data-date="${sanitize(date)}">
      <div class="history-top">
        <div class="history-date">${sanitize(formatDate(date))}</div>
        <div class="history-total" style="color:${color}">${waterTotal} ml</div>
      </div>
      <div class="history-detail">${detail}</div>
    </div>`;
  }).join('');
}
function updateBtns() {
  const has = Object.keys(data).length > 0 || Object.keys(toiletData).length > 0;
  document.getElementById('exportRow').style.display = has ? 'grid' : 'none';
  document.getElementById('importOnlyRow').style.display = has ? 'none' : 'block';
}
function selectDay(date) {
  if (!date) return;
  selectedDate = date;
  document.getElementById('dateInput').value = date;
  document.getElementById('dateLabel').textContent = formatDate(date);
  document.getElementById('toiletTimeInput').value = getNowTime();
  render();
}
function toggleHistory() {
  const sec = document.getElementById('history-section');
  const visible = sec.style.display === 'block';
  sec.style.display = visible ? 'none' : 'block';
  document.getElementById('toggleBtn').textContent = visible ? '▼ Mostra storico' : '▲ Nascondi storico';
}
