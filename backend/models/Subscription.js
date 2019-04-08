const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Subscription schema.
const SubscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  organizations: [
    {
      organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true
      },
      frequency: {
          type: String,
          required: true
      }
    }
  ],
  topics: [
      {
        topic: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            required: true
        },
        frequency: {
            type: String,
            required: true
        }
      }
  ]
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);