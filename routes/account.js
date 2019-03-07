const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt');

router.post('/signup', (req, res, next) => {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if(existingUser) {
            res.json({
                success: false,
                message: 'Account With That Email Already Exist'
            })
        } else {
            user.save();

            var token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});

            res.json({
                success: true,
                message: 'Singed Up, Enjoy Your Token',
                token: token
            });
        }
    });
});

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication Failed ,User Not Found'
            })
        } else if (user) {
            
            var validPassword = user.comparePassword(req.body.password);

            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication Failed ,Wrong Password'
                })
            } else {
                var token = jwt.sign({ user: user }, config.secret, { expiresIn: '7d' });

                res.json({
                    success: true,
                    message: 'Authentication SuccessFull, Enjoy Your Token',
                    token: token
                })
            }
        }
    });
});

router.route('/profile')
    .get(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            res.json({
                success: true,
                user: user,
                message: "Successfull"
            });
        });   
    })
    .post(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) return next(err);

            if (req.body.name) user.name = req.body.name;
            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;

            user.isSeller = req.body.isSeller;

            user.save();
            res.json({
                success: true,
                message: 'Successfully edited your profile'
            });
        });
    });

module.exports = router;