const fs = require('fs');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const passport = require('passport');


module.exports = {
    registerPage: (req, res, next) => { // get register

        res.render('pages/registration.ejs', {
            title: 'Registration Page',
            message: ''
        });
    },

    userRegister: (req, res, next) => { // post register

        if (!req.files) {
            res.render('pages/registration.ejs', {
                title: '',
                message: 'Upload Files'
            });
        }

        let username = req.body.username.toLocaleLowerCase();
        let email = req.body.email.toLocaleLowerCase();
        let password = req.body.password.toLocaleLowerCase();
        let password1 = req.body.password1.toLocaleLowerCase();
        let phone = req.body.phone;
        let uploadedFile = req.files.avtar;

        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        // validation handling 

        const errors = [];
        const illegalChars = /^\w+$/; // allow letters, numbers, and underscores
        const emailValid = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        const phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;


        if (!username || !email || !password || !password1 || !phone) {
            errors.push({ msg: 'Pleaser fill all require fields' });
        }

        if (username.length < 5 || username.length > 15) {
            errors.push({ msg: 'username in between 5 to 15 characters only' })
        }

        if (!illegalChars.test(username)) {
            errors.push({ msg: 'username must be alphanumeric and underscore' })
        }

        if (!emailValid.test(email)) {
            errors.push({ msg: 'Not a valid email' })
        }

        if (password != password1) {
            errors.push({ msg: 'Password not matched!' })
        }

        if (password.length < 5 || password.length > 15) {
            errors.push({ msg: 'Password in between 5 to 15 characters. ' })
        }

        if (!phoneNum.test(phone)) {
            errors.push({ msg: "Entere correct contact number." })
        }

        if (errors.length > 0) {
            res.render('pages/registration.ejs', {
                title: '',
                message: JSON.stringify(errors)
            });
        } else {


            const usernameQuery = "SELECT * FROM users WHERE username = '" + username + "' ";
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function (err, hash) {

                db.query(usernameQuery, (err, result) => {

                    if (err) { return res.status(500).send(err); }

                    if (result.length > 0) {
                        res.render('pages/registration.ejs', {
                            title: '',
                            message: 'user already exists'
                        });

                    } else {
                        let queryInsert = "INSERT INTO users (username, email, password, phone, avtar) VALUES (?, ?, ?, ?, ?)";

                        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                            uploadedFile.mv(`public/assets/users/profile/${image_name}`, (err) => {
                                if (err) {
                                    return res.status(500).send(err);
                                }

                                db.query(queryInsert, [username, email, hash, phone, image_name], (err, result, fields) => {
                                    if (err) throw err;
                                    
                                    db.query("SELECT LAST_INSERT_ID() as user_id", (err, result, fields) => {
                                        if (err) throw err;

                                        const user_id = JSON.stringify(result[0]);
                                        req.login(user_id, (err) => {
                                            res.redirect('/login');
                                        });
                                    });
                                });
                            });
                        }
                    }
                });

            });


        }
    },

    userProfile: (req, res) => {
        errors = [];
        res.render('pages/profile.ejs', {
            title: 'User Profile'
        });
    },

    userLogin: (req, res) => {
        res.render('pages/login.ejs', {
            title: 'Login Page'
        })
    }
}


passport.serializeUser(function (user_id, done) {
    console.log('Serialize: ' + user_id)
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});


