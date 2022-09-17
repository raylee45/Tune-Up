require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');

const SECRET_SESSION = process.env.SECRET_SESSION;
console.log('yooooo..... >>>', SECRET_SESSION);

app.set('view engine', 'ejs');

/**
 * app.use routes
*/
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

app.use(flash());            // flash middleware

app.use(passport.initialize());      // Initialize passport
app.use(passport.session());         // Add a session

app.use((req, res, next) => {
  console.log(`res locals >>>`, res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})

// app.use('/auth', require('./controllers/auth'));
// app.use('/profile', require('./controllers/user'))
app.use('/favorites', require('./controllers/favorites'))
// app.use('/search', require('./controllers/search'))


/*
* app.get routes
*/
app.get('/', (req, res) => {
  res.render('index');
})

app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

app.get('/favorites', isLoggedIn, (req, res) => {
  res.render('favorites/faves')
})

app.get('/search', isLoggedIn, (req, res) => {
  res.render('search/search')
})

app.get('/search/results', isLoggedIn, (req, res) => {
  res.render('search/results')
})

app.get('/search/history', isLoggedIn, (req, res) => {
  res.render('search/history')
})

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
