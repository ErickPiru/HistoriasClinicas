let datos = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const loadingMessage = document.getElementById('loadingMessage');
    const noResultsMessage = document.getElementById('noResultsMessage');

    loadingMessage.style.display = 'block';

    // ✅ Cargar JSON limpio
    fetch('historias-limpio-final.json')
        .then(response => response.json())
        .then(data => {
            datos = data; // ✅ Asignar a variable global
            loadingMessage.style.display = 'none';
        })
        .catch(error => {
            console.error('Error cargando JSON:', error);
            loadingMessage.textContent = 'Error al cargar datos.';
        });

    searchButton.addEventListener('click', () => {
        const termino = searchInput.value.trim().toLowerCase();
        resultsTable.innerHTML = '';
        noResultsMessage.style.display = 'none';

        if (termino === '') return;

        const resultados = datos.filter(fila => {
            const ap = String(fila['APELLIDO PATERNO'] || '').toLowerCase();
            const nom = String(fila['NOMBRES'] || '').toLowerCase();
            const dni = String(fila['DNI'] || '').toLowerCase();

            return ap.includes(termino) || nom.includes(termino) || dni.includes(termino);
        });

        if (resultados.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            resultados.forEach(fila => {
                const filaHTML = `
                    <tr>
                        <td>${fila['NRO'] || ''}</td>
                        <td>${fila['APELLIDO PATERNO'] || ''}</td>
                        <td>${fila['APELLIDO MATERNO'] || ''}</td>
                        <td>${fila['NOMBRES'] || ''}</td>
                        <td>${fila['DNI'] || ''}</td>
                        <td>${fila['ZONA "A" LIMON  POR EL CENTRO'] || ''}</td>
                        <td>${fila['ZONA "B" LIMON POR EL COLEGIO, LA RINCONADA'] || ''}</td>
                        <td>${fila['ZONA "C" LA PALMA'] || ''}</td>
                        <td>${fila['ZONA "P" EL PRADO'] || ''}</td>
                        <td>${fila['NRO DE TRANSEUNTES'] || ''}</td>
                    </tr>`;
                resultsTable.innerHTML += filaHTML;
            });
        }
    });
});



