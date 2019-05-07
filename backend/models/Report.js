const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toHexString();
}

const ReportSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    referencedPost:{
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    created: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Report", ReportSchema)