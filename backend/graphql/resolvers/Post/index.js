import Post from "../../../models/Post";

export default {
    Query: {
        posts: (root, args) => {
            return new Promise((resolve, reject) => {
                Post.find({})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        }
    },
    Mutation: {
        async createPost(root, {
            input
        }) {
            return Post.create(input);
        }
    }
}