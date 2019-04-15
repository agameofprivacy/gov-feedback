
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
        replies: [Reply],
        likes: [Like],
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
    input LikePostInput {
        user_id: String!
        action: String!
        post_id: String!
    }
    type Mutation {
        createPost(input: PostInput) : Post,
        likePost(input: LikePostInput) : Post,
    }
`;