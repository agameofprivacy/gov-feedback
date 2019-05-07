module.exports = `
    type PublicProfile {
        user: String,
        avatarUrl: String,
    }

    type Query {
        publicProfileForUserWith(ID: String): PublicProfile,
    }

    input PublicProfileInput {
        user: String!,
        avatarUrl: String,
    }

    type Mutation {
        updatePublicProfile(input: PublicProfileInput) : PublicProfile
    }
`;