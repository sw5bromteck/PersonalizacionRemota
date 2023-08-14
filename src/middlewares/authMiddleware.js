function authMiddleware(req, res, next) {
    if (!req.session.userLogged) {
        res.redirect('/admin/login');
    }
    next();
}

module.exports = authMiddleware;