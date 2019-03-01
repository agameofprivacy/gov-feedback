import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Topic schema.
const TopicSchema = new Schema({
  name: {
      type: String,
      required: true,
      text: true,
      unique: true,
  },
  popularityWeek: {
    type: Number,
    required: false,
  },
  popularityAll: {
    type: Number,
    required: false,
  },
  orgsWeek: [{
    name: {
        type: String,
        required: true,
    },
    identifiers: [
        {
            scheme: {
            type: String,
            required: true,
            },
            identifier: {
            type: String,
            required: true,
            }
        }
    ],
  }],
  orgsAll: [{
    name: {
        type: String,
        required: true,
    },
    identifiers: [
        {
          scheme: {
            type: String,
            required: true,
          },
          identifier: {
            type: String,
            required: true,
          }
        }
    ],    
  }],
});

module.exports = mongoose.model("Topic", TopicSchema);