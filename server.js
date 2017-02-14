var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var sessionsModule = require('client-sessions')

var app = express();

mongoose.connect('mongodb://localhost/alexApp', function(mongooseErr){
  if(mongooseErr) {console.error(mongooseErr)}
  else (console.info('Mongoose Initialized!'))
})


var UserSchema = new mongoose.Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
  created:{type: Number, default: function(){return Date.now()}}
});

var User = mongoose.model('User', UserSchema)

var sessionsMiddleware = sessionsModule({
  cookieName:'auth-cookie',
  secret:'$cr@mbler',
  requestKey: 'session',
  duration: (86400 * 1000) * 7,
  cookie:{
    ephemeral: false,
    httpOnly: true,
    secure: false
  }
});

app.use(sessionsMiddleware)

app.use(express.static('./public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
  console.log('req session', req.session)

  next();
})

var checkIfLoggedIn = function(req, res, next) {
  if(req.session.uid){
    console.log('User is logged in, proceeding to dashboard...');
    next();
  } else {
    console.warn('User is not logged in!')
    res.redirect('/');
  }
}

var checkIfLoggedInForAjax = function(req, res, next) {
  if(req.session.uid){
    console.info('User is logged in, proceeding to dashboard...');
    next();
  } else {
    console.warn ('User is not logged in!')
    res.send('go home');
  }
}

app.get('/', function (req, res){
  res.sendFile('index.html', {root:`./public`})
})

app.get('/about', function(req, res) {
  res.sendFile('about.html', {root: `./public`})
})

app.get('/login-register', function(req, res){
  res.sendFile('login.html', {root:`./public`})
})

app.get('/dashboard', checkIfLoggedIn, function(req, res){

  User.findOne({_id: req.session.uid}, function(err, user) {
    res.sendFile('dashboard.html', {root:'./public'})
  })
})

app.get('/whoami', checkIfLoggedInForAjax, function(req, res){
    User.findOne({_id: req.session.uid}, function(err, user){
        res.send(user)
    })
})

app.post('/register', function(req, res) {
  console.info('Register payload:', req.body);

  var newUser = new User(req.body);

  bcrypt.genSalt(11, (saltErr, salt) => {
    if(saltErr) {console.log(saltErr)}
    console.log('SALT generated!', salt);
    bcrypt.hash(newUser.password, salt, (hashErr, hashedPassword) => {
      if(hashErr) {console.log(hashErr)}
      newUser.password = hashedPassword;

      newUser.save(function(saveErr, user) {
        if(saveErr) {res.status(500).send("Failed to save user")}
        else {
          req.session.uid = user._id;
          res.send({message: 'Register success'});
        }
      })
    })
  })
});

app.post('/login', function(req, res) {
  console.info('auth.login.payload:', req.body);

  User.findOne({email: req.body.email}, function(err, user) {
    if(err) {
      console.log('MongoDB error:'.red, err);
      res.status(500).send('failed to find user')
    }
    else if(!user) {
      console.log('No user found!');
      res.status(403).send('<h1>Login failed</h1>');
    } else {
      console.log('auth.login.user', user);
      bcrypt.compare(req.body.password, user.password, function(bcryptErr, matched) {
        if(bcryptErr) {
          console.error('MongoDB error:', bcryptErr);
          res.status(500).send('mongodb error');
        } else if (!matched) {
          console.warn('Password did not match!');
          res.status(403).send('Failed to log in');
        } else {
          req.session.uid = user._id;
          res.send({message: 'Login success'});
        }
      })
    }
  })
})

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.listen(3000, (err) => {
  if(err) {
    console.log(err)
  } else {
    console.log('/nMEAN Auth Server UP!');
  }
});
