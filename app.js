var express = require( 'express' );
var app = module.exports = express.createServer();
var GoogleStrategy = require('passport-google').Strategy;
var passport = require('passport');
// mongoose setup
require( './db' );

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:5000/auth/google/return',
    realm: 'http://localhost:5000/'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));




var routes = require( './routes' );
// Configuration
app.configure( 'development', function (){
  app.set( 'views', __dirname + '/views' );
  app.set( 'view engine', 'ejs' );
  app.use( express.favicon());
  app.use( express.static( __dirname + '/public' ));
  app.use( express.logger());
  app.use( express.cookieParser());
  app.use( express.bodyParser());
  app.use( routes.current_user );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use( app.router );
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.configure( 'production', function (){
  app.set( 'views', __dirname + '/views' );
  app.set( 'view engine', 'ejs' );
  app.use( express.cookieParser());
  app.use( express.bodyParser());
  app.use( routes.current_user );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use( app.router );
  app.use( express.errorHandler());
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.get('/auth/google',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/main');
});

app.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/main');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get( '/', routes.index );

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});
  
// Routes
app.get( '/', routes.index );
app.get( '/main', routes.main );
app.post( '/create', routes.create );
app.get( '/destroy/:id', routes.destroy );
app.get( '/edit/:id', routes.edit );
app.post( '/update/:id', routes.update );

var port = process.env.PORT || 5000;
app.listen(port, function (){
  console.log( 'Express server listening on port %d in %s mode', app.address().port, app.settings.env );
});
