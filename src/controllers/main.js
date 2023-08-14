const db = require('../database/models');
const Products = db.product;

const controller = {
    index: function (req, res) {
        res.render('./admin/login', { name: 'login', title: 'LOGIN' });
    },
};

module.exports = controller;