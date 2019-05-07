module.exports = `
    type Report {
        author: String!,
        referencedPost: String!,
        reason: String!,
        status: String!,
        created: Float!
    }

    type Query {
        reportsByUserWith(ID: String): [Report],
        reportsWith(status: String): [Report]
    }

    input ReportInput {
        author: String!,
        referencedPost: String!,
        reason: String!,
        status: String!,
        created: Float!
    }

    type Mutation {
        createReport(input: ReportInput) : Report
    }


`