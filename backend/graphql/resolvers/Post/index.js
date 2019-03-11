const Post = require("../../../models/Post");

module.exports = {
    Query: {
        posts: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        postsForOrgId: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({organization_id: args.orgId})
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
                .sort({'created': -1})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
    },
    Mutation: {
        async createPost(root, {
            input
        }) {
            return Post.create(input);
        }
    }
}