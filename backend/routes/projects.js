const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a la base de datos

// Ruta para agregar un proyecto
router.post('/', (req, res) => {
    console.log(req.body)
    const { nombre, descripcion, fecha_entrega, estado } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!nombre || !descripcion || !fecha_entrega) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const query = `
        INSERT INTO proyectos (nombre, descripcion, fecha_entrega, estado) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [nombre, descripcion, fecha_entrega, estado || 'Activo'], (err, result) => {
        if (err) {
            console.error('Error al insertar proyecto:', err);
            return res.status(500).json({ error: 'Error al guardar el proyecto.' });
        }
        res.status(201).json({ id: result.insertId, nombre, descripcion, fecha_entrega, estado: estado || 'Activo' });
    });
});
router.get('/', (req, res) => {
    const query = `
        SELECT * FROM proyectos 
    `;
    db.query(query, [], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al mostrar el proyecto.' });
        }
        return res.status(201).json(result);
    });
});

//PARA BORRAR PROYECTOS
router.delete('/:id', (req, res) => {
    console.log(req.body)
    const query = `
        DELETE FROM proyectos WHERE id = ${req.params.id}
    `;
    db.query(query, [], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al borrar el proyecto.' });
        }
        const query = `
        SELECT * FROM proyectos 
        `;
        db.query(query, [], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al mostrar el proyecto.' });
            }
            return res.status(201).json(result);
        });
    });
});

//PARA EDITAR
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_entrega } = req.body;

    if (!nombre || !descripcion || !fecha_entrega) {
        return res.status(400).json({ error: 'El nombre y la descripción son obligatorios' });
    }

    const query = 'UPDATE proyectos SET nombre = ?, descripcion = ?, fecha_entrega = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, fecha_entrega, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Proyecto no encontrado' });
        } else {
            const query = `
            SELECT * FROM proyectos 
            `;
            db.query(query, [], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al mostrar el proyecto.' });
                }
                return res.status(201).json(result);
            });
        }
    });
});

// Ruta para cambiar el estado de un proyecto
router.put('/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['Activo', 'Finalizado'].includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido.' });
    }

    const query = 'UPDATE proyectos SET estado = ? WHERE id = ?';
    db.query(query, [estado, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el estado del proyecto.' });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Proyecto no encontrado.' });
        } else {
            // Devuelve el estado actualizado de los proyectos
            const selectQuery = `SELECT * FROM proyectos`;
            db.query(selectQuery, [], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al mostrar el proyecto.' });
                }
                return res.status(200).json(result);
            });
        }
    });
});

module.exports = router;
