const router = require('express').Router()
// import auth controller
const AuthController = require('../controllers/AuthController')

// Import auth middleware
// const Auth = require('../middleware/Auth')

//import validation
const check = require('../validation/CheckValidation')
const auth = require('../middleware/authVerification')
// route list
router.post('/signUp',check.registerValidator(),AuthController.authSignUp)
router.post('/login',check.loginValidator(),AuthController.authLogin)
router.post('/forgotPassword',check.forgotPasswordValidator(),auth,AuthController.forgotPassword)
router.post('/resetPassword',check.resetPasswordValidator(),AuthController.resetPassword)
 


module.exports = router