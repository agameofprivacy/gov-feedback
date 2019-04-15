const mergeResolvers = require("merge-graphql-schemas").mergeResolvers;

const Organization = require("./Organization/");
const Post = require("./Post/");
const Topic = require("./Topic/");
const Profile = require("./Profile/");
const PublicProfile = require("./PublicProfile");
const Subscription = require("./Subscription");
const Reply = require("./Reply/");

const resolvers = [
    Organization, 
    Post, 
    Topic, 
    Profile, 
    PublicProfile,
    Subscription,
    Reply
];

module.exports = mergeResolvers(resolvers);