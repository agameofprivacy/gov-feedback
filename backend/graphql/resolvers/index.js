const mergeResolvers = require("merge-graphql-schemas").mergeResolvers;

const Organization = require("./Organization/");
const Post = require("./Post/");
const Topic = require("./Topic/");
const Profile = require("./Profile/");

const resolvers = [Organization, Post, Topic, Profile];

module.exports = mergeResolvers(resolvers);