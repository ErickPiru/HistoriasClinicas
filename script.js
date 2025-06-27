let datos = [];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const loadingMessage = document.getElementById('loadingMessage');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Mostrar mensaje de carga
    loadingMessage.style.display = 'block';

    // Cargar el archivo Excel automáticamente
    fetch('HISTORIAS%20CLINICAS.XLSX')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const hoja = workbook.Sheets[workbook.SheetNames[0]];
            datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });
            loadingMessage.style.display = 'none';
        })
        .catch(error => {
            console.error('Error al cargar el archivo Excel:', error);
            loadingMessage.textContent = 'Error al cargar el archivo Excel.';
        });

    // Función de búsqueda
    searchButton.addEventListener('click', () => {
        const termino = searchInput.value.toLowerCase().trim();
        resultsTable.innerHTML = '';
        noResultsMessage.style.display = 'none';

        if (termino === '') return;

        const resultados = datos.filter(fila => {
            return (
                fila['APELLIDO PATERNO']?.toLowerCase().includes(termino) ||
                fila['NOMBRES']?.toLowerCase().includes(termino) ||
                String(fila['DNI'])?.includes(termino)
            );
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
                        <td>${fila['ZONA "A" LIMON POR EL CENTRO'] || ''}</td>
                        <td>${fila['ZONA "B" LIMON POR EL COLEGIO LA RINCONADA'] || ''}</td>
                        <td>${fila['ZONA "C" LA PALMA'] || ''}</td>
                        <td>${fila['ZONA "D" EL PRADO'] || ''}</td>
                        <td>${fila['NRO DE TRANSEUNTES'] || ''}</td>
                    </tr>
                `;
                resultsTable.innerHTML += filaHTML;
            });
        }
    });
});
