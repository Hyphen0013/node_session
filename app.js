const fileUpload = require('express-fileupload');
const express = require('express');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MySQLStore = require('express-mysql-session')(session);

const { ensureAuthenticated } = require('./config/auth');

const keys = require('./config/keys');

// Get all routes js file
const { homePage } = require('./routes/index'); // index.js
const { registerPage, userRegister, userProfile, userLogin, userLoginPost, userLogout } = require('./routes/users'); // users.js


const app = express();


// Database connection
/* const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_session'
});
*/

const options = ({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_session'
});

const db = mysql.createConnection(options)
const sessionStore = new MySQLStore({}, db);

// db.connect((err) => {
//     if(err) throw err;
//     else console.log('Connected to Database...');
// });
global.db = db;




// Configure middleware
app.use(express.static('./public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use(cookieParser());

app.use(session({
    secret: 'hyphen',
    resave: true,
    store: sessionStore,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    // Match user
    const queryPass = 'SELECT id, password FROM users WHERE username = ?';
    db.query(queryPass, [username], (err, result, fields) => {
        if (err) done(err);

        if (result.length === 0) {
            done(null, false);
        } else {

            const hash = result[0].password.toString();
            bcrypt.compare(password, hash, (err, response) => {

                if (response === true) {
                    return done(null, ({ user_id: result[0].id }))
                } else {
                    return done(null, false)
                }
            });
        }
    })
}));



// Routes
app.get('/', homePage);
app.get('/register', registerPage);
app.get('/login', userLogin);
app.get('/profile', ensureAuthenticated, userProfile);
app.get('/logout', userLogout);

app.post('/register', userRegister);
app.post('/login', userLoginPost);



app.listen(keys.PORT, (err) => {
    console.log(`Server is running on PORT: ${keys.PORT}`);
})

