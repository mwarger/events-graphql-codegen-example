// @flow
import * as React from 'react'
import { Query } from 'react-apollo'

type TypedQueryProps<D, V> = {
  query: any,
  variables?: V,
  children: (data: D) => React.Node,
  fetchPolicy?: string
}

export default class TypedQuery<
  D: ?any = {},
  V: ?any = {}
> extends React.Component<TypedQueryProps<D, V>> {
  render() {
    const { query, variables, children, fetchPolicy } = this.props
    return (
      <Query
        query={query}
        variables={variables}
        fetchPolicy={fetchPolicy || 'cache-and-network'}
      >
        {({
          loading,
          error,
          data
        }: {
          loading: boolean,
          error: {},
          data: D
        }) => {
          if (loading) {
            return <div>Loading...</div>
          }

          if (error) {
            // send to logger
            return <div>{JSON.stringify(error)}</div>
          }

          return children(data)
        }}
      </Query>
    )
  }
}
