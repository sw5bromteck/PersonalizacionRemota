const db = require('../database/models');
const Products = db.product;

const controller = {
    index: function (req, res) {
        res.render('./admin/index', { title: 'Home' });
    },
};

module.exports = controller;