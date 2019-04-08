
module.exports = `
type Subscription {
    _id: String!,
    user: String!,
    organizations: [OrgSubscription]!
    topics: [TopicSubscription]!
}
type Query {
    subscriptionsForUser(user: String): [Subscription]!,
}
input SubscriptionInput {
    user: String!,
    action: String!,
    subscription_type: String!,
    subscription_target: String!,
    subscription_frequency: String!,
}
type Mutation {
    updateSubscription(input: SubscriptionInput) : Subscription
}
`;