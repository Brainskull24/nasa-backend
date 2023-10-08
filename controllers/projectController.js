const Project = require("../models/Project.js");
const User = require("../models/userModel.js");
const Feed = require("../models/FeedModel.js")
const addListing = async (req, res) => {
  try {
    const { title, description, objectives, domain, skills, expertise, userId } = req.body;
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
      userId,
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
    console.log("feeds retrieved:", feeds); 
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

module.exports = { addListing, getAllListings,latestListing,projectPhotoController ,projectsByDomain,createFeed,getFeeds,getSingleProject};
