import { mergeTypes } from "merge-graphql-schemas";

import Organization from "./Organization/";
import ContactDetail from "./ContactDetail/";

const typeDefs = [Organization, ContactDetail];

export default mergeTypes(typeDefs, { all: true });