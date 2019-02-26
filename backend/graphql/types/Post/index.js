
export default `
    type Post {
        content: String!,
        author: String!,
        topic: String!,
        organization: String!,
        organization_id: String!,
        created: Float!,
    }
    type Query {
        posts: [Post]!,
        postsForOrgId(orgId: String): [Post]!,
    }
    input PostInput {
        author: String!,
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