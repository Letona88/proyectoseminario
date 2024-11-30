-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: test_management
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `casosprueba`
--

USE test_management;

DROP TABLE IF EXISTS `casosprueba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `casosprueba` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `proyecto_id` int(11) NOT NULL,
  `titulo` text NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Pendiente','Aprobado','Fallido') DEFAULT 'Pendiente',
  `creado_en` datetime DEFAULT current_timestamp(),
  `actualizado_en` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `proyecto_id` (`proyecto_id`),
  CONSTRAINT `casosprueba_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `casosprueba`
--

LOCK TABLES `casosprueba` WRITE;
/*!40000 ALTER TABLE `casosprueba` DISABLE KEYS */;
INSERT INTO `casosprueba` VALUES (5,4,'login','ver el login ','Fallido','2024-11-27 23:49:27','2024-11-30 00:35:07'),(6,4,'Formulario','arreglar formulario ya','Aprobado','2024-11-28 00:33:47','2024-11-28 03:50:13'),(7,4,'Base de datos','Arreglar base de datos','Aprobado','2024-11-28 00:33:57','2024-11-30 00:35:04'),(8,6,'Agregar imagenes','las imagenes no se muestran','Pendiente','2024-11-28 01:06:21','2024-11-30 00:34:11'),(9,7,'Facturas','Que las facturas salgan bien ','Pendiente','2024-11-28 03:38:10','2024-11-28 03:41:05'),(10,7,'Login','que inicie sesion','Fallido','2024-11-28 03:41:27','2024-11-28 03:41:31'),(11,8,'Datos de alumnos','Los nombres de los alumnos se ingresen y se guarden','Pendiente','2024-11-28 03:47:49','2024-11-28 03:47:58');
/*!40000 ALTER TABLE `casosprueba` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `defectos`
--

DROP TABLE IF EXISTS `defectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `defectos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caso_prueba_id` int(11) NOT NULL,
  `titulo` text NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Abierto','En progreso','Resuelto') DEFAULT 'Abierto',
  `prioridad` enum('Baja','Media','Alta','Crítica') DEFAULT 'Media',
  `asignado_a` text DEFAULT NULL,
  `creado_en` datetime DEFAULT current_timestamp(),
  `actualizado_en` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `caso_prueba_id` (`caso_prueba_id`),
  CONSTRAINT `defectos_ibfk_1` FOREIGN KEY (`caso_prueba_id`) REFERENCES `casosprueba` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `defectos`
--

LOCK TABLES `defectos` WRITE;
/*!40000 ALTER TABLE `defectos` DISABLE KEYS */;
INSERT INTO `defectos` VALUES (2,7,'Error en el guardado de datos ','No se guardan los datos ','Abierto','Media','David','2024-11-28 02:30:30','2024-11-28 02:30:30'),(3,8,'Error de compatibilidades','No se pueden agregar debido a una incompatibilidad','En progreso','Baja','José daniel','2024-11-28 02:43:25','2024-11-28 03:30:01'),(4,8,'Error al iniciar sesion ','No deja','Abierto','Baja','Pedro','2024-11-28 03:09:57','2024-11-28 03:09:57'),(5,7,'Virus','Un virus corrompe el programa','En progreso','Crítica','José daniel','2024-11-28 03:25:14','2024-11-28 03:25:14'),(6,9,'Fecha de facturas','que la fecha de facturas se muestra con el año equivocado','En progreso','Alta','David','2024-11-28 03:39:58','2024-11-28 03:39:58'),(7,11,'Error con tildes','Al agregar tildes se arruina el programa','En progreso','Alta','David','2024-11-28 03:49:00','2024-11-28 03:49:00');
/*!40000 ALTER TABLE `defectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyectos`
--

DROP TABLE IF EXISTS `proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyectos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` text NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `estado` enum('Activo','Finalizado') DEFAULT 'Activo',
  `creado_en` datetime DEFAULT current_timestamp(),
  `actualizado_en` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyectos`
--

LOCK TABLES `proyectos` WRITE;
/*!40000 ALTER TABLE `proyectos` DISABLE KEYS */;
INSERT INTO `proyectos` VALUES (4,'Proyecto 2','Programa de escuelas','2024-12-12','Finalizado','2024-11-27 22:38:43','2024-11-30 00:35:38'),(6,'Proyecto 3','El definitivo','2025-05-07','Activo','2024-11-28 01:05:50','2024-11-30 00:33:48'),(7,'Proyecto Municipalidad','Un sistema de facturas','2025-01-31','Activo','2024-11-28 03:36:43','2024-11-28 03:49:13'),(8,'Proyecto Colegio','Un programa de asistencias','2025-02-01','Activo','2024-11-28 03:46:52','2024-11-28 03:46:52');
/*!40000 ALTER TABLE `proyectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` text NOT NULL,
  `email` text NOT NULL,
  `contraseña` text NOT NULL,
  `rol` enum('Administrador','Tester') DEFAULT 'Tester',
  `creado_en` datetime DEFAULT current_timestamp(),
  `actualizado_en` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`(255)) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'David','davidletonajerez@gmail.com','12345','Administrador','2024-11-27 23:26:41','2024-11-28 01:32:15'),(3,'José Daniel','usuario4@gmail.com','12345','Tester','2024-11-27 23:50:11','2024-11-29 04:01:40'),(5,'Josue','usuario2@gmail.com','12345','Tester','2024-11-28 03:45:53','2024-11-28 03:46:15');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuariosproyectos`
--

DROP TABLE IF EXISTS `usuariosproyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuariosproyectos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `proyecto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `asignado_en` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `proyecto_id` (`proyecto_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `usuariosproyectos_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuariosproyectos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuariosproyectos`
--

LOCK TABLES `usuariosproyectos` WRITE;
/*!40000 ALTER TABLE `usuariosproyectos` DISABLE KEYS */;
INSERT INTO `usuariosproyectos` VALUES (23,4,3,'2024-11-28 03:11:49'),(25,6,3,'2024-11-28 03:11:52'),(26,7,1,'2024-11-28 03:37:12'),(28,8,1,'2024-11-28 03:46:58'),(30,4,5,'2024-11-30 00:33:26');
/*!40000 ALTER TABLE `usuariosproyectos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-30  1:07:23
