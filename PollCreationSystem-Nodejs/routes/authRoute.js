const express = require("express");

const authControllers=require("../controllers/authController")

const router = express.Router();

// Check Email Route
router.post('/check-email',authControllers.checkEmail );
// Register Route
router.post("/register", authControllers.register);

// Login Route
router.post("/login", authControllers.login);

// Logout Route
router.get("/logout", authControllers.logout);


// Edit Profile Route
router.put('/editprofile', authControllers.editProfile);

module.exports = router;
