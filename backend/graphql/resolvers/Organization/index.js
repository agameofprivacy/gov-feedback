import Organization from "../../../models/Organization";

export default {
    Query: {
        organizations: (root, args) => {
            return new Promise((resolve, reject) => {
                console.log(args);
                Organization.find({name: new RegExp(args.name, "gi")})
                .populate("parent")
                .sort({'name': 1})
                .limit(10)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        }    
    }
}