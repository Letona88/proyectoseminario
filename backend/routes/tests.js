const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a la base de datos

// Obtener todos los casos de prueba para un proyecto
router.get('/:proyecto_id', (req, res) => {
    const { proyecto_id } = req.params;

    const query = `SELECT * FROM CasosPrueba WHERE proyecto_id = ?`;
    db.query(query, [proyecto_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener casos de prueba.' });
        }
        res.status(200).json(results);
    });
});

// Agregar un caso de prueba
router.post('/', (req, res) => {
    const { proyecto_id, titulo, descripcion, estado } = req.body;

    if (!proyecto_id || !titulo) {
        return res.status(400).json({ error: 'El proyecto y el título son obligatorios.' });
    }

    const query = `
        INSERT INTO CasosPrueba (proyecto_id, titulo, descripcion, estado) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [proyecto_id, titulo, descripcion, estado || 'Pendiente'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar el caso de prueba.' });
        }

        // Recuperar el caso recién creado
        const selectQuery = `SELECT * FROM CasosPrueba WHERE id = ?`;
        db.query(selectQuery, [result.insertId], (err, newCase) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar el caso creado.' });
            }
            res.status(201).json(newCase[0]); // Devolver el caso completo
        });
    });
});

// Editar un caso de prueba
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, estado } = req.body;

    if (!titulo || !estado || !['Pendiente', 'Aprobado', 'Fallido'].includes(estado)) {
        return res.status(400).json({ error: 'Título, descripción y estado son obligatorios y válidos.' });
    }

    const query = `
        UPDATE CasosPrueba 
        SET titulo = ?, descripcion = ?, estado = ? 
        WHERE id = ?
    `;
    db.query(query, [titulo, descripcion, estado, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al editar el caso de prueba.' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Caso de prueba no encontrado.' });
        }

        // Devolver el caso actualizado
        const selectQuery = `SELECT * FROM CasosPrueba WHERE id = ?`;
        db.query(selectQuery, [id], (err, updatedCase) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar el caso actualizado.' });
            }
            res.status(200).json(updatedCase[0]);
        });
    });
});

// Eliminar un caso de prueba
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM CasosPrueba WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el caso de prueba.' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Caso de prueba no encontrado.' });
        }
        res.status(200).json({ message: 'Caso de prueba eliminado.' });
    });
});

// Cambiar el estado de un caso de prueba
router.put('/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['Pendiente', 'Aprobado', 'Fallido'].includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido.' });
    }

    const query = `UPDATE CasosPrueba SET estado = ? WHERE id = ?`;
    db.query(query, [estado, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el estado.' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Caso de prueba no encontrado.' });
        }

        // Obtener el caso de prueba actualizado para devolverlo
        const selectQuery = `SELECT * FROM CasosPrueba WHERE id = ?`;
        db.query(selectQuery, [id], (err, updatedCase) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el caso actualizado.' });
            }
            res.status(200).json(updatedCase[0]);
        });
    });
});

// Obtener casos de prueba por proyecto
router.get('/proyecto/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM CasosPrueba WHERE proyecto_id = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener casos de prueba.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;