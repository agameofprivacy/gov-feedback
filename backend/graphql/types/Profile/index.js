module.exports = `
    type Profile {
        user: String,
        birthday: String,
        gender: String,
        residence: String,
        email: String
    }

    type Query {
        profileForUserWith(ID: String): Profile,
    }

    input ProfileInput {
        user: String!,
        birthday: String,
        gender: String,
        residence: String,
        email: String
    }

    type Mutation {
        updateProfile(input: ProfileInput) : Profile
    }
`;