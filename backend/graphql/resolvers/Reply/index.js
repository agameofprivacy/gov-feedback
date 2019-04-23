const Reply = require("../../../models/Reply");
const PublicProfile = require("../../../models/PublicProfile");
const Post = require("../../../models/Post");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        repliesForUserWith: (root, args) => {
            return new Promise((resolve, reject) => {
                Reply.find({"authorProfile.user": args.ID})
                .populate({ path: 'authorProfile', model: PublicProfile })
                .limit(20)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
    },
    Mutation: {
        async likeReply(root, {
            input
        }) {
            return new Promise((resolve, reject) => {
                var query = {"_id": new ObjectId(input.post_id)};
                var options = { upsert: true, new: true, setDefaultsOnInsert: true };
                var update;
                switch(input.action) {
                    case "like":
                        update = {
                            $addToSet: {'likes': {
                                user: new ObjectId(input.user_id)                            }}
                        };
                        break;
                    case "unlike":
                        update = {
                            $pull: {'likes': {
                                user: new ObjectId(input.user_id),
                            }}
                        };
                        break;
                    default:
                        break;
                }
                Post.findOneAndUpdate(
                    query,
                    update,
                    options,
                    function(error, result) {
                        if (error) {
                            console.log("error", error);
                            reject(error);
                        } else {
                            console.log("result: ", result);
                            resolve(result);
                        }
                    }
                )
            })
        },
        async createReply(root, {
            input
        }) {
            return new Promise((resolve, reject) => {
                console.log(input);
                console.log(input.authorProfile);
                PublicProfile.findOne({user: input.authorProfile})
                .exec((err, res) => {
                    if (err) {
                        console.log(err)
                        reject(err);
                    } else {
                        console.log("res.data", res._id);
                        input.authorProfile = res._id;
                        Post.findById(input.toPost).then((result) => {
                            console.log("post found: ", result);
                            if (result.replies.length >= 10) {
                                // no more replies allowed
                                reject("max_replies");
                            } else {
                                // create and add reply
                                Reply.create(input).then(result => {
                                    // update post replies with id of newly created reply
                                    var query = {"_id": new ObjectId(input.toPost)};
                                    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
                                    var update = {
                                        $addToSet: {'replies': new ObjectId(result._id)}
                                    };
                                    Post.findOneAndUpdate(
                                        query,
                                        update,
                                        options,
                                        function(error, postResult) {
                                            if (error) {
                                                console.log("error", error);
                                                reject(error);
                                            } else {
                                                console.log("postResult: ", postResult);
                                                resolve(postResult);
                                            }
                                        }
                                    )
                                })    
                            }
                        })
                    }
                })
            })
        }
    }
}