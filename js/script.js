
fetch('https://im3.rebecca-baumberger.ch/php/unload.php')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Fehler:', error);
    });