import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para redirección

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://64.23.251.147:5000/api/auth/login', {
                email,
                contraseña: password,
            });

            // Si el login es exitoso, ejecutar onLogin y redirigir
            onLogin();
            navigate('/projects'); // Redirige a la página de proyectos
        } catch (err) {
            setError('Credenciales incorrectas.');
        }
    };

    return (
        <Box 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Card 
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <CardContent>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        align="center" 
                        sx={{ color: '#1976d2', fontWeight: 'bold' }}
                    >
                        Iniciar Sesión
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        {error && (
                            <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            sx={{
                                mt: 2,
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;