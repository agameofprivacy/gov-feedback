const mergeResolvers = require("merge-graphql-schemas").mergeResolvers;

const Organization = require("./Organization/");
const Post = require("./Post/");
const Topic = require("./Topic/");
const Profile = require("./Profile/");
const PublicProfile = require("./PublicProfile/");
const Subscription = require("./Subscription/");
const Reply = require("./Reply/");
const Report = require("./Report/");

const resolvers = [
    Organization, 
    Post, 
    Topic, 
    Profile, 
    PublicProfile,
    Subscription,
    Reply,
    Report
];

module.exports = mergeResolvers(resolvers);