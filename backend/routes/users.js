const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a la base de datos

// Obtener todos los usuarios
router.get('/', (req, res) => {
    const query = `SELECT * FROM Usuarios`;
    db.query(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuarios.' });
        }
        res.status(200).json(results);
    });
});

// Agregar un usuario
router.post('/', (req, res) => {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const query = `
        INSERT INTO Usuarios (nombre, email, contraseña, rol) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [nombre, email, contraseña, rol || 'Tester'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar usuario.' });
        }

        // Recuperar el usuario recién creado
        const selectQuery = `SELECT * FROM Usuarios WHERE id = ?`;
        db.query(selectQuery, [result.insertId], (err, newUser) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar el usuario creado.' });
            }
            res.status(201).json(newUser[0]);
        });
    });
});

// Editar un usuario
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios.' });
    }

    const query = `
        UPDATE Usuarios 
        SET nombre = ?, email = ?, rol = ? 
        WHERE id = ?
    `;
    db.query(query, [nombre, email, rol, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al editar usuario.' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Recuperar el usuario actualizado
        const selectQuery = `SELECT * FROM Usuarios WHERE id = ?`;
        db.query(selectQuery, [id], (err, updatedUser) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar el usuario actualizado.' });
            }
            res.status(200).json(updatedUser[0]);
        });
    });
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM Usuarios WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar usuario.' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(200).json({ message: 'Usuario eliminado.' });
    });
});

module.exports = router;