

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');

const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');

const passport = require('passport');
const cookieSession = require('cookie-session');
const passportSetup = require('./config/passport-setup');
const key = require('./config/key');

const hbs = require('express-handlebars');

const app = express();

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_COOKIE_KEY || key.SESSION_COOKIE_KEY]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/auth', authRouter);
app.use('/game', gameRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
