import { mergeTypes } from "merge-graphql-schemas";

import Organization from "./Organization/";
import ContactDetail from "./ContactDetail/";
import Identifier from "./Identifier/";
import Post from "./Post/";
import Topic from "./Topic/";

const typeDefs = [Organization, ContactDetail, Identifier, Post, Topic];

export default mergeTypes(typeDefs, { all: true });