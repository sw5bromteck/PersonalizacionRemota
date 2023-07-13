const express = require('express');
const router = express.Router();

const adminController = require('../controllers/clients.js');
const upload = require('../middlewares/multerMiddleware.js');

router.get('/clients', adminController.clients);
router.get('/create', adminController.create);
router.post('/create', upload.single('image'), adminController.processCreate);
router.get('/edit/:id', adminController.edit);
router.put('/edit/:id', adminController.update);
router.delete('/delete/:id', adminController.delete);

module.exports = router;