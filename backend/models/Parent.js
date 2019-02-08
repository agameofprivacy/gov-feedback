import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
}

// Create parent schema.
const ParentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    identifier: {
        type: Schema.Types.ObjectId,
        ref: "Identifier",
        required: false
    },
})

const Parent = mongoose.model("Parent", ParentSchema);

export default Parent;