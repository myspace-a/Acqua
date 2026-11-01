// storage.js — carica e salva i dati. E' l'UNICO file che usa localStorage.
// Le chiavi e il formato dei dati esistenti devono restare compatibili.

const STORAGE_KEY = 'water-tracker-v2-timed';
const TOILET_STORAGE_KEY = 'toilet-tracker-v1';
let data = {};
let toiletData = {};

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
