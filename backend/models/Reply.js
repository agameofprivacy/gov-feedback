const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Organization schema.
const ReplySchema = new Schema({
  authorProfile: {
    type: Schema.Types.ObjectId,
    ref: "PublicProfile",
    required: false,
    unique: false
  },
  author: {
      type: String,
      required: true,
  },
  created: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: [
    {
      _id: false,
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    }
  ],
  toPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      unique: false
  }
});

module.exports = mongoose.model("Reply", ReplySchema);