const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const  sequelize  = require("./config/database.js");
const authRoutes = require("./routes/authRoute.js");
const pollsRoutes = require("./routes/pollsRoute.js");
const cors = require("cors");
const configurePassport = require("./config/passport.js");


// Initialize Express
const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Allow frontend access
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS for preflight requests
    allowedHeaders: ["Content-Type", "Authorization"], // Headers that can be sent in requests
    exposedHeaders: ["Authorization"], // Allows the frontend to access specific headers
  })
);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




const SequelizeStore = require("connect-session-sequelize")(session.Store);
const Session = require("./models/Session"); // Import the session model

// Initialize session store with MySQL
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Sessions", // Ensure this matches your MySQL table
  model: Session, // Explicitly set the model
});

app.use(
  session({
    secret: "your_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: false, // Set `true` in production with HTTPS
    },
  })
);

// Sync the session table
sessionStore.sync();


// Passport Middleware
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/polls", pollsRoutes);
app.get("/profile", (req, res) => {
  const user={
       fname:req.user.fname,
       lname:req.user.lname,
       email:req.user.email,
       phoneNumber:req.user.phoneNumber
  }
  res.json({ message: "API is running", user  });
});

// Database Sync
sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(" Database connection error:", err));

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "API is running", user: req.user || null });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
