const router = require("express").Router();
const User = require("../models/user");
//const verifyToken = require("../middelwares/verify-token");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');



router.post('/auth/signup', (req, res, next) => {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  newUser.save(err => {
    if (err) {
      return res.status(400).json({
        title: 'error',
        error: 'email in use'
      })
    }
    return res.status(200).json({
      title: 'signup success'
    })
  })
})
router.post('/auth/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).json({
      title: 'server error',
      error: err
    })
    if (!user) {
      return res.status(401).json({
        title: 'user not found',
        error: 'invalid credentials'
      })
    }
    //incorrect password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        tite: 'login failed',
        error: 'invalid credentials'
      })
    }
    //IF ALL IS GOOD create a token and send to frontend
    let token = jwt.sign({ userId: user._id}, 'secretkey');
    return res.status(200).json({
      title: 'login sucess',
      token: token
    })
  })
})  

//grabbing user info
router.get('/auth/user', (req, res, next) => {
  let token = req.headers.token; //token
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'unauthorized'
    })
    //token is valid
    User.findOne({ _id: decoded.userId }, (err, user) => {
      if (err) return console.log(err)
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          email: user.email,
          name: user.name
        }
      })
    })

  })
})

// Login
/*
router.post("/auth/login", async (req, res) => {
    try {
      let foundUser = await User.findOne({
        email: req.body.email
      });
      if (!foundUser) {
        res.status(403).json({
          success: false,
          message: "Authentication failed, User not found"
        });
      } else {
        if (foundUser.comparePassword(req.body.password)) {
          let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
            expiresIn: 604800 // 1 week
          });
  
          res.json({
            success: true,
            token: token
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Authentication failed, Wrong password!"
          });
        }
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });
  

// Sign Up
router.post("/auth/signup", async(req, res) => {
  console.log(res)
  if (!req.body.email || !req.body.password) {
    res.json({ 
      success: false,
      message: "Please enter your email and password"
     });
  } else {
    try {
      let newUser = new User();
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.password = req.body.password;

      await newUser.save();
      let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
        expiresIn: 604800 //1 WEEK
      });

      res.json({
        success: true,
        token: token,
        message: "Successfully created"
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
});


// Get Profile
router.get('/auth/user', (req, res, next) => {
  let token = req.headers.token; //token
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'unauthorized'
    })
    //token is valid
    User.findOne({ _id: decoded.userId }, (err, user) => {
      if (err) return console.log(err)
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          email: user.email,
          name: user.name
        }
      })
    })

  })
})
  

// Update profile
router.put("/auth/user", verifyToken, async (req, res) => {
    try {
      let foundUser = await User.findOne({
        _id: req.decoded._id
      });
  
      if (foundUser) {
        if (req.body.name) foundUser.name = req.body.name;
        if (req.body.email) foundUser.email = req.body.email;
        if (req.body.password) foundUser.password = req.body.password;
  
        await foundUser.save();
  
        res.json({
          success: true,
          message: "Successfully updated"
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });
  */
module.exports = router;