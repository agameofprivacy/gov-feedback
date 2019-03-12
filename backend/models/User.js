const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function(){
    return this.toString();
};

// Create the Topic schema.
const UserSchema = new Schema({
    local: {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: false,
          unique: true,
        },
        secondaryEmail: {
            type: String,
            require: false,
            unique: true,
        }
    }
});

// methods

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model("User", UserSchema);