// backup.js — esportazione e importazione Excel (usa la libreria XLSX in lib/).

// Converte "lunedì 16 marzo 2026" → "2026-03-16"
function parseDateKey(formatted) {
  try {
    const months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
    const parts = formatted.toLowerCase().replace(/[,]/g,'').split(' ').filter(p => p.trim());
    // cerca numero giorno, mese testuale, anno
    let day, month, year;
    for (let i = 0; i < parts.length; i++) {
      const n = parseInt(parts[i]);
      if (!isNaN(n) && n >= 1 && n <= 31 && !day) day = n;
      else if (!isNaN(n) && n >= 2000) year = n;
      else {
        const mi = months.indexOf(parts[i]);
        if (mi !== -1) month = mi + 1;
      }
    }
    if (day && month && year) {
      return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }
  } catch {}
  return null;
}

// ── EXPORT ──
function exportExcel() {
  const sorted = Object.keys(data).sort((a,b) => b.localeCompare(a));
  const rows = [];
  sorted.forEach(date => {
    const entries = (data[date] || []).slice().sort((a,b) => a.time.localeCompare(b.time));
    entries.forEach(e => {
      rows.push({
        'Data': formatDate(date),
        'Orario': e.time,
        'Bicchieri': e.qty,
        'Dimensione (ml)': e.size,
        'Totale assunzione (ml)': e.size * e.qty,
        'Nota': e.note || '',
      });
    });
    rows.push({ 'Data': '', 'Orario': '', 'Bicchieri': '', 'Dimensione (ml)': 'TOTALE GIORNO', 'Totale assunzione (ml)': calcTotal(entries), 'Nota': '' });
    rows.push({});
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{wch:32},{wch:10},{wch:10},{wch:16},{wch:22},{wch:30}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Idratazione');
  XLSX.writeFile(wb, 'acqua-backup.xlsx');
  showToast('✅ Esportazione completata!');
}

// ── IMPORT ──
const VALID_SIZES = [100, 150, 200, 250, 300, 350, 400, 500];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB max
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function importExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Limite dimensione file
  if (file.size > MAX_FILE_SIZE) {
    showToast('❌ File troppo grande (max 2MB)', 4000);
    event.target.value = '';
    return;
  }

  // Verifica estensione
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['xlsx','xls'].includes(ext)) {
    showToast('❌ Formato file non valido', 4000);
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      // Limite numero righe
      if (rows.length > 10000) {
        showToast('❌ File con troppi dati (max 10.000 righe)', 4000);
        return;
      }

      let imported = 0;
      let skipped = 0;
      let currentDateKey = null;

      rows.forEach(row => {
        const dataVal = (row['Data'] || '').toString().trim().substring(0, 60);
        const orario  = (row['Orario'] || '').toString().trim().substring(0, 5);
        const bicchieri = parseInt(row['Bicchieri']);
        const dimensione = parseInt(row['Dimensione (ml)']);
        const nota = (row['Nota'] || '').toString().trim().substring(0, 60); // tronca a 60 chars

        // Riga totale o riga vuota → skip
        if (!dataVal || row['Dimensione (ml)'] === 'TOTALE GIORNO' || (!orario && !bicchieri)) return;

        // Risolvi la data
        if (dataVal) {
          const parsed = parseDateKey(dataVal);
          if (parsed) currentDateKey = parsed;
        }
        if (!currentDateKey) { skipped++; return; }

        // Valida orario con regex HH:MM
        if (!TIME_REGEX.test(orario)) { skipped++; return; }

        // Valida numeri con limiti sensati
        if (isNaN(bicchieri) || isNaN(dimensione) ||
            bicchieri <= 0 || bicchieri > 20 ||
            !VALID_SIZES.includes(dimensione)) {
          skipped++;
          return;
        }

        // Aggiungi senza duplicati
        if (!data[currentDateKey]) data[currentDateKey] = [];
        const exists = data[currentDateKey].some(e =>
          e.time === orario && e.size === dimensione && e.qty === bicchieri && e.note === nota
        );
        if (!exists) {
          data[currentDateKey].push({ time: orario, size: dimensione, qty: bicchieri, note: nota });
          imported++;
        } else {
          skipped++;
        }
      });

      saveData();
      render();

      // Reset input per poter reimportare lo stesso file
      event.target.value = '';

      if (imported > 0) {
        showToast(`✅ Importate ${imported} righe!`, 4000);
      } else if (skipped > 0) {
        showToast(`⚠️ Nessuna riga nuova (${skipped} già presenti o non valide)`, 4000);
      } else {
        showToast('⚠️ Nessun dato trovato nel file', 4000);
      }
    } catch(err) {
      showToast('❌ Errore nella lettura del file', 4000);
    }
  };
  reader.readAsArrayBuffer(file);
}
