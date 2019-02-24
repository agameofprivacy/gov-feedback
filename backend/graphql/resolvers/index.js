import { mergeResolvers } from "merge-graphql-schemas";

import Organization from "./Organization/";
import Post from "./Post/";

const resolvers = [Organization, Post];

export default mergeResolvers(resolvers);