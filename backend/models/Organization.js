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
      unique: true,
  },
  other_names: [
    {
        type: Schema.Types.ObjectId,
        ref: "OtherName",
        required: false
    }
  ],
  identifiers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Identifier",
      required: true
    }
  ],
  parent: {
      type: Schema.Types.ObjectId,
      ref: "Parent",
      required: false
  },
  contact_details: [
    {
      type: Schema.Types.ObjectId,
      ref: "ContactDetail",
      required: false,
    }
  ]
});

const Organization = mongoose.model("Organization", OrganizationSchema);

export default Organization;