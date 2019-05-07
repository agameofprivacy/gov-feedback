const Report = require("../../../models/Report");
const User = require("../../../models/User");
const Post = require("../../../models/Post");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
    Query: {
        reportsByUserWith: (root, args) => {
            return Promise((resolve, reject) => {
                Report.find({"author": args.ID})
                .populate({ path: "referencedPost", model: Post })
                .sort({'created': -1})
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                })
            })
        },
        reportsWith: (root, args) => {
            return Promise((resolve, reject) => {
                Report.find({"status": args.status})
                .populate({ path: "referencedPost", model: Post})
                .sort({'created': -1})
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                })
            })
        }
    },
    Mutation: {
        async createReport(root, {
            input
        }) {
            return new Promise((resolve, reject) => {
                Report.create(input).then((result) => {
                    console.log("report result: ", result);
                    resolve(result);
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                })
            })
        }
    }
}