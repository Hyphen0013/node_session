module.exports = {
    homePage: (req, res) => {
        console.log(req.user);
        console.log(req.isAuthenticated())
        res.render('layouts/welcome.ejs', {
            title: 'Home Page'
        });
    } 
}