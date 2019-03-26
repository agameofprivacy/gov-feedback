const Profile = require("../../../models/Profile");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        profileForUserWith: (root, args) => {
            return new Promise((resolve, reject) => {
                Profile.findOne({
                    "user": new ObjectId(args.ID)
                })
                .populate("user")
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
    },
    Mutation: {
        async createProfile(root, {
            input
        }) {
            return Profile.create(input);
        }
    }
}