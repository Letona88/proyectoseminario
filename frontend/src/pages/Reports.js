import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box, Card, CardContent, Typography, Grid, Divider, Chip } from '@mui/material';

function Reports() {
    const [projects, setProjects] = useState([]);
    const [testCases, setTestCases] = useState({}); // Casos de prueba por proyecto
    const [defects, setDefects] = useState({}); // Defectos por proyecto
    const [assignedUsers, setAssignedUsers] = useState({}); // Usuarios asignados por proyecto

    useEffect(() => {
        axios.get('http://64.23.251.147:5000/api/projects')
            .then(response => {
                setProjects(response.data);

                // Cargar usuarios asignados para cada proyecto
                const fetchAllAssignedUsers = response.data.map(project =>
                    axios.get(`http://64.23.251.147:5000/api/assignments/${project.id}`)
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

                // Cargar casos de prueba para cada proyecto
                const fetchAllTestCases = response.data.map(project =>
                    axios.get(`http://64.23.251.147:5000/api/tests/proyecto/${project.id}`)
                        .then(testResponse => ({
                            projectId: project.id,
                            tests: testResponse.data,
                        }))
                );

                Promise.all(fetchAllTestCases)
                    .then(results => {
                        const initialTestCases = results.reduce((acc, result) => {
                            acc[result.projectId] = result.tests;
                            return acc;
                        }, {});
                        setTestCases(initialTestCases);
                    })
                    .catch(error => console.error('Error al cargar casos de prueba:', error));

                // Cargar defectos para cada proyecto
                const fetchAllDefects = response.data.map(project =>
                    axios.get(`http://64.23.251.147:5000/api/defects/${project.id}`)
                        .then(defectResponse => ({
                            projectId: project.id,
                            defects: defectResponse.data,
                        }))
                );

                Promise.all(fetchAllDefects)
                    .then(results => {
                        const initialDefects = results.reduce((acc, result) => {
                            acc[result.projectId] = result.defects;
                            return acc;
                        }, {});
                        setDefects(initialDefects);
                    })
                    .catch(error => console.error('Error al cargar defectos:', error));
            })
            .catch(error => console.error('Error al obtener proyectos:', error));
    }, []);

    const getChartData = (projectId) => {
        const cases = testCases[projectId] || [];
        const counts = {
            Aprobado: 0,
            Pendiente: 0,
            Fallido: 0,
        };

        cases.forEach(test => {
            counts[test.estado] = (counts[test.estado] || 0) + 1;
        });

        return {
            labels: ['Aprobado', 'Pendiente', 'Fallido'],
            datasets: [
                {
                    data: [
                        counts.Aprobado,
                        counts.Pendiente,
                        counts.Fallido,
                    ],
                    backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
                },
            ],
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    const calculateRemainingDays = (creationDate, deliveryDate) => {
        const creation = new Date(creationDate);
        const delivery = new Date(deliveryDate);
        const timeDiff = delivery - creation;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff;
    };

    const renderChipLabel = (remainingDays, status) => {
        if (status === 'Finalizado') {
            return 'Terminado';
        }
        return `${remainingDays} días restantes`;
    };

    const renderChipColor = (remainingDays, status) => {
        if (status === 'Finalizado') {
            return 'error';
        }
        return remainingDays <= 5 ? 'warning' : 'primary';
    };

    const renderDefects = (projectId) => {
        const projectDefects = defects[projectId] || [];
        return (
            <div>
                <Typography variant="subtitle1">Defectos:</Typography>
                <ul>
                    {projectDefects.map(defect => (
                        <li key={defect.id}>
                            <strong>{defect.titulo}</strong>: {defect.estado} ({defect.prioridad})
                        </li>
                    ))}
                </ul>
                <Typography variant="body2">
                    Total: {projectDefects.length}
                </Typography>
            </div>
        );
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Informes de Proyectos</Typography>
            <Grid container spacing={3}>
                {projects.map(project => {
                    const remainingDays = calculateRemainingDays(project.creado_en, project.fecha_entrega);

                    return (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <Card variant="outlined" sx={{ position: 'relative' }}>
                                <Chip
                                    label={renderChipLabel(remainingDays, project.estado)}
                                    color={renderChipColor(remainingDays, project.estado)}
                                    sx={{ position: 'absolute', top: 10, right: 10 }}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{project.nombre}</Typography>
                                    <Typography variant="body2" color="textSecondary">{project.descripcion}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2"><strong>Fecha de Inicio:</strong> {formatDate(project.creado_en)}</Typography>
                                    <Typography variant="body2"><strong>Fecha de Entrega:</strong> {formatDate(project.fecha_entrega)}</Typography>
                                    <Typography variant="body2"><strong>Estado:</strong> {project.estado}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1">Personas Asignadas:</Typography>
                                    <ul>
                                        {assignedUsers[project.id]?.map(user => (
                                            <li key={user.id}>
                                                {user.nombre} ({user.rol})
                                            </li>
                                        )) || <Typography variant="body2">No hay personas asignadas.</Typography>}
                                    </ul>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1">Estado de los Casos de Prueba:</Typography>
                                    <Box sx={{ width: '100%', margin: '0 auto' }}>
                                        <Pie data={getChartData(project.id)} />
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    {renderDefects(project.id)}
                                    <Typography variant="subtitle1">Casos de Prueba:</Typography>
                                    <ul>
                                        {(testCases[project.id] || []).map(test => (
                                            <li key={test.id}>
                                                <strong>{test.titulo}</strong>: {test.estado}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}

export default Reports;