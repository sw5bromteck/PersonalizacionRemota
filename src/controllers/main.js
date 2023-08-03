const db = require('../database/models');
const Products = db.product;

const controller = {
    index: function (req, res) {
        res.render('./admin/index', { name: 'main', title: 'Home' });
    },
};

module.exports = controller;