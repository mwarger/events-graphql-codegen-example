import gql from 'graphql-tag'

export default gql`
  query GetEvents {
    listEvents(limit: 1000) {
      items {
        id
        name
        where
        when
        description
        comments {
          items {
            commentId
          }
        }
      }
    }
  }
`
