// js/city-average.js

// --- API-URL für eine Stadt ---
const API_CITY = (city) =>
    `https://im3.rebecca-baumberger.ch/php/unload.php?city=${encodeURIComponent(city)}`;

// --- Durchschnitts-Helfer ---
function averagePm10(rows) {
    const values = rows.map(r => Number(r.pm10)).filter(Number.isFinite);
    const n = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    return { n, avg: n ? sum / n : 0 };
}

// --- Aktuellster Wert ---
function currentPm10(rows) {
    if (rows.length === 0) return null;

    // Sortiere nach Datum (neueste zuerst)
    const sorted = rows
        .filter(r => r.datetimelocal && Number.isFinite(Number(r.pm10)))
        .sort((a, b) => new Date(b.datetimelocal) - new Date(a.datetimelocal));

    return sorted.length > 0 ? Number(sorted[0].pm10) : null;
}

// --- Minimal- und Maximalwerte ---
function minPm10(rows) {
    const values = rows.map(r => Number(r.pm10)).filter(Number.isFinite);
    return values.length ? Math.min(...values) : null;
}

function maxPm10(rows) {
    const values = rows.map(r => Number(r.pm10)).filter(Number.isFinite);
    return values.length ? Math.max(...values) : null;
}

// --- kleines Setter-Utility ---
function setText(sel, text) {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
}

async function renderCityAverage() {
    const city = document.body.dataset.city;
    if (!city) return console.error('data-city fehlt auf <body>.');

    const res = await fetch(API_CITY(city));
    if (!res.ok) throw new Error(`HTTP ${res.status} für ${city}`);
    const data = await res.json();  // [{city, pm10, datetimelocal, ...}, ...]

    // All-Time 
    const { n, avg } = averagePm10(data);
    setText('#pm10-avg', avg.toFixed(2));
    setText('#pm10-n', String(n));
    const min = minPm10(data);
    const max = maxPm10(data);
    const current = currentPm10(data);
    setText('#pm10-min', min !== null ? min.toFixed(2) : '–');
    setText('#pm10-max', max !== null ? max.toFixed(2) : '–');
    setText('#pm10-current', current !== null ? current.toFixed(2) : '–');

    // (Optional) Falls die Übersichtstabelle auf der Seite bleiben soll,
    // kannst du hier die eine Zeile für diese Stadt füllen:
    const tbody = document.querySelector('#avg-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${city}</td><td>${n}</td><td>${avg.toFixed(2)}</td><td>${min.toFixed(2)}</td><td>${max.toFixed(2)}</td>`;
        tbody.appendChild(tr);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCityAverage().catch(err => {
        console.error(err);
        setText('#pm10-avg', '–');
        setText('#pm10-min', '–');
        setText('#pm10-max', '–');
        setText('#pm10-current', '–');
        setText('#pm10-n', '0');
        const tbody = document.querySelector('#avg-table tbody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="5">Fehler beim Laden</td></tr>`;
    });
});
