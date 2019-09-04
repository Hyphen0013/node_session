module.exports = {
    ensureAuthenticated: (req, res, next) => {
        errors = [];
        if(req.isAuthenticated()) {
            return next();
        }
        errors.push({ msg: 'Please log in first!'})
        res.redirect('/login');
    },

    forwardAuthenticated: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
}