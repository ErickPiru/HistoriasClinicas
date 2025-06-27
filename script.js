document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const excelFileInput = document.getElementById('excelFileInput');
    const loadingMessage = document.getElementById('loadingMessage');
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let excelData = []; // Esto almacenará los datos de Excel parseados

    // Función para cargar el archivo Excel
    excelFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            loadingMessage.style.display = 'block';
            noResultsMessage.style.display = 'none';
            resultsTableBody.innerHTML = ''; // Limpiar resultados previos

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convertir la hoja a un array JSON
                excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Suponiendo que la primera fila son los encabezados, quítala de los datos para la búsqueda
                // Si tu primera fila son realmente encabezados, es posible que quieras omitirla para la búsqueda
                // excelData.shift(); // Descomentar si tu primera fila son puramente encabezados y no datos

                loadingMessage.style.display = 'none';
                alert('Archivo Excel cargado exitosamente.');
                console.log('Datos de Excel:', excelData); // Para depuración
            };
            reader.onerror = (error) => {
                loadingMessage.style.display = 'none';
                console.error('Error al leer el archivo:', error);
                alert('Error al leer el archivo Excel.');
            };
            reader.readAsArrayBuffer(file);
        }
    });

    // Función para realizar la búsqueda
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        resultsTableBody.innerHTML = ''; // Limpiar resultados previos
        noResultsMessage.style.display = 'none';

        if (searchTerm === '') {
            return; // No buscar si la entrada está vacía
        }

        if (excelData.length === 0) {
            noResultsMessage.textContent = 'Por favor, cargue un archivo Excel primero.';
            noResultsMessage.style.display = 'block';
            return;
        }

        let foundResults = false;
        // Asumiendo que las columnas de tus datos de Excel están en este orden:
        // NRO, APELLIDO PATERNO, APELLIDO MATERNO, NOMBRES, DNI, ZONA "A", ZONA "B", ZONA "C", ZONA "D", NRO DE TRANSEUNTES
        // Ajusta los índices de las columnas según la estructura real de tu archivo Excel.
        // Para demostración, asumamos:
        // APELLIDO PATERNO es índice 1
        // NOMBRES es índice 3
        // DNI es índice 4
        // ZONA "A" es índice 5
        // ZONA "B" es índice 6
        // etc.

        excelData.forEach((row, index) => {
            // Omitir la fila de encabezado si todavía está en excelData y la estás tratando como datos
            if (index === 0) return; // Suponiendo que la primera fila son los encabezados

            const apellidoPaterno = (row[1] || '').toString().toLowerCase();
            const nombres = (row[3] || '').toString().toLowerCase();
            const dni = (row[4] || '').toString().toLowerCase();
            const zonaA = (row[5] || '').toString().toLowerCase(); // "Número de Historia Clínica" para la Zona A
            const zonaB = (row[6] || '').toString().toLowerCase(); // "Número de Historia Clínica" para la Zona B
            const zonaC = (row[7] || '').toString().toLowerCase();
            const zonaD = (row[8] || '').toString().toLowerCase();

            // Buscar en las columnas relevantes
            if (apellidoPaterno.includes(searchTerm) ||
                nombres.includes(searchTerm) ||
                dni.includes(searchTerm) ||
                zonaA.includes(searchTerm) || // Buscar en "Zona A" el número de historia
                zonaB.includes(searchTerm) || // Buscar en "Zona B" el número de historia
                zonaC.includes(searchTerm) ||
                zonaD.includes(searchTerm)) {

                foundResults = true;
                const rowElement = document.createElement('tr');
                // Crear celdas de tabla para cada columna
                row.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    rowElement.appendChild(td);
                });
                resultsTableBody.appendChild(rowElement);
            }
        });

        if (!foundResults) {
            noResultsMessage.textContent = 'No se encontraron resultados para su búsqueda.';
            noResultsMessage.style.display = 'block';
        }
    };

    // Event listener para el clic del botón de búsqueda
    searchButton.addEventListener('click', performSearch);

    // Event listener para la tecla Enter en el campo de búsqueda
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Mensaje inicial para cargar Excel
    noResultsMessage.textContent = 'Por favor, cargue un archivo Excel para comenzar la búsqueda.';
    noResultsMessage.style.display = 'block';

    // IMPORTANTE: Debes incluir la librería SheetJS en tu HTML para que este JavaScript funcione.
    // Agrega esta línea en tu HTML dentro de la sección <head> o antes de la etiqueta <script> de script.js:
    // <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
});