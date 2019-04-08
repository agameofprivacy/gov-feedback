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
  likedBy: [
    {
      name: {
        type: String,
        required: true
      }
    }
  ],
  is_forward_of_post_id: {
    type: String,
    required: false
  },
  is_forward_of_post_with_tag: {
    type: String,
    required: false
  },
  is_reply_to_post_id: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Post", PostSchema);