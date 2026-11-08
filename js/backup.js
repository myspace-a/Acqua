// backup.js — esportazione e importazione Excel (usa la libreria XLSX in lib/).

const VALID_SIZES = [100, 150, 200, 250, 300, 350, 400, 500];
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_IMPORT_ROWS = 10000;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseDateKey(formatted) {
  if (formatted === null || formatted === undefined || formatted === '') return null;
  const value = String(formatted).trim();

  // Formato ISO YYYY-MM-DD.
  let match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) return validDateKey(Number(match[1]), Number(match[2]), Number(match[3]));

  // Formati numerici italiani comuni: DD/MM/YYYY e DD-MM-YYYY.
  match = value.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (match) return validDateKey(Number(match[3]), Number(match[2]), Number(match[1]));

  // Formato italiano usato nei backup esistenti: "lunedì 16 marzo 2026".
  const months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  const parts = value.toLowerCase().replace(/[,]/g,'').split(/\s+/).filter(Boolean);
  let day, month, year;
  for (const part of parts) {
    const number = Number(part);
    if (/^\d+$/.test(part) && number >= 1 && number <= 31 && !day) day = number;
    else if (/^\d{4}$/.test(part) && number >= 2000 && number <= 9999) year = number;
    else {
      const monthIndex = months.indexOf(part);
      if (monthIndex !== -1) month = monthIndex + 1;
    }
  }
  if (day && month && year) return validDateKey(year, month, day);
  return null;
}

function formatBackupDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function validDateKey(year, month, day) {
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function excelDateToKey(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = XLSX.SSF.parse_date_code(value);
    if (date && date.y && date.m && date.d) return validDateKey(date.y, date.m, date.d);
  }
  return parseDateKey(value);
}

function exportExcel() {
  const waterRows = [];
  const waterDates = Object.keys(data).sort((a,b) => b.localeCompare(a));

  waterDates.forEach(date => {
    const entries = (data[date] || []).slice().sort((a,b) => a.time.localeCompare(b.time));
    entries.forEach(entry => {
      waterRows.push({
        'Data': formatBackupDate(date),
        'Orario': entry.time,
        'Bicchieri': entry.qty,
        'Dimensione (ml)': entry.size,
        'Totale assunzione (ml)': entry.size * entry.qty,
        'Nota': entry.note || '',
      });
    });
    waterRows.push({ 'Data': '', 'Orario': '', 'Bicchieri': '', 'Dimensione (ml)': 'TOTALE GIORNO', 'Totale assunzione (ml)': calcTotal(entries), 'Nota': '' });
    waterRows.push({});
  });

  const toiletRows = [];
  const toiletDates = Object.keys(toiletData).sort((a,b) => b.localeCompare(a));
  toiletDates.forEach(date => {
    const visits = (toiletData[date] || []).slice().sort((a,b) => a.time.localeCompare(b.time));
    visits.forEach(visit => {
      toiletRows.push({
        'Data': formatBackupDate(date),
        'Orario': visit.time,
        'Durata (secondi)': visit.duration === null || visit.duration === undefined ? '' : visit.duration,
      });
    });
    toiletRows.push({ 'Data': '', 'Orario': '', 'Durata (secondi)': 'TOTALE GIORNO' });
    toiletRows.push({});
  });

  const workbook = XLSX.utils.book_new();
  const waterSheet = XLSX.utils.json_to_sheet(waterRows);
  waterSheet['!cols'] = [{wch:32},{wch:10},{wch:10},{wch:16},{wch:22},{wch:30}];
  XLSX.utils.book_append_sheet(workbook, waterSheet, 'Idratazione');

  const toiletSheet = XLSX.utils.json_to_sheet(toiletRows);
  toiletSheet['!cols'] = [{wch:32},{wch:10},{wch:20}];
  XLSX.utils.book_append_sheet(workbook, toiletSheet, 'Bagno');

  XLSX.writeFile(workbook, 'acqua-backup.xlsx');
  showToast(uiPreferences.language === 'en' ? '✅ Export complete!' : '✅ Esportazione completata!');
}

function importExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > MAX_FILE_SIZE) {
    showToast(uiPreferences.language === 'en' ? '❌ File is too large (max 2 MB)' : '❌ File troppo grande (max 2MB)', 4000);
    event.target.value = '';
    return;
  }

  const extension = file.name.split('.').pop().toLowerCase();
  if (!['xlsx','xls'].includes(extension)) {
    showToast(uiPreferences.language === 'en' ? '❌ Invalid file format' : '❌ Formato file non valido', 4000);
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(loadEvent) {
    try {
      const workbook = XLSX.read(loadEvent.target.result, { type: 'array', cellDates: true });
      const waterSheet = workbook.Sheets['Idratazione'] ||
        (workbook.Sheets['Bagno'] ? null : workbook.Sheets[workbook.SheetNames[0]]);
      const waterRows = waterSheet
        ? XLSX.utils.sheet_to_json(waterSheet, { defval: '', raw: false })
        : [];
      const toiletSheet = workbook.Sheets['Bagno'];
      const toiletRows = toiletSheet
        ? XLSX.utils.sheet_to_json(toiletSheet, { defval: '', raw: false })
        : [];

      if (waterRows.length + toiletRows.length > MAX_IMPORT_ROWS) {
        showToast(uiPreferences.language === 'en' ? '❌ File has too many rows (max 10,000)' : '❌ File con troppe righe (max 10.000)', 4000);
        return;
      }

      const waterResult = importWaterRows(waterRows);
      const toiletResult = importToiletRows(toiletRows);

      saveData();
      saveToiletData();
      render();
      event.target.value = '';

      const imported = waterResult.imported + toiletResult.imported;
      const skipped = waterResult.skipped + toiletResult.skipped;
      if (imported > 0) {
        showToast(uiPreferences.language === 'en' ? `✅ Imported ${imported} records${skipped ? ` · ${skipped} skipped` : ''}` : `✅ Importati ${imported} record${skipped ? ` · ${skipped} ignorati` : ''}`, 4500);
      } else if (skipped > 0) {
        showToast(uiPreferences.language === 'en' ? `⚠️ No new records · ${skipped} skipped or already present` : `⚠️ Nessun record nuovo · ${skipped} ignorati o già presenti`, 4500);
      } else {
        showToast(uiPreferences.language === 'en' ? '⚠️ No data found in the file' : '⚠️ Nessun dato trovato nel file', 4000);
      }
    } catch (error) {
      event.target.value = '';
      showToast(uiPreferences.language === 'en' ? '❌ Could not read the file' : '❌ Errore nella lettura del file', 4000);
    }
  };
  reader.onerror = function() {
    event.target.value = '';
    showToast(uiPreferences.language === 'en' ? '❌ Could not read the file' : '❌ Impossibile leggere il file', 4000);
  };
  reader.readAsArrayBuffer(file);
}

function importWaterRows(rows) {
  let imported = 0;
  let skipped = 0;
  let currentDateKey = null;

  rows.forEach(row => {
    const rawDate = (row['Data'] || '').toString().trim().substring(0, 60);
    const time = (row['Orario'] || '').toString().trim().substring(0, 5);
    const glasses = parseInt(row['Bicchieri'], 10);
    const size = parseInt(row['Dimensione (ml)'], 10);
    const note = (row['Nota'] || '').toString().trim().substring(0, 60);

    if (!rawDate || row['Dimensione (ml)'] === 'TOTALE GIORNO' || (!time && !row['Bicchieri'])) return;

    const parsedDate = excelDateToKey(rawDate);
    if (parsedDate) currentDateKey = parsedDate;
    else if (rawDate) { skipped++; return; }
    if (!currentDateKey) { skipped++; return; }

    if (!TIME_REGEX.test(time) || !Number.isInteger(glasses) || !Number.isInteger(size) ||
        glasses < 1 || glasses > 20 || !VALID_SIZES.includes(size)) {
      skipped++;
      return;
    }

    if (!data[currentDateKey]) data[currentDateKey] = [];
    const duplicateIndex = data[currentDateKey].findIndex(entry =>
      entry.time === time && Number(entry.size) === size && Number(entry.qty) === glasses && (entry.note || '') === note
    );
    if (duplicateIndex === -1) {
      data[currentDateKey].push({ time, size, qty: glasses, note });
      imported++;
    } else {
      skipped++;
    }
  });

  return { imported, skipped };
}

function importToiletRows(rows) {
  let imported = 0;
  let skipped = 0;
  let currentDateKey = null;

  rows.forEach(row => {
    const rawDate = (row['Data'] || '').toString().trim().substring(0, 60);
    const time = (row['Orario'] || '').toString().trim();
    const rawDuration = row['Durata (secondi)'];

    // Righe vuote e righe di riepilogo non rappresentano visite.
    if (!rawDate && !time && (rawDuration === '' || rawDuration === null || rawDuration === undefined)) return;
    if (String(rawDuration).toUpperCase().includes('TOTALE')) return;

    const parsedDate = excelDateToKey(rawDate);
    if (parsedDate) currentDateKey = parsedDate;
    else { skipped++; return; }
    if (!TIME_REGEX.test(time)) { skipped++; return; }

    let duration = null;
    if (rawDuration !== '' && rawDuration !== null && rawDuration !== undefined) {
      const value = typeof rawDuration === 'number' ? rawDuration : Number(String(rawDuration).trim());
      if (!Number.isInteger(value) || value < 1 || value > 3600) {
        skipped++;
        return;
      }
      duration = value;
    }

    if (!toiletData[currentDateKey]) toiletData[currentDateKey] = [];
    const duplicate = toiletData[currentDateKey].some(visit => {
      const existingDuration = visit.duration === null || visit.duration === undefined || visit.duration === ''
        ? null
        : Number(visit.duration);
      return visit.time === time && existingDuration === duration;
    });

    if (!duplicate) {
      toiletData[currentDateKey].push({ time, duration });
      imported++;
    } else {
      skipped++;
    }
  });

  return { imported, skipped };
}
