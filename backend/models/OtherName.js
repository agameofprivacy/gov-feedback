import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create OtherName schema.
const OtherNameSchema = new Schema({
    label: {
        type: String,
        required: false,        
    },
    name: {
        type: String,
        required: true,
    }
})

const OtherName = mongoose.model("OtherName", OtherNameSchema);

export default OtherName;