const express = require("express");
const router = express.Router();

router.get("/polls/active", (req, res) => {
  const  data =[
    {
      "_id": "1",
      "question": "Favorite programming language?",
      "createdBy": "Alice Johnson",
      "expiryDate": "2025-03-20T18:00:00Z",
      "totalVotes": 120,
      "allowMultiple": true,
      "options": ["JavaScript", "Python", "Java", "C#"]
    },
    {
      "_id": "2",
      "question": "Favorite programming language?",
      "createdBy": "Alice Johnson",
      "expiryDate": "2025-03-20T18:00:00Z",
      "totalVotes": 120,
      "allowMultiple": false,
      "options": ["JavaScript", "Python", "Java", "C#"]
    },
   
    {
      "_id": "4",
      "question": "Favorite programming language?",
      "createdBy": "Alice Johnson",
      "expiryDate": "2025-03-20T18:00:00Z",
      "totalVotes": 120,
      "allowMultiple": false,
      "options": ["JavaScript", "Python", "Java", "C#"]
    }
  ]
  
    res.json({ data: data });
  });

  router.put("/polls/vote",(req,res)=>{
    console.log(req.body);
    res.json({message:req.body.selectedOptions});
  })



  // Get all polls created by the logged-in user
router.get('/polls/user/:userId', (req, res) => {
    // const userId = req.params.userId;
    // const query = 'SELECT * FROM polls WHERE createdBy = ?';
  
    // db.query(query, [userId], (err, results) => {
    //   if (err) {
    //     return res.status(500).json({ message: 'Error fetching polls' });
    //   }
    const results=[
      {
        "id": 1,
        "question": "What is your favorite sport?",
        "expiryDate": "2025-03-15T12:00:00Z",
        "totalVotes": 120,
        "status": "active",
        "createdBy": 1,
        "creatorName": "John Doe",
        "options": [
          { "id": 1, "pollId": 1, "optionText": "Football", "votes": 50 },
          { "id": 2, "pollId": 1, "optionText": "Basketball", "votes": 30 },
          { "id": 3, "pollId": 1, "optionText": "Cricket", "votes": 40 }
        ]
      },
      {
        "id": 1,
        "question": "What is your favorite sport?",
        "expiryDate": "2025-03-15T12:00:00Z",
        "totalVotes": 120,
        "status": "active",
        "createdBy": 1,
        "creatorName": "John Doe",
        "options": [
          { "id": 1, "pollId": 1, "optionText": "Football", "votes": 50 },
          { "id": 2, "pollId": 1, "optionText": "Basketball", "votes": 30 },
          { "id": 3, "pollId": 1, "optionText": "Cricket", "votes": 40 }
        ]
      },
      {
        "id": 1,
        "question": "What is your favorite sport?",
        "expiryDate": "2025-03-15T12:00:00Z",
        "totalVotes": 120,
        "status": "active",
        "createdBy": 1,
        "creatorName": "John Doe",
        "options": [
          { "id": 1, "pollId": 1, "optionText": "Football", "votes": 50 },
          { "id": 2, "pollId": 1, "optionText": "Basketball", "votes": 30 },
          { "id": 3, "pollId": 1, "optionText": "Cricket", "votes": 40 }
        ]
      },
      {
        "id": 1,
        "question": "What is your favorite sport?",
        "expiryDate": "2025-03-15T12:00:00Z",
        "totalVotes": 120,
        "status": "active",
        "createdBy": 1,
        "creatorName": "John Doe",
        "options": [
          { "id": 1, "pollId": 1, "optionText": "Football", "votes": 50 },
          { "id": 2, "pollId": 1, "optionText": "Basketball", "votes": 30 },
          { "id": 3, "pollId": 1, "optionText": "Cricket", "votes": 40 }
        ]
      },
      {
        "id": 2,
        "question": "What is your favorite sport?",
        "expiryDate": "2025-03-15T12:00:00Z",
        "totalVotes": 120,
        "status": "active",
        "createdBy": 1,
        "creatorName": "John Doe",
        "options": [
          { "id": 1, "pollId": 1, "optionText": "Football", "votes": 50 },
          { "id": 2, "pollId": 1, "optionText": "Basketball", "votes": 30 },
          { "id": 3, "pollId": 1, "optionText": "Cricket", "votes": 40 }
        ]
      }
    ]
    
      
      res.json(results);
    });
 
  
  // Update poll status (Start/Stop Poll)
  router.put('/polls/:pollId/status', (req, res) => {
    const { status } = req.body;
    const pollId = req.params.pollId;
    const query = 'UPDATE polls SET status = ? WHERE id = ?';
  
    db.query(query, [status, pollId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating poll status' });
      }
      res.json({ message: `Poll status updated to ${status}` });
    });
  });
  
  // Delete poll
  router.delete('/polls/:pollId', (req, res) => {
    const pollId = req.params.pollId;
    const query = 'DELETE FROM polls WHERE id = ?';
  
    db.query(query, [pollId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting poll' });
      }
      res.json({ message: 'Poll deleted successfully' });
    });
  });
  



router.post("/polls",(req,res)=>{
  req.body.email=req.user.email;
  console.log(req.body)
  res.send("success")
})  
  
  module.exports = router;
  