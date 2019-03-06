import { mergeResolvers } from "merge-graphql-schemas";

import Organization from "./Organization/";
import Post from "./Post/";
import Topic from "./Topic/";

const resolvers = [Organization, Post, Topic];

export default mergeResolvers(resolvers);