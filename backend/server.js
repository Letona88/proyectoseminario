const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./db'); // Importar la configuración de conexión a la base de datos
const projectRoutes = require('./routes/projects');
const testRoutes = require('./routes/tests');
const defectRoutes = require('./routes/defects');
const userRoutes = require('./routes/users');
const assignmentRoutes = require('./routes/assignments');
const authRoutes = require('./routes/auth');
const cors = require('cors');


// Configurar dotenv para cargar las variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(bodyParser.json()); // Manejar datos JSON en las solicitudes
app.use('/api/projects', projectRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/defects', defectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use(cors({ origin: 'http://64.23.251.147' }));


// Rutas de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente 🚀');
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://64.23.251.147:${PORT}`);
});