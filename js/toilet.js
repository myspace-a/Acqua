// toilet.js — registrazione, eliminazione e visualizzazione delle visite in bagno.

function getToiletDayEntries() {
  return (toiletData[selectedDate] || []).slice().sort((a,b) => a.time.localeCompare(b.time));
}

function addToiletEntry() {
  const time = document.getElementById('toiletTimeInput').value;
  const durationInput = document.getElementById('toiletDurationInput').value.trim();

  if (!time) {
    showToast("❌ Inserisci l'orario", 3500);
    return;
  }

  let duration = null;
  if (durationInput !== '') {
    const parsed = Number(durationInput);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 3600) {
      showToast('❌ La durata deve essere un numero intero da 1 a 3600 secondi', 4500);
      return;
    }
    duration = parsed;
  }

  if (!toiletData[selectedDate]) toiletData[selectedDate] = [];
  toiletData[selectedDate].push({ time, duration });
  saveToiletData();

  document.getElementById('toiletDurationInput').value = '';
  document.getElementById('toiletTimeInput').value = getNowTime();
  render();
  showToast('✅ Visita registrata');
}

function deleteToiletEntry(index) {
  const entries = getToiletDayEntries();
  const entry = entries[index];
  const original = toiletData[selectedDate] || [];
  const originalIndex = original.indexOf(entry);
  if (originalIndex === -1) return;

  original.splice(originalIndex, 1);
  if (original.length === 0) delete toiletData[selectedDate];
  saveToiletData();
  render();
  showToast('Visita eliminata');
}

function renderToilet() {
  const entries = getToiletDayEntries();
  const timeline = document.getElementById('toiletTimeline');
  const totalDuration = entries.reduce((sum, entry) => sum + (Number(entry.duration) || 0), 0);

  if (!entries.length) {
    timeline.innerHTML = '<div class="empty-timeline">Nessuna visita registrata</div>';
  } else {
    timeline.innerHTML = entries.map((entry, index) => `
      <div class="tl-item toilet-tl-item">
        <div class="tl-dot toilet-dot"></div>
        <button class="tl-delete" data-toilet-index="${index}" aria-label="Elimina visita">✕</button>
        <div class="tl-header">
          <div class="tl-time toilet-time">${sanitize(entry.time)}</div>
          <div class="tl-right">
            <div class="tl-ml">${entry.duration === null || entry.duration === undefined || entry.duration === '' ? 'Durata non indicata' : `${Number(entry.duration)} secondi`}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.getElementById('toiletStatVisits').textContent = entries.length;
  document.getElementById('toiletStatDuration').textContent = totalDuration;
}
