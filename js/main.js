// main.js — avvio dell'app e collegamento dei pulsanti.

const UI_TEXT = {
  it: {
    menu:'Menu', backup:'Backup Excel', settings:'Impostazioni', language:'Lingua', information:'Informazioni',
    layout:'Layout', singlePage:'Pagina singola', twoTabs:'Due schede', glassCounter:'Contatore bicchieri',
    inputTab:'Inserimento', summaryTab:'Riepilogo', selectedDate:'Giorno selezionato', waterInput:'Assunzione Acqua',
    waterTimeline:'Assunzioni Acqua', totalWater:'Totale assunzioni acqua', bathroomInput:'Bagno',
    bathroomTimeline:'Visite in bagno', visitSummary:'Riepilogo visite', time:'Orario', volume:'Volume', glasses:'Numero bicchieri',
    duration:'Durata (secondi)', optional:'Facoltativa', addWater:'+ Aggiungi', addVisit:'+ Registra visita',
    noWater:'Nessuna assunzione registrata', noVisits:'Nessuna visita registrata', waterEntries:'Assunzioni',
    totalGlasses:'Bicchieri totali', visits:'Visite', totalSeconds:'Secondi totali', history:'Storico',
    export:'Esporta Excel', import:'Importa Excel', close:'Chiudi', previousDay:'Giorno precedente',
    nextDay:'Giorno successivo', waterDelete:'Elimina assunzione', visitDelete:'Elimina visita',
    total:'Totale', goalReached:'Obiettivo raggiunto!', goalProgress:'{pct}% dell’obiettivo ({goal} ml)',
    entries:'assunzioni', glassesPlural:'bicchieri', bathroomVisits:'visite bagno', seconds:'secondi',
    durationNotGiven:'Durata non indicata', showHistory:'Mostra storico', hideHistory:'Nascondi storico',
    prev:'Giorno precedente', next:'Giorno successivo'
  },
  en: {
    menu:'Menu', backup:'Excel Backup', settings:'Settings', language:'Language', information:'Information',
    layout:'Layout', singlePage:'Single-page', twoTabs:'Two-tab', glassCounter:'Glass counter',
    inputTab:'Input', summaryTab:'Summary', selectedDate:'Selected date', waterInput:'Water',
    waterTimeline:'Water Intake', totalWater:'Total Water Intake', bathroomInput:'Bathroom',
    bathroomTimeline:'Bathroom Visits', visitSummary:'Visit Summary', time:'Time', volume:'Volume', glasses:'Number of glasses',
    duration:'Duration (seconds)', optional:'Optional', addWater:'+ Add water', addVisit:'+ Record visit',
    noWater:'No water intake recorded', noVisits:'No bathroom visits recorded', waterEntries:'Water entries',
    totalGlasses:'Total glasses', visits:'Visits', totalSeconds:'Total seconds', history:'History',
    export:'Export Excel', import:'Import Excel', close:'Close', previousDay:'Previous day',
    nextDay:'Next day', waterDelete:'Delete water entry', visitDelete:'Delete visit',
    total:'Total', goalReached:'Goal reached!', goalProgress:'{pct}% of goal ({goal} ml)',
    entries:'entries', glassesPlural:'glasses', bathroomVisits:'bathroom visits', seconds:'seconds',
    durationNotGiven:'Duration not provided', showHistory:'Show history', hideHistory:'Hide history',
    prev:'Previous day', next:'Next day'
  }
};

function t(key) {
  const language = uiPreferences && uiPreferences.language === 'en' ? 'en' : 'it';
  return UI_TEXT[language][key] || UI_TEXT.it[key] || key;
}

