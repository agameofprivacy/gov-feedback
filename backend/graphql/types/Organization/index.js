export default `
    type Organization {
        name: String!
    }

    type Query {
        organizations: [Organization!]!
    }
`;