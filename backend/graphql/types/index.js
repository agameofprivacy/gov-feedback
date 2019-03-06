import { mergeTypes } from "merge-graphql-schemas";

import Organization from "./Organization/";
import ContactDetail from "./ContactDetail/";
import Identifier from "./Identifier/";
import Post from "./Post/";
import Topic from "./Topic/";
import OrgTopic from "./OrgTopic/";
import TopicOrg from "./TopicOrg/";

const typeDefs = [Organization, ContactDetail, Identifier, Post, Topic, OrgTopic, TopicOrg];

export default mergeTypes(typeDefs, { all: true });