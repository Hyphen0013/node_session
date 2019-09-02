var mysql = require('mysql');


module.exports = {
    registerPage: (req, res, next) =>{
        
        res.render('pages/registration.ejs', {
            title: 'Registration Page',
            message: ''
        });
    },

    userRegister: (req, res, next) =>{

        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        console.log(username)
        console.log(email)
        console.log(password)

        let queryInsert = "INSERT INTO users (username, email, password) VALUES ('" + username +"', '" + email + "', '" + password + "')";
        db.query(queryInsert, (err, results, fields) => {
            if (err) throw err;

            res.render('pages/registration', {
                title: 'Registration Completed',
                message: 'Registration here'
            });
        });
    }

    
}