module.exports.MyPolls=[
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



module.exports.Poll= {
    "id": 1,
    "allowMultiple": true,
    "expiryDateTime": "2025-04-20T18:00:00Z",
    "question": "What is your favorite color?",
    "status": "active",
    "creator": {
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "options": [
      {
        "id": 1,
        "optionText": "Red",
        "votes": 20
      },
      {
        "id": 3,
        "optionText": "Rfwefweed",
        "votes": 30
      },
      {
        "id": 2,
        "optionText": "fwfwe",
        "votes": 40
      },
      {
        "id": 4,
        "optionText": "Redsfwefd",
        "votes": 10
      },
      {
        "id": 5,
        "optionText": "black",
        "votes": 30
      }
      
    ],
    "voters": [
      {
        "name": "Alice",
        "email": "alice@example.com",
        "votedOptionId": 3
      },
      {
        "name": "Bob",
        "email": "bob@example.com",
        "votedOptionId": 2
      }
    ]
}


module.exports.ActivePolls=[
    {
      "_id": "1",
      "question": "Favorite programming language?",
      "createdBy": "Alice Johnson",
      "expiryDate": "2025-03-20T18:00:00Z",
      "totalVotes": 120,
      "allowMultiple": false,
      "options": ["JavaScript", "Python", "Java", "C#"]
    },
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
  


  module.exports.VotedPolls=[
    {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "question": "Which frontend framework do you prefer for large-scale applications?",
      "options": [
        "Angular",
        "React",
        "Vue.js",
        "Svelte",
        "Other"
      ],
      "userVotes": ["Angular"],
      "totalVotes": 245,
      "createdBy": "tech_admin",
      "expiryDate": "2023-07-31T00:00:00.000Z",
      "votedDate": "2023-06-15T14:30:22.456Z"
    },
    {
      "_id": "64a2b3c4d5e6f7a8b9c0d1e2",
      "question": "How often do you participate in online polls?",
      "options": [
        "Daily",
        "Weekly",
        "Monthly",
        "Rarely",
        "First time"
      ],
      "userVotes": ["Weekly"],
      "totalVotes": 189,
      "createdBy": "poll_master",
      "expiryDate": "2023-08-15T00:00:00.000Z",
      "votedDate": "2023-06-18T09:15:33.789Z"
    },
    {
      "_id": "64a3b4c5d6e7f8a9b0c1d2e3",
      "question": "Which features are most important in a polling app? (Select multiple)",
      "options": [
        "Real-time results",
        "Mobile responsiveness",
        "Anonymous voting",
        "Multiple question types",
        "Social sharing",
        "Detailed analytics"
      ],
      "userVotes": ["Mobile responsiveness", "Anonymous voting", "Detailed analytics"],
      "totalVotes": 312,
      "createdBy": "feature_researcher",
      "expiryDate": "2023-09-01T00:00:00.000Z",
      "votedDate": "2023-06-20T16:45:11.234Z"
    },
    {
      "_id": "64a4b5c6d7e8f9a0b1c2d3e4",
      "question": "What's your preferred way to authenticate in web apps?",
      "options": [
        "Email/password",
        "Google OAuth",
        "GitHub OAuth",
        "Facebook Login",
        "Biometric",
        "SSO"
      ],
      "userVotes": ["Google OAuth"],
      "totalVotes": 178,
      "createdBy": "auth_expert",
      "expiryDate": "2023-07-20T00:00:00.000Z",
      "votedDate": "2023-06-10T11:20:44.567Z"
    },
    {
      "_id": "64a5b6c7d8e9f0a1b2c3d4e5",
      "question": "Which JavaScript runtime do you primarily use?",
      "options": [
        "Node.js",
        "Deno",
        "Bun",
        "Browser only",
        "Other"
      ],
      "userVotes": ["Node.js"],
      "totalVotes": 203,
      "createdBy": "js_enthusiast",
      "expiryDate": "2023-08-10T00:00:00.000Z",
      "votedDate": "2023-06-22T13:10:55.890Z"
    }
  ]