const Project = require("../models/Project.js");
const User = require("../models/userModel.js");
const Feed = require("../models/FeedModel.js");
const Comment = require("../models/Comment.js")
const axios = require("axios")
const addListing = async (req, res) => {
  try {
    const { title, description, objectives, domain, skills, expertise } = req.body;
    const photo = req.file;

    if (!photo) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    const record = new Project({
      title,
      description,
      objectives,
      expertise,
      domain,
      skills,
      userId:req.user._id,
      photos: [{ data: photo.buffer, contentType: photo.mimetype }],
    });
    await record.save();
    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error creating the record" });
  }
};

const getAllListings = async (req, res) => {
  try {
    const listings = await Project.find();
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error retrieving project listings" });
  }
};

const updateProjectListings = async () => {
  try {
    const projectListings = await Project.find({});
    for (const listing of projectListings) {
      listing.createdAt = new Date(); 
      await listing.save();
    }
    console.log("Updated createdAt timestamps for all project listings.");
  } catch (error) {
    console.error("Error:", error.message);
  }
};

updateProjectListings();

const latestListing = async (req, res) => {
  console.log("Request received");
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).exec(); 
    res.status(200).json(projects); 
  } catch (err) {
    console.error("Error:", err); 
    res.status(500).json({ message: "Error fetching records" });
  }
};

const projectPhotoController = async (req, res) => {
  try {
    const project = await Project.findById(req.params.pid).select("photos");
    if (project.photos.data) {
      res.set("Content-type", project.photos.contentType);
      return res.status(200).send(project.photos.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

const projectsByDomain = async (req, res) => {
  try {
    const projectsByDomain = await Project.aggregate([
      {
        $group: {
          _id: '$domain',
          total: { $sum: 1 }
        }
      }
    ]);
    res.json(projectsByDomain);
  } catch (error) {
    console.error('Error fetching projects by domain:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const createFeed = async (req, res) => {
  try {
    const { title, summary } = req.body;
    const record = new Feed({
      title,
      summary
    });
    await record.save();
    res.status(201).json({ message: "Feed added successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error creating the feed" });
  }
};

const getFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find();
    // console.log("feeds retrieved:", feeds); 
    res.status(200).json(feeds); 
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error retrieving project feeds" });
  }
};

const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (project) {
      return res.status(200).json(project);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Erorr while getting project details",
      error,
    });
  }
};


const getProjectsByUserId = async (req, res) => {
  console.log("req projects")
  try {
    const userId = req.params.userId
    const projects = await Project.find({ userId: userId });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const checkSpam = async (email) => {
  try {
    // Escape the email content and wrap it in a valid JSON format
    const emailContent = JSON.stringify({
      api_key: "VdEktNCRivfU5T9U05VLYl79TApGjl4jtXs3a2LK",
      content: email,
    });

    const response = await axios.post(
      "https://api.oopspam.com/v1/spamdetection",
      emailContent, // Use the escaped JSON string as the request body
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "VdEktNCRivfU5T9U05VLYl79TApGjl4jtXs3a2LK",
        },
      }
    );

    const data2 = response.data;
    console.log(data2);
    return data2;
  } catch (error) {
    console.error("Error making API request:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while making the API request." });
  }
};
const commentEntry = async (req, res) => {
  try {
    const {comment}  = req.body;
    const userId = req.params.userId;
    const spamStatus=await checkSpam(comment);
    // console.log(spamStatus)
    let isSpam='true'
    if(spamStatus.Details.isContentSpam === "nospam"){
      isSpam="false"
    }
    let status="Pending";
    if(isSpam === "true"){
      status = "rejected"
    }
    const record = new Comment({
      comment,
      userId,
      isSpam,
      status
    });
    await record.save();
    res.status(201).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error sending the request" });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    console.log(comments);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error retrieving comments" });
  }
};


module.exports = { addListing, getAllListings,latestListing,projectPhotoController ,projectsByDomain,createFeed,getFeeds,getSingleProject,getProjectsByUserId,commentEntry};
