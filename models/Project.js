const mongoose = require("mongoose"); 

const productSchema = new mongoose.Schema ({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photos: [
    {
      data: Buffer,
      contentType: String,
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
