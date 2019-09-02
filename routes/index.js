module.exports = {
    homePage: (req, res) => {
        res.render('layouts/welcome.ejs', {
            title: 'Home Page'
        });
    } 
}