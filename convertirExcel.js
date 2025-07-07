const XLSX = require('xlsx');
const fs = require('fs');

// Define el nombre del archivo Excel de entrada
const excelFilePath = 'historias.xlsx';
// Define el nombre del archivo JSON de salida
const jsonFilePath = 'historias-limpio-final.json';

try {
    // 1. Cargar el archivo Excel
    const workbook = XLSX.readFile(excelFilePath);

    // Asume que la primera hoja es la que contiene los datos
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 2. Convertir la hoja a un arreglo de objetos JSON
    const dataWithHeaders = XLSX.utils.sheet_to_json(worksheet);

    // 3. Escribir los datos JSON en el archivo de salida
    fs.writeFileSync(jsonFilePath, JSON.stringify(dataWithHeaders, null, 2), 'utf8');

    console.log(`Datos de '${excelFilePath}' convertidos y guardados en '${jsonFilePath}' exitosamente.`);

} catch (error) {
    console.error('Ocurrió un error al procesar el archivo:', error);
    if (error.code === 'ENOENT') {
        console.error(`Asegúrate de que el archivo '${excelFilePath}' exista en el mismo directorio que este script.`);
    } else {
        console.error('Error detallado:', error.message);
    }
}