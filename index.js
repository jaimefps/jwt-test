const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'welcome to the api'
  });
});

app.get('/api/jwt', (req, res) => {
  // mock user data:
  const user = {
    id: 1,
    username: 'jaime',
    email: 'jaime@gmail.com',
  };
  // async jwt:
  jwt.sign({ user }, 'secretKey', (err, token) => {
    res.json({
      token,
    });
  });
});

app.post('/api/post', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'post created...',
        authData,
      });
    }
  });
});

function verifyToken (req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader != 'undefined') {
    // format: "authorization: bearer <access_token>:
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403).end();
  }
}

app.post('/api/login', (req, res) => {
  // mock user data:
  const user = {
    id: 1,
    username: 'jaime',
    email: 'jaime@gmail.com',
  };
  // async jwt:
  jwt.sign({user}, 'secretKey', {expiresIn: '30s'}, (err, token) => {
    res.json({
      token,
    });
  });
});

app.listen(8000, () => console.log('server @ 8000'));