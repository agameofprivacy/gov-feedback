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
        async updateProfile(root, {
            input
        }) {
            var query = {"user": new ObjectId(input.user)};
            var update = input;
            var options = { upsert: true, new: true, setDefaultsOnInsert: true };
        
            return Profile.findOneAndUpdate(query, update, options, function(error, result) {
                if (error) return;
                console.log(result);
            });
        }
    }
}