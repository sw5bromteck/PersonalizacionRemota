const { body } = require('express-validator');

module.exports = [
    body('firstname').notEmpty().withMessage('Tenes que escribir un nombre').bail().isLength({min: 2}).withMessage('Debe tener al menos 2 caracteres'),
    body('lastname').notEmpty().withMessage('Tenes que escribir un apellido').bail().isLength({min: 2}).withMessage('Debe tener al menos 2 caracteres'),
    body('company').notEmpty().withMessage('Tenes que escribir el nombre de una Empresa').bail().isLength({min: 2}).withMessage('Debe tener al menos 2 caracteres'),
    body('phone').notEmpty().withMessage('Tenes que escribir un número telefónico').bail().isLength({min: 8}).withMessage('Debe tener al menos 8 caracteres'),
    body('email').notEmpty().withMessage('Tenes que escribir un email').bail().isEmail().withMessage('Tenes que escribir un formato de email válido'),
];