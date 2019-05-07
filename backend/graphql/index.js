const makeExecutableSchema = require("graphql-tools").makeExecutableSchema;
const typeDefs = require("./types/");
const resolvers = require("./resolvers/");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;