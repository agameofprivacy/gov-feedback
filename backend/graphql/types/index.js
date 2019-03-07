const mergeTypes = require("merge-graphql-schemas").mergeTypes;

const Organization = require("./Organization/");
const ContactDetail = require("./ContactDetail/");
const Identifier = require("./Identifier/");
const Post = require("./Post/");
const Topic = require("./Topic/");
const OrgTopic = require("./OrgTopic/");
const TopicOrg = require("./TopicOrg/");

const typeDefs = [Organization, ContactDetail, Identifier, Post, Topic, OrgTopic, TopicOrg];

module.exports = mergeTypes(typeDefs, { all: true });