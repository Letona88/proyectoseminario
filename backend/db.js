const mysql = require('mysql2');

// Configuración de conexión
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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