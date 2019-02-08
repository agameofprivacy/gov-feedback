import Organization from "../../../models/Organization";

export default {
    Query: {
        organizations: () => {
            return new Promise((resolve, reject) => {
                Organization.find({})
                .populate()
                .exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        }    
    }
}