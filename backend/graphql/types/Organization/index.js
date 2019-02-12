export default `
    type Organization {
        name: String!,
        parent: Organization,
        contact_details: [ContactDetail]!,
    }

    type Query {
        organizations(name: String): [Organization]!
    }
`;