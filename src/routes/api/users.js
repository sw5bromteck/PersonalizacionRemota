const express = require('express');
const router = express.Router();

router.get('/', userRoutes.list);
router.get('/detail/:id', userRoutes.detail);

module.exports = router