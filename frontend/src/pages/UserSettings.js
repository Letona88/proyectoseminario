import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Button, TextField, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';

function UserManager() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ nombre: '', email: '', contraseña: '', rol: 'Tester' });
    const [editingUser, setEditingUser] = useState(null); // Estado para edición

    // Cargar usuarios al inicio
    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error al obtener usuarios:', error));
    }, []);

    // Agregar o editar usuario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newUser.nombre || !newUser.email || !newUser.contraseña) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        if (editingUser) {
            axios.put(`http://localhost:5000/api/users/${editingUser.id}`, newUser)
                .then(response => {
                    setUsers(users.map(user => (user.id === editingUser.id ? response.data : user)));
                    setEditingUser(null);
                    setNewUser({ nombre: '', email: '', contraseña: '', rol: 'Tester' });
                })
                .catch(error => console.error('Error al editar usuario:', error));
        } else {
            axios.post('http://localhost:5000/api/users', newUser)
                .then(response => {
                    setUsers([...users, response.data]);
                    setNewUser({ nombre: '', email: '', contraseña: '', rol: 'Tester' });
                })
                .catch(error => console.error('Error al agregar usuario:', error));
        }
    };

    // Eliminar usuario
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/users/${id}`)
            .then(() => setUsers(users.filter(user => user.id !== id)))
            .catch(error => console.error('Error al eliminar usuario:', error));
    };

    // Preparar usuario para edición
    const handleEdit = (user) => {
        setEditingUser(user);
        setNewUser({ nombre: user.nombre, email: user.email, contraseña: '', rol: user.rol });
    };

    // Cambiar rol del usuario
    const handleChangeRol = (rol) => {
        setNewUser({ ...newUser, rol });
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
            <Box mb={4}>
                <Card variant="outlined" sx={{ padding: 3 }}>
                    <Typography variant="h6" gutterBottom>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            value={newUser.nombre}
                            onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={newUser.contraseña}
                            onChange={(e) => setNewUser({ ...newUser, contraseña: e.target.value })}
                            margin="normal"
                            required
                        />
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Seleccionar Rol:</Typography>
                        <ToggleButtonGroup
                            value={newUser.rol}
                            exclusive
                            onChange={(e, value) => handleChangeRol(value || newUser.rol)}
                            sx={{ marginBottom: 2 }}
                        >
                            <ToggleButton value="Tester" disabled={newUser.rol === 'Tester'}>
                                Tester
                            </ToggleButton>
                            <ToggleButton value="Administrador" disabled={newUser.rol === 'Administrador'}>
                                Administrador
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Box>
                            <Button type="submit" variant="contained" color="primary">
                                {editingUser ? 'Guardar Cambios' : 'Agregar Usuario'}
                            </Button>
                            {editingUser && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ ml: 2 }}
                                    onClick={() => {
                                        setEditingUser(null);
                                        setNewUser({ nombre: '', email: '', contraseña: '', rol: 'Tester' });
                                    }}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </Box>
                    </form>
                </Card>
            </Box>

            <Grid container spacing={3}>
                {users.map(user => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">{user.nombre}</Typography>
                                <Typography variant="body2" color="textSecondary">Email: {user.email}</Typography>
                                <Typography variant="body2">Rol: {user.rol}</Typography>
                            </CardContent>
                            <Box p={1}>
                                <Button size="small" variant="contained" color="primary" onClick={() => handleEdit(user)}>
                                    Editar
                                </Button>
                                <Button size="small" variant="outlined" color="error" sx={{ ml: 2 }} onClick={() => handleDelete(user.id)}>
                                    Eliminar
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default UserManager;