const Topic = require("../../../models/Topic");

module.exports = {
    Query: {
        topics: (root, args) => {
            return new Promise((resolve, reject) => {
                Topic.find({name: new RegExp(args.name, "gi")})
                .sort({'name': 1, 'popularityWeek': -1})
                .limit(8)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        topicWithName: (root, args) => {
            return new Promise((resolve, reject) => {
                Topic.findOne({
                    "name": args.name
                })
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
    },
    Mutation: {
        async createTopic(root, {
            input
        }) {
            return Topic.create(input);
        }
    }
}