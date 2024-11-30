const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }

    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar usuario.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        const user = results[0];

        // Comparación directa de contraseñas
        if (contraseña !== user.contraseña) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // Enviar datos del usuario (sin incluir la contraseña)
        res.json({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
        });
    });
});

module.exports = router;