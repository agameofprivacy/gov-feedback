const Subscription = require("../../../models/Subscription");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        subscriptionsForUser: (root, args) => {
            return new Promise((resolve, reject) => {
                Subscription.find({user: args.user})
                .sort({'created': -1})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                })
            })
        }
    },
    Mutation: {
        async updateSubscription(root, {
            input
        }) {
            // check post author type
            // if *use identity* find public profile object reference and add to post input before saving
            var query = {"user": new ObjectId(input.user)};
            var update;
            var options = { upsert: true, new: true, setDefaultsOnInsert: true };
            console.log("update subs");
            switch(input.subscription_type) {
                case "organization":
                    if (input.action === "subscribe") {
                        update = {
                            $setOnInsert: {
                                "user": new ObjectId(input.user),
                            },
                            $push: {'organizations': {
                                organization: new ObjectId(input.subscription_target),
                                frequency: input.subscription_frequency
                            }}
                        }
                    } else {
                        update = {
                            $setOnInsert: {
                                "user": new ObjectId(input.user),
                            },
                            $pull: {'organizations': {
                                organization: new ObjectId(input.subscription_target),
                                frequency: input.subscription_frequency
                            }}
                        }
                    }
                    break;
                case "topic":
                    if (input.action === "subscribe") {
                        update = {
                            $setOnInsert: {
                                "user": new ObjectId(input.user),
                            },
                            $push: {'topics': {
                                topic: new ObjectId(input.subscription_target),
                                frequency: input.subscription_frequency
                            }}
                        }
                    } else {
                        update = {
                            $setOnInsert: {
                                "user": new ObjectId(input.user),
                            },
                            $pull: {'topics': {
                                topic: new ObjectId(input.subscription_target),
                                frequency: input.subscription_frequency
                            }}
                        }
                    }
                    break;
                default:
                    // unknown subscription type
                    console.log("unknown subscription type")
                    break;
            }

            return new Promise((resolve, reject) => {
                console.log("query: ", query);
                console.log("update: ", update);
                console.log("options: ", options);
                Subscription.findOneAndUpdate(
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
                });
            })
        }
    }
}