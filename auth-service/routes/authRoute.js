const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

const authControllers=require("../controllers/authController")

const router = express.Router();


const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // Must match the key used to sign tokens


router.post('/email/send', authControllers.sendEmail);


// Check Email Route
router.post('/check-email',authControllers.checkEmail );
// Register Route
router.post("/register", authControllers.register);

// Login Route
router.post("/login", authControllers.login);

// Logout Route
router.get("/logout", authControllers.logout);


// Edit Profile Route
router.put('/editprofile',isLoggedIn, authControllers.editProfile);




// API endpoint for Spring Boot to verify tokens
router.post('/verify-jwt', authControllers.verifyJWTToken);


module.exports = router;