function translateUi() {
  document.documentElement.lang = uiPreferences.language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-date-step="-1"]').forEach(button => button.setAttribute('aria-label', t('previousDay')));
  document.querySelectorAll('[data-date-step="1"]').forEach(button => button.setAttribute('aria-label', t('nextDay')));
  document.getElementById('menuButton').setAttribute('aria-label', uiPreferences.language === 'en' ? 'Open menu' : 'Apri menu');
  document.getElementById('mainMenu').setAttribute('aria-label', uiPreferences.language === 'en' ? 'Main menu' : 'Menu principale');
  document.getElementById('volumeChoices').setAttribute('aria-label', t('volume'));
  document.getElementById('tabBar').setAttribute('aria-label', uiPreferences.language === 'en' ? 'Sections' : 'Sezioni');
  document.getElementById('qtyMinus').setAttribute('aria-label', uiPreferences.language === 'en' ? 'Decrease' : 'Diminuisci');
  document.getElementById('qtyPlus').setAttribute('aria-label', uiPreferences.language === 'en' ? 'Increase' : 'Aumenta');
  document.querySelectorAll('[data-menu-action]').forEach(button => {
    const groupId = { backup:'backupMenu', settings:'settingsMenu', language:'languageMenu' }[button.dataset.menuAction];
    if (groupId) button.setAttribute('aria-expanded', String(!document.getElementById(groupId).hidden));
  });
  const historyButton = document.getElementById('toggleBtn');
  historyButton.setAttribute('aria-label', historyButton.getAttribute('aria-expanded') === 'true' ? t('hideHistory') : t('showHistory'));
  document.querySelectorAll('[data-language-choice]').forEach(button => {
    const active = button.dataset.languageChoice === uiPreferences.language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

// ── SERVICE WORKER ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ── INIT ──
loadUiPreferences();
loadData();
loadToiletData();
selectedDate = getTodayKey();
document.getElementById('dateInput').value = selectedDate;
document.getElementById('dateLabel').textContent = formatDate(selectedDate);
document.getElementById('summaryDateInput').value = selectedDate;
document.getElementById('summaryDateLabel').textContent = formatDate(selectedDate);
document.getElementById('timeInput').value = getNowTime();
document.getElementById('toiletTimeInput').value = getNowTime();

// Event listeners - nessun handler inline nell'HTML.
document.getElementById('dateInput').addEventListener('change', function(event) { selectDay(event.target.value); });
document.getElementById('summaryDateInput').addEventListener('change', function(event) { selectDay(event.target.value); });
document.getElementById('sizeSelect').addEventListener('change', updateQtyMl);
document.querySelectorAll('.volume-choice').forEach(button => button.addEventListener('click', function() {
  document.getElementById('sizeSelect').value = this.dataset.size;
  document.getElementById('sizeSelect').dispatchEvent(new Event('change', { bubbles: true }));
}));
document.querySelectorAll('[data-date-step]').forEach(button => button.addEventListener('click', function() {
  const date = new Date(`${selectedDate}T12:00:00`);
  date.setDate(date.getDate() + Number(this.dataset.dateStep));
  selectDay(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
}));
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

translateUi();
applyLayout();
render();

function applyLayout() {
  const app = document.getElementById('app');
  app.dataset.layout = uiPreferences.layout;
  app.dataset.activeTab = 'input';
  document.getElementById('tabBar').hidden = uiPreferences.layout !== 'tabs';
  document.querySelectorAll('.tab-button').forEach(button => {
    const active = button.dataset.tab === 'input';
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  document.getElementById('glassCounterSetting').checked = uiPreferences.glassCounter;
  document.getElementById('qtyField').hidden = !uiPreferences.glassCounter;
  document.getElementById('sizeSelect').value = String(uiPreferences.waterSize);
  document.querySelectorAll('.volume-choice').forEach(button => {
    const active = Number(button.dataset.size) === uiPreferences.waterSize;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-layout-choice]').forEach(button => {
    const active = button.dataset.layoutChoice === uiPreferences.layout;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.getElementById('summaryDateInput').value = selectedDate;
  document.getElementById('summaryDateLabel').textContent = formatDate(selectedDate);
  updateQtyMl();
}

function setLayout(layout) {
  if (layout !== 'single' && layout !== 'tabs') return;
  uiPreferences.layout = layout;
  saveUiPreferences();
  applyLayout();
}

document.getElementById('menuButton').addEventListener('click', function() {
  const menu = document.getElementById('mainMenu');
  menu.hidden = !menu.hidden;
  this.setAttribute('aria-expanded', String(!menu.hidden));
});

document.addEventListener('click', function(event) {
  const menu = document.getElementById('mainMenu');
  if (!menu.hidden && !event.target.closest('.app-header')) {
    menu.hidden = true;
    document.getElementById('menuButton').setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('[data-menu-action]').forEach(button => button.addEventListener('click', function() {
  if (this.dataset.menuAction === 'settings') {
    toggleMenuGroup(this, 'settingsMenu');
  } else if (this.dataset.menuAction === 'language') {
    toggleMenuGroup(this, 'languageMenu');
  } else if (this.dataset.menuAction === 'backup') {
    toggleMenuGroup(this, 'backupMenu');
  } else if (this.dataset.menuAction === 'information') {
    closeMenu();
    document.getElementById('infoDialog').showModal();
  }
}));

document.querySelectorAll('[data-layout-choice]').forEach(button => button.addEventListener('click', function() {
  setLayout(this.dataset.layoutChoice);
  closeMenu();
}));

document.querySelectorAll('[data-language-choice]').forEach(button => button.addEventListener('click', function() {
  uiPreferences.language = this.dataset.languageChoice;
  saveUiPreferences();
  translateUi();
  render();
  document.querySelectorAll('[data-language-choice]').forEach(choice => {
    const active = choice === this;
    choice.classList.toggle('active', active);
    choice.setAttribute('aria-pressed', String(active));
  });
  closeMenu();
}));

document.querySelectorAll('[data-backup-action]').forEach(button => button.addEventListener('click', function() {
  if (document.getElementById('app').dataset.layout === 'tabs') setActiveTab('summary');
  closeMenu();
  if (this.dataset.backupAction === 'export') exportExcel();
  else document.getElementById('importFileInput').click();
}));

document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', function() {
  setActiveTab(this.dataset.tab);
}));

document.getElementById('tabBar').addEventListener('keydown', function(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const tab = event.key === 'Home' ? 'input' : event.key === 'End' ? 'summary' :
    (document.getElementById('app').dataset.activeTab === 'input' ? 'summary' : 'input');
  setActiveTab(tab);
  document.querySelector(`[data-tab="${tab}"]`).focus();
});

document.getElementById('glassCounterSetting').addEventListener('change', function() {
  uiPreferences.glassCounter = this.checked;
  saveUiPreferences();
  if (!this.checked) {
    formQty = 1;
    document.getElementById('qtyNum').textContent = formQty;
    updateQtyMl();
  }
  document.getElementById('qtyField').hidden = !this.checked;
});

document.getElementById('sizeSelect').addEventListener('change', function() {
  uiPreferences.waterSize = Number(this.value);
  saveUiPreferences();
  document.querySelectorAll('.volume-choice').forEach(button => {
    const active = Number(button.dataset.size) === uiPreferences.waterSize;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
});

document.getElementById('closeInfo').addEventListener('click', function() { document.getElementById('infoDialog').close(); });
document.getElementById('infoDialog').addEventListener('click', function(event) {
  if (event.target === this) this.close();
});
document.getElementById('infoDialog').addEventListener('close', function() { document.getElementById('menuButton').focus(); });
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') closeMenu();
});

function setActiveTab(tabName) {
  document.getElementById('app').dataset.activeTab = tabName;
  document.querySelectorAll('.tab-button').forEach(tab => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
}

function closeMenu() {
  const menu = document.getElementById('mainMenu');
  menu.hidden = true;
  document.getElementById('menuButton').setAttribute('aria-expanded', 'false');
  document.getElementById('menuButton').focus();
}

function toggleMenuGroup(button, groupId) {
  const group = document.getElementById(groupId);
  group.hidden = !group.hidden;
  button.setAttribute('aria-expanded', String(!group.hidden));
}
