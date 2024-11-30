import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Sistema de Gestión
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/projects">
                        Proyectos
                    </Button>
                    <Button color="inherit" component={Link} to="/tests">
                        Pruebas
                    </Button>
                    <Button color="inherit" component={Link} to="/defects">
                        Defectos
                    </Button>
                    <Button color="inherit" component={Link} to="/Reports">
                        Informes
                    </Button>
                    <Button color="inherit" component={Link} to="/user">
                        Usuarios
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;