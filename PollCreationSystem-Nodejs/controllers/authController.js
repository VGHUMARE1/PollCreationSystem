const CryptoJS = require('crypto-js');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const axios=require("axios")

function decryptData(encryptedData, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports.register=async (req, res) => {
    console.log(req.body);
    const { first_name, last_name, email, password, phone_no } = req.body;
  
    try {
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user = await User.create({ 
        first_name, 
        last_name, 
        email, 
        password: hashedPassword, 
        phone_no 
      });
  
      console.log("User registered successfully");
      res.json({ msg: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }


  module.exports.login= (req, res, next) => {
    const { email, password } = req.body;
    
    const secretKey =  'topSecret';
  
    const decryptedEmail = decryptData(email, secretKey);
    const decryptedPassword = decryptData(password, secretKey);
  
    req.body.password = decryptedPassword;
    console.log(req.body);
    passport.authenticate("local", (err, user, info) => {
      if (err) return res.status(500).json({ msg: "Server error", error: err });
  
      if (!user) {
        return res.status(400).json({ msg: info.message });
      }
  
      req.logIn(user, (err) => {
        if (err) return res.status(500).json({ msg: "Session error", error: err });
  
        return res.json({ msg: "Logged in successfully", user });
      });
    })(req, res, next);
  }

  module.exports.logout=(req, res) => {
    req.logout(() => {
      res.json({ msg: "Logged out successfully" });
    });
  }


  module.exports.checkEmail=async (req, res) => {
    const { email } = req.body;
    try {
      let user = await User.findOne({ where: { email } });
      return res.json(!!user);
    } catch (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }


  module.exports.editProfile=async (req, res) => {
    const { first_name, last_name, phone_no } = req.body;
  
    if (!first_name || !last_name || !phone_no) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    if (!/^[0-9]{10}$/.test(phone_no)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
  
    try {
      const email = req.user.email; 
  
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.first_name = first_name;
      user.last_name = last_name;
      user.phone_no = phone_no;
  
      await user.save();
  
      return res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }


  module.exports.sendEmail=async (req, res) => {
    try {
      const { email, subject, message } = req.body;
      
      if (!email || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    console.log(req.body);
     
      const response = await axios.post(`${process.env.APIURL}/email/send`, {
        email,
        subject,
        message
      });
  
      if (response.status === 200) {
        return res.status(200).json({ 
          success: true,
          message: response.data || `Email sent successfully to ${email}`
        });
      } else {
        return res.status(response.status).json({ 
          error: 'Failed to send email',
          details: response.data 
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      
      if (error.response) {
       
        return res.status(error.response.status).json({
          error: 'Email service error',
          details: error.response.data
        });
      } else if (error.request) {
       
        return res.status(503).json({
          error: 'Email service unavailable',
          details: 'No response from email service'
        });
      } else {
        
        return res.status(500).json({
          error: 'Internal server error',
          details: error.message
        });
      }
    }
  }