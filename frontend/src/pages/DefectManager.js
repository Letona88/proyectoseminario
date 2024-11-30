import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';

function DefectsManager() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [testCases, setTestCases] = useState([]); // Casos de prueba asociados al proyecto
    const [defects, setDefects] = useState([]);
    const [users, setUsers] = useState([]);
    const [newDefect, setNewDefect] = useState({
        caso_prueba_id: '',
        titulo: '',
        descripcion: '',
        estado: 'Abierto',
        prioridad: 'Media',
        asignado_a: '',
    });
    const [editingDefect, setEditingDefect] = useState(null);

    useEffect(() => {
        // Obtener proyectos activos
        axios.get('http://localhost:5000/api/projects')
            .then(response => setProjects(response.data.filter(project => project.estado === 'Activo')))
            .catch(error => console.error('Error al obtener proyectos:', error));

        // Obtener usuarios
        axios.get('http://localhost:5000/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error al obtener usuarios:', error));
    }, []);

    // Obtener casos de prueba y defectos según el proyecto seleccionado
    useEffect(() => {
        if (selectedProject) {
            // Obtener defectos
            axios.get(`http://localhost:5000/api/defects/${selectedProject}`)
                .then(response => setDefects(response.data))
                .catch(error => console.error('Error al obtener defectos:', error));

            // Obtener casos de prueba del proyecto
            axios.get(`http://localhost:5000/api/tests/proyecto/${selectedProject}`)
                .then(response => setTestCases(response.data))
                .catch(error => console.error('Error al obtener casos de prueba:', error));
        } else {
            setDefects([]);
            setTestCases([]);
        }
    }, [selectedProject]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!newDefect.titulo || !newDefect.caso_prueba_id || !newDefect.asignado_a) {
            alert('Todos los campos son obligatorios.');
            return;
        }
    
        if (editingDefect) {
            // Editar defecto
            axios.put(`http://localhost:5000/api/defects/${editingDefect.id}`, newDefect)
                .then(response => {
                    setDefects(defects.map(def => (def.id === editingDefect.id ? response.data : def)));
                    setEditingDefect(null);
                    setNewDefect({ caso_prueba_id: '', titulo: '', descripcion: '', estado: 'Abierto', prioridad: 'Media', asignado_a: '' });
                })
                .catch(error => console.error('Error al editar defecto:', error));
        } else {
            // Crear nuevo defecto
            axios.post('http://localhost:5000/api/defects', { ...newDefect, proyecto_id: selectedProject })
                .then(response => {
                    setDefects([...defects, response.data]);
                    setNewDefect({ caso_prueba_id: '', titulo: '', descripcion: '', estado: 'Abierto', prioridad: 'Media', asignado_a: '' });
                })
                .catch(error => console.error('Error al agregar defecto:', error));
        }
    };
    
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/defects/${id}`)
            .then(() => setDefects(defects.filter(def => def.id !== id)))
            .catch(error => console.error('Error al eliminar defecto:', error));
    };

    const handleEdit = (defect) => {
        setEditingDefect(defect);
        setNewDefect({
            caso_prueba_id: defect.caso_prueba_id,
            titulo: defect.titulo,
            descripcion: defect.descripcion,
            estado: defect.estado,
            prioridad: defect.prioridad,
            asignado_a: defect.asignado_a,
        });
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Gestión de Defectos</Typography>

            {/* Seleccionar Proyecto */}
            <Select
                fullWidth
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value)}
                displayEmpty
                sx={{ mb: 3 }}
            >
                <MenuItem value="" disabled>Seleccionar Proyecto</MenuItem>
                {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                        {project.nombre} - {project.descripcion}
                    </MenuItem>
                ))}
            </Select>

            {selectedProject && (
                <>
                    <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                        <Typography variant="h6" gutterBottom>{editingDefect ? 'Editar Defecto' : 'Agregar Defecto'}</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Título del Defecto"
                                value={newDefect.titulo}
                                onChange={(e) => setNewDefect({ ...newDefect, titulo: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Descripción"
                                value={newDefect.descripcion}
                                onChange={(e) => setNewDefect({ ...newDefect, descripcion: e.target.value })}
                                margin="normal"
                                multiline
                            />
                            <Select
                                fullWidth
                                value={newDefect.caso_prueba_id}
                                onChange={(e) => setNewDefect({ ...newDefect, caso_prueba_id: e.target.value })}
                                displayEmpty
                                sx={{ mb: 3 }}
                                required
                            >
                                <MenuItem value="" disabled>Seleccionar Caso de Prueba</MenuItem>
                                {testCases.map(test => (
                                    <MenuItem key={test.id} value={test.id}>
                                        {test.titulo} ({test.estado})
                                    </MenuItem>
                                ))}
                            </Select>
                            <Select
                                fullWidth
                                value={newDefect.asignado_a}
                                onChange={(e) => setNewDefect({ ...newDefect, asignado_a: e.target.value })}
                                displayEmpty
                                sx={{ mb: 3 }}
                                required
                            >
                                <MenuItem value="" disabled>Seleccionar Usuario</MenuItem>
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.nombre}>
                                        {user.nombre} ({user.rol})
                                    </MenuItem>
                                ))}
                            </Select>
                            <ToggleButtonGroup
                                exclusive
                                value={newDefect.estado}
                                onChange={(e, value) => setNewDefect({ ...newDefect, estado: value || newDefect.estado })}
                                sx={{ mb: 2 }}
                            >
                                <ToggleButton value="Abierto">Abierto</ToggleButton>
                                <ToggleButton value="En progreso">En Progreso</ToggleButton>
                                <ToggleButton value="Resuelto">Resuelto</ToggleButton>
                            </ToggleButtonGroup>
                            <ToggleButtonGroup
                                exclusive
                                value={newDefect.prioridad}
                                onChange={(e, value) => setNewDefect({ ...newDefect, prioridad: value || newDefect.prioridad })}
                                sx={{ mb: 2 }}
                            >
                                <ToggleButton value="Baja">Baja</ToggleButton>
                                <ToggleButton value="Media">Media</ToggleButton>
                                <ToggleButton value="Alta">Alta</ToggleButton>
                                <ToggleButton value="Crítica">Crítica</ToggleButton>
                            </ToggleButtonGroup>
                            <Box>
                                <Button type="submit" variant="contained" color="primary">
                                    {editingDefect ? 'Guardar Cambios' : 'Agregar Defecto'}
                                </Button>
                                {editingDefect && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ ml: 2 }}
                                        onClick={() => {
                                            setEditingDefect(null);
                                            setNewDefect({
                                                caso_prueba_id: '',
                                                titulo: '',
                                                descripcion: '',
                                                estado: 'Abierto',
                                                prioridad: 'Media',
                                                asignado_a: '',
                                            });
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </Box>
                        </form>
                    </Card>

                    <Grid container spacing={2}>
                        {defects.map(def => (
                            <Grid item xs={12} sm={6} md={4} key={def.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6">{def.titulo}</Typography>
                                        <Typography variant="body2" color="textSecondary">{def.descripcion}</Typography>
                                        <Typography variant="body2"><strong>Estado:</strong> {def.estado}</Typography>
                                        <Typography variant="body2"><strong>Prioridad:</strong> {def.prioridad}</Typography>
                                        <Typography variant="body2"><strong>Asignado a:</strong> {def.asignado_a}</Typography>
                                    </CardContent>
                                    <Box p={1}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(def)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            sx={{ ml: 2 }}
                                            onClick={() => handleDelete(def.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
}

export default DefectsManager;