export default `
    type Organization {
        name: String!,
        parent: Organization,
        contact_details: [ContactDetail]!,
        identifiers: [Identifier]!,
        level: Int,
        hierarchy: String,
        _id: String,
    }

    type Query {
        organizations(name: String): [Organization]!,
        randomOrganizations(count: Int): [Organization]!,
        organizationWithId(orgId: String): Organization,
        organizationsWithParentId(parentId: String): [Organization]!
    }
`;