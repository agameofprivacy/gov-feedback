const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Organization schema.
const OrganizationSchema = new Schema({
  name: {
      type: String,
      required: true,
      text: true,
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
  ],
  level: {
    type: Number,
    required: true,
  },
  hierarchy: {
    type: String,
    required: true,
  },
  popularityWeek: {
    type: Number,
    required: false,
  },
  popularityAll: {
    type: Number,
    required: false,
  },
  topicsWeek: [{
    name: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    }
  }],
  topicsAll: [{
    name: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true
    }
  }],
});

module.exports = mongoose.model("Organization", OrganizationSchema);