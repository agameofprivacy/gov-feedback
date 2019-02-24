import { mergeTypes } from "merge-graphql-schemas";

import Organization from "./Organization/";
import ContactDetail from "./ContactDetail/";
import Identifier from "./Identifier/";
import Post from "./Post/";

const typeDefs = [Organization, ContactDetail, Identifier, Post];

export default mergeTypes(typeDefs, { all: true });