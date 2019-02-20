import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Organization schema.
const PostSchema = new Schema({
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
  created: {
    type: Date,
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
  originalPost: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Post", PostSchema);