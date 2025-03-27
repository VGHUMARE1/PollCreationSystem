const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const pollsController=require("../controllers/pollsController");
const {
  MyPolls,
  Poll,
  ActivePolls,
  VotedPolls,
} = require("../utils/staticData");
const { isLoggedIn } = require("../middlewares/authMiddlewares");

router.get("/active", isLoggedIn, pollsController.getActivePolls);

router.get("/user/:id", isLoggedIn,pollsController.getYourPolls);

router.get("/voted-by-user", isLoggedIn,pollsController.getVotedPolls);

router.get("/:id", isLoggedIn,pollsController.getPollById);

router.post("/vote", isLoggedIn, pollsController.giveVote);

router.post("/", isLoggedIn, pollsController.createPoll);

router.put("/update",isLoggedIn ,pollsController.updatePoll);

router.put("/changeVote", isLoggedIn, pollsController.changeVote);

router.put("/expiry/:pollId", isLoggedIn, pollsController.changeExpiryDate);

router.put("/:pollId/status", isLoggedIn, pollsController.changeStatusOfPoll);

router.delete("/:pollId",isLoggedIn,pollsController.deletePoll);

router.delete("/:pollId/vote", isLoggedIn, pollsController.deleteVote);

module.exports = router;
