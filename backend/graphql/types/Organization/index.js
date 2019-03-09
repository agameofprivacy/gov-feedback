module.exports = `
    type Organization {
        name: String!,
        parent: Organization,
        contact_details: [ContactDetail]!,
        identifiers: [Identifier]!,
        level: Int,
        hierarchy: String,
        topicsAll: [OrgTopic],
        topicsWeek: [OrgTopic],
        _id: String!,
    }

    type Query {
        organizations(name: String): [Organization]!,
        randomOrganizations(count: Int): [Organization]!,
        organizationWithId(orgId: String): Organization,
        organizationsWithParentId(parentId: String): [Organization]!
    }
`;