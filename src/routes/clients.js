const express = require('express');
const router = express.Router();

const adminController = require('../controllers/clients.js');

router.get('/create', adminController.create);
router.post('/create', adminController.processCreate);
router.get('/edit/:id', adminController.edit);
router.put('/edit/:id', adminController.update);

module.exports = router;