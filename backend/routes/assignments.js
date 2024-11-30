const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a la base de datos

// Obtener usuarios asignados a un proyecto
router.get('/:proyecto_id', (req, res) => {
    const { proyecto_id } = req.params;
    const query = `
        SELECT u.id, u.nombre, u.email, u.rol 
        FROM UsuariosProyectos up
        JOIN Usuarios u ON up.usuario_id = u.id
        WHERE up.proyecto_id = ?
    `;
    db.query(query, [proyecto_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuarios asignados.' });
        }
        res.status(200).json(results);
    });
});

// Asignar un usuario a un proyecto
router.post('/', (req, res) => {
    const { proyecto_id, usuario_id } = req.body;

    if (!proyecto_id || !usuario_id) {
        return res.status(400).json({ error: 'Proyecto y usuario son obligatorios.' });
    }

    const query = `
        INSERT INTO UsuariosProyectos (proyecto_id, usuario_id) 
        VALUES (?, ?)
    `;
    db.query(query, [proyecto_id, usuario_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al asignar usuario al proyecto.' });
        }
        res.status(201).json({ id: result.insertId, proyecto_id, usuario_id });
    });
});

// Eliminar un usuario de un proyecto
router.delete('/:proyecto_id/:usuario_id', (req, res) => {
    const { proyecto_id, usuario_id } = req.params;

    const query = `
        DELETE FROM UsuariosProyectos 
        WHERE proyecto_id = ? AND usuario_id = ?
    `;
    db.query(query, [proyecto_id, usuario_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar usuario del proyecto.' });
        }
        res.status(200).json({ message: 'Usuario eliminado del proyecto.' });
    });
});
module.exports = router;