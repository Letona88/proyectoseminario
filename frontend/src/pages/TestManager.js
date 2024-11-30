import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem, Grid } from '@mui/material';

function TestManager() {
    const [tests, setTests] = useState([]);
    const [projects, setProjects] = useState([]);
    const [newTest, setNewTest] = useState({ titulo: '', descripcion: '', estado: 'Pendiente', proyecto_id: '' });
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingTest, setEditingTest] = useState(null); // Estado para editar un caso de prueba

    useEffect(() => {
        axios.get('http://localhost:5000/api/projects')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Error al obtener proyectos:', error));
    }, []);

    useEffect(() => {
        if (selectedProject) {
            axios.get(`http://localhost:5000/api/tests/${selectedProject}`)
                .then(response => setTests(response.data))
                .catch(error => console.error('Error al obtener casos de prueba:', error));
        } else {
            setTests([]);
        }
    }, [selectedProject]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newTest.titulo || !selectedProject) {
            alert('El título y el proyecto son obligatorios.');
            return;
        }

        if (editingTest) {
            axios.put(`http://localhost:5000/api/tests/${editingTest.id}`, newTest)
                .then(response => {
                    setTests(tests.map(test => (test.id === editingTest.id ? response.data : test)));
                    setEditingTest(null);
                    setNewTest({ titulo: '', descripcion: '', estado: 'Pendiente' });
                })
                .catch(error => console.error('Error al editar caso de prueba:', error));
        } else {
            axios.post('http://localhost:5000/api/tests', { ...newTest, proyecto_id: selectedProject })
                .then(response => {
                    setTests([...tests, response.data]);
                    setNewTest({ titulo: '', descripcion: '', estado: 'Pendiente' });
                })
                .catch(error => console.error('Error al agregar caso de prueba:', error));
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/tests/${id}`)
            .then(() => setTests(tests.filter(test => test.id !== id)))
            .catch(error => console.error('Error al eliminar caso de prueba:', error));
    };

    const handleChangeEstado = (id, estado) => {
        axios.put(`http://localhost:5000/api/tests/${id}/estado`, { estado })
            .then(response => {
                setTests(tests.map(test => (test.id === id ? response.data : test)));
            })
            .catch(error => console.error('Error al cambiar el estado del caso de prueba:', error));
    };

    const handleEdit = (test) => {
        setEditingTest(test);
        setNewTest({
            titulo: test.titulo,
            descripcion: test.descripcion,
            estado: test.estado,
            proyecto_id: test.proyecto_id,
        });
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Gestión de Casos de Prueba</Typography>
            <Box mb={4}>
                <Select
                    fullWidth
                    value={selectedProject || ''}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Seleccionar Proyecto</MenuItem>
                    {projects
                        .filter(project => project.estado !== 'Finalizado')
                        .map(project => (
                            <MenuItem key={project.id} value={project.id}>
                                {project.nombre}
                            </MenuItem>
                        ))}
                </Select>
            </Box>
            {selectedProject && (
                <Box mb={4}>
                    <Card variant="outlined" sx={{ padding: 3 }}>
                        <Typography variant="h6" gutterBottom>{editingTest ? 'Editar Caso de Prueba' : 'Crear Caso de Prueba'}</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Título del Caso de Prueba"
                                value={newTest.titulo}
                                onChange={(e) => setNewTest({ ...newTest, titulo: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Descripción"
                                multiline
                                rows={3}
                                value={newTest.descripcion}
                                onChange={(e) => setNewTest({ ...newTest, descripcion: e.target.value })}
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                {editingTest ? 'Guardar Cambios' : 'Agregar Caso de Prueba'}
                            </Button>
                            {editingTest && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ marginTop: 2, marginLeft: 2 }}
                                    onClick={() => {
                                        setEditingTest(null);
                                        setNewTest({ titulo: '', descripcion: '', estado: 'Pendiente' });
                                    }}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </form>
                    </Card>
                </Box>
            )}
            <Grid container spacing={3}>
                {tests.map(test => (
                    <Grid item xs={12} sm={6} md={4} key={test.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">{test.titulo}</Typography>
                                <Typography variant="body2" color="textSecondary">{test.descripcion}</Typography>
                                <Typography variant="body2">Estado: {test.estado}</Typography>
                                <Typography variant="body2">Creado en: {new Date(test.creado_en).toLocaleString()}</Typography>
                                <Typography variant="body2">Última actualización: {new Date(test.actualizado_en).toLocaleString()}</Typography>
                            </CardContent>
                            <Box p={1}>
                                <Button size="small" disabled={test.estado === 'Pendiente'} onClick={() => handleChangeEstado(test.id, 'Pendiente')}>Pendiente</Button>
                                <Button size="small" disabled={test.estado === 'Aprobado'} onClick={() => handleChangeEstado(test.id, 'Aprobado')}>Aprobado</Button>
                                <Button size="small" disabled={test.estado === 'Fallido'} onClick={() => handleChangeEstado(test.id, 'Fallido')}>Fallido</Button>
                                <Button size="small" onClick={() => handleEdit(test)}>Editar</Button>
                                <Button size="small" color="error" onClick={() => handleDelete(test.id)}>Eliminar</Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default TestManager;