// main.js — avvio dell'app e collegamento dei pulsanti.

// ── SERVICE WORKER ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ── INIT ──
loadData();
selectedDate = getTodayKey();
document.getElementById('dateInput').value = selectedDate;
document.getElementById('dateLabel').textContent = formatDate(selectedDate);
document.getElementById('timeInput').value = getNowTime();

// Event listeners - nessun handler inline nell'HTML
document.getElementById('dateInput').addEventListener('change', function(e) { selectDay(e.target.value); });
document.getElementById('sizeSelect').addEventListener('change', updateQtyMl);
document.getElementById('qtyMinus').addEventListener('click', function() { changeQty(-1); });
document.getElementById('qtyPlus').addEventListener('click', function() { changeQty(1); });
document.getElementById('addBtn').addEventListener('click', addEntry);
document.getElementById('toggleBtn').addEventListener('click', toggleHistory);
document.getElementById('exportBtn').addEventListener('click', exportExcel);
document.getElementById('importBtnMain').addEventListener('click', function() { document.getElementById('importFileInput').click(); });
document.getElementById('importBtnOnly').addEventListener('click', function() { document.getElementById('importFileInput').click(); });
document.getElementById('importFileInput').addEventListener('change', importExcel);

// Event delegation per pulsanti delete nella timeline
document.getElementById('timeline').addEventListener('click', function(e) {
  const btn = e.target.closest('.tl-delete');
  if (btn) deleteEntry(parseInt(btn.dataset.index));
});

// Event delegation per click sullo storico
document.getElementById('historyList').addEventListener('click', function(e) {
  const item = e.target.closest('.history-item');
  if (item && item.dataset.date) selectDay(item.dataset.date);
});

updateQtyMl();
render();
