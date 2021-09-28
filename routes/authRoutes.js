const express = require('express');
const router= express.Router();
const authController= require('../controllers/authController');

router.get('/', (req, res) => res.render('home'));
router.get('/profile', (req, res) => res.render('profile'));

//signup

router.get('/signup',authController.signup_get)
router.post('/signup',authController.signup_post)

//login
router.get('/login',authController.login_get)
router.post('/login',authController.login_post)

//forgotPassword
router.get('/login/forgotPass',authController.fg_get)
router.post('/login/forgotPass',authController.fg_post)




module.exports=router;