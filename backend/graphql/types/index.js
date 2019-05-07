const mergeTypes = require("merge-graphql-schemas").mergeTypes;

const Organization = require("./Organization/");
const ContactDetail = require("./ContactDetail/");
const Identifier = require("./Identifier/");
const Post = require("./Post/");
const Topic = require("./Topic/");
const OrgTopic = require("./OrgTopic/");
const TopicOrg = require("./TopicOrg/");
const Profile = require("./Profile");
const PublicProfile = require("./PublicProfile");
const Subscription = require("./Subscription");
const OrgSubscription = require("./OrgSubscription");
const TopicSubscription = require("./TopicSubscription");
const Like = require("./Like");
const Reply = require("./Reply");
const Report = require("./Report");

const typeDefs = [
    Organization, 
    ContactDetail, 
    Identifier, 
    Post, 
    Topic, 
    OrgTopic, 
    TopicOrg, 
    Profile, 
    PublicProfile, 
    Subscription,
    OrgSubscription,
    TopicSubscription,
    Like,
    Reply,
    Report
];

module.exports = mergeTypes(typeDefs, { all: true });