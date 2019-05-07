const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Topic schema.
const PublicProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    avatarUrl: {
        type: String,
        required: false,
        unique: false
    }
});

module.exports = mongoose.model("PublicProfile", PublicProfileSchema);