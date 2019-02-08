import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
    return this.toString();
};

// Create contact detail schema.
const ContactDetailSchema = new Schema({
    kind: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: false
    }
})

const ContactDetail = mongoose.model("ContactDetail", ContactDetailSchema);

export default ContactDetail;