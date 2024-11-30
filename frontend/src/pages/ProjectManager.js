import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Button, TextField, Select, MenuItem, Grid } from '@mui/material';

function ProjectManager() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ nombre: '', descripcion: '', fecha_entrega: '' });
    const [editingProject, setEditingProject] = useState(null);
    const [users, setUsers] = useState([]); // Lista de todos los usuarios
    const [assignedUsers, setAssignedUsers] = useState({}); // Usuarios asignados por proyecto

    useEffect(() => {
        axios.get('http://localhost:5000/api/projects')
            .then(response => {
                setProjects(response.data);

                const fetchAllAssignedUsers = response.data.map(project =>
                    axios.get(`http://localhost:5000/api/assignments/${project.id}`)
                        .then(userResponse => ({
                            projectId: project.id,
                            users: userResponse.data,
                        }))
                );

                Promise.all(fetchAllAssignedUsers)
                    .then(results => {
                        const initialAssignedUsers = results.reduce((acc, result) => {
                            acc[result.projectId] = result.users;
                            return acc;
                        }, {});
                        setAssignedUsers(initialAssignedUsers);
                    })
                    .catch(error => console.error('Error al cargar usuarios asignados:', error));
            })
            .catch(error => console.error('Error al obtener proyectos:', error));

        axios.get('http://localhost:5000/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error al obtener usuarios:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newProject.nombre || !newProject.descripcion || !newProject.fecha_entrega) {
            alert('Todos los campos son obligatorios');
            return;
        }

        if (editingProject) {
            axios.put(`http://localhost:5000/api/projects/${editingProject.id}`, newProject)
                .then((response) => {
                    setProjects(response.data);
                    setEditingProject(null);
                    setNewProject({ nombre: '', descripcion: '', fecha_entrega: '' });
                })
                .catch(error => console.error('Error al editar proyecto:', error));
        } else {
            axios.post('http://localhost:5000/api/projects', newProject)
                .then(response => {
                    setProjects([...projects, response.data]);
                    setNewProject({ nombre: '', descripcion: '', fecha_entrega: '' });
                })
                .catch(error => console.error('Error al agregar proyecto:', error));
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setNewProject({ nombre: project.nombre, descripcion: project.descripcion, fecha_entrega: project.fecha_entrega });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/projects/${id}`)
            .then((response) => {
                setProjects(response.data);
            })
            .catch(error => console.error('Error al eliminar proyecto:', error));
    };

    const handleAssignUser = (projectId, userId) => {
        axios.post('http://localhost:5000/api/assignments', { proyecto_id: projectId, usuario_id: userId })
            .then(() => {
                fetchAssignedUsers(projectId);
            })
            .catch(error => console.error('Error al asignar usuario:', error));
    };

    const fetchAssignedUsers = (projectId) => {
        axios.get(`http://localhost:5000/api/assignments/${projectId}`)
            .then(response => setAssignedUsers(prev => ({ ...prev, [projectId]: response.data })))
            .catch(error => console.error('Error al obtener usuarios asignados:', error));
    };

    const handleRemoveUser = (projectId, userId) => {
        axios.delete(`http://localhost:5000/api/assignments/${projectId}/${userId}`)
            .then(() => fetchAssignedUsers(projectId))
            .catch(error => console.error('Error al eliminar usuario:', error));
    };

    const handleChangeEstado = (id, estado) => {
        axios.put(`http://localhost:5000/api/projects/${id}/estado`, { estado })
            .then((response) => {
                setProjects(response.data); // Actualizar los proyectos en el estado
            })
            .catch(error => console.error('Error al cambiar el estado del proyecto:', error));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES'); // Formato DD/MM/YYYY
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Gestión de Proyectos</Typography>

            <Box mb={4}>
                <Card variant="outlined" sx={{ padding: 3 }}>
                    <Typography variant="h6" gutterBottom>{editingProject ? 'Editar Proyecto' : 'Crear Proyecto'}</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Nombre del Proyecto"
                            value={newProject.nombre}
                            onChange={(e) => setNewProject({ ...newProject, nombre: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            multiline
                            rows={3}
                            value={newProject.descripcion}
                            onChange={(e) => setNewProject({ ...newProject, descripcion: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="Fecha de Entrega"
                            InputLabelProps={{ shrink: true }}
                            value={newProject.fecha_entrega}
                            onChange={(e) => setNewProject({ ...newProject, fecha_entrega: e.target.value })}
                            margin="normal"
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                            {editingProject ? 'Guardar Cambios' : 'Agregar Proyecto'}
                        </Button>
                    </form>
                </Card>
            </Box>

            <Grid container spacing={3}>
                {projects.map(project => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">{project.nombre}</Typography>
                                <Typography variant="body2" color="textSecondary">{project.descripcion}</Typography>
                                <Typography variant="body2">Fecha de Entrega: {formatDate(project.fecha_entrega)}</Typography>
                                <Typography variant="body2">Estado: {project.estado}</Typography>
                                <Typography variant="body2"><strong>Usuarios Asignados:</strong></Typography>
                                {assignedUsers[project.id]?.map(user => (
                                    <Box key={user.id} sx={{ marginBottom: 1 }}>
                                        <Typography variant="body2">{user.nombre} ({user.rol})</Typography>
                                        <Button size="small" color="error" onClick={() => handleRemoveUser(project.id, user.id)}>Eliminar</Button>
                                    </Box>
                                ))}
                                <Select
                                    fullWidth
                                    displayEmpty
                                    onChange={(e) => handleAssignUser(project.id, e.target.value)}
                                    value=""
                                >
                                    <MenuItem value="" disabled>Seleccionar Usuario</MenuItem>
                                    {users
                                        .filter(user => !(assignedUsers[project.id]?.some(assigned => assigned.id === user.id)))
                                        .map(user => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.nombre} ({user.rol})
                                            </MenuItem>
                                        ))}
                                </Select>
                            </CardContent>
                            <Box p={1}>
                                <Button size="small" onClick={() => handleEdit(project)}>Editar</Button>
                                <Button size="small" onClick={() => handleDelete(project.id)}>Eliminar</Button>
                                <Button size="small" disabled={project.estado === 'Activo'} onClick={() => handleChangeEstado(project.id, 'Activo')}>Activar</Button>
                                <Button size="small" disabled={project.estado === 'Finalizado'} onClick={() => handleChangeEstado(project.id, 'Finalizado')}>Finalizar</Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ProjectManager;