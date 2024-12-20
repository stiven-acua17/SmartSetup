/**
 * @file authRoutes.js
 * @description Definición de las rutas para manejar la autenticación de usuarios en la aplicación.
 * @requires express Framework web para definir y manejar rutas.
 * @requires ./authController Controladores para manejar las operaciones de autenticación.
 */

const express = require('express');
const authController = require('./authController');

const router = express.Router();

/**
 * POST /create-user
 * @description Ruta para crear un nuevo usuario.
 * @access Público
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Datos del usuario enviados en la solicitud.
 * @param {string} req.body.displayName - Nombre del usuario.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Devuelve una respuesta HTTP con el resultado de la operación.
 */
router.post('/create-user', authController.createUserController);


/**
 * POST /validate-user
 * @description Ruta para validar un token de usuario.
 * @access Público
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.headers - Contiene los encabezados de la solicitud.
 * @param {string} req.headers.authorization - El encabezado de autorización con el token de ID.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Devuelve una respuesta HTTP con el resultado de la validación del token.
 * @throws {Object} Si el token no es proporcionado o es inválido, devuelve un objeto con el mensaje de error.
 */
router.post('/validate-user', authController.verifyTokenController);

module.exports = router;