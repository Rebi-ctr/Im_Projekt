
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


