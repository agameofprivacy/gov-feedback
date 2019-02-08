import { mergeResolvers } from "merge-graphql-schemas";

import Organization from "./Organization/";

const resolvers = [Organization];

export default mergeResolvers(resolvers);