import Organization from "../../../models/Organization";

export default {
    Query: {
        organizations: () => {
            return new Promise((resolve, reject) => {
                Organization.find({})
                .populate("parent")
                .sort({'name': 1})
                .limit(100)
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        }    
    }
}