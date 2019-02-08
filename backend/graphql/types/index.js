import { mergeTypes } from "merge-graphql-schemas";

import Organization from "./Organization/";

const typeDefs = [Organization];

export default mergeTypes(typeDefs, { all: true });