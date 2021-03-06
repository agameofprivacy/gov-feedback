
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
        isForwardedPostOf: Post
    }
    type Query {
        posts: [Post]!,
        postsForOrgId(orgId: String, date: Float): [Post]!,
        postsForTopic(topic: String, date: Float): [Post]!,
        postsByUser(user: String, date: Float): [Post]!,
        fetchPostWith(post_id: String): Post,
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
        isForwardedPostOf: String,
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