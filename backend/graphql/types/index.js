import { mergeTypes } from "merge-graphql-schemas";

import Organization from "./Organization/";
import ContactDetail from "./ContactDetail/";
import Identifier from "./Identifier/";

const typeDefs = [Organization, ContactDetail, Identifier];

export default mergeTypes(typeDefs, { all: true });