const Project = require("../models/Project.js");
const User = require("../models/userModel.js");

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
    console.log("Projects retrieved:", projects); 
    res.status(200).json(projects); 
  } catch (err) {
    console.error("Error:", err); 
    res.status(500).json({ message: "Error fetching records" });
  }
};



module.exports = { addListing, getAllListings,latestListing };
