const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Topic schema.
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    birthday: {
        type: String,
        required: false,
        unique: false
},
    gender: {
        type: String,
        required: false,
        unique: false
    },
    residence: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    }
});

module.exports = mongoose.model("Profile", ProfileSchema);