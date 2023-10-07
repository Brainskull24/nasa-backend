const Project = require("../models/Project.js");

const addListing = async (req, res) => {
  try {
    const { title, description, objectives, domain, skills, expertise } =
      req.body;
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
      photos: [{ data: photo.buffer, contentType: photo.mimetype }]
    });
    await record.save();
    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Error creating the record" });
  }
};

module.exports = { addListing };
