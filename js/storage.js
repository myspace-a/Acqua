// storage.js — carica e salva i dati. E' l'UNICO file che usa localStorage.
// Chiave e formato dei dati NON vanno cambiati (altrimenti si perde lo storico).

const STORAGE_KEY = 'water-tracker-v2-timed';
let data = {};

function loadData() {
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { data = {}; }
}
function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}
