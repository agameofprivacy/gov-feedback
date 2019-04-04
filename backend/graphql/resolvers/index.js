const mergeResolvers = require("merge-graphql-schemas").mergeResolvers;

const Organization = require("./Organization/");
const Post = require("./Post/");
const Topic = require("./Topic/");
const Profile = require("./Profile/");
const PublicProfile = require("./PublicProfile");

const resolvers = [Organization, Post, Topic, Profile, PublicProfile];

module.exports = mergeResolvers(resolvers);