const mongoose = require("mongoose"); 

const productSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: true 
  }, 
  description: {
    type: String, 
  }, 
  expertise: {
    type: [{ type: String }],
    required: true
  },
  objectives: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true
  },
  photos: [
    {
      data: Buffer,
      contentType: String,
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
