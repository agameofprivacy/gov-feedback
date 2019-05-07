module.exports = `
    type Reply {
        authorProfile: PublicProfile,
        author: String,
        created: Float!,
        content: String,
        toPost: Post,
        likes: [Like],
        _id: String,
    }

    input ReplyInput {
        authorProfile: String,
        author: String,
        created: Float!,
        content: String!,
        toPost: String,
    }

    input LikeReplyInput {
        user_id: String!
        action: String!
        reply_id: String!
    }

    type Query {
        repliesForUserWith(ID: String): [Reply],
    }

    type Mutation {
        createReply(input: ReplyInput) : Reply,
        likeReply(input: LikeReplyInput) : Reply,
    }
`;