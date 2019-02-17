export default `
    type Organization {
        name: String!,
        parent: Organization,
        contact_details: [ContactDetail]!,
        identifiers: [Identifier]!,
    }

    type Query {
        organizations(name: String): [Organization]!,
        randomOrganizations(count: Int): [Organization]!
    }
`;