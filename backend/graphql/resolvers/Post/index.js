const Post = require("../../../models/Post");
const PublicProfile = require("../../../models/PublicProfile");

module.exports = {
    Query: {
        posts: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({})
                .populate({ path: 'authorProfile', model: PublicProfile })
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
                .sort({'created': -1})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                })
            })
        }
    },
    Mutation: {
        async createPost(root, {
            input
        }) {
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
                            return Post.create(input);
                        }
                    })
                    break;
                default:
                    // anonymous and others
                    return Post.create(input);
            }
        }
    }
}