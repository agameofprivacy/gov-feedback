const Subscription = require("../../../models/Subscription");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        subscriptionForUser: (root, args) => {
            return new Promise((resolve, reject) => {
                console.log("args.user: ", args.user);
                Subscription.findOne({
                    "user": new ObjectId(args.user)
                })
                .populate("topics.topic")
                .populate("organizations.organization")
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            })
        }
    },
    Mutation: {
        async updateSubscription(root, {
            input
        }) {
            return new Promise((resolve, reject) => {
                var query = {"user": new ObjectId(input.user)};
                var options = { upsert: true, new: true, setDefaultsOnInsert: true };
                var update;
                switch(input.subscription_type) {
                    case "organization":
                        update = {
                            $pull: {'organizations': {
                                organization: new ObjectId(input.subscription_target),
                            }}
                        };
                        break;
                    case "topic":
                        update = {
                            $pull: {'topics': {
                                topic: new ObjectId(input.subscription_target),
                            }}
                        };
                        break;
                    default:
                        break;
                }
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
                            // check post author type
                            // if *use identity* find public profile object reference and add to post input before saving
                            var query = {"user": new ObjectId(input.user)};
                            var update = {};
                            var options = { upsert: true, new: true, setDefaultsOnInsert: true };
                            console.log("update subs");
                            switch(input.subscription_type) {
                                case "organization":
                                    if (input.action === "subscribe") {
                                        update = {
                                            $setOnInsert: {
                                                "user": new ObjectId(input.user),
                                            },
                                            $addToSet: {organizations: {
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
                                            $addToSet: {'topics': {
                                                topic: new ObjectId(input.subscription_target),
                                                frequency: input.subscription_frequency
                                            }}
                                        }
                                    }
                                default:
                                    // unknown subscription type
                                    console.log("unknown subscription type")
                                    break;
                            }
                            console.log("query: ", query);
                            console.log("update: ", update);
                            console.log("options: ", options);
                            Subscription.findOneAndUpdate(
                            query, 
                            update, 
                            options, 
                            function(lastError, lastResult) {
                                if (lastError) {
                                    console.log("lastError", lastError);
                                    reject(lastError);
                                } else {
                                    console.log("result: ", lastResult);
                                    resolve(lastResult);
                                }
                            });
                        }
                    }
                );
            });
        }
    }
}