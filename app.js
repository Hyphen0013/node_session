const express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const keys = require('./config/keys');

// Get all routes js file
const { homePage } = require('./routes/index'); // index.js
const { registerPage, userRegister } = require('./routes/users'); // users.js


const app = express();


// Database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_session'
});
db.connect((err) => {
    if(err) throw err;
    else console.log('Connected to Database...');
});
global.db = db;

// Configure middleware
app.use(express.static('./public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());




// Routes
app.get('/', homePage);
app.get('/register', registerPage);

app.post('/register', userRegister);



app.listen(keys.PORT, (err) => {
    console.log(`Server is running on PORT: ${keys.PORT}`);
})

