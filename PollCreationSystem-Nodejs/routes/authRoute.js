const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

const CryptoJS = require('crypto-js');

// Function to decrypt data
function decryptData(encryptedData, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}


const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  console.log(req.body)
  const { fname, lname, email, password, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    console.log(user);
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ fname, lname, email, password: hashedPassword, phoneNumber });
    console.log("User registered successfully")
    res.json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Login Route
router.post("/login", (req, res, next) => {

  const { email, password } = req.body;
  const secretKey = 'your-secret-key'; // Use the same secret key as the frontend

  // try {
    const decryptedEmail = decryptData(email, secretKey);
    const decryptedPassword = decryptData(password, secretKey);

    console.log('Decrypted email:', decryptedEmail);
    console.log('Decrypted password:', decryptedPassword);
    // req.body.email=decryptedEmail;
    req.body.password=decryptedPassword;
  
  console.log(req.isAuthenticated()); //  Debug request data

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(" Authentication error:", err);  //  Log error
      return res.status(500).json({ msg: "Server error", error: err });
    }

    if (!user) {
      console.warn(" Authentication failed:", info.message);  // Log reason
      return res.status(400).json({ msg: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(" Login session error:", err);  // Log session error
        return res.status(500).json({ msg: "Session error", error: err });
      }

      console.log("User logged in:", user.email);
      return res.json({ msg: "Logged in successfully", user });
    });
  })(req, res, next);  //  Ensure authentication middleware is called correctly
});


// Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    console.log("logout");
    res.json({ msg: "Logged out successfully" });
  });
});




router.post('/check-email', async(req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.json(true); // Email exists
    } else {
      return res.json(false); // Email does not exist
    }
   
  }catch(err){
    console.error('Error registering user:', err);
    return res.status(500).json({ error: 'Database error' });
  }
  });





  router.put('/editprofile', async (req, res) => {
    const { fname, lname, phoneNumber } = req.body;
  
    // Validate input
    if (!fname || !lname || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
  
    try {
      // Get the user's email from the token (assuming it's stored in the token)
      const email = req.user.email; // Replace with how you extract the email from the token
  
      // Find the user by email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user profile (only fname, lname, and phoneNumber)
      user.fname = fname;
      user.lname = lname;
      user.phoneNumber = phoneNumber;
  
      // Save the updated user
      await user.save();
  
      return res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  });
  



  


module.exports = router;
