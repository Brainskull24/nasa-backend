const mongoose = require("mongoose"); 
const commentSchema = new mongoose.Schema ({
  comment:{
    type:String,
    required:true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  status: {
    type:String,
    default:"Pending"
  },
  isSpam:{
    type:Boolean,
  }
});

module.exports = mongoose.model("Comment", commentSchema);
