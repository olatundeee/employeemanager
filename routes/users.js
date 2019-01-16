var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');


var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.Password, 8);

  User.create({
    Name: req.body.Name,
    Password: hashedPassword,
    Username: req.body.Username,
    Role: req.body.Role
  }, (err, user) => {
    if(err) {
      res.send(err);
    }

    res.json(user);
  });

  

    /**
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400
    });
    
    res.status(200).send({ 
      auth: true
      //, token: token 
    }); */
});

router.get('/users', function(req, res) {
  User.find(req.query, {password: 0}, function(err, users) {
    res.json(users)
  })
})

router.get('/user/:id',/* verfiyToken,*/ function(req, res){
  User.findOne({ Username : req.params.id }, function(err, user) {
      if(err) {
        return res.status(500).send('There was a problem finding the user');
      }

      if(!user) {
        return res.status(404).send('No user found for'+ ' ' + req.params.username)
      }

      res.status(200).send(user)
    });
});

router.post('/login', function(req, res) {
  User.findOne({ Username: req.body.Username }, function(err, user) {
    if(err) {
      return res.status(200).send('Server error encountered');
    }

    if(!user) {
      return res.status(404).send('User not found');
    }

    var passwordisValid = bcrypt.compareSync(req.body.Password, user.Password);

    if (!passwordisValid) {
      return res.status(401).send({
        auth: false,
        token: null
      })
    }

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400
    });

    res.status(200).send({
      auth: true,
      token: token
    });
  })
})

router.get('/logout', function(req, res){
  res.status(200).send({ 
    auth: false,
    token: null
  })
})

module.exports = router;
