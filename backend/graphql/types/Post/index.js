
module.exports = `
    type Post {
        _id: String!,
        content: String!,
        authorProfile: PublicProfile,
        author: String!,
        topic: String!,
        organization: String!,
        organization_id: String!,
        created: Float!,
    }
    type Query {
        posts: [Post]!,
        postsForOrgId(orgId: String): [Post]!,
        postsForTopic(topic: String): [Post]!,
        postsByUser(user: String): [Post]!,
    }
    input PostInput {
        user_id: String!,
        authorProfile: String,
        author: String!,
        author_type: String!,
        topic: String!,
        organization: String!,
        organization_id: String!,
        created: Float!,
        content: String!
    }
    type Mutation {
        createPost(input: PostInput) : Post
    }
`;