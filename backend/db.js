const mysql = require('mysql2');

// Configuración de conexión
const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1', // Usa el valor del .env o un valor por defecto
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'test_management',
});

// Exportar la conexión para usarla en otros archivos
module.exports = db;

// Probar la conexión
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

module.exports = db;