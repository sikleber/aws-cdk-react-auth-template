# Notes App

GraphQL Schema:
```graphql
type Note {
    id: ID!
    title: String!
    content: String!
}

type Query {
    getNote(id: ID!): Note
    getNotes: [Note!]
}

type Mutation {
    createNote(title: String!): Note
    updateNote(id: ID!, title: String, content: String): Note
    deleteNote(id: ID!): ID
}

schema {
    query: Query
    mutation: Mutation
}
```

## Using S3 for storage link: https://snell.im/posts/2020/s3-appsync-resolver.html