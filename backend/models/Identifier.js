import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
    return this.toString();
};

// Create the Identifier schema.
const IdentifierSchema = new Schema({
    scheme: {
        type: String,
        required: true
    },
    identifier: {
        type: String,
        required: true
    }
})

const Identifier = mongoose.model("Identifier", IdentifierSchema);

export default Identifier;