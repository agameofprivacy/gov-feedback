export default `
    type Topic {
        name: String!,
        popularityWeek: Float,
        popularityAll: Float,
        orgsAll: [TopicOrg],
        orgsWeek: [TopicOrg],
    }

    type Query {
        topics(name: String): [Topic]!,
        topicWithName(name: String): Topic,
    }

    input TopicInput {
        name: String!
    }

    type Mutation {
        createTopic(input: TopicInput) : Topic
    }
`;