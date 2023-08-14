const express = require('express');
const router = express.Router();

const adminController = require('../controllers/clients.js');
const upload = require('../middlewares/multerMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.get('/login', adminController.login);
router.post('/login', adminController.processLogin);
router.get('/logout', adminController.logout);
router.get('/home', authMiddleware, adminController.home);
router.get('/clients', authMiddleware, adminController.clients);
router.get('/create', authMiddleware, adminController.create);
router.post('/create', authMiddleware, upload.single('image'), adminController.processCreate);
router.get('/edit/:id', authMiddleware, adminController.edit);
router.put('/edit/:id', authMiddleware, adminController.update);
router.delete('/delete/:id', authMiddleware, adminController.delete);

module.exports = router;