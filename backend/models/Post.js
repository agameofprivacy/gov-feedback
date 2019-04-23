const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Organization schema.
const PostSchema = new Schema({
  authorProfile: {
    type: Schema.Types.ObjectId,
    ref: "PublicProfile",
    required: false,
    unique: false
  },
  author_type: {
    type: String,
    required: true,
  },
  author: {
      type: String,
      required: true,
  },
  topic: {
    type: String,
    required: false,
  },
  organization: {
    type: String,
    required: true
  },
  organization_id: {
    type: String,
    required: true
  },
  created: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply",
        required: true
      }
  ],
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
  isForwardedPostOf: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: false,
  }
});

module.exports = mongoose.model("Post", PostSchema);