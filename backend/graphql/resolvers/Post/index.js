const Post = require("../../../models/Post");
const Reply = require("../../../models/Reply");
const PublicProfile = require("../../../models/PublicProfile");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        posts: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({})
                .populate({ path: 'authorProfile', model: PublicProfile })
                .populate({ path: 'replies', model: Reply })
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        postsForOrgId: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({organization_id: args.orgId})
                .populate({ path: 'authorProfile', model: PublicProfile })
                .populate({ path: 'replies', model: Reply })
                .sort({'created': -1})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        postsForTopic: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({topic: args.topic})
                .populate({ path: 'authorProfile', model: PublicProfile })
                .populate({ path: 'replies', model: Reply })
                .sort({'created': -1})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        postsByUser: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({author: args.user})
                .populate({ path: 'authorProfile', model: PublicProfile })
                .populate({ path: 'replies', model: Reply })
                .sort({'created': -1})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                })
            })
        }
    },
    Mutation: {
        async likePost(root, {
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
        async createPost(root, {
            input
        }) {
            return new Promise((resolve, reject) => {
                // check post author type
                // if *use identity* find public profile object reference and add to post input before saving
                switch(input.author_type) {
                    case "custom":
                    case "account":
                        // 
                        PublicProfile.findOne({user: input.user_id})
                        .exec((err, res) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("res.data", res._id);
                                input.authorProfile = res._id;
                                Post.create(input).then(result => {
                                    resolve(result);
                                })
                            }
                        })
                        break;
                    default:
                        // anonymous and others
                        Post.create(input).then(result => {
                            resolve(result);
                        });
                }
            })
        }
    }
}