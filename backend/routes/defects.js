const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a la base de datos

// Obtener defectos de un proyecto
router.get('/:proyecto_id', (req, res) => {
    const { proyecto_id } = req.params;

    const query = `
        SELECT d.*, cp.titulo AS caso_prueba_titulo 
        FROM Defectos d
        JOIN CasosPrueba cp ON d.caso_prueba_id = cp.id
        WHERE cp.proyecto_id = ?
    `;

    db.query(query, [proyecto_id], (err, results) => {
        if (err) {
            console.error('Error al obtener defectos:', err);
            return res.status(500).json({ error: 'Error al obtener defectos.' });
        }
        res.json(results);
    });
});

// Crear un defecto
router.post('/', (req, res) => {
    const { caso_prueba_id, titulo, descripcion, estado, prioridad, asignado_a } = req.body;

    if (!caso_prueba_id || !titulo || !asignado_a) {
        return res.status(400).json({ error: 'Caso de prueba, título y asignación son obligatorios.' });
    }

    const query = `
        INSERT INTO Defectos (caso_prueba_id, titulo, descripcion, estado, prioridad, asignado_a) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [caso_prueba_id, titulo, descripcion, estado, prioridad, asignado_a], (err, result) => {
        if (err) {
            console.error('Error al insertar defecto:', err);
            return res.status(500).json({ error: 'Error al guardar el defecto.' });
        }
        res.status(201).json({
            id: result.insertId,
            caso_prueba_id,
            titulo,
            descripcion,
            estado,
            prioridad,
            asignado_a,
        });
    });
});

// Editar un defecto
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, estado, prioridad, asignado_a } = req.body;

    const query = `
        UPDATE Defectos 
        SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, asignado_a = ?
        WHERE id = ?
    `;

    db.query(query, [titulo, descripcion, estado, prioridad, asignado_a, id], (err, result) => {
        if (err) {
            console.error('Error al editar defecto:', err);
            return res.status(500).json({ error: 'Error al editar el defecto.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Defecto no encontrado.' });
        }

        res.json({ id, titulo, descripcion, estado, prioridad, asignado_a });
    });
});

// Eliminar un defecto
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM Defectos 
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar defecto:', err);
            return res.status(500).json({ error: 'Error al eliminar el defecto.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Defecto no encontrado.' });
        }

        res.json({ message: 'Defecto eliminado correctamente.' });
    });
});

module.exports = router;