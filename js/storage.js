// storage.js — carica e salva i dati. E' l'UNICO file che usa localStorage.
// Le chiavi e il formato dei dati esistenti devono restare compatibili.

const STORAGE_KEY = 'water-tracker-v2-timed';
const TOILET_STORAGE_KEY = 'toilet-tracker-v1';
const UI_PREFERENCES_KEY = 'aqua-tracker-ui-preferences-v1';
let data = {};
let toiletData = {};
let uiPreferences = { layout: 'single', language: 'it', glassCounter: false, waterSize: 200 };

function loadUiPreferences() {
  try {
    const stored = JSON.parse(localStorage.getItem(UI_PREFERENCES_KEY) || '{}');
    const layout = stored && (stored.layout === 'tabs' || stored.layout === 'single') ? stored.layout : 'single';
    const language = stored && (stored.language === 'it' || stored.language === 'en') ? stored.language : 'it';
    const sizes = [100, 150, 200, 250, 300, 400];
    const waterSize = stored && sizes.includes(Number(stored.waterSize)) ? Number(stored.waterSize) : 200;
    uiPreferences = {
      layout,
      language,
      glassCounter: Boolean(stored && stored.glassCounter),
      waterSize
    };
  } catch {
    uiPreferences = { layout: 'single', language: 'it', glassCounter: false, waterSize: 200 };
  }
}

function saveUiPreferences() {
  try { localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(uiPreferences)); } catch {}
}

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    data = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  } catch {
    data = {};
  }
}
function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}
function loadToiletData() {
  try {
    const stored = JSON.parse(localStorage.getItem(TOILET_STORAGE_KEY) || '{}');
    toiletData = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  } catch {
    toiletData = {};
  }
}
function saveToiletData() {
  try { localStorage.setItem(TOILET_STORAGE_KEY, JSON.stringify(toiletData)); } catch {}
}
