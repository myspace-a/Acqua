// main.js — avvio dell'app e collegamento dei pulsanti.

// ── SERVICE WORKER ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ── INIT ──
loadData();
loadToiletData();
selectedDate = getTodayKey();
document.getElementById('dateInput').value = selectedDate;
document.getElementById('dateLabel').textContent = formatDate(selectedDate);
document.getElementById('timeInput').value = getNowTime();
document.getElementById('toiletTimeInput').value = getNowTime();

// Event listeners - nessun handler inline nell'HTML.
document.getElementById('dateInput').addEventListener('change', function(event) { selectDay(event.target.value); });
document.getElementById('sizeSelect').addEventListener('change', updateQtyMl);
document.getElementById('qtyMinus').addEventListener('click', function() { changeQty(-1); });
document.getElementById('qtyPlus').addEventListener('click', function() { changeQty(1); });
document.getElementById('addBtn').addEventListener('click', addEntry);
document.getElementById('addToiletBtn').addEventListener('click', addToiletEntry);
document.getElementById('toggleBtn').addEventListener('click', toggleHistory);
document.getElementById('exportBtn').addEventListener('click', exportExcel);
document.getElementById('importBtnMain').addEventListener('click', function() { document.getElementById('importFileInput').click(); });
document.getElementById('importBtnOnly').addEventListener('click', function() { document.getElementById('importFileInput').click(); });
document.getElementById('importFileInput').addEventListener('change', importExcel);

document.getElementById('timeline').addEventListener('click', function(event) {
  const button = event.target.closest('.tl-delete');
  if (button && button.dataset.index !== undefined) deleteEntry(Number(button.dataset.index));
});

document.getElementById('toiletTimeline').addEventListener('click', function(event) {
  const button = event.target.closest('.tl-delete');
  if (button && button.dataset.toiletIndex !== undefined) deleteToiletEntry(Number(button.dataset.toiletIndex));
});

document.getElementById('historyList').addEventListener('click', function(event) {
  const item = event.target.closest('.history-item');
  if (item && item.dataset.date) selectDay(item.dataset.date);
});

updateQtyMl();
render();
