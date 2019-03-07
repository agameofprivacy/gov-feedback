const mergeResolvers = require("merge-graphql-schemas").mergeResolvers;

const Organization = require("./Organization/");
const Post = require("./Post/");
const Topic = require("./Topic/");

const resolvers = [Organization, Post, Topic];

module.exports = mergeResolvers(resolvers);