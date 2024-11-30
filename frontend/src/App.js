import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navbar ya existente
import ProjectManager from './pages/ProjectManager';
import TestManager from './pages/TestManager';
import UserSettings from './pages/UserSettings';
import Reports from './pages/Reports';
import DefectManager from './pages/DefectManager';
import Login from './pages/Login'; // Nueva página de Login
import './App.css';

function App() {
    // Estado para manejar el inicio de sesión
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Manejar inicio de sesión exitoso
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // Proteger rutas que necesitan autenticación
    const ProtectedRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/login" />;
    };

    return (
        <Router>
            {isAuthenticated && <Navbar />} {/* Mostrar Navbar solo si está autenticado */}
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/projects" element={<ProtectedRoute element={<ProjectManager />} />} />
                <Route path="/tests" element={<ProtectedRoute element={<TestManager />} />} />
                <Route path="/defects" element={<ProtectedRoute element={<DefectManager />} />} />
                <Route path="/Reports" element={<ProtectedRoute element={<Reports />} />} />
                <Route path="/user" element={<ProtectedRoute element={<UserSettings />} />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/projects" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;