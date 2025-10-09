
// fetch('https://im3.rebecca-baumberger.ch/php/unload.php')
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Fehler:', error);
//     });

console.log("Hello, World!");

// Korrekte ID verwenden (gleich wie im HTML)
let myChart = document.querySelector('#airQualityChart');

// Prüfen ob Element existiert
if (!myChart) {
    console.error('Canvas element with id "airQualityChart" not found!');
} else {
    console.log('Canvas element found:', myChart);
}

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
    labels: labels,
    datasets: [
        {
            label: 'Fully Rounded',
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 2,
            borderRadius: Number.MAX_VALUE,
            borderSkipped: false,
        },
        {
            label: 'Small Radius',
            data: [28, 48, 40, 19, 86, 27, 90],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
        }
    ]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Air Quality Chart'
            }
        }
    },
};

// Chart nur erstellen wenn Canvas Element existiert
if (myChart) {
    const chart = new Chart(myChart, config);
    console.log('Chart created successfully:', chart);
} else {
    console.error('Cannot create chart: Canvas element not found');
}


/// average city function ///

const cities = ["Bangalore", "Delhi", "Chennai", "Mumbai", "Kolkata"];

const cityEndpoint = city => `https://im3.rebecca-baumberger.ch/php/unload.php?city=${encodeURIComponent(city)}`;

function averagePm10FromRows(rows) {
    const values = rows
        .map(r => parseFloat(r.pm10))
        .filter(v => Number.isFinite(v));
    const n = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    return { n, avg: n ? sum / n : 0 };
}

async function fetchCityAverage(city) {
    const res = await fetch(cityEndpoint(city));
    if (!res.ok) throw new Error(`HTTP ${res.status} für ${city}`);
    const data = await res.json();
    const { n, avg } = averagePm10FromRows(data);
    return { city, n, avg: Number(avg.toFixed(2)) };
}

async function loadAllAverages() {
    const tbody = document.querySelector('#avg-table tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

    try {
        const results = await Promise.allSettled(cities.map(fetchCityAverage));
        const ok = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);

        tbody.innerHTML = '';
        ok.forEach(({ city, n, avg }) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${city}</td><td>${n}</td><td>${avg.toFixed(2)}</td>`;
            tbody.appendChild(tr);
        });

        results
            .filter(r => r.status === 'rejected')
            .forEach((r, i) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${cities[i]}</td><td>-</td><td>Error</td>`;
                tbody.appendChild(tr);
                console.error(`Fehler bei ${cities[i]}:`, r.reason);
            });

    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="3">Fehler beim Laden</td></tr>`;
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', loadAllAverages);