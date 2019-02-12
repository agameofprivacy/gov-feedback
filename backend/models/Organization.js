import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Organization schema.
const OrganizationSchema = new Schema({
  name: {
      type: String,
      required: true,
  },
  other_names: [
    {
      label: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: true,
      }
    }
  ],
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
  parent: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: false
  },
  contact_details: [
    {
      kind: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: false,
      }
    }
  ]
});

module.exports = mongoose.model("Organization", OrganizationSchema);