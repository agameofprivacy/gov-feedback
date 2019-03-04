import Topic from "../../../models/Topic";

export default {
    Query: {
        topics: (root, args) => {
            return new Promise((resolve, reject) => {
                Topic.find({name: new RegExp(args.name, "gi")})
                .sort({'name': 1, 'popularityWeek': -1})
                .limit(10)
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
                    console.log(err);
                    console.log(res);
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