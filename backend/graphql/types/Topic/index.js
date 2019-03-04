export default `
    type Topic {
        name: String!,
        popularityWeek: Float,
        popularityAll: Float,
    }

    type Query {
        topics(name: String): [Topic]!,
        getTopicWithName(name: String): Topic,
    }

    input TopicInput {
        name: String!
    }

    type Mutation {
        createTopic(input: TopicInput) : Topic
    }
`;