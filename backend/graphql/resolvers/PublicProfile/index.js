const PublicProfile = require("../../../models/PublicProfile");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        publicProfileForUserWith: (root, args) => {
            return new Promise((resolve, reject) => {
                PublicProfile.findOne({
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
        async updatePublicProfile(root, {
            input
        }) {
            var query = {"user": new ObjectId(input.user)};
            var update = input;
            var options = { upsert: true, new: true, setDefaultsOnInsert: true };
        
            return PublicProfile.findOneAndUpdate(query, update, options, function(error, result) {
                if (error) return;
                console.log(result);
            });
        }
    }
}