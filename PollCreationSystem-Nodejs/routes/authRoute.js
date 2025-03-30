const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

const authControllers=require("../controllers/authController")

const router = express.Router();


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

module.exports = router;
