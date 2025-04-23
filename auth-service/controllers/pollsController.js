
const axios=require("axios");

const CryptoJS = require("crypto-js");


function decryptData(encryptedData, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
module.exports.getActivePolls = async (req, res) => {
  try {
    const result = await axios.get(
      `${process.env.APIURL}/polls/active?email=${req.user.email}`
    );
    console.dir(result.data)
    console.log(result.data[0].options[0])
    
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ msg: error.message || "Internal Server Error" });
  }
};



module.exports.getYourPolls=async (req, res) => {
  try {
    const result = await axios.get(
      `${process.env.APIURL}/polls/user?email=${req.user.email}`
    );

    console.log(result.data);

    // Send success response with status 200
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error.message);

    // Send error response with status 500
    res.status(500).json({ msg: error.message || "Internal Server Error" });
  }
}

module.exports.getVotedPolls=async (req, res) => {
  try {
    const result = await axios.get(
      `${process.env.APIURL}/polls/voted?email=${req.user.email}`
    );

    console.log(result.data);

    // Send success response with status 200
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error.message);

    // Send proper error response with status 500
    res.status(500).json({ msg: error.message || "Internal Server Error" });
  }
}

module.exports.getPollById=async (req, res) => {
  const { id } = req.params;
  try {
    const result = await axios.get(
      `${process.env.APIURL}/polls/analysis?pollId=${id}`
    );

    console.log(result.data);

    // Send success response with status 200
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error.message);

    // Send proper error response with status 500
    res.status(500).json({ msg: error.message || "Internal Server Error" });
  }
}


module.exports.giveVote = async (req, res) => {
  req.body.voterEmail = req.user.email;
  console.log("Request Body:", req.body);

  try {
    const response = await axios.post(
      `${process.env.APIURL}/polls/vote`,
      req.body
    );

    console.log("Response Data:", response.data);

    return res.status(200).json({
      voteIds: response.data.voteIds,
      message: response.data.message,
    });
  } catch (error) {
    console.error("Error Response:", error.response?.data || error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        voteIds: error.response.data.voteIds,
        message: error.response.data.message,
      });
    }
    
    return res.status(500).json({
      voteIds: null,
      message: "Internal Server Error",
    });
  }
};



module.exports.deleteVote= async (req, res) => {
  const { pollId } = req.params;
  const email =req.user.email;

  try {
    const result = await axios.delete(
      `${process.env.APIURL}/polls/deleteVote?email=${email}&pollId=${pollId}`
    );

    console.log(result);

    // Check if the response status is 400
    if (result.status === 400) {
      return res
        .status(400)
        .json({ msg: result.data || "Bad Request: Invalid Poll ID or Email" });
    }

    // Send success response with status 200
    res.status(200).json({ msg: result.data || "Vote deleted successfully" });
  } catch (error) {
    console.error(error);

    // Handle Axios-specific errors
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        return res
          .status(400)
          .json({ msg: data || "Bad Request: Invalid Poll ID or Email" });
      }
      return res.status(status).json({ msg: data || "An error occurred" });
    }

    // Handle unexpected errors
    res.status(500).json({ msg: error.message || "Internal Server Error" });
  }
}

module.exports.updatePoll=async (req, res) => {
  try {
    const { pollId, question, allowMultipleSelect, options } = req.body;

    // Validate request
    if (
      !pollId ||
      !question ||
      !Array.isArray(options) ||
      options.length === 0
    ) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Forward the request to Spring Boot API
    const response = await axios.put(`${process.env.APIURL}/polls/update`, {
      pollId,
      question,
      allowMultipleSelect,
      options,
    });
    console.log(response);
    // Send Spring Boot response to frontend
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error updating poll:", error);
    res.status(500).json({ error: "Failed to update poll" });
  }
}



module.exports.changeVote=async (req, res) => {
  try {
    req.body.voterEmail =req.user.email; // Hardcoded for testing

    console.log("Request Body:", req.body);

    const result = await axios.put(
      `${process.env.APIURL}/polls/changeVote`,
      req.body
    );
    const responseData = result.data;

    console.log("Backend Response:", responseData);

    // Success response
    if (responseData === "Vote changed successfully.") {
      return res.status(200).json({ message: responseData });
    }

    // Handling different 400 Bad Request cases
    const badRequestMessages = [
      "Cannot change vote to the same vote. No changes detected.",
      "Cannot change vote. Poll is not active.",
      "User has not voted in this poll.",
      "An unexpected error occurred: One or more options do not belong to the given poll.",
    ];

    if (badRequestMessages.includes(responseData.message)) {
      return res.status(400).json({ message: responseData.message });
    }

    // Handling Option Not Found Error
    if (responseData.message?.startsWith("Option not found with ID:")) {
      return res.status(400).json({ message: responseData.message });
    }

    // If response is unexpected
    return res
      .status(500)
      .json({ message: "Unexpected response from backend." });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);

    // Handle axios error with proper response
    if (error.response) {
      return res.status(error.response.status || 500).json({
        message: error.response.data?.message || "Internal Server Error",
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}



module.exports.changeExpiryDate = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { expiryDateTime } = req.body;

    if (!expiryDateTime) {
      return res.status(400).json({ message: "Expiry date is required" });
    }

    const response = await axios.put(
      `${process.env.APIURL}/polls/expiry/${pollId}?newExpiryDate=${expiryDateTime}`
    );

    console.log("Response Data:", response.data);
    return res.status(200).json({
      message: `Expiry date updated successfully for Poll ID: ${pollId}`,
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating expiry date:", error.response?.data || error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message || "An unexpected error occurred",
        data: null,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
    });
  }
};


module.exports.changeStatusOfPoll=async (req, res) => {
  try {
    const { status } = req.body;
    const pollId = req.params.pollId;
    let result;
    if (status === "stopped") {
      result = await axios.put(`${process.env.APIURL}/polls/stop/${pollId}`);
    } else {
      result = await axios.put(`${process.env.APIURL}/polls/resume/${pollId}`);
    }

    if (result) {
      res.json({ message: `Poll status updated to ${status}` });
    } else {
      res.status(404).json({ message: "Poll not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating poll status" });
  }
}





module.exports.deletePoll=  async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const result = await axios.delete(`${process.env.APIURL}/polls/delete?id=${pollId}`);

    if (result) {
      res.json({ message: "Poll deleted successfully" });
    } else {
      res.status(404).json({ message: "Poll not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting poll" });
  }
}



module.exports.createPoll=async (req, res) => {
  req.body.email = req.user.email;
  console.log(req.body);

  try {
    const result = await axios.post(
      `${process.env.APIURL}/polls/create`,
      req.body
    );
    console.log(result.data);

    res.status(201).json({
      message: result.data.message || "Poll created successfully!",
      data: result.data.data || null,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: error.response?.data?.message || "Internal Server Error",
      error: error.response?.data || error.message,
    });
  }
}