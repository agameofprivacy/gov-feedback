const Organization = require("../../../models/Organization");

module.exports = {
    Query: {
        organizations: (root, args) => {
            return new Promise((resolve, reject) => {
                Organization.find({name: new RegExp(args.name, "gi")})
                .populate("parent")
                .sort({'level': 1, 'name': 1})
                .limit(8)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        organizationWithId: (root, args) => {
            console.log("orgId:", args.orgId);
            return new Promise((resolve, reject) => {
                Organization.findOne({
                    "_id": args.orgId
                })
                .populate("parent")
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        organizationsWithParentId: (root, args) => {
            return new Promise((resolve, reject) => {
                Organization.find({
                    "parent": args.parentId
                })
                .populate("parent")
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        randomOrganizations: (root, args) => {
            return new Promise((resolve, reject) => {
                Organization.aggregate([ 
                    {
                        $match: {
                            name: { 
                                $regex: /^((?!所|會|處|課|室|隊|市場).)*$/
                            },
                            level: {
                                $lt: 2
                            },
                            parent: {
                                $exists: true
                            },
                            $and: [
                                {
                                    level: {
                                        $eq: 0
                                    }
                                },
                                {
                                    parent: {
                                        $exists: false,
                                    }
                                }
                            ],
                            $and: [
                                {
                                    level: {
                                        $gt: 0
                                    }
                                },
                                {
                                    level: {
                                        $lt: 2
                                    }
                                },
                                {
                                    parent: {
                                        $exists: true
                                    }
                                }
                            ]
                        },
                    },
                    {$sample: { size: args.count }}
            ])
                .exec((err, res) => {
                    err ? reject (err) : resolve(res);
                })
            })
        }
    }
}