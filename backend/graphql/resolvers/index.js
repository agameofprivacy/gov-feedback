const mergeResolvers = require("merge-graphql-schemas").mergeResolvers;

const Organization = require("./Organization/");
const Post = require("./Post/");
const Topic = require("./Topic/");
const Profile = require("./Profile/");
const PublicProfile = require("./PublicProfile");
const Subscription = require("./Subscription");

const resolvers = [
    Organization, 
    Post, 
    Topic, 
    Profile, 
    PublicProfile,
    Subscription
];

module.exports = mergeResolvers(resolvers);